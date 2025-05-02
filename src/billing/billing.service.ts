import { Injectable } from '@nestjs/common';
import { Bill, Prisma } from '@prisma/client';
import axios from 'axios';
import { Bot } from 'grammy';
import { PlayerService } from 'src/players/players.service';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class BillingService {
    constructor(private prisma: PrismaService, private players: PlayerService) { }
    private bot = new Bot(process.env.TELEGRAM_TOKEN || '');

    public sendNOC: (msg: string) => any | Promise<any> = (msg: string) => {
        return this.bot.api.sendMessage(-1002516372304, msg);
    };

    bills(params: {
        skip?: number;
        take?: number;
        cursor?: Prisma.BillWhereUniqueInput;
        where?: Prisma.BillWhereInput;
        orderBy?: Prisma.BillOrderByWithRelationInput;
    }) {
        const { skip, take, cursor, where, orderBy } = params;
        return this.prisma.bill.findMany({
            skip,
            take,
            cursor,
            where,
            orderBy
        });
    }

    bill(id: string) {
        return this.prisma.bill.findUnique({
            where: {
                id
            }
        });
    }

    createBill(data: Prisma.BillUncheckedCreateInput) {
        return this.prisma.bill.create({
            data
        });
    }

    async updateStatus(id: string, status: number) {
        const bill = await this.prisma.bill.update({
            where: {
                id
            },
            data: {
                status
            }
        });

        try {
            const product = await axios.get(`https://content.lampamc.ru/items/Kratos_Products/${bill.product}`);
            await this.processBill(bill, product.data.data, status);
        } catch { }
    }

    async processBill(bill: Bill, product: {
        id: number;
        name: string;
        payload: string;
        price: number;
    }, status: number) {
        const { payload } = product;

        if (status == 1) {
            const bills = await this.prisma.bill.findMany({
                where: {
                    nickname: bill.nickname,
                    status: 1
                }
            });
            const sum = bills.map(x => x.amount).reduce((a, b) => a + b);

            let group = 'default';
            if (sum > 200) group = 'vip';
            if (sum > 500) group = 'vipp';
            if (sum > 1_000) group = 'mvp';
            if (sum > 2_500) group = 'mvpp';
            if (sum > 10_000) group = 'god';
            if (sum > 50_000) group = 'sponsor';

            const player = await this.players.getOrCreate(bill.nickname);
            if (player.group != group) await this.prisma.player.updateMany({
                where: {
                    nickname: player.nickname
                },
                data: {
                    group
                }
            });
        }

        // todo. notify online player with the product
        switch (payload) {
            case 'wl':
                if (status == 1) await this.whitelistPlayer(bill.nickname, 15552000000);
                break;

            case 'wl_mo':
                if (status == 1) await this.whitelistPlayer(bill.nickname, 2592000000);
                break;

            case 'plus_mo':
                if (status == 1) await this.addPlusPlayer(bill.nickname, 2592000000);
                break;

            case 'plus_qua': // QUACK 🦆
                if (status == 1) await this.addPlusPlayer(bill.nickname, 7776000000);
                break;

            case 'wl_half':
                if (status == 1) await this.addPlusPlayer(bill.nickname, 15552000000);
                break;

            case 'noc':
                if (status == 1) await this.sendNOC(`💰 Успешная оплата!
Ник: ${bill.nickname}
Почта: ${bill.email}
Сумма: ${bill.amount / 100}р
Товар: ${product.name}`);
                break;

            default:
                if (status == 1) await this.sendNOC(`⚠️ Успешная оплата с неизвестным payload
                    Ник: ${bill.nickname}
                    Почта: ${bill.email}
                    Сумма: ${bill.amount / 100}р
                    Товар: ${product.name}
                    Payload: ${product.payload}`);
                break;
        }
    }

    public async whitelistPlayer(nickname: string, time: number) {
        const player = await this.prisma.player.findFirst({
            where: { nickname },
        });
        if (!player) {
            return await this.prisma.player.create({
                data: {
                    nickname,
                    whitelisted_until: new Date(Date.now() + time)
                }
            });
        }
        const from = player.whitelisted_until.getTime() >= Date.now() ?
            new Date(player.whitelisted_until.getTime() + time) :
            new Date(Date.now() + time);

        return await this.prisma.player.update({
            where: { nickname },
            data: { whitelisted_until: from }
        });
    }

    public async addPlusPlayer(nickname: string, time: number) {
        const player = await this.prisma.player.findFirst({
            where: { nickname },
        });
        if (!player) {
            return await this.prisma.player.create({
                data: {
                    nickname,
                    plus_until: new Date(Date.now() + time)
                }
            });
        }
        const from = player.plus_until.getTime() >= Date.now() ?
            new Date(player.plus_until.getTime() + time) :
            new Date(Date.now() + time);

        return await this.prisma.player.update({
            where: { nickname },
            data: { plus_until: from }
        });
    }

}

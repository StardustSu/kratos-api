import { Injectable } from '@nestjs/common';
import { Bill, Prisma } from '@prisma/client';
import axios from 'axios';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class BillingService {
    constructor(private prisma: PrismaService) { }

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

        // todo. notify online player with the product
        switch (payload) {
            case 'wl':
                if (status == 1) await this.whitelistPlayer(bill.nickname, 15552000000);
                break;

            case 'wl_mo':
                if (status == 1) await this.whitelistPlayer(bill.nickname, 2592000000);
                break;

            case 'error':
                break;
        }
    }

    private async whitelistPlayer(nickname: string, time: number) {
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

        await this.prisma.player.updateMany({
            where: { nickname },
            data: { whitelisted_until: from }
        });
    }

}

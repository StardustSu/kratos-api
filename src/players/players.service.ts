import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class PlayerService {
    constructor(private prisma: PrismaService) { }

    async getOrCreate(name: string) {
        const player = await this.prisma.player.findFirst({
            where: {
                nickname: name
            }
        });
        if (player) return player;
        return await this.prisma.player.create({
            data: {
                nickname: name
            }
        });
    }

    async getWhitelist(name: string) {
        return (await this.prisma.player.findFirst({
            where: {
                nickname: name
            },
            select: {
                whitelisted_until: true
            }
        }))?.whitelisted_until || {
            getTime: () => {
                return 0;
            }
        };
    }

    async createWhitelistFree(data: {
        nickname: string;
        description: string;
        referral: string;
        contact: string;
    }) {
        const exist = await this.prisma.whitelistOrder.count({
            where: {
                nickname: data.nickname,
                created_at: {
                    gte: new Date(Date.now() - 24 * 60 * 60 * 1000)
                }
            }
        });
        if (exist) return false;
        const order = await this.prisma.whitelistOrder.create({
            data: {
                nickname: data.nickname,
                description: `${data.description}\n\nreferral:\n${data.referral}`,
                contact: data.contact
            }
        });
        return order;
    }

}

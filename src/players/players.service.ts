import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class PlayerService {
    constructor(private prisma: PrismaService) { }

    async getOrCreate(name: string) {
        const player = this.prisma.player.findFirst({
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
        }))?.whitelisted_until || new Date();
    }

}

import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { BillingService } from 'src/billing/billing.service';
import { PlayerService } from 'src/players/players.service';
import { PrismaService } from 'src/prisma.service';

@Controller('/genesis/whitelist')
export class WhitelistController {
    constructor(
        private prisma: PrismaService,
        private players: PlayerService,
        private billing: BillingService
    ) { }

    @Get(":id")
    async get(@Param("id") id: string) {
        return await this.prisma.whitelistOrder.findFirst({
            where: {
                id
            }
        });
    }

    @Post(":id/approve")
    async approve(@Param("id") id: string, @Body() body) {
        const order = await this.prisma.whitelistOrder.update({
            where: { id },
            data: { approved: true }
        });
        await this.billing.whitelistPlayer(order.nickname, Number(body.days) * 86400000);
        return 'ok';
    }

}

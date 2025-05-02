/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { WhitelistController } from './whitelist.controller';
import { PlayersModule } from 'src/players/players.module';
import { BillingService } from 'src/billing/billing.service';
import { PrismaModule } from 'src/prisma.module';
import { TelegramModule } from 'src/telegram.module';
import { PlayerController } from './player.controller';

@Module({
    imports: [PrismaModule, PlayersModule, TelegramModule],
    controllers: [PlayerController, WhitelistController],
    providers: [BillingService],
})
export class GenesisModule { }

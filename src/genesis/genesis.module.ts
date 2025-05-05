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
import { StatsController } from './stats.controller';
import { ContainersController } from './containers.controller';
import { WorldsController } from './worlds.controller';

@Module({
    imports: [PrismaModule, PlayersModule, TelegramModule],
    controllers: [PlayerController, WhitelistController, StatsController, ContainersController,
        WorldsController
    ],
    providers: [BillingService],
})
export class GenesisModule { }

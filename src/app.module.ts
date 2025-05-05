import { AppController } from './app.controller';
import { StatsController } from './genesis/stats.controller';
import { PlayerController } from './genesis/player.controller';
import { TelegramModule } from './telegram.module';
import { InfoModule } from './info/info.module';
import { WhitelistController } from './genesis/whitelist.controller';
import { GenesisModule } from './genesis/genesis.module';
import { AppService } from './app.service';
import { PlayersModule } from './players/players.module';
import { CacheModule } from '@nestjs/cache-manager';
import { BillingModule } from './billing/billing.module';
import { PrismaModule } from './prisma.module';
import { Module } from '@nestjs/common';
import * as redisStore from 'cache-manager-redis-store';
import { TelegramService } from './telegram.service';
import { BillingService } from './billing/billing.service';

@Module({
  imports: [
    TelegramModule,
    CacheModule.register({
      store: redisStore,
      host: 'ai.lampamc.ru', // Redis server host
      port: 6379, // Redis server port
      ttl: 1000, // Cache expiration time
      max: 50, // Maximum number of items in cache
      isGlobal: true,
    }),
    PrismaModule,
    TelegramModule,
    BillingModule,
    PlayersModule,
    GenesisModule,
    InfoModule,
  ],
  controllers: [
    AppController,
  ],
  providers: [
    BillingService,
    AppService,
  ],
  exports: [
  ]
})
export class AppModule { }

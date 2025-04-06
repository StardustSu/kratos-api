import { PlayersModule } from './players/players.module';
import { CacheModule } from '@nestjs/cache-manager';
import { BillingModule } from './billing/billing.module';
import { PrismaModule } from './prisma.module';
import { Module } from '@nestjs/common';
import * as redisStore from 'cache-manager-redis-store';

@Module({
  imports: [
    CacheModule.register({
      store: redisStore,
      host: 'ai.lampamc.ru', // Redis server host
      port: 6379, // Redis server port
      ttl: 1000, // Cache expiration time
      max: 50, // Maximum number of items in cache
      isGlobal: true,
    }),
    PrismaModule,
    BillingModule,
    PlayersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }

import { BillingController } from './billing.controller';
import { Module } from '@nestjs/common';
import { BillingService } from './billing.service';
import { YookassaService } from './yookassa.service';
import { YookassaController } from './yookassa.controller';
import { PrismaModule } from 'src/prisma.module';
import { PlayersModule } from 'src/players/players.module';
import { TelegramModule } from 'src/telegram/telegram.module';
import { PlayerService } from 'src/players/players.service';

@Module({
    imports: [PrismaModule],
    providers: [BillingService, YookassaService, PlayerService],
    controllers: [BillingController, YookassaController],
    exports: [BillingService],
})
export class BillingModule { }

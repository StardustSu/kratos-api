import { PlayerService } from './players.service';
import { PlayersController } from './players.controller';
import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma.module';
import { TelegramModule } from 'src/telegram/telegram.module';

@Module({
    imports: [PrismaModule, TelegramModule],
    controllers: [PlayersController],
    providers: [PlayerService],
    exports: [PlayerService]
})
export class PlayersModule { }

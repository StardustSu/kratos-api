import { PlayerService } from './players.service';
import { PlayersController } from './players.controller';
import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma.module';

@Module({
    imports: [PrismaModule],
    controllers: [PlayersController],
    providers: [PlayerService],
})
export class PlayersModule { }

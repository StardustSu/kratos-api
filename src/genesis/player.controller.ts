/*
https://docs.nestjs.com/controllers#controllers
*/

import { Controller, Get, Param } from '@nestjs/common';
import { PlayerService } from 'src/players/players.service';

@Controller("/genesis/player")
export class PlayerController {
    constructor(private players: PlayerService) { }

    @Get("/:name")
    async player(@Param("name") name: string) {
        const player = await this.players.getOrCreate(name);
        return {
            id: player.id,
            nickname: player.nickname,
            balance: player.balance,
            whitelisted_until: player.whitelisted_until.getTime(),
            plus_until: player.plus_until.getTime(),
            group: player.group
        };
    }
}

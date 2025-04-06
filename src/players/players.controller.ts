import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';
import { Controller, Get, Param, UseInterceptors } from '@nestjs/common';
import { PlayerService } from './players.service';

@Controller('/users')
@UseInterceptors(CacheInterceptor)
export class PlayersController {
    constructor(private players: PlayerService) { }

    @Get(":name/check_wl")
    @CacheTTL(30000)
    async checkWhitelist(@Param('name') name: string) {
        const wl = await this.players.getWhitelist(name);
        return {
            whitelist: wl.getTime() >= Date.now()
        };
    }

    @Get(":name/whitelist")
    @CacheTTL(30000)
    async getWhitelist(@Param('name') name: string) {
        return {
            whitelisted_until: (await this.players.getWhitelist(name)).getTime()
        };
    }

}

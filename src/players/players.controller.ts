import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';
import { Body, Controller, Get, Param, Post, UseInterceptors } from '@nestjs/common';
import { PlayerService } from './players.service';
import { get } from 'http';
import { TelegramService } from 'src/telegram.service';

@Controller('/players')
@UseInterceptors(CacheInterceptor)
export class PlayersController {
    constructor(private players: PlayerService, private telegram: TelegramService) { }

    @Get(":name/check_wl")
    @CacheTTL(30_000)
    async checkWhitelist(@Param('name') name: string) {
        const wl = await this.players.getWhitelist(name);
        return {
            whitelist: wl.getTime() >= Date.now()
        };
    }

    @Get(":name/whitelist")
    @CacheTTL(30_000)
    async getWhitelist(@Param('name') name: string) {
        return {
            whitelisted_until: (await this.players.getWhitelist(name)).getTime()
        };
    }

    @Post(":name/whitelist/free")
    @CacheTTL(1800_000)
    async freeWhitelist(@Body() body) {
        const player = await this.players.getOrCreate(body.nickname);
        const order = await this.players.createWhitelistFree(body);
        if (order) {
            this.telegram.sendNOC(`💅🏻 Free заявка на ВЛ
<b>Ник:</b> ${player?.nickname}

${order.description}

<b>Контакт:</b> ${order.contact}
<a href="https://kratosmc.ru/genesis/whitelist/${order.id}">Заявка в Genesis</a>`)
        }
        return { ok: order && order.id };
    }

}

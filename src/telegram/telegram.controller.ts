/*
https://docs.nestjs.com/controllers#controllers
*/

import { Controller, HttpCode, Post, Req } from '@nestjs/common';
import { TelegramService } from './telegram.service';

@Controller('/tg')
export class TelegramController {
    constructor(private telegram: TelegramService) { }

    @Post('/hook')
    @HttpCode(200)
    async webhook(@Req() req) {
        await this.telegram.getBot().handleUpdate(req.body);
    }
}

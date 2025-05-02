/*
https://docs.nestjs.com/controllers#controllers
*/

import { Body, Controller, Get, Post } from '@nestjs/common';
import { InfoService } from './info.service';

@Controller('/info')
export class InfoController {
    constructor(private info: InfoService) { }

    @Get("/online")
    online() {
        return {
            online: this.info.getCurrentOnline()
        }
    }

    @Post('/online')
    setOnline(@Body("online") online: number) {
        this.info.setCurrentOnline(Number(online) || -1);
        return { ok: true };
    }

}

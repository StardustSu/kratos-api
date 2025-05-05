/*
https://docs.nestjs.com/controllers#controllers
*/

import { Controller, Get, HttpCode } from '@nestjs/common';

@Controller("/")
export class AppController {
    @Get("/")
    @HttpCode(200)
    health() {
        return { ok: true };
    }
}

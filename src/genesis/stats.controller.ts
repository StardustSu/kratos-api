/*
https://docs.nestjs.com/controllers#controllers
*/

import { Controller, Post } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Controller("/genesis/stats")
export class StatsController {
    constructor(private prisma: PrismaService) { }

    @Post("/online")
    async onlineStat() {

    }
}

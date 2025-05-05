/*
https://docs.nestjs.com/controllers#controllers
*/

import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Controller("/genesis/worlds")
export class WorldsController {
    constructor(private prisma: PrismaService) { }

    @Get("/")
    async fetchList() {
        return (await this.prisma.slimeWorld.findMany()).map(x => x.name);
    }

    @Post("/")
    async createOne(@Body() data) {
        return await this.prisma.slimeWorld.create({ data });
    }

    @Get("/:id")
    async fetch(@Param("id") name: string) {
        return await this.prisma.slimeWorld.findUnique({ where: { name } });
    }
}

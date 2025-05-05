/*
https://docs.nestjs.com/controllers#controllers
*/

import { Body, Controller, Get, Header, InternalServerErrorException, Post, RawBody, RawBodyRequest, Req } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Controller('/genesis/containers')
export class ContainersController {
    constructor(private prisma: PrismaService) { }

    private containersCache = "";

    @Post('/cache')
    async saveContainersState(@Body("data") data) {
        if (!data) throw new InternalServerErrorException("Couldn't get body.");
        await this.prisma.containerData.create({
            data: {
                data: data
            }
        });
        this.containersCache = data;
        return { ok: true };
    }

    @Get('/cache')
    @Header('Content-Type', 'text/plain')
    async getContainersState() {
        if (this.containersCache.length < 2) {
            this.containersCache = (await this.prisma.containerData.findFirst({
                orderBy: {
                    created_at: 'desc',
                    id: 'desc'
                }
            }))?.data || "";
        }
        return this.containersCache;
    }
}

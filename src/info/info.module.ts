import { InfoController } from './info.controller';
import { InfoService } from './info.service';
/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';

@Module({
    imports: [],
    controllers: [
        InfoController,],
    providers: [
        InfoService,],
})
export class InfoModule { }

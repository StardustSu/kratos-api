import { TelegramController } from './telegram.controller';
/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { BillingModule } from '../billing/billing.module';
import { TelegramService } from './telegram.service';

@Module({
    imports: [
        BillingModule
    ],
    controllers: [
        TelegramController,],
    providers: [
        // BillingService,
        TelegramService
    ],
    exports: [
        TelegramService
    ]
})
export class TelegramModule { }

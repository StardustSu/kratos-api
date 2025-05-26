import { Injectable, OnModuleInit } from '@nestjs/common';
import { TelegramService } from './telegram/telegram.service';

@Injectable()
export class AppService implements OnModuleInit {
    constructor(private telegram: TelegramService) { }

    onModuleInit() {
        console.log("should be once")
        this.telegram.run();
    }
}

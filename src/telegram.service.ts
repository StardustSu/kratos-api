import { Injectable, OnModuleInit } from "@nestjs/common";
import { Bot } from "grammy";
import { BillingService } from "./billing/billing.service";

@Injectable()
export class TelegramService implements OnModuleInit {
    constructor(private billing: BillingService) { }
    private bot: Bot;
    private go = false;

    private static NOC = Number(process.env.NOC_CHAT_ID) || -1002516372304;

    async onModuleInit() {
        this.bot = new Bot(process.env.TELEGRAM_TOKEN || '');

        this.bot.hears(/^$/miu, async ctx => {
            if (ctx.chat?.id != TelegramService.NOC) return;
        });

        this.bot.hears(/^\/whitelist ([a-zA-Z0-9_]+) (-?\d+)d$/miu, async ctx => {
            if (ctx.chat?.id != TelegramService.NOC) return;
            const d = Number(ctx.match[2]);
            const p = await this.billing.whitelistPlayer(ctx.match[1], d * 24 * 60 * 60 * 1000);
            await this.sendNOC(`Whitelisted <code>${ctx.match[1]}</code> for ${d} days
Now whitelisted until: ${p.whitelisted_until.toLocaleDateString()}`);
        });

        this.bot.hears(/^\/plus ([a-zA-Z0-9_]+) (-?\d+)d$/miu, async ctx => {
            if (ctx.chat?.id != TelegramService.NOC) return;
            const d = Number(ctx.match[2]);
            const p = await this.billing.addPlusPlayer(ctx.match[1], d * 24 * 60 * 60 * 1000);
            await this.sendNOC(`Added Kratos+ <code>${ctx.match[1]}</code> for ${d} days
Now Plus until: ${p.plus_until.toLocaleDateString()}`);
        });

        if (this.go) { this.bot.start(); console.log("tg run"); }
    }

    sendMessage(chat: number, msg: string) {
        return this.bot.api.sendMessage(chat, msg, {
            parse_mode: 'HTML', link_preview_options: {
                is_disabled: true
            }
        });
    }

    sendNOC(msg: string) {
        return this.sendMessage(TelegramService.NOC, msg);
    }

    run() {
        if (this.bot) {
            this.bot.start().catch(ex => {
                this.sendNOC("Exception occured! Retrying in 10...")
                console.log("!! TG RETRY !!");
                setTimeout(this.run, 10_000);
            });
            console.log("tg run");
            this.sendNOC("Running listeners!")
        }
        else this.go = true;
    }
}
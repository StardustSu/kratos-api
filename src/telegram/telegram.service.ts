import { Injectable, OnModuleInit } from "@nestjs/common";
import { Bot } from "grammy";
import { BillingService } from "../billing/billing.service";
import axios from "axios";

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

        this.bot.hears(/^\/tags (.+)$/miu, async ctx => {
            const name = ctx.match[1];
            axios.get(`https://registry.lampamc.ru/v2/${name}/tags/list`).then(res => {
                ctx.reply(`<code>registry.lampamc.ru/${name}</code>
Tags:
<i>${res.data.tags.join("\n")}</i>`, { parse_mode: 'HTML' });
            });
        });

        if (process.env.TELEGRAM_POLLING == "1") {
            if (this.go) { this.bot.start(); console.log("tg run"); }
        } else this.registerWebhook();
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
        if (process.env.TELEGRAM_POLLING == "1") {
            this.bot.api.deleteWebhook();
            console.log("!! run() exec");
            if (this.bot) {
                console.log("!! trying to run xx listener");
                console.log("!! trying to run xx listener");
                console.log("!! trying to run xx listener");
                this.bot.start().catch(ex => {
                    console.log("!! ERROR: there is already another listener, retry in 10");
                    console.log("!! ERROR: there is already another listener, retry in 10");
                    console.log("!! ERROR: there is already another listener, retry in 10");
                    setTimeout(this.run, 10_000);
                });
                console.log("run");
                // this.sendNOC("Running listeners!")
            }
            else this.go = true;
        } else this.registerWebhook();
    }

    registerWebhook() {
        this.bot.init().then(() => {
            try {
                this.bot.api.setWebhook("https://api.kratosmc.ru/tg/hook").catch(() => console.log("Could not set da webhook :c"));
            } catch (ex) {
                console.log("Could not set da webhook :c");
            }
        });
    }

    getBot() {
        return this.bot;
    }
}
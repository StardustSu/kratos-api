import { Body, Controller, Get, Param, Post, Query, Redirect, UseInterceptors } from '@nestjs/common';
import { YookassaService } from './yookassa.service';
import axios, { AxiosResponse } from 'axios';
import { BillingService } from './billing.service';
import { Bill } from '@prisma/client';
import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';

@Controller('billing')
@UseInterceptors(CacheInterceptor)
export class BillingController {
    constructor(
        private yookassa: YookassaService,
        private billing: BillingService,
    ) { }

    @Get('pay')
    @Redirect("https://kratosmc.ru/error?code=ERR_UNKNOWN", 307)
    async pay(
        @Query("product") productIdStr: string,
        @Query("email") email: string,
        @Query("nickname") nickname: string,
    ) {
        let product: AxiosResponse<any, any>;
        try {
            product = await axios.get(`https://content.lampamc.ru/items/Kratos_Products/${productIdStr}`);
        } catch {
            return { url: "https://kratosmc.ru/error?code=ERR_NO_PRODUCT" };
        }
        if (product.status != 200) return { url: "https://kratosmc.ru/error?code=ERR_NO_PRODUCT" };

        const bill = await this.billing.createBill({
            amount: product.data.data.price,
            email,
            nickname,
            product: Number(productIdStr),
            status: 0,
            payload: product.data.data.payload
        });

        const yoo = await this.yookassa.createPayment(
            bill.id,
            String(product.data.data.price / 100),
            `${product.data.data.name} | ${nickname}`,
            email,
            `https://kratosmc.ru/bill/${bill.id}`
        );
        return {
            url: yoo.confirmation.confirmation_url
        };
    }

    @Get(':bill/status')
    @CacheTTL(15000)
    async status(@Param('bill') id: string) {
        const bill = await this.billing.bill(id);

        return {
            status: bill?.status || 0
        };
    }

}

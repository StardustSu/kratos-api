import { Injectable, InternalServerErrorException } from '@nestjs/common';
import axios from 'axios';
import { randomUUID } from 'crypto';
import { config } from 'dotenv';
config();

@Injectable()
export class YookassaService {
    private shopId = process.env.YOOKASSA_ID;
    private secret = process.env.YOOKASSA_SECRET;

    async createPayment(id: string, amount: string, description: string, email: string, redirect?: string) {
        try {
            const url = 'https://api.yookassa.ru/v3/payments';
            const data = {
                amount: {
                    value: amount,
                    currency: 'RUB'
                },
                confirmation: {
                    type: 'redirect',
                    return_url: redirect ?? 'https://kratosmc.ru/error'
                },
                description: description,
                capture: true,
                metadata: {
                    ok: true,
                    id,
                    email,
                    amount
                },
                receipt: {
                    customer: {
                        email: email
                    },
                    items: [
                        {
                            description: description,
                            quantity: '1',
                            amount: {
                                value: amount,
                                currency: 'RUB'
                            },
                            measure: 'another',
                            payment_subject: 'payment',
                            payment_mode: 'full_payment',
                            vat_code: '1'
                        }
                    ],
                    tax_system_code: 2
                }
            };
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': 'Basic ' + Buffer.from(this.shopId + ':' + this.secret).toString('base64'),
                'Idempotence-Key': randomUUID()
            };
            const res = await axios.post(url, data, { headers: headers }).catch(void 0);

            if (res.status != 200) throw new InternalServerErrorException('YooKassa internal error');

            return res.data;
        } catch (ex) {
            throw new InternalServerErrorException('YooKassa internal error');
        }
    }
}

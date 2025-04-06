import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { BillingService } from './billing.service';

@Controller('/yookssa-0257836')
export class YookassaController {
    constructor(
        private billing: BillingService,
    ) { }

    @Post()
    @HttpCode(200)
    async post(@Body() data) {
        if (data.event == 'payment.succeeded') {
            const meta = data.object.metadata;
            if (!meta.ok) return 'ok';

            const { id } = meta;
            if (!id) return 'ok';

            await this.billing.updateStatus(id, 1);
        }
        if (data.event == 'payment.canceled') {
            const meta = data.object.metadata;
            if (!meta.ok) return 'ok';

            const { id } = meta;
            if (!id) return 'ok';

            await this.billing.updateStatus(id, 2);
        }
        return 'ok';
    }
}

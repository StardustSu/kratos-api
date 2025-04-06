import { BillingController } from './billing.controller';
import { Module } from '@nestjs/common';
import { BillingService } from './billing.service';
import { YookassaService } from './yookassa.service';
import { YookassaController } from './yookassa.controller';
import { PrismaModule } from 'src/prisma.module';

@Module({
    imports: [PrismaModule],
    providers: [BillingService, YookassaService],
    controllers: [BillingController, YookassaController],
})
export class BillingModule { }

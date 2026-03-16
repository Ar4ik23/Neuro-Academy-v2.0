import { Controller, Post, Body } from '@nestjs/common';
import { PaymentsService } from './payments.service';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('webhook')
  async webhook(@Body() payload: any) {
    const { userId, courseId, amount, currency, providerTxId } = payload;
    return this.paymentsService.processPurchase(userId, courseId, amount, currency, providerTxId);
  }
}

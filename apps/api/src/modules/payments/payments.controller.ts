import { Controller, Post, Body, Req } from '@nestjs/common';
import { PaymentsService } from './payments.service';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('create-invoice')
  async createInvoice(@Req() req: any, @Body('courseId') courseId: string) {
    const userId = req.user.sub;
    return this.paymentsService.createInvoice(userId, courseId);
  }

  @Post('webhook')
  async webhook(@Body() payload: any) {
    return this.paymentsService.handleWebhook(payload);
  }
}

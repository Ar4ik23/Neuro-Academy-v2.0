import { Controller, Post, Get, Body, Param, Req, UseGuards } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  /** Создать инвойс в @CryptoPay и вернуть ссылку */
  @UseGuards(JwtAuthGuard)
  @Post('cryptopay/invoice/:courseId')
  async createInvoice(@Param('courseId') courseId: string, @Req() req: any) {
    const user = req.user;
    const payUrl = await this.paymentsService.createCryptoPayInvoice(
      user.id,
      courseId,
      user.telegramId.toString(),
    );
    return { payUrl };
  }

  /** Статус оплаты — поллинг с фронта каждые 10 секунд */
  @UseGuards(JwtAuthGuard)
  @Get('status/:courseId')
  async getStatus(@Param('courseId') courseId: string, @Req() req: any) {
    const status = await this.paymentsService.getPaymentStatus(req.user.id, courseId);
    return { status };
  }

  /** Legacy webhook (оставлен для совместимости) */
  @Post('webhook')
  async webhook(@Body() payload: any) {
    const { userId, courseId, amount, currency, providerTxId } = payload;
    return this.paymentsService.processPurchase(userId, courseId, amount, currency, providerTxId);
  }
}

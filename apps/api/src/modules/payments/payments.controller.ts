import { Controller, Post, Get, Body, Param, Req, UseGuards, Headers, UnauthorizedException } from '@nestjs/common';
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

  /** Уведомление об оплате от пользователя (без авторизации) */
  @Post('notify')
  async manualNotify(@Body() body: { username: string; network: string; courseId: string }) {
    const notification = this.paymentsService.addManualNotification(
      body.username,
      body.network,
      body.courseId,
    );
    return { success: true, id: notification.id };
  }

  /** Список заявок на VIP (только для админа) */
  @Get('admin/pending')
  async adminPending(@Headers('x-admin-secret') secret: string) {
    const adminSecret = process.env.ADMIN_SECRET;
    if (!adminSecret || secret !== adminSecret) {
      throw new UnauthorizedException('Invalid admin secret');
    }
    return this.paymentsService.getManualNotifications();
  }

  /** Выдать VIP по username (только для админа) */
  @Post('admin/grant-vip')
  async adminGrantVip(
    @Headers('x-admin-secret') secret: string,
    @Body() body: { username?: string; telegramId?: string; courseId: string; notificationId?: string },
  ) {
    const adminSecret = process.env.ADMIN_SECRET;
    if (!adminSecret || secret !== adminSecret) {
      throw new UnauthorizedException('Invalid admin secret');
    }
    if (body.username) {
      await this.paymentsService.grantVipByUsername(body.username, body.courseId, body.notificationId);
    } else if (body.telegramId) {
      await this.paymentsService.grantVipByTelegramId(body.telegramId, body.courseId);
    } else {
      throw new UnauthorizedException('username или telegramId обязателен');
    }
    return { success: true };
  }
}

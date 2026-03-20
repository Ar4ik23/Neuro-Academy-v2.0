import { Injectable, Logger, OnModuleDestroy, OnModuleInit, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { EnrollmentsService } from '../enrollments/enrollments.service';
import { TelegramService } from '../telegram/telegram.service';
import { EnrollmentType } from '@prisma/client';

const PRICE_USDT = 49;
const CRYPTO_PAY_API = 'https://pay.crypt.bot/api';
const POLL_INTERVAL_MS = 30_000;

interface PendingInvoice {
  invoiceId: number;
  userId: string;
  courseId: string;
  telegramId: string;
}

export interface ManualPaymentNotification {
  id: string;
  username: string;
  telegramId?: string;
  network: string;
  courseId: string;
  createdAt: Date;
}

@Injectable()
export class PaymentsService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PaymentsService.name);
  private readonly cryptoPayToken = process.env.CRYPTO_PAY_TOKEN ?? '';
  // key: invoiceId
  private pending = new Map<number, PendingInvoice>();
  private pollTimer: NodeJS.Timeout | null = null;
  // Manual payment notifications (in-memory)
  private manualNotifications: ManualPaymentNotification[] = [];
  // VIP activation tokens: token → courseId
  private vipTokens = new Map<string, string>();

  constructor(
    private prisma: PrismaService,
    private enrollmentsService: EnrollmentsService,
    private telegramService: TelegramService,
  ) {}

  onModuleInit() {
    if (!this.cryptoPayToken) {
      this.logger.warn('CRYPTO_PAY_TOKEN not set — CryptoPay payments disabled');
      return;
    }
    this.pollTimer = setInterval(() => this.pollPendingInvoices(), POLL_INTERVAL_MS);
    this.logger.log('CryptoPay polling started (30s interval)');
  }

  onModuleDestroy() {
    if (this.pollTimer) clearInterval(this.pollTimer);
  }

  async processPurchase(
    userId: string,
    courseId: string,
    amount: number,
    currency: string,
    providerTxId?: string,
  ) {
    const purchase = await this.prisma.purchase.create({
      data: { userId, courseId, amount, currency, status: 'COMPLETED', providerTxId },
    });
    await this.enrollmentsService.grantAccess(userId, courseId, EnrollmentType.PURCHASED);
    return purchase;
  }

  async createCryptoPayInvoice(
    userId: string,
    courseId: string,
    telegramId: string,
  ): Promise<string> {
    if (!this.cryptoPayToken) throw new Error('CRYPTO_PAY_TOKEN не настроен');

    const res = await fetch(`${CRYPTO_PAY_API}/createInvoice`, {
      method: 'POST',
      headers: {
        'Crypto-Pay-API-Token': this.cryptoPayToken,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        asset: 'USDT',
        amount: String(PRICE_USDT),
        description: 'VIP-доступ к курсу Neuro Academy',
        payload: `${userId}:${courseId}:${telegramId}`,
        allow_comments: false,
        allow_anonymous: false,
        expires_in: 3600,
      }),
    });

    const data = (await res.json()) as any;
    if (!data.ok) throw new Error(data.error?.name ?? 'CryptoPay API error');

    const invoice = data.result;
    this.pending.set(invoice.invoice_id, {
      invoiceId: invoice.invoice_id,
      userId,
      courseId,
      telegramId,
    });
    this.logger.log(`CryptoPay invoice created: id=${invoice.invoice_id} user=${userId}`);

    return invoice.pay_url as string;
  }

  addManualNotification(username: string, network: string, courseId: string, telegramId?: string): ManualPaymentNotification {
    const notification: ManualPaymentNotification = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      username,
      telegramId,
      network,
      courseId,
      createdAt: new Date(),
    };
    this.manualNotifications.unshift(notification);
    this.logger.log(`Manual payment notification: @${username} network=${network}`);
    return notification;
  }

  getManualNotifications(): ManualPaymentNotification[] {
    return this.manualNotifications;
  }

  removeManualNotification(id: string): void {
    this.manualNotifications = this.manualNotifications.filter(n => n.id !== id);
  }

  generateVipToken(courseId: string): string {
    const token = Math.random().toString(36).slice(2, 10).toUpperCase();
    this.vipTokens.set(token, courseId);
    // Токен действует 7 дней
    setTimeout(() => this.vipTokens.delete(token), 7 * 24 * 60 * 60 * 1000);
    this.logger.log(`VIP activation token generated: ${token} for courseId=${courseId}`);
    return token;
  }

  activateVipToken(token: string): string | null {
    const courseId = this.vipTokens.get(token);
    if (courseId) this.vipTokens.delete(token);
    return courseId ?? null;
  }

  async grantVipByTelegramId(telegramId: string, courseId: string): Promise<void> {
    const numId = BigInt(telegramId);
    if (numId <= 0n) throw new NotFoundException(`Telegram ID должен быть положительным числом. Личный ID всегда > 0.`);
    let user = await this.prisma.user.findUnique({ where: { telegramId: numId } });
    if (!user) {
      user = await this.prisma.user.create({
        data: { telegramId: numId, firstName: 'User' },
      });
      this.logger.log(`Auto-created user for telegramId=${telegramId}`);
    }
    await this.enrollmentsService.grantAccess(user.id, courseId, EnrollmentType.ADMIN_GRANT);
    this.logger.log(`VIP granted: telegramId=${telegramId} courseId=${courseId}`);
    try {
      await this.telegramService.sendMessage(
        telegramId,
        `✅ *VIP-доступ активирован!*\n\nОплата получена. Все модули курса теперь открыты.\n\n📱 Открой приложение и продолжай обучение!`,
      );
    } catch {
      // Telegram уведомление необязательно
    }
  }

  async grantVipByUsername(username: string, courseId: string, notificationId?: string): Promise<void> {
    const cleanUsername = username.replace('@', '').toLowerCase();
    const user = await this.prisma.user.findFirst({
      where: { username: { equals: cleanUsername, mode: 'insensitive' } },
    });
    if (!user) throw new NotFoundException(`Пользователь @${cleanUsername} не найден в базе. Попроси его открыть приложение через Telegram.`);
    await this.enrollmentsService.grantAccess(user.id, courseId, EnrollmentType.ADMIN_GRANT);
    this.logger.log(`VIP granted: username=@${cleanUsername} courseId=${courseId}`);
    if (notificationId) this.removeManualNotification(notificationId);
    try {
      await this.telegramService.sendMessage(
        user.telegramId.toString(),
        `✅ *VIP-доступ активирован!*\n\nОплата получена. Все модули курса теперь открыты.\n\n📱 Открой приложение и продолжай обучение!`,
      );
    } catch {
      // Telegram уведомление необязательно
    }
  }

  async getPaymentStatus(userId: string, courseId: string): Promise<'completed' | 'pending'> {
    const purchase = await this.prisma.purchase.findFirst({
      where: { userId, courseId, status: 'COMPLETED' },
    });
    return purchase ? 'completed' : 'pending';
  }

  private async pollPendingInvoices() {
    if (this.pending.size === 0) return;

    const ids = Array.from(this.pending.keys()).join(',');
    try {
      const res = await fetch(
        `${CRYPTO_PAY_API}/getInvoices?invoice_ids=${ids}&status=paid`,
        { headers: { 'Crypto-Pay-API-Token': this.cryptoPayToken } },
      );
      if (!res.ok) return;
      const data = (await res.json()) as any;
      const paidInvoices: any[] = data.result?.items ?? [];

      for (const inv of paidInvoices) {
        const payment = this.pending.get(inv.invoice_id);
        if (!payment) continue;

        this.pending.delete(inv.invoice_id);

        // Idempotency check
        const existing = await this.prisma.purchase.findFirst({
          where: { providerTxId: String(inv.invoice_id) },
        });
        if (existing) continue;

        try {
          await this.processPurchase(
            payment.userId,
            payment.courseId,
            PRICE_USDT,
            'USDT',
            String(inv.invoice_id),
          );
          this.logger.log(`CryptoPay paid: invoice=${inv.invoice_id} user=${payment.userId}`);

          await this.telegramService.sendMessage(
            payment.telegramId,
            `✅ *VIP-доступ активирован!*\n\nОплата ${PRICE_USDT} USDT получена. Все модули курса теперь открыты.\n\n📱 Открой приложение и продолжай обучение!`,
          );
        } catch (e: any) {
          this.logger.error(`Failed to process invoice ${inv.invoice_id}: ${e?.message}`);
          // Вернуть в очередь чтобы повторить
          this.pending.set(payment.invoiceId, payment);
        }
      }
    } catch (e: any) {
      this.logger.error(`CryptoPay poll error: ${e?.message}`);
    }
  }
}

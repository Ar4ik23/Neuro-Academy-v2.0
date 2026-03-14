import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { EnrollmentsService } from '../enrollments/enrollments.service';
import { EnrollmentType } from '@prisma/client';

@Injectable()
export class PaymentsService {
  constructor(
    private prisma: PrismaService,
    private enrollmentsService: EnrollmentsService,
  ) {}

  async createInvoice(userId: string, courseId: string) {
    const course = await this.prisma.course.findUnique({ where: { id: courseId } });
    if (!course) throw new Error('Course not found');

    // Create a pending purchase record
    const purchase = await this.prisma.purchase.create({
      data: {
        userId,
        courseId,
        amount: course.price,
        currency: 'XTR', // Telegram Stars
        status: 'PENDING',
      },
    });

    // In a real scenario, we would interact with Telegram Bot API here to get an invoice link
    return {
      invoiceUrl: `https://t.me/invoice_placeholder_${purchase.id}`,
      purchaseId: purchase.id,
    };
  }

  async handleWebhook(payload: any) {
    // Basic webhook logic (placeholder)
    const { purchaseId, status, providerTxId } = payload;

    if (status === 'COMPLETED') {
      const purchase = await this.prisma.purchase.update({
        where: { id: purchaseId },
        data: { status: 'COMPLETED', providerTxId },
      });

      // Grant enrollment access
      await this.enrollmentsService.grantAccess(purchase.userId, purchase.courseId, EnrollmentType.PURCHASE);
    }

    return { success: true };
  }
}

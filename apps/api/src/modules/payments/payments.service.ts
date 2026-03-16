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

  async processPurchase(userId: string, courseId: string, amount: number, currency: string, providerTxId?: string) {
    // 1. Record the payment (Rule 9)
    const purchase = await this.prisma.purchase.create({
      data: {
        userId,
        courseId,
        amount,
        currency,
        status: 'COMPLETED',
        providerTxId,
      },
    });

    // 2. Grant access separately (Rule 9)
    await this.enrollmentsService.grantAccess(userId, courseId, EnrollmentType.PURCHASED);

    return purchase;
  }
}

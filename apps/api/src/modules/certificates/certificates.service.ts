import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class CertificatesService {
  constructor(private prisma: PrismaService) {}

  async findByUser(userId: string) {
    return this.prisma.certificate.findMany({
      where: { userId },
      include: { course: true },
    });
  }

  async generateCertificate(userId: string, courseId: string) {
    // Check if already exists
    const existing = await this.prisma.certificate.findFirst({
      where: { userId, courseId },
    });
    if (existing) return existing;

    // Placeholder for PDF generation logic
    const certificateUrl = `https://storage.neuro-academy.com/certs/${userId}-${courseId}.pdf`;

    return this.prisma.certificate.create({
      data: {
        userId,
        courseId,
        certificateUrl,
      },
    });
  }
}

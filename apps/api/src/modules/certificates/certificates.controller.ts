import { Controller, Get, Post, Param, Req } from '@nestjs/common';
import { CertificatesService } from './certificates.service';

@Controller('certificates')
export class CertificatesController {
  constructor(private readonly certificatesService: CertificatesService) {}

  @Get()
  async getMyCertificates(@Req() req: any) {
    const userId = req.user.sub;
    return this.certificatesService.findByUser(userId);
  }

  @Post('issue/:courseId')
  async issue(@Req() req: any, @Param('courseId') courseId: string) {
    const userId = req.user.sub;
    return this.certificatesService.generateCertificate(userId, courseId);
  }
}

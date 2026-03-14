import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AIService {
  constructor(private prisma: PrismaService) {}

  async processRequest(userId: string, data: { contextText: string; prompt: string; selection?: string }) {
    // Placeholder for actual LLM integration
    const response = `AI analysis for: "${data.selection || 'this context'}". [LLM Placeholder Response]`;

    const requestLog = await this.prisma.aIRequest.create({
      data: {
        userId,
        contextText: data.contextText,
        prompt: data.prompt,
        response,
      },
    });

    return requestLog;
  }
}

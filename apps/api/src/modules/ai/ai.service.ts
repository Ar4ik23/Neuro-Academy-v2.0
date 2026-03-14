import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AIExplainDto, AIResponseDto } from '@neuro-academy/types';

@Injectable()
export class AIService {
  constructor(private prisma: PrismaService) {}

  async explainText(userId: string, dto: AIExplainDto): Promise<AIResponseDto> {
    // Mocking LLM response for now
    const mockResponse = `This is a mock AI explanation for: "${dto.highlightedText}" within the context of the lesson. In a real scenario, this would call OpenAI/Anthropic API.`;

    // Log the request
    await this.prisma.aIRequest.create({
      data: {
        userId,
        contextText: dto.contextText,
        prompt: `Explain this highlighted text: ${dto.highlightedText}`,
        response: mockResponse,
      },
    });

    return { response: mockResponse };
  }
}

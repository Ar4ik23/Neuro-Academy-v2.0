import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { AIService } from './ai.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AIExplainDto, AIResponseDto } from '@neuro-academy/types';

@Controller('ai')
@UseGuards(JwtAuthGuard)
export class AIController {
  constructor(private readonly aiService: AIService) {}

  @Post('explain')
  async explain(@Req() req: any, @Body() dto: AIExplainDto): Promise<AIResponseDto> {
    return this.aiService.explainText(req.user.id, dto);
  }
}

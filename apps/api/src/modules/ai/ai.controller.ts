import { Controller, Post, Body, Req } from '@nestjs/common';
import { AIService } from './ai.service';

@Controller('ai')
export class AIController {
  constructor(private readonly aiService: AIService) {}

  @Post('request')
  async requestAssistant(@Req() req: any, @Body() data: { contextText: string; prompt: string; selection?: string }) {
    const userId = req.user.sub;
    return this.aiService.processRequest(userId, data);
  }
}

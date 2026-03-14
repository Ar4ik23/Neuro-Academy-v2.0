import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as crypto from 'crypto';
import { PrismaService } from '../../prisma/prisma.service';
import { AuthResponseDto, TelegramUser } from '@neuro-academy/types';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async validateTelegramData(initData: string): Promise<TelegramUser> {
    const BOT_TOKEN = process.env.BOT_TOKEN;
    if (!BOT_TOKEN) {
      throw new Error('BOT_TOKEN is not defined in environment variables');
    }

    const urlParams = new URLSearchParams(initData);
    const hash = urlParams.get('hash');
    urlParams.delete('hash');

    const params = Array.from(urlParams.entries())
      .map(([key, value]) => `${key}=${value}`)
      .sort()
      .join('\n');

    const secretKey = crypto
      .createHmac('sha256', 'WebAppData')
      .update(BOT_TOKEN)
      .digest();

    const calculatedHash = crypto
      .createHmac('sha256', secretKey)
      .update(params)
      .digest('hex');

    if (calculatedHash !== hash) {
      throw new UnauthorizedException('Invalid Telegram hash');
    }

    const userStr = urlParams.get('user');
    if (!userStr) {
      throw new UnauthorizedException('User data missing in initData');
    }

    return JSON.parse(userStr) as TelegramUser;
  }

  async login(initData: string): Promise<AuthResponseDto> {
    const tgUser = await this.validateTelegramData(initData);

    const user = await this.prisma.user.upsert({
      where: { telegramId: BigInt(tgUser.id) },
      update: {
        username: tgUser.username,
        firstName: tgUser.first_name,
        lastName: tgUser.last_name,
      },
      create: {
        telegramId: BigInt(tgUser.id),
        username: tgUser.username,
        firstName: tgUser.first_name,
        lastName: tgUser.last_name,
      },
    });

    const payload = { sub: user.id, telegramId: user.telegramId.toString(), role: user.role };
    
    return {
      user: {
        ...user,
        telegramId: user.telegramId.toString(),
      },
      token: this.jwtService.sign(payload),
    };
  }
}

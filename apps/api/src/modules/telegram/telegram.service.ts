import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Telegraf } from 'telegraf';

@Injectable()
export class TelegramService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(TelegramService.name);
  private bot!: Telegraf;

  onModuleInit() {
    const token = process.env.BOT_TOKEN;
    const tmaUrl = process.env.TMA_URL;

    if (!token || token === 'your-telegram-bot-token') {
      this.logger.warn('BOT_TOKEN not set — Telegram bot disabled');
      return;
    }

    if (!tmaUrl) {
      this.logger.warn('TMA_URL not set — Telegram bot disabled');
      return;
    }

    this.bot = new Telegraf(token);
    this.registerHandlers(tmaUrl);
    this.bot.launch();
    this.logger.log(`Telegram bot started. Mini App URL: ${tmaUrl}`);
  }

  onModuleDestroy() {
    if (this.bot) {
      this.bot.stop('SIGTERM');
    }
  }

  private registerHandlers(tmaUrl: string) {
    // /start — главный экран с кнопкой открытия Mini App
    this.bot.start((ctx) => {
      const name = ctx.from?.first_name ?? 'студент';
      return ctx.reply(
        `Привет, ${name}! 👋\n\n` +
        `🎓 *Neuro Academy* — платформа для обучения заработку на AI-моделях.\n\n` +
        `Нажми кнопку ниже чтобы открыть приложение и начать обучение:`,
        {
          parse_mode: 'Markdown',
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: '📚 Открыть Neuro Academy',
                  web_app: { url: tmaUrl },
                },
              ],
            ],
          },
        },
      );
    });

    // /app — та же кнопка открытия (дублирующая команда)
    this.bot.command('app', (ctx) => {
      return ctx.reply('Открой приложение:', {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: '📚 Neuro Academy',
                web_app: { url: tmaUrl },
              },
            ],
          ],
        },
      });
    });

    // /help
    this.bot.help((ctx) => {
      return ctx.reply(
        '📖 *Команды:*\n\n' +
        '/start — открыть приложение\n' +
        '/app — кнопка Mini App\n' +
        '/help — эта справка',
        { parse_mode: 'Markdown' },
      );
    });

    // Обработка ошибок
    this.bot.catch((err: any) => {
      this.logger.error('Telegram bot error:', err?.message ?? err);
    });
  }
}

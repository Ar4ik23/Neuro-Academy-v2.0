import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Telegraf } from 'telegraf';

@Injectable()
export class TelegramService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(TelegramService.name);
  private bot!: Telegraf;

  async onModuleInit() {
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

    // Устанавливаем постоянную Menu Button через прямой REST вызов
    await this.setMenuButton(token, tmaUrl);

    // Регистрируем команды
    await this.bot.telegram.setMyCommands([
      { command: 'start', description: 'Открыть Franklin Learning' },
      { command: 'app',   description: 'Mini App' },
      { command: 'help',  description: 'Помощь' },
    ]).catch((e: any) => this.logger.warn(`setMyCommands failed: ${e?.message}`));

    this.logger.log(`Telegram bot started. TMA: ${tmaUrl}`);
  }

  onModuleDestroy() {
    if (this.bot) this.bot.stop('SIGTERM');
  }

  async sendMessage(telegramId: string | bigint, text: string) {
    if (!this.bot) {
      this.logger.warn('Bot not initialized — cannot send message');
      return;
    }
    try {
      await this.bot.telegram.sendMessage(telegramId.toString(), text, {
        parse_mode: 'Markdown',
      });
    } catch (e: any) {
      this.logger.error(`sendMessage failed for ${telegramId}: ${e?.message}`);
    }
  }

  async sendVipActivationMessage(telegramId: string | bigint, activationUrl: string) {
    if (!this.bot) {
      this.logger.warn('Bot not initialized — cannot send message');
      return;
    }
    await this.bot.telegram.sendMessage(
      telegramId.toString(),
      `✅ *VIP-доступ активирован!*\n\nВсе модули курса теперь открыты.\n\n👇 Нажми кнопку ниже чтобы открыть приложение:`,
      {
        parse_mode: 'Markdown',
        reply_markup: {
          inline_keyboard: [
            [{ text: '🎓 Открыть Franklin Learning — VIP активирован!', web_app: { url: activationUrl } }],
          ],
        },
      },
    );
  }

  // Прямой HTTP вызов Bot API — обходит возможные проблемы Telegraf обёртки
  private async setMenuButton(token: string, tmaUrl: string) {
    try {
      const res = await fetch(`https://api.telegram.org/bot${token}/setChatMenuButton`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          menu_button: {
            type: 'web_app',
            text: '📱 Открыть Franklin Learning',
            web_app: { url: tmaUrl },
          },
        }),
      });
      const json = await res.json() as any;
      if (json.ok) {
        this.logger.log('✅ Menu button set — кнопка Mini App видна всем пользователям');
      } else {
        this.logger.error(`❌ setChatMenuButton failed: ${JSON.stringify(json)}`);
      }
    } catch (e: any) {
      this.logger.error(`❌ setChatMenuButton error: ${e?.message}`);
    }
  }

  private registerHandlers(tmaUrl: string) {
    this.bot.start((ctx) => {
      const name = ctx.from?.first_name ?? 'студент';
      return ctx.reply(
        `Привет, ${name}! 👋\n\n` +
        `🎓 *Franklin Learning* — платформа для обучения заработку на AI-моделях.\n\n` +
        `Нажми кнопку 📱 рядом с полем ввода или кнопку ниже:`,
        {
          parse_mode: 'Markdown',
          reply_markup: {
            inline_keyboard: [
              [{ text: '📱 Открыть Franklin Learning', web_app: { url: tmaUrl } }],
            ],
          },
        },
      );
    });

    this.bot.command('app', (ctx) =>
      ctx.reply('Открой приложение:', {
        reply_markup: {
          inline_keyboard: [[{ text: '📱 Franklin Learning', web_app: { url: tmaUrl } }]],
        },
      }),
    );

    this.bot.help((ctx) =>
      ctx.reply(
        '📖 *Команды:*\n\n/start — открыть приложение\n/app — кнопка Mini App\n\nИли нажми кнопку 📱 рядом с полем ввода.',
        { parse_mode: 'Markdown' },
      ),
    );

    this.bot.catch((err: any) => {
      this.logger.error('Bot error:', err?.message ?? err);
    });
  }
}

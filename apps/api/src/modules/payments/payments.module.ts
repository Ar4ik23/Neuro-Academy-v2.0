import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { EnrollmentsModule } from '../enrollments/enrollments.module';
import { TelegramModule } from '../telegram/telegram.module';

@Module({
  imports: [EnrollmentsModule, TelegramModule],
  controllers: [PaymentsController],
  providers: [PaymentsService],
  exports: [PaymentsService],
})
export class PaymentsModule {}

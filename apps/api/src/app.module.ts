import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { CoursesModule } from './modules/courses/courses.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ModulesModule } from './modules/modules/modules.module';
import { LessonsModule } from './modules/lessons/lessons.module';
import { ProgressModule } from './modules/progress/progress.module';
import { QuizzesModule } from './modules/quizzes/quizzes.module';
import { NotesModule } from './modules/notes/notes.module';
import { AIModule } from './modules/ai/ai.module';
import { EnrollmentsModule } from './modules/enrollments/enrollments.module';
import { CertificatesModule } from './modules/certificates/certificates.module';
import { PaymentsModule } from './modules/payments/payments.module';

@Module({
  imports: [
    PrismaModule,
    CoursesModule,
    AuthModule,
    UsersModule,
    ModulesModule,
    LessonsModule,
    ProgressModule,
    QuizzesModule,
    NotesModule,
    AIModule,
    EnrollmentsModule,
    CertificatesModule,
    PaymentsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

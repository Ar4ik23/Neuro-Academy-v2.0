import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // ─── Course ────────────────────────────────────────────────────────────────
  const course = await prisma.course.upsert({
    where: { id: 'ai-model-2' },
    update: { thumbnail: '/course-thumbnail.jpg' },
    create: {
      id: 'ai-model-2',
      title: 'AI-model 2.0',
      category: 'AI MODEL',
      subtitle: 'Запусти свою AI-модель и получи первые результаты через контент, трафик и монетизацию.',
      description: 'От создания AI-модели и контента до трафика, монетизации и масштабирования.',
      fullDescription:
        'Запусти собственную AI-модель и выстрой систему контента, трафика и монетизации.\n\nВ этом курсе ты пройдёшь полный путь: от создания AI-персонажа и генерации контента до привлечения аудитории и первых доходов.\n\nТы узнаешь, как создавать AI-контент, продвигать его через социальные сети, выстраивать систему переписки и превращать аудиторию в прибыль.\n\nПри правильном выполнении шагов многие ученики выходят на $500–$1000 уже в первый месяц.',
      thumbnail: '/course-thumbnail.jpg',
      status: 'Старт бесплатно',
      tags: ['6 модулей', 'Видео', 'Конспекты', 'Экзамен'],
      published: true,
      price: 0,
    },
  });

  // ─── Module 1 — Введение ───────────────────────────────────────────────────
  const m1 = await prisma.module.upsert({
    where: { id: 'm1' },
    update: {},
    create: {
      id: 'm1',
      courseId: course.id,
      title: 'Введение',
      description: 'Как устроена система заработка на AI-моделях и как будет проходить обучение.',
      order: 0,
      emoji: '🧠',
      isFree: true,
    },
  });

  await prisma.lesson.upsert({
    where: { id: 'l1-video' },
    update: {},
    create: { id: 'l1-video', moduleId: m1.id, title: 'Введение в курс', order: 1, lessonType: 'VIDEO', duration: '~5 мин', isFree: true },
  });
  await prisma.lesson.upsert({
    where: { id: 'l1-text' },
    update: {},
    create: { id: 'l1-text', moduleId: m1.id, title: 'Конспект', order: 2, lessonType: 'TEXT', duration: '~3 мин', isFree: true },
  });

  // ─── Module 2 — Создание AI-модели ────────────────────────────────────────
  const m2 = await prisma.module.upsert({
    where: { id: 'm2' },
    update: {},
    create: {
      id: 'm2',
      courseId: course.id,
      title: 'Создание AI-модели',
      description: 'Создание персонажа, генерация изображений и подготовка модели к запуску.',
      order: 1,
      emoji: '🎭',
      isFree: false,
    },
  });

  const m2lessons = [
    { id: 'l2-1',  title: 'Модели в Nano Banano',     order: 1, lessonType: 'VIDEO', duration: '~10 мин' },
    { id: 'l2-2',  title: 'Контент в Nano Banano',    order: 2, lessonType: 'VIDEO', duration: '~10 мин' },
    { id: 'l2-3',  title: 'Mysnapface 1',              order: 3, lessonType: 'VIDEO', duration: '~10 мин' },
    { id: 'l2-4',  title: 'Mysnapface 2',              order: 4, lessonType: 'VIDEO', duration: '~10 мин' },
    { id: 'l2-5',  title: 'Mysnapface 3',              order: 5, lessonType: 'VIDEO', duration: '~10 мин' },
    { id: 'l2-6',  title: 'AI-Influencer Higgsfield',  order: 6, lessonType: 'PDF',   duration: '~5 мин'  },
    { id: 'l2-5b', title: 'Необычные Образы',          order: 7, lessonType: 'VIDEO', duration: '~10 мин' },
    { id: 'l2-5c', title: 'AI Звезда',                 order: 8, lessonType: 'VIDEO', duration: '~10 мин' },
    { id: 'l2-7',  title: 'Конспект',                  order: 9, lessonType: 'TEXT',  duration: '~7 мин'  },
    { id: 'l2-8',  title: 'Квиз',                      order: 10, lessonType: 'QUIZ', duration: '~5 мин'  },
  ];
  for (const l of m2lessons) {
    await prisma.lesson.upsert({ where: { id: l.id }, update: {}, create: { ...l, moduleId: m2.id, isFree: false } });
  }

  // ─── Module 3 — Создание контента ─────────────────────────────────────────
  const m3 = await prisma.module.upsert({
    where: { id: 'm3' },
    update: {},
    create: {
      id: 'm3',
      courseId: course.id,
      title: 'Создание контента',
      description: 'Генерация фото и видео-контента для публикаций.',
      order: 2,
      emoji: '🎬',
      isFree: false,
    },
  });

  const m3lessons = [
    { id: 'l3-1', title: 'Видео Генерация шаг 1', order: 1, lessonType: 'VIDEO', duration: '~10 мин' },
    { id: 'l3-2', title: 'Видео Генерация шаг 2', order: 2, lessonType: 'VIDEO', duration: '~10 мин' },
    { id: 'l3-3', title: 'Видео Генерация шаг 3', order: 3, lessonType: 'VIDEO', duration: '~10 мин' },
    { id: 'l3-4', title: 'Видео Генерация шаг 4', order: 4, lessonType: 'VIDEO', duration: '~10 мин' },
    { id: 'l3-5', title: 'Конспект',               order: 5, lessonType: 'TEXT',  duration: '~7 мин'  },
    { id: 'l3-6', title: 'Квиз',                   order: 6, lessonType: 'QUIZ',  duration: '~5 мин'  },
  ];
  for (const l of m3lessons) {
    await prisma.lesson.upsert({ where: { id: l.id }, update: {}, create: { ...l, moduleId: m3.id, isFree: false } });
  }

  // ─── Module 4 — Трафик ────────────────────────────────────────────────────
  const m4 = await prisma.module.upsert({
    where: { id: 'm4' },
    update: {},
    create: {
      id: 'm4',
      courseId: course.id,
      title: 'Трафик',
      description: 'Привлечение аудитории через социальные сети.',
      order: 3,
      emoji: '🚀',
      isFree: false,
    },
  });

  const m4lessons = [
    { id: 'l4-1',  title: 'Создание Тик Тока',    order: 1,  lessonType: 'VIDEO', duration: '~10 мин' },
    { id: 'l4-2',  title: 'Прогрев Тик Тока',     order: 2,  lessonType: 'VIDEO', duration: '~10 мин' },
    { id: 'l4-3',  title: 'Создание Инстаграмма', order: 3,  lessonType: 'VIDEO', duration: '~10 мин' },
    { id: 'l4-4',  title: 'Инстаграмм подписки',  order: 4,  lessonType: 'VIDEO', duration: '~10 мин' },
    { id: 'l4-5',  title: 'Linktree ссылка',      order: 5,  lessonType: 'VIDEO', duration: '~5 мин'  },
    { id: 'l4-6',  title: 'Прогрев Инстаграмма',  order: 6,  lessonType: 'VIDEO', duration: '~10 мин' },
    { id: 'l4-7',  title: 'Прогрев Threads',      order: 7,  lessonType: 'VIDEO', duration: '~10 мин' },
    { id: 'l4-8',  title: 'Threads подписки',     order: 8,  lessonType: 'VIDEO', duration: '~10 мин' },
    { id: 'l4-9',  title: 'Важно!!!',             order: 9,  lessonType: 'VIDEO', duration: '~5 мин'  },
    { id: 'l4-10', title: 'Конспект',             order: 10, lessonType: 'TEXT',  duration: '~7 мин'  },
    { id: 'l4-11', title: 'Квиз',                 order: 11, lessonType: 'QUIZ',  duration: '~5 мин'  },
  ];
  for (const l of m4lessons) {
    await prisma.lesson.upsert({ where: { id: l.id }, update: {}, create: { ...l, moduleId: m4.id, isFree: false } });
  }

  // ─── Module 5 — Монетизация ───────────────────────────────────────────────
  const m5 = await prisma.module.upsert({
    where: { id: 'm5' },
    update: {},
    create: {
      id: 'm5',
      courseId: course.id,
      title: 'Монетизация',
      description: 'Как превращать аудиторию в доход.',
      order: 4,
      emoji: '💰',
      isFree: false,
    },
  });

  const m5lessons = [
    { id: 'l5-1', title: 'Переписка=Профит 1', order: 1, lessonType: 'VIDEO', duration: '~10 мин' },
    { id: 'l5-2', title: 'Переписка=Профит 2', order: 2, lessonType: 'VIDEO', duration: '~10 мин' },
    { id: 'l5-3', title: 'СРМ и Чаты',         order: 3, lessonType: 'VIDEO', duration: '~10 мин' },
    { id: 'l5-4', title: 'Fanvue',              order: 4, lessonType: 'VIDEO', duration: '~10 мин' },
    { id: 'l5-5', title: 'Fanvue (PDF)',         order: 5, lessonType: 'PDF',   duration: '~5 мин'  },
    { id: 'l5-6', title: 'Конспект',            order: 6, lessonType: 'TEXT',  duration: '~7 мин'  },
    { id: 'l5-7', title: 'Квиз',               order: 7, lessonType: 'QUIZ',  duration: '~5 мин'  },
  ];
  for (const l of m5lessons) {
    await prisma.lesson.upsert({ where: { id: l.id }, update: {}, create: { ...l, moduleId: m5.id, isFree: false } });
  }

  // ─── Module 6 — Масштабирование ───────────────────────────────────────────
  const m6 = await prisma.module.upsert({
    where: { id: 'm6' },
    update: {},
    create: {
      id: 'm6',
      courseId: course.id,
      title: 'Масштабирование',
      description: 'Как увеличивать доход и масштабировать систему.',
      order: 5,
      emoji: '📈',
      isFree: false,
    },
  });

  const m6lessons = [
    { id: 'l6-1',  title: 'Масштабирование',    order: 1,  lessonType: 'VIDEO', duration: '~10 мин' },
    { id: 'l6-2',  title: 'Affiliate-System 1', order: 2,  lessonType: 'VIDEO', duration: '~10 мин' },
    { id: 'l6-3',  title: 'Affiliate-System 2', order: 3,  lessonType: 'VIDEO', duration: '~10 мин' },
    { id: 'l6-4',  title: 'Affiliate-System 3', order: 4,  lessonType: 'VIDEO', duration: '~10 мин' },
    { id: 'l6-5',  title: 'Affiliate-System 4', order: 5,  lessonType: 'VIDEO', duration: '~10 мин' },
    { id: 'l6-6',  title: 'Final Start',        order: 6,  lessonType: 'VIDEO', duration: '~10 мин' },
    { id: 'l6-7',  title: '+18 Tomato',         order: 7,  lessonType: 'VIDEO', duration: '~10 мин' },
    { id: 'l6-8',  title: '+18 Xmode',          order: 8,  lessonType: 'VIDEO', duration: '~10 мин' },
    { id: 'l6-9',  title: 'Конспект',           order: 9,  lessonType: 'TEXT',  duration: '~7 мин'  },
    { id: 'l6-10', title: 'Квиз',               order: 10, lessonType: 'QUIZ',  duration: '~5 мин'  },
  ];
  for (const l of m6lessons) {
    await prisma.lesson.upsert({ where: { id: l.id }, update: {}, create: { ...l, moduleId: m6.id, isFree: false } });
  }

  console.log('✅ Seed completed: course ai-model-2 with 6 modules and 46 lessons');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());

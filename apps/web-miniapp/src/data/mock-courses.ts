/**
 * Mock course data — используется пока API не подключён.
 * Когда API будет готов — удалить этот файл и переключить
 * courses/page.tsx и [courseId]/page.tsx на реальные хуки.
 */

export interface MockLesson {
  id: string;
  title: string;
  order: number;
  isFree?: boolean;
}

export interface MockModule {
  id: string;
  number: number;
  title: string;
  description: string;
  icon: string;
  color: string;
  border: string;
  isFree?: boolean;
  hasNotes: boolean;
  hasQuiz: boolean;
  lessons: MockLesson[];
}

export interface MockCourse {
  id: string;
  category: string;
  title: string;
  subtitle: string;
  description: string;
  fullDescription: string;
  thumbnail: string;
  tags: string[];
  status: string;
  modules: MockModule[];
}

export const MOCK_COURSES: MockCourse[] = [
  {
    id: 'ai-model-2',
    category: 'AI MODEL',
    title: 'AI-model 2.0',
    subtitle: 'Запусти свою AI-модель и получи первые результаты через контент, трафик и монетизацию.',
    description: 'От создания AI-модели и контента до трафика, монетизации и масштабирования.',
    fullDescription:
      'Этот курс показывает полный путь запуска AI-модели: от создания персонажа и генерации контента до привлечения трафика и первых доходов.\n\nТы узнаешь, как создавать AI-контент, продвигать его через социальные сети, выстраивать систему переписки и монетизации, а затем масштабировать результат.',
    thumbnail:
      'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?auto=format&fit=crop&q=80&w=800',
    tags: ['6 модулей', 'Видео', 'Конспекты', 'Экзамен'],
    status: 'Старт бесплатно',
    modules: [
      {
        id: 'm1',
        number: 1,
        title: 'Введение',
        description: 'Как устроена система заработка на AI-моделях и как будет проходить обучение.',
        icon: '💡',
        color: 'from-blue-500/15 to-blue-600/5',
        border: 'border-blue-500/25',
        isFree: true,
        hasNotes: true,
        hasQuiz: false,
        lessons: [
          { id: 'l1-1', title: 'Как работает система AI-моделей', order: 1, isFree: true },
          { id: 'l1-2', title: 'Какие инструменты понадобятся', order: 2, isFree: true },
          { id: 'l1-3', title: 'Как правильно проходить курс', order: 3, isFree: true },
          { id: 'l1-4', title: 'Ошибки новичков', order: 4, isFree: true },
        ],
      },
      {
        id: 'm2',
        number: 2,
        title: 'Создание AI-модели',
        description: 'Создание персонажа, генерация изображений и подготовка модели к запуску.',
        icon: '🧠',
        color: 'from-violet-500/15 to-violet-600/5',
        border: 'border-violet-500/25',
        hasNotes: true,
        hasQuiz: true,
        lessons: [
          { id: 'l2-1', title: 'Создание персонажа', order: 1 },
          { id: 'l2-2', title: 'Генерация фото', order: 2 },
          { id: 'l2-3', title: 'Подготовка профиля', order: 3 },
          { id: 'l2-4', title: 'Оформление аккаунта', order: 4 },
        ],
      },
      {
        id: 'm3',
        number: 3,
        title: 'Создание контента',
        description: 'Генерация фото и видео-контента для публикаций.',
        icon: '🎬',
        color: 'from-emerald-500/15 to-emerald-600/5',
        border: 'border-emerald-500/25',
        hasNotes: true,
        hasQuiz: true,
        lessons: [
          { id: 'l3-1', title: 'Генерация фото', order: 1 },
          { id: 'l3-2', title: 'Создание видео', order: 2 },
          { id: 'l3-3', title: 'Обработка контента', order: 3 },
          { id: 'l3-4', title: 'Подготовка постов', order: 4 },
        ],
      },
      {
        id: 'm4',
        number: 4,
        title: 'Трафик',
        description: 'Привлечение аудитории через социальные сети.',
        icon: '🚀',
        color: 'from-amber-500/15 to-amber-600/5',
        border: 'border-amber-500/25',
        hasNotes: true,
        hasQuiz: true,
        lessons: [
          { id: 'l4-1', title: 'TikTok стратегия', order: 1 },
          { id: 'l4-2', title: 'Threads', order: 2 },
          { id: 'l4-3', title: 'Алгоритмы платформ', order: 3 },
          { id: 'l4-4', title: 'Постинг контента', order: 4 },
        ],
      },
      {
        id: 'm5',
        number: 5,
        title: 'Монетизация',
        description: 'Как превращать аудиторию в доход.',
        icon: '💰',
        color: 'from-rose-500/15 to-rose-600/5',
        border: 'border-rose-500/25',
        hasNotes: true,
        hasQuiz: true,
        lessons: [
          { id: 'l5-1', title: 'Переписка с аудиторией', order: 1 },
          { id: 'l5-2', title: 'Воронка монетизации', order: 2 },
          { id: 'l5-3', title: 'Fanvue setup', order: 3 },
          { id: 'l5-4', title: 'Первые продажи', order: 4 },
        ],
      },
      {
        id: 'm6',
        number: 6,
        title: 'Масштабирование',
        description: 'Как увеличивать доход и масштабировать систему.',
        icon: '📈',
        color: 'from-cyan-500/15 to-cyan-600/5',
        border: 'border-cyan-500/25',
        hasNotes: true,
        hasQuiz: true,
        lessons: [
          { id: 'l6-1', title: 'Масштабирование аккаунтов', order: 1 },
          { id: 'l6-2', title: 'Работа с несколькими моделями', order: 2 },
          { id: 'l6-3', title: 'Новые источники трафика', order: 3 },
          { id: 'l6-4', title: 'Оптимизация дохода', order: 4 },
        ],
      },
    ],
  },
];

export const getMockCourse = (id: string): MockCourse | undefined =>
  MOCK_COURSES.find((c) => c.id === id);

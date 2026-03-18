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
  isFree?: boolean;
  isCompleted: boolean;
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
      'В этом курсе ты пройдёшь полный путь создания и развития собственного AI-проекта. Мы начнём с самого начала — создания AI-персонажа и настройки моделей, которые будут генерировать контент. Ты научишься создавать визуальные образы, работать с генерацией фото и видео, а также выстраивать уникальный стиль персонажа, который будет выделяться среди других.\n\nДалее ты узнаешь, как выстроить систему регулярного контента и подготовить её к масштабированию. Мы разберём инструменты, которые позволяют быстро создавать десятки единиц контента, автоматизировать часть процессов и поддерживать стабильный поток публикаций.\n\nСледующий этап — привлечение аудитории. В курсе подробно показывается, как запускать трафик, продвигать AI-персонажа и превращать просмотры в активную аудиторию. Ты узнаешь, какие платформы лучше всего подходят для роста, какие форматы контента работают лучше всего и как правильно выстраивать стратегию продвижения.\n\nПосле этого мы переходим к монетизации. Ты поймёшь, какие способы заработка работают в этой нише, как подключать платные подписки, продавать контент и выстраивать систему дохода вокруг AI-персонажа.\n\nПри правильном выполнении всех шагов и активной работе с контентом многие ученики начинают получать первые результаты уже в первый месяц. У некоторых получается выйти на доход около $500–$1000, а дальше масштабирование системы позволяет постепенно увеличивать эти показатели.\n\nКурс построен пошагово: каждый модуль — это следующий этап развития проекта, поэтому ты не просто изучаешь теорию, а постепенно создаёшь полноценную рабочую систему вокруг своего AI-персонажа.',
    thumbnail: '/course-thumbnail.jpg',
    tags: ['6 модулей', 'Видео', 'Конспекты', 'Экзамен'],
    status: 'Старт бесплатно',
    modules: [
      {
        id: 'm1',
        number: 0,
        title: 'Введение',
        description: 'Как устроена система заработка на AI-моделях и как будет проходить обучение.',
        icon: '💡',
        isFree: true,
        isCompleted: false,
        hasNotes: true,
        hasQuiz: false,
        lessons: [
          { id: 'l1-video', title: 'Введение в курс', order: 1, isFree: true },
          { id: 'l1-text',  title: 'Конспект',        order: 2, isFree: true },
        ],
      },
      {
        id: 'm2',
        number: 1,
        title: 'Создание AI-модели',
        description: 'Создание персонажа, генерация изображений и подготовка модели к запуску.',
        icon: '🧠',
        isCompleted: false,
        hasNotes: true,
        hasQuiz: true,
        lessons: [
          { id: 'l2-1',  title: 'Модели в Nano Banano',       order: 1 },
          { id: 'l2-2',  title: 'Контент в Nano Banano',      order: 2 },
          { id: 'l2-3',  title: 'Mysnapface 1',               order: 3 },
          { id: 'l2-4',  title: 'Mysnapface 2',               order: 4 },
          { id: 'l2-5',  title: 'Mysnapface 3',               order: 5 },
          { id: 'l2-6',  title: 'AI-Influencer Higgsfield',   order: 6 },
          { id: 'l2-5b', title: 'Необычные Образы',           order: 7 },
          { id: 'l2-5c', title: 'AI Звезда',                  order: 8 },
          { id: 'l2-7',  title: 'Конспект',                   order: 9 },
          { id: 'l2-8',  title: 'Квиз',                       order: 10 },
        ],
      },
      {
        id: 'm3',
        number: 2,
        title: 'Создание контента',
        description: 'Генерация фото и видео-контента для публикаций.',
        icon: '🎬',
        isCompleted: false,
        hasNotes: true,
        hasQuiz: true,
        lessons: [
          { id: 'l3-1', title: 'Видео Генерация шаг 1', order: 1 },
          { id: 'l3-2', title: 'Видео Генерация шаг 2', order: 2 },
          { id: 'l3-3', title: 'Видео Генерация шаг 3', order: 3 },
          { id: 'l3-4', title: 'Видео Генерация шаг 4', order: 4 },
          { id: 'l3-5', title: 'Конспект',               order: 5 },
          { id: 'l3-6', title: 'Квиз',                   order: 6 },
        ],
      },
      {
        id: 'm4',
        number: 3,
        title: 'Трафик',
        description: 'Привлечение аудитории через социальные сети.',
        icon: '🚀',
        isCompleted: false,
        hasNotes: true,
        hasQuiz: true,
        lessons: [
          { id: 'l4-1',  title: 'Создание Тик Тока',       order: 1 },
          { id: 'l4-2',  title: 'Прогрев Тик Тока',        order: 2 },
          { id: 'l4-3',  title: 'Создание Инстаграмма',    order: 3 },
          { id: 'l4-4',  title: 'Инстаграмм подписки',     order: 4 },
          { id: 'l4-5',  title: 'Linktree ссылка',         order: 5 },
          { id: 'l4-6',  title: 'Прогрев Инстаграмма',     order: 6 },
          { id: 'l4-7',  title: 'Прогрев Threads',         order: 7 },
          { id: 'l4-8',  title: 'Threads подписки',        order: 8 },
          { id: 'l4-9',  title: 'Важно!!!',                order: 9 },
          { id: 'l4-10', title: 'Конспект',                order: 10 },
          { id: 'l4-11', title: 'Квиз',                    order: 11 },
        ],
      },
      {
        id: 'm5',
        number: 4,
        title: 'Монетизация',
        description: 'Как превращать аудиторию в доход.',
        icon: '💰',
        isCompleted: false,
        hasNotes: true,
        hasQuiz: true,
        lessons: [
          { id: 'l5-1', title: 'Переписка=Профит 1', order: 1 },
          { id: 'l5-2', title: 'Переписка=Профит 2', order: 2 },
          { id: 'l5-3', title: 'СРМ и Чаты',         order: 3 },
          { id: 'l5-4', title: 'Fanvue',              order: 4 },
          { id: 'l5-5', title: 'Fanvue (PDF)',         order: 5 },
          { id: 'l5-6', title: 'Конспект',            order: 6 },
          { id: 'l5-7', title: 'Квиз',                order: 7 },
        ],
      },
      {
        id: 'm6',
        number: 5,
        title: 'Масштабирование',
        description: 'Как увеличивать доход и масштабировать систему.',
        icon: '📈',
        isCompleted: false,
        hasNotes: true,
        hasQuiz: true,
        lessons: [
          { id: 'l6-1',  title: 'Масштабирование',    order: 1 },
          { id: 'l6-2',  title: 'Affiliate-System 1', order: 2 },
          { id: 'l6-3',  title: 'Affiliate-System 2', order: 3 },
          { id: 'l6-4',  title: 'Affiliate-System 3', order: 4 },
          { id: 'l6-5',  title: 'Affiliate-System 4', order: 5 },
          { id: 'l6-6',  title: 'Final Start',        order: 6 },
          { id: 'l6-7',  title: '+18 Tomato',         order: 7 },
          { id: 'l6-8',  title: '+18 Xmode',          order: 8 },
          { id: 'l6-9',  title: 'Конспект',           order: 9 },
          { id: 'l6-10', title: 'Квиз',               order: 10 },
        ],
      },
    ],
  },
];

export const getMockCourse = (id: string): MockCourse | undefined =>
  MOCK_COURSES.find((c) => c.id === id);

// ─── Learning flow mock ──────────────────────────────────────────────────────
// Полная структура для плеера урока. Заменить на fetch когда API готов.

export type BlockType = 'VIDEO' | 'TEXT' | 'QUIZ' | 'PDF';
export type ModuleStatus = 'completed' | 'current' | 'locked';
export type LessonStatus = 'completed' | 'current' | 'locked';

export interface VideoBlockData {
  id: string; type: 'VIDEO'; title: string; videoUrl: string; duration: string;
}
export interface PdfBlockData {
  id: string; type: 'PDF'; title: string; pdfUrl: string;
}
export interface TextBlockData {
  id: string; type: 'TEXT'; title: string; content: string;
}
export interface QuizOption {
  id: string; text: string; correct: boolean;
}
export interface QuizBlockData {
  id: string; type: 'QUIZ'; title: string; question: string; options: QuizOption[];
}
export interface ModuleQuizQuestion {
  id: string; text: string; options: QuizOption[];
}
export interface ModuleQuizBlockData {
  id: string; type: 'MODULE_QUIZ'; title: string; passThreshold: number; questions: ModuleQuizQuestion[];
  quizId?: string;
}
export type LessonBlock = VideoBlockData | TextBlockData | QuizBlockData | PdfBlockData | ModuleQuizBlockData;

export interface LearningLesson {
  id: string; title: string; status: LessonStatus; blocks: LessonBlock[];
  type?: BlockType; duration?: string;
}
export interface LearningModule {
  id: string; title: string; emoji: string; status: ModuleStatus; lessons: LearningLesson[];
}
export interface LearningCourse {
  id: string; title: string; modules: LearningModule[];
}

export const MOCK_COURSE: LearningCourse = {
  id: '1',
  title: 'AI-model 2.0',
  modules: [
    {
      id: 'm1',
      title: 'Введение',
      emoji: '🧠',
      status: 'current',
      lessons: [
        {
          id: 'l1-video',
          type: 'VIDEO',
          title: 'Введение в курс',
          status: 'current',
          duration: '~6 мин',
          blocks: [
            { id: 'b1-video', type: 'VIDEO', title: 'Введение в курс', videoUrl: 'https://pub-d38d77916ee1492ca4ee55002e27caca.r2.dev/ai%200-1.mp4', duration: '~6 мин' },
          ],
        },
        {
          id: 'l1-text',
          type: 'TEXT',
          title: 'Конспект',
          status: 'locked',
          duration: '~7 мин',
          blocks: [
            {
              id: 'b2',
              type: 'TEXT',
              title: 'Конспект урока',
              content: `## Добро пожаловать в Nero Learning

Этот курс — про конкретную рабочую систему заработка на AI-моделях. Не теория, не общие слова — пошаговая схема от нуля до первых доходов.

За последние 2 года AI-модели (цифровые персонажи, созданные с помощью нейросетей) стали одним из самых быстрорастущих способов заработка в интернете. Люди зарабатывают на них от $500 до $10 000+ в месяц — через подписки, чаты, партнёрские платформы и масштабирование.

Ты сейчас в начале этого пути.

**Что такое AI-модель и как на ней зарабатывают**

AI-модель — это цифровой персонаж с уникальной внешностью, созданный с помощью нейросетей. Он выглядит как реальный человек, но не существует физически. Ты создаёшь его, настраиваешь, генерируешь контент от его лица — и монетизируешь через платформы.

Схема работает так:
- Ты создаёшь персонажа через нейросети (внешность, стиль, характер)
- Генерируешь фото и видео-контент — автоматически, без фотосессий
- Публикуешь в TikTok, Instagram, Threads — набираешь аудиторию
- Переводишь аудиторию на платные платформы (Fanvue и другие)
- Зарабатываешь на подписках и переписке

**Из чего состоит курс**

Курс разделён на 6 модулей. Каждый — отдельный этап системы:

- Модуль 1 — Создание AI-модели: выбор инструментов, генерация внешности, фиксация образа
- Модуль 2 — Создание контента: фото, видео, автоматизация производства
- Модуль 3 — Трафик: TikTok, Instagram, Threads — как набирать аудиторию с нуля
- Модуль 4 — Монетизация: подключение платформ, переписка, воронка
- Модуль 5 — Масштабирование: несколько моделей, партнёрские системы, рост дохода

Модули идут строго по порядку. Каждый следующий шаг строится на предыдущем — не пропускай этапы.

**Инструменты, которые ты будешь использовать**

- Nano Banano — создание и фиксация внешности AI-модели
- Mysnapface — генерация фото и видео от лица персонажа
- Higgsfield — AI-видео с движением
- TikTok, Instagram, Threads — каналы для трафика
- Fanvue — основная платформа монетизации
- Nero — AI-ассистент внутри курса, отвечает на вопросы по урокам

**Как правильно проходить курс**

Главная ошибка — смотреть уроки без действий. Этот курс работает только в связке с практикой.

После каждого урока:
- Сразу повторяй действия из видео
- Не переходи к следующему, пока не сделал текущий шаг
- Используй заметки прямо внутри курса — кнопка ✏️ в уроке

После каждого модуля — квиз. Это не формальность: квиз проверяет, что ты усвоил ключевые моменты и готов к следующему этапу.

**Что тебя ждёт в результате**

При системной работе и выполнении всех шагов:
- Первые $500–$1000 — в первый месяц
- Средний заработок выпускников — $3 000–$5 000 в месяц
- После масштабирования — выше, в зависимости от количества моделей

> Начни с первого модуля прямо сейчас. Чем раньше запустишь систему — тем раньше увидишь результат.`,
            },
          ],
        },
      ],
    },
    {
      id: 'm2',
      title: 'Создание AI-модели',
      emoji: '🎭',
      status: 'locked',
      lessons: [
        {
          id: 'l2-1',
          type: 'VIDEO',
          title: 'Модели в Nano Banano',
          status: 'locked',
          duration: '~10 мин',
          blocks: [
            { id: 'b2-1', type: 'VIDEO', title: 'Модели в Nano Banano', videoUrl: 'https://pub-d38d77916ee1492ca4ee55002e27caca.r2.dev/ai%201-01.mp4', duration: '~14 мин' },
          ],
        },
        {
          id: 'l2-2',
          type: 'VIDEO',
          title: 'Контент в Nano Banano',
          status: 'locked',
          duration: '~10 мин',
          blocks: [
            { id: 'b2-2', type: 'VIDEO', title: 'Контент в Nano Banano', videoUrl: 'https://pub-d38d77916ee1492ca4ee55002e27caca.r2.dev/ai%201-02.mp4', duration: '~15 мин' },
          ],
        },
        {
          id: 'l2-3',
          type: 'VIDEO',
          title: 'Mysnapface 1',
          status: 'locked',
          duration: '~10 мин',
          blocks: [
            { id: 'b2-3', type: 'VIDEO', title: 'Mysnapface 1', videoUrl: 'https://pub-d38d77916ee1492ca4ee55002e27caca.r2.dev/ai%201-3.mp4', duration: '~10 мин' },
          ],
        },
        {
          id: 'l2-4',
          type: 'VIDEO',
          title: 'Mysnapface 2',
          status: 'locked',
          duration: '~10 мин',
          blocks: [
            { id: 'b2-4', type: 'VIDEO', title: 'Mysnapface 2', videoUrl: 'https://pub-d38d77916ee1492ca4ee55002e27caca.r2.dev/ai%201-4.mp4', duration: '~10 мин' },
          ],
        },
        {
          id: 'l2-5',
          type: 'VIDEO',
          title: 'Mysnapface 3',
          status: 'locked',
          duration: '~10 мин',
          blocks: [
            { id: 'b2-5', type: 'VIDEO', title: 'Mysnapface 3', videoUrl: 'https://pub-d38d77916ee1492ca4ee55002e27caca.r2.dev/ai%201-5.mp4', duration: '~10 мин' },
          ],
        },
        {
          id: 'l2-6',
          type: 'PDF',
          title: 'AI-Influencer Higgsfield',
          status: 'locked',
          duration: '~5 мин',
          blocks: [
            { id: 'b2-6', type: 'PDF', title: 'AI-Influencer Higgsfield — Презентация', pdfUrl: '/presentations/AI-Influencer%20Higgsfield.pdf' },
          ],
        },
        {
          id: 'l2-5b',
          type: 'VIDEO',
          title: 'Необычные Образы',
          status: 'locked',
          duration: '~10 мин',
          blocks: [
            { id: 'b2-5b', type: 'VIDEO', title: 'Необычные Образы', videoUrl: 'https://pub-d38d77916ee1492ca4ee55002e27caca.r2.dev/ai%201-6.mp4', duration: '~10 мин' },
          ],
        },
        {
          id: 'l2-5c',
          type: 'VIDEO',
          title: 'AI Звезда',
          status: 'locked',
          duration: '~10 мин',
          blocks: [
            { id: 'b2-5c', type: 'VIDEO', title: 'AI Звезда', videoUrl: 'https://pub-d38d77916ee1492ca4ee55002e27caca.r2.dev/ai%201-7.mp4', duration: '~10 мин' },
          ],
        },
        {
          id: 'l2-7',
          type: 'TEXT',
          title: 'Конспект',
          status: 'locked',
          duration: '~7 мин',
          blocks: [
            {
              id: 'b2-7',
              type: 'TEXT',
              title: 'Конспект модуля',
              content: `## Модуль 2: Создание AI-модели

В этом модуле ты создаёшь своего первого AI-персонажа с нуля и готовишь его к запуску как AI-инфлюенсера. Именно с этого шага строится весь дальнейший заработок.

**Инструменты модуля**

Mysnapface — основной инструмент для создания и доработки визуала модели. Тариф: Pro Creator ($36/мес). Оплата принимается только криптовалютой или европейской картой — российские карты не работают.

Higgsfield — инструмент для AI-видео и анимации. Доступен тариф за $9/мес для теста, но рекомендуется сразу брать $29/мес для полноценной работы.

**Шаг 1 — Создание персонажа в Nano Banana**

Это фундамент всей системы. Задача — создать узнаваемый персонаж с чёткими, стабильными чертами лица. Делай строго по порядку, используй промты из документа «ШАГ 1 и 2 — Промты для уроков».

Почему это важно: если лицо модели «плавает» от фото к фото — нет бренда. Нет бренда — нет аудитории. Нет аудитории — нет дохода.

**Шаг 2 — Контент в Nano Banana**

После создания персонажа начинается его «оживление» через фотоконтент. На этом этапе важнее всего понять логику генерации и набить руку. Первые результаты могут быть несовершенными — это нормально.

**Альтернативный метод — Mysnapface (3 части)**

- Часть 1: базовая настройка, создание модели с нуля
- Часть 2: работа с образами, стилями и окружением
- Часть 3: финальная доработка — кожа, детали, профессиональное качество

Mysnapface даёт более точный контроль над внешностью и позволяет «полировать» визуал до профессионального уровня.

**Необычные образы — усилитель охватов**

Нестандартный визуал работает лучше идеального. Цепочка простая: необычный образ → внимание → трафик → деньги.

Примеры: тигровый паттерн кожи, змеиная текстура, эффект молний, фэнтезийные образы. Задание: создай свою необычную модель и протестируй, что лучше заходит аудитории.

**AI-фото со звёздами (ZenCreator)**

Фото твоей модели рядом с известной личностью — один из самых мощных приёмов роста прямо сейчас. Алгоритмы активнее продвигают такой контент, у аудитории включается эффект доверия.

Промокод: VOSS2 — скидка 50% на первую покупку в ZenCreator.

Задание: минимум 3 фото с разными звёздами, разные сцены. Перед публикацией обязательно удали метаданные с фото.

**AI-инфлюенсер — это система**

Согласно материалу Higgsfield: AI-инфлюенсер — не просто красивые картинки, а выстроенная система контента. Результат правильной системы: узнаваемый персонаж, стабильный визуал, контент без камеры и съёмок.

> Необычное выигрывает у идеального. Стабильность выигрывает у красоты.

**Итоговая таблица инструментов**

- Nano Banana — создание и фиксация внешности персонажа
- Mysnapface — доработка визуала, кожи, деталей
- Higgsfield — AI-видео, анимация, видеоконтент
- ZenCreator — фото AI-модели с известными личностями

## DNA Framework — как писать промты

DNA Framework — это структурированный шаблон промта, который даёт нейросети полную информацию о персонаже. Чем точнее заполнен каждый параметр, тем стабильнее и уникальнее получается модель.

**Структура DNA Framework:**

- Gender / Age — пол и возраст
- Ethnicity / Skin Tone — этнос и тон кожи (можно нестандартный)
- Hair Style — форма и длина причёски
- Hair Colour — цвет волос
- Clothing Style — стиль одежды и аксессуары
- Mood / Emotion — настроение и эмоция
- Environment / Setting — окружение и локация
- Camera Angle — угол камеры
- Pose / Action — поза или действие
- Lighting — тип освещения
- Style / Medium — стиль (photorealistic, cinematic и т.д.)
- Extra Notes — дополнительные детали (гетерохромия, татуировки, особенности)

**Пример промта 1 — Витилиго модель:**

Gender: Female | Age: 19 years old
Ethnicity / Skin Tone: Italian, Surreal High-Contrast Vitiligo (Deep obsidian skin with stark white patches)
Hair Style: Very long, straight, sleek, and center-parted
Hair Colour: Icy Platinum White
Clothing Style: Chartreuse/Lime green ribbed dress with lace trim and ornate gold jewelry
Mood / Emotion: Serene, ethereal, and confident
Environment / Setting: Luxurious modern interior atrium with arched windows
Camera Angle: Mid-shot, eye-level portrait
Pose / Action: Standing poised with one hand resting delicately on the chest
Lighting: Soft, diffused indoor lighting with natural light from background windows
Style / Medium: Photorealistic digital photography
Extra Notes: Notable heterochromia (one blue eye, one green eye) and heavy gold spiked bracelets

**Пример промта 2 — Далматинский паттерн:**

Gender: Female | Age: 19 years old
Ethnicity / Skin Tone: Icy porcelain white skin with high-contrast black spots (Dalmatian-like pattern)
Hair Style: Very long, wavy, styled in two high pigtails
Hair Colour: Pastel Bubblegum Pink
Clothing Style: Soft pink ribbed tank top with white lace trim and layered gold pendant necklaces
Mood / Emotion: Serene, ethereal, and confident
Environment / Setting: Clean studio background (Passport style)
Camera Angle: Close-up, eye-level portrait
Pose / Action: Standing poised, looking directly at the camera
Lighting: Bright, soft diffused studio lighting, even illumination
Style / Medium: Photorealistic digital photography
Extra Notes: Notable heterochromia (one blue eye, one green eye) and delicate gold jewelry

> Используй эти примеры как основу и подставляй свои параметры. Нестандартная кожа, необычный цвет волос, гетерохромия — всё это делает модель запоминающейся и выделяет её среди конкурентов.`,
            },
          ],
        },
        {
          id: 'l2-8',
          type: 'QUIZ',
          title: 'Квиз',
          status: 'locked',
          duration: '~5 мин',
          blocks: [
            {
              id: 'b2-8',
              type: 'MODULE_QUIZ',
              title: 'Квиз — Модуль 2',
              passThreshold: 8,
              questions: [
                {
                  id: 'q1',
                  text: 'Для чего используется DNA Framework при создании AI-модели?',
                  options: [
                    { id: 'q1a', text: 'Для точного описания внешности персонажа в промте', correct: true },
                    { id: 'q1b', text: 'Для монтажа видео из готовых фотографий', correct: false },
                    { id: 'q1c', text: 'Для автоматической публикации контента в соцсети', correct: false },
                  ],
                },
                {
                  id: 'q2',
                  text: 'Почему нельзя оплатить Mysnapface российской картой?',
                  options: [
                    { id: 'q2a', text: 'Сервис не принимает карты РФ', correct: true },
                    { id: 'q2b', text: 'Нужна верификация паспорта', correct: false },
                    { id: 'q2c', text: 'Сервис доступен только резидентам США', correct: false },
                  ],
                },
                {
                  id: 'q3',
                  text: 'Какой инструмент используется для создания AI-видео и анимации модели?',
                  options: [
                    { id: 'q3a', text: 'Nano Banana', correct: false },
                    { id: 'q3b', text: 'Higgsfield', correct: true },
                    { id: 'q3c', text: 'ZenCreator', correct: false },
                  ],
                },
                {
                  id: 'q4',
                  text: 'Что происходит, если лицо AI-модели меняется от фото к фото?',
                  options: [
                    { id: 'q4a', text: 'Это разрушает личный бренд модели', correct: true },
                    { id: 'q4b', text: 'Алгоритмы лучше продвигают такой контент', correct: false },
                    { id: 'q4c', text: 'Это повышает охваты и вовлечённость', correct: false },
                  ],
                },
                {
                  id: 'q5',
                  text: 'Почему фото AI-модели с известной личностью даёт буст охватов?',
                  options: [
                    { id: 'q5a', text: 'Алгоритмы активнее продвигают такой контент, у аудитории включается эффект доверия', correct: true },
                    { id: 'q5b', text: 'Такие фото автоматически попадают в рекомендации', correct: false },
                    { id: 'q5c', text: 'Знаменитости репостят контент со своим изображением', correct: false },
                  ],
                },
                {
                  id: 'q6',
                  text: 'Зачем удалять метаданные с фото перед публикацией в соцсети?',
                  options: [
                    { id: 'q6a', text: 'Для защиты анонимности и безопасности', correct: true },
                    { id: 'q6b', text: 'Чтобы фото весили меньше', correct: false },
                    { id: 'q6c', text: 'Это ускоряет загрузку на платформу', correct: false },
                  ],
                },
                {
                  id: 'q7',
                  text: 'Как выглядит правильная цепочка роста через необычные образы?',
                  options: [
                    { id: 'q7a', text: 'Образ → реклама → продажи → деньги', correct: false },
                    { id: 'q7b', text: 'Образ → внимание → трафик → деньги', correct: true },
                    { id: 'q7c', text: 'Образ → подписчики → охваты → деньги', correct: false },
                  ],
                },
                {
                  id: 'q8',
                  text: 'Какой принцип важнее для AI-инфлюенсера согласно материалу модуля?',
                  options: [
                    { id: 'q8a', text: 'Стабильность важнее красоты', correct: true },
                    { id: 'q8b', text: 'Красота важнее стабильности', correct: false },
                    { id: 'q8c', text: 'Количество контента важнее качества', correct: false },
                  ],
                },
                {
                  id: 'q9',
                  text: 'Что делает AI-модель узнаваемой и формирует личный бренд?',
                  options: [
                    { id: 'q9a', text: 'Большое количество публикаций каждый день', correct: false },
                    { id: 'q9b', text: 'Стабильное лицо — одинаковые черты на каждом фото', correct: true },
                    { id: 'q9c', text: 'Использование только профессиональных фонов', correct: false },
                  ],
                },
                {
                  id: 'q10',
                  text: 'Что является главным результатом правильно выстроенной системы AI-инфлюенсера?',
                  options: [
                    { id: 'q10a', text: 'Узнаваемый персонаж и контент без съёмок', correct: true },
                    { id: 'q10b', text: 'Максимальное количество фотографий в день', correct: false },
                    { id: 'q10c', text: 'Использование только одного инструмента', correct: false },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 'm3',
      title: 'Создание контента',
      emoji: '🎬',
      status: 'locked',
      lessons: [
        {
          id: 'l3-1',
          type: 'VIDEO',
          title: 'Видео Генерация шаг 1',
          status: 'locked',
          duration: '~10 мин',
          blocks: [
            { id: 'b3-1', type: 'VIDEO', title: 'Видео Генерация шаг 1', videoUrl: 'https://pub-d38d77916ee1492ca4ee55002e27caca.r2.dev/ai%203-1.mp4', duration: '~10 мин' },
          ],
        },
        {
          id: 'l3-2',
          type: 'VIDEO',
          title: 'Видео Генерация шаг 2',
          status: 'locked',
          duration: '~10 мин',
          blocks: [
            { id: 'b3-2', type: 'VIDEO', title: 'Видео Генерация шаг 2', videoUrl: 'https://pub-d38d77916ee1492ca4ee55002e27caca.r2.dev/ai%203-2.mp4', duration: '~10 мин' },
          ],
        },
        {
          id: 'l3-3',
          type: 'VIDEO',
          title: 'Видео Генерация шаг 3',
          status: 'locked',
          duration: '~10 мин',
          blocks: [
            { id: 'b3-3', type: 'VIDEO', title: 'Видео Генерация шаг 3', videoUrl: 'https://pub-d38d77916ee1492ca4ee55002e27caca.r2.dev/ai%203-3.mp4', duration: '~10 мин' },
          ],
        },
        {
          id: 'l3-4',
          type: 'VIDEO',
          title: 'Видео Генерация шаг 4',
          status: 'locked',
          duration: '~10 мин',
          blocks: [
            { id: 'b3-4', type: 'VIDEO', title: 'Видео Генерация шаг 4', videoUrl: 'https://pub-d38d77916ee1492ca4ee55002e27caca.r2.dev/ai%203-4.mp4', duration: '~10 мин' },
          ],
        },
        {
          id: 'l3-5',
          type: 'TEXT',
          title: 'Конспект',
          status: 'locked',
          duration: '~7 мин',
          blocks: [
            {
              id: 'b3-5',
              type: 'TEXT',
              title: 'Конспект модуля',
              content: `## Модуль 3: Создание контента

В этом модуле ты оживляешь свою AI-модель и запускаешь первые видео, которые реально заходят в TikTok и Instagram. Четыре шага — от первого видео до полноценного вирусного контента.

**Шаг 1 — Оживляем AI-модель**

Первое и главное — научиться делать видео, которое выглядит живым, а не «нейронкой». Задача не просто сгенерировать видео, а сделать так, чтобы алгоритмы его продвигали.

Что важно на этом шаге:
- Правильно подготовить модель перед генерацией
- Выбирать форматы, которые сейчас реально работают в соцсетях
- Следить за тем, чтобы движения выглядели естественно

Логика простая: видео, которое похоже на настоящее — получает больше времени просмотра. Больше времени просмотра — алгоритм продвигает дальше. Это и есть цель.

**Шаг 2 — Тренды и танцы**

Трендовые видео и танцы — самый быстрый способ получить охваты прямо сейчас. Алгоритмы TikTok и Instagram активно продвигают контент, который участвует в актуальных трендах.

Процесс:
- Выбираешь тренд или танец, который сейчас набирает обороты
- Адаптируешь его под свою AI-модель
- Публикуешь и смотришь реакцию

Ключевой принцип: не изобретай колесо — бери то, что уже работает у других, и делай то же самое со своей моделью.

**Шаг 3 — Lip Sync (липсинги)**

Lip sync — один из самых стабильных форматов на всех платформах одновременно. Работает в TikTok, Instagram Reels и YouTube Shorts.

Почему lip sync так хорошо заходит:
- Быстрые просмотры — контент цепляет с первой секунды
- Высокий retention — люди досматривают до конца
- Максимальная нативность — алгоритмы воспринимают это как «живой» контент

Перед съёмкой: выбери вирусный звук или реплику, которая сейчас в тренде. Звук — это половина успеха.

**Шаг 4 — Альтернативный метод через Kling.ai**

Kling.ai — дополнительный инструмент для создания видео, если основной метод не подходит.

Полный процесс:
- Вставляешь фото модели (лучше сгенерировать заранее с разных ракурсов)
- Прописываешь промпт с описанием движения
- Выбираешь длину 10 секунд и нажимаешь Generate
- Скачиваешь лучшие варианты
- Открываешь в CapCut (или любом другом редакторе)
- Режешь на короткие кусочки, убираешь лишнее, при необходимости ускоряешь, добавляешь музыку

> Перед публикацией обязательно удали метаданные с видео — скриншот через телефон или онлайн-сервис.

**Какие форматы сейчас реально работают**

- Танцы под тренды — высокий органический охват
- Lip sync под вирусные звуки — стабильный retention
- Живые движения (не статика) — алгоритмы дают больший буст
- Короткие ролики до 15–30 секунд — оптимальная длина для Reels и Shorts

> Контент, который выглядит живым и попадает в тренд — продвигается алгоритмами бесплатно. Это твой главный инструмент роста.

## Промты для Kling AI — готовые шаблоны

Для генерации видео через Kling AI используй ChatGPT как помощника по промтам. Вставь в ChatGPT системный промт ниже, загрузи фото модели и напиши «Предложи варианты действий» — получишь готовый промт для Kling.

**Правила написания промтов для Kling:**
- Одно действие = один промт (не смешивай несколько движений)
- Действия должны быть простыми, реалистичными, читаемыми
- Камера, руки и тело двигаются логично относительно кадра
- Не добавляй предметы которых нет в кадре
- Не меняй лицо, телосложение и внешность
- Движения плавные, без резких рывков

**Стиль промтов:** realism, natural motion, smooth pacing, aesthetic sensuality, realistic anatomy

**Промт 1 — Hair Adjustment + Sensual Eye Contact**
(Модель поправляет волосы и смотрит в камеру с мягким, уверенным взглядом)

A young woman gently lifts one hand and slowly adjusts her hair near her face. The movement is delicate and controlled. While doing this, she looks directly into the camera with a soft, confident, sensual gaze. The action is slow, elegant, and natural. Camera remains static, selfie-style, with realistic motion and lighting.

**Промт 2 — Air Kiss to Camera**
(Модель делает воздушный поцелуй в камеру, быстро и игриво)

A young woman films herself in a selfie-style shot, holding the phone steadily with one hand. With her free hand, she quickly and playfully blows an air kiss toward the camera. The gesture is light, feminine, and flirtatious, performed slightly faster than usual. She gives a soft smile immediately after the kiss. Movements are clean and controlled, no pauses. Camera remains stable in her hand, realistic motion, natural lighting, smooth cinematic animation.

**Промт 3 — Camera Goes Down — Back, Waist, Hips Reveal**
(Камера плавно опускается и показывает спину, талию и бёдра)

A young woman holds her phone in one hand, filming herself in a selfie-style shot. While keeping a steady grip on the phone, she slowly lowers the camera downward in a smooth, controlled motion. As the camera moves down, it reveals her back, waist, hips, and legs from behind. Her body moves gently and naturally, with a subtle rhythmic sway of her hips. The movement feels confident, feminine, and fluid. The camera motion is continuous and smooth, with no shaking or sudden changes. Realistic motion, natural lighting, cinematic smoothness.

**Промт 4 — Soft Hip Dance While Holding Phone**
(Модель танцует бёдрами, держа телефон — спокойное, уверенное движение)

A young woman continues holding her phone in one hand, filming herself in a steady selfie-style shot. While keeping the phone stable, she gently dances in place, moving her hips rhythmically from side to side. The movement is smooth, confident, and feminine, with relaxed posture. Her upper body remains mostly still, allowing the hip motion to feel natural and controlled. She maintains soft eye contact with the camera and a subtle, playful smile. Motion is fluid and continuous, natural timing, realistic body movement. Camera remains steady in her hand, no shaking, natural lighting, cinematic smoothness.

**Промт 5 — Adjusting Skirt Chains**
(Камера опускается ниже, модель поправляет цепи на юбке)

A woman holds the phone in one hand and slowly lowers it slightly downward, changing the selfie angle to reveal more of her waist, hips, and skirt with decorative chains. The camera movement is smooth and controlled, clearly framing the chains. With her free hand, she confidently and deliberately adjusts the chains on her skirt, pulling and aligning them so they catch the light. Her body moves subtly with feminine hip motion. She maintains a calm, sensual presence and relaxed confidence. Realistic motion, clean framing, cinematic realism, natural anatomy, smooth pacing.

> Каждый промт = одно конкретное действие. Kling делает видео чище и реалистичнее, когда действие простое и понятное.`,
            },
          ],
        },
        {
          id: 'l3-6',
          type: 'QUIZ',
          title: 'Квиз',
          status: 'locked',
          duration: '~5 мин',
          blocks: [
            {
              id: 'b3-6',
              type: 'MODULE_QUIZ',
              title: 'Квиз — Модуль 3',
              passThreshold: 8,
              questions: [
                {
                  id: 'm3q1',
                  text: 'Почему важно, чтобы видео с AI-моделью выглядело "живым", а не как нейронка?',
                  options: [
                    { id: 'm3q1a', text: 'Алгоритмы дают больше времени просмотра и продвигают такое видео дальше', correct: true },
                    { id: 'm3q1b', text: 'Живые видео быстрее рендерятся и занимают меньше памяти', correct: false },
                    { id: 'm3q1c', text: 'Платформы автоматически блокируют очевидный AI-контент', correct: false },
                  ],
                },
                {
                  id: 'm3q2',
                  text: 'Зачем использовать трендовые танцы и звуки при создании контента?',
                  options: [
                    { id: 'm3q2a', text: 'Алгоритмы активно продвигают контент, который участвует в актуальных трендах', correct: true },
                    { id: 'm3q2b', text: 'Трендовые видео не требуют редактирования перед публикацией', correct: false },
                    { id: 'm3q2c', text: 'Это единственный способ набрать подписчиков в TikTok', correct: false },
                  ],
                },
                {
                  id: 'm3q3',
                  text: 'Что такое lip sync и почему он хорошо заходит на платформах?',
                  options: [
                    { id: 'm3q3a', text: 'Наложение субтитров на видео для глухих зрителей', correct: false },
                    { id: 'm3q3b', text: 'Формат с синхронизацией губ под звук — высокий retention и нативность для алгоритмов', correct: true },
                    { id: 'm3q3c', text: 'Дублирование чужого видео с заменой лица модели', correct: false },
                  ],
                },
                {
                  id: 'm3q4',
                  text: 'Какой первый шаг при работе с Kling.ai?',
                  options: [
                    { id: 'm3q4a', text: 'Вставить фото модели (желательно с разных ракурсов)', correct: true },
                    { id: 'm3q4b', text: 'Выбрать тренд из TikTok и скачать звук', correct: false },
                    { id: 'm3q4c', text: 'Сразу нажать Generate без промта', correct: false },
                  ],
                },
                {
                  id: 'm3q5',
                  text: 'Какую длину видео рекомендуется выбирать в Kling.ai?',
                  options: [
                    { id: 'm3q5a', text: '30 секунд', correct: false },
                    { id: 'm3q5b', text: '10 секунд', correct: true },
                    { id: 'm3q5c', text: '60 секунд', correct: false },
                  ],
                },
                {
                  id: 'm3q6',
                  text: 'Что нужно сделать с видео перед публикацией в соцсетях?',
                  options: [
                    { id: 'm3q6a', text: 'Удалить метаданные с видео', correct: true },
                    { id: 'm3q6b', text: 'Добавить водяной знак с именем аккаунта', correct: false },
                    { id: 'm3q6c', text: 'Сжать до минимального качества для быстрой загрузки', correct: false },
                  ],
                },
                {
                  id: 'm3q7',
                  text: 'Почему lip sync обеспечивает высокий retention?',
                  options: [
                    { id: 'm3q7a', text: 'Видео с синхронизацией губ цепляет с первой секунды и люди досматривают до конца', correct: true },
                    { id: 'm3q7b', text: 'Платформы принудительно показывают lip sync в рекомендациях', correct: false },
                    { id: 'm3q7c', text: 'Это самый простой формат для создания', correct: false },
                  ],
                },
                {
                  id: 'm3q8',
                  text: 'Какой редактор упоминается в модуле для финальной обработки видео из Kling.ai?',
                  options: [
                    { id: 'm3q8a', text: 'Adobe Premiere', correct: false },
                    { id: 'm3q8b', text: 'CapCut', correct: true },
                    { id: 'm3q8c', text: 'Final Cut Pro', correct: false },
                  ],
                },
                {
                  id: 'm3q9',
                  text: 'Какова оптимальная стратегия при выборе контента для публикации?',
                  options: [
                    { id: 'm3q9a', text: 'Создавать только уникальный контент, которого нет у конкурентов', correct: false },
                    { id: 'm3q9b', text: 'Брать то, что уже работает у других, и адаптировать под свою модель', correct: true },
                    { id: 'm3q9c', text: 'Публиковать как можно больше видео в день без привязки к трендам', correct: false },
                  ],
                },
                {
                  id: 'm3q10',
                  text: 'Что является главным триггером для алгоритмов при продвижении видео?',
                  options: [
                    { id: 'm3q10a', text: 'Высокое качество видео в 4K разрешении', correct: false },
                    { id: 'm3q10b', text: 'Большое количество хэштегов в подписи', correct: false },
                    { id: 'm3q10c', text: 'Естественность движений и попадание в актуальный тренд', correct: true },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 'm4',
      title: 'Трафик',
      emoji: '🚀',
      status: 'locked',
      lessons: [
        {
          id: 'l4-1',
          type: 'VIDEO',
          title: 'Создание Тик Тока',
          status: 'locked',
          duration: '~10 мин',
          blocks: [
            { id: 'b4-1', type: 'VIDEO', title: 'Создание Тик Тока', videoUrl: 'https://pub-d38d77916ee1492ca4ee55002e27caca.r2.dev/ai%202-1.mp4', duration: '~10 мин' },
          ],
        },
        {
          id: 'l4-2',
          type: 'PDF',
          title: 'Прогрев Тик Тока',
          status: 'locked',
          duration: '~5 мин',
          blocks: [
            { id: 'b4-2', type: 'PDF', title: 'Прогрев Тик Тока — Презентация', pdfUrl: '/presentations/%5Bsliwbl%5D%20PROGREV-TIKTOK%20%5Bsliwbl%5D%20(2).pdf' },
          ],
        },
        {
          id: 'l4-3',
          type: 'VIDEO',
          title: 'Создание Инстаграмма',
          status: 'locked',
          duration: '~10 мин',
          blocks: [
            { id: 'b4-3', type: 'VIDEO', title: 'Создание Инстаграмма', videoUrl: 'https://pub-d38d77916ee1492ca4ee55002e27caca.r2.dev/ai%204-1.mp4', duration: '~10 мин' },
          ],
        },
        {
          id: 'l4-4',
          type: 'PDF',
          title: 'Инстаграмм подписки',
          status: 'locked',
          duration: '~5 мин',
          blocks: [
            { id: 'b4-4', type: 'PDF', title: 'Инстаграмм подписки — Презентация', pdfUrl: '/presentations/Instagram%20%D0%BF%D0%BE%D0%B4%D0%BF%D0%B8%D1%81%D0%B8.pdf' },
          ],
        },
        {
          id: 'l4-5',
          type: 'PDF',
          title: 'Linktree ссылка',
          status: 'locked',
          duration: '~5 мин',
          blocks: [
            { id: 'b4-5', type: 'PDF', title: 'Linktree ссылка — Презентация', pdfUrl: '/presentations/Linktree%20%D1%81%D1%81%D1%8B%D0%BB%D0%BA%D0%B0.pdf' },
          ],
        },
        {
          id: 'l4-6',
          type: 'PDF',
          title: 'Прогрев Инстаграмма',
          status: 'locked',
          duration: '~5 мин',
          blocks: [
            { id: 'b4-6', type: 'PDF', title: 'Прогрев Инстаграмма — Презентация', pdfUrl: '/presentations/Progrev%20-%20Instagram.pdf' },
          ],
        },
        {
          id: 'l4-7',
          type: 'PDF',
          title: 'Прогрев Threads',
          status: 'locked',
          duration: '~5 мин',
          blocks: [
            { id: 'b4-7', type: 'PDF', title: 'Прогрев Threads — Презентация', pdfUrl: '/presentations/Progrev%20-%20Thread.pdf' },
          ],
        },
        {
          id: 'l4-8',
          type: 'PDF',
          title: 'Threads подписки',
          status: 'locked',
          duration: '~5 мин',
          blocks: [
            { id: 'b4-8', type: 'PDF', title: 'Threads подписки — Презентация', pdfUrl: '/presentations/Threads%20%D0%BF%D0%BE%D0%B4%D0%BF%D0%B8%D1%81%D0%BA%D0%B8.pdf' },
          ],
        },
        {
          id: 'l4-9',
          type: 'PDF',
          title: 'Важно!!!',
          status: 'locked',
          duration: '~5 мин',
          blocks: [
            { id: 'b4-9', type: 'PDF', title: 'Важно!!! — Презентация', pdfUrl: '/presentations/%D0%92%D0%B0%D0%B6%D0%BD%D0%BE.pdf' },
          ],
        },
        {
          id: 'l4-10',
          type: 'TEXT',
          title: 'Конспект',
          status: 'locked',
          duration: '~8 мин',
          blocks: [
            {
              id: 'b4-10',
              type: 'TEXT',
              title: 'Конспект модуля',
              content: `## Модуль 4: Трафик

В этом модуле ты выстраиваешь систему трафика через TikTok, Instagram и Threads. Задача не вести блог, а привлекать людей и направлять их дальше по воронке.

**Почему начинаем с TikTok**

TikTok — самая сильная платформа для бесплатного трафика прямо сейчас. Здесь не важно сколько у тебя подписчиков и насколько старый аккаунт. Алгоритм продвигает новые аккаунты, если ты регулярно публикуешь контент.

Главные преимущества TikTok:
- Видео могут залетать с нуля подписчиков
- Быстрые просмотры и переходы без рекламного бюджета
- Платформа отлично работает для AI-контента
- Стабильный трафик при системном подходе

Весь трафик из TikTok ведём в Instagram. На старте достаточно написать никнейм в шапке профиля, позже добавить полноценную ссылку.

Важно: TikTok не допускает обнажённый или 18+ контент. В TikTok используется исключительно безопасный контент — танцы и видео где модель полностью одета.

**Прогрев TikTok — система на 14 дней**

Прогрев — это не хаос, а чёткая структура. Алгоритм TikTok должен «принять» аккаунт и начать давать стабильные показы. Резкие движения в первые дни убивают аккаунт.

Правила прогрева:
- Никакого раннего 18+ контента
- Никаких одинаковых форматов каждый день
- Плавный рост активности без резких скачков
- Правильный старт решает всё — ошибки в первую неделю дорого стоят

**Создание Instagram**

Instagram создаётся параллельно с TikTok. Не нужно находиться в США — аккаунт настраивается из любой страны.

Прогрев Instagram — 14 дней:
- Дни 1–2: только просматриваем ленту по 20–30 минут. Никаких публикаций и ссылок
- Дни 3–4: добавляем лайки и 2–4 подписки — не больше
- День 5: добавляем аватар, имя, нейтральное bio без ссылок, первый спокойный пост
- Дни 6–7: ещё один пост, естественная активность
- Дни 8–9: подключаем Stories — 1–2 в день, без CTA
- Дни 10–12: первые Reels по одному в день
- Дни 13–14: закрепляем ритм — Reels каждый день, Stories стабильно

Instagram не банит за контент. Он банит за спешку.

**Настройка прокси**

Для создания аккаунтов может потребоваться смена IP на USA.

На iPhone: Настройки → Wi-Fi → ⓘ → HTTP-прокси → Вручную → вводим IP / порт / логин / пароль.

На Android: Настройки → Wi-Fi → ⚙️ → Изменить сеть → Прокси → Вручную → вводим данные → Сохранить.

Проверка прокси: открываем браузер, вводим «what is my ip» — если IP и страна изменились, прокси работает.

Проверка качества прокси через scamalytics.com — должно быть максимум два зелёных квадрата. Если в разделе «Datacenter» стоит «Yes» — такое прокси не подходит, будет теневой бан в TikTok.

**Прогрев Threads — 14 дней**

Threads — про мысли, ритм и диалог. Алгоритм любит тех, кто думает и пишет регулярно.

- Дни 1–2: только читаем ленту, ставим пару лайков, не пишем
- Дни 3–4: первый пост — короткая живая мысль без хештегов и ссылок
- Дни 5–7: входим в диалог, один пост в день и несколько комментариев
- Дни 8–10: формируем ритм, стиль становится узнаваемым
- Дни 11–12: 1–2 поста в день, вопросы, незавершённые мысли
- Дни 13–14: закрепляемся как автор, охваты растут

**Стратегия постов по платформам**

Instagram — сочетание визуала, текста и ритма публикаций:
- Стартовые посты: нейтральные, цель — выглядеть естественно
- Имиджевые посты: формируют образ и доверие
- Вовлекающие посты: лайки, комментарии, сохранения
- Посты с лёгким флиртом: намёк и энергия без прямоты
- Посты с дистанцией: удерживают внимание и сохраняют ценность образа

Threads — каждый пост выполняет задачу: стартовые, посты на характер, вовлекающие, флиртующие (дозировано), посты с дистанцией.

**Ссылка-прокладка (Linktree)**

Linktree — единая точка входа для аудитории из всех платформ. Ссылка должна быть нейтральной, без прямых продаж и триггерных слов. Она не продаёт — она ведёт дальше.

> 14 дней терпения на каждой платформе = чистый аккаунт + доверие алгоритмов + стабильный рост без рисков.`,
            },
          ],
        },
        {
          id: 'l4-11',
          type: 'QUIZ',
          title: 'Квиз',
          status: 'locked',
          duration: '~5 мин',
          blocks: [
            {
              id: 'b4-11',
              type: 'MODULE_QUIZ',
              title: 'Квиз — Модуль 4',
              passThreshold: 8,
              questions: [
                {
                  id: 'm4q1',
                  text: 'Почему TikTok — лучшая платформа для старта трафика?',
                  options: [
                    { id: 'm4q1a', text: 'Алгоритм продвигает новые аккаунты и даёт бесплатные охваты при регулярном постинге', correct: true },
                    { id: 'm4q1b', text: 'TikTok позволяет заливать любой контент без модерации', correct: false },
                    { id: 'm4q1c', text: 'На платформе нет конкурентов среди AI-аккаунтов', correct: false },
                  ],
                },
                {
                  id: 'm4q2',
                  text: 'Куда направляется весь трафик из TikTok?',
                  options: [
                    { id: 'm4q2a', text: 'Напрямую на страницу монетизации', correct: false },
                    { id: 'm4q2b', text: 'В Instagram аккаунт модели', correct: true },
                    { id: 'm4q2c', text: 'В Telegram-канал', correct: false },
                  ],
                },
                {
                  id: 'm4q3',
                  text: 'Что произойдёт, если делать резкие действия в TikTok в первые дни?',
                  options: [
                    { id: 'm4q3a', text: 'Алгоритм быстрее индексирует аккаунт', correct: false },
                    { id: 'm4q3b', text: 'Ошибки в первую неделю могут уничтожить аккаунт', correct: true },
                    { id: 'm4q3c', text: 'Платформа выдаёт предупреждение и даёт время исправиться', correct: false },
                  ],
                },
                {
                  id: 'm4q4',
                  text: 'Что нужно делать в Instagram в первые 1–2 дня прогрева?',
                  options: [
                    { id: 'm4q4a', text: 'Опубликовать первый пост и добавить ссылки в bio', correct: false },
                    { id: 'm4q4b', text: 'Только просматривать ленту 20–30 минут, никаких публикаций', correct: true },
                    { id: 'm4q4c', text: 'Подписаться на 50+ аккаунтов для быстрого старта', correct: false },
                  ],
                },
                {
                  id: 'm4q5',
                  text: 'За что Instagram чаще всего банит новые аккаунты?',
                  options: [
                    { id: 'm4q5a', text: 'За использование AI-контента', correct: false },
                    { id: 'm4q5b', text: 'За спешку и резкие действия', correct: true },
                    { id: 'm4q5c', text: 'За отсутствие верифицированного номера телефона', correct: false },
                  ],
                },
                {
                  id: 'm4q6',
                  text: 'Как проверить, что прокси работает корректно?',
                  options: [
                    { id: 'm4q6a', text: 'Открыть TikTok и проверить, открывается ли лента', correct: false },
                    { id: 'm4q6b', text: 'Ввести «what is my ip» в браузере и проверить изменение IP и страны', correct: true },
                    { id: 'm4q6c', text: 'Отправить тестовое сообщение в Telegram', correct: false },
                  ],
                },
                {
                  id: 'm4q7',
                  text: 'Что означает «Datacenter: Yes» при проверке прокси на scamalytics.com?',
                  options: [
                    { id: 'm4q7a', text: 'Прокси идеально подходит для TikTok', correct: false },
                    { id: 'm4q7b', text: 'Прокси не подходит — скорее всего будет теневой бан в TikTok', correct: true },
                    { id: 'm4q7c', text: 'Прокси работает только для Instagram, но не для TikTok', correct: false },
                  ],
                },
                {
                  id: 'm4q8',
                  text: 'Какова главная задача ссылки-прокладки (Linktree) в профиле?',
                  options: [
                    { id: 'm4q8a', text: 'Продавать напрямую из bio аккаунта', correct: false },
                    { id: 'm4q8b', text: 'Быть единой точкой входа и вести аудиторию дальше, не продавая в лоб', correct: true },
                    { id: 'm4q8c', text: 'Собирать email-адреса подписчиков', correct: false },
                  ],
                },
                {
                  id: 'm4q9',
                  text: 'Какой стиль первых постов в Threads правильный?',
                  options: [
                    { id: 'm4q9a', text: 'Агрессивный продающий контент для быстрого результата', correct: false },
                    { id: 'm4q9b', text: 'Короткие живые мысли без хештегов и ссылок, без попыток понравиться всем', correct: true },
                    { id: 'm4q9c', text: 'Репосты популярного контента с других платформ', correct: false },
                  ],
                },
                {
                  id: 'm4q10',
                  text: 'Какой контент запрещён в TikTok и Instagram согласно правилам платформ?',
                  options: [
                    { id: 'm4q10a', text: 'AI-сгенерированный контент любого типа', correct: false },
                    { id: 'm4q10b', text: 'Видео длиннее 60 секунд', correct: false },
                    { id: 'm4q10c', text: 'Обнажённый контент, 18+ материалы и сексуализированные образы', correct: true },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 'm5',
      title: 'Монетизация',
      emoji: '💰',
      status: 'locked',
      lessons: [
        {
          id: 'l5-1',
          type: 'PDF',
          title: 'Переписка=Профит 1',
          status: 'locked',
          duration: '~5 мин',
          blocks: [
            { id: 'b5-1', type: 'PDF', title: 'Переписка=Профит 1 — Презентация', pdfUrl: '/presentations/%5Bsliwbl%5D%20%D0%9E%D0%B1%D1%89%D0%B5%D0%BD%D0%B8%D0%B5%20%5Bsliwbl%5D.pdf' },
          ],
        },
        {
          id: 'l5-2',
          type: 'PDF',
          title: 'Переписка=Профит 2',
          status: 'locked',
          duration: '~5 мин',
          blocks: [
            { id: 'b5-2', type: 'PDF', title: 'Переписка=Профит 2 — Презентация', pdfUrl: '/presentations/%5Bsliwbl%5D%20%D0%9E%D0%B1%D1%89%D0%B5%D0%BD%D0%B8%D0%B5%202%20%5Bsliwbl%5D.pdf' },
          ],
        },
        {
          id: 'l5-3',
          type: 'VIDEO',
          title: 'СРМ и Чаты',
          status: 'locked',
          duration: '~10 мин',
          blocks: [
            { id: 'b5-3', type: 'VIDEO', title: 'СРМ и Чаты', videoUrl: 'https://pub-d38d77916ee1492ca4ee55002e27caca.r2.dev/ai%206-1.mp4', duration: '~10 мин' },
          ],
        },
        {
          id: 'l5-4',
          type: 'VIDEO',
          title: 'Fanvue',
          status: 'locked',
          duration: '~10 мин',
          blocks: [
            { id: 'b5-4', type: 'VIDEO', title: 'Fanvue', videoUrl: 'https://pub-d38d77916ee1492ca4ee55002e27caca.r2.dev/ai%207-1.mp4', duration: '~10 мин' },
          ],
        },
        {
          id: 'l5-5',
          type: 'PDF',
          title: 'Fanvue',
          status: 'locked',
          duration: '~5 мин',
          blocks: [
            { id: 'b5-5', type: 'PDF', title: 'Fanvue — Презентация', pdfUrl: '/presentations/Fanvue1.pdf' },
          ],
        },
        {
          id: 'l5-6',
          type: 'TEXT',
          title: 'Конспект',
          status: 'locked',
          duration: '~8 мин',
          blocks: [
            {
              id: 'b5-6',
              type: 'TEXT',
              title: 'Конспект модуля',
              content: `## Модуль 5: Монетизация

В этом модуле ты выстраиваешь систему монетизации через Fanvue, учишься управлять вниманием аудитории и автоматизируешь работу через CRM.

**CRM Substy — система вместо ручного хаоса**

Если ты льёшь трафик на Fanvue, но всё ещё сам сидишь в переписках, теряешь даты оплат и не контролируешь кто и за что заплатил — ты упёрся в потолок.

CRM Substy решает эти проблемы:
- Автоматические SMS для общения с подписчиками
- Контроль подписок и выплат по датам
- Убирает ручную переписку
- Даёт полный обзор кто активен, кто отвалился, кто должен заплатить

Это не костыль — это система, которая позволяет масштабироваться. Без CRM каждая новая модель умножает хаос. С CRM — умножает доход.

**Переписка — Часть 1: психология платящей аудитории**

Большинство думает, что доход на Fanvue — это контент. На практике деньги приходят из диалога.

Ключевые принципы:
- Подписчики платят не за фото, а за ощущение уникальности и связи
- Эмоциональная вовлечённость — главный драйвер платежей
- Конкретные фразы, форматы и действия усиливают привязанность

Правильная логика: ты не «общаешься» — ты управляешь вниманием, эмоцией и решением платить. Это не манипуляция — это понимание психологии поведения аудитории.

**Переписка — Часть 2: как увеличить щедрость аудитории**

Доход не зависит от удачи или количества подписчиков. Деньги — это результат правильно выстроенной системы взаимодействия.

Как увеличить готовность платить:
- Формировать понятные цели, в которые человек вовлекается
- Усиливать вовлечённость без давления и попрошайничества
- Давать человеку чёткую роль в истории модели

Ключевая мысль: чем понятнее история и роль человека в ней — тем выше его готовность участвовать финансово.

**Регистрация Fanvue**

Fanvue — платформа монетизации, на которой происходит основной доход.

Что нужно для регистрации:
- Паспорт / водительские права / ID-карта
- Селфи с лицом
- Документ с адресом (если потребуется)

Для жителей Европы и других стран: проходишь KYC по шагам на сайте, загружаешь качественные фото документов, ждёшь подтверждения (обычно 5 минут, максимум 48 часов).

Для жителей РФ, Украины, Беларуси: эти страны на Fanvue в бане, но можно зарегистрироваться на другого человека или попросить знакомого с Европы или Казахстана. Пол не важен.

**Настройка профиля Fanvue после верификации**

После верификации нужно корректно заполнить профиль:
- Заполнить все элементы профиля в правильном порядке
- Выставить базовые настройки аккаунта
- Подготовить аккаунт к работе с аудиторией

Важно сделать это правильно на старте — логика заполнения влияет на первое впечатление подписчиков.

**Категории подписчиков на Fanvue**

Понимание категорий подписчиков напрямую влияет на то, как ты с ними общаешься и выстраиваешь работу. Разные категории требуют разного подхода в переписке и разных предложений по контенту.

> Контент привлекает. Диалог удерживает. Система масштабирует.`,
            },
          ],
        },
        {
          id: 'l5-7',
          type: 'QUIZ',
          title: 'Квиз',
          status: 'locked',
          duration: '~5 мин',
          blocks: [
            {
              id: 'b5-7',
              type: 'MODULE_QUIZ',
              title: 'Квиз — Модуль 5',
              passThreshold: 8,
              questions: [
                {
                  id: 'm5q1',
                  text: 'Что является главным признаком того, что ты упёрся в потолок на Fanvue?',
                  options: [
                    { id: 'm5q1a', text: 'Ты сам сидишь в переписках, теряешь даты оплат и не контролируешь платежи', correct: true },
                    { id: 'm5q1b', text: 'У тебя меньше 1000 подписчиков', correct: false },
                    { id: 'm5q1c', text: 'Ты публикуешь меньше 3 постов в день', correct: false },
                  ],
                },
                {
                  id: 'm5q2',
                  text: 'Для чего используется CRM Substy?',
                  options: [
                    { id: 'm5q2a', text: 'Для генерации фото и видео AI-модели', correct: false },
                    { id: 'm5q2b', text: 'Для автоматизации переписки, контроля подписок и дат выплат', correct: true },
                    { id: 'm5q2c', text: 'Для создания аккаунтов в TikTok и Instagram', correct: false },
                  ],
                },
                {
                  id: 'm5q3',
                  text: 'За что подписчики платят на Fanvue согласно материалу модуля?',
                  options: [
                    { id: 'm5q3a', text: 'За качество и количество фотографий', correct: false },
                    { id: 'm5q3b', text: 'За ощущение уникальности и эмоциональную связь', correct: true },
                    { id: 'm5q3c', text: 'За эксклюзивный доступ к новым AI-инструментам', correct: false },
                  ],
                },
                {
                  id: 'm5q4',
                  text: 'Как правильно описать логику работы с аудиторией в переписке?',
                  options: [
                    { id: 'm5q4a', text: 'Ты просто общаешься и отвечаешь на вопросы', correct: false },
                    { id: 'm5q4b', text: 'Ты управляешь вниманием, эмоцией и решением платить', correct: true },
                    { id: 'm5q4c', text: 'Ты продаёшь контент напрямую в каждом сообщении', correct: false },
                  ],
                },
                {
                  id: 'm5q5',
                  text: 'От чего реально зависит доход на Fanvue согласно уроку?',
                  options: [
                    { id: 'm5q5a', text: 'От удачи и случайного роста аккаунта', correct: false },
                    { id: 'm5q5b', text: 'От количества подписчиков в TikTok', correct: false },
                    { id: 'm5q5c', text: 'От правильно выстроенной системы взаимодействия с аудиторией', correct: true },
                  ],
                },
                {
                  id: 'm5q6',
                  text: 'Что нужно для регистрации на Fanvue?',
                  options: [
                    { id: 'm5q6a', text: 'Только email и пароль', correct: false },
                    { id: 'm5q6b', text: 'Паспорт или ID-карта и селфи с лицом', correct: true },
                    { id: 'm5q6c', text: 'Подтверждённый аккаунт Instagram с 1000+ подписчиков', correct: false },
                  ],
                },
                {
                  id: 'm5q7',
                  text: 'Что делать жителям РФ, Украины, Беларуси для регистрации на Fanvue?',
                  options: [
                    { id: 'm5q7a', text: 'Использовать VPN — этого достаточно для обхода ограничений', correct: false },
                    { id: 'm5q7b', text: 'Регистрация на этих странах невозможна вообще', correct: false },
                    { id: 'm5q7c', text: 'Зарегистрироваться через другого человека из Европы или Казахстана', correct: true },
                  ],
                },
                {
                  id: 'm5q8',
                  text: 'Почему важно понимать категории подписчиков на Fanvue?',
                  options: [
                    { id: 'm5q8a', text: 'Разные категории требуют разного подхода в переписке и предложениях', correct: true },
                    { id: 'm5q8b', text: 'Это нужно только для статистики и аналитики', correct: false },
                    { id: 'm5q8c', text: 'Категории влияют только на алгоритмы продвижения', correct: false },
                  ],
                },
                {
                  id: 'm5q9',
                  text: 'Как правильно увеличить готовность аудитории платить без давления?',
                  options: [
                    { id: 'm5q9a', text: 'Чаще напоминать о платных материалах в каждом сообщении', correct: false },
                    { id: 'm5q9b', text: 'Давать человеку чёткую роль в истории модели и формировать понятные цели', correct: true },
                    { id: 'm5q9c', text: 'Публиковать больше бесплатного контента для привлечения новых платящих', correct: false },
                  ],
                },
                {
                  id: 'm5q10',
                  text: 'Что происходит без CRM при масштабировании на несколько моделей?',
                  options: [
                    { id: 'm5q10a', text: 'Доход растёт пропорционально числу моделей', correct: false },
                    { id: 'm5q10b', text: 'Каждая новая модель умножает хаос вместо дохода', correct: true },
                    { id: 'm5q10c', text: 'Системы автоматически синхронизируются между аккаунтами', correct: false },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 'm6',
      title: 'Масштабирование',
      emoji: '📈',
      status: 'locked',
      lessons: [
        {
          id: 'l6-1',
          type: 'PDF',
          title: 'Масштабирование',
          status: 'locked',
          duration: '~5 мин',
          blocks: [
            { id: 'b6-1', type: 'PDF', title: 'Масштабирование — Презентация', pdfUrl: '/presentations/%D0%9C%D0%B0%D1%81%D1%88%D1%82%D0%B0%D0%B1%D0%B8%D1%80%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5.pdf' },
          ],
        },
        {
          id: 'l6-2',
          type: 'PDF',
          title: 'Affiliate-System 1',
          status: 'locked',
          duration: '~5 мин',
          blocks: [
            { id: 'b6-2', type: 'PDF', title: 'Affiliate-System 1 — Презентация', pdfUrl: '/presentations/Affiliate-System%201.pdf' },
          ],
        },
        {
          id: 'l6-3',
          type: 'PDF',
          title: 'Affiliate-System 2',
          status: 'locked',
          duration: '~5 мин',
          blocks: [
            { id: 'b6-3', type: 'PDF', title: 'Affiliate-System 2 — Презентация', pdfUrl: '/presentations/Affiliate-System%202.pdf' },
          ],
        },
        {
          id: 'l6-4',
          type: 'PDF',
          title: 'Affiliate-System 3',
          status: 'locked',
          duration: '~5 мин',
          blocks: [
            { id: 'b6-4', type: 'PDF', title: 'Affiliate-System 3 — Презентация', pdfUrl: '/presentations/Affiliate-System%203.pdf' },
          ],
        },
        {
          id: 'l6-5',
          type: 'PDF',
          title: 'Affiliate-System 4',
          status: 'locked',
          duration: '~5 мин',
          blocks: [
            { id: 'b6-5', type: 'PDF', title: 'Affiliate-System 4 — Презентация', pdfUrl: '/presentations/Affiliate-System%204.pdf' },
          ],
        },
        {
          id: 'l6-6',
          type: 'PDF',
          title: 'Final Start',
          status: 'locked',
          duration: '~5 мин',
          blocks: [
            { id: 'b6-6', type: 'PDF', title: 'Final Start — Презентация', pdfUrl: '/presentations/Final%20start.pdf' },
          ],
        },
        {
          id: 'l6-7',
          type: 'VIDEO',
          title: '+18 Tomato',
          status: 'locked',
          duration: '~10 мин',
          blocks: [
            { id: 'b6-7', type: 'VIDEO', title: '+18 Tomato', videoUrl: 'https://pub-d38d77916ee1492ca4ee55002e27caca.r2.dev/ai%2010-1.mp4', duration: '~10 мин' },
          ],
        },
        {
          id: 'l6-8',
          type: 'VIDEO',
          title: '+18 Xmode',
          status: 'locked',
          duration: '~10 мин',
          blocks: [
            { id: 'b6-8', type: 'VIDEO', title: '+18 Xmode', videoUrl: 'https://pub-d38d77916ee1492ca4ee55002e27caca.r2.dev/ai%2010-2.mp4', duration: '~10 мин' },
          ],
        },
        {
          id: 'l6-9',
          type: 'TEXT',
          title: 'Конспект',
          status: 'locked',
          duration: '~8 мин',
          blocks: [
            {
              id: 'b6-9',
              type: 'TEXT',
              title: 'Конспект модуля',
              content: `## Модуль 6: Масштабирование

Если ты добрался до этого модуля — у тебя уже есть модель, выстроены соцсети, выходит контент и есть первые результаты. Теперь задача перестать думать тактически и начать думать стратегически.

**Что такое масштабирование в этой системе**

Масштабирование — это не просто больше работы. Это превращение хаотичных действий в повторяемый процесс.

Четыре ключевых направления:
- Превратить хаотичные действия в понятный процесс
- Выстроить работу так, чтобы результат был повторяемым
- Делегировать и перестать делать всё руками
- Запускать несколько моделей и потоков дохода одновременно

Масштабирование без системы — это просто больше хаоса. Система без масштабирования — это ограниченный потолок.

**Vosskres Affiliate System**

Affiliate System — партнёрская программа, которая позволяет зарабатывать на развитии AI-блогеров внутри экосистемы Vosskres.

Три шага для входа:
- Ознакомиться с презентацией и идеей проекта
- Выбрать свою роль в системе
- Стать частью команды новой эры AI-блогеров

Система предусматривает несколько уровней участия с разными схемами дохода.

**Оформление Instagram AI-блогера**

Правильное оформление профиля запускает рост ещё до партнёрских продаж — первые $200–800 на интеграциях.

Что важно в профиле:
- Внешний вид AI-модели должен быть узнаваемым и вызывать интерес
- Bio формирует первое впечатление — оно должно цеплять, а не описывать
- Ссылка в профиле ведёт к продажам — нейтральная, без прямого давления
- Темы контента выбираются под алгоритмы, а не под личные предпочтения
- Профиль должен считываться как часть движения Vosskres AI

**Вирусные видео — основа роста**

Без вирусного видео AI-модель не растёт. Алгоритмы продвигают то, что досматривают.

Рабочая система создания вирусных видео:
- Находить темы, которые уже собирают миллионы просмотров
- Превращать чужие идеи в собственные сценарии под свою модель
- Делать ролики с высоким retention — люди досматривают и сразу заходят в профиль

Один правильный ролик может вывести тебя в рекомендации и принести первые продажи в первые дни.

**Полный набор инструментов AI-блогера**

Для запуска полноценного контент-потока нужны четыре элемента:
- Создание модели — визуальная база персонажа
- Готовый вирусный текст — сценарии и подписи
- Голос — озвучка через AI без записи
- Живое видео — финальная сборка за несколько минут

Весь этот набор позволяет запускать контент, который собирает охваты, приводит людей по ссылке и приносит первые $180+ уже в первые дни.

**18+ направление — дополнительный поток дохода**

Отдельное направление для тех, кто хочет дополнительный источник дохода. Изучается и используется по желанию.

Инструменты:
- GenTomato — генерация 18+ контента, урок уже доступен
- Xmode — более продвинутый инструмент, отличается от GenTomato интерфейсом и подходом к генерации
- ZenCreators — комплексный инструмент, скидка 50% по промокоду VOSS2

Как используется 18+ контент в системе:
- В переписках с подписчиками как эксклюзивный материал
- В апсейлах — платные предложения на дополнительный контент
- Как бонус за оплату или продление подписки

Ключевое отличие Xmode от GenTomato: разный интерфейс и логика запуска генерации, системный подход к созданию визуала без хаоса и случайных результатов.

> Масштабирование = отлаженная система × правильные инструменты × делегирование. Ты больше не работаешь на модель — модель работает на тебя.`,
            },
          ],
        },
        {
          id: 'l6-10',
          type: 'QUIZ',
          title: 'Квиз',
          status: 'locked',
          duration: '~5 мин',
          blocks: [
            {
              id: 'b6-10',
              type: 'MODULE_QUIZ',
              title: 'Квиз — Модуль 6',
              passThreshold: 8,
              questions: [
                {
                  id: 'm6q1',
                  text: 'В чём ключевое отличие масштабирования от простого увеличения объёма работы?',
                  options: [
                    { id: 'm6q1a', text: 'Масштабирование — это превращение хаотичных действий в повторяемый процесс', correct: true },
                    { id: 'm6q1b', text: 'Масштабирование — это просто создание большего количества моделей', correct: false },
                    { id: 'm6q1c', text: 'Масштабирование означает работать больше часов в день', correct: false },
                  ],
                },
                {
                  id: 'm6q2',
                  text: 'Что происходит, если масштабироваться без выстроенной системы?',
                  options: [
                    { id: 'm6q2a', text: 'Доход растёт пропорционально количеству моделей', correct: false },
                    { id: 'm6q2b', text: 'Масштабирование без системы — это просто больше хаоса', correct: true },
                    { id: 'm6q2c', text: 'Алгоритмы автоматически адаптируются под рост аккаунтов', correct: false },
                  ],
                },
                {
                  id: 'm6q3',
                  text: 'Что даёт правильное оформление профиля Instagram AI-модели до партнёрских продаж?',
                  options: [
                    { id: 'm6q3a', text: 'Автоматическую верификацию аккаунта', correct: false },
                    { id: 'm6q3b', text: 'Первые $200–800 на интеграциях', correct: true },
                    { id: 'm6q3c', text: 'Доступ к закрытым инструментам платформы', correct: false },
                  ],
                },
                {
                  id: 'm6q4',
                  text: 'Какова главная функция Bio в профиле AI-блогера?',
                  options: [
                    { id: 'm6q4a', text: 'Подробно описать кто такая модель и откуда она', correct: false },
                    { id: 'm6q4b', text: 'Перечислить все платформы где присутствует модель', correct: false },
                    { id: 'm6q4c', text: 'Сформировать первое впечатление и зацепить — не описывать, а интриговать', correct: true },
                  ],
                },
                {
                  id: 'm6q5',
                  text: 'Как правильно создавать вирусные видео согласно системе Vosskres?',
                  options: [
                    { id: 'm6q5a', text: 'Находить темы с миллионами просмотров и адаптировать под свою модель', correct: true },
                    { id: 'm6q5b', text: 'Создавать полностью уникальный контент без анализа конкурентов', correct: false },
                    { id: 'm6q5c', text: 'Публиковать как можно больше видео без акцента на тренды', correct: false },
                  ],
                },
                {
                  id: 'm6q6',
                  text: 'Какие четыре элемента составляют полный набор инструментов AI-блогера?',
                  options: [
                    { id: 'm6q6a', text: 'Модель, текст, голос, живое видео', correct: true },
                    { id: 'm6q6b', text: 'TikTok, Instagram, Threads, Fanvue', correct: false },
                    { id: 'm6q6c', text: 'Промт, рендер, монтаж, публикация', correct: false },
                  ],
                },
                {
                  id: 'm6q7',
                  text: 'Как 18+ контент используется в системе монетизации?',
                  options: [
                    { id: 'm6q7a', text: 'Публикуется в открытом доступе в TikTok и Instagram', correct: false },
                    { id: 'm6q7b', text: 'Используется в переписках, апсейлах и как бонус за оплату', correct: true },
                    { id: 'm6q7c', text: 'Заменяет основной контент на всех платформах', correct: false },
                  ],
                },
                {
                  id: 'm6q8',
                  text: 'Чем Xmode отличается от GenTomato?',
                  options: [
                    { id: 'm6q8a', text: 'Xmode бесплатный, GenTomato платный', correct: false },
                    { id: 'm6q8b', text: 'Другой интерфейс и подход к генерации, системный подход без хаоса', correct: true },
                    { id: 'm6q8c', text: 'Xmode создаёт только видео, GenTomato только фото', correct: false },
                  ],
                },
                {
                  id: 'm6q9',
                  text: 'Что означает думать "стратегически", а не "тактически" в контексте масштабирования?',
                  options: [
                    { id: 'm6q9a', text: 'Делать всё самому, но быстрее и качественнее', correct: false },
                    { id: 'm6q9b', text: 'Делегировать задачи, строить системы и запускать несколько потоков дохода', correct: true },
                    { id: 'm6q9c', text: 'Сосредоточиться на одной платформе и работать только там', correct: false },
                  ],
                },
                {
                  id: 'm6q10',
                  text: 'Какой результат даёт один правильный вирусный ролик?',
                  options: [
                    { id: 'm6q10a', text: 'Гарантированный выход в топ TikTok на неделю', correct: false },
                    { id: 'm6q10b', text: 'Выход в рекомендации и первые продажи уже в первые дни', correct: true },
                    { id: 'm6q10c', text: 'Автоматическое подключение партнёрской программы', correct: false },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};

/* ─────────────────────────────────────────────────────────────────────────────
   ФИНАЛЬНЫЙ ЭКЗАМЕН — 30 вопросов по всему курсу
───────────────────────────────────────────────────────────────────────────── */
export interface ExamQuestion {
  id: string;
  text: string;
  options: { id: string; text: string; correct: boolean }[];
}

export const EXAM_QUESTIONS: ExamQuestion[] = [
  // ── Модуль 0: Введение ──────────────────────────────────────────────────
  {
    id: 'eq1',
    text: 'В какой правильной последовательности выстраивается система заработка на AI-моделях?',
    options: [
      { id: 'eq1a', text: 'Монетизация → Модель → Трафик → Контент → Масштабирование', correct: false },
      { id: 'eq1b', text: 'Модель → Трафик → Контент → Монетизация → Масштабирование', correct: true },
      { id: 'eq1c', text: 'Контент → Модель → Трафик → Монетизация → Масштабирование', correct: false },
      { id: 'eq1d', text: 'Трафик → Модель → Контент → Монетизация → Масштабирование', correct: false },
    ],
  },
  {
    id: 'eq2',
    text: 'Что произойдёт если пропустить один из этапов системы?',
    options: [
      { id: 'eq2a', text: 'Система будет работать, но медленнее', correct: false },
      { id: 'eq2b', text: 'Можно пропустить только этап трафика', correct: false },
      { id: 'eq2c', text: 'Система работать не будет', correct: true },
      { id: 'eq2d', text: 'Нужно вернуться к предыдущему этапу и повторить', correct: false },
    ],
  },
  {
    id: 'eq3',
    text: 'Как правильно проходить этот курс?',
    options: [
      { id: 'eq3a', text: 'Смотреть все уроки подряд без практики, потом делать всё сразу', correct: false },
      { id: 'eq3b', text: 'Практически — повторять действия из видео сразу, не переходить дальше без выполнения', correct: true },
      { id: 'eq3c', text: 'Изучить теорию полностью, потом приступить к практике', correct: false },
      { id: 'eq3d', text: 'Смотреть по одному уроку в неделю', correct: false },
    ],
  },
  // ── Модуль 1: Создание AI-модели ────────────────────────────────────────
  {
    id: 'eq4',
    text: 'Какой тариф Mysnapface рекомендуется для полноценной работы?',
    options: [
      { id: 'eq4a', text: 'Free', correct: false },
      { id: 'eq4b', text: 'Basic ($9/мес)', correct: false },
      { id: 'eq4c', text: 'Pro Creator ($36/мес)', correct: true },
      { id: 'eq4d', text: 'Enterprise ($99/мес)', correct: false },
    ],
  },
  {
    id: 'eq5',
    text: 'Почему стабильность лица модели от фото к фото критически важна?',
    options: [
      { id: 'eq5a', text: 'Это требование платформ Mysnapface и Nano Banana', correct: false },
      { id: 'eq5b', text: 'Без стабильного лица нет бренда → нет аудитории → нет дохода', correct: true },
      { id: 'eq5c', text: 'Алгоритмы специально продвигают стабильный визуал', correct: false },
      { id: 'eq5d', text: 'Так легче создавать контент в дальнейшем', correct: false },
    ],
  },
  {
    id: 'eq6',
    text: 'Что такое DNA Framework?',
    options: [
      { id: 'eq6a', text: 'Программа монетизации AI-моделей через партнёрские сети', correct: false },
      { id: 'eq6b', text: 'Метод продвижения аккаунта в социальных сетях', correct: false },
      { id: 'eq6c', text: 'Структурированный шаблон промта с полной информацией о персонаже', correct: true },
      { id: 'eq6d', text: 'Инструмент для создания видеоконтента', correct: false },
    ],
  },
  {
    id: 'eq7',
    text: 'Какой параметр DNA Framework отвечает за уникальные особенности (гетерохромия, татуировки)?',
    options: [
      { id: 'eq7a', text: 'Style / Medium', correct: false },
      { id: 'eq7b', text: 'Extra Notes', correct: true },
      { id: 'eq7c', text: 'Mood / Emotion', correct: false },
      { id: 'eq7d', text: 'Clothing Style', correct: false },
    ],
  },
  {
    id: 'eq8',
    text: 'Зачем создавать фото AI-модели рядом с известными личностями (ZenCreator)?',
    options: [
      { id: 'eq8a', text: 'Для верификации аккаунта на платформах', correct: false },
      { id: 'eq8b', text: 'Алгоритмы активнее продвигают такой контент, у аудитории включается эффект доверия', correct: true },
      { id: 'eq8c', text: 'Это обязательное требование Fanvue', correct: false },
      { id: 'eq8d', text: 'Чтобы пройти верификацию в Instagram', correct: false },
    ],
  },
  {
    id: 'eq9',
    text: 'Почему необычные образы (тигровый паттерн, змеиная текстура) дают лучший результат чем идеальный визуал?',
    options: [
      { id: 'eq9a', text: 'Алгоритмы специально продвигают необычный контент', correct: false },
      { id: 'eq9b', text: 'Необычный образ → внимание → трафик → деньги', correct: true },
      { id: 'eq9c', text: 'Такие образы дешевле генерировать', correct: false },
      { id: 'eq9d', text: 'Конкуренция в этой нише значительно ниже', correct: false },
    ],
  },
  {
    id: 'eq10',
    text: 'Какой из инструментов НЕ используется для создания AI-модели?',
    options: [
      { id: 'eq10a', text: 'Mysnapface', correct: false },
      { id: 'eq10b', text: 'Nano Banana', correct: false },
      { id: 'eq10c', text: 'Higgsfield', correct: false },
      { id: 'eq10d', text: 'Substy', correct: true },
    ],
  },
  // ── Модуль 2: Контент ───────────────────────────────────────────────────
  {
    id: 'eq11',
    text: 'Какова логика продвижения видео алгоритмами TikTok и Instagram?',
    options: [
      { id: 'eq11a', text: 'Больше лайков → больше показов', correct: false },
      { id: 'eq11b', text: 'Видео похоже на настоящее → больше времени просмотра → алгоритм продвигает', correct: true },
      { id: 'eq11c', text: 'Чем больше хештегов → тем выше охват', correct: false },
      { id: 'eq11d', text: 'Частота публикаций важнее качества', correct: false },
    ],
  },
  {
    id: 'eq12',
    text: 'Почему lip sync стабильно работает на всех платформах?',
    options: [
      { id: 'eq12a', text: 'Это самый популярный формат у знаменитостей', correct: false },
      { id: 'eq12b', text: 'Высокий retention, быстрые просмотры, алгоритмы воспринимают как живой контент', correct: true },
      { id: 'eq12c', text: 'Его проще всего создавать без специальных инструментов', correct: false },
      { id: 'eq12d', text: 'Требует меньше всего редактирования', correct: false },
    ],
  },
  {
    id: 'eq13',
    text: 'Какова оптимальная длина видео для Reels и Shorts?',
    options: [
      { id: 'eq13a', text: '1–5 секунд', correct: false },
      { id: 'eq13b', text: '15–30 секунд', correct: true },
      { id: 'eq13c', text: '1–2 минуты', correct: false },
      { id: 'eq13d', text: '5–10 минут', correct: false },
    ],
  },
  {
    id: 'eq14',
    text: 'Что нужно обязательно сделать перед публикацией фото или видео?',
    options: [
      { id: 'eq14a', text: 'Добавить водяной знак с никнеймом', correct: false },
      { id: 'eq14b', text: 'Получить одобрение в тематическом сообществе', correct: false },
      { id: 'eq14c', text: 'Удалить метаданные', correct: true },
      { id: 'eq14d', text: 'Добавить трендовые хештеги', correct: false },
    ],
  },
  {
    id: 'eq15',
    text: 'Какое ключевое правило работы с трендами для AI-модели?',
    options: [
      { id: 'eq15a', text: 'Создавай только уникальный контент, которого нет у других', correct: false },
      { id: 'eq15b', text: 'Бери то, что уже работает у других, и делай то же самое со своей моделью', correct: true },
      { id: 'eq15c', text: 'Тренды работают только для живых блогеров, не для AI', correct: false },
      { id: 'eq15d', text: 'Снимай тренды только при наличии 10 000+ подписчиков', correct: false },
    ],
  },
  {
    id: 'eq16',
    text: 'Главное правило написания промтов для Kling AI?',
    options: [
      { id: 'eq16a', text: 'Чем подробнее и больше действий в одном промте — тем реалистичнее результат', correct: false },
      { id: 'eq16b', text: 'Одно действие = один промт', correct: true },
      { id: 'eq16c', text: 'Промт должен содержать минимум 200 слов', correct: false },
      { id: 'eq16d', text: 'Обязательно указывать цвет фона и освещение', correct: false },
    ],
  },
  // ── Модуль 3: Трафик ────────────────────────────────────────────────────
  {
    id: 'eq17',
    text: 'Почему систему трафика начинают выстраивать с TikTok?',
    options: [
      { id: 'eq17a', text: 'TikTok выплачивает больше всего за просмотры', correct: false },
      { id: 'eq17b', text: 'Алгоритм продвигает новые аккаунты без подписчиков при регулярных публикациях', correct: true },
      { id: 'eq17c', text: 'В TikTok самая молодая и платёжеспособная аудитория', correct: false },
      { id: 'eq17d', text: 'TikTok — единственная платформа без ограничений по контенту', correct: false },
    ],
  },
  {
    id: 'eq18',
    text: 'Какой контент допустим в TikTok для AI-моделей согласно курсу?',
    options: [
      { id: 'eq18a', text: 'Любой контент — алгоритм сам фильтрует', correct: false },
      { id: 'eq18b', text: '18+ контент для быстрой монетизации', correct: false },
      { id: 'eq18c', text: 'Только безопасный контент — танцы и видео где модель одета', correct: true },
      { id: 'eq18d', text: 'Только образовательный и информационный контент', correct: false },
    ],
  },
  {
    id: 'eq19',
    text: 'Что нужно делать в первые 2 дня прогрева аккаунта Instagram?',
    options: [
      { id: 'eq19a', text: 'Опубликовать 5–10 постов для заполнения профиля', correct: false },
      { id: 'eq19b', text: 'Только просматривать ленту 20–30 минут, никаких публикаций и ссылок', correct: true },
      { id: 'eq19c', text: 'Подписаться на 100+ аккаунтов для роста', correct: false },
      { id: 'eq19d', text: 'Сразу добавить ссылку в bio и настроить профиль', correct: false },
    ],
  },
  {
    id: 'eq20',
    text: 'С какого дня прогрева Instagram можно начинать публиковать Reels?',
    options: [
      { id: 'eq20a', text: 'С первого дня', correct: false },
      { id: 'eq20b', text: 'С 5-го дня', correct: false },
      { id: 'eq20c', text: 'С 10-го дня', correct: true },
      { id: 'eq20d', text: 'Только после 30 дней', correct: false },
    ],
  },
  {
    id: 'eq21',
    text: 'Как правильно проверить качество прокси через scamalytics.com?',
    options: [
      { id: 'eq21a', text: 'Все квадраты должны быть красными — это показатель анонимности', correct: false },
      { id: 'eq21b', text: 'Максимум два зелёных квадрата, в разделе Datacenter — No', correct: true },
      { id: 'eq21c', text: 'Datacenter: Yes — признак хорошего прокси', correct: false },
      { id: 'eq21d', text: 'Цвет квадратов не важен, важна только скорость соединения', correct: false },
    ],
  },
  {
    id: 'eq22',
    text: 'Что такое Linktree в контексте системы трафика?',
    options: [
      { id: 'eq22a', text: 'Инструмент для генерации AI-фото', correct: false },
      { id: 'eq22b', text: 'Платформа для монетизации контента', correct: false },
      { id: 'eq22c', text: 'Единая точка входа для аудитории из всех платформ', correct: true },
      { id: 'eq22d', text: 'CRM-система для управления подписчиками', correct: false },
    ],
  },
  {
    id: 'eq23',
    text: 'Куда направляется весь трафик из TikTok на старте системы?',
    options: [
      { id: 'eq23a', text: 'Напрямую на страницу Fanvue', correct: false },
      { id: 'eq23b', text: 'В Instagram', correct: true },
      { id: 'eq23c', text: 'В Telegram-канал', correct: false },
      { id: 'eq23d', text: 'На личный сайт или лендинг', correct: false },
    ],
  },
  // ── Модуль 4: Монетизация ────────────────────────────────────────────────
  {
    id: 'eq24',
    text: 'Что является главным драйвером платежей на Fanvue?',
    options: [
      { id: 'eq24a', text: 'Количество фото и видео в профиле', correct: false },
      { id: 'eq24b', text: 'Количество подписчиков', correct: false },
      { id: 'eq24c', text: 'Эмоциональная вовлечённость и ощущение уникальной связи с моделью', correct: true },
      { id: 'eq24d', text: 'Частота выхода нового контента', correct: false },
    ],
  },
  {
    id: 'eq25',
    text: 'Какую проблему решает CRM Substy?',
    options: [
      { id: 'eq25a', text: 'Генерацию AI-контента для Fanvue', correct: false },
      { id: 'eq25b', text: 'Автоматизирует переписку, контролирует подписки и выплаты, убирает ручной хаос', correct: true },
      { id: 'eq25c', text: 'Верификацию аккаунта на Fanvue', correct: false },
      { id: 'eq25d', text: 'Создание и хранение AI-моделей', correct: false },
    ],
  },
  {
    id: 'eq26',
    text: 'Что нужно для регистрации и прохождения KYC на Fanvue?',
    options: [
      { id: 'eq26a', text: 'Только email и пароль', correct: false },
      { id: 'eq26b', text: 'Паспорт/ID, селфи с лицом, документ с адресом', correct: true },
      { id: 'eq26c', text: 'Только действующая банковская карта', correct: false },
      { id: 'eq26d', text: 'Приглашение от существующего пользователя платформы', correct: false },
    ],
  },
  // ── Модуль 5: Масштабирование ────────────────────────────────────────────
  {
    id: 'eq27',
    text: 'Что такое Vosskres Affiliate System?',
    options: [
      { id: 'eq27a', text: 'Инструмент для генерации AI-видео', correct: false },
      { id: 'eq27b', text: 'Партнёрская программа для заработка на развитии AI-блогеров в экосистеме Vosskres', correct: true },
      { id: 'eq27c', text: 'CRM-система для управления подписчиками', correct: false },
      { id: 'eq27d', text: 'Платформа для публикации 18+ контента', correct: false },
    ],
  },
  {
    id: 'eq28',
    text: 'Какие инструменты используются для создания 18+ контента?',
    options: [
      { id: 'eq28a', text: 'TikTok, Instagram, YouTube Shorts', correct: false },
      { id: 'eq28b', text: 'Higgsfield, Kling.ai, CapCut', correct: false },
      { id: 'eq28c', text: 'GenTomato, Xmode, ZenCreators', correct: true },
      { id: 'eq28d', text: 'Substy, Fanvue, Linktree', correct: false },
    ],
  },
  {
    id: 'eq29',
    text: 'Чем масштабирование отличается от простого увеличения объёма работы?',
    options: [
      { id: 'eq29a', text: 'Масштабирование требует значительно больше бюджета на рекламу', correct: false },
      { id: 'eq29b', text: 'Превращение хаотичных действий в повторяемый процесс с делегированием', correct: true },
      { id: 'eq29c', text: 'Масштабирование означает обязательный найм команды сотрудников', correct: false },
      { id: 'eq29d', text: 'Нужно создать более 10 AI-моделей одновременно', correct: false },
    ],
  },
  {
    id: 'eq30',
    text: 'Сколько первых $__________ может принести один правильный вирусный ролик в первые дни по данным курса?',
    options: [
      { id: 'eq30a', text: '$50', correct: false },
      { id: 'eq30b', text: '$180+', correct: true },
      { id: 'eq30c', text: '$500', correct: false },
      { id: 'eq30d', text: '$1000', correct: false },
    ],
  },
];

export const EXAM_CONFIG = {
  totalQuestions: 30,
  passThreshold: 26,
  timeLimitMinutes: 45,
  firstFailBlockHours: 24,
};

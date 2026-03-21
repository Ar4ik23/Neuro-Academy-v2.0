import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { message, context } = await req.json();

  const key = process.env.ARTEMIUS_API_KEY;

  if (!key) {
    return NextResponse.json({ reply: 'API ключ не настроен' }, { status: 500 });
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${key}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `Ты — Franklin, AI-помощник курса по заработку на AI-моделях. Отвечай кратко, по делу, на русском языке. Будь дружелюбным и поддерживающим. Контекст урока: ${context || 'не указан'}`,
          },
          { role: 'user', content: message },
        ],
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('OpenAI error:', data);
      return NextResponse.json({ reply: `Ошибка OpenAI: ${data.error?.message || response.status}` }, { status: 500 });
    }

    const reply = data.choices?.[0]?.message?.content || 'Не удалось получить ответ';
    return NextResponse.json({ reply });
  } catch (err) {
    console.error('Artemius fetch error:', err);
    return NextResponse.json({ reply: 'Ошибка при обращении к AI' }, { status: 500 });
  }
}

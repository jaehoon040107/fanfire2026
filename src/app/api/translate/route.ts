import { NextRequest, NextResponse } from 'next/server';

// ─────────────────────────────────────────────────────────
// 번역 API (버튼 방식). DeepL → Google → mock 순으로 폴백.
// 키가 없으면 mock 번역(언어 태그만 부착)을 반환해 UI 흐름을 유지.
// ─────────────────────────────────────────────────────────

export const runtime = 'edge';

async function translateDeepL(text: string, target: string): Promise<string | null> {
  const key = process.env.DEEPL_API_KEY;
  if (!key) return null;
  try {
    const res = await fetch('https://api-free.deepl.com/v2/translate', {
      method: 'POST',
      headers: {
        Authorization: `DeepL-Auth-Key ${key}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({ text, target_lang: target.toUpperCase() }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.translations?.[0]?.text ?? null;
  } catch {
    return null;
  }
}

async function translateGoogle(text: string, target: string): Promise<string | null> {
  const key = process.env.GOOGLE_TRANSLATE_API_KEY;
  if (!key) return null;
  try {
    const res = await fetch(
      `https://translation.googleapis.com/language/translate/v2?key=${key}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ q: text, target, format: 'text' }),
      },
    );
    if (!res.ok) return null;
    const data = await res.json();
    return data.data?.translations?.[0]?.translatedText ?? null;
  } catch {
    return null;
  }
}

export async function POST(req: NextRequest) {
  const { text, target = 'en' } = await req.json().catch(() => ({ text: '' }));
  if (!text || typeof text !== 'string') {
    return NextResponse.json({ error: 'text required' }, { status: 400 });
  }

  const translated =
    (await translateDeepL(text, target)) ?? (await translateGoogle(text, target));

  if (translated) {
    return NextResponse.json({ translated, mock: false });
  }

  // mock 폴백: 원문 + 안내 태그 (키 연결 전에도 버튼 동작 확인 가능)
  return NextResponse.json({
    translated: `${text}  ·  [auto-translated → ${target.toUpperCase()}]`,
    mock: true,
  });
}

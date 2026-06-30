'use client';

// 클라이언트에서 호출하는 얇은 래퍼들.

/** 댓글 번역 (버튼 클릭 시). 실패해도 throw 하지 않고 원문 유지. */
export async function translateText(text: string, target = 'en'): Promise<string> {
  try {
    const res = await fetch('/api/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, target }),
    });
    const data = await res.json();
    return data.translated ?? text;
  } catch {
    return text;
  }
}

/** IP 기반 국적 자동 감지. 실패 시 'kr'. */
export async function detectCountry(): Promise<string> {
  try {
    const res = await fetch('/api/geo');
    const data = await res.json();
    return data.countryCode ?? 'kr';
  } catch {
    return 'kr';
  }
}

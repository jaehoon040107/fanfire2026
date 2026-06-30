import { NextRequest, NextResponse } from 'next/server';

// ─────────────────────────────────────────────────────────
// IP 기반 국적 자동 감지.
// Vercel 은 요청 헤더(x-vercel-ip-country)로 국가코드를 제공.
// 로컬/미지원 환경에서는 'kr' 기본값 반환 → 유저가 온보딩에서 수정 가능.
// ─────────────────────────────────────────────────────────

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  // Vercel Edge / 일부 CDN 이 주입하는 헤더
  const country =
    req.headers.get('x-vercel-ip-country') ??
    req.headers.get('cf-ipcountry') ?? // Cloudflare
    null;

  if (country && country !== 'XX') {
    return NextResponse.json({ countryCode: country.toLowerCase(), source: 'header' });
  }

  // 폴백: 로컬 개발 등 헤더가 없을 때
  return NextResponse.json({ countryCode: 'kr', source: 'default' });
}

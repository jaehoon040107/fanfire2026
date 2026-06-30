// 국적 선택용 국가 목록 (ISO alpha-2 lowercase + display name).
// 월드컵 본선 진출국 + 주요 시청국을 우선 노출.

export interface Country {
  code: string; // alpha-2 lowercase (flagcdn 호환)
  name: string;
}

export const COUNTRIES: Country[] = [
  { code: 'kr', name: 'South Korea' },
  { code: 'us', name: 'United States' },
  { code: 'gb', name: 'United Kingdom' },
  { code: 'br', name: 'Brazil' },
  { code: 'ar', name: 'Argentina' },
  { code: 'fr', name: 'France' },
  { code: 'de', name: 'Germany' },
  { code: 'es', name: 'Spain' },
  { code: 'pt', name: 'Portugal' },
  { code: 'it', name: 'Italy' },
  { code: 'nl', name: 'Netherlands' },
  { code: 'be', name: 'Belgium' },
  { code: 'hr', name: 'Croatia' },
  { code: 'jp', name: 'Japan' },
  { code: 'mx', name: 'Mexico' },
  { code: 'ca', name: 'Canada' },
  { code: 'uy', name: 'Uruguay' },
  { code: 'co', name: 'Colombia' },
  { code: 'sn', name: 'Senegal' },
  { code: 'ma', name: 'Morocco' },
  { code: 'gh', name: 'Ghana' },
  { code: 'ng', name: 'Nigeria' },
  { code: 'cm', name: 'Cameroon' },
  { code: 'au', name: 'Australia' },
  { code: 'sa', name: 'Saudi Arabia' },
  { code: 'ir', name: 'Iran' },
  { code: 'pl', name: 'Poland' },
  { code: 'rs', name: 'Serbia' },
  { code: 'ch', name: 'Switzerland' },
  { code: 'dk', name: 'Denmark' },
  { code: 'ec', name: 'Ecuador' },
  { code: 'qa', name: 'Qatar' },
  { code: 'cr', name: 'Costa Rica' },
  { code: 'tn', name: 'Tunisia' },
  { code: 'in', name: 'India' },
  { code: 'id', name: 'Indonesia' },
  { code: 'cn', name: 'China' },
  { code: 'th', name: 'Thailand' },
  { code: 'vn', name: 'Vietnam' },
  { code: 'ph', name: 'Philippines' },
  { code: 'tr', name: 'Türkiye' },
  { code: 'eg', name: 'Egypt' },
  { code: 'za', name: 'South Africa' },
  { code: 'se', name: 'Sweden' },
  { code: 'no', name: 'Norway' },
];

export const COUNTRY_MAP: Record<string, Country> = COUNTRIES.reduce(
  (acc, c) => ({ ...acc, [c.code]: c }),
  {} as Record<string, Country>,
);

export function countryName(code: string): string {
  return COUNTRY_MAP[code]?.name ?? code.toUpperCase();
}

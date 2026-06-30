'use client';

import { flagUrl } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface FlagProps {
  code: string; // ISO alpha-2 (또는 gb-eng 등 flagcdn 지원 코드)
  size?: number; // px (height)
  rounded?: boolean;
  className?: string;
}

/** 국기 이미지. flagcdn 사용, 실패 시 코드 텍스트로 폴백. */
export function Flag({ code, size = 20, rounded = true, className }: FlagProps) {
  const width = Math.round(size * 1.5);
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={flagUrl(code, size <= 20 ? 'w40' : 'w80')}
      alt={code.toUpperCase()}
      width={width}
      height={size}
      loading="lazy"
      className={cn(
        'inline-block shrink-0 object-cover shadow-soft',
        rounded ? 'rounded-[3px]' : '',
        className,
      )}
      style={{ width, height: size }}
      onError={(e) => {
        (e.currentTarget as HTMLImageElement).style.display = 'none';
      }}
    />
  );
}

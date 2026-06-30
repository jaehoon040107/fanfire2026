'use client';

import { useEffect, useState } from 'react';

/** 상대시간 갱신용 현재 시각. 기본 30초마다 tick. (SSR 안전: 0 → 마운트 후 채움) */
export function useNow(intervalMs = 30_000): number {
  const [now, setNow] = useState(0);
  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);
  return now || Date.now();
}

'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { Comment, ReactionType } from '@/types';
import { buildSeedComments, INCOMING_POOL } from '@/data/comments';
import { getSupabase, isSupabaseLive } from '@/lib/supabase';

// ─────────────────────────────────────────────────────────
// 실시간 댓글 피드 훅.
// - mock 모드: 시드 + 주기적 가짜 인커밍 댓글로 "방송 채팅" 느낌 재현.
// - live 모드: Supabase Realtime 구독 (insert 이벤트 수신).
// matchId 가 주어지면 해당 경기만, 없으면 전체 글로벌 피드.
// ─────────────────────────────────────────────────────────

let incomingCounter = 0;

export function useLiveFeed(matchId?: string) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [mounted, setMounted] = useState(false);
  const poolIdx = useRef(0);

  // 초기 시드 (클라이언트에서만 → 하이드레이션 안전)
  useEffect(() => {
    const now = Date.now();
    const seed = buildSeedComments(now).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
    setComments(seed);
    setMounted(true);
  }, []);

  // 가짜 인커밍 (mock 모드 전용)
  useEffect(() => {
    if (isSupabaseLive) return;
    const interval = setInterval(() => {
      const pool = matchId
        ? INCOMING_POOL.filter((c) => c.matchId === matchId)
        : INCOMING_POOL;
      if (pool.length === 0) return;
      const pick = pool[poolIdx.current % pool.length];
      poolIdx.current += 1;
      const newComment: Comment = {
        id: `live-${incomingCounter++}`,
        userId: `live-${pick.nickname}`,
        matchId: pick.matchId,
        nickname: pick.nickname,
        countryCode: pick.countryCode,
        body: pick.body,
        createdAt: new Date().toISOString(),
        reactions: {},
      };
      setComments((prev) => [newComment, ...prev].slice(0, 200));
    }, 4500);
    return () => clearInterval(interval);
  }, [matchId]);

  // Supabase Realtime 구독 (live 모드)
  useEffect(() => {
    if (!isSupabaseLive) return;
    const supabase = getSupabase();
    if (!supabase) return;
    const channel = supabase
      .channel(`comments${matchId ? `-${matchId}` : ''}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'comments',
          ...(matchId ? { filter: `match_id=eq.${matchId}` } : {}),
        },
        (payload) => {
          const r = payload.new as any;
          const c: Comment = {
            id: r.id,
            userId: r.user_id,
            matchId: r.match_id,
            nickname: r.nickname,
            countryCode: r.country_code,
            body: r.body,
            createdAt: r.created_at,
            reactions: {},
          };
          setComments((prev) => [c, ...prev].slice(0, 200));
        },
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [matchId]);

  const addComment = useCallback(
    (c: Omit<Comment, 'id' | 'createdAt' | 'reactions'>) => {
      const newComment: Comment = {
        ...c,
        id: `me-${incomingCounter++}`,
        createdAt: new Date().toISOString(),
        reactions: {},
      };
      setComments((prev) => [newComment, ...prev]);
      // live 모드: Supabase 에 insert (실패해도 로컬 표시는 유지)
      if (isSupabaseLive) {
        const supabase = getSupabase();
        supabase
          ?.from('comments')
          .insert({
            user_id: c.userId,
            match_id: c.matchId,
            nickname: c.nickname,
            country_code: c.countryCode,
            body: c.body,
          })
          .then(({ error }) => error && console.error('[comment insert]', error));
      }
      return newComment;
    },
    [],
  );

  const reactToComment = useCallback(
    (commentId: string, type: ReactionType, delta: 1 | -1) => {
      setComments((prev) =>
        prev.map((c) =>
          c.id === commentId
            ? {
                ...c,
                reactions: {
                  ...c.reactions,
                  [type]: Math.max(0, (c.reactions[type] ?? 0) + delta),
                },
              }
            : c,
        ),
      );
    },
    [],
  );

  const filtered = matchId
    ? comments.filter((c) => c.matchId === matchId)
    : comments;

  return { comments: filtered, addComment, reactToComment, mounted };
}

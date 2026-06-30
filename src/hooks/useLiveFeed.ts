'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { Comment, ReactionType } from '@/types';
import { buildSeedComments, INCOMING_POOL } from '@/data/comments';
import { isSupabaseLive, getSupabase } from '@/lib/supabase';
import { fetchComments, insertComment } from '@/lib/db';

// ─────────────────────────────────────────────────────────
// 실시간 댓글 피드 훅.
// - mock 모드: 시드 + 주기적 가짜 인커밍 댓글로 "방송 채팅" 느낌 재현.
// - live 모드: DB 기존 댓글 로드 → Supabase Realtime 구독(신규 insert 수신).
// matchId 가 주어지면 해당 경기만, 없으면 전체 글로벌 피드.
// ─────────────────────────────────────────────────────────

let incomingCounter = 0;

export function useLiveFeed(matchId?: string) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [mounted, setMounted] = useState(false);
  const poolIdx = useRef(0);

  // 초기 로드 (클라이언트에서만 → 하이드레이션 안전)
  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (isSupabaseLive) {
        // live: 실제 DB 댓글 히스토리
        const existing = await fetchComments(matchId);
        if (!cancelled) {
          setComments(existing);
          setMounted(true);
        }
      } else {
        // mock: 시드 댓글
        const now = Date.now();
        const seed = buildSeedComments(now).sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );
        if (!cancelled) {
          setComments(seed);
          setMounted(true);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [matchId]);

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
          ...(matchId && matchId !== 'global'
            ? { filter: `match_id=eq.${matchId}` }
            : {}),
        },
        (payload) => {
          const r = payload.new as any;
          const c: Comment = {
            id: r.id,
            userId: r.user_id,
            matchId: r.match_id ?? 'global',
            nickname: r.nickname,
            countryCode: r.country_code,
            body: r.body,
            createdAt: r.created_at,
            reactions: {},
          };
          // 내가 방금 올린 댓글의 에코는 id 중복으로 걸러진다.
          setComments((prev) =>
            prev.some((x) => x.id === c.id) ? prev : [c, ...prev].slice(0, 200),
          );
        },
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [matchId]);

  const addComment = useCallback(
    (c: Omit<Comment, 'id' | 'createdAt' | 'reactions'>) => {
      const tempId = `me-${incomingCounter++}`;
      const optimistic: Comment = {
        ...c,
        id: tempId,
        createdAt: new Date().toISOString(),
        reactions: {},
      };
      setComments((prev) => [optimistic, ...prev]);

      // live 모드: DB 저장 후 임시 id 를 실제 uuid 로 교체(에코 중복 방지)
      if (isSupabaseLive) {
        insertComment({
          userId: c.userId,
          matchId: c.matchId,
          nickname: c.nickname,
          countryCode: c.countryCode,
          body: c.body,
        }).then((saved) => {
          if (!saved) return;
          setComments((prev) => {
            // 실제 행이 이미 realtime 으로 들어왔으면 임시본만 제거
            if (prev.some((x) => x.id === saved.id)) {
              return prev.filter((x) => x.id !== tempId);
            }
            return prev.map((x) => (x.id === tempId ? saved : x));
          });
        });
      }
      return optimistic;
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

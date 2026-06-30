import { fetchMatches } from '@/lib/football-api';
import { HomeClient } from '@/components/HomeClient';

// 싱글 페이지. 서버에서 경기 데이터를 받아(mock/live 자동) 클라이언트로 전달.
export const dynamic = 'force-dynamic';

export default async function Page() {
  const matches = await fetchMatches();
  return <HomeClient matches={matches} />;
}

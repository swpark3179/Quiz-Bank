/**
 * 카테고리별 정답률 통계 쿼리
 */

import { getDatabase } from './schema';

export interface SessionStat {
  session_id: string;
  created_at: number;
  total: number;
  correct: number;
  accuracy: number; // 0.0 ~ 1.0
}

export interface CategorySummary {
  totalSessions: number;
  totalQuestions: number;
  totalCorrect: number;
  overallAccuracy: number;
  recentAccuracy: number; // 최근 5회 평균
}

/** 카테고리별 차수별 정답률 목록 (차트용, 오래된 순) */
export async function fetchSessionStats(categoryId: string): Promise<SessionStat[]> {
  const db = await getDatabase();
  const rows = await db.getAllAsync<{
    session_id: string;
    created_at: number;
    total: number;
    correct: number;
  }>(
    `SELECT id as session_id, created_at, total, correct
     FROM sessions
     WHERE category_id = ?
     ORDER BY created_at ASC`,
    [categoryId]
  );

  return rows.map((r) => ({
    ...r,
    accuracy: r.total > 0 ? r.correct / r.total : 0,
  }));
}

/** 카테고리 전체 요약 통계 */
export async function fetchCategorySummary(categoryId: string): Promise<CategorySummary> {
  const db = await getDatabase();

  const agg = await db.getFirstAsync<{
    totalSessions: number;
    totalQuestions: number;
    totalCorrect: number;
  }>(
    `SELECT COUNT(*) as totalSessions, SUM(total) as totalQuestions, SUM(correct) as totalCorrect
     FROM sessions WHERE category_id = ?`,
    [categoryId]
  );

  const recent = await db.getAllAsync<{ correct: number; total: number }>(
    `SELECT correct, total FROM sessions WHERE category_id = ? ORDER BY created_at DESC LIMIT 5`,
    [categoryId]
  );

  const recentTotal = recent.reduce((s, r) => s + r.total, 0);
  const recentCorrect = recent.reduce((s, r) => s + r.correct, 0);

  return {
    totalSessions: agg?.totalSessions ?? 0,
    totalQuestions: agg?.totalQuestions ?? 0,
    totalCorrect: agg?.totalCorrect ?? 0,
    overallAccuracy:
      (agg?.totalQuestions ?? 0) > 0
        ? (agg?.totalCorrect ?? 0) / (agg?.totalQuestions ?? 0)
        : 0,
    recentAccuracy: recentTotal > 0 ? recentCorrect / recentTotal : 0,
  };
}

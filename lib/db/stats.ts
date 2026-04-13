/**
 * 카테고리별 정답률 통계 쿼리
 */

import { getDatabase } from './schema';

export interface QuestionStat {
  source_file_id: string;
  question_id: number;
  total_attempts: number;
  correct_attempts: number;
  accuracy: number; // 0.0 ~ 1.0
}

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

/** 전체 카테고리 요약 통계 일괄 로드 (N+1 최적화) */
export async function fetchAllCategorySummaries(
  categoryIds: string[]
): Promise<Record<string, { accuracy: number; sessions: number }>> {
  const db = await getDatabase();

  const result: Record<string, { accuracy: number; sessions: number }> = {};
  // 카테고리별 초기값 설정 (세션이 없는 경우 대비)
  for (const id of categoryIds) {
    result[id] = { accuracy: 0, sessions: 0 };
  }

  // GROUP BY를 사용하여 DB 레벨에서 집계 (전체 로드 X)
  const aggRows = await db.getAllAsync<{
    category_id: string;
    totalSessions: number;
    totalQuestions: number;
    totalCorrect: number;
  }>(
    `SELECT category_id, COUNT(*) as totalSessions, SUM(total) as totalQuestions, SUM(correct) as totalCorrect
     FROM sessions
     GROUP BY category_id`
  );

  for (const row of aggRows) {
    if (result[row.category_id]) {
      result[row.category_id] = {
        sessions: row.totalSessions,
        accuracy: row.totalQuestions > 0 ? row.totalCorrect / row.totalQuestions : 0,
      };
    }
  }

  return result;
}

/** 파일별 문제 정답률 통계 로드 */
export async function fetchQuestionStats(
  sourceFileIds: string[]
): Promise<QuestionStat[]> {
  if (sourceFileIds.length === 0) return [];

  const db = await getDatabase();
  const placeholders = sourceFileIds.map(() => '?').join(',');

  const rows = await db.getAllAsync<{
    source_file_id: string;
    question_id: number;
    total_attempts: number;
    correct_attempts: number;
  }>(
    `SELECT source_file_id, question_id, COUNT(*) as total_attempts, SUM(is_correct) as correct_attempts
     FROM answers
     WHERE source_file_id IN (${placeholders})
     GROUP BY source_file_id, question_id
     ORDER BY source_file_id ASC, question_id ASC`,
    sourceFileIds
  );

  return rows.map((r) => ({
    ...r,
    accuracy: r.total_attempts > 0 ? r.correct_attempts / r.total_attempts : 0,
  }));
}

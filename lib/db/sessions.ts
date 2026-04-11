/**
 * 퀴즈 세션(차수) CRUD 작업
 */

import { getDatabase } from './schema';

export interface SessionRow {
  id: string;
  category_id: string;
  source_file_ids: string; // JSON string
  total: number;
  correct: number;
  mode: 'immediate' | 'deferred';
  created_at: number;
}

export interface AnswerRow {
  id: string;
  session_id: string;
  question_id: number;
  source_file_id: string;
  question_text: string;
  chosen_index: number | null;
  correct_index: number;
  is_correct: 0 | 1;
}

/** 새 세션 생성 */
export async function createSession(params: {
  id: string;
  categoryId: string;
  sourceFileIds: string[];
  total: number;
  mode: 'immediate' | 'deferred';
}): Promise<void> {
  const db = await getDatabase();
  await db.runAsync(
    `INSERT INTO sessions (id, category_id, source_file_ids, total, correct, mode, created_at)
     VALUES (?, ?, ?, ?, 0, ?, ?)`,
    [
      params.id,
      params.categoryId,
      JSON.stringify(params.sourceFileIds),
      params.total,
      params.mode,
      Date.now(),
    ]
  );
}

/** 개별 응답 저장 */
export async function saveAnswer(params: {
  id: string;
  sessionId: string;
  questionId: number;
  sourceFileId: string;
  questionText: string;
  chosenIndex: number | null;
  correctIndex: number;
  isCorrect: boolean;
}): Promise<void> {
  const db = await getDatabase();
  await db.runAsync(
    `INSERT INTO answers
       (id, session_id, question_id, source_file_id, question_text, chosen_index, correct_index, is_correct)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      params.id,
      params.sessionId,
      params.questionId,
      params.sourceFileId,
      params.questionText,
      params.chosenIndex ?? null,
      params.correctIndex,
      params.isCorrect ? 1 : 0,
    ]
  );
}

/** 세션의 정답 수 업데이트 */
export async function updateSessionCorrect(sessionId: string, correct: number): Promise<void> {
  const db = await getDatabase();
  await db.runAsync(`UPDATE sessions SET correct = ? WHERE id = ?`, [correct, sessionId]);
}

/** 카테고리별 세션 목록 조회 (최신순) */
export async function fetchSessions(categoryId: string): Promise<SessionRow[]> {
  const db = await getDatabase();
  return db.getAllAsync<SessionRow>(
    `SELECT * FROM sessions WHERE category_id = ? ORDER BY created_at DESC`,
    [categoryId]
  );
}

/** 전체 세션 목록 조회 (최신순) */
export async function fetchAllSessions(): Promise<SessionRow[]> {
  const db = await getDatabase();
  return db.getAllAsync<SessionRow>(
    `SELECT * FROM sessions ORDER BY created_at DESC`
  );
}

/** 세션 상세 조회 */
export async function fetchSession(sessionId: string): Promise<SessionRow | null> {
  const db = await getDatabase();
  return db.getFirstAsync<SessionRow>(
    `SELECT * FROM sessions WHERE id = ?`,
    [sessionId]
  );
}

/** 세션 내 모든 응답 조회 */
export async function fetchAnswers(sessionId: string): Promise<AnswerRow[]> {
  const db = await getDatabase();
  return db.getAllAsync<AnswerRow>(
    `SELECT * FROM answers WHERE session_id = ? ORDER BY question_id ASC`,
    [sessionId]
  );
}

/** 세션 내 오답만 조회 */
export async function fetchWrongAnswers(sessionId: string): Promise<AnswerRow[]> {
  const db = await getDatabase();
  return db.getAllAsync<AnswerRow>(
    `SELECT * FROM answers WHERE session_id = ? AND is_correct = 0`,
    [sessionId]
  );
}

/** 세션 삭제 */
export async function deleteSession(sessionId: string): Promise<void> {
  const db = await getDatabase();
  await db.runAsync(`DELETE FROM sessions WHERE id = ?`, [sessionId]);
}

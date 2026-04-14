/**
 * SQLite 데이터베이스 스키마 초기화
 *
 * 테이블:
 * - sessions: 퀴즈 풀이 차수 기록
 * - answers: 차수 내 개별 문제 응답 결과
 */

import * as SQLite from 'expo-sqlite';

let db: SQLite.SQLiteDatabase | null = null;

export async function getDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (db) return db;
  db = await SQLite.openDatabaseAsync('quiz-bank.db');
  await initializeSchema(db);
  return db;
}

async function initializeSchema(database: SQLite.SQLiteDatabase): Promise<void> {
  await database.execAsync(`
    PRAGMA journal_mode = WAL;
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS sessions (
      id          TEXT PRIMARY KEY,
      category_id TEXT NOT NULL,
      -- JSON array of file IDs used in this session
      source_file_ids TEXT NOT NULL DEFAULT '[]',
      total       INTEGER NOT NULL,
      correct     INTEGER NOT NULL,
      -- 'immediate' | 'deferred'
      mode        TEXT NOT NULL DEFAULT 'deferred',
      created_at  INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS answers (
      id           TEXT PRIMARY KEY,
      session_id   TEXT NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
      -- 원래 문제 번호 (파일 내 순서, 1-indexed)
      question_id  INTEGER NOT NULL,
      source_file_id TEXT NOT NULL,
      -- 문제 텍스트 (다시 풀기 시 파일 로드 없이 표시용)
      question_text TEXT NOT NULL DEFAULT '',
      -- JSON: 선택한 보기 인덱스 (0-based, 단일이지만 배열로 통일)
      chosen_index INTEGER,
      -- 정답 보기 인덱스 (0-based, 원래 순서 기준)
      correct_index INTEGER NOT NULL,
      is_correct   INTEGER NOT NULL DEFAULT 0,
      explanation  TEXT NOT NULL DEFAULT '',
      correct_label TEXT NOT NULL DEFAULT '',
      -- 섞인 후의 정답 인덱스 (0-based)
      mapped_correct_index INTEGER
    );

    CREATE INDEX IF NOT EXISTS idx_answers_session ON answers(session_id);
    CREATE INDEX IF NOT EXISTS idx_sessions_category ON sessions(category_id);
    CREATE INDEX IF NOT EXISTS idx_sessions_created ON sessions(created_at DESC);
  `);

  try {
    await database.execAsync(`ALTER TABLE answers ADD COLUMN explanation TEXT DEFAULT ''`);
  } catch (e) {
    // Ignore if column already exists
  }

  try {
    await database.execAsync(`ALTER TABLE answers ADD COLUMN correct_label TEXT DEFAULT ''`);
  } catch (e) {
    // Ignore if column already exists
  }

  try {
    await database.execAsync(`ALTER TABLE answers ADD COLUMN mapped_correct_index INTEGER`);
  } catch (e) {
    // Ignore if column already exists
  }
}

/** DB 연결 닫기 (앱 종료 시) */
export async function closeDatabase(): Promise<void> {
  if (db) {
    await db.closeAsync();
    db = null;
  }
}

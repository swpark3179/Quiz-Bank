/**
 * SQLite 데이터베이스 스키마 초기화
 *
 * 테이블:
 * - sessions: 퀴즈 풀이 차수 기록
 * - answers: 차수 내 개별 문제 응답 결과
 */

import * as SQLite from 'expo-sqlite';

const DATABASE_NAME = 'quiz-bank.db';

// 진행 중이거나 끝난 초기화. 여러 곳에서 동시에 불러도 DB 를 한 번만 열고 초기화한다.
let dbPromise: Promise<SQLite.SQLiteDatabase> | null = null;

/**
 * 초기화가 끝난 DB 연결을 반환한다.
 *
 * 초기화가 실패하면 상태를 비워 둔다. 그래야 "다시 시도" 가 테이블이 없는
 * 연결을 재사용하지 않고 처음부터 다시 연다.
 */
export function getDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (!dbPromise) {
    const attempt = openDatabase();
    dbPromise = attempt;
    attempt.catch(() => {
      if (dbPromise === attempt) dbPromise = null;
    });
  }
  return dbPromise;
}

/** SQLITE_CORRUPT / SQLITE_NOTADB 인지 (오류 코드 대신 SQLite 메시지로 판별) */
export function isCorruptionError(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error);
  return /database disk image is malformed|file is not a database/i.test(message);
}

async function openDatabase(): Promise<SQLite.SQLiteDatabase> {
  try {
    return await openAndInitialize();
  } catch (e) {
    if (!isCorruptionError(e)) throw e;
    // 손상된 DB 는 읽을 수 없으므로 지우고 새로 만든다 (풀이 이력은 사라진다).
    // 새로 만든 DB 도 실패하면 그 오류를 그대로 던진다 (재시도는 한 번만).
    console.warn('DB 손상 감지, 새로 만듭니다:', e);
    await deleteDatabaseFiles();
    return await openAndInitialize();
  }
}

async function openAndInitialize(): Promise<SQLite.SQLiteDatabase> {
  const database = await SQLite.openDatabaseAsync(DATABASE_NAME);
  try {
    await initializeSchema(database);
    return database;
  } catch (e) {
    // 다음 시도가 새 연결로 시작하도록 닫는다 (열린 채로는 파일 삭제도 거부된다).
    await database.closeAsync().catch(() => {});
    throw e;
  }
}

/**
 * DB 파일을 WAL 부속 파일(-wal, -shm)까지 지운다.
 * expo-sqlite 의 deleteDatabaseAsync 는 본 파일만 지우는데, 남은 -wal 이 새 DB 에
 * 다시 적용되면 또 손상되므로 부속 파일을 먼저 지운다. 없는 파일 오류는 무시한다.
 */
async function deleteDatabaseFiles(): Promise<void> {
  for (const name of [`${DATABASE_NAME}-wal`, `${DATABASE_NAME}-shm`, DATABASE_NAME]) {
    try {
      await SQLite.deleteDatabaseAsync(name);
    } catch {
      // 파일이 없으면 지울 것도 없다
    }
  }
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
      mapped_correct_index INTEGER,
      -- 출제(셔플) 순서, 1-indexed. 결과 화면에서 푼 순서대로 표시하기 위함
      display_order INTEGER
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

  try {
    await database.execAsync(`ALTER TABLE answers ADD COLUMN display_order INTEGER`);
  } catch (e) {
    // Ignore if column already exists
  }
}

/** DB 연결 닫기 (앱 종료 시) */
export async function closeDatabase(): Promise<void> {
  const pending = dbPromise;
  dbPromise = null;
  if (!pending) return;
  const database = await pending.catch(() => null);
  await database?.closeAsync();
}

// expo-sqlite 는 대체하고, getDatabase 의 초기화·재시도·손상 복구 흐름만 검증한다.
const mockOpen = jest.fn();
const mockDelete = jest.fn();
jest.mock('expo-sqlite', () => ({
  openDatabaseAsync: (...args: unknown[]) => mockOpen(...args),
  deleteDatabaseAsync: (...args: unknown[]) => mockDelete(...args),
}));

type SchemaModule = typeof import('../../../lib/db/schema');

const CORRUPT = new Error(
  "Call to function 'NativeDatabase.execAsync' has been rejected.\n→ Caused by: Error code \u000B: database disk image is malformed"
);

/** 첫 execAsync(스키마 생성)는 initError 로 실패시키고, 이후 ALTER 는 "이미 있음"으로 실패하는 DB */
function fakeDb(initError?: Error) {
  let calls = 0;
  return {
    execAsync: jest.fn(async () => {
      calls += 1;
      if (calls === 1 && initError) throw initError;
      if (calls > 1) throw new Error('duplicate column name');
    }),
    closeAsync: jest.fn(async () => {}),
  };
}

function loadSchema(): SchemaModule {
  let mod!: SchemaModule;
  jest.isolateModules(() => {
    mod = require('../../../lib/db/schema');
  });
  return mod;
}

beforeEach(() => {
  mockOpen.mockReset();
  mockDelete.mockReset();
  mockDelete.mockResolvedValue(undefined);
  jest.spyOn(console, 'warn').mockImplementation(() => {});
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe('getDatabase', () => {
  it('동시에 불러도 DB 를 한 번만 열고 같은 연결을 돌려준다', async () => {
    const db = fakeDb();
    mockOpen.mockResolvedValue(db);
    const { getDatabase } = loadSchema();

    const [a, b] = await Promise.all([getDatabase(), getDatabase()]);

    expect(a).toBe(db);
    expect(b).toBe(db);
    expect(mockOpen).toHaveBeenCalledTimes(1);
    await expect(getDatabase()).resolves.toBe(db);
    expect(mockOpen).toHaveBeenCalledTimes(1);
  });

  it('초기화가 실패하면 연결을 닫고, 다시 시도하면 처음부터 다시 연다', async () => {
    const broken = fakeDb(new Error('Error code \u0005: database is locked'));
    const healthy = fakeDb();
    mockOpen.mockResolvedValueOnce(broken).mockResolvedValueOnce(healthy);
    const { getDatabase } = loadSchema();

    await expect(getDatabase()).rejects.toThrow('database is locked');
    expect(broken.closeAsync).toHaveBeenCalledTimes(1);
    // 손상이 아니면 사용자 데이터를 지우지 않는다
    expect(mockDelete).not.toHaveBeenCalled();

    await expect(getDatabase()).resolves.toBe(healthy);
    expect(mockOpen).toHaveBeenCalledTimes(2);
  });

  it('DB 가 손상됐으면 WAL 부속 파일까지 지우고 새로 만든다', async () => {
    const corrupt = fakeDb(CORRUPT);
    const fresh = fakeDb();
    mockOpen.mockResolvedValueOnce(corrupt).mockResolvedValueOnce(fresh);
    const { getDatabase } = loadSchema();

    await expect(getDatabase()).resolves.toBe(fresh);

    expect(corrupt.closeAsync).toHaveBeenCalledTimes(1);
    // 남은 -wal 이 새 DB 에 적용되지 않도록 부속 파일을 먼저 지운다
    expect(mockDelete.mock.calls.map((c) => c[0])).toEqual([
      'quiz-bank.db-wal',
      'quiz-bank.db-shm',
      'quiz-bank.db',
    ]);
  });

  it('지울 파일이 없어도 복구를 계속한다', async () => {
    mockOpen.mockResolvedValueOnce(fakeDb(CORRUPT)).mockResolvedValueOnce(fakeDb());
    mockDelete.mockRejectedValue(new Error("Database 'quiz-bank.db-wal' not found"));
    const { getDatabase } = loadSchema();

    await expect(getDatabase()).resolves.toBeDefined();
    expect(mockOpen).toHaveBeenCalledTimes(2);
  });

  it('새로 만든 DB 도 손상이면 한 번만 재시도하고 오류를 던진다', async () => {
    mockOpen.mockResolvedValueOnce(fakeDb(CORRUPT)).mockResolvedValueOnce(fakeDb(CORRUPT));
    const { getDatabase } = loadSchema();

    await expect(getDatabase()).rejects.toThrow('malformed');
    expect(mockOpen).toHaveBeenCalledTimes(2);
  });

  it('closeDatabase 후에는 새로 연다', async () => {
    const first = fakeDb();
    const second = fakeDb();
    mockOpen.mockResolvedValueOnce(first).mockResolvedValueOnce(second);
    const { getDatabase, closeDatabase } = loadSchema();

    await getDatabase();
    await closeDatabase();
    expect(first.closeAsync).toHaveBeenCalledTimes(1);
    await expect(getDatabase()).resolves.toBe(second);
  });
});

describe('isCorruptionError', () => {
  it('SQLITE_CORRUPT / SQLITE_NOTADB 메시지만 손상으로 본다', () => {
    const { isCorruptionError } = loadSchema();
    expect(isCorruptionError(CORRUPT)).toBe(true);
    expect(isCorruptionError(new Error('Error code 26: file is not a database'))).toBe(true);
    expect(isCorruptionError(new Error('Error code 13: database or disk is full'))).toBe(false);
    expect(isCorruptionError(new Error('no such table: sessions'))).toBe(false);
    expect(isCorruptionError('database disk image is malformed')).toBe(true);
  });
});

import { fetchAnsweredQuestionIds } from '../../../lib/db/stats';
import { getDatabase } from '../../../lib/db/schema';

// 실제 DB 대신 쿼리 결과만 흉내 낸다
jest.mock('../../../lib/db/schema', () => ({ getDatabase: jest.fn() }));

const mockGetDatabase = getDatabase as jest.Mock;

describe('fetchAnsweredQuestionIds', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('파일이 없으면 DB 를 열지 않고 빈 결과', async () => {
    await expect(fetchAnsweredQuestionIds([])).resolves.toEqual({});
    expect(mockGetDatabase).not.toHaveBeenCalled();
  });

  it('파일별로 푼 문제 번호를 모은다', async () => {
    const getAllAsync = jest.fn().mockResolvedValue([
      { source_file_id: 'a', question_id: 1 },
      { source_file_id: 'a', question_id: 4 },
      { source_file_id: 'b', question_id: 2 },
    ]);
    mockGetDatabase.mockResolvedValue({ getAllAsync });

    const result = await fetchAnsweredQuestionIds(['a', 'b', 'c']);

    expect(result).toEqual({ a: new Set([1, 4]), b: new Set([2]) });
    // 고른 파일만 조회한다
    const [sql, params] = getAllAsync.mock.calls[0];
    expect(sql).toMatch(/SELECT DISTINCT source_file_id, question_id/);
    expect(sql).toMatch(/IN \(\?,\?,\?\)/);
    expect(params).toEqual(['a', 'b', 'c']);
  });
});

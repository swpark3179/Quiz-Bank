import * as fs from 'fs';
import * as path from 'path';
import { buildWrongAnswerQuiz } from '../../../lib/quiz/retry';
import { fetchWrongAnswers } from '../../../lib/db/sessions';
import { fetchQuizFiles } from '../../../lib/local/categories';
import { fetchQuizMarkdown } from '../../../lib/local/storage';

// DB·네트워크 모듈은 대체하고, 파서·셔플러는 실제 구현을 사용한다
jest.mock('../../../lib/db/sessions', () => ({ fetchWrongAnswers: jest.fn() }));
jest.mock('../../../lib/local/categories', () => ({ fetchQuizFiles: jest.fn() }));
jest.mock('../../../lib/local/storage', () => ({ fetchQuizMarkdown: jest.fn() }));

const mockWrongAnswers = fetchWrongAnswers as jest.Mock;
const mockQuizFiles = fetchQuizFiles as jest.Mock;
const mockMarkdown = fetchQuizMarkdown as jest.Mock;

const DATA_DIR = path.join(__dirname, '..', '..', '..', 'assets', 'quiz-data', 'claude-certified-architect');
const sampleMd = fs.readFileSync(path.join(DATA_DIR, 'example-kor.md'), 'utf8');

const files = [
  { id: 'example-kor', name: '샘플 문제 (한글버전)', storagePath: 'claude-certified-architect/example-kor.md', questionCount: 60, order: 1, categoryId: 'claude-certified-architect' },
  { id: 'example', name: '샘플 문제', storagePath: 'claude-certified-architect/example.md', questionCount: 60, order: 2, categoryId: 'claude-certified-architect' },
];

const wrong = (sourceFileId: string, questionId: number) => ({
  source_file_id: sourceFileId,
  question_id: questionId,
});

describe('buildWrongAnswerQuiz', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockQuizFiles.mockResolvedValue(files);
    mockMarkdown.mockResolvedValue(sampleMd);
  });

  it('오답이 없으면 null 을 반환한다', async () => {
    mockWrongAnswers.mockResolvedValue([]);

    await expect(buildWrongAnswerQuiz('s1', 'claude-certified-architect', 'immediate')).resolves.toBeNull();
    expect(mockQuizFiles).not.toHaveBeenCalled();
  });

  it('오답 문제만 골라 셔플하고, 넘긴 채점 방식을 유지한다', async () => {
    mockWrongAnswers.mockResolvedValue([wrong('example-kor', 2), wrong('example-kor', 5)]);

    const setup = await buildWrongAnswerQuiz('s1', 'claude-certified-architect', 'deferred');

    expect(setup).not.toBeNull();
    expect(setup!.mode).toBe('deferred');
    expect(setup!.categoryId).toBe('claude-certified-architect');
    expect(setup!.sourceFileIds).toEqual(['example-kor']);
    expect(setup!.shuffled.map((q) => q.original.id).sort((a, b) => a - b)).toEqual([2, 5]);
    expect(mockMarkdown).toHaveBeenCalledTimes(1);
    expect(mockMarkdown).toHaveBeenCalledWith('claude-certified-architect/example-kor.md');
  });

  it('목록에 없는 파일의 오답은 건너뛴다', async () => {
    mockWrongAnswers.mockResolvedValue([wrong('example-kor', 1), wrong('removed-file', 3)]);

    const setup = await buildWrongAnswerQuiz('s1', 'claude-certified-architect', 'immediate');

    expect(setup!.shuffled.map((q) => q.original.id)).toEqual([1]);
    expect(mockMarkdown).toHaveBeenCalledTimes(1);
  });

  it('찾을 수 있는 문제가 하나도 없으면 null 을 반환한다', async () => {
    mockWrongAnswers.mockResolvedValue([wrong('removed-file', 3)]);

    await expect(buildWrongAnswerQuiz('s1', 'claude-certified-architect', 'immediate')).resolves.toBeNull();
  });
});

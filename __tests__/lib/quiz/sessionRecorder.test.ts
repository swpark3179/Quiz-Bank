import {
  createSessionRecorder,
  MIN_ANSWERS_TO_KEEP,
  type AnswerInput,
} from '../../../lib/quiz/sessionRecorder';
import { createSession, saveAnswer, updateSessionProgress } from '../../../lib/db/sessions';

// DB 는 대체하고, 호출 순서·인자만 확인한다
jest.mock('../../../lib/db/sessions', () => ({
  createSession: jest.fn(),
  saveAnswer: jest.fn(),
  updateSessionProgress: jest.fn(),
}));

const mockCreateSession = createSession as jest.Mock;
const mockSaveAnswer = saveAnswer as jest.Mock;
const mockUpdateProgress = updateSessionProgress as jest.Mock;

const meta = {
  sessionId: 's1',
  categoryId: 'claude-certified-architect',
  sourceFileIds: ['example-kor'],
  mode: 'immediate' as const,
};

const answer = (order: number, isCorrect: boolean): AnswerInput => ({
  id: `a${order}`,
  questionId: order,
  sourceFileId: 'example-kor',
  questionText: `문제 ${order}`,
  chosenIndex: 0,
  correctIndex: isCorrect ? 0 : 1,
  isCorrect,
  explanation: '',
  correctLabel: '',
  mappedCorrectIndex: isCorrect ? 0 : 1,
  displayOrder: order,
});

/** saveAnswer 에 넘어간 응답의 출제 순서 */
const savedOrders = () => mockSaveAnswer.mock.calls.map(([a]) => a.displayOrder);

describe('createSessionRecorder', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockCreateSession.mockResolvedValue(undefined);
    mockSaveAnswer.mockResolvedValue(undefined);
    mockUpdateProgress.mockResolvedValue(undefined);
  });

  it('중간에 나가면 저장하지 않는 기준은 2문제 이하다', () => {
    expect(MIN_ANSWERS_TO_KEEP).toBe(3);
  });

  it('2문제 이하로 풀고 끝내지 않으면(중간에 나감) DB 에 아무것도 쓰지 않는다', async () => {
    const recorder = createSessionRecorder(meta);
    await recorder.add(answer(1, true));
    await recorder.add(answer(2, false));

    expect(recorder.answeredCount()).toBe(2);
    expect(mockCreateSession).not.toHaveBeenCalled();
    expect(mockSaveAnswer).not.toHaveBeenCalled();
    expect(mockUpdateProgress).not.toHaveBeenCalled();
  });

  it('세 번째 응답에서 세션을 만들고 모아 둔 응답을 순서대로 쓴다', async () => {
    const recorder = createSessionRecorder(meta);
    await recorder.add(answer(1, true));
    await recorder.add(answer(2, false));
    await recorder.add(answer(3, true));

    expect(mockCreateSession).toHaveBeenCalledTimes(1);
    expect(mockCreateSession).toHaveBeenCalledWith({
      id: 's1',
      categoryId: 'claude-certified-architect',
      sourceFileIds: ['example-kor'],
      total: 0,
      mode: 'immediate',
    });
    expect(savedOrders()).toEqual([1, 2, 3]);
    expect(mockSaveAnswer.mock.calls.every(([a]) => a.sessionId === 's1')).toBe(true);
    expect(mockUpdateProgress).toHaveBeenLastCalledWith('s1', 3, 2);
    // 세션 행이 먼저 생긴 뒤 응답을 쓴다
    expect(mockCreateSession.mock.invocationCallOrder[0]).toBeLessThan(
      mockSaveAnswer.mock.invocationCallOrder[0]
    );
  });

  it('그 뒤의 응답은 한 건씩 쓰고 진행 상황을 갱신한다', async () => {
    const recorder = createSessionRecorder(meta);
    for (let i = 1; i <= 3; i++) await recorder.add(answer(i, true));
    jest.clearAllMocks();

    await recorder.add(answer(4, false));

    expect(mockCreateSession).not.toHaveBeenCalled();
    expect(savedOrders()).toEqual([4]);
    expect(mockUpdateProgress).toHaveBeenCalledWith('s1', 4, 3);
  });

  it('끝까지 풀면 문제가 2개 이하여도 저장한다', async () => {
    const recorder = createSessionRecorder(meta);
    await recorder.add(answer(1, false));
    await recorder.add(answer(2, true));
    await recorder.finish();

    expect(mockCreateSession).toHaveBeenCalledTimes(1);
    expect(savedOrders()).toEqual([1, 2]);
    expect(mockUpdateProgress).toHaveBeenLastCalledWith('s1', 2, 1);
  });

  it('이미 모두 쓴 뒤 끝내면 같은 응답을 다시 쓰지 않는다', async () => {
    const recorder = createSessionRecorder(meta);
    for (let i = 1; i <= 3; i++) await recorder.add(answer(i, i !== 2));
    await recorder.finish();

    expect(mockCreateSession).toHaveBeenCalledTimes(1);
    expect(savedOrders()).toEqual([1, 2, 3]);
  });

  it('응답이 없으면 끝내도 세션을 만들지 않는다', async () => {
    const recorder = createSessionRecorder(meta);
    await recorder.finish();

    expect(mockCreateSession).not.toHaveBeenCalled();
  });

  it('기다리지 않고 연달아 추가해도 세션 생성 → 응답 순서로 한 번씩만 쓴다', async () => {
    const recorder = createSessionRecorder({ ...meta, mode: 'deferred' });
    const pending = [1, 2, 3, 4, 5].map((i) => recorder.add(answer(i, i % 2 === 1)));
    await Promise.all(pending);
    await recorder.finish();

    expect(mockCreateSession).toHaveBeenCalledTimes(1);
    expect(savedOrders()).toEqual([1, 2, 3, 4, 5]);
    expect(mockUpdateProgress).toHaveBeenLastCalledWith('s1', 5, 3);
  });

  it('쓰기에 실패한 응답은 다음 쓰기에서 다시 시도한다', async () => {
    const recorder = createSessionRecorder(meta);
    await recorder.add(answer(1, true));
    await recorder.add(answer(2, true));
    mockSaveAnswer.mockRejectedValueOnce(new Error('disk full'));

    await expect(recorder.add(answer(3, true))).rejects.toThrow('disk full');
    await recorder.finish();

    expect(mockCreateSession).toHaveBeenCalledTimes(1);
    // 첫 시도에서 1번이 실패 → 다음 쓰기에서 1번부터 다시
    expect(savedOrders()).toEqual([1, 1, 2, 3]);
    expect(mockUpdateProgress).toHaveBeenLastCalledWith('s1', 3, 3);
  });
});

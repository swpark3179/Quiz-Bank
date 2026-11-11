import { countUnseen, filterUnseen } from '../../../lib/quiz/unseen';
import type { QuizQuestion } from '../../../lib/parser/quizParser';

const q = (sourceFileId: string, id: number): QuizQuestion => ({
  id,
  question: `${sourceFileId} 문제 ${id}`,
  choices: [
    { index: 0, label: '① A', description: '' },
    { index: 1, label: '② B', description: '' },
  ],
  answer: 0,
  explanation: '',
  sourceFileId,
});

describe('countUnseen', () => {
  const file = { id: 'a', questionCount: 10 };

  it('풀이 기록이 없으면 전체 문항 수', () => {
    expect(countUnseen(file, {})).toBe(10);
  });

  it('푼 문제 수만큼 뺀다', () => {
    expect(countUnseen(file, { a: new Set([1, 2, 3]) })).toBe(7);
  });

  it('다른 파일의 기록은 세지 않는다', () => {
    expect(countUnseen(file, { b: new Set([1, 2, 3]) })).toBe(10);
  });

  it('모두 풀었으면 0', () => {
    expect(countUnseen(file, { a: new Set([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]) })).toBe(0);
  });

  it('파일이 고쳐져 기록이 문항 수보다 많아도 0 아래로 내려가지 않는다', () => {
    expect(countUnseen({ id: 'a', questionCount: 2 }, { a: new Set([1, 2, 3, 4]) })).toBe(0);
  });
});

describe('filterUnseen', () => {
  const questions = [q('a', 1), q('a', 2), q('a', 3), q('b', 1), q('b', 2)];

  it('풀이 기록이 없으면 모두 남긴다', () => {
    expect(filterUnseen(questions, {})).toEqual(questions);
  });

  it('푼 문제만 뺀다 (파일마다 따로 판정)', () => {
    const result = filterUnseen(questions, { a: new Set([1, 3]), b: new Set([2]) });
    expect(result.map((x) => `${x.sourceFileId}#${x.id}`)).toEqual(['a#2', 'b#1']);
  });

  it('다른 파일의 같은 번호는 영향을 주지 않는다', () => {
    const result = filterUnseen(questions, { a: new Set([1, 2, 3]) });
    expect(result.map((x) => `${x.sourceFileId}#${x.id}`)).toEqual(['b#1', 'b#2']);
  });

  it('모두 풀었으면 빈 배열', () => {
    expect(filterUnseen(questions, { a: new Set([1, 2, 3]), b: new Set([1, 2]) })).toEqual([]);
  });
});

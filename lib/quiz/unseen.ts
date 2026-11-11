/**
 * '안 푼 문제만' 출제
 *
 * 한 번이라도 푼 문제 = 풀이 이력(answers)에 응답이 남은 문제.
 * 이력을 지우거나 카테고리를 초기화하면 그 문제는 다시 '안 푼 문제'가 된다.
 */

import type { QuizQuestion } from '../parser/quizParser';

/** 파일 id → 한 번이라도 푼 문제 번호 */
export type AnsweredIds = Record<string, Set<number>>;

/**
 * 파일의 안 푼 문제 수 (설정 시트 표시용).
 * 파일을 열지 않고 config 의 문항 수에서 푼 문제 수를 빼므로, 파일이 고쳐져
 * 이전 번호가 사라졌다면 실제보다 적게 나올 수 있다 (0 아래로는 내려가지 않는다).
 * 실제 출제는 filterUnseen 으로 정확히 거른다.
 */
export function countUnseen(
  file: { id: string; questionCount: number },
  answered: AnsweredIds
): number {
  return Math.max(0, file.questionCount - (answered[file.id]?.size ?? 0));
}

/** 한 번도 풀지 않은 문제만 남긴다 (파일마다 따로 판정) */
export function filterUnseen(questions: QuizQuestion[], answered: AnsweredIds): QuizQuestion[] {
  return questions.filter((q) => !answered[q.sourceFileId]?.has(q.id));
}

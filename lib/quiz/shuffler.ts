/**
 * 문제/보기 셔플 및 정답 remapping
 *
 * 문제 순서와 보기 순서를 모두 무작위로 섞되,
 * 각 문제의 원래 정답 인덱스를 섞인 보기 기준으로 remapping한다.
 */

import type { QuizQuestion, Choice } from '../parser/quizParser';

export interface ShuffledQuestion {
  /** 원본 QuizQuestion */
  original: QuizQuestion;
  /** 섞인 순서의 보기 배열 */
  shuffledChoices: Choice[];
  /** 섞인 보기 기준 정답의 0-based 인덱스 */
  mappedAnswer: number;
  /** 이번 퀴즈에서의 표시 번호 (1-indexed) */
  displayIndex: number;
}

/** Fisher-Yates 셔플 */
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * 문제 목록 셔플 + 각 문제 내 보기 셔플
 * @param questions 원본 문제 배열 (여러 파일 합산 가능)
 * @param count 출제할 문제 수 (undefined = 전체)
 */
export function shuffleQuiz(
  questions: QuizQuestion[],
  count?: number
): ShuffledQuestion[] {
  // 1. 문제 목록 셔플
  const shuffledQuestions = shuffle(questions);

  // 2. 출제 수 제한
  const selected = count !== undefined
    ? shuffledQuestions.slice(0, Math.min(count, shuffledQuestions.length))
    : shuffledQuestions;

  // 3. 각 문제의 보기 셔플 + 정답 인덱스 remapping
  return selected.map((q, displayIdx) => {
    const shuffledChoices = shuffle(q.choices);

    // 섞인 보기 배열에서 원래 정답(q.answer)이 몇 번째 위치에 있는지 찾기
    const mappedAnswer = shuffledChoices.findIndex((c) => c.index === q.answer);

    return {
      original: q,
      shuffledChoices,
      mappedAnswer,
      displayIndex: displayIdx + 1,
    };
  });
}

/**
 * 오답 문제만 모아서 새 퀴즈 세트 생성 (오답 재시험용)
 * 보기는 다시 새로 섞음
 */
export function shuffleWrongQuestions(questions: QuizQuestion[]): ShuffledQuestion[] {
  return shuffleQuiz(questions);
}

/**
 * 오답 다시 풀기용 퀴즈 준비
 *
 * 결과 화면과 이력 상세 화면이 함께 사용한다.
 * 지정한 차수의 오답만 원본 문제 파일에서 다시 읽어 셔플한다.
 */

import { fetchWrongAnswers } from '../db/sessions';
import { fetchQuizFiles } from '../local/categories';
import { fetchQuizMarkdown } from '../local/storage';
import { parseQuizMarkdown } from '../parser/quizParser';
import { shuffleQuiz, type ShuffledQuestion } from './shuffler';

export type QuizMode = 'immediate' | 'deferred';

/** 퀴즈 화면(`/[category]/quiz`)의 `setup` 파라미터 형식 */
export interface QuizSetup {
  shuffled: ShuffledQuestion[];
  mode: QuizMode;
  categoryId: string;
  sourceFileIds: string[];
}

/**
 * 차수의 오답 문제로 퀴즈 설정을 만든다.
 * @returns 오답이 없거나 문제를 찾지 못하면 null
 */
export async function buildWrongAnswerQuiz(
  sessionId: string,
  categoryId: string,
  mode: QuizMode
): Promise<QuizSetup | null> {
  const wrongAnswers = await fetchWrongAnswers(sessionId);
  if (wrongAnswers.length === 0) return null;

  // 파일별 오답 ID 그룹화
  const fileGroups = wrongAnswers.reduce<Record<string, number[]>>((acc, a) => {
    if (!acc[a.source_file_id]) acc[a.source_file_id] = [];
    acc[a.source_file_id].push(a.question_id);
    return acc;
  }, {});

  const quizFiles = await fetchQuizFiles(categoryId);

  const questionsByFile = await Promise.all(
    Object.entries(fileGroups).map(async ([fileId, questionIds]) => {
      const file = quizFiles.find((f) => f.id === fileId);
      if (!file) return [];
      const md = await fetchQuizMarkdown(file.storagePath);
      return parseQuizMarkdown(md, fileId).filter((q) => questionIds.includes(q.id));
    })
  );
  const questions = questionsByFile.flat();
  if (questions.length === 0) return null;

  return {
    shuffled: shuffleQuiz(questions),
    mode,
    categoryId,
    sourceFileIds: Object.keys(fileGroups),
  };
}

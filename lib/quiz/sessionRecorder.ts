/**
 * 퀴즈 한 회차의 풀이 기록
 *
 * 응답을 메모리에 모아 두었다가, 풀이 이력에 남길 만큼 풀었을 때부터 DB 에 쓴다.
 * - 끝까지 풀면(finish) 문제 수와 관계없이 모두 남긴다.
 * - 중간에 나가면 MIN_ANSWERS_TO_KEEP 문제 이상 풀었을 때만 남는다.
 *   나갈 때 지우는 대신 처음부터 늦게 쓰므로, 앱이 강제 종료되거나 웹 탭이 닫혀도
 *   짧게 풀다 만 회차는 남지 않는다.
 *
 * 오답 다시 풀기도 새로 고른 문제 세트이므로 같은 규칙을 따른다.
 */

import {
  createSession,
  saveAnswer,
  updateSessionProgress,
  type NewAnswer,
  type SessionRow,
} from '../db/sessions';

/** 중간에 나간 회차를 이력에 남기는 최소 응답 수 (2문제 이하로 풀고 나가면 남기지 않는다) */
export const MIN_ANSWERS_TO_KEEP = 3;

/** 기록할 응답 — 세션 ID 는 기록기가 채운다 */
export type AnswerInput = Omit<NewAnswer, 'sessionId'>;

export interface SessionMeta {
  sessionId: string;
  categoryId: string;
  sourceFileIds: string[];
  mode: SessionRow['mode'];
}

export interface SessionRecorder {
  /** 응답을 추가한다. MIN_ANSWERS_TO_KEEP 개가 모인 뒤부터 DB 에 쓴다 */
  add(answer: AnswerInput): Promise<void>;
  /** 끝까지 풀었을 때: 아직 쓰지 않은 응답을 모두 DB 에 쓴다 */
  finish(): Promise<void>;
  /** 지금까지 받은 응답 수 (DB 에 썼는지와 무관) */
  answeredCount(): number;
}

export function createSessionRecorder(meta: SessionMeta): SessionRecorder {
  const answers: NewAnswer[] = [];
  // DB 에 쓴 응답 수 (answers 앞에서부터)
  let saved = 0;
  let sessionCreated = false;
  // DB 쓰기를 하나씩 차례대로 실행한다 (세션 행이 생기기 전에 응답을 쓰지 않도록)
  let queue: Promise<void> = Promise.resolve();

  /** 아직 쓰지 않은 응답을 모두 쓰고, 쓴 응답 기준으로 진행 상황을 갱신한다 */
  const flush = async () => {
    if (!sessionCreated) {
      await createSession({
        id: meta.sessionId,
        categoryId: meta.categoryId,
        sourceFileIds: meta.sourceFileIds,
        total: 0,
        mode: meta.mode,
      });
      sessionCreated = true;
    }

    const end = answers.length;
    if (saved >= end) return;
    for (let i = saved; i < end; i++) {
      await saveAnswer(answers[i]);
      saved = i + 1;
    }

    // 실제로 푼(쓴) 문제만 모수에 반영한다
    const correct = answers.slice(0, saved).filter((a) => a.isCorrect).length;
    await updateSessionProgress(meta.sessionId, saved, correct);
  };

  const enqueue = () => {
    const run = queue.then(flush);
    // 한 번 실패해도 다음 쓰기는 이어서 시도한다 (실패한 응답은 다음 flush 가 다시 쓴다)
    queue = run.catch(() => {});
    return run;
  };

  return {
    add(answer) {
      answers.push({ ...answer, sessionId: meta.sessionId });
      if (answers.length < MIN_ANSWERS_TO_KEEP) return Promise.resolve();
      return enqueue();
    },
    finish() {
      if (answers.length === 0) return queue;
      return enqueue();
    },
    answeredCount() {
      return answers.length;
    },
  };
}

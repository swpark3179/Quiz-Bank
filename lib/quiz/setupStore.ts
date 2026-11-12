/**
 * 퀴즈 화면으로 넘기는 설정(섞은 문제·채점 방식) 보관소.
 *
 * 예전에는 설정 전체를 JSON 으로 URL 파라미터에 실었다. expo-router 는 이동할 때마다 그 URL 을
 * 인코딩하고 `new URL()` 로 두 번 다시 읽는데, 네이티브의 URL 은 순수 JS 구현이라
 * 문제 10개(약 66KB)에도 iOS 에서 수백 ms 동안 JS 가 멈췄다 — 설정 시트가 닫힌 뒤 퀴즈가 뜨기 전의 멈춤.
 * 그래서 설정은 여기 두고 화면 사이에는 짧은 id 만 넘긴다.
 *
 * 웹·데스크탑은 새로고침해도 퀴즈가 남도록 마지막 설정을 sessionStorage 에도 둔다 (네이티브에는 없다).
 * React Native 의존성이 없어 Jest 에서 그대로 검증한다.
 */

import type { QuizSetup } from './retry';

/** 메모리에 남겨 둘 설정 수 — 화면을 오가며 쌓이지 않게 최근 것만 둔다 */
const MAX_KEPT = 5;
const SESSION_KEY = 'quiz-bank:quiz-setup';

const setups = new Map<string, QuizSetup>();
let sequence = 0;

function sessionStore(): Storage | null {
  try {
    return typeof sessionStorage === 'undefined' ? null : sessionStorage;
  } catch {
    return null;
  }
}

/** 설정을 맡기고 퀴즈 화면에 넘길 id 를 받는다 */
export function stashQuizSetup(setup: QuizSetup): string {
  sequence += 1;
  const id = `${Date.now().toString(36)}-${sequence}`;
  setups.set(id, setup);
  while (setups.size > MAX_KEPT) {
    // Map 은 넣은 순서를 지키므로 첫 키가 가장 오래된 설정이다
    setups.delete(setups.keys().next().value as string);
  }
  try {
    sessionStore()?.setItem(SESSION_KEY, JSON.stringify({ id, setup }));
  } catch {
    // 저장 공간이 꽉 찼거나 막혀 있으면 새로고침 복원만 안 된다
  }
  return id;
}

/** 맡긴 설정 (없으면 undefined — 퀴즈 화면은 '문제를 불러오지 못했습니다'를 보여 준다) */
export function getQuizSetup(id: string | undefined): QuizSetup | undefined {
  if (!id) return undefined;
  const kept = setups.get(id);
  if (kept) return kept;
  try {
    const raw = sessionStore()?.getItem(SESSION_KEY);
    if (!raw) return undefined;
    const saved = JSON.parse(raw) as { id?: unknown; setup?: QuizSetup };
    if (saved.id !== id || !saved.setup) return undefined;
    setups.set(id, saved.setup);
    return saved.setup;
  } catch {
    return undefined;
  }
}

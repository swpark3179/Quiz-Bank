/**
 * 퀴즈를 열기 전에 단어장 모드를 준비한다.
 *
 * 단어장 모드의 매처는 등록 표현 수천 개로 정규식을 만들고 컴파일해야 해서, 퀴즈 화면이 뜰 때 만들면
 * 시트가 닫힌 뒤 퀴즈가 올라오기 전까지 화면이 멈춘 듯 보인다. 그래서 '문제 불러오는 중' 로딩이
 * 움직이는 동안(Reanimated 점은 UI 스레드라 JS 가 바빠도 움직인다) 미리 만들어 두고,
 * 퀴즈 화면은 같은 목록·매처를 그대로 받아 첫 문제부터 바로 그린다.
 */

import type { QuizQuestion } from '../parser/quizParser';
import { getPreference } from '../local/preferences';
import { fetchVocabIndex } from '../local/vocab';
import { fetchWordAppLexicon } from '../local/wordApp';
import { getVocabMatcher } from '../vocab/matcher';
import { getWordAppEntries, resolveVocabSource } from '../vocab/wordApp';
import { waitForPaint } from '../utils/frame';

/**
 * 단어장 모드가 켜져 있으면 이 퀴즈에서 쓸 단어 목록과 매처를 만들어 둔다 (꺼져 있으면 바로 끝난다).
 * 실패해도 퀴즈 시작을 막지 않는다 — 퀴즈 화면이 평소대로 다시 시도한다.
 */
export async function prepareQuizVocab(questions: readonly QuizQuestion[]): Promise<void> {
  if (!getPreference('vocabMode') || questions.length === 0) return;

  try {
    // 로딩 표시가 먼저 그려지고 움직이기 시작한 뒤에 무거운 작업을 한다
    await waitForPaint();
    const [bankEntries, lexicon] = await Promise.all([fetchVocabIndex(), fetchWordAppLexicon()]);

    // 퀴즈 화면(app/[category]/quiz.tsx)과 같은 규칙으로 출처를 고른다
    const source = resolveVocabSource(getPreference('vocabSource'), {
      bank: bankEntries.length > 0,
      wordApp: !!lexicon,
    });
    const entries = source === 'wordApp' && lexicon ? getWordAppEntries(lexicon, questions) : bankEntries;
    if (entries.length > 0) getVocabMatcher(entries).warm();
  } catch (e) {
    console.warn('단어장 준비 오류:', e);
  }
}

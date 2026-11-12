/**
 * 단어장 앱(Quiz Word) 연동 — 순수 로직 (React Native 의존성이 없어 Jest 에서 그대로 검증한다).
 *
 * 단어장 앱 활용 모드: 문제를 여는 순간 문제 텍스트를 공백 단위로 나눈 단어 배열을 단어장 앱의 등록 단어 목록
 * (lexicon.json — 단어장 앱이 켜질 때 iOS App Group 공유 폴더 / Android ContentProvider 로 내보낸다)과 맞춰,
 * 단어장 앱에 등록된 단어만 VocabEntry 로 돌려준다. 강조·팝업은 기존 단어장 모드(matcher·VocabProvider)를 그대로 쓴다.
 *
 * 단어 상세는 단어장 앱을 연다: quizword://lookup?word=…&x-source=문제은행&x-error=quizbank://word-lookup-result
 * 단어장 앱에 그 단어가 없으면 단어장 앱이 x-error 주소를 열어 '결과 없음'을 알린다(parseWordLookupResult).
 */

import type { QuizQuestion } from '../parser/quizParser';
import type { VocabEntry } from './matcher';

/** 단어장 앱의 URL 스킴 */
export const WORD_APP_SCHEME = 'quizword';
/** 단어장 앱이 '결과 없음'을 알려 올 때 여는 주소 (이 앱의 스킴) */
export const LOOKUP_RESULT_URL = 'quizbank://word-lookup-result';
const LOOKUP_RESULT_ACTION = 'word-lookup-result';
/** 단어장 앱에 이 앱을 알리는 이름 */
const SOURCE_NAME = '문제은행';

const LEXICON_FORMAT = 'quiz-word-lexicon';
const LEXICON_VERSION = 1;
/** VocabEntry id 앞에 붙여 이 앱 단어장 항목과 겹치지 않게 한다 */
const ID_PREFIX = 'qw:';

/** 단어장 앱 lexicon.json 의 단어 하나 */
export interface LexiconWord {
  id: string;
  word: string;
  /** 한 줄 뜻 */
  short: string;
  pos: string[];
  ipa?: string;
  forms?: string[];
}

export interface WordAppLexicon {
  words: LexiconWord[];
  /** 소문자 표현(표제어·변화형) → 단어 */
  index: Map<string, LexiconWord>;
}

/** 단어장 모드의 단어 출처 */
export type VocabSource = 'bank' | 'wordApp';

/** 공백을 한 칸으로, 소문자로 — 조회 키 (matcher 와 같은 규칙) */
const normalize = (s: string) => s.trim().replace(/\s+/g, ' ').toLowerCase();
const isText = (v: unknown): v is string => typeof v === 'string' && v.trim().length > 0;

/** 표현 목록 (표제어 + 변화형, 소문자·중복 제거) */
function surfacesOf(w: LexiconWord): string[] {
  return [...new Set([w.word, ...(w.forms ?? [])].map(normalize).filter((s) => s.length > 0))];
}

/**
 * lexicon.json 읽기 — 형식이 다르면 null, 잘못 적힌 항목은 버린다.
 * (단어장 앱이 더 새 형식을 쓰면 null → 이 기능이 꺼진다)
 */
export function parseLexicon(data: unknown): WordAppLexicon | null {
  if (!data || typeof data !== 'object') return null;
  const file = data as Record<string, unknown>;
  if (file.format !== LEXICON_FORMAT || file.version !== LEXICON_VERSION || !Array.isArray(file.words)) return null;

  const words = file.words.flatMap((raw): LexiconWord[] => {
    if (!raw || typeof raw !== 'object') return [];
    const { id, word, short, pos, ipa, forms } = raw as Record<string, unknown>;
    if (!isText(id) || !isText(word) || !isText(short)) return [];
    return [
      {
        id,
        word,
        short,
        pos: Array.isArray(pos) ? pos.filter(isText) : [],
        ...(isText(ipa) ? { ipa } : {}),
        ...(Array.isArray(forms) && forms.some(isText) ? { forms: forms.filter(isText) } : {}),
      },
    ];
  });
  if (words.length === 0) return null;

  const index = new Map<string, LexiconWord>();
  for (const w of words) {
    for (const s of surfacesOf(w)) if (!index.has(s)) index.set(s, w);
  }
  return { words, index };
}

/**
 * 문제 텍스트 → 단어 배열(중복 없는 소문자 집합).
 * 공백으로 나눈 뒤 조각마다 영문 단어만 꺼낸다 — 문장부호·마크다운 기호·붙은 한글 조사는 떨어진다
 * ("fork를" → fork, "(API)" → api, "agent's" → agent·s). 하이픈 단어는 그대로 둔다 ("fine-tuned").
 */
export function tokenize(texts: readonly string[]): Set<string> {
  const tokens = new Set<string>();
  for (const text of texts) {
    for (const piece of text.split(/\s+/)) {
      for (const m of piece.matchAll(/[A-Za-z0-9_-]+/g)) {
        const t = m[0].replace(/^[-_]+|[-_]+$/g, '').toLowerCase();
        if (/[a-z]/.test(t)) tokens.add(t);
      }
    }
  }
  return tokens;
}

/** 한 퀴즈 문제들의 텍스트 — 문제 문장·본문·보기 (단어장 모드가 강조하는 곳, 해설은 제외) */
export function questionTexts(questions: readonly QuizQuestion[]): string[] {
  const texts: string[] = [];
  for (const q of questions) {
    texts.push(q.question);
    if (q.questionBody) texts.push(q.questionBody);
    for (const c of q.choices) texts.push(c.label, c.description);
  }
  return texts.filter(isText);
}

/** 규칙 복수형·3인칭(-s, -es)도 같은 단어로 본다 (matcher 와 같은 규칙) */
function hasToken(tokens: ReadonlySet<string>, surface: string): boolean {
  return tokens.has(surface) || tokens.has(`${surface}s`) || tokens.has(`${surface}es`);
}

/**
 * 단어 배열 중 단어장 앱에 등록된 단어만 VocabEntry 로 (단어장 앱의 순서).
 * 여러 단어 구는 구성 단어가 모두 있으면 넣는다 — 실제로 붙어 나오는지는 matcher 가 문장에서 확인한다.
 */
export function matchLexicon(tokens: ReadonlySet<string>, lexicon: WordAppLexicon): VocabEntry[] {
  if (tokens.size === 0) return [];
  const out: VocabEntry[] = [];
  for (const w of lexicon.words) {
    const hit = surfacesOf(w).some((s) => (s.includes(' ') ? s.split(' ').every((part) => hasToken(tokens, part)) : hasToken(tokens, s)));
    if (hit) out.push(toVocabEntry(w));
  }
  return out;
}

/** 마지막으로 맞춘 결과 — 퀴즈를 열기 전에 맞춘 것을 퀴즈 화면이 그대로 받는다 */
let lastMatch: { lexicon: WordAppLexicon; key: string; entries: VocabEntry[] } | null = null;

/**
 * 한 퀴즈의 문제들 중 단어장 앱에 등록된 단어 (matchLexicon 결과를 기억해 둔다).
 * 퀴즈 화면은 넘겨받은 JSON 으로 문제 객체를 새로 만들므로, 객체가 아니라 문제 번호로 같은 퀴즈인지 본다.
 * 같은 배열을 돌려줘야 그 배열로 미리 만든 매처(getVocabMatcher)도 그대로 쓰인다.
 */
export function getWordAppEntries(lexicon: WordAppLexicon, questions: readonly QuizQuestion[]): VocabEntry[] {
  const key = questions
    .map((q) => `${q.sourceFileId}:${q.id}`)
    .sort()
    .join('|');
  if (lastMatch && lastMatch.lexicon === lexicon && lastMatch.key === key) return lastMatch.entries;
  const entries = matchLexicon(tokenize(questionTexts(questions)), lexicon);
  lastMatch = { lexicon, key, entries };
  return entries;
}

export function toVocabEntry(w: LexiconWord): VocabEntry {
  return {
    id: `${ID_PREFIX}${w.id}`,
    word: w.word,
    meaning: w.short,
    pos: w.pos[0],
    ipa: w.ipa,
    forms: w.forms,
    source: 'wordApp',
  };
}

/** 단어장 앱에 이 단어가 있는지 (표제어·변화형·규칙 복수형) — 있으면 단어장 앱의 표제어 */
export function findInLexicon(lexicon: WordAppLexicon, word: string): LexiconWord | undefined {
  const key = normalize(word);
  return (
    lexicon.index.get(key) ??
    (key.endsWith('s') ? lexicon.index.get(key.slice(0, -1)) : undefined) ??
    (key.endsWith('es') ? lexicon.index.get(key.slice(0, -2)) : undefined)
  );
}

/** 설정에서 고른 출처를 실제로 쓸 수 있는 출처로 — 단어장 앱이 없으면 문제은행 단어 */
export function resolveVocabSource(preferred: VocabSource, available: { bank: boolean; wordApp: boolean }): VocabSource {
  if (preferred === 'wordApp' && available.wordApp) return 'wordApp';
  if (available.bank) return 'bank';
  return available.wordApp ? 'wordApp' : 'bank';
}

/** 단어장 앱에서 단어 상세를 여는 주소 */
export function wordAppLookupUrl(word: string): string {
  const q = (k: string, v: string) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`;
  return `${WORD_APP_SCHEME}://lookup?${[q('word', word.replace(/\s+/g, ' ').trim()), q('x-source', SOURCE_NAME), q('x-error', LOOKUP_RESULT_URL)].join('&')}`;
}

function decode(s: string): string {
  try {
    return decodeURIComponent(s.replace(/\+/g, ' '));
  } catch {
    return s;
  }
}

/**
 * 단어장 앱이 연 결과 주소 (quizbank://word-lookup-result?errorCode=not_found&word=…) 읽기 — 아니면 null.
 * 앱이 연 주소는 +native-intent 가 받으며, `quizbank:///…` · `/…` 모양도 받는다.
 */
export function parseWordLookupResult(url: string): { errorCode: string; word: string } | null {
  if (!url) return null;
  const qi = url.indexOf('?');
  const head = (qi < 0 ? url : url.slice(0, qi)).replace(/#.*$/, '');
  const path = head.replace(/^[a-z][a-z0-9+.-]*:/i, '').replace(/^\/\//, '');
  const segments = path.split('/').filter(Boolean);
  if (segments.length !== 1 || segments[0] !== LOOKUP_RESULT_ACTION) return null;
  const params: Record<string, string> = {};
  for (const part of (qi < 0 ? '' : url.slice(qi + 1).replace(/#.*$/, '')).split('&')) {
    if (!part) continue;
    const eq = part.indexOf('=');
    const k = decode(eq < 0 ? part : part.slice(0, eq));
    if (!(k in params)) params[k] = eq < 0 ? '' : decode(part.slice(eq + 1));
  }
  return { errorCode: params.errorCode || 'unknown', word: (params.word ?? '').trim() };
}

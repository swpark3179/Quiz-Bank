import { createVocabMatcher } from '../../../lib/vocab/matcher';
import type { QuizQuestion } from '../../../lib/parser/quizParser';
import {
  findInLexicon,
  matchLexicon,
  parseLexicon,
  parseWordLookupResult,
  questionTexts,
  resolveVocabSource,
  tokenize,
  wordAppLookupUrl,
} from '../../../lib/vocab/wordApp';

/** 단어장 앱이 내보내는 lexicon.json 모양 */
const lexiconFile = (words: unknown[]) => ({
  format: 'quiz-word-lexicon',
  version: 1,
  sig: 's',
  exportedAt: '2026-11-12T00:00:00.000Z',
  count: words.length,
  words,
});

const FILE = lexiconFile([
  { id: 'escalate', word: 'escalate', short: '(상위 담당자에게) 넘기다', pos: ['동사'], ipa: 'ˈeskəleɪt', forms: ['escalated', 'escalation'] },
  { id: 'agent', word: 'agent', short: '에이전트', pos: ['명사'] },
  { id: 'fork', word: 'fork', short: '갈라져 나오게 하다', pos: ['동사'] },
  { id: 'fine-tune', word: 'fine-tune', short: '미세 조정하다', pos: ['동사'], forms: ['fine-tuned'] },
  { id: 'exponential-backoff', word: 'exponential backoff', short: '지수 백오프', pos: ['명사구'] },
  { id: 'latency', word: 'latency', short: '지연 시간', pos: ['명사'] },
]);

const lexicon = parseLexicon(FILE)!;

describe('parseLexicon', () => {
  it('단어장 앱의 lexicon.json 을 읽고 표현(표제어·변화형) 색인을 만든다', () => {
    expect(lexicon.words).toHaveLength(6);
    expect(lexicon.index.get('escalated')?.id).toBe('escalate');
    expect(lexicon.index.get('exponential backoff')?.id).toBe('exponential-backoff');
  });

  it('형식이 다르거나 단어가 없으면 null — 기능이 꺼진다', () => {
    expect(parseLexicon(null)).toBeNull();
    expect(parseLexicon({ ...FILE, format: 'other' })).toBeNull();
    expect(parseLexicon({ ...FILE, version: 2 })).toBeNull();
    expect(parseLexicon(lexiconFile([]))).toBeNull();
  });

  it('잘못 적힌 항목만 버린다', () => {
    const l = parseLexicon(lexiconFile([{ id: 'a', word: 'alpha', short: '알파', pos: 'x', forms: [1, 'alphas'] }, { id: 'b', word: '' }, 3]))!;
    expect(l.words).toEqual([{ id: 'a', word: 'alpha', short: '알파', pos: [], forms: ['alphas'] }]);
  });
});

describe('tokenize', () => {
  it('공백으로 나눈 뒤 영문 단어만 꺼낸다 (문장부호·마크다운·붙은 조사는 뗀다)', () => {
    const tokens = tokenize(['**Escalate** the issue를, then `fork` (API) agent\'s fine-tuned model — 3 times.']);
    expect([...tokens].sort()).toEqual(['agent', 'api', 'escalate', 'fine-tuned', 'fork', 'issue', 'model', 's', 'the', 'then', 'times'].sort());
  });

  it('숫자만 있는 조각은 뺀다', () => {
    expect([...tokenize(['2026 10 v2'])]).toEqual(['v2']);
  });
});

describe('matchLexicon', () => {
  const text = 'The agents escalated the issue. Use exponential\nbackoff and fork를 하세요.';

  it('문제 속 단어 중 단어장 앱에 등록된 단어만 돌려준다 (변화형·복수형 포함)', () => {
    const entries = matchLexicon(tokenize([text]), lexicon);
    expect(entries.map((e) => e.id)).toEqual(['qw:escalate', 'qw:agent', 'qw:fork', 'qw:exponential-backoff']);
    expect(entries[0]).toEqual({
      id: 'qw:escalate',
      word: 'escalate',
      meaning: '(상위 담당자에게) 넘기다',
      pos: '동사',
      ipa: 'ˈeskəleɪt',
      forms: ['escalated', 'escalation'],
      source: 'wordApp',
    });
  });

  it('돌려준 항목으로 기존 단어장 강조가 그대로 동작한다', () => {
    const entries = matchLexicon(tokenize([text]), lexicon);
    const marked = createVocabMatcher(entries)
      .split(text)
      .filter((s) => s.entry)
      .map((s) => s.text);
    expect(marked).toEqual(['agents', 'escalated', 'exponential\nbackoff', 'fork']);
  });

  it('구는 구성 단어가 모두 있어야 후보가 된다', () => {
    expect(matchLexicon(tokenize(['exponential growth']), lexicon)).toEqual([]);
  });

  it('하이픈 단어', () => {
    expect(matchLexicon(tokenize(['a fine-tuned model']), lexicon).map((e) => e.id)).toEqual(['qw:fine-tune']);
  });

  it('단어가 없으면 빈 배열', () => {
    expect(matchLexicon(new Set(), lexicon)).toEqual([]);
  });
});

describe('questionTexts', () => {
  it('문제 문장·본문·보기 라벨과 설명을 모은다 (해설 제외)', () => {
    const q = {
      id: 1,
      question: 'Which agent?',
      questionBody: '```\ncode\n```',
      choices: [
        { index: 1, label: 'A. latency', description: '' },
        { index: 2, label: 'B. fork', description: 'desc' },
      ],
      answer: 1,
      explanation: 'escalate is wrong',
      sourceFileId: 'f',
    } as QuizQuestion;
    expect(questionTexts([q])).toEqual(['Which agent?', '```\ncode\n```', 'A. latency', 'B. fork', 'desc']);
  });
});

describe('findInLexicon', () => {
  it('표제어·변화형·규칙 복수형으로 찾는다', () => {
    expect(findInLexicon(lexicon, 'Escalation')?.word).toBe('escalate');
    expect(findInLexicon(lexicon, 'agents')?.word).toBe('agent');
    expect(findInLexicon(lexicon, ' Exponential  Backoff ')?.word).toBe('exponential backoff');
    expect(findInLexicon(lexicon, 'unknown')).toBeUndefined();
  });
});

describe('resolveVocabSource', () => {
  it('단어장 앱을 골랐어도 앱이 없으면 문제은행 단어장', () => {
    expect(resolveVocabSource('wordApp', { bank: true, wordApp: true })).toBe('wordApp');
    expect(resolveVocabSource('wordApp', { bank: true, wordApp: false })).toBe('bank');
    expect(resolveVocabSource('bank', { bank: true, wordApp: true })).toBe('bank');
  });

  it('문제은행 단어장이 비어 있으면 단어장 앱', () => {
    expect(resolveVocabSource('bank', { bank: false, wordApp: true })).toBe('wordApp');
    expect(resolveVocabSource('bank', { bank: false, wordApp: false })).toBe('bank');
  });
});

describe('단어장 앱 주소', () => {
  it('단어 상세 열기 주소 (x-callback-url)', () => {
    expect(wordAppLookupUrl(' exponential  backoff ')).toBe(
      `quizword://lookup?word=exponential%20backoff&x-source=${encodeURIComponent('문제은행')}&x-error=quizbank%3A%2F%2Fword-lookup-result`
    );
  });

  it('결과 없음 알림 주소를 읽는다', () => {
    const msg = encodeURIComponent('단어장에 없는 단어예요');
    expect(parseWordLookupResult(`quizbank://word-lookup-result?errorCode=not_found&errorMessage=${msg}&word=qwerty%20x`)).toEqual({
      errorCode: 'not_found',
      word: 'qwerty x',
    });
    expect(parseWordLookupResult('quizbank:///word-lookup-result')).toEqual({ errorCode: 'unknown', word: '' });
    expect(parseWordLookupResult('quizbank://history')).toBeNull();
    expect(parseWordLookupResult('/cat/quiz?setup=1')).toBeNull();
    expect(parseWordLookupResult('')).toBeNull();
  });
});

import { createVocabMatcher, type VocabEntry } from '../../../lib/vocab/matcher';

const entry = (word: string, forms?: string[]): VocabEntry => ({
  id: word.replace(/\s+/g, '-'),
  word,
  meaning: '뜻',
  forms,
});

/** 매칭된 조각의 텍스트만 뽑는다 */
const marked = (text: string, entries: VocabEntry[]) =>
  createVocabMatcher(entries)
    .split(text)
    .filter((s) => s.entry)
    .map((s) => s.text);

describe('createVocabMatcher', () => {
  it('조각을 이으면 원문과 같다', () => {
    const text = 'Halt analysis and escalate to the coordinator, then escalate again.';
    const segments = createVocabMatcher([entry('escalate')]).split(text);
    expect(segments.map((s) => s.text).join('')).toBe(text);
    expect(segments.filter((s) => s.entry)).toHaveLength(2);
  });

  it('매칭이 없으면 원문 한 조각을 돌려준다', () => {
    expect(createVocabMatcher([entry('escalate')]).split('nothing here')).toEqual([
      { text: 'nothing here' },
    ]);
    expect(createVocabMatcher([]).split('anything')).toEqual([{ text: 'anything' }]);
    expect(createVocabMatcher([entry('escalate')]).split('')).toEqual([{ text: '' }]);
  });

  it('대소문자를 구분하지 않고 원문 표기를 유지한다', () => {
    expect(marked('Escalate or ESCALATE', [entry('escalate')])).toEqual(['Escalate', 'ESCALATE']);
  });

  it('규칙 복수형·3인칭(-s, -es)을 자동으로 인식한다', () => {
    expect(marked('it escalates', [entry('escalate')])).toEqual(['escalates']);
    expect(marked('two processes', [entry('process')])).toEqual(['processes']);
  });

  it('forms 에 적은 변형을 같은 항목으로 찾는다', () => {
    const e = entry('escalate', ['escalated', 'escalation']);
    const segments = createVocabMatcher([e]).split('escalated via an escalation path');
    expect(segments.filter((s) => s.entry).map((s) => [s.text, s.entry?.id])).toEqual([
      ['escalated', 'escalate'],
      ['escalation', 'escalate'],
    ]);
  });

  it('forms 에 없는 변형은 표시하지 않는다', () => {
    expect(marked('it escalated', [entry('escalate')])).toEqual([]);
  });

  it('긴 표현(구)이 짧은 표현보다 먼저 맞는다', () => {
    const entries = [entry('backoff'), entry('exponential backoff')];
    const segments = createVocabMatcher(entries).split('retry with exponential backoff');
    expect(segments.filter((s) => s.entry).map((s) => s.entry?.word)).toEqual(['exponential backoff']);
  });

  it('구 사이의 줄바꿈·여러 칸도 같은 구로 본다', () => {
    expect(marked('exponential\n  backoff', [entry('exponential backoff')])).toEqual([
      'exponential\n  backoff',
    ]);
  });

  it('긴 표현이 단어 중간에서 끊기면 더 짧은 표현을 맞춘다', () => {
    const entries = [entry('context'), entry('context window')];
    expect(marked('context windowing', entries)).toEqual(['context']);
  });

  it('다른 단어의 일부는 표시하지 않는다', () => {
    const entries = [entry('use'), entry('tune')];
    expect(marked('because causes reuse fine-tuned', entries)).toEqual([]);
  });

  it('구두점·따옴표·한글 조사에 닿은 단어는 표시한다', () => {
    const entries = [entry('fork'), entry('verbose')];
    expect(marked('(fork), "verbose" fork를 verbose.', entries)).toEqual([
      'fork',
      'verbose',
      'fork',
      'verbose',
    ]);
  });

  it('정규식 특수 문자가 든 표현도 그대로 찾는다', () => {
    expect(marked('Use C++ or c++ here', [entry('C++')])).toEqual(['C++', 'c++']);
  });

  it('한 표현이 두 항목에 있으면 먼저 등록된 항목을 쓴다', () => {
    const first = { ...entry('fork'), id: 'first' };
    const second = { ...entry('fork'), id: 'second' };
    const [seg] = createVocabMatcher([first, second])
      .split('fork')
      .filter((s) => s.entry);
    expect(seg.entry?.id).toBe('first');
  });
});

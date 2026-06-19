import { mapExplanationSymbols, stripChoiceSymbol } from '../../../lib/utils/quizUtils';
import type { Choice } from '../../../lib/parser/quizParser';

describe('quizUtils', () => {
  describe('stripChoiceSymbol', () => {
    it('removes circled, numeric and alphabetic leading symbols', () => {
      expect(stripChoiceSymbol('① Choice A')).toBe('Choice A');
      expect(stripChoiceSymbol('1. Choice A')).toBe('Choice A');
      expect(stripChoiceSymbol('A) Choice A')).toBe('Choice A');
    });
  });

  describe('mapExplanationSymbols', () => {
    // example.md 형식: 보기 라벨은 숫자("1.")를 사용한다.
    const originalChoices: Choice[] = [
      { index: 0, label: '1. Option A', description: '' },
      { index: 1, label: '2. Option B', description: '' },
      { index: 2, label: '3. Option C', description: '' },
      { index: 3, label: '4. Option D', description: '' },
    ];

    // 화면 표시(셔플) 순서: [원본③, 원본①, 원본④, 원본②]
    // → 원본 index 0,1,2,3 의 새 표시 번호는 각각 2,4,1,3
    const shuffledChoices: Choice[] = [
      { index: 2, label: '3. Option C', description: '' },
      { index: 0, label: '1. Option A', description: '' },
      { index: 3, label: '4. Option D', description: '' },
      { index: 1, label: '2. Option B', description: '' },
    ];

    it('returns the explanation unchanged when empty', () => {
      expect(mapExplanationSymbols('', originalChoices, shuffledChoices)).toBe('');
    });

    it('reorders and renumbers the circled "문제 번역" list to match shuffled order', () => {
      const explanation = [
        '**📝 문제 번역**',
        '',
        '- **①** 번역 A',
        '- **②** 번역 B',
        '- **③** 번역 C',
        '- **④** 번역 D',
      ].join('\n');

      const result = mapExplanationSymbols(explanation, originalChoices, shuffledChoices);
      const lines = result.split('\n').filter((l) => l.startsWith('- '));

      // 셔플 순서대로 정렬되고, 번호는 숫자 1·2·3·4 로 재번호된다.
      expect(lines).toEqual([
        '- **1** 번역 C',
        '- **2** 번역 A',
        '- **3** 번역 D',
        '- **4** 번역 B',
      ]);
    });

    it('reorders and renumbers the bottom numeric analysis list (regression)', () => {
      const explanation = [
        '1. **오답** - 분석 A',
        '2. **오답** - 분석 B',
        '3. **정답** - 분석 C',
        '4. **오답** - 분석 D',
      ].join('\n');

      const result = mapExplanationSymbols(explanation, originalChoices, shuffledChoices);
      const lines = result.split('\n');

      expect(lines[0]).toContain('정답');
      expect(lines[0]).toContain('분석 C');
      expect(lines[0].startsWith('1')).toBe(true);
      expect(lines.map((l) => l.slice(-1))).toEqual(['C', 'A', 'D', 'B']);
      expect(lines.map((l) => l[0])).toEqual(['1', '2', '3', '4']);
    });

    it('keeps the two lists separate and preserves general content in place', () => {
      const explanation = [
        '**📝 문제 번역**',
        '',
        '지문 번역입니다: (1) 첫째 (2) 둘째 (3) 셋째.',
        '',
        '- **①** 번역 A',
        '- **②** 번역 B',
        '- **③** 번역 C',
        '- **④** 번역 D',
        '',
        '> **핵심 진단:** 진단 내용',
        '',
        '```yaml',
        'code: here',
        '```',
        '',
        '1. **오답** - 분석 A',
        '2. **오답** - 분석 B',
        '3. **정답** - 분석 C',
        '4. **오답** - 분석 D',
      ].join('\n');

      const result = mapExplanationSymbols(explanation, originalChoices, shuffledChoices);

      // 번역 목록(번역 C..)은 핵심 진단보다 앞에, 분석 목록은 그 뒤에 온다 (섞이지 않음).
      const posTransFirst = result.indexOf('번역 C');
      const posDiagnosis = result.indexOf('핵심 진단');
      const posCode = result.indexOf('code: here');
      const posAnalysisFirst = result.indexOf('정답** - 분석 C');
      expect(posTransFirst).toBeGreaterThan(-1);
      expect(posTransFirst).toBeLessThan(posDiagnosis);
      expect(posDiagnosis).toBeLessThan(posCode);
      expect(posCode).toBeLessThan(posAnalysisFirst);

      // 일반 콘텐츠(인용구/코드블록)는 그대로 보존된다.
      expect(result).toContain('> **핵심 진단:** 진단 내용');
      expect(result).toContain('```yaml\ncode: here\n```');

      // 지문 속 (1)(2)(3) 같은 비-보기 숫자는 변경되지 않는다.
      expect(result).toContain('(1) 첫째 (2) 둘째 (3) 셋째.');

      // 번역 목록은 셔플 순서대로 재번호된다.
      const bulletLines = result.split('\n').filter((l) => l.startsWith('- '));
      expect(bulletLines).toEqual([
        '- **1** 번역 C',
        '- **2** 번역 A',
        '- **3** 번역 D',
        '- **4** 번역 B',
      ]);
    });
  });
});

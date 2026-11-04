import { parseQuizMarkdown } from '../../../lib/parser/quizParser';

// 캐시 키가 원문 문자열이라 테스트마다 다른 파일 ID 를 써서 서로 섞이지 않게 한다
let seq = 0;
const parse = (md: string) => parseQuizMarkdown(md, `test-${seq++}`);

const CHOICES = [
  '| 보기 | 설명 |',
  '|------|------|',
  '| 1. 첫째 | |',
  '| **2. 둘째** | |',
  '| 3. 셋째 | |',
].join('\n');

describe('parseQuizMarkdown — 문제 본문 아래 코드블록 (questionBody)', () => {
  it('"###" 줄과 보기 표 사이의 코드블록을 questionBody 로 담는다', () => {
    const md = [
      '## 문제 1',
      '### **아래 루프의 근본 원인은 무엇일까요?**',
      '',
      '```python',
      'while True:',
      '    response = client.messages.create(...)',
      '```',
      '',
      CHOICES,
      '',
      '**정답: 2.**',
      '',
      '**해설:**',
      '',
      '해설 본문',
    ].join('\n');

    const [q] = parse(md);
    expect(q.question).toBe('아래 루프의 근본 원인은 무엇일까요?');
    expect(q.questionBody).toBe(
      '```python\nwhile True:\n    response = client.messages.create(...)\n```'
    );
    expect(q.choices.map((c) => c.label)).toEqual(['1. 첫째', '2. 둘째', '3. 셋째']);
    expect(q.answer).toBe(1);
    expect(q.explanation).toBe('해설 본문');
  });

  it('본문이 없으면 questionBody 가 없다', () => {
    const md = ['## 문제 1', '### **질문**', '', CHOICES, '', '**정답: 2.**', '**해설:** 짧은 해설'].join('\n');
    const [q] = parse(md);
    expect(q.questionBody).toBeUndefined();
    expect(q.question).toBe('질문');
    expect(q.explanation).toBe('짧은 해설');
  });

  it('본문 코드블록 안의 "|" 행·"**정답" 줄·"---" 는 구조로 해석하지 않는다', () => {
    const md = [
      '## 문제 1',
      '### **질문**',
      '',
      '```text',
      '| 1. 가짜 보기 | |',
      '**정답: 3.**',
      '---',
      '```',
      '',
      CHOICES,
      '',
      '**정답: 2.**',
      '**해설:** 해설',
    ].join('\n');

    const [q] = parse(md);
    expect(q.questionBody).toBe('```text\n| 1. 가짜 보기 | |\n**정답: 3.**\n---\n```');
    expect(q.choices).toHaveLength(3);
    expect(q.answer).toBe(1);
  });
});

describe('parseQuizMarkdown — 해설 속 코드블록', () => {
  it('코드블록 안의 "---" 에서 해설이 끊기지 않는다', () => {
    const md = [
      '## 문제 1',
      '### **질문**',
      '',
      CHOICES,
      '',
      '**정답: 2.**',
      '**해설:**',
      '',
      '```yaml',
      '---',
      'name: test',
      '---',
      '```',
      '',
      '코드블록 뒤 해설',
      '',
      '---',
      '',
      '## 문제 2',
      '### **두 번째 질문**',
      '',
      CHOICES,
      '',
      '**정답: 1.**',
    ].join('\n');

    const questions = parse(md);
    expect(questions).toHaveLength(2);
    expect(questions[0].explanation).toBe('```yaml\n---\nname: test\n---\n```\n\n코드블록 뒤 해설');
    expect(questions[1].answer).toBe(0);
  });

  it('코드블록 밖의 "---" 는 여전히 문항을 끝낸다', () => {
    const md = [
      '## 문제 1',
      '### **질문**',
      '',
      CHOICES,
      '',
      '**정답: 2.**',
      '**해설:** 해설',
      '---',
      '이 줄은 해설이 아니다',
    ].join('\n');

    const [q] = parse(md);
    expect(q.explanation).toBe('해설');
  });
});

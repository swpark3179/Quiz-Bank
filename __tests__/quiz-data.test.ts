/**
 * 문제 콘텐츠(assets/quiz-data) 검증
 *
 * master 에 푸시되면 앱에 즉시 반영되므로, 깨진 마크다운이나
 * config.json 과 어긋난 문항 수가 배포되기 전에 여기서 잡는다.
 */

import * as fs from 'fs';
import * as path from 'path';
import { parseQuizMarkdown } from '../lib/parser/quizParser';

const DATA_DIR = path.join(__dirname, '..', 'assets', 'quiz-data');

interface ConfigFile {
  id: string;
  name: string;
  questionCount: number;
  order: number;
}

interface ConfigCategory {
  id: string;
  name: string;
  files: ConfigFile[];
}

const config: ConfigCategory[] = JSON.parse(
  fs.readFileSync(path.join(DATA_DIR, 'config.json'), 'utf8')
);

describe('quiz-data/config.json', () => {
  it('카테고리 id 가 중복되지 않는다', () => {
    const ids = config.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('카테고리 폴더의 모든 .md 가 config 에 등록되어 있다', () => {
    for (const category of config) {
      const dir = path.join(DATA_DIR, category.id);
      const onDisk = fs.readdirSync(dir).filter((f) => f.endsWith('.md'));
      const registered = category.files.map((f) => `${f.id}.md`);
      expect({ category: category.id, unregistered: onDisk.filter((f) => !registered.includes(f)) })
        .toEqual({ category: category.id, unregistered: [] });
    }
  });
});

describe.each(config.flatMap((c) => c.files.map((f) => [`${c.id}/${f.id}.md`, f] as const)))(
  '%s',
  (storagePath, file) => {
    const filePath = path.join(DATA_DIR, storagePath);

    it('파일이 존재한다', () => {
      expect(fs.existsSync(filePath)).toBe(true);
    });

    if (!fs.existsSync(filePath)) return;

    const markdown = fs.readFileSync(filePath, 'utf8');
    const questions = parseQuizMarkdown(markdown, file.id);
    const headerIds = [...markdown.matchAll(/^## 문제\s+(\d+)/gm)].map((m) => parseInt(m[1], 10));

    it('모든 "## 문제 N" 블록이 파싱된다', () => {
      const parsedIds = new Set(questions.map((q) => q.id));
      expect(headerIds.filter((id) => !parsedIds.has(id))).toEqual([]);
    });

    it('문항 번호가 중복되지 않는다', () => {
      expect(new Set(headerIds).size).toBe(headerIds.length);
    });

    it('questionCount 가 실제 문항 수와 일치한다', () => {
      expect(questions.length).toBe(file.questionCount);
    });

    it('각 문항의 보기와 정답이 유효하다', () => {
      const invalid = questions
        .filter((q) => q.choices.length < 2 || q.answer < 0 || q.answer >= q.choices.length)
        .map((q) => q.id);
      expect(invalid).toEqual([]);
    });

    it('해설·문제 본문의 코드블록이 모두 닫혀 있다 (중간에 끊긴 문항이 없다)', () => {
      const fenceCount = (md: string) =>
        md.split('\n').filter((l) => /^\s*(```|~~~)/.test(l)).length;
      const unbalanced = questions
        .filter((q) => fenceCount(q.explanation) % 2 !== 0 || fenceCount(q.questionBody ?? '') % 2 !== 0)
        .map((q) => q.id);
      expect(unbalanced).toEqual([]);
    });

    // 앱은 이 파일을 master 에서 바로 받아 간다. 문제 본문(questionBody)을 모르는 예전 앱의 파서는
    // 본문 줄 중 "---"·"|"·"**정답" 으로 시작하는 줄을 문항 구조로 읽어 문항을 깨뜨린다.
    it('문제 본문에 예전 앱 파서를 깨뜨리는 줄이 없다', () => {
      const breaking = questions.flatMap((q) =>
        (q.questionBody ?? '')
          .split('\n')
          .map((l) => l.trim())
          .filter((l) => l === '---' || l.startsWith('|') || /^\*\*정답[:：]/.test(l))
          .map((l) => `${q.id}: ${l}`)
      );
      expect(breaking).toEqual([]);
    });
  }
);

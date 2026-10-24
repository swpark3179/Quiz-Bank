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
  }
);

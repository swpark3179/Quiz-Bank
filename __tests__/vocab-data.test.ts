/**
 * 단어장 콘텐츠(assets/quiz-data/vocab) 검증
 *
 * 문제 파일과 마찬가지로 master 에 푸시되면 앱에 즉시 반영되므로,
 * 깨진 index.json 이나 등록이 빠진 설명 파일을 배포 전에 잡는다.
 */

import * as fs from 'fs';
import * as path from 'path';
import { surfacesOf, type VocabEntry } from '../lib/vocab/matcher';

const DATA_DIR = path.join(__dirname, '..', 'assets', 'quiz-data');
const VOCAB_DIR = path.join(DATA_DIR, 'vocab');

const entries: VocabEntry[] = JSON.parse(fs.readFileSync(path.join(VOCAB_DIR, 'index.json'), 'utf8'));

/** 앱이 읽지 않는 안내·템플릿 파일 */
const isDocFile = (name: string) => name === 'README.md' || name.startsWith('_');

describe('quiz-data/vocab/index.json', () => {
  it('배열이다', () => {
    expect(Array.isArray(entries)).toBe(true);
  });

  it('각 항목의 필수 필드(id, word, meaning)가 채워져 있다', () => {
    const invalid = entries.filter(
      (e) =>
        typeof e.id !== 'string' ||
        typeof e.word !== 'string' ||
        typeof e.meaning !== 'string' ||
        !e.word.trim() ||
        !e.meaning.trim()
    );
    expect(invalid).toEqual([]);
  });

  it('id 는 소문자·숫자·하이픈만 쓴다 (파일 이름이 된다)', () => {
    expect(entries.map((e) => e.id).filter((id) => !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id))).toEqual([]);
  });

  it('id 가 중복되지 않는다', () => {
    const ids = entries.map((e) => e.id);
    expect(ids.filter((id, i) => ids.indexOf(id) !== i)).toEqual([]);
  });

  it('선택 필드의 형식이 맞다 (pos·ipa 는 문자열, forms 는 문자열 배열)', () => {
    const invalid = entries
      .filter(
        (e) =>
          (e.pos !== undefined && typeof e.pos !== 'string') ||
          (e.ipa !== undefined && typeof e.ipa !== 'string') ||
          (e.forms !== undefined &&
            (!Array.isArray(e.forms) || e.forms.some((f) => typeof f !== 'string' || !f.trim())))
      )
      .map((e) => e.id);
    expect(invalid).toEqual([]);
  });

  it('같은 표현(word·forms)이 두 단어에 등록되지 않는다', () => {
    const owner = new Map<string, string>();
    const conflicts: string[] = [];
    for (const e of entries) {
      for (const surface of surfacesOf(e)) {
        const prev = owner.get(surface);
        if (prev && prev !== e.id) conflicts.push(`"${surface}": ${prev}, ${e.id}`);
        owner.set(surface, e.id);
      }
    }
    expect(conflicts).toEqual([]);
  });
});

describe('quiz-data/vocab/*.md', () => {
  const mdFiles = fs.readdirSync(VOCAB_DIR).filter((f) => f.endsWith('.md') && !isDocFile(f));

  it('모든 설명 파일이 index.json 에 등록되어 있다', () => {
    const ids = new Set(entries.map((e) => e.id));
    expect(mdFiles.filter((f) => !ids.has(f.replace(/\.md$/, '')))).toEqual([]);
  });

  it('설명 파일이 비어 있지 않다', () => {
    const empty = mdFiles.filter((f) => !fs.readFileSync(path.join(VOCAB_DIR, f), 'utf8').trim());
    expect(empty).toEqual([]);
  });
});

describe('quiz-data/config.json', () => {
  it('단어장 폴더 이름(vocab)을 카테고리 id 로 쓰지 않는다', () => {
    const config: { id: string }[] = JSON.parse(
      fs.readFileSync(path.join(DATA_DIR, 'config.json'), 'utf8')
    );
    expect(config.map((c) => c.id)).not.toContain('vocab');
  });
});

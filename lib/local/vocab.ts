/**
 * 단어장 콘텐츠 로더 (`quiz-data/vocab/`)
 *
 * - index.json: 등록 단어 목록 — 문제 텍스트에서 찾을 표현과 한 줄 뜻.
 *   퀴즈를 시작할 때 한 번 받는다. 실패하면 마지막 다운로드본 → 앱 내장본 순으로 대체.
 * - {id}.md: 단어별 상세 설명 (선택). 팝업을 열 때 받는다. 없으면 한 줄 뜻만 보여 준다.
 *
 * 문제 파일과 같은 경로 규칙을 쓴다: 웹/모바일은 GitHub Raw, 데스크탑은 .exe 옆 `quiz-data/`.
 */

import type { VocabEntry } from '../vocab/matcher';
import { readCached, writeCached } from './diskCache';

const GITHUB_BASE_URL = 'https://raw.githubusercontent.com/swpark3179/Quiz-Bank/master/assets/quiz-data';
const INDEX_PATH = 'vocab/index.json';

function isDesktop(): boolean {
  return typeof window !== 'undefined' && window.location?.protocol === 'app:';
}

function urlFor(path: string): string {
  return isDesktop() ? `/quiz-data/${path}` : `${GITHUB_BASE_URL}/${path}?t=${Date.now()}`;
}

/** 형식이 맞는 항목만 남긴다 — 잘못 적은 한 항목 때문에 단어장 전체가 꺼지지 않게 한다 */
function sanitize(data: unknown): VocabEntry[] {
  if (!Array.isArray(data)) return [];
  const isText = (v: unknown): v is string => typeof v === 'string' && v.trim().length > 0;

  return data.flatMap((raw): VocabEntry[] => {
    if (!raw || typeof raw !== 'object') return [];
    const { id, word, meaning, pos, ipa, forms } = raw as Record<string, unknown>;
    if (!isText(id) || !isText(word) || !isText(meaning)) return [];
    return [
      {
        id,
        word,
        meaning,
        pos: isText(pos) ? pos : undefined,
        ipa: isText(ipa) ? ipa : undefined,
        forms: Array.isArray(forms) ? forms.filter(isText) : undefined,
      },
    ];
  });
}

let indexCache: VocabEntry[] | null = null;
let indexRequest: Promise<VocabEntry[]> | null = null;

/** 등록 단어 목록 (앱 세션 동안 메모리 캐시) */
export function fetchVocabIndex(): Promise<VocabEntry[]> {
  if (indexCache) return Promise.resolve(indexCache);
  // 설정 시트와 퀴즈 화면이 동시에 요청해도 한 번만 받는다
  indexRequest ??= loadIndex().finally(() => {
    indexRequest = null;
  });
  return indexRequest;
}

async function loadIndex(): Promise<VocabEntry[]> {
  const desktop = isDesktop();
  try {
    const response = await fetch(urlFor(INDEX_PATH));
    if (!response.ok) throw new Error(`[QuizBank] 단어장 로드 실패: ${response.status}`);
    const text = await response.text();
    indexCache = sanitize(JSON.parse(text));
    if (!desktop) writeCached(INDEX_PATH, text);
    return indexCache;
  } catch (error) {
    console.warn('단어장 로드 오류:', error);
    // [Fallback 1] 마지막으로 받은 목록 (메모리 캐시에는 넣지 않아 다음에 다시 시도한다)
    const cached = desktop ? null : await readCached(INDEX_PATH);
    if (cached !== null) {
      try {
        return sanitize(JSON.parse(cached));
      } catch {
        // 손상된 캐시는 무시하고 내장 파일로 대체
      }
    }
    // [Fallback 2] 앱에 내장된 목록
    return sanitize(require('@/assets/quiz-data/vocab/index.json'));
  }
}

/** 상세 설명 결과 — 파일이 없으면 'none', 받지 못했으면 'error' */
export type VocabDetail = { status: 'ok'; markdown: string } | { status: 'none' } | { status: 'error' };

const detailCache = new Map<string, VocabDetail>();

/** 이미 받아 둔 상세 설명 (없으면 undefined) — 다시 열 때 로딩 표시 없이 바로 그린다 */
export function peekVocabDetail(id: string): VocabDetail | undefined {
  return detailCache.get(id);
}

/** 단어 상세 설명 (vocab/{id}.md). 같은 단어를 다시 열면 메모리 캐시를 쓴다 */
export async function fetchVocabDetail(id: string): Promise<VocabDetail> {
  const hit = detailCache.get(id);
  if (hit) return hit;

  const path = `vocab/${id}.md`;
  const desktop = isDesktop();
  try {
    const response = await fetch(urlFor(path));
    if (response.status === 404) {
      // 상세 파일은 선택 사항 — 한 줄 뜻만 등록한 단어
      const none: VocabDetail = { status: 'none' };
      detailCache.set(id, none);
      return none;
    }
    if (!response.ok) throw new Error(`[QuizBank] 단어 설명 로드 실패 (${response.status}): ${path}`);

    const markdown = (await response.text()).trim();
    const detail: VocabDetail = markdown ? { status: 'ok', markdown } : { status: 'none' };
    detailCache.set(id, detail);
    if (!desktop) writeCached(path, markdown);
    return detail;
  } catch (error) {
    console.warn('단어 설명 로드 오류:', error);
    const cached = desktop ? null : await readCached(path);
    if (cached !== null) return cached ? { status: 'ok', markdown: cached } : { status: 'none' };
    return { status: 'error' };
  }
}

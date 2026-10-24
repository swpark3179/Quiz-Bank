/**
 * 카테고리 & 퀴즈 파일 목록 조회
 *
 * - 일반 웹/모바일: GitHub 저장소의 master 브랜치 config.json을 실시간 조회
 * - Windows Electron 데스크탑: .exe 옆 `quiz-data/config.json`에서 로컬 로드
 */

import { readCached, writeCached } from './diskCache';

const GITHUB_BASE_URL = 'https://raw.githubusercontent.com/swpark3179/Quiz-Bank/master/assets/quiz-data';

function isDesktop(): boolean {
  return typeof window !== 'undefined' && window.location?.protocol === 'app:';
}

export interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  order: number;
}

export interface QuizFile {
  id: string;
  name: string;
  /** GitHub Raw URL 조회용 키 (예: "ai-basics/chapter-01.md") */
  storagePath: string;
  questionCount: number;
  order: number;
  categoryId: string;
}

// 메모리 캐시 (목록 로딩 속도 향상용)
let configCache: any[] | null = null;

/** 전체 카테고리 목록 반환 */
export async function fetchCategories(): Promise<Category[]> {
  const config = await fetchConfig();
  return config.map(({ files: _files, ...cat }: any) => cat);
}

/**
 * 카테고리 id → 표시 이름. 화면 제목·이력 표시용이라 실패해도 던지지 않고
 * 빈 객체를 돌려준다 (호출부는 id 로 대신 표시).
 */
export async function fetchCategoryNames(): Promise<Record<string, string>> {
  try {
    const categories = await fetchCategories();
    return Object.fromEntries(categories.map((c) => [c.id, c.name]));
  } catch {
    return {};
  }
}

/** 특정 카테고리의 퀴즈 파일 목록 반환 */
export async function fetchQuizFiles(categoryId: string): Promise<QuizFile[]> {
  const config = await fetchConfig();
  const category = config.find((c: any) => c.id === categoryId);
  if (!category) return [];

  return category.files.map((file: any) => ({
    id: file.id,
    name: file.name,
    storagePath: `${categoryId}/${file.id}.md`,
    questionCount: file.questionCount,
    order: file.order,
    categoryId,
  }));
}

/** Config JSON 다운로드 로직 (캐시 포함) */
async function fetchConfig(): Promise<any[]> {
  if (configCache) return configCache;

  const desktop = isDesktop();

  try {
    const url = desktop
      ? `/quiz-data/config.json`
      : `${GITHUB_BASE_URL}/config.json?t=${Date.now()}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`[QuizBank] Config 로드 실패: ${response.status}`);
    }

    const text = await response.text();
    const data = JSON.parse(text);
    configCache = data;
    if (!desktop) writeCached('config.json', text);
    return data;
  } catch (error) {
    console.error('Config 로드 오류:', error);
    // [Fallback 1] 마지막으로 받은 config 사용 (오프라인 지원)
    const cached = desktop ? null : await readCached('config.json');
    if (cached !== null) {
      try {
        return JSON.parse(cached);
      } catch {
        // 손상된 캐시는 무시하고 내장 파일로 대체
      }
    }
    // [Fallback 2] 앱에 내장된 파일로 임시 대체
    const localData = require('@/assets/quiz-data/config.json');
    return localData;
  }
}

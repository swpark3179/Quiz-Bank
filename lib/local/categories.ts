/**
 * GitHub 기반 카테고리 & 퀴즈 파일 목록 조회
 *
 * GitHub 저장소의 main 브랜치에 있는 config.json을 실시간으로 가져옵니다.
 * 마치 Firebase처럼 동작하여, 앱을 재빌드하지 않아도 목록이 업데이트됩니다.
 */

const GITHUB_BASE_URL = 'https://raw.githubusercontent.com/swpark3179/Quiz-Bank/main/assets/quiz-data';

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

  try {
    // 캐시 방지를 위해 랜덤 쿼리 파라미터 추가
    const url = `${GITHUB_BASE_URL}/config.json?t=${Date.now()}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`[QuizBank] Config 로드 실패: ${response.status}`);
    }

    const data = await response.json();
    configCache = data;
    return data;
  } catch (error) {
    console.error('GitHub Config 다운로드 오류:', error);
    // [Fallback] 앱에 내장된 파일로 임시 대체 (오프라인 지원)
    const localData = require('@/assets/quiz-data/config.json');
    return localData;
  }
}

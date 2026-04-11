/**
 * GitHub 기반 퀴즈 문제 다운로드
 *
 * GitHub 저장소에 올라가 있는 마크다운 파일을 네트워크 통해 실시간으로 다운로드.
 */

const GITHUB_BASE_URL = 'https://raw.githubusercontent.com/swpark3179/Quiz-Bank/main/assets/quiz-data';

/** 메모리 캐시 (앱 세션 동안 재다운로드 방지) */
const contentCache: Record<string, string> = {};

/**
 * storagePath에 해당하는 .md 파일 내용을 반환
 * @param storagePath "ai-basics/chapter-01.md" 형식
 */
export async function fetchQuizMarkdown(storagePath: string): Promise<string> {
  // 이미 로드된 적 있으면 캐시 반환
  if (contentCache[storagePath]) {
    return contentCache[storagePath];
  }

  // 캐시 무효화를 위한 파라미터 (t) 추가 (항상 최신본)
  const url = `${GITHUB_BASE_URL}/${storagePath}?t=${Date.now()}`;

  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`[QuizBank] 다운로드 실패 (${response.status}): ${url}`);
    }

    const content = await response.text();
    // 성공 시 캐시 저장
    contentCache[storagePath] = content;
    
    return content;

  } catch (error) {
    console.error(`[QuizBank] 마크다운 다운로드 실패: ${url}`, error);
    throw error;
  }
}

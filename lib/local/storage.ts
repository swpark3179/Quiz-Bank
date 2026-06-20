/**
 * 퀴즈 문제(.md) 콘텐츠 로더
 *
 * - 일반 웹/모바일: GitHub Raw에서 실시간 다운로드
 * - Windows Electron 데스크탑(`app://` 스킴): .exe 옆 `quiz-data/` 폴더에서 로컬 로드
 */

const GITHUB_BASE_URL = 'https://raw.githubusercontent.com/swpark3179/Quiz-Bank/master/assets/quiz-data';

/** Electron(데스크탑) 빌드에서는 커스텀 스킴 `app:`로 호스팅된다. */
function isDesktop(): boolean {
  return typeof window !== 'undefined' && window.location?.protocol === 'app:';
}

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

  // 데스크탑은 로컬 상대경로, 웹/모바일은 GitHub Raw URL을 사용한다.
  const url = isDesktop()
    ? `/quiz-data/${storagePath}`
    : `${GITHUB_BASE_URL}/${storagePath}?t=${Date.now()}`;

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
    console.error(`[QuizBank] 마크다운 로드 실패: ${url}`, error);
    throw error;
  }
}

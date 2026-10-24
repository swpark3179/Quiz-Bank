/**
 * 퀴즈 콘텐츠 영구 캐시 (오프라인 대비)
 *
 * GitHub Raw 다운로드가 실패했을 때 마지막으로 받은 내용을 대신 사용하기 위한 저장소.
 * - 네이티브(iOS/Android): 앱 문서 폴더의 `quiz-cache/`
 * - 웹: localStorage
 *
 * 캐시는 부가 기능이므로 모든 I/O 오류는 무시한다.
 */

import { Platform } from 'react-native';
import { Directory, File, Paths } from 'expo-file-system';

const CACHE_DIR_NAME = 'quiz-cache';
const WEB_KEY_PREFIX = 'quiz-cache:';

/** "ai-basics/chapter-01.md" → "ai-basics__chapter-01.md" */
function cacheFile(key: string): File {
  return new File(Paths.document, CACHE_DIR_NAME, key.replace(/\//g, '__'));
}

/** 캐시된 내용 반환 (없거나 읽기 실패 시 null) */
export async function readCached(key: string): Promise<string | null> {
  try {
    if (Platform.OS === 'web') {
      return localStorage.getItem(WEB_KEY_PREFIX + key);
    }
    const file = cacheFile(key);
    return file.exists ? await file.text() : null;
  } catch {
    return null;
  }
}

/** 다운로드에 성공한 내용을 캐시에 저장 */
export function writeCached(key: string, content: string): void {
  try {
    if (Platform.OS === 'web') {
      localStorage.setItem(WEB_KEY_PREFIX + key, content);
      return;
    }
    new Directory(Paths.document, CACHE_DIR_NAME).create({ intermediates: true, idempotent: true });
    cacheFile(key).write(content);
  } catch {
    // 저장 실패는 무시 (다음 다운로드 성공 시 다시 시도)
  }
}

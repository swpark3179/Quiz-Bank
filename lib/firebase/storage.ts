/**
 * Firebase Storage에서 .md 파일 다운로드
 * expo-file-system을 이용한 로컬 캐시 연동
 */

import storage from '@react-native-firebase/storage';
import * as FileSystem from 'expo-file-system';

const CACHE_DIR = `${FileSystem.cacheDirectory}quiz-md/`;

/** 캐시 디렉터리 초기화 */
async function ensureCacheDir() {
  const info = await FileSystem.getInfoAsync(CACHE_DIR);
  if (!info.exists) {
    await FileSystem.makeDirectoryAsync(CACHE_DIR, { intermediates: true });
  }
}

/** storagePath → 로컬 캐시 파일 경로 변환 */
function getCacheFilePath(storagePath: string): string {
  // "quiz-data/ai-basics/chapter-01.md" → "quiz-md_quiz-data_ai-basics_chapter-01.md"
  const safeName = storagePath.replace(/[/\\]/g, '_');
  return `${CACHE_DIR}${safeName}`;
}

/**
 * Firebase Storage에서 마크다운 파일 내용 조회
 * 캐시에 있으면 캐시 반환, 없으면 다운로드 후 캐시 저장
 */
export async function fetchQuizMarkdown(storagePath: string): Promise<string> {
  await ensureCacheDir();
  const cacheFile = getCacheFilePath(storagePath);

  // 캐시 확인
  const cached = await FileSystem.getInfoAsync(cacheFile);
  if (cached.exists) {
    const content = await FileSystem.readAsStringAsync(cacheFile);
    return content;
  }

  // Firebase Storage에서 다운로드 URL 획득
  const url = await storage().ref(storagePath).getDownloadURL();

  // 다운로드 & 캐시 저장
  await FileSystem.downloadAsync(url, cacheFile);
  const content = await FileSystem.readAsStringAsync(cacheFile);
  return content;
}

/**
 * 특정 파일의 캐시 무효화 (강제 새로고침)
 */
export async function invalidateCache(storagePath: string): Promise<void> {
  const cacheFile = getCacheFilePath(storagePath);
  const info = await FileSystem.getInfoAsync(cacheFile);
  if (info.exists) {
    await FileSystem.deleteAsync(cacheFile);
  }
}

/**
 * 전체 캐시 삭제
 */
export async function clearAllCache(): Promise<void> {
  const info = await FileSystem.getInfoAsync(CACHE_DIR);
  if (info.exists) {
    await FileSystem.deleteAsync(CACHE_DIR, { idempotent: true });
  }
}

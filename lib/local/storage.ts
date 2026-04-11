/**
 * 로컬 번들 .md 파일 읽기
 *
 * expo-asset으로 번들된 .md 파일을 로컬 URI로 다운로드한 후
 * expo-file-system으로 텍스트를 읽어 반환한다.
 *
 * 인자: storagePath = "{categoryId}/{fileId}" (assets/quiz-data/config.ts의 FILE_MODULE_MAP 키)
 */

import { Asset } from 'expo-asset';
import * as FileSystem from 'expo-file-system';
import { FILE_MODULE_MAP } from '@/assets/quiz-data/config';

/** 메모리 캐시 (앱 세션 동안 유지) */
const contentCache: Record<string, string> = {};

/**
 * storagePath에 해당하는 .md 파일 내용을 반환
 * @param storagePath  "{categoryId}/{fileId}" 형식
 */
export async function fetchQuizMarkdown(storagePath: string): Promise<string> {
  // 캐시 hit
  if (contentCache[storagePath]) {
    return contentCache[storagePath];
  }

  const moduleId = FILE_MODULE_MAP[storagePath];
  if (moduleId === undefined) {
    throw new Error(
      `[QuizBank] 파일을 찾을 수 없습니다: "${storagePath}"\n` +
      `assets/quiz-data/config.ts 의 FILE_MODULE_MAP 에 등록되어 있는지 확인하세요.`
    );
  }

  // expo-asset으로 번들 에셋을 로컬 URI로 준비
  const asset = Asset.fromModule(moduleId);
  await asset.downloadAsync();

  if (!asset.localUri) {
    throw new Error(`[QuizBank] 에셋 로컬 URI를 얻지 못했습니다: ${storagePath}`);
  }

  const content = await FileSystem.readAsStringAsync(asset.localUri);
  contentCache[storagePath] = content;
  return content;
}

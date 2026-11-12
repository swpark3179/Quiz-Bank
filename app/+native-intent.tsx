/**
 * 다른 앱이 연 주소 다듬기 (iOS·Android, 웹·데스크탑에서는 쓰이지 않는다).
 *
 * 단어장 앱(Quiz Word)에서 단어 상세를 열었는데 그 단어가 없으면, 단어장 앱이
 * quizbank://word-lookup-result?errorCode=not_found&word=… 를 열어 알려 온다 (x-callback-url 의 x-error).
 * 이 주소는 화면이 아니므로 알림만 띄우고 이동하지 않는다 — 앱이 켜져 있을 때 빈 문자열을 돌려주면
 * expo-router 가 이동을 건너뛴다(expo-router 6 build/link/linking.js). 앱이 새로 켜졌으면 홈으로 간다.
 * 이 함수는 앱의 React 트리 밖에서 불리고, 여기서 던지면 앱이 죽으므로 모두 잡는다.
 */
import { Alert } from 'react-native';
import { parseWordLookupResult } from '@/lib/vocab/wordApp';

export function redirectSystemPath({ path, initial }: { path: string; initial: boolean }): string {
  try {
    const result = parseWordLookupResult(path);
    if (!result) return path;
    const message =
      result.errorCode === 'not_found'
        ? `단어장 앱에 "${result.word}" 이(가) 없어요.`
        : '단어장 앱에서 단어를 찾지 못했어요.';
    // 앱이 앞으로 오는 전환이 끝난 뒤에 띄운다 (전환 중에 띄우면 iOS 에서 묻힐 수 있다)
    setTimeout(() => Alert.alert('단어장', message), 400);
    return initial ? '/' : '';
  } catch {
    return initial ? '/' : path;
  }
}

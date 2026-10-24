import { Platform } from 'react-native';
import * as Haptics from 'expo-haptics';

/**
 * 채점 결과 햅틱 피드백.
 * 웹(데스크탑 Electron 포함)에서는 진동이 의미 없으므로 생략한다.
 */
export function hapticAnswerResult(correct: boolean): void {
  if (Platform.OS === 'web') return;
  Haptics.notificationAsync(
    correct ? Haptics.NotificationFeedbackType.Success : Haptics.NotificationFeedbackType.Error
  ).catch(() => {
    // 햅틱을 지원하지 않는 기기는 조용히 무시
  });
}

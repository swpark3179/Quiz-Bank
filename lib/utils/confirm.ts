import { Alert, Platform } from 'react-native';

interface ConfirmOptions {
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel?: string;
  destructive?: boolean;
}

/**
 * 확인/취소 대화상자.
 * react-native-web 의 Alert.alert 는 아무것도 띄우지 않으므로 웹(데스크탑 Electron 포함)에서는
 * window.confirm 을 쓴다.
 */
export function confirmAsync({
  title,
  message,
  confirmLabel,
  cancelLabel = '취소',
  destructive = false,
}: ConfirmOptions): Promise<boolean> {
  if (Platform.OS === 'web') {
    const ok = typeof window !== 'undefined' && typeof window.confirm === 'function'
      ? window.confirm(`${title}\n\n${message}`)
      : true;
    return Promise.resolve(ok);
  }

  return new Promise((resolve) => {
    Alert.alert(
      title,
      message,
      [
        { text: cancelLabel, style: 'cancel', onPress: () => resolve(false) },
        { text: confirmLabel, style: destructive ? 'destructive' : 'default', onPress: () => resolve(true) },
      ],
      { cancelable: true, onDismiss: () => resolve(false) }
    );
  });
}

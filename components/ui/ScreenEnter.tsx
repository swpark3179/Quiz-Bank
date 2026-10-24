import React from 'react';
import { Platform, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

// 웹(데스크탑 Electron 포함)에는 네이티브 스택 전환 애니메이션이 없어 화면이 즉시 바뀐다.
// 웹에서만 콘텐츠를 짧게 페이드인해 화면 사이의 연결감을 준다. (네이티브는 스택 전환을 그대로 쓴다)
const webEntering = Platform.OS === 'web' ? FadeIn.duration(160) : undefined;

interface ScreenEnterProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export function ScreenEnter({ children, style }: ScreenEnterProps) {
  return (
    <Animated.View entering={webEntering} style={[styles.fill, style]}>
      {children}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  fill: {
    flex: 1,
  },
});

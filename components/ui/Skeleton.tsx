import React, { useEffect } from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { Colors, Spacing, Radius } from '@/lib/theme';

/** 깜빡이는 자리 표시 블록 (1.2s 주기, '동작 줄이기' 설정 시 멈춤) */
export function SkeletonBlock({ style }: { style?: StyleProp<ViewStyle> }) {
  const opacity = useSharedValue(1);

  useEffect(() => {
    opacity.set(withRepeat(withTiming(0.5, { duration: 600 }), -1, true));
  }, [opacity]);

  const pulseStyle = useAnimatedStyle(() => ({ opacity: opacity.get() }));

  return <Animated.View style={[styles.block, style, pulseStyle]} />;
}

interface ScreenSkeletonProps {
  /** 맨 위 요약 카드 높이 (화면마다 실제 카드와 비슷하게) */
  summaryHeight?: number;
  rows?: number;
}

/**
 * 요약 카드 + 목록 모양의 화면 골격.
 * 데이터를 읽는 동안 빈 화면 대신 보여 주고, 준비되면 콘텐츠가 페이드인으로 교체한다.
 */
export function ScreenSkeleton({ summaryHeight = 140, rows = 4 }: ScreenSkeletonProps) {
  return (
    <View
      style={styles.screen}
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel="불러오는 중"
    >
      <SkeletonBlock style={[styles.summary, { height: summaryHeight }]} />
      <SkeletonBlock style={styles.label} />
      {Array.from({ length: rows }, (_, i) => (
        <SkeletonBlock key={i} style={styles.row} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.bg.primary,
    padding: Spacing.base,
    gap: Spacing.md,
  },
  block: {
    backgroundColor: '#C7D0DE',
    borderRadius: Radius.md,
  },
  summary: {
    borderRadius: Radius.xl,
  },
  label: {
    height: 14,
    width: '35%',
    marginTop: Spacing.sm,
  },
  row: {
    height: 64,
  },
});

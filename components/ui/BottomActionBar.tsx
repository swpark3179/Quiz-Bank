import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Spacing } from '@/lib/theme';

interface BottomActionBarProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

/**
 * 화면 하단에 고정되는 액션 바.
 * 스크롤 영역 바깥(형제)에 두고, 기기 하단 안전 영역만큼 아래 여백을 준다.
 * 이 바를 쓰는 화면의 SafeAreaView 는 bottom edge 를 빼야 바 아래 색이 끊기지 않는다.
 */
export function BottomActionBar({ children, style }: BottomActionBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.bar, { paddingBottom: Spacing.md + insets.bottom }, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.md,
    backgroundColor: Colors.surface.sheet,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
});

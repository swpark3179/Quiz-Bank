import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Typography, Spacing, Radius } from '@/lib/theme';

type BadgeVariant = 'default' | 'success' | 'error' | 'warning' | 'info' | 'neutral';

interface NordBadgeProps {
  label: string;
  variant?: BadgeVariant;
  size?: 'sm' | 'md';
}

// 알파 합성('+25'/'+20') 제거 — 다크닝된 status 색을 그대로 텍스트로,
// 솔리드 배경 토큰을 배경으로 사용
const variantConfig: Record<BadgeVariant, { bg: string; text: string }> = {
  default:  { bg: Colors.choice.selected,    text: Colors.accent.primary },
  success:  { bg: Colors.status.correctBg,   text: Colors.status.correct },
  error:    { bg: Colors.status.wrongBg,     text: Colors.status.wrong },
  warning:  { bg: '#FBF3DE',                  text: '#8A6D0A' },
  info:     { bg: '#EFF4F8',                  text: Colors.accent.secondary },
  neutral:  { bg: Colors.bg.tertiary,        text: Colors.text.secondary },
};

export function NordBadge({ label, variant = 'default', size = 'md' }: NordBadgeProps) {
  const cfg = variantConfig[variant];
  return (
    <View
      style={[
        styles.base,
        size === 'sm' ? styles.sm : styles.md,
        { backgroundColor: cfg.bg },
      ]}
    >
      <Text style={[styles.text, { color: cfg.text }, size === 'sm' && styles.textSm]}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: Radius.full,
    alignSelf: 'flex-start',
  },
  md: {
    paddingHorizontal: Spacing.sm + 2,
    paddingVertical: 3,
  },
  sm: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
  },
  text: {
    fontSize: Typography.size.sm,
    fontWeight: Typography.weight.semibold,
    letterSpacing: 0.2,
  },
  textSm: {
    fontSize: Typography.size.xs,
  },
});

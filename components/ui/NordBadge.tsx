import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Typography, Spacing, Radius } from '@/lib/theme';

type BadgeVariant = 'default' | 'success' | 'error' | 'warning' | 'info' | 'neutral';

interface NordBadgeProps {
  label: string;
  variant?: BadgeVariant;
  size?: 'sm' | 'md';
}

const variantConfig: Record<BadgeVariant, { bg: string; text: string }> = {
  default:  { bg: Colors.accent.primary + '20', text: Colors.accent.primary },
  success:  { bg: Colors.status.correct + '25', text: '#4a7f3e' },
  error:    { bg: Colors.status.wrong + '20',   text: Colors.status.wrong },
  warning:  { bg: Colors.status.warning + '25', text: '#8a6d0a' },
  info:     { bg: Colors.accent.light + '25',   text: Colors.accent.secondary },
  neutral:  { bg: Colors.bg.tertiary,            text: Colors.text.secondary },
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

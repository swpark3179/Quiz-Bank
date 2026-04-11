import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Typography, Spacing, Radius } from '@/lib/theme';

interface ProgressBarProps {
  current: number;  // 현재 문제 번호 (1-indexed)
  total: number;
  correctCount?: number;
}

export function ProgressBar({ current, total, correctCount }: ProgressBarProps) {
  const progress = total > 0 ? (current - 1) / total : 0;
  const accuracy = current > 1 && correctCount !== undefined
    ? correctCount / (current - 1)
    : null;

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Text style={styles.label}>
          {current} / {total}
        </Text>
        {accuracy !== null && (
          <Text style={[styles.accuracy, { color: accuracy >= 0.7 ? Colors.status.correct : Colors.status.wrong }]}>
            정답률 {Math.round(accuracy * 100)}%
          </Text>
        )}
      </View>
      <View style={styles.track}>
        <View
          style={[
            styles.fill,
            { width: `${progress * 100}%` as any },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.xs,
    marginBottom: Spacing.md,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: Typography.size.sm,
    fontWeight: Typography.weight.semibold,
    color: Colors.text.secondary,
  },
  accuracy: {
    fontSize: Typography.size.sm,
    fontWeight: Typography.weight.semibold,
  },
  track: {
    height: 6,
    backgroundColor: Colors.bg.tertiary,
    borderRadius: Radius.full,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    backgroundColor: Colors.accent.primary,
    borderRadius: Radius.full,
  },
});

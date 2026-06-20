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
    <View
      style={styles.container}
      accessibilityRole="progressbar"
      accessibilityLabel={`진행 상황: ${total}문제 중 ${current}번째 문제`}
      accessibilityValue={{ min: 1, max: total, now: current }}
    >
      <View style={styles.row}>
        <Text style={styles.label}>
          {current} / {total}
        </Text>
        {accuracy !== null && (
          <Text
            style={[
              styles.accuracy,
              accuracy >= 0.7
                ? { color: Colors.status.correct, backgroundColor: Colors.status.correctBg }
                : { color: Colors.status.wrong, backgroundColor: Colors.status.wrongBg },
            ]}
          >
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
    fontWeight: '800',
    color: Colors.text.primary,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.full,
    paddingHorizontal: 11,
    paddingVertical: 4,
    overflow: 'hidden',
  },
  accuracy: {
    fontSize: Typography.size.xs,
    fontWeight: '700',
    borderRadius: Radius.full,
    paddingHorizontal: 11,
    paddingVertical: 4,
    overflow: 'hidden',
  },
  track: {
    height: 9,
    backgroundColor: '#C7D0DE',
    borderRadius: Radius.full,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    backgroundColor: Colors.accent.primary,
    borderRadius: Radius.full,
  },
});

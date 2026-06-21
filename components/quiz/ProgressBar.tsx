import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Typography, Spacing, Radius } from '@/lib/theme';

interface ProgressBarProps {
  current: number;  // 현재 문제 번호 (1-indexed)
  total: number;
  correctCount?: number;
  // 누적 점수(맞힘 개수)를 표시할지 여부.
  // 즉시 확인 모드처럼 푸는 도중 정답이 채점되는 경우에만 true.
  showScore?: boolean;
}

export function ProgressBar({ current, total, correctCount, showScore }: ProgressBarProps) {
  const progress = total > 0 ? (current - 1) / total : 0;
  // 지금까지 채점이 끝난 문제 수
  const answered = current - 1;
  // 누적 점수 표시 조건: showScore가 켜져 있고, 채점된 문제가 1개 이상일 때
  const scoreVisible = !!showScore && answered > 0 && correctCount !== undefined;
  const accuracy = scoreVisible ? (correctCount as number) / answered : 0;

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
        {scoreVisible && (
          <Text
            style={[
              styles.accuracy,
              accuracy >= 0.7
                ? { color: Colors.status.correct, backgroundColor: Colors.status.correctBg }
                : { color: Colors.status.wrong, backgroundColor: Colors.status.wrongBg },
            ]}
            accessibilityLabel={`지금까지 ${answered}문제 중 ${correctCount}문제 맞힘`}
          >
            맞힘 {correctCount}/{answered}
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

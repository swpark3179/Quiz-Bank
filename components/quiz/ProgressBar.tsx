import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { Colors, Typography, Spacing, Radius, accuracyTone } from '@/lib/theme';
import { Motion } from '@/lib/theme/motion';

interface ProgressBarProps {
  current: number;  // 현재 문제 번호 (1-indexed)
  total: number;
  correctCount?: number;
  // '현재 내 정답률'(지금까지 채점된 문제 기준 본인의 정답률)을 표시할지 여부.
  // 즉시 확인 모드처럼 푸는 도중 정답이 채점되는 경우에만 true.
  showScore?: boolean;
  // 마지막 문제를 제출하고 결과로 넘어가기 직전: 막대를 끝까지 채운다
  complete?: boolean;
}

export function ProgressBar({ current, total, correctCount, showScore, complete }: ProgressBarProps) {
  const progress = complete ? 1 : total > 0 ? (current - 1) / total : 0;

  // 폭은 즉시 바꾸지 않고 짧게 보간해 '한 칸 나아갔다'는 느낌을 준다
  const fillRatio = useSharedValue(progress);
  useEffect(() => {
    fillRatio.set(
      withTiming(progress, { duration: Motion.duration.progress, easing: Motion.easing.standard })
    );
  }, [progress, fillRatio]);
  const fillStyle = useAnimatedStyle(() => ({
    width: `${fillRatio.get() * 100}%`,
  }));

  // 지금까지 채점이 끝난 문제 수
  const answered = current - 1;
  // '현재 내 정답률' 표시 조건: showScore가 켜져 있고, 채점된 문제가 1개 이상일 때
  const scoreVisible = !!showScore && answered > 0 && correctCount !== undefined;
  const accuracy = scoreVisible ? (correctCount as number) / answered : 0;
  const tone = accuracyTone(Math.round(accuracy * 100));

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
              { color: tone.color, backgroundColor: tone.bg },
            ]}
            accessibilityLabel={`현재 내 정답률 ${Math.round(accuracy * 100)}퍼센트 (${answered}문제 중 ${correctCount}문제 정답)`}
          >
            현재 내 정답률 {Math.round(accuracy * 100)}%
          </Text>
        )}
      </View>
      <View style={styles.track}>
        <Animated.View style={[styles.fill, fillStyle]} />
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

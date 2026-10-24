import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Radius } from '@/lib/theme';
import { Motion } from '@/lib/theme/motion';
import type { Choice } from '@/lib/parser/quizParser';
import { stripChoiceSymbol } from '@/lib/utils/quizUtils';
import { InlineCodeText } from '@/components/InlineCodeText';

type ChoiceState = 'default' | 'selected' | 'correct' | 'wrong' | 'reveal-correct';

interface ChoiceItemProps {
  choice: Choice;
  /** 섞인 보기 배열 내 표시 번호 (0-based → ①②③④ 변환) */
  displayIndex: number;
  state: ChoiceState;
  onPress?: () => void;
  disabled?: boolean;
}

/** 0-based 인덱스 → ①②③④ */
const INDEX_SYMBOLS = ['1', '2', '3', '4', '5', '6', '7', '8'];

const stateStyles: Record<
  ChoiceState,
  { container: ViewStyle; symbol: TextStyle; symbolBg: string; text: TextStyle }
> = {
  default: {
    container: {
      backgroundColor: Colors.choice.default,
      borderColor: Colors.choice.defaultBorder,
      borderWidth: 1.5,
    },
    symbol: { color: Colors.text.secondary },
    symbolBg: 'transparent',
    text: { color: Colors.text.primary },
  },
  selected: {
    container: {
      backgroundColor: Colors.choice.selected,
      borderColor: Colors.choice.selectedBorder,
      borderWidth: 2,
    },
    symbol: { color: '#FFFFFF' },
    symbolBg: Colors.accent.primary,
    text: { color: '#2C4B73', fontWeight: Typography.weight.bold },
  },
  correct: {
    container: {
      backgroundColor: Colors.choice.correct,
      borderColor: Colors.choice.correctBorder,
      borderWidth: 2,
    },
    symbol: { color: '#FFFFFF' },
    symbolBg: Colors.status.correct,
    text: { color: Colors.status.correct, fontWeight: Typography.weight.bold },
  },
  wrong: {
    container: {
      backgroundColor: Colors.choice.wrong,
      borderColor: Colors.choice.wrongBorder,
      borderWidth: 2,
    },
    symbol: { color: '#FFFFFF' },
    symbolBg: Colors.status.wrong,
    text: { color: Colors.status.wrong, fontWeight: Typography.weight.semibold },
  },
  'reveal-correct': {
    container: {
      backgroundColor: Colors.choice.correct,
      borderColor: Colors.choice.correctBorder,
      borderWidth: 2,
    },
    symbol: { color: '#FFFFFF' },
    symbolBg: Colors.status.correct,
    text: { color: Colors.status.correct, fontWeight: Typography.weight.bold },
  },
};

export function ChoiceItem({
  choice,
  displayIndex,
  state,
  onPress,
  disabled,
}: ChoiceItemProps) {
  const s = stateStyles[state];
  const sym = INDEX_SYMBOLS[displayIndex] ?? `${displayIndex + 1}`;

  const isDisabled = disabled || state === 'correct' || state === 'wrong' || state === 'reveal-correct';

  const stateLabels: Record<ChoiceState, string> = {
    default: '선택 안됨',
    selected: '선택됨',
    correct: '정답',
    wrong: '오답',
    'reveal-correct': '정답 (확인용)',
  };

  const choiceLabelText = stripChoiceSymbol(choice.label);
  const accessibilityLabelText = `보기 ${sym}, ${choiceLabelText}, ${stateLabels[state]}`;

  // 채점 결과는 색과 함께 아이콘으로도 표시한다
  const isCorrectState = state === 'correct' || state === 'reveal-correct';
  const markIcon = isCorrectState ? 'checkmark' : state === 'wrong' ? 'close' : null;

  // 채점 피드백 모션: 오답은 가로로 흔들리고(40 + 80×3 + 40 = 320ms),
  // 정답·오답 아이콘은 스프링으로 튀어나온다. 상태가 '바뀔 때'만 재생한다.
  const shakeX = useSharedValue(0);
  const markScale = useSharedValue(1);
  const prevState = useRef(state);

  useEffect(() => {
    const prev = prevState.current;
    prevState.current = state;
    if (prev === state) return;

    if (state === 'wrong') {
      shakeX.set(
        withSequence(
          withTiming(-8, { duration: 40 }),
          withRepeat(withTiming(8, { duration: 80 }), 3, true),
          withTiming(0, { duration: 40 })
        )
      );
    }
    if (state === 'wrong' || state === 'correct' || state === 'reveal-correct') {
      markScale.set(withSequence(withTiming(0.4, { duration: 0 }), withSpring(1, Motion.spring.pop)));
    }
  }, [state, shakeX, markScale]);

  const shakeStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shakeX.get() }],
  }));
  const markStyle = useAnimatedStyle(() => ({
    transform: [{ scale: markScale.get() }],
  }));

  return (
    <Animated.View style={shakeStyle}>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={onPress}
        disabled={isDisabled}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabelText}
        accessibilityState={{
          disabled: !!isDisabled,
          selected: state === 'selected' || state === 'correct' || state === 'wrong',
        }}
        style={[styles.container, s.container]}
      >
        <Animated.View
          style={[
            styles.symbolBox,
            { backgroundColor: s.symbolBg, borderColor: s.container.borderColor },
            markStyle,
          ]}
        >
          {markIcon ? (
            <Ionicons name={markIcon} size={18} color="#FFFFFF" />
          ) : (
            <Text style={[styles.symbol, s.symbol]}>{sym}</Text>
          )}
        </Animated.View>
        <View style={styles.textBox}>
          <InlineCodeText style={[styles.label, s.text]} text={choiceLabelText} />
          {choice.description ? (
            <InlineCodeText
              style={[styles.description, { color: s.text.color ?? Colors.text.secondary }]}
              text={choice.description}
            />
          ) : null}
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    // borderWidth 는 state.container 에서 상태별로 지정 (1.5 / 2)
    borderRadius: 13,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    gap: Spacing.sm,
  },
  symbolBox: {
    width: 32,
    height: 32,
    borderRadius: Radius.full,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  symbol: {
    fontSize: Typography.size.sm,
    fontWeight: Typography.weight.bold,
  },
  textBox: {
    flex: 1,
    gap: 2,
  },
  label: {
    fontSize: Typography.size.base,
    lineHeight: Typography.size.base * 1.5,
    color: Colors.text.primary,
  },
  description: {
    fontSize: Typography.size.sm,
    lineHeight: Typography.size.sm * 1.5,
    opacity: 0.8,
  },
});

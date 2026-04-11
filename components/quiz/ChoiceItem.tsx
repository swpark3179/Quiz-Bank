import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors, Typography, Spacing, Radius } from '@/lib/theme';
import type { Choice } from '@/lib/parser/quizParser';

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
const INDEX_SYMBOLS = ['①', '②', '③', '④', '⑤', '⑥', '⑦', '⑧'];

const stateStyles: Record<
  ChoiceState,
  { container: object; symbol: object; text: object }
> = {
  default: {
    container: {
      backgroundColor: Colors.choice.default,
      borderColor: Colors.choice.defaultBorder,
    },
    symbol: { color: Colors.text.secondary },
    text: { color: Colors.text.primary },
  },
  selected: {
    container: {
      backgroundColor: Colors.choice.selected,
      borderColor: Colors.choice.selectedBorder,
    },
    symbol: { color: Colors.accent.primary },
    text: { color: Colors.accent.primary, fontWeight: Typography.weight.semibold },
  },
  correct: {
    container: {
      backgroundColor: Colors.choice.correct,
      borderColor: Colors.choice.correctBorder,
    },
    symbol: { color: Colors.status.correct },
    text: { color: Colors.status.correct, fontWeight: Typography.weight.semibold },
  },
  wrong: {
    container: {
      backgroundColor: Colors.choice.wrong,
      borderColor: Colors.choice.wrongBorder,
    },
    symbol: { color: Colors.status.wrong },
    text: { color: Colors.status.wrong, fontWeight: Typography.weight.semibold },
  },
  'reveal-correct': {
    container: {
      backgroundColor: Colors.choice.correct,
      borderColor: Colors.choice.correctBorder,
    },
    symbol: { color: Colors.status.correct },
    text: { color: Colors.status.correct, fontWeight: Typography.weight.semibold },
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

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      disabled={disabled || state === 'correct' || state === 'wrong' || state === 'reveal-correct'}
      style={[styles.container, s.container]}
    >
      <View style={[styles.symbolBox, { borderColor: (s.container as any).borderColor }]}>
        <Text style={[styles.symbol, s.symbol]}>{sym}</Text>
      </View>
      <View style={styles.textBox}>
        <Text style={[styles.label, s.text]}>{choice.label.replace(/^[①②③④⑤⑥⑦⑧\d]+\s*/, '')}</Text>
        {choice.description ? (
          <Text style={[styles.description, { color: (s.text as any).color ?? Colors.text.secondary }]}>
            {choice.description}
          </Text>
        ) : null}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderWidth: 1.5,
    borderRadius: Radius.md,
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

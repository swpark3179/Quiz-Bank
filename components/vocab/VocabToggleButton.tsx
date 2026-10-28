import React, { useEffect, useRef } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Radius } from '@/lib/theme';
import { Motion } from '@/lib/theme/motion';

interface VocabToggleButtonProps {
  value: boolean;
  onToggle: () => void;
}

/**
 * 퀴즈 헤더 오른쪽 단어장 모드 토글.
 * 켜지면 책 아이콘이 채워지고 옅은 파랑 원이 깔린다. 바뀔 때 살짝 눌렸다 튀어 오른다.
 */
export function VocabToggleButton({ value, onToggle }: VocabToggleButtonProps) {
  const on = useSharedValue(value ? 1 : 0);
  const scale = useSharedValue(1);
  const prev = useRef(value);

  useEffect(() => {
    if (prev.current === value) return;
    prev.current = value;
    on.set(withTiming(value ? 1 : 0, { duration: Motion.duration.color }));
    scale.set(withSequence(withTiming(0.82, { duration: 80 }), withSpring(1, Motion.spring.pop)));
  }, [value, on, scale]);

  const circleStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(on.get(), [0, 1], ['rgba(234,241,251,0)', Colors.choice.selected]),
    transform: [{ scale: scale.get() }],
  }));

  return (
    <Pressable
      onPress={onToggle}
      style={styles.touch}
      accessibilityRole="switch"
      accessibilityState={{ checked: value }}
      accessibilityLabel="단어장 모드"
      accessibilityHint="문제 속 등록된 단어를 눌러 뜻을 볼 수 있게 합니다"
    >
      <Animated.View style={[styles.circle, circleStyle]}>
        <Ionicons
          name={value ? 'book' : 'book-outline'}
          size={19}
          color={value ? Colors.accent.deep : Colors.text.secondary}
        />
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  touch: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: -Spacing.xs,
  },
  circle: {
    width: 36,
    height: 36,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

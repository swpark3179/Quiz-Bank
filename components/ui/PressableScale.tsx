import React from 'react';
import { Pressable, PressableProps, StyleProp, ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { Motion } from '@/lib/theme/motion';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface PressableScaleProps extends Omit<PressableProps, 'style' | 'children'> {
  style?: StyleProp<ViewStyle>;
  children: React.ReactNode;
}

/**
 * 누르는 동안 살짝 줄어드는 카드 (0.98, 120ms).
 * 투명도만 바뀌던 TouchableOpacity 대신, 무엇을 누르고 있는지 손가락 아래에서 느껴지게 한다.
 */
export function PressableScale({ style, children, onPressIn, onPressOut, ...rest }: PressableScaleProps) {
  const scale = useSharedValue(1);
  const pressStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.get() }],
  }));

  return (
    <AnimatedPressable
      {...rest}
      onPressIn={(e) => {
        scale.set(withTiming(Motion.pressScale, { duration: Motion.duration.fast }));
        onPressIn?.(e);
      }}
      onPressOut={(e) => {
        scale.set(withTiming(1, { duration: Motion.duration.fast }));
        onPressOut?.(e);
      }}
      style={[style, pressStyle]}
    >
      {children}
    </AnimatedPressable>
  );
}

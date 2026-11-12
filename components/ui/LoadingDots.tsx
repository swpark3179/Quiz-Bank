import React, { useEffect } from 'react';
import { View, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import Animated, {
  Easing,
  Extrapolation,
  cancelAnimation,
  interpolate,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withTiming,
  type SharedValue,
} from 'react-native-reanimated';

const DOT_COUNT = 3;
// 한 주기(ms): 세 점이 차례로 솟았다가 잠깐 함께 쉰다
const CYCLE = 1050;
// 점 사이 시차 (주기 대비 비율)
const PHASE_GAP = 0.15;

interface DotProps {
  progress: SharedValue<number>;
  index: number;
  color: string;
  size: number;
}

function Dot({ progress, index, color, size }: DotProps) {
  const style = useAnimatedStyle(() => {
    // 모든 점이 같은 곡선을 시차만 두고 따른다 (0 → 솟음 → 0 → 쉼)
    const p = (progress.get() - index * PHASE_GAP + 1) % 1;
    const lift = interpolate(p, [0, 0.22, 0.44, 1], [0, 1, 0, 0], Extrapolation.CLAMP);
    return {
      opacity: 0.45 + 0.55 * lift,
      transform: [{ translateY: -lift * size * 0.6 }],
    };
  });

  return (
    <Animated.View
      style={[{ width: size, height: size, borderRadius: size / 2, backgroundColor: color }, style]}
    />
  );
}

interface LoadingDotsProps {
  color: string;
  /** 점 지름 */
  size?: number;
  style?: StyleProp<ViewStyle>;
}

/**
 * 세 점이 차례로 솟아오르는 '불러오는 중' 표시.
 * 버튼처럼 좁은 자리에서 스피너보다 눈에 잘 띄고, 글자와 나란히 놓아도 어색하지 않다.
 * 기기의 '동작 줄이기' 설정이 켜져 있으면 움직이지 않는 점으로 보인다.
 */
export function LoadingDots({ color, size = 6, style }: LoadingDotsProps) {
  const reduceMotion = useReducedMotion();
  const progress = useSharedValue(0);

  useEffect(() => {
    if (reduceMotion) return;
    progress.set(withRepeat(withTiming(1, { duration: CYCLE, easing: Easing.linear }), -1, false));
    return () => cancelAnimation(progress);
  }, [progress, reduceMotion]);

  return (
    <View
      style={[styles.row, { gap: size * 0.75, height: size * 2 }, style]}
      // 장식용: 화면 낭독기는 버튼의 라벨·busy 상태로 알린다
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      {Array.from({ length: DOT_COUNT }, (_, i) =>
        reduceMotion ? (
          <View
            key={i}
            style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: color }}
          />
        ) : (
          <Dot key={i} progress={progress} index={i} color={color} size={size} />
        )
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
});

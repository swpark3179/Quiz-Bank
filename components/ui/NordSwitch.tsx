import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { Colors, Radius, Shadow } from '@/lib/theme';
import { Motion } from '@/lib/theme/motion';

const TRACK_W = 44;
const TRACK_H = 26;
const THUMB = 20;
const INSET = (TRACK_H - THUMB) / 2;

/**
 * 켜짐/꺼짐 스위치 (그리기 전용).
 * 앱의 라디오·체크박스처럼 누름과 접근성(role="switch")은 감싸는 행이 맡는다.
 * 플랫폼 기본 Switch 대신 직접 그려 iOS·Android·데스크탑에서 같은 모양으로 보인다.
 */
export function NordSwitch({ value }: { value: boolean }) {
  const on = useSharedValue(value ? 1 : 0);

  useEffect(() => {
    on.set(withSpring(value ? 1 : 0, Motion.spring.popover));
  }, [value, on]);

  const trackStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(on.get(), [0, 1], [Colors.borderStrong, Colors.accent.primary]),
  }));
  const thumbStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: on.get() * (TRACK_W - THUMB - INSET * 2) }],
  }));

  return (
    <Animated.View style={[styles.track, trackStyle]} pointerEvents="none">
      <Animated.View style={[styles.thumb, thumbStyle]} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  track: {
    width: TRACK_W,
    height: TRACK_H,
    borderRadius: Radius.full,
    padding: INSET,
    justifyContent: 'center',
  },
  thumb: {
    width: THUMB,
    height: THUMB,
    borderRadius: Radius.full,
    backgroundColor: Colors.surface.card,
    ...Shadow.sm,
  },
});

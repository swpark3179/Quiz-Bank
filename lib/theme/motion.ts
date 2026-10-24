import { Easing, ReduceMotion } from 'react-native-reanimated';

// Motion tokens
// reanimated 의존성이 테마 전체로 퍼지지 않도록 lib/theme/index.ts 에서 재수출하지 않는다.
// withTiming / withSpring / 레이아웃 애니메이션은 기본값이 ReduceMotion.System 이라
// 기기의 '동작 줄이기' 설정이 켜져 있으면 즉시 끝난다.
export const Motion = {
  duration: {
    fast: 120, // 누름·색 변화
    base: 220, // 문제 전환 등 화면 안의 이동
    progress: 250, // 진행바 폭
    slow: 320, // 오답 흔들림, 시트
    emphasis: 800, // 결과 점수 링, 숫자 카운트업
  },
  easing: {
    standard: Easing.bezier(0.2, 0, 0, 1), // 들어오는 움직임 (감속)
    exit: Easing.bezier(0.3, 0, 1, 1), // 사라지는 움직임 (가속)
  },
  spring: {
    // 체크 아이콘이 살짝 튀어나오는 정도
    pop: { damping: 12, stiffness: 260, reduceMotion: ReduceMotion.System },
  },
  stagger: 60, // 목록 순차 등장 간격
  staggerMax: 8, // 이 개수 이후로는 지연을 늘리지 않음
};

/** 순차 등장 지연(ms) — 목록이 길어도 기다림이 늘어나지 않도록 상한을 둔다 */
export function staggerDelay(index: number, base = 0): number {
  return base + Math.min(index, Motion.staggerMax) * Motion.stagger;
}

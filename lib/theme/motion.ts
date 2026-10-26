import { Easing, FadeInDown, ReduceMotion } from 'react-native-reanimated';

// Motion tokens
// reanimated 의존성이 테마 전체로 퍼지지 않도록 lib/theme/index.ts 에서 재수출하지 않는다.
// withTiming / withSpring / 레이아웃 애니메이션은 기본값이 ReduceMotion.System 이라
// 기기의 '동작 줄이기' 설정이 켜져 있으면 즉시 끝난다.
export const Motion = {
  duration: {
    fast: 120, // 누름 축소
    color: 150, // 선택 상태 색 변화
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
    // 단어 팝업이 누른 자리에서 커지며 자리 잡는 정도 (아주 약한 반동)
    popover: { damping: 20, stiffness: 340, mass: 0.9, reduceMotion: ReduceMotion.System },
  },
  pressScale: 0.98, // 카드·보기를 누르는 동안의 크기
  stagger: 60, // 목록 순차 등장 간격
  staggerMax: 8, // 이 개수 이후로는 지연을 늘리지 않음
};

/** 순차 등장 지연(ms) — 목록이 길어도 기다림이 늘어나지 않도록 상한을 둔다 */
export function staggerDelay(index: number, base = 0): number {
  return base + Math.min(index, Motion.staggerMax) * Motion.stagger;
}

/**
 * 목록 항목 순차 등장: 아래에서 올라오며 페이드 (entering 에 넘긴다).
 * withInitialValues 로 이동 거리를 바꾸면 웹에서 사용자 정의 키프레임이 되어,
 * 애니메이션 도중 화면을 떠날 때 reanimated(4.1) 웹 정리 코드가 오류를 낸다 → 기본 FadeInDown 만 쓴다.
 */
export function listEntering(index: number, base = 0) {
  return FadeInDown.delay(staggerDelay(index, base)).duration(240).easing(Motion.easing.standard);
}

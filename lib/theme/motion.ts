import { Easing } from 'react-native-reanimated';

// Motion tokens
// reanimated 의존성이 테마 전체로 퍼지지 않도록 lib/theme/index.ts 에서 재수출하지 않는다.
export const Motion = {
  duration: {
    base: 220, // 문제 전환 등 화면 안의 이동
  },
  easing: {
    standard: Easing.bezier(0.2, 0, 0, 1), // 들어오는 움직임 (감속)
  },
};

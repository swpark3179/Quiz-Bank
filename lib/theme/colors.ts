// Nord Light Color Palette
// https://www.nordtheme.com/docs/colors-and-palettes

export const Nord = {
  // Polar Night — 텍스트, 진한 UI 요소
  nord0: '#2E3440',
  nord1: '#3B4252',
  nord2: '#434C5E',
  nord3: '#4C566A',

  // Snow Storm — 배경, 카드
  nord4: '#D8DEE9',
  nord5: '#E5E9F0',
  nord6: '#ECEFF4',

  // Frost — 주요 액션, 링크, 강조
  nord7: '#8FBCBB',
  nord8: '#88C0D0',
  nord9: '#81A1C1',
  nord10: '#5E81AC',

  // Aurora — 상태 표현
  nord11: '#BF616A', // 오답 / 위험
  nord12: '#D08770', // 경고
  nord13: '#EBCB8B', // 보류 / 중립
  nord14: '#A3BE8C', // 정답 / 성공
  nord15: '#B48EAD', // 특수 / 보라
} as const;

// Semantic aliases for the app
export const Colors = {
  // Background hierarchy
  bg: {
    primary: Nord.nord6,     // 앱 전체 배경
    secondary: Nord.nord5,   // 카드, 셀 배경
    tertiary: Nord.nord4,    // 구분선, 입력 배경
    overlay: 'rgba(46,52,64,0.5)', // 모달 오버레이
  },

  // Text hierarchy
  text: {
    primary: Nord.nord0,     // 주요 본문
    secondary: Nord.nord3,   // 보조 텍스트
    tertiary: Nord.nord2,    // 힌트, 비활성
    inverse: Nord.nord6,     // 다크 배경 위 텍스트
    link: Nord.nord10,       // 링크, 선택됨
  },

  // Brand / Action
  accent: {
    primary: Nord.nord10,    // 주요 버튼, 활성 상태
    secondary: Nord.nord9,   // 보조 강조
    light: Nord.nord8,       // 밝은 강조
  },

  // Status
  status: {
    correct: Nord.nord14,    // 정답
    wrong: Nord.nord11,      // 오답
    warning: Nord.nord12,    // 경고
    neutral: Nord.nord13,    // 미채점
    special: Nord.nord15,    // 특수
  },

  // UI Elements
  border: Nord.nord4,
  divider: Nord.nord5,
  shadow: 'rgba(46,52,64,0.12)',
  card: Nord.nord6,
  cardPressed: Nord.nord5,

  // Choice states
  choice: {
    default: Nord.nord6,
    defaultBorder: Nord.nord4,
    selected: '#EEF4FB',       // nord10 15% opacity
    selectedBorder: Nord.nord10,
    correct: '#EBF5EC',        // nord14 20% opacity
    correctBorder: Nord.nord14,
    wrong: '#FAF0F0',          // nord11 10% opacity
    wrongBorder: Nord.nord11,
  },
} as const;

export type NordColorKey = keyof typeof Nord;

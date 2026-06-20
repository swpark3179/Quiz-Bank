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
  // 배경: 카드와 분리되도록 한 단계 깊게
  bg: {
    primary: '#DCE3ED',      // ← was Nord.nord6(#ECEFF4) · 앱/헤더 배경
    secondary: Nord.nord5,   // #E5E9F0
    tertiary: Nord.nord4,    // #D8DEE9 · 진행바 트랙 등
    overlay: 'rgba(46,52,64,0.55)', // 모달 오버레이
  },

  // 면(카드/시트) — 순백으로 띄운다 [신규]
  surface: {
    card: '#FFFFFF',
    sheet: '#F4F7FB',
  },

  // Text hierarchy
  text: {
    primary: '#1E2530',      // ← 살짝 더 진하게
    secondary: '#4C566A',    // Nord.nord3
    tertiary: '#5A6577',
    inverse: '#FFFFFF',      // 다크 배경 위 텍스트
    link: '#4C6F9C',         // ← GitHub 블루(#58a6ff) 대체
  },

  // Brand / Action
  accent: {
    primary: '#4C6F9C',      // ← Nord.nord10(#5E81AC) 다크닝 · 버튼/선택/링크
    primaryFill: Nord.nord10,// 밝은 채움이 필요할 때
    secondary: Nord.nord9,   // 보조 강조
    light: Nord.nord8,       // 밝은 강조
  },

  // Status
  status: {
    correct: '#5E7E3E',      // ← 텍스트/아이콘/보더용 다크닝 (was nord14)
    correctBg: '#E7F1E0',
    correctBorder: '#9DB87E',
    wrong: '#B0414B',        // ← 다크닝 (was nord11)
    wrongBg: '#FBEAEB',
    wrongBorder: '#DBA9AE',
    warning: Nord.nord12,    // 경고
    neutral: Nord.nord13,    // 미채점
    special: Nord.nord15,    // 특수
  },

  // UI Elements
  border: '#C2CCD9',         // ← 100% 실선 (was nord4 + 50% alpha)
  borderStrong: '#A9B6C9',
  divider: '#E5E9F0',
  shadow: 'rgba(46,52,64,0.16)',

  // 하위호환 별칭
  card: '#FFFFFF',           // ← 순백 (was nord6 = 배경과 동일색)
  cardPressed: Nord.nord5,

  // Choice states
  choice: {
    default: '#FFFFFF',
    defaultBorder: '#C2CCD9',
    selected: '#EAF1FB',
    selectedBorder: '#4C6F9C',
    correct: '#E7F1E0',
    correctBorder: '#6E8B4E',
    wrong: '#FBEAEB',
    wrongBorder: '#C2606A',
  },

  // Inline code blocks (Claude warm clay pastel)
  code: {
    bg: '#F6EDE6',           // warm clay (유지)
    bgHeader: '#EFE0D2',     // [신규] 코드블록 헤더 바
    border: '#E8D5C4',
    text: '#9D5A3C',         // 인라인/키워드
    base: '#5A4636',         // [신규] 코드 본문 기본색
    func: '#3D7A6E',         // [신규]
    number: '#8A6FA0',       // [신규]
  },
} as const;

export type NordColorKey = keyof typeof Nord;

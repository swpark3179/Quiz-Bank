/**
 * 퀴즈 뱅크 로컬 데이터 설정
 *
 * 새 카테고리/파일 추가 방법:
 * 1. assets/quiz-data/{카테고리ID}/{파일명}.md 파일 추가
 * 2. 아래 QUIZ_CONFIG에 항목 추가
 * 3. FILE_MODULE_MAP에 require() 항목 추가
 * 4. 앱 재시작 (npx expo start) — 재빌드 불필요
 */

// ─── 타입 정의 ─────────────────────────────────────────────────────────────

export interface CategoryConfig {
  id: string;
  name: string;
  description: string;
  icon: string;
  order: number;
  files: QuizFileConfig[];
}

export interface QuizFileConfig {
  id: string;
  name: string;
  questionCount: number;
  order: number;
}

// ─── 퀴즈 파일 모듈 맵 ────────────────────────────────────────────────────
// require()는 정적 표현식이어야 하므로 별도 맵으로 관리
//
// key 형식: "{카테고리ID}/{파일ID}"
// value: require() 반환값 (Metro 에셋 모듈 ID)

export const FILE_MODULE_MAP: Record<string, number> = {
  'ai-basics/chapter-01': require('./ai-basics/chapter-01.md'),
  // 여기에 새 파일 추가:
  // 'ai-basics/chapter-02': require('./ai-basics/chapter-02.md'),
  // 'data-analysis/chapter-01': require('./data-analysis/chapter-01.md'),
};

// ─── 카테고리 + 파일 목록 정의 ──────────────────────────────────────────────

export const QUIZ_CONFIG: CategoryConfig[] = [
  {
    id: 'ai-basics',
    name: 'AI 기초',
    description: '인공지능 기본 개념 및 머신러닝 문제',
    icon: 'brain-outline',
    order: 1,
    files: [
      {
        id: 'chapter-01',
        name: 'Chapter 1: AI 개요 & 데이터',
        questionCount: 3,
        order: 1,
      },
      // 새 파일 추가 예시:
      // {
      //   id: 'chapter-02',
      //   name: 'Chapter 2: 딥러닝 기초',
      //   questionCount: 5,
      //   order: 2,
      // },
    ],
  },
  // 새 카테고리 추가 예시:
  // {
  //   id: 'data-analysis',
  //   name: '데이터 분석',
  //   description: 'Pandas, NumPy, 통계 문제',
  //   icon: 'bar-chart-outline',
  //   order: 2,
  //   files: [
  //     { id: 'chapter-01', name: 'Chapter 1: Pandas 기초', questionCount: 4, order: 1 },
  //   ],
  // },
];

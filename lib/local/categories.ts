/**
 * 로컬 카테고리 & 퀴즈 파일 목록 조회
 *
 * assets/quiz-data/config.ts의 정적 데이터를 반환한다.
 * 인터페이스는 기존 Firebase 버전과 동일하게 유지 (화면 코드 변경 최소화).
 */

import { QUIZ_CONFIG } from '@/assets/quiz-data/config';

export interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  order: number;
}

export interface QuizFile {
  id: string;
  name: string;
  /** "{categoryId}/{fileId}" 형식의 키 — FILE_MODULE_MAP 조회에 사용 */
  storagePath: string;
  questionCount: number;
  order: number;
  categoryId: string;
}

/** 전체 카테고리 목록 반환 */
export async function fetchCategories(): Promise<Category[]> {
  return QUIZ_CONFIG.map(({ files: _files, ...cat }) => cat);
}

/** 특정 카테고리의 퀴즈 파일 목록 반환 */
export async function fetchQuizFiles(categoryId: string): Promise<QuizFile[]> {
  const category = QUIZ_CONFIG.find((c) => c.id === categoryId);
  if (!category) return [];

  return category.files.map((file) => ({
    id: file.id,
    name: file.name,
    storagePath: `${categoryId}/${file.id}`,   // FILE_MODULE_MAP 키
    questionCount: file.questionCount,
    order: file.order,
    categoryId,
  }));
}

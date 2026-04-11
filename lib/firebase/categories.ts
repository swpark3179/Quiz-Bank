/**
 * Firestore 카테고리 & 퀴즈 파일 목록 조회
 *
 * Firestore 구조:
 * categories/
 *   {categoryId}/
 *     name: string          // 표시 이름 (예: "AI 기초")
 *     description: string   // 설명
 *     icon: string          // Ionicons 아이콘 이름
 *     order: number         // 목록 정렬 순서
 *     quizFiles/            // subcollection
 *       {fileId}/
 *         name: string      // 파일 표시 이름 (예: "Chapter 1: 개요")
 *         storagePath: string // Firebase Storage 내 경로 (예: "quiz-data/ai-basics/chapter-01.md")
 *         questionCount: number // 문제 수
 *         order: number
 */

import { firestore, COLLECTIONS } from './config';

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
  storagePath: string;
  questionCount: number;
  order: number;
  categoryId: string;
}

/** 전체 카테고리 목록 조회 */
export async function fetchCategories(): Promise<Category[]> {
  const snapshot = await firestore()
    .collection(COLLECTIONS.CATEGORIES)
    .orderBy('order', 'asc')
    .get();

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Omit<Category, 'id'>),
  }));
}

/** 카테고리 내 퀴즈 파일 목록 조회 */
export async function fetchQuizFiles(categoryId: string): Promise<QuizFile[]> {
  const snapshot = await firestore()
    .collection(COLLECTIONS.CATEGORIES)
    .doc(categoryId)
    .collection(COLLECTIONS.QUIZ_FILES)
    .orderBy('order', 'asc')
    .get();

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    categoryId,
    ...(doc.data() as Omit<QuizFile, 'id' | 'categoryId'>),
  }));
}

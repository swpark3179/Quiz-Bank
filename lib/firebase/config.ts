/**
 * Firebase 설정 파일
 *
 * 사전 준비 사항:
 * 1. https://console.firebase.google.com/ 에서 프로젝트 생성
 * 2. Android 앱 추가 → google-services.json 를 프로젝트 루트에 배치
 * 3. iOS 앱 추가 → GoogleService-Info.plist 를 프로젝트 루트에 배치
 * 4. Firestore Database 생성 (Native mode 권장)
 * 5. Storage 버킷 생성
 *
 * @react-native-firebase 는 google-services.json / GoogleService-Info.plist 파일을
 * 자동으로 읽어 초기화되므로 별도의 initializeApp() 호출이 필요 없습니다.
 */

import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';

export { firestore, storage };

// Firestore 컬렉션 경로 상수
export const COLLECTIONS = {
  CATEGORIES: 'categories',
  QUIZ_FILES: 'quizFiles', // subcollection: categories/{catId}/quizFiles
} as const;

// Storage 경로 상수
export const STORAGE_PATHS = {
  QUIZ_FILES: 'quiz-data', // quiz-data/{categoryId}/{filename}.md
} as const;

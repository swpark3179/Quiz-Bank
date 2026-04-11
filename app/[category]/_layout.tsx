import { Stack } from 'expo-router';

/**
 * [category] 그룹 레이아웃
 * 헤더 타이틀은 각 화면에서 동적으로 설정
 */
export default function CategoryLayout() {
  return (
    <Stack screenOptions={{ headerShown: true }} />
  );
}

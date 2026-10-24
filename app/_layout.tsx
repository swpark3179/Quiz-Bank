import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';
import 'react-native-reanimated';

import { Colors } from '@/lib/theme';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={styles.root}>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: Colors.bg.primary },
          headerTintColor: Colors.text.primary,
          headerTitleStyle: {
            fontWeight: '600',
            fontSize: 17,
            color: Colors.text.primary,
          },
          headerShadowVisible: false,
          contentStyle: { backgroundColor: Colors.bg.primary },
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen
          name="[category]/index"
          options={{ title: '문제 목록', headerBackTitle: '홈' }}
        />
        <Stack.Screen
          name="[category]/quiz"
          options={{
            title: '퀴즈',
            // 풀이는 아래에서 올라오는 집중 모드 (헤더 왼쪽 닫기 X 와 짝)
            animation: 'slide_from_bottom',
            gestureEnabled: false,
          }}
        />
        <Stack.Screen
          name="result"
          options={{
            title: '결과',
            // 같은 흐름의 마무리라 방향감 없이 페이드 (replace·dismissTo 모두)
            animation: 'fade',
            headerBackVisible: false,
            gestureEnabled: false,
          }}
        />
        <Stack.Screen
          name="history/index"
          options={{ title: '풀이 이력' }}
        />
        <Stack.Screen
          name="history/[sessionId]"
          options={{ title: '차수 상세', headerBackTitle: '풀이 이력' }}
        />
        <Stack.Screen
          name="stats/[category]"
          options={{ title: '정답률 통계', headerBackTitle: '문제 목록' }}
        />
      </Stack>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});

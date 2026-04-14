import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';
import 'react-native-reanimated';

import { Colors } from '@/lib/theme';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={styles.root}>
      <StatusBar style="dark" backgroundColor={Colors.bg.primary} />
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
          options={{ title: '문제 목록', headerBackTitle: '메인' }}
        />
        <Stack.Screen
          name="[category]/quiz"
          options={{
            title: '퀴즈',
            headerBackTitle: '목록',
            gestureEnabled: false,
          }}
        />
        <Stack.Screen
          name="result"
          options={{
            title: '결과',
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
          options={{ title: '차수 상세', headerBackTitle: '목록' }}
        />
        <Stack.Screen
          name="stats/[category]"
          options={{ title: '정답률 통계', headerBackTitle: '문제목록' }}
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

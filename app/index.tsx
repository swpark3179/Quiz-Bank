import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import { fetchCategories, Category } from '@/lib/local/categories';
import { getDatabase } from '@/lib/db/schema';
import { fetchAllCategorySummaries } from '@/lib/db/stats';
import { describeLoadError, LoadErrorInfo, LoadStage } from '@/lib/utils/loadError';
import { Colors, Typography, Spacing, Radius, Shadow, accuracyTone } from '@/lib/theme';
import { NordBadge } from '@/components/ui/NordBadge';
import { NordButton } from '@/components/ui/NordButton';
import { ScreenEnter } from '@/components/ui/ScreenEnter';
import { PressableScale } from '@/components/ui/PressableScale';
import Animated from 'react-native-reanimated';
import { listEntering } from '@/lib/theme/motion';
import { STUDY_GUIDE_URL } from '@/lib/utils/studyGuide';
import { openInBrowser } from '@/lib/utils/openExternal';

/** 오류 화면에 함께 보여줄 기기·앱 정보 (기기별 문제 진단용) */
function diagnosticEnvironment(): string {
  const os =
    Platform.OS === 'android'
      ? `Android API ${Platform.Version}`
      : Platform.OS === 'ios'
        ? `iOS ${Platform.Version}`
        : Platform.OS;
  const version = Constants.expoConfig?.version;
  return version ? `${os} · 앱 v${version}` : os;
}

export default function HomeScreen() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [summaries, setSummaries] = useState<Record<string, { accuracy: number; sessions: number }>>({});
  const [error, setError] = useState<LoadErrorInfo | null>(null);

  const load = useCallback(async (isRefresh = false) => {
    // 실패 시 어느 단계였는지 보여주기 위해 진행 단계를 기록한다
    let stage: LoadStage = 'database';
    try {
      if (!isRefresh) setLoading(true);
      setError(null);

      // DB 초기화
      await getDatabase();

      // 카테고리 목록 로드
      stage = 'categories';
      const cats = await fetchCategories();
      setCategories(cats);

      // 각 카테고리의 통계 일괄 로드 (N+1 최적화)
      stage = 'stats';
      const stats = await fetchAllCategorySummaries(cats.map(c => c.id));
      setSummaries(stats);
    } catch (e) {
      console.error(`카테고리 로드 오류 [${stage}]:`, e);
      setError(describeLoadError(stage, e, diagnosticEnvironment()));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleRefresh = () => {
    setRefreshing(true);
    load(true);
  };

  const handleSelect = (category: Category) => {
    router.push(`/${category.id}`);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={Colors.accent.primary} />
          <Text style={styles.loadingText}>로딩 중...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centered}>
          <Ionicons
            name={error.stage === 'categories' ? 'cloud-offline-outline' : 'alert-circle-outline'}
            size={56}
            color={Colors.text.tertiary}
          />
          <Text style={styles.errorText}>{error.title}</Text>
          <NordButton label="다시 시도" onPress={() => load()} style={styles.retryButton} />
          <View style={styles.errorDetailBox}>
            <Text style={styles.errorDetailLabel}>오류 정보 · 길게 눌러 복사</Text>
            <Text style={styles.errorDetail} selectable>
              {error.detail}
            </Text>
          </View>
          <Text style={styles.errorHint}>
            문제가 계속되면 위 오류 정보를 개발자에게 알려주세요.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* 웹에서만 짧은 진입 페이드 (네이티브는 스택 전환) */}
      <ScreenEnter>
        {/* 헤더 */}
        <View style={styles.header}>
          <View>
            <Text style={styles.appName}>문제은행</Text>
            <Text style={styles.subtitle}>카테고리를 선택해주세요</Text>
          </View>
          <TouchableOpacity
            style={styles.historyButton}
            onPress={() => router.push('/history?from=main')}
            accessibilityRole="button"
            accessibilityLabel="풀이 이력 보기"
          >
            <Ionicons name="time-outline" size={22} color={Colors.text.secondary} />
          </TouchableOpacity>
        </View>

        <FlatList
          data={categories}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor={Colors.accent.primary}
            />
          }
          ListEmptyComponent={
            <View style={styles.empty}>
              <Ionicons name="folder-open-outline" size={56} color={Colors.text.tertiary} />
              <Text style={styles.emptyText}>등록된 카테고리가 없습니다.</Text>
            </View>
          }
          ListFooterComponent={
            <StudyGuideCard onOpenInApp={() => router.push('/guide')} />
          }
          renderItem={({ item: cat, index }) => {
            const stat = summaries[cat.id];
            const hasHistory = stat && stat.sessions > 0;
            const accuracyPct = hasHistory ? Math.round(stat.accuracy * 100) : null;

            // 첫 진입 시 위에서부터 순차 등장, 누르는 동안 살짝 줄어든다
            return (
              <Animated.View entering={listEntering(index)}>
                <PressableScale
                  style={styles.card}
                  onPress={() => handleSelect(cat)}
                  accessibilityRole="button"
                  accessibilityLabel={`${cat.name}, ${cat.description || ''}${hasHistory ? `, 정답률 ${accuracyPct} 퍼센트, ${stat.sessions}회 풀이` : ''}`}
                >
                  {/* 아이콘 영역 */}
                  <View style={styles.iconBox}>
                    <Ionicons
                      name={(cat.icon as any) || 'book-outline'}
                      size={28}
                      color={Colors.accent.primary}
                    />
                  </View>

                  {/* 텍스트 영역 */}
                  <View style={styles.textBox}>
                    <Text style={styles.catName}>{cat.name}</Text>
                    {cat.description ? (
                      <Text style={styles.catDesc} numberOfLines={2}>
                        {cat.description}
                      </Text>
                    ) : null}

                    {hasHistory && (
                      <View style={styles.statRow}>
                        <NordBadge
                          label={`정답률 ${accuracyPct}%`}
                          variant={accuracyTone(accuracyPct!).badge}
                          size="sm"
                        />
                        <Text style={styles.sessionCount}>{stat.sessions}회 풀이</Text>
                      </View>
                    )}
                  </View>

                  <Ionicons name="chevron-forward" size={18} color={Colors.text.tertiary} />
                </PressableScale>
              </Animated.View>
            );
          }}
        />
      </ScreenEnter>
    </SafeAreaView>
  );
}

/**
 * 학습 가이드 카드. 본문을 누르면 앱 안 화면(WebView)으로, 오른쪽 ↗ 를 누르면 기기 브라우저로 연다.
 * 웹(데스크탑 Electron 포함)은 WebView 가 없어 카드 전체가 브라우저로 여는 버튼 하나다.
 */
function StudyGuideCard({ onOpenInApp }: { onOpenInApp: () => void }) {
  const openBrowser = () => openInBrowser(STUDY_GUIDE_URL);

  if (Platform.OS === 'web') {
    return (
      <PressableScale
        style={[styles.guideCard, styles.guideRow]}
        onPress={openBrowser}
        accessibilityRole="link"
        accessibilityLabel="학습 가이드, 레슨과 자습 가이드를 브라우저에서 열기"
      >
        <Ionicons name="library-outline" size={22} color={Colors.accent.primary} />
        <View style={styles.textBox}>
          <Text style={styles.guideTitle}>학습 가이드</Text>
          <Text style={styles.guideDesc}>레슨·자습 가이드를 브라우저에서 열어요</Text>
        </View>
        <Ionicons name="open-outline" size={18} color={Colors.text.tertiary} />
      </PressableScale>
    );
  }

  return (
    <View style={styles.guideCard}>
      <PressableScale
        style={[styles.guideRow, styles.guideFill]}
        onPress={onOpenInApp}
        accessibilityRole="button"
        accessibilityLabel="학습 가이드, 레슨과 자습 가이드를 앱에서 보기"
      >
        <Ionicons name="library-outline" size={22} color={Colors.accent.primary} />
        <View style={styles.textBox}>
          <Text style={styles.guideTitle}>학습 가이드</Text>
          <Text style={styles.guideDesc}>레슨·자습 가이드를 앱에서 열어요</Text>
        </View>
      </PressableScale>
      <View style={styles.guideDivider} />
      <TouchableOpacity
        style={styles.guideBrowserButton}
        onPress={openBrowser}
        accessibilityRole="link"
        accessibilityLabel="학습 가이드를 브라우저에서 열기"
      >
        <Ionicons name="open-outline" size={18} color={Colors.text.link} />
        <Text style={styles.guideBrowserLabel}>브라우저</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.bg.primary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.lg,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.border,
  },
  appName: {
    fontSize: Typography.size.xxl,
    fontWeight: Typography.weight.bold,
    color: Colors.text.primary,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: Typography.size.sm,
    color: Colors.text.secondary,
    marginTop: 2,
  },
  historyButton: {
    width: 40,
    height: 40,
    borderRadius: Radius.full,
    backgroundColor: Colors.bg.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  list: {
    padding: Spacing.base,
    gap: Spacing.sm,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: Radius.lg,
    padding: Spacing.base,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: Spacing.md,
    ...Shadow.sm,
  },
  // 점선 테두리 틀 — 안에 '앱에서 보기'(guideRow)와 '브라우저'(guideBrowserButton)가 나란히 놓인다
  guideCard: {
    flexDirection: 'row',
    alignItems: 'stretch',
    marginTop: Spacing.sm,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: Colors.border,
    backgroundColor: Colors.bg.secondary,
  },
  guideRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.base,
  },
  guideFill: {
    flex: 1,
  },
  guideDivider: {
    width: StyleSheet.hairlineWidth,
    marginVertical: Spacing.sm,
    backgroundColor: Colors.border,
  },
  guideBrowserButton: {
    minWidth: 64,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  guideBrowserLabel: {
    fontSize: Typography.size.xs,
    fontWeight: Typography.weight.medium,
    color: Colors.text.link,
  },
  guideTitle: {
    fontSize: Typography.size.base,
    fontWeight: Typography.weight.semibold,
    color: Colors.text.link,
  },
  guideDesc: {
    fontSize: Typography.size.xs,
    color: Colors.text.tertiary,
  },
  iconBox: {
    width: 52,
    height: 52,
    borderRadius: Radius.md,
    backgroundColor: Colors.choice.selected,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  textBox: {
    flex: 1,
    gap: 4,
  },
  catName: {
    fontSize: Typography.size.md,
    fontWeight: Typography.weight.semibold,
    color: Colors.text.primary,
  },
  catDesc: {
    fontSize: Typography.size.sm,
    color: Colors.text.secondary,
    lineHeight: Typography.size.sm * 1.5,
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginTop: 4,
  },
  sessionCount: {
    fontSize: Typography.size.xs,
    color: Colors.text.tertiary,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.md,
    padding: Spacing.xxxl,
  },
  loadingText: {
    fontSize: Typography.size.base,
    color: Colors.text.secondary,
  },
  errorText: {
    fontSize: Typography.size.base,
    color: Colors.text.secondary,
    textAlign: 'center',
    lineHeight: Typography.size.base * 1.6,
  },
  retryButton: {
    marginTop: Spacing.sm,
    paddingHorizontal: Spacing.xl,
  },
  errorDetailBox: {
    alignSelf: 'stretch',
    marginTop: Spacing.lg,
    padding: Spacing.md,
    gap: Spacing.xs,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.bg.secondary,
  },
  errorDetailLabel: {
    fontSize: Typography.size.xs,
    fontWeight: Typography.weight.semibold,
    color: Colors.text.tertiary,
  },
  errorDetail: {
    fontSize: Typography.size.xs,
    lineHeight: Typography.size.xs * 1.5,
    color: Colors.text.secondary,
    fontFamily: Platform.select({ ios: 'Menlo', default: 'monospace' }),
  },
  errorHint: {
    fontSize: Typography.size.xs,
    color: Colors.text.tertiary,
    textAlign: 'center',
  },
  empty: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: Spacing.xxxl * 2,
    gap: Spacing.md,
  },
  emptyText: {
    fontSize: Typography.size.base,
    color: Colors.text.secondary,
  },
});

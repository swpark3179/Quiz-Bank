import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { fetchCategories, Category } from '@/lib/local/categories';
import { getDatabase } from '@/lib/db/schema';
import { fetchAllCategorySummaries } from '@/lib/db/stats';
import { Colors, Typography, Spacing, Radius, Shadow } from '@/lib/theme';
import { NordBadge } from '@/components/ui/NordBadge';

export default function HomeScreen() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [summaries, setSummaries] = useState<Record<string, { accuracy: number; sessions: number }>>({});
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (isRefresh = false) => {
    try {
      if (!isRefresh) setLoading(true);
      setError(null);

      // DB 초기화
      await getDatabase();

      // 카테고리 목록 로드
      const cats = await fetchCategories();
      setCategories(cats);

      // 각 카테고리의 통계 일괄 로드 (N+1 최적화)
      const stats = await fetchAllCategorySummaries(cats.map(c => c.id));
      setSummaries(stats);
    } catch (e) {
      console.error('카테고리 로드 오류:', e);
      setError('카테고리를 불러오지 못했습니다.\n앱을 다시 시작해주세요.');
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
          <Ionicons name="cloud-offline-outline" size={56} color={Colors.text.tertiary} />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={() => load()}>
            <Text style={styles.retryText}>다시 시도</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
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
        renderItem={({ item: cat }) => {
          const stat = summaries[cat.id];
          const hasHistory = stat && stat.sessions > 0;
          const accuracyPct = hasHistory ? Math.round(stat.accuracy * 100) : null;

          return (
            <TouchableOpacity
              style={styles.card}
              onPress={() => handleSelect(cat)}
              activeOpacity={0.82}
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
                      variant={
                        accuracyPct! >= 80
                          ? 'success'
                          : accuracyPct! >= 60
                          ? 'warning'
                          : 'error'
                      }
                      size="sm"
                    />
                    <Text style={styles.sessionCount}>{stat.sessions}회 풀이</Text>
                  </View>
                )}
              </View>

              <Ionicons name="chevron-forward" size={18} color={Colors.text.tertiary} />
            </TouchableOpacity>
          );
        }}
      />
    </SafeAreaView>
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
    borderBottomColor: Colors.divider,
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
    borderColor: Colors.border + '80',
    gap: Spacing.md,
    ...Shadow.sm,
  },
  iconBox: {
    width: 52,
    height: 52,
    borderRadius: Radius.md,
    backgroundColor: Colors.accent.primary + '15',
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
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.accent.primary,
    borderRadius: Radius.md,
  },
  retryText: {
    color: Colors.text.inverse,
    fontWeight: Typography.weight.semibold,
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

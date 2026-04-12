import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Dimensions,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { BarChart } from 'react-native-gifted-charts';
import { Ionicons } from '@expo/vector-icons';
import { fetchSessionStats, fetchCategorySummary } from '@/lib/db/stats';
import { clearCategorySessions } from '@/lib/db';
import type { SessionStat, CategorySummary } from '@/lib/db/stats';
import { Colors, Typography, Spacing, Radius, Shadow } from '@/lib/theme';
import { NordBadge } from '@/components/ui/NordBadge';

const SCREEN_WIDTH = Dimensions.get('window').width;

export default function StatsScreen() {
  const { category: categoryId } = useLocalSearchParams<{ category: string }>();
  const navigation = useNavigation();
  const [stats, setStats] = useState<SessionStat[]>([]);
  const [summary, setSummary] = useState<CategorySummary | null>(null);
  const [loading, setLoading] = useState(true);

  const loadData = React.useCallback(async () => {
    setLoading(true);
    const [s, sum] = await Promise.all([
      fetchSessionStats(categoryId),
      fetchCategorySummary(categoryId),
    ]);
    setStats(s);
    setSummary(sum);
    setLoading(false);
  }, [categoryId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={() => {
            Alert.alert(
              '이력 초기화',
              '이 카테고리의 모든 풀이 이력을 삭제하시겠습니까?',
              [
                { text: '취소', style: 'cancel' },
                {
                  text: '초기화',
                  style: 'destructive',
                  onPress: async () => {
                    await clearCategorySessions(categoryId);
                    await loadData();
                  },
                },
              ]
            );
          }}
          style={{ padding: Spacing.xs }}
        >
          <Ionicons name="trash-outline" size={24} color={Colors.status.wrong} />
        </TouchableOpacity>
      ),
    });
  }, [navigation, categoryId, loadData]);

  if (loading || !summary) {
    return <View style={styles.safeArea} />;
  }

  const overallPct = Math.round(summary.overallAccuracy * 100);
  const recentPct = Math.round(summary.recentAccuracy * 100);

  // 차트 데이터 (최근 15회 표시)
  const chartData = stats.slice(-15).map((s, i) => ({
    value: Math.round(s.accuracy * 100),
    label: `#${stats.length - stats.slice(-15).length + i + 1}`,
    frontColor:
      s.accuracy >= 0.8
        ? Colors.status.correct
        : s.accuracy >= 0.6
        ? Colors.status.warning
        : Colors.status.wrong,
  }));

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* 전체 요약 카드 */}
        <View style={styles.summaryCard}>
          <Text style={styles.cardTitle}>전체 통계</Text>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{summary.totalSessions}</Text>
              <Text style={styles.statLabel}>총 풀이 횟수</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{summary.totalQuestions}</Text>
              <Text style={styles.statLabel}>총 문제 수</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text
                style={[
                  styles.statValue,
                  {
                    color:
                      overallPct >= 80
                        ? Colors.status.correct
                        : overallPct >= 60
                        ? Colors.status.warning
                        : Colors.status.wrong,
                  },
                ]}
              >
                {overallPct}%
              </Text>
              <Text style={styles.statLabel}>전체 정답률</Text>
            </View>
          </View>

          {/* 최근 정답률 */}
          <View style={styles.recentRow}>
            <Text style={styles.recentLabel}>최근 5회 평균</Text>
            <NordBadge
              label={`${recentPct}%`}
              variant={
                recentPct >= 80 ? 'success' : recentPct >= 60 ? 'warning' : 'error'
              }
            />
          </View>
        </View>

        {/* 차트 */}
        {chartData.length > 0 ? (
          <View style={styles.chartCard}>
            <Text style={styles.cardTitle}>차수별 정답률 추이</Text>
            <Text style={styles.chartSubtitle}>최근 {chartData.length}회</Text>
            <BarChart
              data={chartData}
              width={SCREEN_WIDTH - Spacing.base * 2 - Spacing.xl * 2}
              height={200}
              barWidth={Math.max(20, (SCREEN_WIDTH - 100) / Math.max(chartData.length, 1))}
              maxValue={100}
              noOfSections={5}
              yAxisThickness={0}
              xAxisThickness={1}
              xAxisColor={Colors.border}
              yAxisTextStyle={{
                color: Colors.text.secondary,
                fontSize: Typography.size.xs,
              }}
              xAxisLabelTextStyle={{
                color: Colors.text.secondary,
                fontSize: Typography.size.xs,
              }}
              rulesColor={Colors.divider}
              rulesType="solid"
              showValuesAsTopLabel
              topLabelTextStyle={{
                color: Colors.text.secondary,
                fontSize: Typography.size.xs,
                fontWeight: Typography.weight.bold,
              }}
              renderTooltip={(item: any) => (
                <View style={styles.tooltip}>
                  <Text style={styles.tooltipText}>{item.value}%</Text>
                </View>
              )}
            />
          </View>
        ) : (
          <View style={styles.emptyChart}>
            <Text style={styles.emptyText}>아직 풀이 이력이 없습니다.</Text>
            <Text style={styles.emptySubtext}>퀴즈를 풀어보면 여기에 통계가 표시됩니다.</Text>
          </View>
        )}

        {/* 최근 차수 목록 */}
        {stats.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>최근 풀이 목록</Text>
            {[...stats].reverse().slice(0, 10).map((s, i) => {
              const pct = Math.round(s.accuracy * 100);
              return (
                <View key={s.session_id} style={styles.sessionRow}>
                  <Text style={styles.sessionIdx}>#{stats.length - i}</Text>
                  <View style={styles.sessionBar}>
                    <View
                      style={[
                        styles.sessionFill,
                        {
                          width: `${s.accuracy * 100}%` as any,
                          backgroundColor:
                            s.accuracy >= 0.8
                              ? Colors.status.correct
                              : s.accuracy >= 0.6
                              ? Colors.status.warning
                              : Colors.status.wrong,
                        },
                      ]}
                    />
                  </View>
                  <Text style={styles.sessionPct}>{pct}%</Text>
                  <NordBadge
                    label={`${s.correct}/${s.total}`}
                    variant="neutral"
                    size="sm"
                  />
                </View>
              );
            })}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.bg.primary,
  },
  content: {
    padding: Spacing.base,
    gap: Spacing.md,
    paddingBottom: Spacing.xxxl,
  },
  summaryCard: {
    backgroundColor: Colors.card,
    borderRadius: Radius.lg,
    padding: Spacing.base,
    borderWidth: 1,
    borderColor: Colors.border + '80',
    ...Shadow.sm,
    gap: Spacing.md,
  },
  cardTitle: {
    fontSize: Typography.size.md,
    fontWeight: Typography.weight.bold,
    color: Colors.text.primary,
  },
  chartSubtitle: {
    fontSize: Typography.size.xs,
    color: Colors.text.secondary,
    marginBottom: Spacing.sm,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
  },
  statValue: {
    fontSize: Typography.size.xl,
    fontWeight: Typography.weight.bold,
    color: Colors.text.primary,
  },
  statLabel: {
    fontSize: Typography.size.xs,
    color: Colors.text.secondary,
  },
  statDivider: {
    width: 1,
    height: 32,
    backgroundColor: Colors.divider,
  },
  recentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Spacing.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Colors.divider,
  },
  recentLabel: {
    fontSize: Typography.size.sm,
    color: Colors.text.secondary,
    fontWeight: Typography.weight.medium,
  },
  chartCard: {
    backgroundColor: Colors.card,
    borderRadius: Radius.lg,
    padding: Spacing.base,
    borderWidth: 1,
    borderColor: Colors.border + '80',
    ...Shadow.sm,
    gap: Spacing.xs,
    overflow: 'hidden',
  },
  tooltip: {
    backgroundColor: Colors.text.primary,
    borderRadius: Radius.xs,
    paddingHorizontal: Spacing.xs,
    paddingVertical: 2,
  },
  tooltipText: {
    color: Colors.text.inverse,
    fontSize: Typography.size.xs,
    fontWeight: Typography.weight.bold,
  },
  emptyChart: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xxxl,
    gap: Spacing.sm,
  },
  emptyText: {
    fontSize: Typography.size.base,
    color: Colors.text.secondary,
    fontWeight: Typography.weight.medium,
  },
  emptySubtext: {
    fontSize: Typography.size.sm,
    color: Colors.text.tertiary,
  },
  sectionTitle: {
    fontSize: Typography.size.sm,
    fontWeight: Typography.weight.semibold,
    color: Colors.text.secondary,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginTop: Spacing.sm,
  },
  sessionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  sessionIdx: {
    fontSize: Typography.size.xs,
    color: Colors.text.tertiary,
    width: 28,
    textAlign: 'right',
  },
  sessionBar: {
    flex: 1,
    height: 8,
    backgroundColor: Colors.bg.tertiary,
    borderRadius: Radius.full,
    overflow: 'hidden',
  },
  sessionFill: {
    height: '100%',
    borderRadius: Radius.full,
  },
  sessionPct: {
    fontSize: Typography.size.xs,
    fontWeight: Typography.weight.bold,
    color: Colors.text.secondary,
    width: 34,
    textAlign: 'right',
  },
});

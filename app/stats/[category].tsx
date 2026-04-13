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
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import { BarChart } from 'react-native-gifted-charts';
import { Ionicons } from '@expo/vector-icons';
import { fetchSessionStats, fetchCategorySummary, fetchQuestionStats } from '@/lib/db/stats';
import { clearCategorySessions } from '@/lib/db';
import type { SessionStat, CategorySummary, QuestionStat } from '@/lib/db/stats';
import { Colors, Typography, Spacing, Radius, Shadow } from '@/lib/theme';
import { NordBadge } from '@/components/ui/NordBadge';
import { fetchQuizFiles, QuizFile } from '@/lib/local/categories';
import { NordButton } from '@/components/ui/NordButton';
import { fetchQuizMarkdown } from '@/lib/local/storage';
import { parseQuizMarkdown } from '@/lib/parser/quizParser';
import { shuffleQuiz } from '@/lib/quiz/shuffler';

const SCREEN_WIDTH = Dimensions.get('window').width;

export default function StatsScreen() {
  const { category: categoryId } = useLocalSearchParams<{ category: string }>();
  const navigation = useNavigation();
  const router = useRouter();
  const [stats, setStats] = useState<SessionStat[]>([]);
  const [summary, setSummary] = useState<CategorySummary | null>(null);
  const [loading, setLoading] = useState(true);

  // 문제별 정답률 관련 상태
  const [files, setFiles] = useState<QuizFile[]>([]);
  const [selectedFileIds, setSelectedFileIds] = useState<string[]>([]);
  const [questionStats, setQuestionStats] = useState<QuestionStat[]>([]);
  const [selectedQuestionKeys, setSelectedQuestionKeys] = useState<string[]>([]); // "fileId_questionId"
  const [loadingQuestionStats, setLoadingQuestionStats] = useState(false);

  const loadData = React.useCallback(async () => {
    setLoading(true);
    const [s, sum, fetchedFiles] = await Promise.all([
      fetchSessionStats(categoryId),
      fetchCategorySummary(categoryId),
      fetchQuizFiles(categoryId),
    ]);
    setStats(s);
    setSummary(sum);
    setFiles(fetchedFiles);
    setLoading(false);
  }, [categoryId]);

  const loadQuestionStats = React.useCallback(async (fileIds: string[]) => {
    setLoadingQuestionStats(true);
    const qStats = await fetchQuestionStats(fileIds);
    setQuestionStats(qStats);
    setLoadingQuestionStats(false);
  }, []);

  useEffect(() => {
    if (selectedFileIds.length > 0) {
      loadQuestionStats(selectedFileIds);
    } else {
      setQuestionStats([]);
    }
    // 선택 해제된 파일의 문제들만 제거 (다른 파일들의 선택 상태는 유지)
    setSelectedQuestionKeys((prev) =>
      prev.filter(key => {
        const lastUnderscore = key.lastIndexOf('_');
        const fileId = key.substring(0, lastUnderscore);
        return selectedFileIds.includes(fileId);
      })
    );
  }, [selectedFileIds, loadQuestionStats]);

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

  const toggleFileSelection = (fileId: string) => {
    setSelectedFileIds((prev) =>
      prev.includes(fileId) ? prev.filter((id) => id !== fileId) : [...prev, fileId]
    );
  };

  const toggleQuestionSelection = (fileId: string, questionId: number) => {
    const key = `${fileId}_${questionId}`;
    setSelectedQuestionKeys((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const toggleAllQuestionsForFile = (fileId: string) => {
    const fileQStats = questionStats.filter((q) => q.source_file_id === fileId);
    const fileKeys = fileQStats.map((q) => `${fileId}_${q.question_id}`);
    const allSelected = fileKeys.every((key) => selectedQuestionKeys.includes(key));

    if (allSelected) {
      setSelectedQuestionKeys((prev) => prev.filter((k) => !fileKeys.includes(k)));
    } else {
      setSelectedQuestionKeys((prev) => {
        const newKeys = new Set(prev);
        fileKeys.forEach((k) => newKeys.add(k));
        return Array.from(newKeys);
      });
    }
  };

  const handleRetrySelectedQuestions = async () => {
    if (selectedQuestionKeys.length === 0) return;

    try {
      // 1. 필요한 파일 ID 목록 추출 (파일 ID에 '_'가 포함될 수 있으므로 lastIndexOf 사용)
      const fileIdsToFetch = Array.from(new Set(selectedQuestionKeys.map(k => {
        const lastUnderscore = k.lastIndexOf('_');
        return k.substring(0, lastUnderscore);
      })));
      const targetFiles = files.filter(f => fileIdsToFetch.includes(f.id));

      // 2. 파일들 병렬 다운로드 & 파싱
      const allQuestionsResults = await Promise.all(
        targetFiles.map(async (file) => {
          const md = await fetchQuizMarkdown(file.storagePath);
          return parseQuizMarkdown(md, file.id);
        })
      );
      const allParsedQuestions = allQuestionsResults.flat();

      // 3. 선택한 문제만 필터링
      const questionsToRetry = allParsedQuestions.filter(q =>
        selectedQuestionKeys.includes(`${q.sourceFileId}_${q.id}`)
      );

      if (questionsToRetry.length === 0) {
        Alert.alert('오류', '선택한 문제 데이터를 찾을 수 없습니다.');
        return;
      }

      // 4. 문제 및 보기 셔플
      const shuffled = shuffleQuiz(questionsToRetry);

      // 5. 퀴즈 화면으로 이동
      router.push({
        pathname: `/${categoryId}/quiz`,
        params: {
          setup: JSON.stringify({
            shuffled,
            mode: 'immediate',
            categoryId,
            sourceFileIds: fileIdsToFetch,
          }),
        },
      });

    } catch (error) {
      console.error('재시험 준비 중 오류 발생:', error);
      Alert.alert('오류', '문제를 불러오는 중 문제가 발생했습니다.');
    }
  };

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

        {/* 문제별 통계 및 재풀이 선택 */}
        {files.length > 0 && (
          <View style={styles.questionStatsSection}>
            <Text style={styles.sectionTitle}>문제별 통계 및 다시 풀기</Text>

            <View style={styles.fileSelectionArea}>
              <Text style={styles.subsectionLabel}>문제 파일 선택</Text>
              {files.map((file) => {
                const isSelected = selectedFileIds.includes(file.id);
                return (
                  <TouchableOpacity
                    key={file.id}
                    style={[styles.fileChip, isSelected && styles.fileChipSelected]}
                    onPress={() => toggleFileSelection(file.id)}
                    activeOpacity={0.8}
                  >
                    <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
                      {isSelected && <Text style={styles.checkMark}>✓</Text>}
                    </View>
                    <Text style={[styles.fileName, isSelected && { color: Colors.accent.primary }]}>
                      {file.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {loadingQuestionStats && (
              <Text style={styles.loadingText}>문제 통계를 불러오는 중...</Text>
            )}

            {!loadingQuestionStats && selectedFileIds.length > 0 && (
              <View style={styles.questionListArea}>
                {selectedFileIds.map((fileId) => {
                  const file = files.find((f) => f.id === fileId);
                  const fileQStats = questionStats.filter((q) => q.source_file_id === fileId);

                  if (!file || fileQStats.length === 0) return null;

                  return (
                    <View key={fileId} style={styles.fileQuestionGroup}>
                      <View style={styles.fileQuestionHeader}>
                        <Text style={styles.fileQuestionTitle}>{file.name}</Text>
                        <TouchableOpacity onPress={() => toggleAllQuestionsForFile(fileId)}>
                          <Text style={styles.selectAllText}>전체 선택/해제</Text>
                        </TouchableOpacity>
                      </View>

                      {fileQStats.map((q) => {
                        const key = `${fileId}_${q.question_id}`;
                        const isSelected = selectedQuestionKeys.includes(key);
                        const pct = Math.round(q.accuracy * 100);

                        return (
                          <TouchableOpacity
                            key={key}
                            style={[styles.questionRow, isSelected && styles.questionRowSelected]}
                            onPress={() => toggleQuestionSelection(fileId, q.question_id)}
                          >
                            <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
                              {isSelected && <Text style={styles.checkMark}>✓</Text>}
                            </View>
                            <Text style={styles.questionIdText}>{q.question_id}번 문제</Text>
                            <View style={styles.spacer} />
                            <Text style={styles.questionAccuracyText}>정답률: {pct}%</Text>
                            <NordBadge
                              label={`${q.correct_attempts}/${q.total_attempts}`}
                              variant={pct >= 80 ? 'success' : pct >= 50 ? 'warning' : 'error'}
                              size="sm"
                            />
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  );
                })}
              </View>
            )}

            {selectedQuestionKeys.length > 0 && (
              <NordButton
                label={`${selectedQuestionKeys.length}개 문제 다시 풀기`}
                onPress={handleRetrySelectedQuestions}
                style={styles.retryButton}
                size="lg"
              />
            )}
          </View>
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
  questionStatsSection: {
    marginTop: Spacing.xl,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
  },
  fileSelectionArea: {
    marginTop: Spacing.sm,
    gap: Spacing.xs,
  },
  subsectionLabel: {
    fontSize: Typography.size.xs,
    color: Colors.text.secondary,
    marginBottom: Spacing.xs,
  },
  fileChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    padding: Spacing.sm,
    borderRadius: Radius.sm,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.bg.secondary,
  },
  fileChipSelected: {
    borderColor: Colors.accent.primary,
    backgroundColor: Colors.choice.selected,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: Radius.xs,
    borderWidth: 2,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.bg.primary,
  },
  checkboxSelected: {
    borderColor: Colors.accent.primary,
    backgroundColor: Colors.accent.primary,
  },
  checkMark: {
    color: Colors.text.inverse,
    fontSize: 12,
    fontWeight: Typography.weight.bold,
  },
  fileName: {
    fontSize: Typography.size.sm,
    color: Colors.text.primary,
    fontWeight: Typography.weight.medium,
  },
  loadingText: {
    marginTop: Spacing.md,
    fontSize: Typography.size.sm,
    color: Colors.text.secondary,
    textAlign: 'center',
  },
  questionListArea: {
    marginTop: Spacing.md,
    gap: Spacing.md,
  },
  fileQuestionGroup: {
    backgroundColor: Colors.card,
    borderRadius: Radius.md,
    padding: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  fileQuestionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
    paddingBottom: Spacing.xs,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.divider,
  },
  fileQuestionTitle: {
    fontSize: Typography.size.sm,
    fontWeight: Typography.weight.bold,
    color: Colors.text.primary,
  },
  selectAllText: {
    fontSize: Typography.size.xs,
    color: Colors.accent.primary,
  },
  questionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.xs,
    gap: Spacing.sm,
  },
  questionRowSelected: {
    backgroundColor: Colors.choice.selected + '50',
    borderRadius: Radius.xs,
  },
  questionIdText: {
    fontSize: Typography.size.sm,
    color: Colors.text.primary,
  },
  spacer: {
    flex: 1,
  },
  questionAccuracyText: {
    fontSize: Typography.size.xs,
    color: Colors.text.secondary,
  },
  retryButton: {
    marginTop: Spacing.lg,
  },
});

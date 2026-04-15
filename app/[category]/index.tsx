import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter, useNavigation } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { fetchCategories, fetchQuizFiles, QuizFile } from '@/lib/local/categories';
import { fetchQuizMarkdown } from '@/lib/local/storage';
import { parseQuizMarkdown, QuizQuestion } from '@/lib/parser/quizParser';
import { shuffleQuiz } from '@/lib/quiz/shuffler';
import { fetchCategorySummary, } from '@/lib/db/stats';
import { fetchWrongAnswers } from '@/lib/db/sessions';
import { Colors, Typography, Spacing, Radius, Shadow } from '@/lib/theme';
import { QuizSetupModal, QuizSetupOptions } from '@/components/QuizSetupModal';
import { NordBadge } from '@/components/ui/NordBadge';
import { NordButton } from '@/components/ui/NordButton';

export default function CategoryScreen() {
  const { category: categoryId, retrySession } = useLocalSearchParams<{
    category: string;
    retrySession?: string;
  }>();
  const router = useRouter();
  const navigation = useNavigation();

  const [files, setFiles] = useState<QuizFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [preparingQuiz, setPreparingQuiz] = useState(false);
  const [totalSessions, setTotalSessions] = useState(0);
  const [overallAccuracy, setOverallAccuracy] = useState<number | null>(null);

  // 모달 상태
  const [modalVisible, setModalVisible] = useState(false);
  const [isRandom, setIsRandom] = useState(false);
  const [selectedFileForSetup, setSelectedFileForSetup] = useState<QuizFile | null>(null);

  useEffect(() => {
    if (categoryId) {
      loadData();
    }
  }, [categoryId]);

  // 오답 재시험 파라미터 처리
  useEffect(() => {
    if (retrySession && files.length > 0) {
      handleRetrySession(retrySession);
    }
  }, [retrySession, files]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [quizFiles, summary] = await Promise.all([
        fetchQuizFiles(categoryId),
        fetchCategorySummary(categoryId),
      ]);
      setFiles(quizFiles);
      setTotalSessions(summary.totalSessions);
      setOverallAccuracy(summary.totalSessions > 0 ? summary.overallAccuracy : null);

      // 헤더 타이틀을 '문제 목록'으로 고정
      navigation.setOptions({ title: '문제 목록' });
    } catch (e) {
      console.error('파일 목록 로드 오류:', e);
    } finally {
      setLoading(false);
    }
  };

  /** 오답 재시험: retrySession에서 오답 문제만 로드해 바로 퀴즈 시작 */
  const handleRetrySession = async (sessionId: string) => {
    try {
      setPreparingQuiz(true);
      const wrongAnswers = await fetchWrongAnswers(sessionId);
      if (wrongAnswers.length === 0) {
        Alert.alert('확인', '오답 문제가 없습니다!');
        setPreparingQuiz(false);
        return;
      }

      // 파일별 오답 ID 그룹화
      const fileGroups = wrongAnswers.reduce<Record<string, number[]>>(
        (acc, a) => {
          if (!acc[a.source_file_id]) acc[a.source_file_id] = [];
          acc[a.source_file_id].push(a.question_id);
          return acc;
        },
        {}
      );

      const retryQuestionsResults = await Promise.all(
        Object.entries(fileGroups).map(async ([fileId, questionIds]) => {
          const file = files.find((f) => f.id === fileId);
          if (!file) return [];
          const md = await fetchQuizMarkdown(file.storagePath);
          const parsed = parseQuizMarkdown(md, fileId);
          return parsed.filter((q) => questionIds.includes(q.id));
        })
      );
      const allWrongQuestions = retryQuestionsResults.flat();

      const shuffled = shuffleQuiz(allWrongQuestions);
      router.push({
        pathname: `/${categoryId}/quiz`,
        params: {
          setup: JSON.stringify({
            shuffled,
            mode: 'immediate',
            categoryId,
            sourceFileIds: Object.keys(fileGroups),
          }),
        },
      });
    } catch (e) {
      console.error('오답 재시험 준비 오류:', e);
      Alert.alert('오류', '오답 문제를 불러오지 못했습니다.');
    } finally {
      setPreparingQuiz(false);
    }
  };

  const openSingleFileSetup = (file: QuizFile) => {
    setIsRandom(false);
    setSelectedFileForSetup(file);
    setModalVisible(true);
  };

  const openRandomSetup = () => {
    setIsRandom(true);
    setSelectedFileForSetup(null);
    setModalVisible(true);
  };

  const handleSetupConfirm = async (options: QuizSetupOptions) => {
    setModalVisible(false);

    try {
      // 선택된 파일들 로드 & 파싱
      const fileIds = options.selectedFileIds;
      const targetFiles = isRandom
        ? files.filter((f) => fileIds.includes(f.id))
        : selectedFileForSetup
        ? [selectedFileForSetup]
        : [];

      const allQuestionsResults = await Promise.all(
        targetFiles.map(async (file) => {
          const md = await fetchQuizMarkdown(file.storagePath);
          return parseQuizMarkdown(md, file.id);
        })
      );
      const allQuestions = allQuestionsResults.flat();

      const shuffled = shuffleQuiz(allQuestions, options.count === 'all' ? undefined : options.count);

      // 퀴즈 화면으로 이동 (state 전달)
      router.push({
        pathname: `/${categoryId}/quiz`,
        params: {
          setup: JSON.stringify({
            shuffled,
            mode: options.mode,
            categoryId,
            sourceFileIds: fileIds,
          }),
        },
      });
    } catch (e) {
      console.error('퀴즈 준비 오류:', e);
    }
  };

  const totalFileCount = files.length;
  const totalQuestionCount = files.reduce((s, f) => s + f.questionCount, 0);

  if (loading || preparingQuiz) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={Colors.accent.primary} />
          {preparingQuiz && (
            <Text style={styles.preparingText}>오답 문제 불러오는 중...</Text>
          )}
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      {/* 요약 헤더 */}
      <View style={styles.summaryCard}>
        <View style={styles.summaryRow}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>{totalFileCount}</Text>
            <Text style={styles.summaryLabel}>문제 파일</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>{totalQuestionCount}</Text>
            <Text style={styles.summaryLabel}>총 문제 수</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>{totalSessions}</Text>
            <Text style={styles.summaryLabel}>풀이 횟수</Text>
          </View>
          {overallAccuracy !== null && (
            <>
              <View style={styles.summaryDivider} />
              <View style={styles.summaryItem}>
                <Text
                  style={[
                    styles.summaryValue,
                    {
                      color:
                        overallAccuracy >= 0.8
                          ? Colors.status.correct
                          : overallAccuracy >= 0.6
                          ? Colors.status.warning
                          : Colors.status.wrong,
                    },
                  ]}
                >
                  {Math.round(overallAccuracy * 100)}%
                </Text>
                <Text style={styles.summaryLabel}>정답률</Text>
              </View>
            </>
          )}
        </View>

        {/* 통계 & 이력 버튼 */}
        <View style={styles.actionRow}>
          <TouchableOpacity
            style={styles.smallButton}
            onPress={() => router.push(`/stats/${categoryId}`)}
            accessibilityRole="button"
            accessibilityLabel="통계 보기"
          >
            <Ionicons name="bar-chart-outline" size={15} color={Colors.accent.secondary} />
            <Text style={styles.smallButtonText}>통계 보기</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.smallButton}
            onPress={() => router.push(`/history`)}
            accessibilityRole="button"
            accessibilityLabel="풀이 이력"
          >
            <Ionicons name="time-outline" size={15} color={Colors.accent.secondary} />
            <Text style={styles.smallButtonText}>풀이 이력</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 무작위 문제 풀기 버튼 */}
      <View style={styles.randomSection}>
        <NordButton
          label="🎲  무작위 문제 풀어보기"
          variant="primary"
          fullWidth
          onPress={openRandomSetup}
          style={styles.randomButton}
        />
      </View>

      {/* 파일 목록 */}
      <Text style={styles.sectionLabel}>문제 파일 목록</Text>
      <FlatList
        data={files}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item: file }) => (
          <TouchableOpacity
            style={styles.fileCard}
            onPress={() => openSingleFileSetup(file)}
            activeOpacity={0.82}
            accessibilityRole="button"
            accessibilityLabel={`${file.name}, ${file.questionCount}문제`}
          >
            <View style={styles.fileIconBox}>
              <Ionicons name="document-text-outline" size={22} color={Colors.accent.secondary} />
            </View>
            <View style={styles.fileInfo}>
              <Text style={styles.fileName}>{file.name}</Text>
              <Text style={styles.fileCount}>{file.questionCount}문제</Text>
            </View>
            <Ionicons name="play-circle-outline" size={26} color={Colors.accent.primary} />
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>등록된 문제 파일이 없습니다.</Text>
          </View>
        }
      />

      {/* 퀴즈 설정 모달 */}
      <QuizSetupModal
        visible={modalVisible}
        files={files}
        totalQuestions={
          isRandom
            ? totalQuestionCount
            : selectedFileForSetup?.questionCount ?? 0
        }
        isRandom={isRandom}
        preSelectedFileId={selectedFileForSetup?.id}
        onConfirm={handleSetupConfirm}
        onClose={() => setModalVisible(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.bg.primary,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.md,
  },
  preparingText: {
    fontSize: Typography.size.sm,
    color: Colors.text.secondary,
    marginTop: Spacing.sm,
  },
  summaryCard: {
    margin: Spacing.base,
    backgroundColor: Colors.card,
    borderRadius: Radius.lg,
    padding: Spacing.base,
    borderWidth: 1,
    borderColor: Colors.border + '80',
    ...Shadow.sm,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
  },
  summaryValue: {
    fontSize: Typography.size.xl,
    fontWeight: Typography.weight.bold,
    color: Colors.text.primary,
  },
  summaryLabel: {
    fontSize: Typography.size.xs,
    color: Colors.text.secondary,
  },
  summaryDivider: {
    width: 1,
    height: 36,
    backgroundColor: Colors.divider,
  },
  actionRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: Spacing.md,
    paddingTop: Spacing.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Colors.divider,
  },
  smallButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.sm,
    borderRadius: Radius.sm,
    backgroundColor: Colors.bg.secondary,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  smallButtonText: {
    fontSize: Typography.size.xs,
    color: Colors.accent.secondary,
    fontWeight: Typography.weight.medium,
  },
  randomSection: {
    paddingHorizontal: Spacing.base,
    marginBottom: Spacing.md,
  },
  randomButton: {
    borderRadius: Radius.lg,
  },
  sectionLabel: {
    fontSize: Typography.size.xs,
    fontWeight: Typography.weight.semibold,
    color: Colors.text.secondary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    paddingHorizontal: Spacing.base,
    marginBottom: Spacing.sm,
  },
  list: {
    paddingHorizontal: Spacing.base,
    gap: Spacing.sm,
    paddingBottom: Spacing.xxxl,
  },
  fileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: Radius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border + '80',
    gap: Spacing.md,
    ...Shadow.sm,
  },
  fileIconBox: {
    width: 42,
    height: 42,
    borderRadius: Radius.sm,
    backgroundColor: Colors.accent.secondary + '18',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fileInfo: {
    flex: 1,
  },
  fileName: {
    fontSize: Typography.size.base,
    fontWeight: Typography.weight.medium,
    color: Colors.text.primary,
  },
  fileCount: {
    fontSize: Typography.size.xs,
    color: Colors.text.secondary,
    marginTop: 2,
  },
  empty: {
    alignItems: 'center',
    paddingTop: Spacing.xxxl,
  },
  emptyText: {
    color: Colors.text.secondary,
    fontSize: Typography.size.base,
  },
});

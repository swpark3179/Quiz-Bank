import React, { useEffect, useState, useCallback, useRef } from 'react';
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
import { useLocalSearchParams, useRouter, useNavigation, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { fetchCategories, fetchQuizFiles, QuizFile } from '@/lib/local/categories';
import { fetchQuizMarkdown } from '@/lib/local/storage';
import { parseQuizMarkdown, QuizQuestion } from '@/lib/parser/quizParser';
import { shuffleQuiz } from '@/lib/quiz/shuffler';
import type { QuizSetup } from '@/lib/quiz/retry';
import { fetchCategorySummary, } from '@/lib/db/stats';
import { Colors, Typography, Spacing, Radius, Shadow } from '@/lib/theme';
import { QuizSetupModal, QuizSetupOptions } from '@/components/QuizSetupModal';
import { NordBadge } from '@/components/ui/NordBadge';
import { NordButton } from '@/components/ui/NordButton';

export default function CategoryScreen() {
  const { category: categoryId } = useLocalSearchParams<{ category: string }>();
  const router = useRouter();
  const navigation = useNavigation();

  const [files, setFiles] = useState<QuizFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalSessions, setTotalSessions] = useState(0);
  const [overallAccuracy, setOverallAccuracy] = useState<number | null>(null);

  // 모달 상태
  const [modalVisible, setModalVisible] = useState(false);
  const [isRandom, setIsRandom] = useState(false);
  const [selectedFileForSetup, setSelectedFileForSetup] = useState<QuizFile | null>(null);
  // 설정 시트에서 '퀴즈 시작'을 누른 뒤 문제를 준비하는 중
  const [preparingQuiz, setPreparingQuiz] = useState(false);
  // 준비가 끝난 퀴즈 — 시트 닫힘 애니메이션이 끝나면 이동한다
  const pendingQuizRef = useRef<QuizSetup | null>(null);

  useEffect(() => {
    if (categoryId) {
      loadData();
    }
  }, [categoryId]);

  // 요약 통계는 화면에 돌아올 때마다 다시 읽는다
  // (결과 화면에서 dismissTo 로 돌아오면 이 화면이 다시 마운트되지 않는다)
  useFocusEffect(
    useCallback(() => {
      if (!categoryId) return;
      let isActive = true;
      fetchCategorySummary(categoryId)
        .then((summary) => {
          if (!isActive) return;
          setTotalSessions(summary.totalSessions);
          setOverallAccuracy(summary.totalSessions > 0 ? summary.overallAccuracy : null);
        })
        .catch((e) => console.error('요약 통계 로드 오류:', e));
      return () => {
        isActive = false;
      };
    }, [categoryId])
  );

  const loadData = async () => {
    try {
      setLoading(true);
      const quizFiles = await fetchQuizFiles(categoryId);
      setFiles(quizFiles);

      // 헤더 타이틀을 '문제 목록'으로 고정
      navigation.setOptions({ title: '문제 목록' });
    } catch (e) {
      console.error('파일 목록 로드 오류:', e);
    } finally {
      setLoading(false);
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

  /**
   * 설정 시트 '퀴즈 시작': 시트를 연 채 버튼에 로딩을 보이며 문제를 준비하고,
   * 준비가 끝나면 시트를 닫는다. 실제 이동은 닫힘 애니메이션이 끝난 뒤(handleSetupHidden).
   * 시트가 닫히는 움직임과 퀴즈 화면이 들어오는 움직임이 겹치거나, 그 사이에 빈 시간이 생기지 않게 한다.
   */
  const handleSetupConfirm = async (options: QuizSetupOptions) => {
    if (preparingQuiz) return;
    setPreparingQuiz(true);

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

      pendingQuizRef.current = {
        shuffled,
        mode: options.mode,
        categoryId,
        sourceFileIds: fileIds,
      };
      setModalVisible(false);
    } catch (e) {
      console.error('퀴즈 준비 오류:', e);
      Alert.alert('오류', '문제를 불러오지 못했습니다.');
    } finally {
      setPreparingQuiz(false);
    }
  };

  /** 설정 시트가 완전히 닫힌 뒤: 준비된 퀴즈가 있으면 퀴즈 화면으로 이동 (state 전달) */
  const handleSetupHidden = () => {
    const setup = pendingQuizRef.current;
    if (!setup) return;
    pendingQuizRef.current = null;
    router.push({
      pathname: `/${categoryId}/quiz`,
      params: { setup: JSON.stringify(setup) },
    });
  };

  const totalFileCount = files.length;
  const totalQuestionCount = files.reduce((s, f) => s + f.questionCount, 0);

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={Colors.accent.primary} />
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
        loading={preparingQuiz}
        onHidden={handleSetupHidden}
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
  summaryCard: {
    margin: Spacing.base,
    backgroundColor: Colors.card,
    borderRadius: Radius.lg,
    padding: Spacing.base,
    borderWidth: 1,
    borderColor: Colors.border,
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
    borderColor: Colors.border,
    gap: Spacing.md,
    ...Shadow.sm,
  },
  fileIconBox: {
    width: 42,
    height: 42,
    borderRadius: Radius.sm,
    backgroundColor: Colors.choice.selected,
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

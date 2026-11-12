import React, { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter, useNavigation, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { fetchCategoryNames, fetchQuizFiles, QuizFile } from '@/lib/local/categories';
import { fetchQuizMarkdown } from '@/lib/local/storage';
import { parseQuizMarkdown, QuizQuestion } from '@/lib/parser/quizParser';
import { shuffleQuiz } from '@/lib/quiz/shuffler';
import type { QuizSetup } from '@/lib/quiz/retry';
import { fetchCategorySummary, fetchAnsweredQuestionIds } from '@/lib/db/stats';
import { countUnseen, filterUnseen, type AnsweredIds } from '@/lib/quiz/unseen';
import { prepareQuizVocab } from '@/lib/quiz/prepareVocab';
import { stashQuizSetup } from '@/lib/quiz/setupStore';
import { waitForPaint } from '@/lib/utils/frame';
import { Colors, Typography, Spacing, Radius, Shadow, accuracyTone } from '@/lib/theme';
import { QuizSetupModal, QuizSetupOptions } from '@/components/QuizSetupModal';
import { NordBadge } from '@/components/ui/NordBadge';
import { NordButton } from '@/components/ui/NordButton';
import { ScreenEnter } from '@/components/ui/ScreenEnter';
import { PressableScale } from '@/components/ui/PressableScale';
import Animated from 'react-native-reanimated';
import { listEntering } from '@/lib/theme/motion';

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
  // 한 번이라도 푼 문제 번호 ('안 푼 문제만' 출제용). 시트를 열 때마다 새로 읽는다 (null = 읽는 중/실패)
  const [answeredIds, setAnsweredIds] = useState<AnsweredIds | null>(null);

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
      const [quizFiles, names] = await Promise.all([
        fetchQuizFiles(categoryId),
        fetchCategoryNames(),
      ]);
      setFiles(quizFiles);

      // 헤더 타이틀은 카테고리 이름 (어느 카테고리인지 보이도록)
      navigation.setOptions({ title: names[categoryId] ?? '문제 목록' });
    } catch (e) {
      console.error('파일 목록 로드 오류:', e);
    } finally {
      setLoading(false);
    }
  };

  /** 풀이 기록에서 푼 문제를 다시 읽는다 (퀴즈를 풀고 돌아온 뒤에도 최신 값으로) */
  const loadAnsweredIds = () => {
    setAnsweredIds(null);
    fetchAnsweredQuestionIds(files.map((f) => f.id))
      .then(setAnsweredIds)
      .catch((e) => console.error('풀이 기록 로드 오류:', e));
  };

  const unseenCounts = useMemo(
    () =>
      answeredIds
        ? Object.fromEntries(files.map((f) => [f.id, countUnseen(f, answeredIds)]))
        : null,
    [files, answeredIds]
  );

  const openSingleFileSetup = (file: QuizFile) => {
    loadAnsweredIds();
    setIsRandom(false);
    setSelectedFileForSetup(file);
    setModalVisible(true);
  };

  const openRandomSetup = () => {
    loadAnsweredIds();
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
      // 버튼의 '문제 불러오는 중' 이 먼저 그려지게 한 프레임 쉰다
      // (받아 둔 문제는 바로 돌아와, 쉬지 않으면 로딩이 보이기도 전에 아래 작업이 JS 를 붙잡는다)
      await waitForPaint();

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
      // '안 푼 문제만': 시트의 수는 추정치라, 실제 문제 번호로 정확히 거른다
      const pool =
        options.unseenOnly && answeredIds ? filterUnseen(allQuestions, answeredIds) : allQuestions;
      if (pool.length === 0) {
        Alert.alert('알림', '선택한 파일에 아직 풀지 않은 문제가 없어요.');
        return;
      }

      // 고른 수보다 남은 문제가 적으면 남은 만큼만 낸다
      const shuffled = shuffleQuiz(pool, options.count === 'all' ? undefined : options.count);
      // 단어장 모드: 퀴즈 화면이 뜰 때 멈추지 않게 단어 매처를 지금(로딩이 움직이는 동안) 만들어 둔다
      await prepareQuizVocab(shuffled.map((q) => q.original));

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

  /** 설정 시트가 완전히 닫힌 뒤: 준비된 퀴즈가 있으면 퀴즈 화면으로 이동 (설정은 보관소에, 주소에는 id 만) */
  const handleSetupHidden = () => {
    const setup = pendingQuizRef.current;
    if (!setup) return;
    pendingQuizRef.current = null;
    router.push({
      pathname: `/${categoryId}/quiz`,
      params: { setupId: stashQuizSetup(setup) },
    });
  };

  const totalFileCount = files.length;
  const overallPct = overallAccuracy !== null ? Math.round(overallAccuracy * 100) : null;
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
    <SafeAreaView style={styles.safeArea} edges={['bottom', 'left', 'right']}>
      {/* 웹에서만 짧은 진입 페이드 (네이티브는 스택 전환) */}
      <ScreenEnter>
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
                  <Text style={[styles.summaryValue, { color: accuracyTone(overallPct!).color }]}>
                    {overallPct}%
                  </Text>
                  <Text style={styles.summaryLabel}>정답률 · {accuracyTone(overallPct!).label}</Text>
                </View>
              </>
            )}
          </View>

          {/* 통계 & 이력 버튼 */}
          <View style={styles.actionRow}>
            <NordButton
              label="통계 보기"
              variant="tonal"
              onPress={() => router.push(`/stats/${categoryId}`)}
              icon={<Ionicons name="bar-chart-outline" size={17} color={Colors.accent.deep} />}
              style={styles.smallButton}
            />
            <NordButton
              label="풀이 이력"
              variant="tonal"
              onPress={() => router.push(`/history`)}
              icon={<Ionicons name="time-outline" size={17} color={Colors.accent.deep} />}
              style={styles.smallButton}
            />
          </View>
        </View>

        {/* 무작위 문제 풀기 버튼 */}
        <View style={styles.randomSection}>
          <NordButton
            label="무작위 문제 풀어보기"
            variant="primary"
            size="lg"
            fullWidth
            onPress={openRandomSetup}
            icon={<Ionicons name="shuffle" size={20} color={Colors.text.inverse} />}
            style={styles.randomButton}
          />
        </View>

        {/* 파일 목록 */}
        <Text style={styles.sectionLabel}>문제 파일 목록</Text>
        <FlatList
          data={files}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item: file, index }) => (
            // 첫 진입 시 위에서부터 순차 등장, 누르는 동안 살짝 줄어든다
            <Animated.View entering={listEntering(index)}>
              <PressableScale
                style={styles.fileCard}
                onPress={() => openSingleFileSetup(file)}
                accessibilityRole="button"
                accessibilityLabel={`${file.name}, ${file.questionCount}문제`}
              >
                <View style={styles.fileIconBox}>
                  <Ionicons name="document-text-outline" size={22} color={Colors.accent.primary} />
                </View>
                <View style={styles.fileInfo}>
                  <Text style={styles.fileName}>{file.name}</Text>
                  <Text style={styles.fileCount}>{file.questionCount}문제</Text>
                </View>
                <Ionicons name="play-circle-outline" size={26} color={Colors.accent.primary} />
              </PressableScale>
            </Animated.View>
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
          unseenCounts={unseenCounts}
          onConfirm={handleSetupConfirm}
          onClose={() => setModalVisible(false)}
          loading={preparingQuiz}
          onHidden={handleSetupHidden}
        />
      </ScreenEnter>
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
    flex: 1,
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

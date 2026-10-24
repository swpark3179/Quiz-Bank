import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useLocalSearchParams, useRouter, useNavigation } from 'expo-router';
import { usePreventRemove } from '@react-navigation/native';
import BottomSheet from '@gorhom/bottom-sheet';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInLeft, FadeInRight } from 'react-native-reanimated';
import uuid from 'react-native-uuid';
import { Colors, Typography, Spacing, Radius, Shadow } from '@/lib/theme';
import { Motion } from '@/lib/theme/motion';
import { ProgressBar } from '@/components/quiz/ProgressBar';
import { ChoiceItem } from '@/components/quiz/ChoiceItem';
import { ExplanationSheet } from '@/components/quiz/ExplanationSheet';
import { MarkdownViewer } from '@/components/MarkdownViewer';
import { NordButton } from '@/components/ui/NordButton';
import { BottomActionBar } from '@/components/ui/BottomActionBar';
import { createSession, saveAnswer, updateSessionProgress } from '@/lib/db/sessions';
import type { QuizSetup } from '@/lib/quiz/retry';
import { stripChoiceSymbol, mapExplanationSymbols } from '@/lib/utils/quizUtils';
import { hapticAnswerResult } from '@/lib/utils/haptics';
import { confirmAsync } from '@/lib/utils/confirm';

type ChoiceState = 'default' | 'selected' | 'correct' | 'wrong' | 'reveal-correct';

// 즉시 확인 피드백 타이밍(ms)
// 오답: 흔들림(slow)이 끝나고 잠시 뒤 정답 보기를 강조하고, 그다음 해설 시트를 연다.
const REVEAL_CORRECT_DELAY = Motion.duration.slow + 120;
const SHEET_DELAY_CORRECT = 350;
const SHEET_DELAY_WRONG = REVEAL_CORRECT_DELAY + 300;
// 마지막 제출 후 진행바가 끝까지 차오르는 시간을 보여 준 뒤 결과로 이동
const FINISH_DELAY = Motion.duration.progress + 50;

const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

export default function QuizScreen() {
  const { setup: setupStr } = useLocalSearchParams<{ setup: string }>();
  const router = useRouter();

  // params 파싱
  const setup: QuizSetup = React.useMemo(() => {
    try {
      return JSON.parse(setupStr ?? '{}');
    } catch {
      return { shuffled: [], mode: 'deferred', categoryId: '', sourceFileIds: [] };
    }
  }, [setupStr]);

  const { shuffled, mode, categoryId, sourceFileIds } = setup;

  // 세션 ID (고정) + 세션 생성 여부 추적
  const sessionId = useRef<string>(uuid.v4() as string).current;
  const sessionCreated = useRef(false);

  // 현재 문제 인덱스
  const [currentIdx, setCurrentIdx] = useState(0);
  // { questionIdx → selectedChoiceIdx(0-based) } — null이면 미선택
  const [selections, setSelections] = useState<Record<number, number>>({});
  // 확정 제출 여부
  const [submitted, setSubmitted] = useState<Record<number, boolean>>({});
  // 누적 정답 수 (ref로 최신값 보장)
  const correctCountRef = useRef(0);
  const [correctCount, setCorrectCount] = useState(0);
  // 실제로 푼(응답한) 문제 수 — 모수(total)로 사용
  const answeredCountRef = useRef(0);

  // 즉시 확인 모드: 오답일 때 정답 보기를 뒤늦게 강조했는지
  const [revealed, setRevealed] = useState<Record<number, boolean>>({});
  // 마지막 제출 후 결과 화면으로 넘어가는 중 (진행바를 끝까지 채우고 버튼을 잠근다)
  const [finishing, setFinishing] = useState(false);
  const finishingRef = useRef(false);
  // 진행 중인 응답 저장 — 결과로 넘어가기 전에 끝나기를 기다린다
  const pendingSave = useRef<Promise<void> | null>(null);
  // 피드백 연출용 타이머 — 문제를 넘기거나 화면을 떠나면 취소
  const feedbackTimers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const navigation = useNavigation();
  const sheetRef = useRef<BottomSheet>(null);
  const scrollRef = useRef<ScrollView>(null);

  // 헤더 왼쪽은 '뒤로'가 아니라 '닫기' — 풀이는 들어갔다 나오는 집중 모드
  useLayoutEffect(() => {
    navigation.setOptions({
      headerBackVisible: false,
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.headerClose}
          accessibilityRole="button"
          accessibilityLabel="퀴즈 그만두기"
        >
          <Ionicons name="close" size={24} color={Colors.text.primary} />
        </TouchableOpacity>
      ),
    });
  }, [navigation, router]);

  // 답을 하나라도 고른 뒤 나가려 하면 확인한다 (헤더 닫기, Android 뒤로 가기 모두).
  // 결과 화면으로 넘어가는 중(finishing)에는 막지 않는다.
  usePreventRemove(Object.keys(selections).length > 0 && !finishing, ({ data }) => {
    confirmAsync({
      title: '퀴즈를 그만둘까요?',
      message:
        mode === 'immediate'
          ? '지금까지 푼 문제는 풀이 이력에 저장돼요.'
          : '모두 푼 뒤 한 번에 채점하는 방식이라, 지금 나가면 고른 답이 저장되지 않아요.',
      confirmLabel: '그만두기',
      cancelLabel: '계속 풀기',
      destructive: true,
    }).then((ok) => {
      if (ok) navigation.dispatch(data.action);
    });
  });
  // 문제 이동 방향: 1 = 다음, -1 = 이전, 0 = 첫 문제(진입 애니메이션 없음)
  const [navDir, setNavDir] = useState<1 | -1 | 0>(0);

  // 문제가 바뀌면 항상 맨 위(진행 표시)부터 보이도록 스크롤을 초기화
  useEffect(() => {
    scrollRef.current?.scrollTo({ y: 0, animated: false });
  }, [currentIdx]);

  useEffect(() => {
    const timers = feedbackTimers.current;
    return () => timers.forEach(clearTimeout);
  }, []);

  const total = shuffled.length;
  const currentQ = shuffled[currentIdx];

  if (!currentQ) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>문제를 불러오지 못했습니다.</Text>
      </View>
    );
  }

  const selectedIdx = selections[currentIdx] ?? null;
  const isSubmitted = submitted[currentIdx] ?? false;
  const isCorrect = selectedIdx !== null && selectedIdx === currentQ.mappedAnswer;

  const clearFeedbackTimers = () => {
    feedbackTimers.current.forEach(clearTimeout);
    // 언마운트 정리 effect 가 같은 배열을 보도록 새 배열로 바꾸지 않고 비운다
    feedbackTimers.current.length = 0;
  };

  const later = (fn: () => void, ms: number) => {
    feedbackTimers.current.push(setTimeout(fn, ms));
  };

  /** 마지막 제출: 버튼을 잠그고 진행바를 끝까지 채운다. 이미 진행 중이면 false */
  const beginFinish = () => {
    if (finishingRef.current) return false;
    finishingRef.current = true;
    setFinishing(true);
    return true;
  };

  /** 이전/다음 문제로 이동하며 방향을 기록 (진입 애니메이션 방향에 사용) */
  const goTo = (dir: 1 | -1) => {
    clearFeedbackTimers();
    setNavDir(dir);
    setCurrentIdx((i) => i + dir);
  };

  // 다음 문제는 오른쪽에서, 이전 문제는 왼쪽에서 들어온다
  const questionEntering =
    navDir === 0
      ? undefined
      : (navDir > 0 ? FadeInRight : FadeInLeft)
          .duration(Motion.duration.base)
          .easing(Motion.easing.standard);

  /** 보기 상태 결정 */
  const getChoiceState = (choiceArrayIdx: number): ChoiceState => {
    if (!isSubmitted) {
      return selectedIdx === choiceArrayIdx ? 'selected' : 'default';
    }
    // 제출 후 — 오답이면 흔들림이 끝난 뒤 정답 보기를 강조한다
    if (choiceArrayIdx === currentQ.mappedAnswer) {
      return isCorrect || revealed[currentIdx] ? 'correct' : 'default';
    }
    if (selectedIdx === choiceArrayIdx) return 'wrong';
    return 'default';
  };

  /** DB에 개별 응답 저장 */
  const persistAnswer = async (chosenIdx: number, correct: boolean, mappedExplanation: string) => {
    // 최초 1회만 세션 생성 (total은 0에서 시작해 응답할 때마다 누적)
    if (!sessionCreated.current) {
      sessionCreated.current = true;
      await createSession({
        id: sessionId,
        categoryId,
        sourceFileIds,
        total: 0,
        mode,
      });
    }

    await saveAnswer({
      id: uuid.v4() as string,
      sessionId,
      questionId: currentQ.original.id,
      sourceFileId: currentQ.original.sourceFileId,
      questionText: currentQ.original.question,
      chosenIndex: chosenIdx,
      correctIndex: currentQ.original.answer,
      isCorrect: correct,
      explanation: mappedExplanation,
      correctLabel: stripChoiceSymbol(currentQ.shuffledChoices[currentQ.mappedAnswer]?.label ?? ''),
      mappedCorrectIndex: currentQ.mappedAnswer,
      displayOrder: currentIdx + 1,
    });

    // 실제로 푼 문제만 모수에 반영 (중간에 나가도 풀지 않은 문제는 제외됨)
    answeredCountRef.current += 1;
    await updateSessionProgress(sessionId, answeredCountRef.current, correctCountRef.current);
  };

  /** 다음 문제 이동 또는 결과 화면 */
  const moveNext = async (finalCorrect: number) => {
    if (finishingRef.current) return;
    sheetRef.current?.close();

    if (currentIdx + 1 >= total) {
      if (!beginFinish()) return;
      // 모든 문제 완료 — 마지막 응답 저장이 끝난 뒤, 실제 푼 문제 수 기준으로 최종 반영
      await pendingSave.current;
      await Promise.all([
        updateSessionProgress(sessionId, answeredCountRef.current, finalCorrect),
        wait(FINISH_DELAY),
      ]);
      router.replace({
        pathname: '/result',
        params: { sessionId, categoryId },
      });
    } else {
      goTo(1);
    }
  };

  /** 즉시 확인 모드: 보기 선택 시 자동 제출 */
  const handleImmediateSubmit = async (choiceArrayIdx: number) => {
    if (isSubmitted || mode !== 'immediate') return;

    setSelections((prev) => ({ ...prev, [currentIdx]: choiceArrayIdx }));
    setSubmitted((prev) => ({ ...prev, [currentIdx]: true }));

    const correct = choiceArrayIdx === currentQ.mappedAnswer;
    if (correct) {
      correctCountRef.current += 1;
      setCorrectCount(correctCountRef.current);
    }

    // 피드백: 햅틱 → (오답이면) 정답 강조 → 해설 시트
    hapticAnswerResult(correct);
    const idx = currentIdx;
    if (!correct) {
      later(() => setRevealed((prev) => ({ ...prev, [idx]: true })), REVEAL_CORRECT_DELAY);
    }
    later(() => sheetRef.current?.expand(), correct ? SHEET_DELAY_CORRECT : SHEET_DELAY_WRONG);

    const mappedExplanation = mapExplanationSymbols(
      currentQ.original.explanation,
      currentQ.original.choices,
      currentQ.shuffledChoices
    );

    pendingSave.current = persistAnswer(choiceArrayIdx, correct, mappedExplanation);
    await pendingSave.current;
  };

  /** 일괄 확인 모드: 이전 문제로 이동 */
  const goToPrev = () => {
    if (currentIdx > 0) {
      goTo(-1);
    }
  };

  /**
   * 일괄 확인 모드: 다음 문제로 이동하거나, 마지막 문제면 채점 후 결과 화면으로.
   * 일괄 확인 모드에서는 푸는 도중 정답을 채점/저장하지 않고, 이미 푼 문제 사이를
   * 자유롭게 오가며 답을 번복할 수 있다. 실제 저장·채점은 마지막에 한 번에 수행한다.
   */
  const goToNext = async () => {
    if (selectedIdx === null) return;

    if (currentIdx + 1 >= total) {
      await finalizeDeferred();
    } else {
      goTo(1);
    }
  };

  /** 일괄 확인 모드: 모든 응답을 한 번에 저장하고 결과 화면으로 이동 */
  const finalizeDeferred = async () => {
    if (!beginFinish()) return;
    const startedAt = Date.now();

    // 실제로 응답한 문제 인덱스(오름차순)
    const answeredIndices = Object.keys(selections)
      .map(Number)
      .sort((a, b) => a - b);

    await createSession({
      id: sessionId,
      categoryId,
      sourceFileIds,
      total: 0,
      mode,
    });

    let correct = 0;
    for (const idx of answeredIndices) {
      const q = shuffled[idx];
      const chosenIdx = selections[idx];
      const isAnswerCorrect = chosenIdx === q.mappedAnswer;
      if (isAnswerCorrect) correct += 1;

      const mappedExplanation = mapExplanationSymbols(
        q.original.explanation,
        q.original.choices,
        q.shuffledChoices
      );

      await saveAnswer({
        id: uuid.v4() as string,
        sessionId,
        questionId: q.original.id,
        sourceFileId: q.original.sourceFileId,
        questionText: q.original.question,
        chosenIndex: chosenIdx,
        correctIndex: q.original.answer,
        isCorrect: isAnswerCorrect,
        explanation: mappedExplanation,
        correctLabel: stripChoiceSymbol(q.shuffledChoices[q.mappedAnswer]?.label ?? ''),
        mappedCorrectIndex: q.mappedAnswer,
        displayOrder: idx + 1,
      });
    }

    await updateSessionProgress(sessionId, answeredIndices.length, correct);
    // 저장이 빨리 끝나도 진행바가 끝까지 차는 모습은 보여 준다
    await wait(Math.max(0, FINISH_DELAY - (Date.now() - startedAt)));
    router.replace({
      pathname: '/result',
      params: { sessionId, categoryId },
    });
  };

  const handleExplanationNext = async () => {
    await moveNext(correctCountRef.current);
  };

  return (
    <View style={styles.safeArea}>
      <ScrollView
        ref={scrollRef}
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 진행 표시 */}
        <ProgressBar
          current={currentIdx + 1}
          total={total}
          correctCount={correctCount}
          showScore={mode === 'immediate'}
          complete={finishing}
        />

        {/* 문제가 바뀔 때마다 새로 마운트되어 방향에 맞는 진입 애니메이션을 재생 */}
        <Animated.View key={currentIdx} entering={questionEntering}>
          {/* 문제 영역 */}
          <View style={styles.questionCard}>
            <View style={styles.questionBadge}>
              <Text style={styles.questionBadgeText}>문제 {currentIdx + 1}</Text>
            </View>
            <MarkdownViewer content={currentQ.original.question} />
          </View>

          {/* 보기 영역 */}
          <View style={styles.choicesSection}>
            <Text style={styles.choicesLabel}>보기</Text>
            {currentQ.shuffledChoices.map((choice, arrIdx) => {
              const state = getChoiceState(arrIdx);
              return (
                <ChoiceItem
                  key={choice.index}
                  choice={choice}
                  displayIndex={arrIdx}
                  state={state}
                  disabled={isSubmitted}
                  onPress={() => {
                    if (mode === 'immediate') {
                      handleImmediateSubmit(arrIdx);
                    } else {
                      if (!isSubmitted) {
                        setSelections((prev) => ({ ...prev, [currentIdx]: arrIdx }));
                      }
                    }
                  }}
                />
              );
            })}
          </View>
        </Animated.View>
      </ScrollView>

      {/* 일괄 확인 모드: 이전/다음(결과 확인) 이동 버튼 — 화면 하단 고정.
          이미 푼 문제 사이를 오가며 답을 번복할 수 있고,
          현재 문제를 풀지 않았으면 다음 이동이 비활성화된다. */}
      {mode === 'deferred' && (
        <BottomActionBar>
          <NordButton
            label="이전 문제"
            variant="secondary"
            onPress={goToPrev}
            disabled={currentIdx === 0}
            size="lg"
            style={styles.barButton}
          />
          <NordButton
            label={currentIdx + 1 >= total ? '결과 확인' : '다음 문제'}
            onPress={goToNext}
            disabled={selectedIdx === null}
            loading={finishing}
            size="lg"
            style={styles.barButton}
          />
        </BottomActionBar>
      )}

      {/* 즉시 확인 모드: 제출 후 해설 시트를 닫았을 때 다시 열거나 바로 넘어갈 수 있는 버튼 */}
      {mode === 'immediate' && isSubmitted && (
        <BottomActionBar>
          <NordButton
            label="해설 다시 보기"
            variant="secondary"
            onPress={() => sheetRef.current?.expand()}
            size="lg"
            style={styles.barButton}
          />
          <NordButton
            label={currentIdx + 1 >= total ? '결과 보기' : '다음 문제'}
            onPress={handleExplanationNext}
            loading={finishing}
            size="lg"
            style={styles.barButton}
          />
        </BottomActionBar>
      )}

      {/* 즉시 확인 모드: 해설 바텀시트 */}
      {mode === 'immediate' && (
        <ExplanationSheet
          sheetRef={sheetRef}
          isCorrect={isCorrect}
          correctLabel={
            `${currentQ.mappedAnswer + 1}. ${stripChoiceSymbol(currentQ.shuffledChoices[currentQ.mappedAnswer]?.label ?? '')}`
          }
          selectedLabel={
            selectedIdx !== null
              ? `${selectedIdx + 1}. ${stripChoiceSymbol(currentQ.shuffledChoices[selectedIdx]?.label ?? '')}`
              : undefined
          }
          explanation={mapExplanationSymbols(
            currentQ.original.explanation,
            currentQ.original.choices,
            currentQ.shuffledChoices
          )}
          onNext={handleExplanationNext}
          nextLabel={currentIdx + 1 >= total ? '결과 보기' : '다음 문제'}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.bg.primary,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.base,
    paddingBottom: Spacing.xxxl,
  },
  questionCard: {
    backgroundColor: Colors.surface.card,
    borderRadius: Radius.lg,
    padding: Spacing.base,
    paddingLeft: Spacing.base + 2,
    marginBottom: Spacing.base,
    borderWidth: 1,
    borderColor: Colors.border,
    borderLeftWidth: 4,
    borderLeftColor: Colors.accent.primary,
    ...Shadow.md,
  },
  questionBadge: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.accent.primary,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: Radius.full,
    marginBottom: Spacing.sm,
  },
  questionBadgeText: {
    fontSize: Typography.size.xs,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  choicesSection: {
    marginBottom: Spacing.base,
  },
  choicesLabel: {
    fontSize: Typography.size.xs,
    fontWeight: Typography.weight.semibold,
    color: Colors.text.secondary,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: Spacing.sm,
  },
  headerClose: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: -Spacing.sm,
  },
  barButton: {
    flex: 1,
    borderRadius: Radius.lg,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    color: Colors.text.secondary,
    fontSize: Typography.size.base,
  },
});

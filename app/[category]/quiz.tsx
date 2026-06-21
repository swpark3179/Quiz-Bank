import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import BottomSheet from '@gorhom/bottom-sheet';
import uuid from 'react-native-uuid';
import { Colors, Typography, Spacing, Radius, Shadow } from '@/lib/theme';
import { ProgressBar } from '@/components/quiz/ProgressBar';
import { ChoiceItem } from '@/components/quiz/ChoiceItem';
import { ExplanationSheet } from '@/components/quiz/ExplanationSheet';
import { MarkdownViewer } from '@/components/MarkdownViewer';
import { NordButton } from '@/components/ui/NordButton';
import { createSession, saveAnswer, updateSessionProgress } from '@/lib/db/sessions';
import type { ShuffledQuestion } from '@/lib/quiz/shuffler';
import { stripChoiceSymbol, mapExplanationSymbols } from '@/lib/utils/quizUtils';

type ChoiceState = 'default' | 'selected' | 'correct' | 'wrong' | 'reveal-correct';

interface QuizSetup {
  shuffled: ShuffledQuestion[];
  mode: 'immediate' | 'deferred';
  categoryId: string;
  sourceFileIds: string[];
}

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

  const sheetRef = useRef<BottomSheet>(null);

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

  /** 보기 상태 결정 */
  const getChoiceState = (choiceArrayIdx: number): ChoiceState => {
    if (!isSubmitted) {
      return selectedIdx === choiceArrayIdx ? 'selected' : 'default';
    }
    // 제출 후
    if (choiceArrayIdx === currentQ.mappedAnswer) return 'correct';
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
    sheetRef.current?.close();

    if (currentIdx + 1 >= total) {
      // 모든 문제 완료 — 실제 푼 문제 수 기준으로 최종 반영
      await updateSessionProgress(sessionId, answeredCountRef.current, finalCorrect);
      router.replace({
        pathname: '/result',
        params: { sessionId, categoryId },
      });
    } else {
      setCurrentIdx((i) => i + 1);
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

    const mappedExplanation = mapExplanationSymbols(
      currentQ.original.explanation,
      currentQ.original.choices,
      currentQ.shuffledChoices
    );

    await persistAnswer(choiceArrayIdx, correct, mappedExplanation);
    sheetRef.current?.expand();
  };

  /** 일괄 확인 모드: 이전 문제로 이동 */
  const goToPrev = () => {
    if (currentIdx > 0) {
      setCurrentIdx((i) => i - 1);
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
      setCurrentIdx((i) => i + 1);
    }
  };

  /** 일괄 확인 모드: 모든 응답을 한 번에 저장하고 결과 화면으로 이동 */
  const finalizeDeferred = async () => {
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
    router.replace({
      pathname: '/result',
      params: { sessionId, categoryId },
    });
  };

  const handleExplanationNext = async () => {
    await moveNext(correctCountRef.current);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <ScrollView
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
        />

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

        {/* 일괄 확인 모드: 이전/다음(결과 확인) 이동 버튼.
            이미 푼 문제 사이를 오가며 답을 번복할 수 있고,
            현재 문제를 풀지 않았으면 다음 이동이 비활성화된다. */}
        {mode === 'deferred' && (
          <View style={styles.navRow}>
            <NordButton
              label="이전 문제"
              variant="secondary"
              onPress={goToPrev}
              disabled={currentIdx === 0}
              size="lg"
              style={styles.navButton}
            />
            <NordButton
              label={currentIdx + 1 >= total ? '결과 확인' : '다음 문제'}
              onPress={goToNext}
              disabled={selectedIdx === null}
              size="lg"
              style={styles.navButton}
            />
          </View>
        )}

        {/* 즉시 확인 모드: 제출 후 해설 시트를 닫았을 때 다시 열 수 있는 버튼 */}
        {mode === 'immediate' && isSubmitted && (
          <NordButton
            label="해설 다시 보기"
            variant="secondary"
            onPress={() => sheetRef.current?.expand()}
            fullWidth
            size="lg"
            style={styles.nextButton}
          />
        )}
      </ScrollView>

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
    </SafeAreaView>
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
  nextButton: {
    marginTop: Spacing.sm,
    borderRadius: Radius.lg,
  },
  navRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: Spacing.sm,
  },
  navButton: {
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

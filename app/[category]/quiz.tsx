import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
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
import { createSession, saveAnswer, updateSessionCorrect } from '@/lib/db/sessions';
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
    // 최초 1회만 세션 생성
    if (!sessionCreated.current) {
      sessionCreated.current = true;
      await createSession({
        id: sessionId,
        categoryId,
        sourceFileIds,
        total,
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
    });
  };

  /** 다음 문제 이동 또는 결과 화면 */
  const moveNext = async (finalCorrect: number) => {
    sheetRef.current?.close();

    if (currentIdx + 1 >= total) {
      // 모든 문제 완료
      await updateSessionCorrect(sessionId, finalCorrect);
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

  /** 일괄 확인 모드: 다음 버튼 누를 때 제출 */
  const handleDeferredNext = async () => {
    if (selectedIdx === null) {
      Alert.alert('보기를 선택해주세요');
      return;
    }
    setSubmitted((prev) => ({ ...prev, [currentIdx]: true }));

    const correct = selectedIdx === currentQ.mappedAnswer;
    if (correct) {
      correctCountRef.current += 1;
      setCorrectCount(correctCountRef.current);
    }

    const mappedExplanation = mapExplanationSymbols(
      currentQ.original.explanation,
      currentQ.original.choices,
      currentQ.shuffledChoices
    );

    await persistAnswer(selectedIdx, correct, mappedExplanation);
    await moveNext(correctCountRef.current);
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

        {/* 일괄 확인 모드: 다음/완료 버튼 */}
        {mode === 'deferred' && (
          <NordButton
            label={currentIdx + 1 >= total ? '결과 확인' : '다음 문제'}
            onPress={handleDeferredNext}
            fullWidth
            size="lg"
            disabled={selectedIdx === null}
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
    backgroundColor: Colors.card,
    borderRadius: Radius.lg,
    padding: Spacing.base,
    marginBottom: Spacing.base,
    borderWidth: 1,
    borderColor: Colors.border + '80',
    ...Shadow.sm,
  },
  questionBadge: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.accent.primary + '18',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: Radius.full,
    marginBottom: Spacing.sm,
  },
  questionBadgeText: {
    fontSize: Typography.size.xs,
    fontWeight: Typography.weight.bold,
    color: Colors.accent.primary,
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

import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import BottomSheet from '@gorhom/bottom-sheet';
import Svg, { Circle } from 'react-native-svg';
import Animated, {
  Easing,
  FadeIn,
  useAnimatedProps,
  useReducedMotion,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { fetchSession, fetchAnswers } from '@/lib/db/sessions';
import type { SessionRow, AnswerRow } from '@/lib/db/sessions';
import { buildWrongAnswerQuiz } from '@/lib/quiz/retry';
import { Colors, Typography, Spacing, Radius, Shadow, accuracyTone } from '@/lib/theme';
import { Motion, listEntering } from '@/lib/theme/motion';
import { NordButton } from '@/components/ui/NordButton';
import { ExplanationSheet } from '@/components/quiz/ExplanationSheet';
import { ScreenSkeleton } from '@/components/ui/Skeleton';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

/**
 * 점수 링 — react-native-svg 기반 도넛 게이지.
 * 결과 화면에 들어오면 0에서 점수까지 링이 차오르고, 가운데 숫자도 같은 시간·곡선으로 올라간다.
 */
function ScoreRing({ pct, color }: { pct: number; color: string }) {
  const size = 132, stroke = 11, r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;

  const reduceMotion = useReducedMotion();
  const progress = useSharedValue(0);
  const [shownPct, setShownPct] = useState(reduceMotion ? pct : 0);

  useEffect(() => {
    progress.set(
      withTiming(pct / 100, { duration: Motion.duration.emphasis, easing: Easing.out(Easing.cubic) })
    );
  }, [pct, progress]);

  // 숫자 카운트업 (ease-out cubic, 링과 동일)
  useEffect(() => {
    if (reduceMotion) return;
    const startedAt = Date.now();
    let frame = 0;
    const tick = () => {
      const t = Math.min(1, (Date.now() - startedAt) / Motion.duration.emphasis);
      setShownPct(Math.round(pct * (1 - Math.pow(1 - t, 3))));
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [pct, reduceMotion]);

  const ringProps = useAnimatedProps(() => ({
    strokeDashoffset: circ * (1 - progress.get()),
  }));

  return (
    <View
      style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}
      accessible
      accessibilityLabel={`정답률 ${pct}퍼센트`}
    >
      <Svg width={size} height={size} style={{ position: 'absolute', transform: [{ rotate: '-90deg' }] }}>
        <Circle cx={size / 2} cy={size / 2} r={r} stroke="#D7DEE9" strokeWidth={stroke} fill="none" />
        <AnimatedCircle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={color}
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circ}
          animatedProps={ringProps}
        />
      </Svg>
      <Text style={{ fontSize: 32, fontWeight: '800', color, fontVariant: ['tabular-nums'] }}>{shownPct}%</Text>
      <Text style={{ fontSize: 11, color: Colors.text.secondary }}>정답률</Text>
    </View>
  );
}

export default function ResultScreen() {
  const { sessionId, categoryId } = useLocalSearchParams<{
    sessionId: string;
    categoryId: string;
  }>();
  const router = useRouter();

  const [session, setSession] = useState<SessionRow | null>(null);
  const [answers, setAnswers] = useState<AnswerRow[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedAnswer, setSelectedAnswer] = useState<AnswerRow | null>(null);
  const sheetRef = useRef<BottomSheet>(null);
  // 오답 다시 풀기: 문제를 준비하는 동안 버튼에 로딩 표시
  const [preparingRetry, setPreparingRetry] = useState(false);

  useEffect(() => {
    (async () => {
      const [s, a] = await Promise.all([
        fetchSession(sessionId),
        fetchAnswers(sessionId),
      ]);
      setSession(s);
      setAnswers(a);
      setLoading(false);
    })();
  }, [sessionId]);

  if (loading || !session) {
    return <ScreenSkeleton summaryHeight={330} />;
  }

  const accuracy = session.total > 0 ? session.correct / session.total : 0;
  const accuracyPct = Math.round(accuracy * 100);
  const wrongCount = session.total - session.correct;

  // 등급 문구는 결과 화면 고유의 구간을 쓰고, 색은 앱 공통 정답률 등급에서 가져온다.
  // (시각적 강조는 점수 링이 맡으므로 이모지는 쓰지 않는다)
  const getGradeLabel = () => {
    if (accuracyPct >= 90) return '완벽해요!';
    if (accuracyPct >= 70) return '잘 했어요!';
    if (accuracyPct >= 50) return '괜찮아요!';
    return '다시 도전!';
  };

  const grade = { label: getGradeLabel(), color: accuracyTone(accuracyPct).color };

  /** 오답만 모아 이 화면에서 바로 퀴즈로 교체 (카테고리 화면을 거치지 않는다) */
  const handleRetryWrong = async () => {
    try {
      setPreparingRetry(true);
      const setup = await buildWrongAnswerQuiz(sessionId, categoryId, 'immediate');
      if (!setup) {
        Alert.alert('확인', '오답 문제가 없습니다!');
        return;
      }
      router.replace({
        pathname: `/${categoryId}/quiz`,
        params: { setup: JSON.stringify(setup) },
      });
    } catch (e) {
      console.error('오답 재시험 준비 오류:', e);
      Alert.alert('오류', '오답 문제를 불러오지 못했습니다.');
    } finally {
      setPreparingRetry(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* 로딩 골격에서 콘텐츠로 짧게 페이드 교체 */}
      <Animated.View entering={FadeIn.duration(160)} style={styles.fill}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {/* 결과 카드 */}
          <View style={styles.resultCard}>
            <Text style={[styles.gradeText, { color: grade.color }]}>{grade.label}</Text>

            {/* 점수 링 표시 */}
            <ScoreRing pct={accuracyPct} color={grade.color} />

            {/* 상세 수치 — 분리된 색 카드 */}
            <View style={styles.statsRow}>
              <Animated.View
                entering={listEntering(0, 200)}
                style={[styles.statCard, styles.statCardTotal]}
              >
                <Text style={styles.statNum}>{session.total}</Text>
                <Text style={styles.statLabel}>총 문제</Text>
              </Animated.View>
              <Animated.View
                entering={listEntering(1, 200)}
                style={[styles.statCard, styles.statCardCorrect]}
              >
                <Text style={[styles.statNum, { color: Colors.status.correct }]}>{session.correct}</Text>
                <Text style={styles.statLabel}>정답</Text>
              </Animated.View>
              <Animated.View
                entering={listEntering(2, 200)}
                style={[styles.statCard, styles.statCardWrong]}
              >
                <Text style={[styles.statNum, { color: Colors.status.wrong }]}>{wrongCount}</Text>
                <Text style={styles.statLabel}>오답</Text>
              </Animated.View>
            </View>
          </View>

          {/* 문제별 결과 목록 */}
          <Text style={styles.sectionTitle}>문제별 결과</Text>
          {answers.map((ans, i) => (
            <Animated.View
              key={ans.id}
              entering={listEntering(i, 400)}
              style={styles.answerRow}
            >
              <View style={styles.answerLeft}>
                <Text style={styles.answerNum}>Q{i + 1}</Text>
                <View
                  style={[
                    styles.answerBadge,
                    { backgroundColor: ans.is_correct ? Colors.status.correct : Colors.status.wrong },
                  ]}
                >
                  <Ionicons name={ans.is_correct ? 'checkmark' : 'close'} size={15} color="#FFFFFF" />
                </View>
              </View>
              <View style={styles.answerCenter}>
                <Text style={styles.answerQuestion} numberOfLines={2}>
                  {ans.question_text}
                </Text>
                <Text style={styles.answerChoiceInfo}>
                  내 선택: {ans.chosen_index !== null ? ans.chosen_index + 1 : '선택안함'} / 정답: {
                    ans.mapped_correct_index !== null && ans.mapped_correct_index !== undefined
                      ? ans.mapped_correct_index + 1
                      : ans.correct_index + 1
                  }
                </Text>
              </View>
              <NordButton
                label="해설"
                variant="tonal"
                size="sm"
                onPress={() => {
                  setSelectedAnswer(ans);
                  sheetRef.current?.expand();
                }}
                accessibilityLabel={`문제 ${i + 1} 해설 보기`}
                style={styles.explanationBtn}
              />
            </Animated.View>
          ))}

          {/* 액션 버튼 */}
          <View style={styles.actions}>
            {wrongCount > 0 && (
              <NordButton
                label={`오답 ${wrongCount}문제 다시 풀기`}
                variant="secondary"
                fullWidth
                size="lg"
                onPress={handleRetryWrong}
                loading={preparingRetry}
                icon={<Ionicons name="refresh-outline" size={18} color={Colors.accent.deep} />}
              />
            )}
            {/* 스택에 있는 카테고리 화면까지 되돌아간다 (없으면 현재 화면을 교체) */}
            <NordButton
              label="카테고리로 돌아가기"
              variant="ghost"
              fullWidth
              size="lg"
              onPress={() => router.dismissTo(`/${categoryId}`)}
            />
            <NordButton
              label="통계 보기"
              variant="ghost"
              fullWidth
              onPress={() => router.push(`/stats/${categoryId}`)}
              icon={<Ionicons name="bar-chart-outline" size={16} color={Colors.accent.deep} />}
            />
          </View>
        </ScrollView>
      </Animated.View>

      {/* 해설 바텀시트 */}
      <ExplanationSheet
        sheetRef={sheetRef}
        isCorrect={selectedAnswer?.is_correct === 1}
        correctLabel={selectedAnswer?.correct_label || '알 수 없음'}
        explanation={selectedAnswer?.explanation || '해설이 없습니다.'}
        onNext={() => sheetRef.current?.close()}
        nextLabel="닫기"
      />
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
    paddingBottom: Spacing.xxxl,
    gap: Spacing.md,
  },
  resultCard: {
    backgroundColor: Colors.surface.card,
    borderRadius: Radius.xl,
    padding: Spacing.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadow.md,
    gap: Spacing.md,
  },
  gradeText: {
    fontSize: Typography.size.xl,
    fontWeight: Typography.weight.bold,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
    width: '100%',
    gap: Spacing.sm,
    paddingTop: Spacing.sm,
  },
  statCard: {
    flex: 1,
    borderRadius: Radius.md,
    borderWidth: 1,
    paddingVertical: 11,
    alignItems: 'center',
    gap: 2,
  },
  statCardTotal: {
    backgroundColor: Colors.surface.sheet,
    borderColor: Colors.border,
  },
  statCardCorrect: {
    backgroundColor: Colors.status.correctBg,
    borderColor: Colors.status.correctBorder,
  },
  statCardWrong: {
    backgroundColor: Colors.status.wrongBg,
    borderColor: Colors.status.wrongBorder,
  },
  statNum: {
    fontSize: Typography.size.xl,
    fontWeight: Typography.weight.bold,
    color: Colors.text.primary,
  },
  statLabel: {
    fontSize: Typography.size.xs,
    color: Colors.text.secondary,
  },
  sectionTitle: {
    fontSize: Typography.size.sm,
    fontWeight: Typography.weight.semibold,
    color: Colors.text.secondary,
    marginTop: Spacing.sm,
  },
  answerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: Colors.surface.card,
    borderRadius: Radius.sm,
    padding: Spacing.sm,
    paddingLeft: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: Spacing.sm,
  },
  answerLeft: {
    alignItems: 'center',
    gap: 4,
    minWidth: 42,
  },
  answerBadge: {
    width: 24,
    height: 24,
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
  },
  answerNum: {
    fontSize: Typography.size.sm,
    fontWeight: Typography.weight.bold,
    color: Colors.text.secondary,
  },
  answerCenter: {
    flex: 1,
    justifyContent: 'center',
  },
  answerQuestion: {
    fontSize: Typography.size.sm,
    color: Colors.text.primary,
    lineHeight: Typography.size.sm * 1.5,
  },
  answerChoiceInfo: {
    fontSize: Typography.size.xs,
    color: Colors.text.secondary,
    marginTop: 4,
  },
  explanationBtn: {
    alignSelf: 'center',
  },
  actions: {
    gap: Spacing.sm,
    marginTop: Spacing.sm,
  },
  fill: {
    flex: 1,
  },
});

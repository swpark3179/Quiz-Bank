import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import BottomSheet from '@gorhom/bottom-sheet';
import Svg, { Circle } from 'react-native-svg';
import { fetchSession, fetchAnswers, fetchWrongAnswers } from '@/lib/db/sessions';
import type { SessionRow, AnswerRow } from '@/lib/db/sessions';
import { Colors, Typography, Spacing, Radius, Shadow } from '@/lib/theme';
import { NordButton } from '@/components/ui/NordButton';
import { ExplanationSheet } from '@/components/quiz/ExplanationSheet';

/** 점수 링 — react-native-svg 기반 도넛 게이지 */
function ScoreRing({ pct, color }: { pct: number; color: string }) {
  const size = 132, stroke = 11, r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - pct / 100);
  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size} style={{ position: 'absolute', transform: [{ rotate: '-90deg' }] }}>
        <Circle cx={size / 2} cy={size / 2} r={r} stroke="#D7DEE9" strokeWidth={stroke} fill="none" />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={color}
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
        />
      </Svg>
      <Text style={{ fontSize: 32, fontWeight: '800', color }}>{pct}%</Text>
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
    return <View style={styles.centered} />;
  }

  const accuracy = session.total > 0 ? session.correct / session.total : 0;
  const accuracyPct = Math.round(accuracy * 100);
  const wrongCount = session.total - session.correct;

  const getGrade = () => {
    if (accuracyPct >= 90) return { label: '완벽해요! 🏆', color: Colors.status.correct };
    if (accuracyPct >= 70) return { label: '잘 했어요! 👍', color: Colors.accent.secondary };
    if (accuracyPct >= 50) return { label: '괜찮아요! 💪', color: Colors.status.warning };
    return { label: '다시 도전! 🔥', color: Colors.status.wrong };
  };

  const grade = getGrade();

  const handleRetryWrong = async () => {
    router.push({
      pathname: `/${categoryId}`,
      params: { retrySession: sessionId },
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* 결과 카드 */}
        <View style={styles.resultCard}>
          <Text style={styles.gradeEmoji}>{
            accuracyPct >= 90 ? '🏆' : accuracyPct >= 70 ? '👍' : accuracyPct >= 50 ? '💪' : '🔥'
          }</Text>
          <Text style={[styles.gradeText, { color: grade.color }]}>{grade.label}</Text>

          {/* 점수 링 표시 */}
          <ScoreRing pct={accuracyPct} color={grade.color} />

          {/* 상세 수치 — 분리된 색 카드 */}
          <View style={styles.statsRow}>
            <View style={[styles.statCard, styles.statCardTotal]}>
              <Text style={styles.statNum}>{session.total}</Text>
              <Text style={styles.statLabel}>총 문제</Text>
            </View>
            <View style={[styles.statCard, styles.statCardCorrect]}>
              <Text style={[styles.statNum, { color: Colors.status.correct }]}>{session.correct}</Text>
              <Text style={styles.statLabel}>정답</Text>
            </View>
            <View style={[styles.statCard, styles.statCardWrong]}>
              <Text style={[styles.statNum, { color: Colors.status.wrong }]}>{wrongCount}</Text>
              <Text style={styles.statLabel}>오답</Text>
            </View>
          </View>
        </View>

        {/* 문제별 결과 목록 */}
        <Text style={styles.sectionTitle}>문제별 결과</Text>
        {answers.map((ans, i) => (
          <View
            key={ans.id}
            style={[
              styles.answerRow,
              { borderLeftColor: ans.is_correct ? Colors.status.correct : Colors.status.wrong },
            ]}
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
            <TouchableOpacity
              style={styles.explanationBtn}
              onPress={() => {
                setSelectedAnswer(ans);
                sheetRef.current?.expand();
              }}
              accessibilityRole="button"
              accessibilityLabel={`문제 ${i + 1} 해설 보기`}
            >
              <Text style={styles.explanationBtnText}>해설</Text>
            </TouchableOpacity>
          </View>
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
              icon={<Ionicons name="refresh-outline" size={18} color={Colors.accent.primary} />}
            />
          )}
          <NordButton
            label="카테고리로 돌아가기"
            variant="ghost"
            fullWidth
            size="lg"
            onPress={() => router.replace(`/${categoryId}`)}
          />
          <NordButton
            label="통계 보기"
            variant="ghost"
            fullWidth
            onPress={() => router.push(`/stats/${categoryId}`)}
            icon={<Ionicons name="bar-chart-outline" size={16} color={Colors.accent.primary} />}
          />
        </View>
      </ScrollView>

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
  gradeEmoji: {
    fontSize: 48,
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
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginTop: Spacing.sm,
  },
  answerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: Colors.surface.card,
    borderRadius: Radius.sm,
    padding: Spacing.sm,
    paddingLeft: Spacing.md,
    borderLeftWidth: 3,
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
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    backgroundColor: Colors.choice.selected,
    borderWidth: 1,
    borderColor: Colors.choice.selectedBorder,
    borderRadius: Radius.sm,
    alignSelf: 'center',
  },
  explanationBtnText: {
    fontSize: Typography.size.xs,
    fontWeight: Typography.weight.bold,
    color: Colors.accent.primary,
  },
  actions: {
    gap: Spacing.sm,
    marginTop: Spacing.sm,
  },
  centered: {
    flex: 1,
    backgroundColor: Colors.bg.primary,
  },
});

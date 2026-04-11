import React, { useEffect, useState } from 'react';
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
import { fetchSession, fetchAnswers, fetchWrongAnswers } from '@/lib/db/sessions';
import type { SessionRow, AnswerRow } from '@/lib/db/sessions';
import { Colors, Typography, Spacing, Radius, Shadow } from '@/lib/theme';
import { NordButton } from '@/components/ui/NordButton';
import { NordBadge } from '@/components/ui/NordBadge';

export default function ResultScreen() {
  const { sessionId, categoryId } = useLocalSearchParams<{
    sessionId: string;
    categoryId: string;
  }>();
  const router = useRouter();

  const [session, setSession] = useState<SessionRow | null>(null);
  const [answers, setAnswers] = useState<AnswerRow[]>([]);
  const [loading, setLoading] = useState(true);

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

          {/* 점수 원형 표시 */}
          <View style={styles.scoreCircle}>
            <Text style={[styles.scoreValue, { color: grade.color }]}>{accuracyPct}%</Text>
            <Text style={styles.scoreLabel}>정답률</Text>
          </View>

          {/* 상세 수치 */}
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statNum}>{session.total}</Text>
              <Text style={styles.statLabel}>총 문제</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={[styles.statNum, { color: Colors.status.correct }]}>{session.correct}</Text>
              <Text style={styles.statLabel}>정답</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
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
              <NordBadge
                label={ans.is_correct ? '정답' : '오답'}
                variant={ans.is_correct ? 'success' : 'error'}
                size="sm"
              />
            </View>
            <Text style={styles.answerQuestion} numberOfLines={2}>
              {ans.question_text}
            </Text>
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
    backgroundColor: Colors.card,
    borderRadius: Radius.xl,
    padding: Spacing.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border + '80',
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
  scoreCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 6,
    borderColor: Colors.bg.tertiary,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  scoreValue: {
    fontSize: Typography.size.xxl,
    fontWeight: Typography.weight.bold,
  },
  scoreLabel: {
    fontSize: Typography.size.xs,
    color: Colors.text.secondary,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingTop: Spacing.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Colors.divider,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
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
  statDivider: {
    width: 1,
    height: 32,
    backgroundColor: Colors.divider,
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
    backgroundColor: Colors.card,
    borderRadius: Radius.sm,
    padding: Spacing.sm,
    paddingLeft: Spacing.md,
    borderLeftWidth: 3,
    borderWidth: 1,
    borderColor: Colors.border + '60',
    gap: Spacing.sm,
  },
  answerLeft: {
    alignItems: 'center',
    gap: 4,
    minWidth: 42,
  },
  answerNum: {
    fontSize: Typography.size.sm,
    fontWeight: Typography.weight.bold,
    color: Colors.text.secondary,
  },
  answerQuestion: {
    flex: 1,
    fontSize: Typography.size.sm,
    color: Colors.text.primary,
    lineHeight: Typography.size.sm * 1.5,
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

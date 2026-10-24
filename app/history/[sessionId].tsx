import React, { useEffect, useState } from 'react';
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
import {
  fetchSession,
  fetchAnswers,
  deleteSession,
} from '@/lib/db/sessions';
import type { SessionRow, AnswerRow } from '@/lib/db/sessions';
import { buildWrongAnswerQuiz } from '@/lib/quiz/retry';
import { fetchCategoryNames } from '@/lib/local/categories';
import { Colors, Typography, Spacing, Radius, Shadow, accuracyTone } from '@/lib/theme';
import { NordButton } from '@/components/ui/NordButton';
import { NordBadge } from '@/components/ui/NordBadge';
import { ScreenSkeleton } from '@/components/ui/Skeleton';
import Animated, { FadeIn } from 'react-native-reanimated';

export default function SessionDetailScreen() {
  const { sessionId } = useLocalSearchParams<{ sessionId: string }>();
  const router = useRouter();

  const [session, setSession] = useState<SessionRow | null>(null);
  const [answers, setAnswers] = useState<AnswerRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryName, setCategoryName] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const [s, a, names] = await Promise.all([
        fetchSession(sessionId),
        fetchAnswers(sessionId),
        fetchCategoryNames(),
      ]);
      setSession(s);
      setAnswers(a);
      setCategoryName(s ? names[s.category_id] ?? null : null);
      setLoading(false);
    })();
  }, [sessionId]);

  const handleDelete = () => {
    Alert.alert('이력 삭제', '이 풀이 기록을 삭제하시겠습니까?', [
      { text: '취소', style: 'cancel' },
      {
        text: '삭제',
        style: 'destructive',
        onPress: async () => {
          await deleteSession(sessionId);
          router.back();
        },
      },
    ]);
  };

  const handleRetryWrong = async () => {
    if (!session) return;

    try {
      const setup = await buildWrongAnswerQuiz(sessionId, session.category_id, session.mode);
      if (!setup) {
        Alert.alert('확인', '오답 문제가 없습니다!');
        return;
      }

      router.push({
        pathname: `/${session.category_id}/quiz`,
        params: { setup: JSON.stringify(setup) },
      });
    } catch (e) {
      console.error('오답 재시험 준비 오류:', e);
      Alert.alert('오류', '오답 문제를 불러오지 못했습니다.');
    }
  };

  if (loading || !session) {
    return <ScreenSkeleton summaryHeight={130} />;
  }

  const accuracyPct = Math.round((session.correct / session.total) * 100);
  const wrongCount = session.total - session.correct;

  const formatDate = (ts: number) => {
    const d = new Date(ts);
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}  ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      {/* 로딩 골격에서 콘텐츠로 짧게 페이드 교체 */}
      <Animated.View entering={FadeIn.duration(160)} style={styles.fill}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {/* 요약 */}
          <View style={styles.summaryCard}>
            <View style={styles.summaryHeader}>
              <Text style={styles.categoryText}>{categoryName ?? session.category_id}</Text>
              <Text style={styles.dateText}>{formatDate(session.created_at)}</Text>
            </View>
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
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={[styles.statNum, { color: accuracyTone(accuracyPct).color }]}>
                  {accuracyPct}%
                </Text>
                <Text style={styles.statLabel}>정답률 · {accuracyTone(accuracyPct).label}</Text>
              </View>
            </View>
          </View>

          {/* 문제별 결과 */}
          <Text style={styles.sectionTitle}>문제별 결과</Text>
          {answers.map((ans, i) => (
            <View key={ans.id} style={styles.answerRow}>
              <View style={styles.answerMeta}>
                <Text style={styles.answerNum}>Q{i + 1}</Text>
                <NordBadge
                  label={ans.is_correct ? '정답' : '오답'}
                  variant={ans.is_correct ? 'success' : 'error'}
                  size="sm"
                />
              </View>
              <Text style={styles.answerQuestion} numberOfLines={3}>
                {ans.question_text}
              </Text>
            </View>
          ))}

          {/* 액션 버튼 */}
          <View style={styles.actions}>
            {wrongCount > 0 && (
              <NordButton
                label={`오답 ${wrongCount}문제 다시 풀기`}
                variant="primary"
                fullWidth
                size="lg"
                onPress={handleRetryWrong}
                icon={<Ionicons name="refresh-outline" size={18} color={Colors.text.inverse} />}
              />
            )}
            <NordButton
              label="이 기록 삭제"
              variant="ghost"
              fullWidth
              onPress={handleDelete}
              style={{ marginTop: Spacing.sm }}
            />
          </View>
        </ScrollView>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.bg.primary,
  },
  fill: {
    flex: 1,
  },
  content: {
    padding: Spacing.base,
    gap: Spacing.sm,
    paddingBottom: Spacing.xxxl,
  },
  summaryCard: {
    backgroundColor: Colors.card,
    borderRadius: Radius.lg,
    padding: Spacing.base,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadow.sm,
    gap: Spacing.md,
    marginBottom: Spacing.sm,
  },
  summaryHeader: {
    gap: 2,
  },
  categoryText: {
    fontSize: Typography.size.md,
    fontWeight: Typography.weight.bold,
    color: Colors.text.primary,
  },
  dateText: {
    fontSize: Typography.size.sm,
    color: Colors.text.secondary,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
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
    marginTop: Spacing.sm,
  },
  answerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: Colors.card,
    borderRadius: Radius.sm,
    padding: Spacing.sm,
    paddingLeft: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: Spacing.sm,
  },
  answerMeta: {
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
    marginTop: Spacing.md,
    gap: Spacing.xs,
  },
});

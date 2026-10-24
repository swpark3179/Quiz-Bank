import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useRouter, useLocalSearchParams, useNavigation } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { fetchAllSessions } from '@/lib/db/sessions';
import type { SessionRow } from '@/lib/db/sessions';
import { fetchCategoryNames } from '@/lib/local/categories';
import { Colors, Typography, Spacing, Radius, Shadow, accuracyTone } from '@/lib/theme';
import { NordBadge } from '@/components/ui/NordBadge';
import { ScreenEnter } from '@/components/ui/ScreenEnter';

export default function HistoryScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const { from } = useLocalSearchParams<{ from?: string }>();
  const [sessions, setSessions] = useState<SessionRow[]>([]);
  const [categoryNames, setCategoryNames] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    navigation.setOptions({
      headerBackTitle: from === 'main' ? '홈' : '문제 목록',
    });
  }, [from, navigation]);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const loadSessions = async () => {
        const [s, names] = await Promise.all([fetchAllSessions(), fetchCategoryNames()]);
        if (isActive) {
          setSessions(s);
          setCategoryNames(names);
          setLoading(false);
        }
      };

      loadSessions();

      return () => {
        isActive = false;
      };
    }, [])
  );

  const formatDate = (ts: number) => {
    const d = new Date(ts);
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}  ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      {/* 웹에서만 짧은 진입 페이드 (네이티브는 스택 전환) */}
      <ScreenEnter>
        <FlatList
          data={sessions}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Ionicons name="time-outline" size={56} color={Colors.text.tertiary} />
              <Text style={styles.emptyText}>풀이 이력이 없습니다.</Text>
            </View>
          }
          renderItem={({ item: session, index }) => {
            const accuracyPct = Math.round((session.correct / session.total) * 100);
            const wrongCount = session.total - session.correct;

            return (
              <TouchableOpacity
                style={styles.card}
                onPress={() => router.push(`/history/${session.id}`)}
                activeOpacity={0.82}
                accessibilityRole="button"
                accessibilityLabel={`${categoryNames[session.category_id] ?? session.category_id} 풀이 기록. 정답률 ${accuracyPct}%. ${formatDate(session.created_at)}`}
              >
                <View style={styles.cardHeader}>
                  <View style={styles.rankCircle}>
                    <Text style={styles.rankText}>{sessions.length - index}</Text>
                  </View>
                  <View style={styles.cardInfo}>
                    <Text style={styles.categoryLabel}>
                      {categoryNames[session.category_id] ?? session.category_id}
                    </Text>
                    <Text style={styles.dateText}>{formatDate(session.created_at)}</Text>
                  </View>
                  <NordBadge
                    label={`${accuracyPct}%`}
                    variant={accuracyTone(accuracyPct).badge}
                  />
                </View>

                <View style={styles.cardStats}>
                  <Text style={styles.stat}>
                    <Text style={styles.statBold}>{session.total}</Text> 문제
                  </Text>
                  <Text style={styles.statDot}>·</Text>
                  <Text style={[styles.stat, { color: Colors.status.correct }]}>
                    정답 <Text style={styles.statBold}>{session.correct}</Text>
                  </Text>
                  <Text style={styles.statDot}>·</Text>
                  <Text style={[styles.stat, { color: Colors.status.wrong }]}>
                    오답 <Text style={styles.statBold}>{wrongCount}</Text>
                  </Text>
                  <Text style={styles.statDot}>·</Text>
                  <View style={styles.modeTag}>
                    <Ionicons
                      name={session.mode === 'immediate' ? 'flash-outline' : 'list-outline'}
                      size={12}
                      color={Colors.text.secondary}
                    />
                    <Text style={styles.stat}>{session.mode === 'immediate' ? '즉시 확인' : '일괄 확인'}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          }}
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
  list: {
    padding: Spacing.base,
    gap: Spacing.sm,
    paddingBottom: Spacing.xxxl,
  },
  card: {
    backgroundColor: Colors.card,
    borderRadius: Radius.md,
    padding: Spacing.base,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: Spacing.sm,
    ...Shadow.sm,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  rankCircle: {
    width: 36,
    height: 36,
    borderRadius: Radius.full,
    backgroundColor: Colors.bg.secondary,
    borderWidth: 1.5,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  rankText: {
    fontSize: Typography.size.sm,
    fontWeight: Typography.weight.bold,
    color: Colors.text.secondary,
  },
  cardInfo: {
    flex: 1,
  },
  categoryLabel: {
    fontSize: Typography.size.base,
    fontWeight: Typography.weight.semibold,
    color: Colors.text.primary,
  },
  dateText: {
    fontSize: Typography.size.xs,
    color: Colors.text.secondary,
    marginTop: 1,
  },
  cardStats: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: Spacing.xs,
  },
  stat: {
    fontSize: Typography.size.xs,
    color: Colors.text.secondary,
  },
  statBold: {
    fontWeight: Typography.weight.bold,
  },
  modeTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  statDot: {
    fontSize: Typography.size.xs,
    color: Colors.text.tertiary,
  },
  empty: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: Spacing.xxxl * 2,
    gap: Spacing.md,
  },
  emptyText: {
    fontSize: Typography.size.base,
    color: Colors.text.secondary,
  },
});

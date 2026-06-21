import React, { useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import BottomSheet, {
  BottomSheetScrollView,
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
} from '@gorhom/bottom-sheet';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Radius, Shadow } from '@/lib/theme';
import { MarkdownViewer } from '../MarkdownViewer';
import { NordButton } from '../ui/NordButton';

interface ExplanationSheetProps {
  sheetRef: React.RefObject<BottomSheet | null>;
  isCorrect: boolean;
  correctLabel: string;   // 정답 보기 텍스트 (화면 표시 번호 기준)
  selectedLabel?: string; // 사용자가 선택한 답 텍스트 (화면 표시 번호 기준)
  explanation: string;    // 마크다운 해설
  onNext: () => void;
  nextLabel?: string;
}

const snapPoints = ['60%', '90%'];

export function ExplanationSheet({
  sheetRef,
  isCorrect,
  correctLabel,
  selectedLabel,
  explanation,
  onNext,
  nextLabel = '다음 문제',
}: ExplanationSheetProps) {
  const scrollRef = useRef<ScrollView>(null);

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.4}
      />
    ),
    []
  );

  // 시트가 열릴 때(목표 인덱스 >= 0) 항상 맨 위(정답/오답 헤더)부터 보이도록
  // 열림 애니메이션 시작 시점에 스크롤 위치를 초기화한다.
  const handleAnimate = useCallback((fromIndex: number, toIndex: number) => {
    if (toIndex >= 0) {
      scrollRef.current?.scrollTo({ y: 0, animated: false });
    }
  }, []);

  return (
    <BottomSheet
      ref={sheetRef}
      index={-1}
      snapPoints={snapPoints}
      enablePanDownToClose={false}
      backdropComponent={renderBackdrop}
      handleIndicatorStyle={styles.handle}
      backgroundStyle={styles.background}
      onAnimate={handleAnimate}
    >
      <BottomSheetScrollView
        ref={scrollRef as never}
        contentContainerStyle={styles.scrollContent}
      >
        {/* 솔리드 결과 헤더 */}
        <View
          style={[
            styles.resultHeader,
            { backgroundColor: isCorrect ? Colors.status.correct : Colors.status.wrong },
          ]}
        >
          <View style={styles.resultIcon}>
            <Ionicons name={isCorrect ? 'checkmark' : 'close'} size={26} color="#FFFFFF" />
          </View>
          <Text style={styles.resultTitle}>{isCorrect ? '정답입니다!' : '오답입니다'}</Text>
        </View>

        {/* 정답 · 내 선택 칩 */}
        <View style={styles.answerRow}>
          <View style={[styles.answerChip, styles.answerChipCorrect]}>
            <Text style={styles.answerChipLabel}>정답</Text>
            <Text style={styles.answerChipValue}>{correctLabel}</Text>
          </View>
          {!isCorrect && selectedLabel && (
            <View style={[styles.answerChip, styles.answerChipWrong]}>
              <Text style={styles.answerChipLabel}>내 선택</Text>
              <Text style={styles.answerChipValue}>{selectedLabel}</Text>
            </View>
          )}
        </View>

        {/* 해설 */}
        <View style={styles.explanationBox}>
          <Text style={styles.sectionLabel}>📖 해설</Text>
          <View style={styles.explanationCard}>
            <MarkdownViewer content={explanation} />
          </View>
        </View>

        {/* 다음 버튼 */}
        <NordButton
          label={nextLabel}
          onPress={onNext}
          fullWidth
          size="lg"
          style={styles.nextButton}
        />
      </BottomSheetScrollView>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  background: {
    backgroundColor: Colors.surface.sheet,
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    shadowColor: '#2E3440',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 10,
  },
  handle: {
    backgroundColor: Colors.border,
    width: 40,
    height: 4,
    borderRadius: Radius.full,
  },
  scrollContent: {
    padding: Spacing.base,
    paddingBottom: Spacing.xxxl,
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.base,
    marginHorizontal: -Spacing.base,
    marginTop: -Spacing.xs,
    marginBottom: Spacing.base,
  },
  resultIcon: {
    width: 44,
    height: 44,
    borderRadius: Radius.full,
    backgroundColor: 'rgba(255,255,255,0.22)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  resultTitle: {
    fontSize: Typography.size.xl,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  answerRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.base,
  },
  answerChip: {
    flex: 1,
    borderRadius: Radius.md,
    borderWidth: 1,
    padding: Spacing.sm + 2,
  },
  answerChipCorrect: {
    backgroundColor: Colors.status.correctBg,
    borderColor: Colors.status.correctBorder,
  },
  answerChipWrong: {
    backgroundColor: Colors.status.wrongBg,
    borderColor: Colors.status.wrongBorder,
  },
  answerChipLabel: {
    fontSize: Typography.size.xs,
    fontWeight: '700',
    color: Colors.text.secondary,
    textTransform: 'uppercase',
    marginBottom: 3,
  },
  answerChipValue: {
    fontSize: Typography.size.sm,
    fontWeight: '700',
    color: Colors.text.primary,
  },
  explanationCard: {
    backgroundColor: Colors.surface.card,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    padding: Spacing.base,
    ...Shadow.sm,
  },
  explanationBox: {
    marginBottom: Spacing.xl,
  },
  sectionLabel: {
    fontSize: Typography.size.sm,
    fontWeight: Typography.weight.semibold,
    color: Colors.text.secondary,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginBottom: Spacing.sm,
  },
  nextButton: {
    marginTop: Spacing.sm,
  },
});

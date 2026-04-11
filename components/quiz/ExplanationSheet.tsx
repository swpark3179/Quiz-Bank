import React, { useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import BottomSheet, {
  BottomSheetScrollView,
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
} from '@gorhom/bottom-sheet';
import { Colors, Typography, Spacing, Radius } from '@/lib/theme';
import { MarkdownViewer } from '../MarkdownViewer';
import { NordButton } from '../ui/NordButton';

interface ExplanationSheetProps {
  sheetRef: React.RefObject<BottomSheet>;
  isCorrect: boolean;
  correctLabel: string;   // 정답 보기 텍스트
  explanation: string;    // 마크다운 해설
  onNext: () => void;
  nextLabel?: string;
}

const snapPoints = ['60%', '90%'];

export function ExplanationSheet({
  sheetRef,
  isCorrect,
  correctLabel,
  explanation,
  onNext,
  nextLabel = '다음 문제',
}: ExplanationSheetProps) {
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

  return (
    <BottomSheet
      ref={sheetRef}
      index={-1}
      snapPoints={snapPoints}
      enablePanDownToClose={false}
      backdropComponent={renderBackdrop}
      handleIndicatorStyle={styles.handle}
      backgroundStyle={styles.background}
    >
      <BottomSheetScrollView contentContainerStyle={styles.scrollContent}>
        {/* 정답/오답 헤더 */}
        <View
          style={[
            styles.resultBanner,
            { backgroundColor: isCorrect ? Colors.status.correct + '18' : Colors.status.wrong + '15' },
          ]}
        >
          <Text style={styles.resultEmoji}>{isCorrect ? '🎉' : '😥'}</Text>
          <View>
            <Text
              style={[
                styles.resultTitle,
                { color: isCorrect ? Colors.status.correct : Colors.status.wrong },
              ]}
            >
              {isCorrect ? '정답입니다!' : '오답입니다'}
            </Text>
            <Text style={styles.resultAnswer}>정답: {correctLabel}</Text>
          </View>
        </View>

        {/* 해설 */}
        <View style={styles.explanationBox}>
          <Text style={styles.sectionLabel}>📖 해설</Text>
          <MarkdownViewer content={explanation} />
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
    backgroundColor: Colors.bg.primary,
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
  resultBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    borderRadius: Radius.md,
    padding: Spacing.base,
    marginBottom: Spacing.base,
  },
  resultEmoji: {
    fontSize: 32,
  },
  resultTitle: {
    fontSize: Typography.size.lg,
    fontWeight: Typography.weight.bold,
  },
  resultAnswer: {
    fontSize: Typography.size.sm,
    color: Colors.text.secondary,
    marginTop: 2,
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

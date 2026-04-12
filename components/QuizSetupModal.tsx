import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Modal from 'react-native-modal';
import { Colors, Typography, Spacing, Radius, Shadow } from '@/lib/theme';
import { NordButton } from './ui/NordButton';
import type { QuizFile } from '@/lib/firebase/categories';

export interface QuizSetupOptions {
  count: number | 'all';
  mode: 'immediate' | 'deferred';
  selectedFileIds: string[];
}

interface QuizSetupModalProps {
  visible: boolean;
  files: QuizFile[];         // 선택 가능한 파일 목록
  totalQuestions: number;    // 선택된 파일들의 총 문제 수
  isRandom: boolean;         // 무작위 모드 (파일 다중 선택 포함)
  preSelectedFileId?: string; // 단일 파일 선택 모드
  onConfirm: (options: QuizSetupOptions) => void;
  onClose: () => void;
}

const COUNT_OPTIONS = [5, 10, 15, 20, 30, 50] as const;

export function QuizSetupModal({
  visible,
  files,
  totalQuestions,
  isRandom,
  preSelectedFileId,
  onConfirm,
  onClose,
}: QuizSetupModalProps) {
  const [selectedCount, setSelectedCount] = useState<number | 'all'>(10);
  const [mode, setMode] = useState<'immediate' | 'deferred'>('deferred');
  const [selectedFileIds, setSelectedFileIds] = useState<string[]>(
    preSelectedFileId ? [preSelectedFileId] : []
  );

  // 무작위 모드: 선택된 파일들의 총 문제 수 합산
  const effectiveTotal = isRandom
    ? files
        .filter((f) => selectedFileIds.includes(f.id))
        .reduce((sum, f) => sum + f.questionCount, 0)
    : totalQuestions;

  const toggleFile = (fileId: string) => {
    setSelectedFileIds((prev) =>
      prev.includes(fileId) ? prev.filter((id) => id !== fileId) : [...prev, fileId]
    );
  };

  const handleConfirm = () => {
    const count = selectedCount === 'all' ? effectiveTotal : Math.min(selectedCount, effectiveTotal);
    onConfirm({
      count,
      mode,
      selectedFileIds: isRandom ? selectedFileIds : preSelectedFileId ? [preSelectedFileId] : [],
    });
  };

  const canConfirm = isRandom ? selectedFileIds.length > 0 : true;

  return (
    <Modal
      isVisible={visible}
      onBackdropPress={onClose}
      onBackButtonPress={onClose}
      backdropOpacity={0.45}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      style={styles.modal}
      avoidKeyboard
    >
      <View style={styles.container}>
        {/* 헤더 */}
        <View style={styles.header}>
          <Text style={styles.title}>퀴즈 설정</Text>
          <TouchableOpacity
            onPress={onClose}
            hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
            accessibilityRole="button"
            accessibilityLabel="닫기"
          >
            <Text style={styles.closeIcon}>✕</Text>
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* 무작위 모드: 파일 다중 선택 */}
          {isRandom && (
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>📁 문제 파일 선택 (1개 이상)</Text>
              {files.map((file) => {
                const isSelected = selectedFileIds.includes(file.id);
                return (
                  <TouchableOpacity
                    key={file.id}
                    style={[styles.fileChip, isSelected && styles.fileChipSelected]}
                    onPress={() => toggleFile(file.id)}
                    activeOpacity={0.8}
                  >
                    <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
                      {isSelected && <Text style={styles.checkMark}>✓</Text>}
                    </View>
                    <View style={styles.fileChipText}>
                      <Text style={[styles.fileName, isSelected && { color: Colors.accent.primary }]}>
                        {file.name}
                      </Text>
                      <Text style={styles.fileCount}>{file.questionCount}문제</Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}

          {/* 문제 수 선택 */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>🔢 문제 수</Text>
            <View style={styles.countGrid}>
              {COUNT_OPTIONS.filter((c) => c <= effectiveTotal).map((c) => (
                <TouchableOpacity
                  key={c}
                  style={[styles.countChip, selectedCount === c && styles.countChipSelected]}
                  onPress={() => setSelectedCount(c)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.countText, selectedCount === c && styles.countTextSelected]}>
                    {c}문제
                  </Text>
                </TouchableOpacity>
              ))}
              {effectiveTotal > 0 && (
                <TouchableOpacity
                  style={[styles.countChip, selectedCount === 'all' && styles.countChipSelected]}
                  onPress={() => setSelectedCount('all')}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.countText, selectedCount === 'all' && styles.countTextSelected]}>
                    전체 ({effectiveTotal})
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* 정답 확인 방식 */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>✅ 정답 확인 방식</Text>
            {(['deferred', 'immediate'] as const).map((m) => (
              <TouchableOpacity
                key={m}
                style={[styles.modeOption, mode === m && styles.modeOptionSelected]}
                onPress={() => setMode(m)}
                activeOpacity={0.8}
              >
                <View style={[styles.radio, mode === m && styles.radioSelected]}>
                  {mode === m && <View style={styles.radioDot} />}
                </View>
                <View>
                  <Text style={[styles.modeName, mode === m && { color: Colors.accent.primary }]}>
                    {m === 'deferred' ? '모두 풀고 나서 확인' : '문제마다 즉시 확인'}
                  </Text>
                  <Text style={styles.modeDesc}>
                    {m === 'deferred'
                      ? '전체 문제를 풀고 한번에 해설 확인'
                      : '각 문제 제출 후 바로 해설 표시'}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        {/* 시작 버튼 */}
        <NordButton
          label={canConfirm ? '퀴즈 시작' : '파일을 선택해주세요'}
          onPress={handleConfirm}
          disabled={!canConfirm || effectiveTotal === 0}
          fullWidth
          size="lg"
          style={styles.startButton}
        />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modal: {
    margin: 0,
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: Colors.bg.primary,
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    padding: Spacing.base,
    paddingBottom: Spacing.xxxl,
    maxHeight: '90%',
    ...Shadow.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.base,
    paddingBottom: Spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.divider,
  },
  title: {
    fontSize: Typography.size.lg,
    fontWeight: Typography.weight.bold,
    color: Colors.text.primary,
  },
  closeIcon: {
    fontSize: 18,
    color: Colors.text.secondary,
  },
  section: {
    marginBottom: Spacing.lg,
  },
  sectionLabel: {
    fontSize: Typography.size.sm,
    fontWeight: Typography.weight.semibold,
    color: Colors.text.secondary,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginBottom: Spacing.sm,
  },
  fileChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    padding: Spacing.sm + 2,
    borderRadius: Radius.sm,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.bg.secondary,
    marginBottom: Spacing.sm,
  },
  fileChipSelected: {
    borderColor: Colors.accent.primary,
    backgroundColor: Colors.choice.selected,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: Radius.xs,
    borderWidth: 2,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.bg.primary,
  },
  checkboxSelected: {
    borderColor: Colors.accent.primary,
    backgroundColor: Colors.accent.primary,
  },
  checkMark: {
    color: Colors.text.inverse,
    fontSize: 13,
    fontWeight: Typography.weight.bold,
  },
  fileChipText: {
    flex: 1,
  },
  fileName: {
    fontSize: Typography.size.base,
    color: Colors.text.primary,
    fontWeight: Typography.weight.medium,
  },
  fileCount: {
    fontSize: Typography.size.xs,
    color: Colors.text.secondary,
    marginTop: 1,
  },
  countGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  countChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.md,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.bg.secondary,
  },
  countChipSelected: {
    borderColor: Colors.accent.primary,
    backgroundColor: Colors.choice.selected,
  },
  countText: {
    fontSize: Typography.size.sm,
    fontWeight: Typography.weight.medium,
    color: Colors.text.secondary,
  },
  countTextSelected: {
    color: Colors.accent.primary,
    fontWeight: Typography.weight.bold,
  },
  modeOption: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
    padding: Spacing.md,
    borderRadius: Radius.md,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.bg.secondary,
    marginBottom: Spacing.sm,
  },
  modeOptionSelected: {
    borderColor: Colors.accent.primary,
    backgroundColor: Colors.choice.selected,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: Radius.full,
    borderWidth: 2,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
    flexShrink: 0,
  },
  radioSelected: {
    borderColor: Colors.accent.primary,
  },
  radioDot: {
    width: 8,
    height: 8,
    borderRadius: Radius.full,
    backgroundColor: Colors.accent.primary,
  },
  modeName: {
    fontSize: Typography.size.base,
    fontWeight: Typography.weight.semibold,
    color: Colors.text.primary,
    marginBottom: 2,
  },
  modeDesc: {
    fontSize: Typography.size.xs,
    color: Colors.text.secondary,
    lineHeight: Typography.size.xs * 1.5,
  },
  startButton: {
    marginTop: Spacing.sm,
  },
});

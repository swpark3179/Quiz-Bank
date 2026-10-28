import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Modal from 'react-native-modal';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Radius, Shadow } from '@/lib/theme';
import { NordButton } from './ui/NordButton';
import { NordSwitch } from './ui/NordSwitch';
import { BottomActionBar } from './ui/BottomActionBar';
import { SheetHandle, SheetHeader, sheetStyles } from './ui/SheetParts';
import type { QuizFile } from '@/lib/local/categories';
import { getPreference, setPreference } from '@/lib/local/preferences';
import { useVocabIndex } from '@/hooks/use-vocab-index';

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
  loading?: boolean;          // 문제를 준비하는 중 (시작 버튼 로딩, 닫기 잠금)
  onHidden?: () => void;      // 닫힘 애니메이션이 끝난 뒤 호출
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
  loading = false,
  onHidden,
}: QuizSetupModalProps) {
  const [selectedCount, setSelectedCount] = useState<number | 'all'>(10);
  const [mode, setMode] = useState<'immediate' | 'deferred'>('deferred');
  const [selectedFileIds, setSelectedFileIds] = useState<string[]>(
    preSelectedFileId ? [preSelectedFileId] : []
  );
  // 단어장 모드는 기기에 기억해 두고 퀴즈 화면이 같은 값으로 시작한다 (풀이 중 헤더에서도 바꿀 수 있다)
  const [vocabMode, setVocabMode] = useState(() => getPreference('vocabMode'));
  const vocabEntries = useVocabIndex();

  // 시트는 화면에 남아 있다가 다시 열리므로, 열 때마다 저장된 값을 다시 읽는다
  // (퀴즈 화면 헤더에서 바꾼 값을 반영)
  useEffect(() => {
    if (visible) setVocabMode(getPreference('vocabMode'));
  }, [visible]);

  const toggleVocabMode = () => {
    const next = !vocabMode;
    setVocabMode(next);
    setPreference('vocabMode', next);
  };

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

  // 문제 수: 칩은 항상 모두 보여 주고, 선택한 파일보다 큰 값만 비활성.
  // 고른 값이 지금 불가능하면(파일 변경 등) 가능한 가장 큰 값을 선택된 것으로 보여 주고 그대로 쓴다.
  const availableCounts: readonly number[] = COUNT_OPTIONS.filter((c) => c <= effectiveTotal);
  const resolvedCount: number | 'all' | null =
    effectiveTotal === 0
      ? null
      : selectedCount === 'all' || availableCounts.includes(selectedCount)
      ? selectedCount
      : availableCounts.length > 0
      ? availableCounts[availableCounts.length - 1]
      : 'all';

  const handleConfirm = () => {
    const count = resolvedCount === 'all' || resolvedCount === null ? effectiveTotal : resolvedCount;
    onConfirm({
      count,
      mode,
      selectedFileIds: isRandom ? selectedFileIds : preSelectedFileId ? [preSelectedFileId] : [],
    });
  };

  const canConfirm = isRandom ? selectedFileIds.length > 0 : true;

  // 문제를 준비하는 동안에는 닫지 않는다 (준비가 끝나면 부모가 닫고 퀴즈로 이동)
  const handleClose = () => {
    if (!loading) onClose();
  };

  return (
    <Modal
      isVisible={visible}
      onBackdropPress={handleClose}
      onBackButtonPress={handleClose}
      onModalHide={onHidden}
      // 해설 시트처럼 끌어내려 닫을 수 있다 (준비 중에는 잠금)
      swipeDirection={loading ? undefined : 'down'}
      onSwipeComplete={handleClose}
      propagateSwipe
      backdropOpacity={0.4}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      style={styles.modal}
      avoidKeyboard
    >
      <View style={[sheetStyles.background, styles.container]}>
        <SheetHandle />
        <SheetHeader title="퀴즈 설정" onClose={handleClose} closeDisabled={loading} />

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {/* 무작위 모드: 파일 다중 선택 */}
          {isRandom && (
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>문제 파일 선택 (1개 이상)</Text>
              {files.map((file) => {
                const isSelected = selectedFileIds.includes(file.id);
                return (
                  <TouchableOpacity
                    key={file.id}
                    style={[styles.fileChip, isSelected && styles.fileChipSelected]}
                    onPress={() => toggleFile(file.id)}
                    activeOpacity={0.8}
                    accessibilityRole="checkbox"
                    accessibilityState={{ checked: isSelected }}
                    accessibilityLabel={`${file.name}, ${file.questionCount}문제`}
                  >
                    <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
                      {isSelected && <Ionicons name="checkmark" size={15} color={Colors.text.inverse} />}
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
            <Text style={styles.sectionLabel}>문제 수</Text>
            <View style={styles.countGrid}>
              {COUNT_OPTIONS.map((c) => {
                const unavailable = c > effectiveTotal;
                const checked = resolvedCount === c;
                return (
                  <TouchableOpacity
                    key={c}
                    disabled={unavailable}
                    style={[
                      styles.countChip,
                      checked && styles.countChipSelected,
                      unavailable && styles.countChipDisabled,
                    ]}
                    onPress={() => setSelectedCount(c)}
                    activeOpacity={0.8}
                    accessibilityRole="radio"
                    accessibilityState={{ checked, disabled: unavailable }}
                    accessibilityLabel={`${c}문제`}
                  >
                    <Text
                      style={[
                        styles.countText,
                        checked && styles.countTextSelected,
                        unavailable && styles.countTextDisabled,
                      ]}
                    >
                      {c}문제
                    </Text>
                  </TouchableOpacity>
                );
              })}
              <TouchableOpacity
                disabled={effectiveTotal === 0}
                style={[
                  styles.countChip,
                  resolvedCount === 'all' && styles.countChipSelected,
                  effectiveTotal === 0 && styles.countChipDisabled,
                ]}
                onPress={() => setSelectedCount('all')}
                activeOpacity={0.8}
                accessibilityRole="radio"
                accessibilityState={{ checked: resolvedCount === 'all', disabled: effectiveTotal === 0 }}
                accessibilityLabel={effectiveTotal > 0 ? `전체 (${effectiveTotal})` : '전체'}
              >
                <Text
                  style={[
                    styles.countText,
                    resolvedCount === 'all' && styles.countTextSelected,
                    effectiveTotal === 0 && styles.countTextDisabled,
                  ]}
                >
                  {effectiveTotal > 0 ? `전체 (${effectiveTotal})` : '전체'}
                </Text>
              </TouchableOpacity>
            </View>
            {effectiveTotal === 0 && (
              <Text style={styles.countHint}>파일을 고르면 문제 수를 정할 수 있어요</Text>
            )}
          </View>

          {/* 정답 확인 방식 */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>정답 확인 방식</Text>
            {(['deferred', 'immediate'] as const).map((m) => (
              <TouchableOpacity
                key={m}
                style={[styles.modeOption, mode === m && styles.modeOptionSelected]}
                onPress={() => setMode(m)}
                activeOpacity={0.8}
                accessibilityRole="radio"
                accessibilityState={{ checked: mode === m }}
                accessibilityLabel={m === 'deferred' ? '모두 풀고 나서 확인, 전체 문제를 풀고 한번에 해설 확인' : '문제마다 즉시 확인, 각 문제 제출 후 바로 해설 표시'}
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

          {/* 단어장 모드 — 등록된 단어가 하나도 없으면 감춘다 */}
          {vocabEntries?.length !== 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>풀이 도우미</Text>
              <TouchableOpacity
                style={[styles.modeOption, styles.vocabOption, vocabMode && styles.modeOptionSelected]}
                onPress={toggleVocabMode}
                activeOpacity={0.8}
                accessibilityRole="switch"
                accessibilityState={{ checked: vocabMode }}
                accessibilityLabel="단어장 모드, 문제 속 등록된 영어 단어를 눌러 뜻 보기"
              >
                <View style={[styles.vocabIcon, vocabMode && styles.vocabIconOn]}>
                  <Ionicons
                    name={vocabMode ? 'book' : 'book-outline'}
                    size={18}
                    color={vocabMode ? Colors.text.inverse : Colors.accent.primary}
                  />
                </View>
                <View style={styles.vocabText}>
                  <View style={styles.vocabTitleRow}>
                    <Text style={[styles.modeName, styles.vocabName, vocabMode && { color: Colors.accent.primary }]}>
                      단어장 모드
                    </Text>
                    {vocabEntries && (
                      <View style={styles.vocabCount}>
                        <Text style={styles.vocabCountText}>{vocabEntries.length}단어</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.modeDesc}>등록된 단어를 누르면 뜻을 보여 줘요</Text>
                </View>
                <NordSwitch value={vocabMode} />
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>

        {/* 시작 버튼 — 목록이 길어도 항상 보이도록 하단 고정 */}
        <BottomActionBar>
          <NordButton
            label={canConfirm ? '퀴즈 시작' : '파일을 선택해주세요'}
            onPress={handleConfirm}
            disabled={!canConfirm || effectiveTotal === 0}
            loading={loading}
            size="lg"
            style={styles.startButton}
          />
        </BottomActionBar>
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
    maxHeight: '90%',
    overflow: 'hidden',
    ...Shadow.lg,
  },
  scrollContent: {
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.sm,
  },
  section: {
    marginBottom: Spacing.lg,
  },
  sectionLabel: {
    fontSize: Typography.size.sm,
    fontWeight: Typography.weight.semibold,
    color: Colors.text.secondary,
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
    backgroundColor: Colors.surface.card,
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
    backgroundColor: Colors.surface.card,
  },
  checkboxSelected: {
    borderColor: Colors.accent.primary,
    backgroundColor: Colors.accent.primary,
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
    backgroundColor: Colors.surface.card,
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
  // 선택한 파일의 문제 수보다 큰 값
  countChipDisabled: {
    borderStyle: 'dashed',
    backgroundColor: 'transparent',
  },
  countTextDisabled: {
    color: '#7B8597',
  },
  countHint: {
    marginTop: Spacing.sm,
    fontSize: Typography.size.sm,
    color: Colors.text.secondary,
  },
  modeOption: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
    padding: Spacing.md,
    borderRadius: Radius.md,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.surface.card,
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
  vocabOption: {
    alignItems: 'center',
    gap: Spacing.md,
  },
  vocabIcon: {
    width: 36,
    height: 36,
    borderRadius: Radius.sm,
    backgroundColor: Colors.choice.selected,
    alignItems: 'center',
    justifyContent: 'center',
  },
  vocabIconOn: {
    backgroundColor: Colors.accent.primary,
  },
  vocabText: {
    flex: 1,
  },
  vocabTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs + 2,
    marginBottom: 2,
  },
  vocabName: {
    marginBottom: 0,
  },
  vocabCount: {
    backgroundColor: Colors.bg.secondary,
    borderRadius: Radius.xs,
    paddingHorizontal: 6,
    paddingVertical: 1,
  },
  vocabCountText: {
    fontSize: Typography.size.xs,
    fontWeight: Typography.weight.semibold,
    color: Colors.text.secondary,
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
    flex: 1,
    borderRadius: Radius.lg,
  },
});

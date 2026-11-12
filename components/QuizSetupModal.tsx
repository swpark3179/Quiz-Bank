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
import { useWordAppLexicon } from '@/hooks/use-word-app-lexicon';
import { resolveVocabSource, type VocabSource } from '@/lib/vocab/wordApp';

export interface QuizSetupOptions {
  count: number | 'all';
  mode: 'immediate' | 'deferred';
  selectedFileIds: string[];
  /** 한 번도 풀지 않은 문제에서만 출제 */
  unseenOnly: boolean;
}

interface QuizSetupModalProps {
  visible: boolean;
  files: QuizFile[];         // 선택 가능한 파일 목록
  totalQuestions: number;    // 선택된 파일들의 총 문제 수
  isRandom: boolean;         // 무작위 모드 (파일 다중 선택 포함)
  preSelectedFileId?: string; // 단일 파일 선택 모드
  /** 파일 id → 안 푼 문제 수. null 이면 풀이 기록을 아직 못 읽었다 ('안 푼 문제만' 잠금) */
  unseenCounts?: Record<string, number> | null;
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
  unseenCounts = null,
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
  // 단어장 모드의 단어 출처 — 단어장 앱(Quiz Word)이 있을 때만 고를 수 있다 (없으면 이 선택지 자체가 안 보인다)
  const [vocabSource, setVocabSource] = useState<VocabSource>(() => getPreference('vocabSource'));
  const wordAppLexicon = useWordAppLexicon();
  const bankVocabAvailable = vocabEntries?.length !== 0;
  const wordAppAvailable = !!wordAppLexicon;
  const activeVocabSource = resolveVocabSource(vocabSource, { bank: bankVocabAvailable, wordApp: wordAppAvailable });
  const vocabCount = activeVocabSource === 'wordApp' ? wordAppLexicon?.words.length : vocabEntries?.length;
  // '안 푼 문제만'도 기기에 기억해 두고 다음 설정에 그대로 쓴다
  const [unseenOnly, setUnseenOnly] = useState(() => getPreference('unseenOnly'));

  // 시트는 화면에 남아 있다가 다시 열리므로, 열 때마다 저장된 값을 다시 읽는다
  // (퀴즈 화면 헤더에서 바꾼 값을 반영)
  useEffect(() => {
    if (!visible) return;
    setVocabMode(getPreference('vocabMode'));
    setVocabSource(getPreference('vocabSource'));
    setUnseenOnly(getPreference('unseenOnly'));
  }, [visible]);

  const toggleVocabMode = () => {
    const next = !vocabMode;
    setVocabMode(next);
    setPreference('vocabMode', next);
  };

  const chooseVocabSource = (next: VocabSource) => {
    setVocabSource(next);
    setPreference('vocabSource', next);
  };

  const toggleUnseenOnly = () => {
    const next = !unseenOnly;
    setUnseenOnly(next);
    setPreference('unseenOnly', next);
  };

  const chosenFiles = isRandom ? files.filter((f) => selectedFileIds.includes(f.id)) : [];
  const hasSelection = isRandom ? chosenFiles.length > 0 : true;

  // 선택한 파일들의 전체 / 안 푼 문제 수
  const allTotal = isRandom
    ? chosenFiles.reduce((sum, f) => sum + f.questionCount, 0)
    : totalQuestions;
  const unseenTotal =
    unseenCounts === null
      ? null
      : isRandom
      ? chosenFiles.reduce((sum, f) => sum + (unseenCounts[f.id] ?? f.questionCount), 0)
      : preSelectedFileId
      ? unseenCounts[preSelectedFileId] ?? totalQuestions
      : 0;

  // 풀이 기록을 읽은 뒤에만 '안 푼 문제만'을 적용한다
  const useUnseen = unseenOnly && unseenTotal !== null;
  const effectiveTotal = useUnseen ? unseenTotal! : allTotal;

  const unseenBadge =
    unseenTotal !== null && hasSelection ? `안 푼 문제 ${unseenTotal}` : null;
  const unseenDesc =
    unseenTotal === 0 && hasSelection
      ? '선택한 문제를 모두 한 번 이상 풀었어요'
      : '한 번도 풀지 않은 문제에서만 출제해요';

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
    onConfirm({
      // '전체'는 그대로 넘겨 실제로 남은 문제를 모두 낸다
      // (안 푼 문제 수는 파일을 열지 않고 센 추정치라 숫자로 바꾸면 모자랄 수 있다)
      count: resolvedCount ?? 'all',
      mode,
      selectedFileIds: isRandom ? selectedFileIds : preSelectedFileId ? [preSelectedFileId] : [],
      unseenOnly: useUnseen,
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
                const countLabel = useUnseen
                  ? `안 푼 문제 ${unseenCounts?.[file.id] ?? file.questionCount} / ${file.questionCount}`
                  : `${file.questionCount}문제`;
                return (
                  <TouchableOpacity
                    key={file.id}
                    style={[styles.fileChip, isSelected && styles.fileChipSelected]}
                    onPress={() => toggleFile(file.id)}
                    activeOpacity={0.8}
                    accessibilityRole="checkbox"
                    accessibilityState={{ checked: isSelected }}
                    accessibilityLabel={`${file.name}, ${countLabel}`}
                  >
                    <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
                      {isSelected && <Ionicons name="checkmark" size={15} color={Colors.text.inverse} />}
                    </View>
                    <View style={styles.fileChipText}>
                      <Text style={[styles.fileName, isSelected && { color: Colors.accent.primary }]}>
                        {file.name}
                      </Text>
                      <Text style={styles.fileCount}>{countLabel}</Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}

          {/* 출제 범위: 한 번도 풀지 않은 문제만 — 켜면 아래 문제 수가 안 푼 문제 수에 맞춰진다 */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>출제 범위</Text>
            <TouchableOpacity
              disabled={unseenTotal === null}
              style={[
                styles.modeOption,
                styles.toggleOption,
                unseenOnly && styles.modeOptionSelected,
                unseenTotal === null && styles.toggleOptionDisabled,
              ]}
              onPress={toggleUnseenOnly}
              activeOpacity={0.8}
              accessibilityRole="switch"
              accessibilityState={{ checked: unseenOnly, disabled: unseenTotal === null }}
              accessibilityLabel={`안 푼 문제만, ${unseenDesc}${unseenBadge ? `, ${unseenBadge}` : ''}`}
            >
              <View style={[styles.toggleIcon, unseenOnly && styles.toggleIconOn]}>
                <Ionicons
                  name={unseenOnly ? 'sparkles' : 'sparkles-outline'}
                  size={18}
                  color={unseenOnly ? Colors.text.inverse : Colors.accent.primary}
                />
              </View>
              <View style={styles.toggleText}>
                <View style={styles.toggleTitleRow}>
                  <Text style={[styles.modeName, styles.toggleName, unseenOnly && { color: Colors.accent.primary }]}>
                    안 푼 문제만
                  </Text>
                  {unseenBadge && (
                    <View style={styles.toggleCount}>
                      <Text style={styles.toggleCountText}>{unseenBadge}</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.modeDesc}>{unseenDesc}</Text>
              </View>
              <NordSwitch value={unseenOnly} />
            </TouchableOpacity>
          </View>

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
              <Text style={styles.countHint}>
                {useUnseen && hasSelection
                  ? "안 푼 문제가 없어요. '안 푼 문제만'을 끄면 전체 문제에서 출제해요"
                  : '파일을 고르면 문제 수를 정할 수 있어요'}
              </Text>
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

          {/* 단어장 모드 — 이 앱 단어장과 단어장 앱 둘 다 단어가 없으면 감춘다 */}
          {(bankVocabAvailable || wordAppAvailable) && (
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>풀이 도우미</Text>
              <TouchableOpacity
                style={[styles.modeOption, styles.toggleOption, vocabMode && styles.modeOptionSelected]}
                onPress={toggleVocabMode}
                activeOpacity={0.8}
                accessibilityRole="switch"
                accessibilityState={{ checked: vocabMode }}
                accessibilityLabel="단어장 모드, 문제 속 등록된 영어 단어를 눌러 뜻 보기"
              >
                <View style={[styles.toggleIcon, vocabMode && styles.toggleIconOn]}>
                  <Ionicons
                    name={vocabMode ? 'book' : 'book-outline'}
                    size={18}
                    color={vocabMode ? Colors.text.inverse : Colors.accent.primary}
                  />
                </View>
                <View style={styles.toggleText}>
                  <View style={styles.toggleTitleRow}>
                    <Text style={[styles.modeName, styles.toggleName, vocabMode && { color: Colors.accent.primary }]}>
                      단어장 모드
                    </Text>
                    {vocabCount !== undefined && (
                      <View style={styles.toggleCount}>
                        <Text style={styles.toggleCountText}>{vocabCount}단어</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.modeDesc}>
                    {activeVocabSource === 'wordApp'
                      ? '단어장 앱에 등록된 단어를 누르면 뜻을 보여 줘요'
                      : '등록된 단어를 누르면 뜻을 보여 줘요'}
                  </Text>
                </View>
                <NordSwitch value={vocabMode} />
              </TouchableOpacity>

              {/* 단어 출처 — 단어장 앱이 있고 이 앱 단어장에도 단어가 있을 때만 고른다 */}
              {vocabMode && bankVocabAvailable && wordAppAvailable && (
                <View style={styles.sourceOptions}>
                  {(['bank', 'wordApp'] as const).map((src) => {
                    const selected = activeVocabSource === src;
                    const name = src === 'bank' ? '문제은행 단어장' : '단어장 앱';
                    const desc =
                      src === 'bank'
                        ? '이 앱에 등록한 단어와 자세한 설명'
                        : '단어장 앱에 등록된 단어 중 문제에 나온 것 · 자세히는 단어장 앱에서';
                    return (
                      <TouchableOpacity
                        key={src}
                        style={[styles.modeOption, selected && styles.modeOptionSelected]}
                        onPress={() => chooseVocabSource(src)}
                        activeOpacity={0.8}
                        accessibilityRole="radio"
                        accessibilityState={{ checked: selected }}
                        accessibilityLabel={`${name}, ${desc}`}
                      >
                        <View style={[styles.radio, selected && styles.radioSelected]}>
                          {selected && <View style={styles.radioDot} />}
                        </View>
                        <View style={styles.toggleText}>
                          <Text style={[styles.modeName, selected && { color: Colors.accent.primary }]}>{name}</Text>
                          <Text style={styles.modeDesc}>{desc}</Text>
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              )}
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
  // 단어장 모드의 단어 출처 (문제은행 단어장 / 단어장 앱) — 스위치 아래 라디오 두 개
  sourceOptions: {
    // 단어장 모드에 딸린 선택이라 살짝 들여 쓴다
    paddingLeft: Spacing.lg,
  },
  // 단어장 모드·안 푼 문제만 — 아이콘 + 제목·설명 + 스위치 한 줄
  toggleOption: {
    alignItems: 'center',
    gap: Spacing.md,
  },
  toggleOptionDisabled: {
    opacity: 0.5,
  },
  toggleIcon: {
    width: 36,
    height: 36,
    borderRadius: Radius.sm,
    backgroundColor: Colors.choice.selected,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleIconOn: {
    backgroundColor: Colors.accent.primary,
  },
  toggleText: {
    flex: 1,
  },
  toggleTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs + 2,
    marginBottom: 2,
  },
  toggleName: {
    marginBottom: 0,
  },
  toggleCount: {
    backgroundColor: Colors.bg.secondary,
    borderRadius: Radius.xs,
    paddingHorizontal: 6,
    paddingVertical: 1,
  },
  toggleCountText: {
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

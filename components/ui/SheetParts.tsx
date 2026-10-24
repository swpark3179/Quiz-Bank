import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Radius } from '@/lib/theme';

/**
 * 바텀시트 공용 모양 — 퀴즈 설정(react-native-modal)과 해설(@gorhom/bottom-sheet)이
 * 같은 배경·라운드·핸들·제목 행을 쓰도록 한 곳에 모은다.
 */
export const sheetStyles = StyleSheet.create({
  background: {
    backgroundColor: Colors.surface.sheet,
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
  },
  handleIndicator: {
    backgroundColor: Colors.borderStrong,
    width: 40,
    height: 4,
    borderRadius: Radius.full,
  },
});

/** 시트 상단 손잡이 (@gorhom 은 자체 핸들을 쓰고 handleIndicator 스타일만 공유) */
export function SheetHandle() {
  return (
    <View style={styles.handleArea}>
      <View style={sheetStyles.handleIndicator} />
    </View>
  );
}

interface SheetHeaderProps {
  title: string;
  onClose: () => void;
  closeDisabled?: boolean;
}

/** 시트 제목 행: 제목 + 44px 닫기 버튼 */
export function SheetHeader({ title, onClose, closeDisabled }: SheetHeaderProps) {
  return (
    <View style={styles.header}>
      <Text style={styles.title}>{title}</Text>
      <TouchableOpacity
        onPress={onClose}
        disabled={closeDisabled}
        style={[styles.closeButton, closeDisabled && styles.closeDisabled]}
        accessibilityRole="button"
        accessibilityLabel="닫기"
      >
        <Ionicons name="close" size={22} color={Colors.text.secondary} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  handleArea: {
    alignItems: 'center',
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.xs,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: Spacing.lg,
    paddingRight: Spacing.xs,
  },
  title: {
    fontSize: Typography.size.lg,
    fontWeight: Typography.weight.bold,
    color: Colors.text.primary,
  },
  closeButton: {
    width: 44,
    height: 44,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeDisabled: {
    opacity: 0.4,
  },
});

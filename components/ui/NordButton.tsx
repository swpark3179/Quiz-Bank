import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  TouchableOpacityProps,
} from 'react-native';
import { Colors, Typography, Spacing, Radius } from '@/lib/theme';
import { LoadingDots } from './LoadingDots';

// tonal: 옅은 파랑 채움 — 화면 안의 보조 액션(통계 보기, 해설 등)
type Variant = 'primary' | 'secondary' | 'tonal' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

interface NordButtonProps extends TouchableOpacityProps {
  label: string;
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  /** 로딩 중 라벨 대신 보여 줄 문구 (예: '문제 불러오는 중'). 없으면 움직이는 점만 보인다 */
  loadingLabel?: string;
  fullWidth?: boolean;
  icon?: React.ReactNode;
}

const variantStyles: Record<Variant, { container: ViewStyle; text: TextStyle }> = {
  primary: {
    container: {
      backgroundColor: Colors.accent.primary,
    },
    text: {
      color: Colors.text.inverse,
      fontWeight: Typography.weight.semibold,
    },
  },
  // 흰 배경 + 중립 테두리 (회색 채움은 앱 배경 위에서 탁해 보였다)
  secondary: {
    container: {
      backgroundColor: Colors.surface.card,
      borderWidth: 1.5,
      borderColor: Colors.border,
    },
    text: {
      color: Colors.accent.deep,
      fontWeight: Typography.weight.semibold,
    },
  },
  tonal: {
    container: {
      backgroundColor: Colors.choice.selected,
    },
    text: {
      color: Colors.accent.deep,
      fontWeight: Typography.weight.semibold,
    },
  },
  // 앱 배경(#DCE3ED) 위 글자 대비를 위해 accent.deep 사용 (accent.primary 는 4.0:1)
  ghost: {
    container: {
      backgroundColor: 'transparent',
    },
    text: {
      color: Colors.accent.deep,
      fontWeight: Typography.weight.semibold,
    },
  },
  danger: {
    container: {
      backgroundColor: Colors.status.wrong,
    },
    text: {
      color: Colors.text.inverse,
      fontWeight: Typography.weight.semibold,
    },
  },
};

// 높이는 minHeight 로 보장한다: sm 36 (+ hitSlop 4 → 터치 44) / md 44 / lg 52
const sizeStyles: Record<Size, { container: ViewStyle; text: TextStyle }> = {
  sm: {
    container: {
      minHeight: 36,
      paddingVertical: Spacing.xs + 2,
      paddingHorizontal: Spacing.md,
      borderRadius: Radius.sm,
    },
    text: { fontSize: Typography.size.sm },
  },
  md: {
    container: {
      minHeight: 44,
      paddingVertical: Spacing.sm + 2,
      paddingHorizontal: Spacing.base,
      borderRadius: Radius.md,
    },
    text: { fontSize: Typography.size.base },
  },
  lg: {
    container: {
      minHeight: 52,
      paddingVertical: Spacing.md,
      paddingHorizontal: Spacing.xl,
      borderRadius: Radius.md,
    },
    text: { fontSize: Typography.size.md },
  },
};

const SM_HIT_SLOP = { top: 4, bottom: 4, left: 4, right: 4 };

export function NordButton({
  label,
  variant = 'primary',
  size = 'md',
  loading = false,
  loadingLabel,
  fullWidth = false,
  icon,
  disabled,
  style,
  hitSlop,
  ...rest
}: NordButtonProps) {
  const v = variantStyles[variant];
  const s = sizeStyles[size];
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      activeOpacity={0.75}
      disabled={isDisabled}
      hitSlop={hitSlop ?? (size === 'sm' ? SM_HIT_SLOP : undefined)}
      accessibilityRole="button"
      accessibilityLabel={loading && loadingLabel ? loadingLabel : label}
      accessibilityState={{ disabled: !!isDisabled, busy: !!loading }}
      style={[
        styles.base,
        v.container,
        s.container,
        fullWidth && styles.fullWidth,
        // 로딩은 '눌러도 안 되는 버튼'이 아니라 '처리 중'이므로 흐리게 하지 않는다
        disabled && !loading && styles.disabled,
        style,
      ]}
      {...rest}
    >
      {loading ? (
        <>
          {loadingLabel ? (
            <Text style={[styles.label, v.text, s.text]}>{loadingLabel}</Text>
          ) : null}
          <LoadingDots
            color={v.text.color as string}
            style={loadingLabel ? styles.loadingDots : undefined}
          />
        </>
      ) : (
        <>
          {icon}
          <Text style={[styles.label, v.text, s.text, icon ? { marginLeft: Spacing.xs } : undefined]}>
            {label}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
  },
  fullWidth: {
    width: '100%',
  },
  disabled: {
    opacity: 0.5,
  },
  label: {
    letterSpacing: 0.2,
  },
  // 글자 뒤에 붙는 점: 글자 기준선에 맞춰 살짝 띄운다
  loadingDots: {
    marginLeft: 2,
    marginTop: 2,
  },
});

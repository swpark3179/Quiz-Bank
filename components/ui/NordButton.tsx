import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  TouchableOpacityProps,
} from 'react-native';
import { Colors, Typography, Spacing, Radius } from '@/lib/theme';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

interface NordButtonProps extends TouchableOpacityProps {
  label: string;
  variant?: Variant;
  size?: Size;
  loading?: boolean;
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
  secondary: {
    container: {
      backgroundColor: Colors.bg.secondary,
      borderWidth: 1.5,
      borderColor: Colors.accent.primary,
    },
    text: {
      color: Colors.accent.primary,
      fontWeight: Typography.weight.semibold,
    },
  },
  ghost: {
    container: {
      backgroundColor: 'transparent',
    },
    text: {
      color: Colors.accent.primary,
      fontWeight: Typography.weight.medium,
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

const sizeStyles: Record<Size, { container: ViewStyle; text: TextStyle }> = {
  sm: {
    container: {
      paddingVertical: Spacing.xs + 2,
      paddingHorizontal: Spacing.md,
      borderRadius: Radius.sm,
    },
    text: { fontSize: Typography.size.sm },
  },
  md: {
    container: {
      paddingVertical: Spacing.sm + 2,
      paddingHorizontal: Spacing.base,
      borderRadius: Radius.md,
    },
    text: { fontSize: Typography.size.base },
  },
  lg: {
    container: {
      paddingVertical: Spacing.md,
      paddingHorizontal: Spacing.xl,
      borderRadius: Radius.md,
    },
    text: { fontSize: Typography.size.md },
  },
};

export function NordButton({
  label,
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  icon,
  disabled,
  style,
  ...rest
}: NordButtonProps) {
  const v = variantStyles[variant];
  const s = sizeStyles[size];
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      activeOpacity={0.75}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: !!isDisabled, busy: !!loading }}
      style={[
        styles.base,
        v.container,
        s.container,
        fullWidth && styles.fullWidth,
        isDisabled && styles.disabled,
        style,
      ]}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'primary' || variant === 'danger' ? Colors.text.inverse : Colors.accent.primary}
        />
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
});

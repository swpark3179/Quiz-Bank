import React from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TouchableOpacityProps,
} from 'react-native';
import { Colors, Typography, Spacing, Radius, Shadow } from '@/lib/theme';

interface NordCardProps extends TouchableOpacityProps {
  children: React.ReactNode;
  style?: ViewStyle;
  pressable?: boolean;
  subtitle?: string;
  title?: string;
  badge?: string;
  badgeColor?: string;
}

export function NordCard({
  children,
  style,
  pressable = false,
  title,
  subtitle,
  badge,
  badgeColor = Colors.accent.primary,
  ...rest
}: NordCardProps) {
  const content = (
    <View style={[styles.card, style]}>
      {(title || badge) && (
        <View style={styles.header}>
          {title && <Text style={styles.title}>{title}</Text>}
          {badge && (
            <View style={[styles.badge, { backgroundColor: badgeColor + '22' }]}>
              <Text style={[styles.badgeText, { color: badgeColor }]}>{badge}</Text>
            </View>
          )}
        </View>
      )}
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      {children}
    </View>
  );

  if (pressable) {
    return (
      <TouchableOpacity activeOpacity={0.82} {...rest}>
        {content}
      </TouchableOpacity>
    );
  }

  return <View style={rest.style}>{content}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    borderRadius: Radius.md,
    padding: Spacing.base,
    borderWidth: 1,
    borderColor: Colors.border + '60',
    ...Shadow.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.xs,
  },
  title: {
    fontSize: Typography.size.md,
    fontWeight: Typography.weight.semibold,
    color: Colors.text.primary,
    flex: 1,
  },
  subtitle: {
    fontSize: Typography.size.sm,
    color: Colors.text.secondary,
    marginBottom: Spacing.sm,
  },
  badge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: Radius.full,
    marginLeft: Spacing.sm,
  },
  badgeText: {
    fontSize: Typography.size.xs,
    fontWeight: Typography.weight.bold,
    letterSpacing: 0.3,
  },
});

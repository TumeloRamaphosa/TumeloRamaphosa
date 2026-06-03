import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import { palette, radius, shadow, spacing, typography } from '@/constants/theme';

/* ---------------------------------- Text ---------------------------------- */

type AppTextProps = {
  children: React.ReactNode;
  variant?: keyof typeof typography;
  color?: string;
  style?: TextStyle | TextStyle[];
  numberOfLines?: number;
};

export function AppText({
  children,
  variant = 'body',
  color = palette.text,
  style,
  numberOfLines,
}: AppTextProps) {
  return (
    <Text
      numberOfLines={numberOfLines}
      style={[typography[variant], { color }, style as TextStyle]}
    >
      {children}
    </Text>
  );
}

/* --------------------------------- Button --------------------------------- */

type ButtonProps = {
  title: string;
  onPress?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
};

export function Button({
  title,
  onPress,
  variant = 'primary',
  disabled,
  loading,
  style,
}: ButtonProps) {
  const isPrimary = variant === 'primary';
  const isDanger = variant === 'danger';
  const isGhost = variant === 'ghost';

  const bg = isPrimary
    ? palette.gold
    : isDanger
      ? palette.danger
      : isGhost
        ? 'transparent'
        : palette.surfaceAlt;

  const fg = isPrimary ? palette.black : isGhost ? palette.gold : palette.text;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: bg, opacity: disabled ? 0.5 : pressed ? 0.85 : 1 },
        isGhost && styles.ghostBorder,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={fg} />
      ) : (
        <Text style={[typography.h3, { color: fg }]}>{title}</Text>
      )}
    </Pressable>
  );
}

/* ---------------------------------- Card ---------------------------------- */

export function Card({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: ViewStyle;
}) {
  return <View style={[styles.card, style]}>{children}</View>;
}

/* --------------------------------- Badge ---------------------------------- */

export function Badge({
  label,
  tone = 'gold',
}: {
  label: string;
  tone?: 'gold' | 'success' | 'info' | 'warning' | 'muted';
}) {
  const map: Record<string, { bg: string; fg: string }> = {
    gold: { bg: palette.goldMuted, fg: palette.gold },
    success: { bg: 'rgba(63,208,140,0.15)', fg: palette.success },
    info: { bg: 'rgba(91,141,239,0.15)', fg: palette.info },
    warning: { bg: 'rgba(242,181,68,0.15)', fg: palette.warning },
    muted: { bg: palette.surfaceAlt, fg: palette.textMuted },
  };
  const c = map[tone];
  return (
    <View style={[styles.badge, { backgroundColor: c.bg }]}>
      <Text style={[typography.label, { color: c.fg }]}>{label}</Text>
    </View>
  );
}

/* --------------------------------- Divider -------------------------------- */

export function Divider({ style }: { style?: ViewStyle }) {
  return <View style={[styles.divider, style]} />;
}

/* ---------------------------------- Row ----------------------------------- */

export function Row({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: ViewStyle;
}) {
  return <View style={[styles.row, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  button: {
    height: 54,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  ghostBorder: {
    borderWidth: 1,
    borderColor: palette.gold,
  },
  card: {
    backgroundColor: palette.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: palette.border,
    ...shadow.card,
  },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.pill,
  },
  divider: {
    height: 1,
    backgroundColor: palette.border,
    marginVertical: spacing.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

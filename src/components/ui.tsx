import type { ReactNode } from 'react';
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type TextStyle,
} from 'react-native';

import { colors, displayFont, radii, sizes, spacing } from '@/theme';

type ButtonVariant = 'primary' | 'secondary' | 'gold' | 'dark';

type AppButtonProps = {
  accessibilityHint?: string;
  disabled?: boolean;
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
};

export function AppButton({
  accessibilityHint,
  disabled = false,
  label,
  onPress,
  variant = 'primary',
}: AppButtonProps) {
  return (
    <Pressable
      accessibilityHint={accessibilityHint}
      accessibilityLabel={label}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        buttonStyles[variant],
        disabled && styles.disabled,
        pressed && styles.pressed,
      ]}
    >
      <Text style={[styles.buttonLabel, buttonLabelStyles[variant]]}>{label}</Text>
    </Pressable>
  );
}

type PageHeaderProps = {
  description: string;
  eyebrow: string;
  title: string;
};

export function PageHeader({ description, eyebrow, title }: PageHeaderProps) {
  return (
    <View style={styles.pageHeader}>
      <SectionLabel dark>{eyebrow}</SectionLabel>
      <Heading style={styles.pageTitle}>{title}</Heading>
      <View accessibilityElementsHidden style={styles.goldRule} />
      <Text style={styles.pageDescription}>{description}</Text>
    </View>
  );
}

export function Heading({
  children,
  level = 1,
  style,
}: {
  children: ReactNode;
  level?: 1 | 2 | 3;
  style?: StyleProp<TextStyle>;
}) {
  const webLevel = Platform.OS === 'web' ? { 'aria-level': level } : {};
  return <Text accessibilityRole="header" role="heading" {...webLevel} style={style}>{children}</Text>;
}

export function SectionLabel({ children, dark = false }: { children: ReactNode; dark?: boolean }) {
  return <Text style={[styles.sectionLabel, dark && styles.sectionLabelDark]}>{children}</Text>;
}

type ActionTileProps = {
  accessibilityHint?: string;
  accent?: 'blue' | 'gold' | 'red';
  onPress: () => void;
  subtitle: string;
  title: string;
};

export function ActionTile({
  accessibilityHint,
  accent = 'gold',
  onPress,
  subtitle,
  title,
}: ActionTileProps) {
  return (
    <Pressable
      accessibilityHint={accessibilityHint}
      accessibilityLabel={`${title}. ${subtitle}`}
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.actionTile,
        actionTileBorders[accent],
        pressed && styles.pressed,
      ]}
    >
      <Text style={styles.actionTitle}>{title}</Text>
      <Text style={styles.actionSubtitle}>{subtitle}</Text>
    </Pressable>
  );
}

const buttonStyles = StyleSheet.create({
  primary: { backgroundColor: colors.red },
  secondary: { borderColor: colors.ink, borderWidth: 1 },
  gold: { backgroundColor: colors.gold },
  dark: { backgroundColor: colors.navy },
});

const buttonLabelStyles = StyleSheet.create({
  primary: { color: colors.white },
  secondary: { color: colors.ink },
  gold: { color: colors.navy },
  dark: { color: colors.white },
});

const actionTileBorders = StyleSheet.create({
  blue: { borderColor: colors.blue },
  gold: { borderColor: colors.gold },
  red: { borderColor: colors.red },
});

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderRadius: radii.pill,
    justifyContent: 'center',
    minHeight: sizes.minimumTouchTarget,
    paddingHorizontal: spacing.xxl,
    paddingVertical: spacing.md,
  },
  buttonLabel: {
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  disabled: { opacity: 0.45 },
  pressed: { opacity: 0.72 },
  pageHeader: {
    backgroundColor: colors.navy,
    borderBottomColor: colors.gold,
    borderBottomWidth: 1,
    gap: spacing.sm,
    marginHorizontal: -spacing.xl,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xxxl,
  },
  pageTitle: {
    color: colors.white,
    fontFamily: displayFont,
    fontSize: 52,
    fontWeight: '900',
    letterSpacing: -1.3,
    lineHeight: 54,
    textTransform: 'uppercase',
  },
  pageDescription: {
    color: colors.onDarkMuted,
    fontSize: 16,
    lineHeight: 25,
    maxWidth: 540,
  },
  goldRule: { backgroundColor: colors.gold, height: 2, marginVertical: spacing.xs, width: 64 },
  sectionLabel: {
    color: colors.red,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.8,
    textTransform: 'uppercase',
  },
  sectionLabelDark: { color: colors.goldBright },
  actionTile: {
    backgroundColor: colors.navyRaised,
    borderRadius: radii.medium,
    borderWidth: 1,
    flexBasis: '46%',
    flexGrow: 1,
    justifyContent: 'center',
    minHeight: 94,
    minWidth: 140,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  actionTitle: {
    color: colors.white,
    fontFamily: displayFont,
    fontSize: 26,
    fontWeight: '900',
    lineHeight: 28,
    textTransform: 'uppercase',
  },
  actionSubtitle: {
    color: colors.onDarkMuted,
    fontSize: 11,
    fontWeight: '700',
    lineHeight: 16,
    marginTop: spacing.xs,
  },
});

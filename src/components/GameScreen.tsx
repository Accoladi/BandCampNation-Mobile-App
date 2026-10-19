import { type Href, useRouter } from 'expo-router';
import type { PropsWithChildren } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AppScreen } from '@/components/AppScreen';
import { Heading } from '@/components/ui';
import { colors, displayFont, spacing } from '@/theme';

type Props = PropsWithChildren<{
  backLabel?: string;
  backPath?: Href;
  description: string;
  eyebrow?: string;
  title: string;
}>;

export function GameScreen({
  backLabel = 'Back to games',
  backPath = '/entertainment',
  children,
  description,
  eyebrow = 'Play in app',
  title,
}: Props) {
  const router = useRouter();

  return (
    <AppScreen>
      <Pressable
        accessibilityRole="button"
        onPress={() => router.replace(backPath)}
        style={({ pressed }) => [styles.back, pressed && styles.pressed]}
      >
        <Text style={styles.backText}>← {backLabel}</Text>
      </Pressable>
      <View style={styles.heading}>
        <Text style={styles.eyebrow}>{eyebrow}</Text>
        <Heading style={styles.title}>{title}</Heading>
        <Text style={styles.description}>{description}</Text>
      </View>
      {children}
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  back: { justifyContent: 'center', minHeight: 48, paddingVertical: 10 },
  backText: { color: colors.ink, fontSize: 13, fontWeight: '900', textTransform: 'uppercase' },
  pressed: { opacity: 0.72 },
  heading: { gap: spacing.sm, paddingBottom: spacing.xxl, paddingTop: spacing.lg },
  eyebrow: { color: colors.red, fontSize: 11, fontWeight: '900', letterSpacing: 1.2 },
  title: {
    color: colors.ink,
    fontFamily: displayFont,
    fontSize: 40,
    fontWeight: '900',
    lineHeight: 44,
    textTransform: 'uppercase',
  },
  description: { color: colors.textMuted, fontSize: 16, lineHeight: 24, maxWidth: 560 },
});

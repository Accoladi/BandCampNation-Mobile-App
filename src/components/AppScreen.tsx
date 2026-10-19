import { useState, type PropsWithChildren } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppHeader } from '@/components/AppHeader';
import { colors, sizes, spacing } from '@/theme';

export function AppScreen({ children }: PropsWithChildren) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <SafeAreaView edges={['top', 'bottom']} style={styles.screen}>
      <AppHeader onMenuVisibilityChange={setMenuOpen} />
      <ScrollView
        aria-hidden={menuOpen}
        accessibilityElementsHidden={menuOpen}
        contentContainerStyle={styles.content}
        contentInsetAdjustmentBehavior="automatic"
        importantForAccessibility={menuOpen ? 'no-hide-descendants' : 'auto'}
        keyboardShouldPersistTaps="handled"
        role="main"
        showsVerticalScrollIndicator={false}
      >
        {children}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { backgroundColor: colors.navy, flex: 1 },
  content: {
    alignSelf: 'center',
    backgroundColor: colors.paper,
    flexGrow: 1,
    maxWidth: sizes.contentMaxWidth,
    paddingBottom: spacing.xxxl,
    paddingHorizontal: spacing.xl,
    width: '100%',
  },
});

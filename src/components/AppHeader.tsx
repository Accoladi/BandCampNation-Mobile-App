import { type Href, Link, usePathname } from 'expo-router';
import { useState } from 'react';
import { Image, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { primaryNavigation } from '@/features/navigation/routes';
import { colors, displayFont, sizes, spacing } from '@/theme';

export function AppHeader({ onMenuVisibilityChange }: { onMenuVisibilityChange: (open: boolean) => void }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const setMenuVisibility = (open: boolean) => {
    setMenuOpen(open);
    onMenuVisibilityChange(open);
  };

  return (
    <>
      <View
        aria-hidden={menuOpen}
        accessibilityElementsHidden={menuOpen}
        importantForAccessibility={menuOpen ? 'no-hide-descendants' : 'auto'}
        role="banner"
        style={styles.header}
      >
        <Link asChild href="/" replace>
          <Pressable
            accessibilityLabel="BandCampNation home"
            hitSlop={8}
            style={styles.brand}
          >
            <Image
              accessibilityElementsHidden
              resizeMode="contain"
              source={require('../../assets/images/icon.png')}
              style={styles.logo}
            />
            <Text style={styles.brandName}>BandCamp{`\n`}Nation</Text>
          </Pressable>
        </Link>
        <Pressable
          accessibilityLabel="Open navigation"
          accessibilityRole="button"
          accessibilityState={{ expanded: menuOpen }}
          aria-expanded={menuOpen}
          hitSlop={8}
          onPress={() => setMenuVisibility(true)}
          style={({ pressed }) => [styles.menuButton, pressed && styles.pressed]}
        >
          <View accessibilityElementsHidden style={styles.menuIcon}>
            <View style={styles.menuLine} />
            <View style={styles.menuLine} />
            <View style={styles.menuLine} />
          </View>
        </Pressable>
      </View>

      <Modal
        animationType="none"
        onRequestClose={() => setMenuVisibility(false)}
        presentationStyle="fullScreen"
        visible={menuOpen}
      >
        <SafeAreaView aria-modal accessibilityViewIsModal style={styles.modal}>
          <View style={styles.modalHeader}>
            <Link asChild href="/" onPress={() => setMenuVisibility(false)}>
              <Pressable
                accessibilityLabel="BandCampNation home"
                style={styles.brand}
              >
                <Image
                  accessibilityElementsHidden
                  resizeMode="contain"
                  source={require('../../assets/images/icon.png')}
                  style={styles.logo}
                />
                <Text style={styles.brandName}>BandCamp{`\n`}Nation</Text>
              </Pressable>
            </Link>
            <Pressable
              accessibilityLabel="Close navigation"
              accessibilityRole="button"
              onPress={() => setMenuVisibility(false)}
              style={({ pressed }) => [styles.menuButton, pressed && styles.pressed]}
            >
              <Text accessibilityElementsHidden style={styles.close}>×</Text>
            </Pressable>
          </View>

          <ScrollView accessibilityLabel="Primary navigation" role="navigation" contentContainerStyle={styles.navigation}>
            {primaryNavigation.map(({ href, label }) => {
              const active = pathname === href;
              return (
                <Link
                  asChild
                  href={href as Href}
                  key={href}
                  onPress={() => setMenuVisibility(false)}
                >
                  <Pressable
                    accessibilityState={{ selected: active }}
                    style={StyleSheet.flatten([styles.navigationItem, active && styles.navigationItemActive])}
                  >
                    <Text style={[styles.navigationLabel, active && styles.navigationLabelActive]}>
                      {label}
                    </Text>
                  </Pressable>
                </Link>
              );
            })}
          </ScrollView>
          <Text style={styles.tagline}>Play games. Read articles. Listen. Connect.</Text>
        </SafeAreaView>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    backgroundColor: colors.navy,
    borderBottomColor: colors.gold,
    borderBottomWidth: 1,
    flexDirection: 'row-reverse',
    minHeight: sizes.headerHeight,
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
  },
  brand: { alignItems: 'center', flexDirection: 'row', gap: spacing.sm, minHeight: 48 },
  logo: { height: 40, width: 36 },
  brandName: {
    color: colors.white,
    fontFamily: displayFont,
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: -0.8,
    lineHeight: Platform.OS === 'ios' ? 22 : 15,
    textTransform: 'uppercase',
  },
  menuButton: {
    alignItems: 'center',
    height: sizes.minimumTouchTarget,
    justifyContent: 'center',
    width: sizes.minimumTouchTarget,
  },
  menuIcon: { gap: 5 },
  menuLine: { backgroundColor: colors.white, height: 2, width: 24 },
  pressed: { opacity: 0.7 },
  modal: { backgroundColor: colors.navy, flex: 1 },
  modalHeader: {
    alignItems: 'center',
    borderBottomColor: colors.gold,
    borderBottomWidth: 1,
    flexDirection: 'row-reverse',
    minHeight: sizes.headerHeight,
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
  },
  close: { color: colors.white, fontSize: 38, fontWeight: '300', lineHeight: 40 },
  navigation: { flexGrow: 1, justifyContent: 'center', paddingHorizontal: spacing.xxl },
  navigationItem: {
    borderBottomColor: colors.borderOnDark,
    borderBottomWidth: 1,
    justifyContent: 'center',
    minHeight: 68,
  },
  navigationItemActive: { borderBottomColor: colors.gold },
  navigationLabel: {
    color: colors.white,
    fontFamily: displayFont,
    fontSize: 34,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  navigationLabelActive: { color: colors.goldBright },
  tagline: {
    color: colors.onDarkMuted,
    fontSize: 11,
    lineHeight: 18,
    paddingBottom: spacing.xxl,
    paddingHorizontal: spacing.xxl,
    textAlign: 'center',
  },
});

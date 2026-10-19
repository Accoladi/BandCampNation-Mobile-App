import { useRouter } from 'expo-router';
import { ImageBackground, StyleSheet, Text, View } from 'react-native';

import { AppScreen } from '@/components/AppScreen';
import { ActionTile, AppButton, Heading, SectionLabel } from '@/components/ui';
import { colors, spacing } from '@/theme';

export default function HomeScreen() {
  const router = useRouter();
  return (
    <AppScreen>
      <ImageBackground source={require('../../assets/images/home.png')} style={styles.hero}>
        <View style={styles.overlay}>
          <SectionLabel dark>For marchers, by marchers</SectionLabel>
          <Heading style={styles.title}>We are more{`\n`}than a dot.</Heading>
          <Text style={styles.brand}>We are BandCamp Nation.</Text>
          <Text style={styles.intro}>Your soundtrack. Your stories. Your break between rehearsals.</Text>
          <AppButton label="Listen to BandCamp Radio" onPress={() => router.push('/radio')} variant="gold" />
        </View>
      </ImageBackground>
      <View style={styles.section}>
        <SectionLabel>Make it your break</SectionLabel>
        <Heading level={2} style={styles.heading}>Band life starts here</Heading>
        <View style={styles.tiles}>
          <ActionTile title="Listen" subtitle="BandCamp Radio" onPress={() => router.push('/radio')} accent="blue" />
          <ActionTile title="Read" subtitle="Stories from inside the band" onPress={() => router.push('/articles')} />
          <ActionTile title="Books" subtitle="Read one chapter at a time" onPress={() => router.push('/books')} />
          <ActionTile title="Play" subtitle="Games for the bus ride" onPress={() => router.push('/entertainment')} accent="blue" />
        </View>
        <Text style={styles.body}>Unity. Commitment. Responsibility. Excellence. Tradition.</Text>
        <Text style={styles.body}>Find your people, make the stories, and discover what you are capable of.</Text>
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  hero: { marginHorizontal: -spacing.xl },
  overlay: { backgroundColor: '#071426DB', paddingHorizontal: spacing.xl, paddingVertical: 48, gap: 22 },
  title: { color: colors.white, fontSize: 46, fontWeight: '900', lineHeight: 50 },
  brand: { color: colors.gold, fontSize: 26, fontWeight: '800' },
  intro: { color: colors.onDarkMuted, fontSize: 18, lineHeight: 28 },
  section: { paddingVertical: 32, gap: 20 },
  heading: { color: colors.ink, fontSize: 30, fontWeight: '900' },
  tiles: { flexDirection: 'row', flexWrap: 'wrap', gap: 14 },
  body: { color: colors.textMuted, fontSize: 17, lineHeight: 27 },
});

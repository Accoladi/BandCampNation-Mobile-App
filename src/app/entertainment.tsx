import { useRouter } from 'expo-router';
import { Image, StyleSheet, Text, View } from 'react-native';

import { AppScreen } from '@/components/AppScreen';
import { AppButton, Heading, PageHeader } from '@/components/ui';
import { openWebsite } from '@/features/site/open';
import { colors } from '@/theme';

export default function EntertainmentScreen() {
  const router = useRouter();
  return (
    <AppScreen>
      <PageHeader eyebrow="Pick up and play" title="Break starts here" description="Games for the bus ride and the moments between rehearsals." />
      <View style={styles.card}>
        <Image source={require('../../assets/content/entertainment/marching-band-trivia.png')} style={styles.image} />
        <Heading level={2} style={styles.title}>Marching Band Trivia</Heading>
        <Text style={styles.body}>Ten questions. Choose an answer, get feedback and try for a perfect score. Available offline.</Text>
        <AppButton label="Play Trivia" onPress={() => router.push('/trivia')} />
      </View>
      <View style={styles.card}>
        <Image source={require('../../assets/content/entertainment/tip-tap-tone.png')} style={styles.image} />
        <Heading level={2} style={styles.title}>Tic Tap Tone</Heading>
        <Text style={styles.body}>Trombones versus drummers. Play against the app or pass the device to a friend. Available offline.</Text>
        <AppButton label="Play Tic Tap Tone" onPress={() => router.push('/tic-tap-tone')} />
      </View>
      <View style={styles.card}>
        <Heading level={2} style={styles.title}>Name That Tune</Heading>
        <Text style={styles.body}>Listen to original ten-second marching-band clips. Ten rounds, four choices and three clues per game. Available offline.</Text>
        <AppButton label="Play Name That Tune" onPress={() => router.push('/name-that-tune')} />
      </View>
      <View style={styles.card}>
        <Heading level={2} style={styles.title}>More ways to play</Heading>
        <Text style={styles.body}>These experiences open the BandCampNation website and need an internet connection.</Text>
        <AppButton label="Marching Band Crossword · Website" variant="secondary" onPress={() => openWebsite('/entertainment/marching-band-crossword')} />
        <AppButton label="Name That College · Website" variant="secondary" onPress={() => openWebsite('/entertainment/college-fight-songs')} />
        <AppButton label="Coloring Book · Website" variant="secondary" onPress={() => openWebsite('/entertainment/coloring-pages')} />
        <AppButton label="Scavenger Hunt · Website" variant="secondary" onPress={() => openWebsite('/entertainment/scavenger-hunt')} />
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.white, borderRadius: 16, padding: 20, marginTop: 24, gap: 18 },
  image: { width: '100%', height: 180, borderRadius: 12, resizeMode: 'cover' },
  title: { color: colors.ink, fontSize: 26, fontWeight: '800' },
  body: { color: colors.textMuted, fontSize: 17, lineHeight: 27 },
});

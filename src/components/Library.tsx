import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Image, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { AppScreen } from '@/components/AppScreen';
import { Heading, PageHeader } from '@/components/ui';
import { covers } from '@/features/content/covers';
import { documents } from '@/features/content/library';
import { colors } from '@/theme';

export function Library({ kind }: { kind: 'article' | 'book' }) {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const items = documents.filter(item => item.kind === kind && item.title.toLowerCase().includes(search.trim().toLowerCase()));
  return (
    <AppScreen>
      <PageHeader eyebrow="Read anywhere" title={kind === 'article' ? 'Inside the Band' : 'Books'} description="Original BandCampNation stories. Text and covers are available offline." />
      <TextInput accessibilityLabel={`Search ${kind === 'article' ? 'articles' : 'books'}`} value={search} onChangeText={setSearch} placeholder="Search titles" placeholderTextColor={colors.textMuted} style={styles.search} clearButtonMode="while-editing" />
      <Text accessibilityLiveRegion="polite" style={styles.body}>{items.length} {kind === 'article' ? 'articles' : 'books'}</Text>
      {!items.length ? <Text style={styles.body}>No matching titles. Try a different search.</Text> : null}
      {items.map(item => (
        <Pressable accessibilityRole="button" accessibilityLabel={`Read ${item.title}`} key={item.id} onPress={() => router.push({ pathname: '/reader', params: { id: item.id } })} style={styles.card}>
          <Image source={covers[item.id]} resizeMode={kind === 'book' ? 'contain' : 'cover'} style={styles.image} accessibilityIgnoresInvertColors />
          <View style={styles.copy}>
            <Heading level={2} style={styles.title}>{item.title}</Heading>
            {item.author ? <Text style={styles.body}>{item.author}</Text> : null}
            <Text style={styles.body}>{item.excerpt}</Text>
            <Text style={styles.action}>{item.sections.length > 1 ? 'View contents →' : 'Read article →'}</Text>
          </View>
        </Pressable>
      ))}
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  search: { borderWidth: 1, borderColor: colors.textMuted, borderRadius: 12, padding: 14, minHeight: 52, marginVertical: 20, color: colors.ink, backgroundColor: colors.white, fontSize: 17 },
  body: { color: colors.textMuted, fontSize: 16, lineHeight: 25 },
  card: { backgroundColor: colors.white, borderRadius: 16, overflow: 'hidden', marginTop: 20, borderWidth: 1, borderColor: colors.border },
  image: { width: '100%', height: 220, backgroundColor: colors.paperAlt },
  copy: { padding: 20, gap: 12 },
  title: { color: colors.ink, fontSize: 24, fontWeight: '800' },
  action: { color: colors.red, fontWeight: '800', fontSize: 16 },
});

import { useLocalSearchParams, useRouter } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { AppScreen } from '@/components/AppScreen';
import { AppButton, Heading, PageHeader } from '@/components/ui';
import { documents } from '@/features/content/library';
import { colors } from '@/theme';

export default function ReaderScreen() {
  const router = useRouter();
  const { id, section } = useLocalSearchParams<{ id: string; section?: string }>();
  const document = documents.find(item => item.id === id);
  const index = document?.sections.findIndex(item => item.slug === section) ?? -1;
  const selected = document?.sections[index >= 0 ? index : 0];
  const showContents = document && document.sections.length > 1 && !section;
  const navigate = (slug: string) => router.replace({ pathname: '/reader', params: { id, section: slug } });

  if (!document || !selected || (section && index < 0)) {
    return <AppScreen><PageHeader eyebrow="Reading" title="Story unavailable" description="This link does not match a bundled story or section." /><AppButton label="Browse articles" onPress={() => router.replace('/articles')} /></AppScreen>;
  }

  return (
    <AppScreen key={`${id}:${section ?? 'contents'}`}>
      <View style={styles.actions}>
        <AppButton label={document.kind === 'book' ? 'Back to books' : 'Back to articles'} variant="secondary" onPress={() => router.replace(document.kind === 'book' ? '/books' : '/articles')} />
      </View>
      <PageHeader eyebrow={showContents ? 'Contents · Available offline' : 'Available offline'} title={document.title} description={document.author ?? document.excerpt} />
      {showContents ? (
        <View style={styles.actions}>
          {document.sections.map(item => <AppButton key={item.slug} label={item.title} variant="secondary" onPress={() => navigate(item.slug)} />)}
        </View>
      ) : (
        <View style={styles.reading}>
          {document.sections.length > 1 ? <Heading level={2} style={styles.heading}>{selected.title}</Heading> : null}
          {selected.blocks.map((block, blockIndex) => block.kind === 'heading'
            ? <Heading key={blockIndex} level={3} style={styles.heading}>{block.text}</Heading>
            : <Text selectable key={blockIndex} style={styles.paragraph}>{block.text}</Text>)}
          <View style={styles.actions}>
            {index > 0 ? <AppButton label="Previous section" variant="secondary" onPress={() => navigate(document.sections[index - 1].slug)} /> : null}
            {index >= 0 && index < document.sections.length - 1 ? <AppButton label="Next section" onPress={() => navigate(document.sections[index + 1].slug)} /> : null}
            {document.sections.length > 1 ? <AppButton label="Table of contents" variant="secondary" onPress={() => router.replace({ pathname: '/reader', params: { id } })} /> : null}
          </View>
        </View>
      )}
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  actions: { gap: 16, paddingVertical: 24 },
  reading: { paddingVertical: 28, maxWidth: 660, alignSelf: 'center', width: '100%' },
  paragraph: { color: colors.text, fontSize: 19, lineHeight: 32, marginBottom: 20 },
  heading: { color: colors.ink, fontSize: 24, lineHeight: 33, fontWeight: '800', marginTop: 18, marginBottom: 20 },
});

import { useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

import { AppButton } from '@/components/ui';
import { colors } from '@/theme';

export function RemoteArtwork({ uri, title }: { uri: string; title: string }) {
  const [failed, setFailed] = useState(false);
  return failed ? <View style={styles.fallback}><Text style={styles.text}>Artwork unavailable. You can still use the player.</Text><AppButton label="Retry artwork" variant="secondary" onPress={() => setFailed(false)} /></View>
    : <Image source={{ uri }} accessibilityLabel={`${title} artwork`} onError={() => setFailed(true)} style={styles.image} />;
}

const styles = StyleSheet.create({
  image: { width: '100%', height: 200, borderRadius: 12 },
  fallback: { padding: 20, backgroundColor: colors.paperAlt, borderRadius: 12, gap: 16 },
  text: { color: colors.textMuted, fontSize: 16, lineHeight: 25 },
});

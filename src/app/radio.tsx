import { useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import { useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, AppState, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { AppScreen } from '@/components/AppScreen';
import { RemoteArtwork } from '@/components/RemoteArtwork';
import { AppButton, Heading, PageHeader } from '@/components/ui';
import { useAudioLifecycle } from '@/features/audio/useAudioLifecycle';
import { fetchTracks, type Track } from '@/features/radio/service';
import { colors } from '@/theme';

const time = (value: number) => `${Math.floor(value / 60)}:${Math.floor(value % 60).toString().padStart(2, '0')}`;

export default function RadioScreen() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [playError, setPlayError] = useState('');
  const [attempt, setAttempt] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [limit, setLimit] = useState(20);
  const [loadedId, setLoadedId] = useState<string | null>(null);
  const player = useAudioPlayer(null, { updateInterval: 2000 });
  const status = useAudioPlayerStatus(player);
  const audioSetupError = useAudioLifecycle(player);
  const lastFinished = useRef<string | null>(null);
  const current = tracks.find(track => track.id === selected) ?? tracks[0];
  const filtered = tracks.filter(track => `${track.title} ${track.artist} ${track.tags.join(' ')}`.toLowerCase().includes(search.trim().toLowerCase()));

  useEffect(() => {
    let active = true;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000);
    fetchTracks(controller.signal).then(songs => { if (active) setTracks(songs); }).catch(() => {
      if (active) setError('Radio could not connect. Check your internet connection and try again. Your bundled reading and games are still available.');
    }).finally(() => { if (active) setLoading(false); clearTimeout(timeout); });
    return () => { active = false; clearTimeout(timeout); controller.abort(); };
  }, [attempt]);

  const select = useCallback((track: Track, finishedId: string | null = null) => {
    lastFinished.current = finishedId;
    setPlayError('');
    setSelected(track.id);
    try {
      player.pause();
      player.replace({ uri: track.audioUrl });
      setLoadedId(track.id);
      player.play();
    } catch { setPlayError('This track could not play. Check your connection and retry.'); }
  }, [player]);

  useEffect(() => {
    if (loadedId && !tracks.some(track => track.id === loadedId)) player.pause();
  }, [loadedId, tracks, player]);

  useFocusEffect(useCallback(() => {
    const subscription = player.addListener('playbackStatusUpdate', event => {
      if (event.didJustFinish && current && loadedId === current.id && tracks.length > 1 && AppState.currentState === 'active' && lastFinished.current !== current.id) {
        select(tracks[(tracks.findIndex(track => track.id === current.id) + 1) % tracks.length], current.id);
      }
    });
    return () => subscription.remove();
  }, [player, current, loadedId, tracks, select]));

  const toggle = async () => {
    if (!current) return;
    if (loadedId !== current.id || status.error) { select(current); return; }
    try {
      if (status.playing) player.pause();
      else { if (status.didJustFinish) await player.seekTo(0); player.play(); }
    } catch { setPlayError('Playback could not resume. Select the track again to retry.'); }
  };
  const skip = (offset: number) => {
    if (!current || !tracks.length) return;
    const index = tracks.findIndex(track => track.id === current.id);
    select(tracks[(index + offset + tracks.length) % tracks.length]);
  };
  const seek = (offset: number) => {
    const position = Math.max(0, Math.min(player.duration || 0, player.currentTime + offset));
    player.seekTo(position).catch(() => setPlayError('Could not seek. Select the track again to retry.'));
  };

  return (
    <AppScreen>
      <PageHeader eyebrow="Listen in" title="BandCamp Radio" description="The soundtrack of band life. Stream original songs from the existing BandCampNation catalog." />
      {loading ? <View style={styles.state}><ActivityIndicator color={colors.red} /><Text accessibilityLiveRegion="polite" style={styles.body}>Loading radio…</Text></View> : null}
      {error ? <View accessibilityLiveRegion="polite" style={styles.state}><Text style={styles.body}>{error}</Text><AppButton label="Retry radio" onPress={() => { setLoading(true); setError(''); setAttempt(value => value + 1); }} /></View> : null}
      {!loading && !error && !tracks.length ? <Text style={styles.body}>No published tracks are available yet.</Text> : null}
      {current ? (
        <View style={styles.player}>
          {current.coverImageUrl ? <RemoteArtwork key={current.coverImageUrl} uri={current.coverImageUrl} title={current.title} /> : null}
          <Heading level={2} style={styles.title}>{current.title}</Heading>
          <Text style={styles.body}>{current.artist}</Text>
          <Text accessibilityLiveRegion="polite" style={styles.body}>{loadedId === current.id ? status.error ? 'Playback unavailable' : status.isBuffering ? 'Buffering…' : status.playing ? 'Playing' : 'Paused' : 'Ready to listen'}</Text>
          <AppButton label={status.playing ? 'Pause track' : 'Play track'} onPress={toggle} />
          <View style={styles.controls}>
            <AppButton label="Previous track" variant="secondary" onPress={() => skip(-1)} />
            <AppButton label="Next track" variant="secondary" onPress={() => skip(1)} />
          </View>
          {loadedId === current.id && status.isLoaded ? <>
            <Text accessibilityRole="progressbar" accessibilityLabel="Playback position" accessibilityValue={{ min: 0, max: Math.max(1, status.duration), now: Math.min(status.currentTime, Math.max(1, status.duration)) }} style={styles.body}>{time(status.currentTime)} / {time(status.duration)}</Text>
            <View style={styles.controls}><AppButton label="Back 15 seconds" variant="secondary" onPress={() => seek(-15)} /><AppButton label="Forward 15 seconds" variant="secondary" onPress={() => seek(15)} /></View>
          </> : null}
          {playError || status.error || audioSetupError ? <View accessibilityLiveRegion="polite" style={styles.state}><Text style={styles.body}>{playError || audioSetupError || 'This track could not load. Check your connection and retry.'}</Text><AppButton label="Retry track" onPress={() => select(current)} /></View> : null}
          <Text style={styles.note}>Radio streams online and pauses when you leave this screen or background the app. Reading and bundled games work offline.</Text>
        </View>
      ) : null}
      <TextInput accessibilityLabel="Search radio tracks" placeholder="Search songs, artists or tags" placeholderTextColor={colors.textMuted} value={search} onChangeText={value => { setSearch(value); setLimit(20); }} style={styles.search} />
      <Text accessibilityLiveRegion="polite" style={styles.body}>{filtered.length} tracks</Text>
      <AppButton label="Refresh tracks" variant="secondary" disabled={loading} onPress={() => { setLoading(true); setError(''); setAttempt(value => value + 1); }} />
      {tracks.length > 0 && filtered.length === 0 ? <Text style={styles.body}>No matching tracks. Try another search.</Text> : null}
      {filtered.slice(0, limit).map(track => <Pressable key={track.id} accessibilityRole="button" accessibilityLabel={`Play ${track.title}`} accessibilityState={{ selected: current?.id === track.id }} onPress={() => select(track)} style={[styles.track, current?.id === track.id && styles.selected]}><Text style={styles.trackTitle}>{track.title}</Text><Text style={styles.body}>{track.artist}</Text></Pressable>)}
      {filtered.length > limit ? <View style={styles.state}><AppButton label="Show more tracks" variant="secondary" onPress={() => setLimit(value => value + 20)} /></View> : null}
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  state: { gap: 16, paddingVertical: 20 },
  body: { color: colors.textMuted, fontSize: 16, lineHeight: 25 },
  title: { color: colors.ink, fontSize: 28, fontWeight: '800' },
  player: { marginVertical: 24, padding: 20, backgroundColor: colors.white, borderRadius: 16, gap: 16 },
  controls: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  note: { color: colors.textMuted, fontSize: 14, lineHeight: 22 },
  search: { padding: 14, minHeight: 52, borderColor: colors.textMuted, borderWidth: 1, borderRadius: 12, marginBottom: 16, color: colors.ink, fontSize: 16 },
  track: { padding: 18, borderWidth: 1, borderColor: colors.border, borderRadius: 12, backgroundColor: colors.white, marginTop: 12, gap: 6 },
  selected: { borderColor: colors.red, borderWidth: 2 },
  trackTitle: { color: colors.ink, fontSize: 18, fontWeight: '800' },
});

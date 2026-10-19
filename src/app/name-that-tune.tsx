import { useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import { useMemo, useState, useSyncExternalStore } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { GameScreen } from '@/components/GameScreen';
import { Heading } from '@/components/ui';
import { useAudioLifecycle } from '@/features/audio/useAudioLifecycle';
import { TUNE_CLIPS } from '@/features/content/audioAssets';
import {
  createTuneGame,
  createTuneOptions,
  TUNES,
  type Tune,
} from '@/features/games/audioGame';
import { colors, displayFont } from '@/theme';

const ROUND_COUNT = 10;
const subscribe = () => () => undefined;
const formatTime = (seconds: number) => `0:${Math.floor(seconds).toString().padStart(2, '0')}`;

export default function NameThatTuneScreen() {
  const clientReady = useSyncExternalStore(subscribe, () => true, () => false);

  return (
    <GameScreen
      description="Listen to a ten-second marching-band clip, then choose the tune. Ten rounds, four choices each."
      eyebrow="Audio challenge"
      title="Name that tune"
    >
      {clientReady ? (
        <NameThatTuneGame />
      ) : (
        <View accessibilityLiveRegion="polite" style={styles.intro}>
          <Text style={styles.emoji}>🎵</Text>
          <Text style={styles.lede}>Preparing audio…</Text>
        </View>
      )}
    </GameScreen>
  );
}

function NameThatTuneGame() {
  const [rounds, setRounds] = useState<Tune[]>([]);
  const [roundIndex, setRoundIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [hasListened, setHasListened] = useState(false);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [hintsRevealed, setHintsRevealed] = useState(0);
  const [playbackError, setPlaybackError] = useState('');
  const currentTune = rounds[roundIndex];
  const finished = rounds.length > 0 && roundIndex >= rounds.length;
  const audioSource = currentTune ? TUNE_CLIPS[currentTune.file] : null;
  const player = useAudioPlayer(audioSource, { updateInterval: 2000 });
  const status = useAudioPlayerStatus(player);
  const audioSetupError = useAudioLifecycle(player);
  const options = useMemo(
    () => (currentTune ? createTuneOptions(currentTune) : []),
    [currentTune],
  );

  const start = () => {
    player.pause();
    setRounds(createTuneGame(TUNES, ROUND_COUNT));
    setRoundIndex(0);
    setScore(0);
    setSelectedFile(null);
    setHasListened(false);
    setHintsUsed(0);
    setHintsRevealed(0);
    setPlaybackError('');
  };

  const togglePlayback = async () => {
    if (status.playing) {
      player.pause();
      return;
    }

    try {
      if (status.didJustFinish) await player.seekTo(0);
      player.play();
      setHasListened(true);
    } catch { setPlaybackError('This clip could not play. Retry the clip.'); }
  };

  const answer = (tune: Tune) => {
    if (!hasListened || selectedFile) return;
    player.pause();
    setSelectedFile(tune.file);
    if (tune.file === currentTune.file) setScore((value) => value + 1);
  };

  const next = () => {
    player.pause();
    setSelectedFile(null);
    setHasListened(false);
    setHintsRevealed(0);
    setPlaybackError('');
    setRoundIndex((value) => value + 1);
  };

  const retryAudio = () => {
    if (audioSource === null) return;
    player.replace(audioSource);
    setHasListened(false);
    setPlaybackError('');
  };

  return (
    <>
      {rounds.length === 0 ? (
        <View style={styles.intro}>
          <Text style={styles.emoji}>🎵</Text>
          <Text style={styles.lede}>Ten rounds. Listen first, then make your pick.</Text>
          <Pressable
            accessibilityRole="button"
            onPress={start}
            style={({ pressed }) => [styles.primary, pressed && styles.pressed]}
          >
            <Text style={styles.primaryText}>Start game</Text>
          </Pressable>
        </View>
      ) : finished ? (
        <View accessibilityLiveRegion="polite" style={styles.intro}>
          <Text style={styles.emoji}>{score >= 8 ? '🏆' : score >= 5 ? '🎺' : '🥁'}</Text>
          <Heading style={styles.title}>Game over</Heading>
          <Text style={styles.finalScore}>{score} / {rounds.length}</Text>
          <Text style={styles.lede}>
            {score >= 8
              ? 'Band director material!'
              : score >= 5
                ? 'Solid marcher!'
                : 'Keep practicing those stand tunes!'}
          </Text>
          <Pressable
            accessibilityRole="button"
            onPress={start}
            style={({ pressed }) => [styles.primary, pressed && styles.pressed]}
          >
            <Text style={styles.primaryText}>Play again</Text>
          </Pressable>
        </View>
      ) : currentTune ? (
        <View style={styles.game}>
          <View style={styles.gameHeader}>
            <Text style={styles.round}>Round {roundIndex + 1}/{rounds.length}</Text>
            <Text style={styles.round}>Score {score}</Text>
          </View>

          {status.error || playbackError || audioSetupError ? (
            <View accessibilityLiveRegion="polite" style={styles.resourceState}>
              <Text style={styles.stateTitle}>Could not load this clip</Text>
              <Text style={styles.stateText}>{playbackError || audioSetupError || 'Reload this bundled clip and try again.'}</Text>
              <Pressable
                accessibilityRole="button"
                onPress={retryAudio}
                style={({ pressed }) => [styles.retry, pressed && styles.pressed]}
              >
                <Text style={styles.retryText}>Try again</Text>
              </Pressable>
            </View>
          ) : (
            <View style={styles.player}>
              <Pressable
                accessibilityHint="Plays or pauses the ten-second tune"
                accessibilityRole="button"
                disabled={!status.isLoaded}
                onPress={togglePlayback}
                style={({ pressed }) => [
                  styles.primary,
                  !status.isLoaded && styles.disabled,
                  pressed && styles.pressed,
                ]}
              >
                <Text style={styles.primaryText}>
                  {!status.isLoaded || status.isBuffering
                    ? 'Loading clip…'
                    : status.playing
                      ? 'Pause clip'
                      : status.didJustFinish
                        ? 'Replay clip'
                        : 'Listen to clip'}
                </Text>
              </Pressable>
              <View
                accessibilityRole="progressbar"
                accessibilityValue={{
                  max: Math.max(status.duration, 1),
                  min: 0,
                  now: status.currentTime,
                }}
                style={styles.progressTrack}
              >
                <View
                  style={[
                    styles.progress,
                    {
                      width: `${status.duration ? Math.min(status.currentTime / status.duration, 1) * 100 : 0}%`,
                    },
                  ]}
                />
              </View>
              <View style={styles.timeRow}>
                <Text style={styles.time}>{formatTime(status.currentTime)}</Text>
                <Text style={styles.time}>{formatTime(status.duration)}</Text>
              </View>
            </View>
          )}

          <Text style={styles.prompt}>
            {hasListened ? 'Choose the tune' : 'Listen before choosing an answer'}
          </Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Use a clue"
            accessibilityState={{ disabled: hintsUsed >= 3 || selectedFile !== null }}
            disabled={hintsUsed >= 3 || selectedFile !== null}
            onPress={() => { setHintsUsed(value => value + 1); setHintsRevealed(value => value + 1); }}
            style={[styles.option, hintsUsed >= 3 && styles.disabled]}
          >
            <Text style={styles.optionText}>Use a clue · {3 - hintsUsed} left this game</Text>
          </Pressable>
          {currentTune.clues.slice(0, hintsRevealed).map(clue => <Text key={clue} accessibilityLiveRegion="polite" style={styles.lede}>{clue}</Text>)}
          <View style={styles.options}>
            {options.map((tune) => {
              const revealed = selectedFile !== null;
              const correct = revealed && tune.file === currentTune.file;
              const wrong = revealed && tune.file === selectedFile && !correct;

              return (
                <Pressable
                  accessibilityRole="button"
                  disabled={!hasListened || revealed}
                  key={tune.file}
                  onPress={() => answer(tune)}
                  style={({ pressed }) => [
                    styles.option,
                    correct && styles.correct,
                    wrong && styles.wrong,
                    (!hasListened || revealed) && !correct && !wrong && styles.disabled,
                    pressed && styles.pressed,
                  ]}
                >
                  <Text style={[styles.optionText, (correct || wrong) && styles.revealedText]}>
                    {tune.title}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {selectedFile ? (
            <View accessibilityLiveRegion="polite" style={styles.feedback}>
              <Text style={styles.feedbackText}>
                {selectedFile === currentTune.file
                  ? 'Correct!'
                  : `The tune was “${currentTune.title}.”`}
              </Text>
              <Pressable
                accessibilityRole="button"
                onPress={next}
                style={({ pressed }) => [styles.primary, pressed && styles.pressed]}
              >
                <Text style={styles.primaryText}>
                  {roundIndex === rounds.length - 1 ? 'See results' : 'Next round'}
                </Text>
              </Pressable>
            </View>
          ) : null}
        </View>
      ) : null}
    </>
  );
}

const styles = StyleSheet.create({
  pressed: { opacity: 0.72 },
  intro: { alignItems: 'center', gap: 16, paddingBottom: 28, paddingTop: 42 },
  game: { gap: 18, paddingBottom: 28, paddingTop: 18 },
  emoji: { fontSize: 54, lineHeight: 64 },
  title: {
    color: colors.ink,
    fontFamily: displayFont,
    fontSize: 40,
    fontWeight: '900',
    lineHeight: 44,
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  lede: { color: colors.textMuted, fontSize: 16, lineHeight: 24, maxWidth: 520, textAlign: 'center' },
  finalScore: { color: colors.red, fontFamily: displayFont, fontSize: 52, fontWeight: '900' },
  gameHeader: { flexDirection: 'row', justifyContent: 'space-between' },
  round: { color: colors.red, fontSize: 13, fontWeight: '900', textTransform: 'uppercase' },
  player: { gap: 10 },
  primary: {
    alignItems: 'center',
    alignSelf: 'stretch',
    backgroundColor: colors.red,
    justifyContent: 'center',
    minHeight: 52,
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  primaryText: { color: colors.white, fontSize: 14, fontWeight: '900', textTransform: 'uppercase' },
  progressTrack: { backgroundColor: colors.progressTrack, height: 8, overflow: 'hidden' },
  progress: { backgroundColor: colors.blue, height: '100%' },
  timeRow: { flexDirection: 'row', justifyContent: 'space-between' },
  time: { color: colors.textMuted, fontSize: 12, fontVariant: ['tabular-nums'] },
  prompt: { color: colors.ink, fontSize: 15, fontWeight: '800', textAlign: 'center' },
  options: { gap: 10 },
  option: {
    backgroundColor: colors.white,
    borderColor: colors.ink,
    borderWidth: 1,
    justifyContent: 'center',
    minHeight: 52,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  optionText: { color: colors.ink, fontSize: 15, fontWeight: '800', textAlign: 'center' },
  correct: { backgroundColor: colors.success, borderColor: colors.success },
  wrong: { backgroundColor: colors.red, borderColor: colors.red },
  revealedText: { color: colors.white },
  disabled: { opacity: 0.5 },
  feedback: { gap: 14 },
  feedbackText: { color: colors.ink, fontSize: 18, fontWeight: '900', textAlign: 'center' },
  resourceState: {
    alignItems: 'center',
    backgroundColor: colors.white,
    borderColor: colors.red,
    borderWidth: 1,
    gap: 6,
    padding: 18,
  },
  stateTitle: { color: colors.ink, fontSize: 16, fontWeight: '900' },
  stateText: { color: colors.textMuted, fontSize: 14, lineHeight: 21, textAlign: 'center' },
  retry: {
    borderColor: colors.ink,
    borderWidth: 1,
    justifyContent: 'center',
    marginTop: 6,
    minHeight: 46,
    paddingHorizontal: 18,
  },
  retryText: { color: colors.ink, fontSize: 12, fontWeight: '900', textTransform: 'uppercase' },
});

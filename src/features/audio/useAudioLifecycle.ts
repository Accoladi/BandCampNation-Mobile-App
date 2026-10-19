import { setAudioModeAsync, type AudioPlayer } from 'expo-audio';
import { useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { AppState } from 'react-native';

export function useAudioLifecycle(player: AudioPlayer) {
  const [error, setError] = useState('');
  useEffect(() => {
    let active = true;
    setAudioModeAsync({ playsInSilentMode: true, allowsRecording: false, shouldPlayInBackground: false, interruptionMode: 'doNotMix', shouldRouteThroughEarpiece: false })
      .catch(() => { if (active) setError('Audio could not be configured. Reopen this screen and try again.'); });
    // Expo may resume paused audio natively on foreground. Pause on both
    // transitions so returning always requires an explicit user action.
    const subscription = AppState.addEventListener('change', () => player.pause());
    return () => { active = false; subscription.remove(); };
  }, [player]);
  useFocusEffect(useCallback(() => () => {
    // The player may already be released during an unmount.
    try { player.pause(); } catch { /* Already stopped with the released native object. */ }
  }, [player]));
  return error;
}

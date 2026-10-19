import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { GameScreen } from '@/components/GameScreen';
import { Heading } from '@/components/ui';
import {
  chooseComputerMove,
  gameResult,
  winningLine,
  type Player,
  type Square,
} from '@/features/games/core';
import { colors, displayFont } from '@/theme';

type Mode = 'single' | 'two';

const EMPTY_BOARD: Square[] = Array(9).fill(null);

export default function TicTapToneScreen() {
  const [mode, setMode] = useState<Mode | null>(null);
  const [board, setBoard] = useState<Square[]>(EMPTY_BOARD);
  const [turn, setTurn] = useState<Player>('Trombone');
  const result = gameResult(board);
  const winning = winningLine(board);

  const reset = (nextMode = mode) => {
    setBoard([...EMPTY_BOARD]);
    setTurn('Trombone');
    setMode(nextMode);
  };

  const play = (index: number) => {
    if (board[index] || result) return;

    const next = [...board];
    next[index] = turn;

    if (mode === 'single' && !gameResult(next)) {
      const computerMove = chooseComputerMove(next);
      if (computerMove !== null) next[computerMove] = 'Drummer';
      setTurn('Trombone');
    } else {
      setTurn(turn === 'Trombone' ? 'Drummer' : 'Trombone');
    }

    setBoard(next);
  };

  const status = result === 'Tie' ? "It's a tie" : result ? `${result} wins` : `${turn}'s turn`;

  return (
    <GameScreen
      description="Trombones versus drummers. Get three in a row."
      eyebrow="Touch-first game"
      title="Tic Tap Tone"
    >
      {!mode ? (
        <View style={styles.modePicker}>
          <Heading level={2} style={styles.sectionTitle}>Choose a mode</Heading>
          <Pressable
            accessibilityRole="button"
            onPress={() => reset('single')}
            style={({ pressed }) => [styles.mode, pressed && styles.pressed]}
          >
            <Text style={styles.modeIcon}>🎺</Text>
            <View style={styles.modeCopy}>
              <Text style={styles.modeTitle}>Single player</Text>
              <Text style={styles.modeText}>You are Trombone. The app plays Drummer.</Text>
            </View>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            onPress={() => reset('two')}
            style={({ pressed }) => [styles.mode, pressed && styles.pressed]}
          >
            <Text style={styles.modeIcon}>🥁</Text>
            <View style={styles.modeCopy}>
              <Text style={styles.modeTitle}>Two players</Text>
              <Text style={styles.modeText}>Pass the device and alternate turns.</Text>
            </View>
          </Pressable>
        </View>
      ) : (
        <View style={styles.game}>
          <Text accessibilityLiveRegion="polite" style={styles.status}>{status}</Text>
          <View accessibilityLabel="Tic Tap Tone board" style={styles.board}>
            {board.map((square, index) => {
              const isWinning = Boolean(winning?.includes(index));
              const row = Math.floor(index / 3) + 1;
              const column = (index % 3) + 1;

              return (
                <Pressable
                  accessibilityLabel={`Row ${row}, column ${column}, ${square ?? 'empty'}`}
                  accessibilityRole="button"
                  accessibilityState={{ disabled: Boolean(square || result) }}
                  disabled={Boolean(square || result)}
                  key={index}
                  onPress={() => play(index)}
                  style={({ pressed }) => [
                    styles.square,
                    isWinning && styles.winningSquare,
                    pressed && styles.pressed,
                  ]}
                >
                  <Text accessibilityElementsHidden style={styles.symbol}>
                    {square === 'Trombone' ? '🎺' : square === 'Drummer' ? '🥁' : ''}
                  </Text>
                </Pressable>
              );
            })}
          </View>
          <View style={styles.actions}>
            <Pressable
              accessibilityRole="button"
              onPress={() => reset()}
              style={({ pressed }) => [styles.primary, pressed && styles.pressed]}
            >
              <Text style={styles.primaryText}>{result ? 'Play again' : 'Reset board'}</Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              onPress={() => reset(null)}
              style={({ pressed }) => [styles.secondary, pressed && styles.pressed]}
            >
              <Text style={styles.secondaryText}>Change mode</Text>
            </Pressable>
          </View>
        </View>
      )}
    </GameScreen>
  );
}

const styles = StyleSheet.create({
  pressed: { opacity: 0.72 },
  modePicker: { gap: 12 },
  sectionTitle: {
    color: colors.ink,
    fontFamily: displayFont,
    fontSize: 28,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  mode: {
    alignItems: 'center',
    backgroundColor: colors.white,
    borderColor: colors.ink,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 14,
    minHeight: 80,
    padding: 16,
  },
  modeIcon: { fontSize: 34 },
  modeCopy: { flex: 1, gap: 3 },
  modeTitle: { color: colors.ink, fontSize: 17, fontWeight: '900' },
  modeText: { color: colors.textMuted, fontSize: 13, lineHeight: 19 },
  game: { alignItems: 'center', gap: 20 },
  status: {
    color: colors.ink,
    fontFamily: displayFont,
    fontSize: 28,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  board: {
    alignSelf: 'center',
    backgroundColor: colors.ink,
    borderColor: colors.ink,
    borderWidth: 2,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 2,
    maxWidth: 356,
    width: '100%',
  },
  square: {
    alignItems: 'center',
    aspectRatio: 1,
    backgroundColor: colors.white,
    flexBasis: '32%',
    flexGrow: 1,
    justifyContent: 'center',
    minHeight: 82,
  },
  winningSquare: { backgroundColor: colors.successTint },
  symbol: { fontSize: 44, lineHeight: 54 },
  actions: { alignSelf: 'stretch', gap: 10 },
  primary: {
    alignItems: 'center',
    backgroundColor: colors.red,
    justifyContent: 'center',
    minHeight: 52,
    paddingHorizontal: 20,
  },
  primaryText: { color: colors.white, fontSize: 14, fontWeight: '900', textTransform: 'uppercase' },
  secondary: {
    alignItems: 'center',
    borderColor: colors.ink,
    borderWidth: 1,
    justifyContent: 'center',
    minHeight: 48,
    paddingHorizontal: 20,
  },
  secondaryText: { color: colors.ink, fontSize: 13, fontWeight: '900', textTransform: 'uppercase' },
});

import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { test } from 'node:test';
import { createTuneGame, createTuneOptions, TUNES } from '../src/features/games/audioGame.ts';

test('audio rounds have distinct real clips, valid choices and the original clue sets', () => {
  assert.equal(TUNES.length, 40);
  for (const tune of TUNES) {
    assert.ok(existsSync(new URL(`../assets/content/audio/name-that-tune/${tune.file}`, import.meta.url)), tune.file);
    assert.equal(tune.clues.length, 3);
  }
  const rounds = createTuneGame(TUNES, 10, () => 0.5);
  assert.equal(new Set(rounds.map(tune => tune.file)).size, 10);
  const choices = createTuneOptions(rounds[0], TUNES, 4, () => 0.5);
  assert.equal(new Set(choices.map(tune => tune.file)).size, 4);
  assert.ok(choices.some(tune => tune.file === rounds[0].file));
});

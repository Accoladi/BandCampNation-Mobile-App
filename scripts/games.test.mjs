import assert from 'node:assert/strict';
import { test } from 'node:test';
import { chooseComputerMove, gameResult, TRIVIA_QUESTIONS, winningLine } from '../src/features/games/core.ts';

test('all original trivia questions have one valid answer and four unique options', () => {
  assert.equal(TRIVIA_QUESTIONS.length, 10);
  for (const question of TRIVIA_QUESTIONS) {
    assert.equal(new Set(question.options).size, 4);
    assert.ok(question.options.includes(question.answer));
  }
});

test('Tic Tap Tone detects every winning line and a full-board tie', () => {
  for (const line of [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]]) {
    const board = Array(9).fill(null);
    line.forEach(index => { board[index] = 'Trombone'; });
    assert.equal(gameResult(board), 'Trombone');
    assert.deepEqual(winningLine(board), line);
  }
  assert.equal(gameResult(Array(9).fill(null)), null);
  const tie = ['Trombone','Drummer','Trombone','Trombone','Drummer','Drummer','Drummer','Trombone','Trombone'];
  assert.equal(gameResult(tie), 'Tie');
  assert.equal(chooseComputerMove(tie), null);
  assert.equal(chooseComputerMove(['Drummer','Drummer',null,'Trombone',null,null,null,null,null]), 2);
  assert.equal(chooseComputerMove(['Trombone','Trombone',null,'Drummer',null,null,null,null,null]), 2);
  assert.equal(chooseComputerMove(Array(9).fill(null)), 4);
});

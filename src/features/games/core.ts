export type TriviaQuestion = {
  answer: string;
  options: readonly string[];
  question: string;
};

export const TRIVIA_QUESTIONS: readonly TriviaQuestion[] = [
  { question: 'Which university marching band has the largest bass drum?', options: ['University of Texas', 'Temple University', 'Purdue University', 'University of Missouri'], answer: 'University of Texas' },
  { question: 'In the Broadway musical “The Music Man,” how many trombones led Harold Hill’s parade band?', options: ['42', '110', '76', '86'], answer: '76' },
  { question: 'Which metronome marking is most often used for a military march?', options: ['184', '120', '136', '66'], answer: '120' },
  { question: 'What is another term for a marching band judge?', options: ['Adjudicator', 'Scorer', 'Music umpire', 'General effect tracker'], answer: 'Adjudicator' },
  { question: 'Which university had the first marching band show at a football game halftime?', options: ['Harvard University', 'University of Notre Dame', 'Rutgers University', 'University of Alabama'], answer: 'University of Notre Dame' },
  { question: 'Which section does not march?', options: ['Drum line', 'The pit', 'Sousaphones', 'Baritone saxophones'], answer: 'The pit' },
  { question: 'How long is a high school marching band competition show?', options: ['7 to 9 minutes', '19 to 21 minutes', '4 to 6 minutes', '15 to 17 minutes'], answer: '7 to 9 minutes' },
  { question: 'In competitive marching band judging, what does G.E. stand for?', options: ['Greatest enthusiasm', 'Generated energy', 'Greatest effort', 'General effect'], answer: 'General effect' },
  { question: 'What is the purpose of a drum major?', options: ['To play the largest drum', 'To conduct the band', 'To perform a solo dance routine', 'To lead the color guard'], answer: 'To conduct the band' },
  { question: 'Which instrument sets and maintains the tempo of the marching band?', options: ['Trumpet', 'Clarinet', 'Trombone', 'Snare drum'], answer: 'Snare drum' },
];

export type Player = 'Trombone' | 'Drummer';
export type Square = Player | null;

const WINNING_LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
] as const;

export function winningLine(board: readonly Square[]): readonly number[] | null {
  return (
    WINNING_LINES.find(
      ([first, second, third]) =>
        board[first] !== null &&
        board[first] === board[second] &&
        board[first] === board[third],
    ) ?? null
  );
}

export function gameResult(board: readonly Square[]): Player | 'Tie' | null {
  const line = winningLine(board);
  if (line) return board[line[0]];
  return board.every(Boolean) ? 'Tie' : null;
}

export function chooseComputerMove(board: readonly Square[], random = Math.random): number | null {
  const open = board.flatMap((square, index) => (square === null ? [index] : []));

  for (const player of ['Drummer', 'Trombone'] as const) {
    const move = open.find((index) => {
      const attempt = [...board];
      attempt[index] = player;
      return gameResult(attempt) === player;
    });
    if (move !== undefined) return move;
  }

  if (board[4] === null) return 4;
  return open.length ? open[Math.floor(random() * open.length)] : null;
}

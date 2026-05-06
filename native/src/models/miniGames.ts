export type MiniGameType = 'spin-wheel' | 'tictactoe' | 'trivia';

export type TicTacToeCell = null | 'X' | 'O';

export type TicTacToeResult = 'child-won' | 'pet-won' | 'draw';

const WIN_LINES: [number, number, number][] = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
  [0, 4, 8], [2, 4, 6],             // diagonals
];

export function pickMiniGame(): MiniGameType {
  const roll = Math.random();
  if (roll < 1 / 3) return 'spin-wheel';
  if (roll < 2 / 3) return 'tictactoe';
  return 'trivia';
}

export function createEmptyBoard(): TicTacToeCell[] {
  return Array(9).fill(null);
}

export function checkWinner(board: TicTacToeCell[]): 'X' | 'O' | 'draw' | null {
  for (const [a, b, c] of WIN_LINES) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }
  if (board.every(cell => cell !== null)) return 'draw';
  return null;
}

export function getWinningLine(board: TicTacToeCell[]): [number, number, number] | null {
  for (const line of WIN_LINES) {
    const [a, b, c] = line;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return line;
    }
  }
  return null;
}

export function getPetMove(board: TicTacToeCell[]): number {
  const useOptimal = Math.random() < 0.6;
  if (useOptimal) {
    return minimaxBestMove(board);
  }
  return randomMove(board);
}

function randomMove(board: TicTacToeCell[]): number {
  const empty = board.map((cell, i) => cell === null ? i : -1).filter(i => i !== -1);
  return empty[Math.floor(Math.random() * empty.length)];
}

function minimaxBestMove(board: TicTacToeCell[]): number {
  let bestScore = -Infinity;
  let bestMove = -1;
  for (let i = 0; i < 9; i++) {
    if (board[i] !== null) continue;
    board[i] = 'O';
    const score = minimax(board, false);
    board[i] = null;
    if (score > bestScore) {
      bestScore = score;
      bestMove = i;
    }
  }
  return bestMove;
}

function minimax(board: TicTacToeCell[], isMaximizing: boolean): number {
  const winner = checkWinner(board);
  if (winner === 'O') return 1;
  if (winner === 'X') return -1;
  if (winner === 'draw') return 0;

  if (isMaximizing) {
    let best = -Infinity;
    for (let i = 0; i < 9; i++) {
      if (board[i] !== null) continue;
      board[i] = 'O';
      best = Math.max(best, minimax(board, false));
      board[i] = null;
    }
    return best;
  } else {
    let best = Infinity;
    for (let i = 0; i < 9; i++) {
      if (board[i] !== null) continue;
      board[i] = 'X';
      best = Math.min(best, minimax(board, true));
      board[i] = null;
    }
    return best;
  }
}

import { useState, useRef, useEffect } from 'react';
import { createEmptyBoard, checkWinner, getWinningLine, getPetMove, type TicTacToeCell, type TicTacToeResult } from '../models/miniGames';
import styles from './TicTacToe.module.css';

interface TicTacToeProps {
  onResult: (result: TicTacToeResult) => void;
}

export function TicTacToe({ onResult }: TicTacToeProps) {
  const [board, setBoard] = useState<TicTacToeCell[]>(createEmptyBoard);
  const [gameOver, setGameOver] = useState(false);
  const [petThinking, setPetThinking] = useState(false);
  const [winLine, setWinLine] = useState<[number, number, number] | null>(null);
  const [statusText, setStatusText] = useState('Your turn!');
  const petTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const onResultRef = useRef(onResult);
  onResultRef.current = onResult;

  useEffect(() => {
    return () => {
      if (petTimerRef.current) clearTimeout(petTimerRef.current);
    };
  }, []);

  function doPetMove(currentBoard: TicTacToeCell[]) {
    setPetThinking(true);
    setStatusText('Pet is thinking...');
    petTimerRef.current = setTimeout(() => {
      const move = getPetMove(currentBoard);
      const newBoard = [...currentBoard];
      newBoard[move] = 'O';
      setBoard(newBoard);
      setPetThinking(false);

      const winner = checkWinner(newBoard);
      if (winner) {
        setGameOver(true);
        if (winner === 'O') setWinLine(getWinningLine(newBoard));
        setStatusText(winner === 'O' ? 'Pet wins!' : "It's a draw!");
        const result: TicTacToeResult = winner === 'O' ? 'pet-won' : 'draw';
        setTimeout(() => onResultRef.current(result), 800);
      } else {
        setStatusText('Your turn!');
      }
    }, 800);
  }

  function handleCellTap(index: number) {
    if (board[index] !== null || petThinking || gameOver) return;

    const newBoard = [...board];
    newBoard[index] = 'X';
    setBoard(newBoard);

    const winner = checkWinner(newBoard);
    if (winner) {
      setGameOver(true);
      if (winner === 'X') setWinLine(getWinningLine(newBoard));
      setStatusText(winner === 'X' ? 'You won!' : "It's a draw!");
      const result: TicTacToeResult = winner === 'X' ? 'child-won' : 'draw';
      setTimeout(() => onResultRef.current(result), 800);
    } else {
      doPetMove(newBoard);
    }
  }

  return (
    <div className={styles.container}>
      <div className={`${styles.status} ${petThinking ? styles.thinking : ''}`}>
        {statusText}
      </div>
      <div className={styles.grid}>
        {board.map((cell, i) => (
          <button
            key={i}
            className={`${styles.cell} ${cell === 'X' ? styles.cellX : cell === 'O' ? styles.cellO : ''} ${winLine?.includes(i) ? styles.cellWin : ''}`}
            onClick={() => handleCellTap(i)}
            disabled={cell !== null || petThinking || gameOver}
          >
            {cell}
          </button>
        ))}
      </div>
    </div>
  );
}

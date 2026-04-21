import { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import {
  createEmptyBoard, checkWinner, getWinningLine, getPetMove,
  type TicTacToeCell, type TicTacToeResult,
} from '../models/miniGames';

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
    <View style={styles.container}>
      <Text style={[styles.status, petThinking && styles.thinking]}>{statusText}</Text>
      <View style={styles.grid}>
        {board.map((cell, i) => (
          <TouchableOpacity
            key={i}
            style={[
              styles.cell,
              cell === 'X' && styles.cellX,
              cell === 'O' && styles.cellO,
              winLine?.includes(i) && styles.cellWin,
            ]}
            onPress={() => handleCellTap(i)}
            disabled={cell !== null || petThinking || gameOver}
            activeOpacity={0.7}
          >
            <Text style={styles.cellText}>{cell ?? ''}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', gap: 16 },
  status: { fontSize: 18, fontWeight: '600', color: '#fff' },
  thinking: { color: '#f0e68c' },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: 240,
    gap: 4,
  },
  cell: {
    width: 76,
    height: 76,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.15)',
    borderRadius: 10,
  },
  cellX: { borderColor: '#3498db', backgroundColor: 'rgba(52,152,219,0.15)' },
  cellO: { borderColor: '#e74c3c', backgroundColor: 'rgba(231,76,60,0.15)' },
  cellWin: { backgroundColor: 'rgba(46,204,113,0.25)', borderColor: '#2ecc71' },
  cellText: { fontSize: 32, fontWeight: '700', color: '#fff' },
});

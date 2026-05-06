import { View, Text, StyleSheet } from 'react-native';
import { type StreakData } from '../models/types';

interface StreakDisplayProps {
  streak: StreakData;
  justCompleted?: boolean;
}

function getFlameEmoji(count: number): string {
  if (count >= 14) return '🔥🔥🔥';
  if (count >= 7) return '🔥🔥';
  if (count >= 1) return '🔥';
  return '🧊';
}

function getFlameSize(count: number): number {
  if (count >= 14) return 40;
  if (count >= 7) return 32;
  if (count >= 3) return 26;
  return 20;
}

export function StreakDisplay({ streak, justCompleted }: StreakDisplayProps) {
  const displayCount = streak.todayEarned ? streak.current + 1 : streak.current;

  return (
    <View style={styles.container}>
      <View style={styles.streakRow}>
        <Text style={{ fontSize: getFlameSize(displayCount) }}>{getFlameEmoji(displayCount)}</Text>
        <Text style={styles.count}>{displayCount}</Text>
        <Text style={styles.label}>day streak</Text>
      </View>
      {streak.best > 0 && streak.best > displayCount && (
        <Text style={styles.best}>Best: {streak.best} days</Text>
      )}
      {justCompleted && (
        <Text style={styles.celebration}>✨ All chores done! Day complete!</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 4,
  },
  streakRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  count: {
    fontSize: 21,
    fontWeight: '700',
    color: '#f0e68c',
  },
  label: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.4)',
  },
  best: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.3)',
  },
  celebration: {
    fontSize: 16,
    color: '#2ecc71',
    fontWeight: '600',
  },
});

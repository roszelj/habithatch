import { type StreakData } from '../models/types';
import styles from './StreakDisplay.module.css';

interface StreakDisplayProps {
  streak: StreakData;
  justCompleted?: boolean;
}

function getFlameSize(count: number): string {
  if (count >= 14) return styles.epic;
  if (count >= 7) return styles.large;
  if (count >= 3) return styles.medium;
  return styles.small;
}

function getFlameEmoji(count: number): string {
  if (count >= 14) return '\u{1F525}\u{1F525}\u{1F525}'; // 🔥🔥🔥
  if (count >= 7) return '\u{1F525}\u{1F525}';            // 🔥🔥
  if (count >= 1) return '\u{1F525}';                      // 🔥
  return '\u{1F9CA}';                                       // 🧊 (no streak)
}

export function StreakDisplay({ streak, justCompleted }: StreakDisplayProps) {
  const displayCount = streak.todayEarned ? streak.current + 1 : streak.current;

  return (
    <div className={styles.container}>
      <div className={styles.streakRow}>
        <span className={`${styles.flame} ${getFlameSize(displayCount)}`}>
          {getFlameEmoji(displayCount)}
        </span>
        <span className={styles.count}>{displayCount}</span>
        <span className={styles.label}>day streak</span>
      </div>
      {streak.best > 0 && streak.best > displayCount && (
        <div className={styles.best}>
          Best: {streak.best} days
        </div>
      )}
      {justCompleted && (
        <div className={styles.celebration}>
          {'\u{2728}'} All chores done! Day complete!
        </div>
      )}
    </div>
  );
}

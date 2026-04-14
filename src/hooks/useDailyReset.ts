import { useEffect, useRef, useCallback } from 'react';
import { type CategoryChores, type StreakData, isWeekend } from '../models/types';
import { evaluateStreak, resetChoresDone } from './useSaveData';

const CHECK_INTERVAL_MS = 60_000; // check every 60 seconds

export function getToday(): string {
  return new Date().toISOString().slice(0, 10);
}

interface DailyResetCallbacks {
  lastPlayedDate: string;
  streak: StreakData;
  weekdayChores: CategoryChores;
  weekendChores: CategoryChores;
  onReset: (weekdayChores: CategoryChores, weekendChores: CategoryChores, streak: StreakData, newDate: string) => void;
}

/**
 * Checks for day rollover via visibility change + periodic interval.
 * Calls onReset when a new day is detected mid-session.
 * Only resets the active day-type's chores (weekday or weekend).
 */
export function useDailyReset({ lastPlayedDate, streak, weekdayChores, weekendChores, onReset }: DailyResetCallbacks): { triggerReset: () => void } {
  const lastPlayedRef = useRef(lastPlayedDate);
  lastPlayedRef.current = lastPlayedDate;
  const streakRef = useRef(streak);
  streakRef.current = streak;
  const weekdayChoresRef = useRef(weekdayChores);
  weekdayChoresRef.current = weekdayChores;
  const weekendChoresRef = useRef(weekendChores);
  weekendChoresRef.current = weekendChores;
  const onResetRef = useRef(onReset);
  onResetRef.current = onReset;

  const checkAndReset = useCallback(() => {
    const today = getToday();
    if (lastPlayedRef.current === today) return;
    const newStreak = evaluateStreak(streakRef.current, lastPlayedRef.current, today);
    const weekend = isWeekend();
    const newWeekday = weekend ? weekdayChoresRef.current : resetChoresDone(weekdayChoresRef.current);
    const newWeekend = weekend ? resetChoresDone(weekendChoresRef.current) : weekendChoresRef.current;
    onResetRef.current(newWeekday, newWeekend, newStreak, today);
  }, []);

  // Visibility change: fires when user returns to tab/app
  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        checkAndReset();
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, [checkAndReset]);

  // Periodic interval as safety net
  useEffect(() => {
    const id = setInterval(checkAndReset, CHECK_INTERVAL_MS);
    return () => clearInterval(id);
  }, [checkAndReset]);

  return { triggerReset: checkAndReset };
}

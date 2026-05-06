/**
 * useDailyReset — React Native version
 *
 * Replaces document.visibilitychange with AppState (React Native's app
 * foreground/background lifecycle API). Behavior is identical: check for
 * a new day when the app comes to the foreground, plus a 60-second interval
 * as a safety net.
 */

import { useEffect, useRef, useCallback } from 'react';
import { AppState, type AppStateStatus } from 'react-native';
import { type CategoryChores, type StreakData, isWeekend } from '../models/types';
import { evaluateStreak, resetChoresDone } from './useSaveData';

const CHECK_INTERVAL_MS = 60_000;

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

  // AppState: fires when app returns to foreground (replaces document.visibilitychange)
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextState: AppStateStatus) => {
      if (nextState === 'active') {
        checkAndReset();
      }
    });
    return () => subscription.remove();
  }, [checkAndReset]);

  // Periodic interval as safety net
  useEffect(() => {
    const id = setInterval(checkAndReset, CHECK_INTERVAL_MS);
    return () => clearInterval(id);
  }, [checkAndReset]);

  return { triggerReset: checkAndReset };
}

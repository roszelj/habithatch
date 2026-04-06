import { describe, it, expect } from 'vitest';
import { allChoresComplete, createDefaultStreak, type CategoryChores, type StreakData } from '../src/models/types';
import { evaluateStreak } from '../src/hooks/useSaveData';

describe('allChoresComplete', () => {
  it('returns false when no chores exist', () => {
    const chores: CategoryChores = { morning: [], afternoon: [], evening: [] };
    expect(allChoresComplete(chores)).toBe(false);
  });

  it('returns true when all chores are approved', () => {
    const chores: CategoryChores = {
      morning: [{ id: '1', name: 'A', status: 'approved' }],
      afternoon: [{ id: '2', name: 'B', status: 'approved' }],
      evening: [{ id: '3', name: 'C', status: 'approved' }],
    };
    expect(allChoresComplete(chores)).toBe(true);
  });

  it('returns false when any chore is not approved', () => {
    const chores: CategoryChores = {
      morning: [{ id: '1', name: 'A', status: 'approved' }],
      afternoon: [{ id: '2', name: 'B', status: 'pending' }],
      evening: [],
    };
    expect(allChoresComplete(chores)).toBe(false);
  });

  it('returns true with chores in only one category all approved', () => {
    const chores: CategoryChores = {
      morning: [{ id: '1', name: 'A', status: 'approved' }],
      afternoon: [],
      evening: [],
    };
    expect(allChoresComplete(chores)).toBe(true);
  });
});

describe('evaluateStreak', () => {
  it('returns same streak on same day', () => {
    const streak: StreakData = { current: 5, best: 10, todayEarned: true };
    const result = evaluateStreak(streak, '2026-04-05', '2026-04-05');
    expect(result).toBe(streak);
  });

  it('continues streak when yesterday was earned', () => {
    const streak: StreakData = { current: 3, best: 5, todayEarned: true };
    const result = evaluateStreak(streak, '2026-04-05', '2026-04-06');
    expect(result.current).toBe(3);
    expect(result.todayEarned).toBe(false);
  });

  it('breaks streak when yesterday was NOT earned', () => {
    const streak: StreakData = { current: 3, best: 5, todayEarned: false };
    const result = evaluateStreak(streak, '2026-04-05', '2026-04-06');
    expect(result.current).toBe(0);
    expect(result.best).toBe(5);
  });

  it('breaks streak when multiple days missed', () => {
    const streak: StreakData = { current: 7, best: 7, todayEarned: true };
    const result = evaluateStreak(streak, '2026-04-03', '2026-04-06');
    expect(result.current).toBe(0);
  });

  it('preserves best streak across resets', () => {
    const streak: StreakData = { current: 0, best: 12, todayEarned: false };
    const result = evaluateStreak(streak, '2026-04-05', '2026-04-06');
    expect(result.best).toBe(12);
  });
});

import { describe, it, expect } from 'vitest';
import { allChoresComplete, type Chore, type CategoryChores } from '../src/models/types';

function chore(id: string, name: string, status: 'unchecked' | 'pending' | 'approved'): Chore {
  return { id, name, status };
}

describe('chore status states', () => {
  it('unchecked chore is not done', () => {
    const c = chore('1', 'A', 'unchecked');
    expect(c.status).toBe('unchecked');
  });

  it('pending chore is not approved', () => {
    const c = chore('1', 'A', 'pending');
    expect(c.status).not.toBe('approved');
  });

  it('approved chore counts as done', () => {
    const c = chore('1', 'A', 'approved');
    expect(c.status).toBe('approved');
  });
});

describe('allChoresComplete with 3-state', () => {
  it('returns true only when all are approved', () => {
    const chores: CategoryChores = {
      morning: [chore('1', 'A', 'approved')],
      afternoon: [chore('2', 'B', 'approved')],
      evening: [],
    };
    expect(allChoresComplete(chores)).toBe(true);
  });

  it('returns false when any chore is pending', () => {
    const chores: CategoryChores = {
      morning: [chore('1', 'A', 'approved')],
      afternoon: [chore('2', 'B', 'pending')],
      evening: [],
    };
    expect(allChoresComplete(chores)).toBe(false);
  });

  it('returns false when any chore is unchecked', () => {
    const chores: CategoryChores = {
      morning: [chore('1', 'A', 'unchecked')],
      afternoon: [],
      evening: [],
    };
    expect(allChoresComplete(chores)).toBe(false);
  });

  it('returns false with no chores', () => {
    const chores: CategoryChores = { morning: [], afternoon: [], evening: [] };
    expect(allChoresComplete(chores)).toBe(false);
  });
});

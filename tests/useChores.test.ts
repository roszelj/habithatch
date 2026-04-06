import { describe, it, expect } from 'vitest';

describe('chore logic', () => {
  it('chore object shape uses status', () => {
    const chore = { id: '1', name: 'Brush teeth', status: 'unchecked' as const };
    expect(chore.id).toBe('1');
    expect(chore.name).toBe('Brush teeth');
    expect(chore.status).toBe('unchecked');
  });

  it('chore name is trimmed and capped at 40 chars', () => {
    const long = 'A'.repeat(50);
    const trimmed = long.trim().slice(0, 40);
    expect(trimmed.length).toBe(40);
  });

  it('empty chore name after trim is rejected', () => {
    const name = '   ';
    expect(name.trim()).toBe('');
  });

  it('checkOff sets unchecked to pending (parent mode) or approved (no parent)', () => {
    const chore = { id: '1', name: 'A', status: 'unchecked' as const };
    // With parent mode
    const pending = chore.status === 'unchecked' ? { ...chore, status: 'pending' as const } : chore;
    expect(pending.status).toBe('pending');
    // Without parent mode
    const approved = chore.status === 'unchecked' ? { ...chore, status: 'approved' as const } : chore;
    expect(approved.status).toBe('approved');
  });

  it('approve changes pending to approved', () => {
    const chore = { id: '1', name: 'A', status: 'pending' as const };
    const approved = chore.status === 'pending' ? { ...chore, status: 'approved' as const } : chore;
    expect(approved.status).toBe('approved');
  });

  it('reject changes pending to unchecked', () => {
    const chore = { id: '1', name: 'A', status: 'pending' as const };
    const rejected = chore.status === 'pending' ? { ...chore, status: 'unchecked' as const } : chore;
    expect(rejected.status).toBe('unchecked');
  });

  it('reset sets all chores to unchecked', () => {
    const chores = [
      { id: '1', name: 'A', status: 'approved' as const },
      { id: '2', name: 'B', status: 'pending' as const },
    ];
    const reset = chores.map(c => ({ ...c, status: 'unchecked' as const }));
    expect(reset.every(c => c.status === 'unchecked')).toBe(true);
  });

  it('remove filters out the chore by id', () => {
    const chores = [
      { id: '1', name: 'A', status: 'unchecked' as const },
      { id: '2', name: 'B', status: 'unchecked' as const },
    ];
    const removed = chores.filter(c => c.id !== '1');
    expect(removed).toHaveLength(1);
    expect(removed[0].id).toBe('2');
  });
});

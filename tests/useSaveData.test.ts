import { describe, it, expect, beforeEach, vi } from 'vitest';
import { SAVE_KEY, APP_DATA_KEY } from '../src/models/types';

const store: Record<string, string> = {};
const localStorageMock = {
  getItem: (key: string) => store[key] ?? null,
  setItem: (key: string, value: string) => { store[key] = value; },
  removeItem: (key: string) => { delete store[key]; },
};

vi.stubGlobal('localStorage', localStorageMock);

const { loadAppData, writeAppData, clearAllData } = await import('../src/hooks/useSaveData');

beforeEach(() => {
  for (const key of Object.keys(store)) delete store[key];
});

describe('save/load (v2)', () => {
  it('returns null when no save exists', () => {
    expect(loadAppData()).toBeNull();
  });

  it('loads v2 app data', () => {
    const data = {
      version: 2,
      parentPin: null,
      profiles: [{
        id: '1', creatureType: 'cat', creatureName: 'Whiskers',
        health: 75, points: { morning: 10, afternoon: 5, evening: 8 },
        chores: { morning: [], afternoon: [], evening: [] },
        outfitId: null, accessoryId: null,
        streak: { current: 0, best: 0, todayEarned: false },
        lastPlayedDate: new Date().toISOString().slice(0, 10),
      }],
    };
    store[APP_DATA_KEY] = JSON.stringify(data);
    const loaded = loadAppData()!;
    expect(loaded.profiles).toHaveLength(1);
    expect(loaded.profiles[0].health).toBe(75);
  });

  it('migrates v1 to v2', () => {
    const oldData = {
      creatureType: 'dog', creatureName: 'Buddy', health: 60,
      points: { morning: 5, afternoon: 5, evening: 5 },
      chores: { morning: [{ id: '1', name: 'A', done: true }], afternoon: [], evening: [] },
      lastPlayedDate: new Date().toISOString().slice(0, 10),
      parentPin: '9999',
    };
    store[SAVE_KEY] = JSON.stringify(oldData);
    const loaded = loadAppData()!;
    expect(loaded.version).toBe(2);
    expect(loaded.parentPin).toBe('9999');
    expect(loaded.profiles[0].creatureName).toBe('Buddy');
  });

  it('clearAllData removes everything', () => {
    store[APP_DATA_KEY] = 'x';
    store[SAVE_KEY] = 'y';
    clearAllData();
    expect(store[APP_DATA_KEY]).toBeUndefined();
    expect(store[SAVE_KEY]).toBeUndefined();
  });
});

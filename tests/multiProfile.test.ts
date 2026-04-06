import { describe, it, expect, beforeEach, vi } from 'vitest';
import { SAVE_KEY, APP_DATA_KEY, type AppData, type ChildProfile } from '../src/models/types';

const store: Record<string, string> = {};
vi.stubGlobal('localStorage', {
  getItem: (key: string) => store[key] ?? null,
  setItem: (key: string, value: string) => { store[key] = value; },
  removeItem: (key: string) => { delete store[key]; },
});

const { loadAppData, writeAppData, addProfile, removeProfile, clearAllData } =
  await import('../src/hooks/useSaveData');

beforeEach(() => {
  for (const key of Object.keys(store)) delete store[key];
});

function makeProfile(id: string, name: string): ChildProfile {
  return {
    id,
    creatureType: 'cat',
    creatureName: name,
    health: 100,
    points: { morning: 2, afternoon: 2, evening: 2 },
    chores: { morning: [], afternoon: [], evening: [] },
    outfitId: null,
    accessoryId: null,
    streak: { current: 0, best: 0, todayEarned: false },
    lastPlayedDate: new Date().toISOString().slice(0, 10),
  };
}

describe('multi-profile data', () => {
  it('returns null with no saved data', () => {
    expect(loadAppData()).toBeNull();
  });

  it('loads v2 app data', () => {
    const data: AppData = {
      version: 2,
      parentPin: null,
      profiles: [makeProfile('1', 'Whiskers')],
    };
    store[APP_DATA_KEY] = JSON.stringify(data);
    const loaded = loadAppData()!;
    expect(loaded.profiles).toHaveLength(1);
    expect(loaded.profiles[0].creatureName).toBe('Whiskers');
  });

  it('migrates v1 save data to v2', () => {
    const oldData = {
      creatureType: 'dog',
      creatureName: 'Buddy',
      health: 75,
      points: { morning: 10, afternoon: 5, evening: 8 },
      chores: { morning: [], afternoon: [], evening: [] },
      outfitId: 'cape',
      accessoryId: null,
      streak: { current: 3, best: 5, todayEarned: false },
      parentPin: '1234',
      lastPlayedDate: new Date().toISOString().slice(0, 10),
    };
    store[SAVE_KEY] = JSON.stringify(oldData);
    const loaded = loadAppData()!;
    expect(loaded.version).toBe(2);
    expect(loaded.parentPin).toBe('1234');
    expect(loaded.profiles).toHaveLength(1);
    expect(loaded.profiles[0].creatureName).toBe('Buddy');
    expect(loaded.profiles[0].health).toBe(75);
    // Old key should be removed
    expect(store[SAVE_KEY]).toBeUndefined();
  });

  it('addProfile adds a new profile', () => {
    const data: AppData = { version: 2, parentPin: null, profiles: [makeProfile('1', 'A')] };
    const updated = addProfile(data, makeProfile('2', 'B'));
    expect(updated.profiles).toHaveLength(2);
  });

  it('removeProfile removes by id', () => {
    const data: AppData = { version: 2, parentPin: null, profiles: [makeProfile('1', 'A'), makeProfile('2', 'B')] };
    const updated = removeProfile(data, '1');
    expect(updated.profiles).toHaveLength(1);
    expect(updated.profiles[0].id).toBe('2');
  });

  it('clearAllData removes everything', () => {
    store[APP_DATA_KEY] = 'data';
    store[SAVE_KEY] = 'old';
    clearAllData();
    expect(store[APP_DATA_KEY]).toBeUndefined();
    expect(store[SAVE_KEY]).toBeUndefined();
  });
});

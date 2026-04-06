import { describe, it, expect } from 'vitest';
import {
  CREATURE_SPRITES,
  DEFAULT_NAMES,
  CREATURE_LABELS,
  ALL_CREATURE_TYPES,
  type Mood,
} from '../src/models/types';

const ALL_MOODS: Mood[] = ['happy', 'neutral', 'sad', 'distressed'];

describe('creature type sprites', () => {
  it('defines exactly 4 creature types', () => {
    expect(ALL_CREATURE_TYPES).toHaveLength(4);
    expect(ALL_CREATURE_TYPES).toEqual(['bird', 'turtle', 'cat', 'dog']);
  });

  it('has sprites for all 16 type/mood combinations', () => {
    for (const type of ALL_CREATURE_TYPES) {
      for (const mood of ALL_MOODS) {
        expect(CREATURE_SPRITES[type][mood]).toBeTruthy();
        expect(typeof CREATURE_SPRITES[type][mood]).toBe('string');
      }
    }
  });

  it('has no duplicate sprites across types for the same mood', () => {
    for (const mood of ALL_MOODS) {
      const sprites = ALL_CREATURE_TYPES.map(t => CREATURE_SPRITES[t][mood]);
      const unique = new Set(sprites);
      expect(unique.size).toBe(sprites.length);
    }
  });

  it('has a default name for every creature type', () => {
    for (const type of ALL_CREATURE_TYPES) {
      expect(DEFAULT_NAMES[type]).toBeTruthy();
      expect(DEFAULT_NAMES[type].length).toBeGreaterThan(0);
      expect(DEFAULT_NAMES[type].length).toBeLessThanOrEqual(20);
    }
  });

  it('has a label for every creature type', () => {
    for (const type of ALL_CREATURE_TYPES) {
      expect(CREATURE_LABELS[type]).toBeTruthy();
    }
  });
});

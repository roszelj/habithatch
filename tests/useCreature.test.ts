import { describe, it, expect } from 'vitest';
import { creatureReducer, createInitialState } from '../src/hooks/useCreature';
import { getMood, INITIAL_POINTS_PER_CATEGORY, MAX_POINTS, createDefaultPoints } from '../src/models/types';

const INIT = createInitialState('Gucci', 'cat');

describe('creatureReducer — per-category points', () => {
  it('creates initial state with per-category points', () => {
    expect(INIT.health).toBe(100);
    expect(INIT.points.morning).toBe(INITIAL_POINTS_PER_CATEGORY);
    expect(INIT.points.afternoon).toBe(INITIAL_POINTS_PER_CATEGORY);
    expect(INIT.points.evening).toBe(INITIAL_POINTS_PER_CATEGORY);
  });

  it('morning action deducts from morning points only', () => {
    const s = { ...INIT, health: 50, points: { morning: 10, afternoon: 10, evening: 10 } };
    const r = creatureReducer(s, { type: 'morning' });
    expect(r.points.morning).toBe(7); // -3
    expect(r.points.afternoon).toBe(10); // unchanged
    expect(r.points.evening).toBe(10); // unchanged
    expect(r.health).toBe(60); // +10
  });

  it('afternoon action deducts from afternoon points only', () => {
    const s = { ...INIT, health: 50, points: { morning: 10, afternoon: 10, evening: 10 } };
    const r = creatureReducer(s, { type: 'afternoon' });
    expect(r.points.afternoon).toBe(5); // -5
    expect(r.health).toBe(65); // +15
  });

  it('evening action deducts from evening points only', () => {
    const s = { ...INIT, health: 50, points: { morning: 10, afternoon: 10, evening: 10 } };
    const r = creatureReducer(s, { type: 'evening' });
    expect(r.points.evening).toBe(2); // -8
    expect(r.health).toBe(75); // +25
  });

  it('action refused when category has insufficient points', () => {
    const s = { ...INIT, health: 50, points: { morning: 1, afternoon: 10, evening: 10 } };
    const r = creatureReducer(s, { type: 'morning' }); // costs 3
    expect(r).toBe(s);
  });

  it('earn adds to specific category', () => {
    const r = creatureReducer(INIT, { type: 'earn', category: 'afternoon', amount: 5 });
    expect(r.points.afternoon).toBe(INITIAL_POINTS_PER_CATEGORY + 5);
    expect(r.points.morning).toBe(INITIAL_POINTS_PER_CATEGORY); // unchanged
  });

  it('load replaces entire state', () => {
    const newState = createInitialState('Buddy', 'dog', 65, { morning: 20, afternoon: 15, evening: 10 });
    const r = creatureReducer(INIT, { type: 'load', state: newState });
    expect(r).toEqual(newState);
  });

  it('decay reduces health', () => {
    const r = creatureReducer(INIT, { type: 'decay', delta: 10000 });
    expect(r.health).toBe(98);
  });
});

describe('getMood — health-based', () => {
  const s = (health: number) => ({ ...INIT, health });
  it('happy at >= 60', () => expect(getMood(s(60))).toBe('happy'));
  it('neutral at 30-59', () => expect(getMood(s(50))).toBe('neutral'));
  it('sad at 10-29', () => expect(getMood(s(20))).toBe('sad'));
  it('distressed at < 10', () => expect(getMood(s(5))).toBe('distressed'));
});

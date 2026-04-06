import { describe, it, expect } from 'vitest';
import { OUTFITS, ACCESSORIES, getOutfitById, getAccessoryById } from '../src/models/outfits';

describe('outfit catalog', () => {
  it('has at least 5 outfits', () => {
    expect(OUTFITS.length).toBeGreaterThanOrEqual(5);
  });

  it('each outfit has id, name, emoji', () => {
    for (const o of OUTFITS) {
      expect(o.id).toBeTruthy();
      expect(o.name).toBeTruthy();
      expect(o.emoji).toBeTruthy();
    }
  });

  it('outfit ids are unique', () => {
    const ids = OUTFITS.map(o => o.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('getOutfitById returns correct outfit', () => {
    expect(getOutfitById('cape')?.name).toBe('Superhero Cape');
    expect(getOutfitById(null)).toBeNull();
    expect(getOutfitById('nonexistent')).toBeNull();
  });
});

describe('accessory catalog', () => {
  it('has at least 5 accessories', () => {
    expect(ACCESSORIES.length).toBeGreaterThanOrEqual(5);
  });

  it('each accessory has id, name, emoji', () => {
    for (const a of ACCESSORIES) {
      expect(a.id).toBeTruthy();
      expect(a.name).toBeTruthy();
      expect(a.emoji).toBeTruthy();
    }
  });

  it('accessory ids are unique', () => {
    const ids = ACCESSORIES.map(a => a.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('getAccessoryById returns correct accessory', () => {
    expect(getAccessoryById('sunglasses')?.name).toBe('Sunglasses');
    expect(getAccessoryById(null)).toBeNull();
  });
});

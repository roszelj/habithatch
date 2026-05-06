import { type Outfit, type Accessory, type OutfitId, type AccessoryId } from './types';

export const OUTFITS: Outfit[] = [
  { id: 'cape', name: 'Superhero Cape', emoji: '\u{1F9B8}', price: 20 },
  { id: 'pajamas', name: 'Cozy Pajamas', emoji: '\u{1F6CC}', price: 15 },
  { id: 'party', name: 'Party Outfit', emoji: '\u{1F389}', price: 25 },
  { id: 'sports', name: 'Sports Jersey', emoji: '\u{1F3C5}', price: 20 },
  { id: 'overalls', name: 'Overalls', emoji: '\u{1F455}', price: 15 },
];

export const ACCESSORIES: Accessory[] = [
  { id: 'sunglasses', name: 'Sunglasses', emoji: '\u{1F576}\u{FE0F}', price: 12 },
  { id: 'bowtie', name: 'Bow Tie', emoji: '\u{1F380}', price: 10 },
  { id: 'crown', name: 'Flower Crown', emoji: '\u{1F33A}', price: 15 },
  { id: 'cap', name: 'Baseball Cap', emoji: '\u{1F9E2}', price: 12 },
  { id: 'scarf', name: 'Scarf', emoji: '\u{1F9E3}', price: 10 },
];

export function getOutfitById(id: OutfitId | null): Outfit | null {
  if (!id) return null;
  return OUTFITS.find(o => o.id === id) ?? null;
}

export function getAccessoryById(id: AccessoryId | null): Accessory | null {
  if (!id) return null;
  return ACCESSORIES.find(a => a.id === id) ?? null;
}

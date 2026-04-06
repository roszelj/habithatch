export type Mood = 'happy' | 'neutral' | 'sad' | 'distressed';

export type CreatureType = 'bird' | 'turtle' | 'cat' | 'dog';

export type TimeActionType = 'morning' | 'afternoon' | 'evening';

export const ALL_TIME_ACTIONS: TimeActionType[] = ['morning', 'afternoon', 'evening'];

export interface CategoryPoints {
  morning: number;
  afternoon: number;
  evening: number;
}

export interface CreatureState {
  name: string;
  creatureType: CreatureType;
  health: number;
  points: CategoryPoints;
}

export interface TimeAction {
  type: TimeActionType;
  label: string;
  emoji: string;
  cost: number;
  healthRestore: number;
}

export const TIME_ACTIONS: TimeAction[] = [
  { type: 'morning', label: 'Morning', emoji: '\u{1F305}', cost: 3, healthRestore: 10 },
  { type: 'afternoon', label: 'Afternoon', emoji: '\u{2600}\u{FE0F}', cost: 5, healthRestore: 15 },
  { type: 'evening', label: 'Evening', emoji: '\u{1F319}', cost: 8, healthRestore: 25 },
];

export type ChoreStatus = 'unchecked' | 'pending' | 'approved';

export interface Chore {
  id: string;
  name: string;
  status: ChoreStatus;
}

// Backward compat: treat approved as "done" for legacy logic
export function isDone(chore: Chore): boolean {
  return chore.status === 'approved';
}

export interface CategoryChores {
  morning: Chore[];
  afternoon: Chore[];
  evening: Chore[];
}

export type CreatureAction =
  | { type: 'morning' }
  | { type: 'afternoon' }
  | { type: 'evening' }
  | { type: 'decay'; delta: number }
  | { type: 'earn'; category: TimeActionType; amount: number }
  | { type: 'load'; state: CreatureState };

export type OutfitId = string;
export type AccessoryId = string;

export interface Outfit {
  id: OutfitId;
  name: string;
  emoji: string;
  price: number;
}

export interface Accessory {
  id: AccessoryId;
  name: string;
  emoji: string;
  price: number;
}

export interface StreakData {
  current: number;
  best: number;
  todayEarned: boolean;
}

export function createDefaultStreak(): StreakData {
  return { current: 0, best: 0, todayEarned: false };
}

export function allChoresComplete(chores: CategoryChores): boolean {
  const all = [...chores.morning, ...chores.afternoon, ...chores.evening];
  return all.length > 0 && all.every(c => c.status === 'approved');
}

// Legacy single-profile format (for migration)
export interface SaveData {
  creatureType: CreatureType;
  creatureName: string;
  health: number;
  points: CategoryPoints;
  chores: CategoryChores;
  outfitId: OutfitId | null;
  accessoryId: AccessoryId | null;
  streak: StreakData;
  parentPin: string | null;
  lastPlayedDate: string;
}

export interface BonusNotification {
  id: string;
  category: TimeActionType;
  amount: number;
  reason: string;
  timestamp: string;
}

export interface ChildProfile {
  id: string;
  creatureType: CreatureType;
  creatureName: string;
  health: number;
  points: CategoryPoints;
  coins: number;
  chores: CategoryChores;
  outfitId: OutfitId | null;
  accessoryId: AccessoryId | null;
  ownedOutfits: OutfitId[];
  ownedAccessories: AccessoryId[];
  streak: StreakData;
  notifications: BonusNotification[];
  redeemedRewards: RedeemedReward[];
  lastPlayedDate: string;
}

export const MAX_COINS = 9999;

export interface RewardPresent {
  id: string;
  name: string;
  price: number;
}

export interface RedeemedReward {
  id: string;
  rewardId: string;
  rewardName: string;
  timestamp: string;
  fulfilled: boolean;
}

export interface AppData {
  version: 2;
  parentPin: string | null;
  profiles: ChildProfile[];
  rewardPresents: RewardPresent[];
}

export const MAX_PROFILES = 8;

export const PIN_SAVE_KEY = 'terragucci_pin';
export const APP_DATA_KEY = 'terragucci_v2';

export const CREATURE_SPRITES: Record<CreatureType, Record<Mood, string>> = {
  bird: {
    happy: '\u{1F426}',
    neutral: '\u{1F425}',
    sad: '\u{1FAB6}',
    distressed: '\u{1F4A8}',
  },
  turtle: {
    happy: '\u{1F422}',
    neutral: '\u{1F40C}',
    sad: '\u{1F614}',
    distressed: '\u{1F4A6}',
  },
  cat: {
    happy: '\u{1F63A}',
    neutral: '\u{1F63C}',
    sad: '\u{1F63F}',
    distressed: '\u{1F640}',
  },
  dog: {
    happy: '\u{1F436}',
    neutral: '\u{1F415}',
    sad: '\u{1F97A}',
    distressed: '\u{1F4A7}',
  },
};

export const DEFAULT_NAMES: Record<CreatureType, string> = {
  bird: 'Tweety',
  turtle: 'Shelly',
  cat: 'Whiskers',
  dog: 'Buddy',
};

export const CREATURE_LABELS: Record<CreatureType, string> = {
  bird: 'Bird',
  turtle: 'Turtle',
  cat: 'Cat',
  dog: 'Dog',
};

export const ALL_CREATURE_TYPES: CreatureType[] = ['bird', 'turtle', 'cat', 'dog'];

export function getMood(state: CreatureState): Mood {
  const { health } = state;
  if (health < 10) return 'distressed';
  if (health < 30) return 'sad';
  if (health < 60) return 'neutral';
  return 'happy';
}

export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, Math.round(value)));
}

export const MAX_POINTS = 999;
export const POINTS_PER_CHORE = 5;
export const INITIAL_POINTS_PER_CATEGORY = 2;
export const HEALTH_DECAY_RATE = 2 / 10;

export function createDefaultPoints(): CategoryPoints {
  return { morning: INITIAL_POINTS_PER_CATEGORY, afternoon: INITIAL_POINTS_PER_CATEGORY, evening: INITIAL_POINTS_PER_CATEGORY };
}

export function createDefaultChores(): CategoryChores {
  return { morning: [], afternoon: [], evening: [] };
}

export const SAVE_KEY = 'terragucci_save';

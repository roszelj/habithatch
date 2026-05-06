export type Mood = 'happy' | 'neutral' | 'sad' | 'distressed';

export type CreatureType =
  // Pack 1
  | 'corgi' | 'husky'
  | 'panda' | 'chick' | 'bunny'
  | 'calico' | 'tiger' | 'monkey'
  // Pack 2
  | 'sloth' | 'dragon' | 'snake'
  | 'gecko' | 'cockatoo' | 'fish'
  | 'giraffe' | 'elephant' | 'leopard';

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
  | { type: 'feed' }
  | { type: 'decay'; delta: number }
  | { type: 'earn'; category: TimeActionType; amount: number }
  | { type: 'load'; state: CreatureState };

export type OutfitId = string;
export type AccessoryId = string;
export type HabitatId = string;

export interface Habitat {
  id: HabitatId;
  name: string;
  image: string;  // path to PNG, e.g. '/creature-habitats/02_beach.png'
  price: number;
}

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
  childName: string | null;
  creatureType: CreatureType;
  creatureName: string;
  health: number;
  points: CategoryPoints;
  coins: number;
  weekdayChores: CategoryChores;
  weekendChores: CategoryChores;
  outfitId: OutfitId | null;
  accessoryId: AccessoryId | null;
  ownedOutfits: OutfitId[];
  ownedAccessories: AccessoryId[];
  habitatId: HabitatId | null;
  ownedHabitats: HabitatId[];
  chorePointsPerCategory?: CategoryPoints;
  streak: StreakData;
  notifications: BonusNotification[];
  redeemedRewards: RedeemedReward[];
  lastPlayedDate: string;
  fcmTokens?: string[];
  isPaused?: boolean;
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

export const DEFAULT_NAMES: Record<CreatureType, string> = {
  corgi:    'Biscuit',
  husky:    'Blizzard',
  panda:    'Dumpling',
  chick:    'Peep',
  bunny:    'Cotton',
  calico:   'Patches',
  tiger:    'Stripes',
  monkey:   'Bongo',
  sloth:    'Mochi',
  dragon:   'Ember',
  snake:    'Noodle',
  gecko:    'Zigzag',
  cockatoo: 'Sunny',
  fish:     'Bubbles',
  giraffe:  'Stilts',
  elephant: 'Peanut',
  leopard:  'Dot',
};

export const CREATURE_LABELS: Record<CreatureType, string> = {
  corgi:    'Corgi',
  husky:    'Husky',
  panda:    'Panda',
  chick:    'Chick',
  bunny:    'Bunny',
  calico:   'Calico',
  tiger:    'Tiger',
  monkey:   'Monkey',
  sloth:    'Sloth',
  dragon:   'Dragon',
  snake:    'Snake',
  gecko:    'Gecko',
  cockatoo: 'Cockatoo',
  fish:     'Goldfish',
  giraffe:  'Giraffe',
  elephant: 'Elephant',
  leopard:  'Leopard',
};

export const ALL_CREATURE_TYPES: CreatureType[] = [
  'corgi', 'husky', 'panda', 'chick', 'bunny',
  'calico', 'tiger', 'monkey',
  'sloth', 'dragon', 'snake', 'gecko', 'cockatoo', 'fish',
  'giraffe', 'elephant', 'leopard',
];

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

export const DEFAULT_CHORE_POINTS: CategoryPoints = { morning: POINTS_PER_CHORE, afternoon: POINTS_PER_CHORE, evening: POINTS_PER_CHORE };

export function getChorePoints(profile: ChildProfile, category: TimeActionType): number {
  return profile.chorePointsPerCategory?.[category] ?? POINTS_PER_CHORE;
}
export const INITIAL_POINTS_PER_CATEGORY = 2;
export const HEALTH_DECAY_RATE = 2 / 10;
export const FEED_COIN_COST = 2;
export const FEED_HEALTH_RESTORE = 10;

export function createDefaultPoints(): CategoryPoints {
  return { morning: INITIAL_POINTS_PER_CATEGORY, afternoon: INITIAL_POINTS_PER_CATEGORY, evening: INITIAL_POINTS_PER_CATEGORY };
}

export function createDefaultChores(): CategoryChores {
  return { morning: [], afternoon: [], evening: [] };
}

export function isWeekend(): boolean {
  const day = new Date().getDay();
  return day === 0 || day === 6;
}

export function getCurrentPeriod(): TimeActionType {
  const hour = new Date().getHours();
  if (hour < 12) return 'morning';
  if (hour < 18) return 'afternoon';
  return 'evening';
}

export function getActiveChores(profile: ChildProfile): CategoryChores {
  return isWeekend() ? profile.weekendChores : profile.weekdayChores;
}

export const SAVE_KEY = 'terragucci_save';

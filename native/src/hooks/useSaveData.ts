/**
 * useSaveData — React Native version
 *
 * Replaces localStorage with AsyncStorage.
 * All async reads/writes are exposed; callers must await them.
 * Synchronous stubs (loadAppData / writeAppData) are removed because
 * AsyncStorage is always async. Use loadAppDataAsync / writeAppDataAsync instead.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  type AppData, type ChildProfile, type CategoryChores, type StreakData, type CreatureType,
  type HabitatId,
  SAVE_KEY, APP_DATA_KEY,
  createDefaultPoints, createDefaultChores, createDefaultStreak, isWeekend,
} from '../models/types';
import { HABITATS } from '../models/habitats';

const VALID_HABITAT_IDS = new Set<HabitatId>(HABITATS.map(h => h.id));

const LEGACY_CREATURE_MAP: Record<string, CreatureType> = {
  bird: 'chick', turtle: 'gecko', cat: 'calico', dog: 'corgi',
};

function migrateCreatureType(type: string): CreatureType {
  return (LEGACY_CREATURE_MAP[type] ?? type) as CreatureType;
}

function getToday(): string {
  return new Date().toISOString().slice(0, 10);
}

export function resetChoresDone(chores: CategoryChores): CategoryChores {
  return {
    morning: chores.morning.map(c => ({ ...c, status: 'unchecked' as const })),
    afternoon: chores.afternoon.map(c => ({ ...c, status: 'unchecked' as const })),
    evening: chores.evening.map(c => ({ ...c, status: 'unchecked' as const })),
  };
}

function isConsecutiveDay(lastDate: string, today: string): boolean {
  const last = new Date(lastDate + 'T00:00:00');
  const now = new Date(today + 'T00:00:00');
  const diff = (now.getTime() - last.getTime()) / (1000 * 60 * 60 * 24);
  return diff === 1;
}

export function evaluateStreak(
  streak: StreakData,
  lastPlayedDate: string,
  today: string,
): StreakData {
  if (lastPlayedDate === today) return streak;
  if (isConsecutiveDay(lastPlayedDate, today)) {
    if (streak.todayEarned) {
      return { current: streak.current, best: streak.best, todayEarned: false };
    }
    return { current: 0, best: streak.best, todayEarned: false };
  }
  return { current: 0, best: streak.best, todayEarned: false };
}

function migrateChores(chores: any): CategoryChores {
  if (!chores || !Array.isArray(chores.morning)) return createDefaultChores();
  for (const cat of ['morning', 'afternoon', 'evening'] as const) {
    chores[cat] = (chores[cat] || []).map((c: any) => {
      if ('done' in c && !('status' in c)) {
        return { id: c.id, name: c.name, status: c.done ? 'approved' : 'unchecked' };
      }
      return c;
    });
  }
  return chores;
}

export function migrateProfileChores(profile: any): any {
  if (profile.weekdayChores && profile.weekendChores) return profile;
  if (profile.chores) {
    const { chores, ...rest } = profile;
    return { ...rest, weekdayChores: chores, weekendChores: createDefaultChores() };
  }
  return { ...profile, weekdayChores: createDefaultChores(), weekendChores: createDefaultChores() };
}

function applyDailyReset(profile: ChildProfile): ChildProfile {
  const today = getToday();
  if (profile.lastPlayedDate === today) return profile;
  const weekend = isWeekend();
  return {
    ...profile,
    streak: evaluateStreak(profile.streak, profile.lastPlayedDate, today),
    weekdayChores: weekend ? profile.weekdayChores : resetChoresDone(profile.weekdayChores),
    weekendChores: weekend ? resetChoresDone(profile.weekendChores) : profile.weekendChores,
    lastPlayedDate: today,
  };
}

// Migrate old single-profile SaveData to new AppData format
async function migrateFromV1(): Promise<AppData | null> {
  try {
    const raw = await AsyncStorage.getItem(SAVE_KEY);
    if (!raw) return null;
    const old = JSON.parse(raw);
    if (!old.creatureType || !old.creatureName) return null;

    const profile: ChildProfile = {
      id: '1',
      childName: null,
      creatureType: migrateCreatureType(old.creatureType),
      creatureName: old.creatureName,
      health: typeof old.health === 'number' ? old.health : 100,
      points: old.points?.morning != null ? old.points : createDefaultPoints(),
      coins: 0,
      weekdayChores: migrateChores(old.chores),
      weekendChores: createDefaultChores(),
      outfitId: old.outfitId ?? null,
      accessoryId: old.accessoryId ?? null,
      ownedOutfits: old.outfitId ? [old.outfitId] : [],
      ownedAccessories: old.accessoryId ? [old.accessoryId] : [],
      habitatId: null,
      ownedHabitats: [],
      streak: old.streak ?? createDefaultStreak(),
      notifications: [],
      redeemedRewards: [],
      lastPlayedDate: old.lastPlayedDate || getToday(),
    };

    const appData: AppData = {
      version: 2,
      parentPin: old.parentPin ?? null,
      profiles: [applyDailyReset(profile)],
      rewardPresents: [],
    };

    await AsyncStorage.setItem(APP_DATA_KEY, JSON.stringify(appData));
    await AsyncStorage.removeItem(SAVE_KEY);
    return appData;
  } catch {
    return null;
  }
}

export async function loadAppDataAsync(): Promise<AppData | null> {
  try {
    const raw = await AsyncStorage.getItem(APP_DATA_KEY);
    if (raw) {
      const data: AppData = JSON.parse(raw);
      if (data.version === 2 && Array.isArray(data.profiles)) {
        data.profiles = data.profiles.map(p => {
          const migrated = migrateProfileChores({ ...p, creatureType: migrateCreatureType(p.creatureType as string) });
          const reset = applyDailyReset(migrated);
          const habitatId = reset.habitatId != null && VALID_HABITAT_IDS.has(reset.habitatId) ? reset.habitatId : null;
          const ownedHabitats = (reset.ownedHabitats ?? []).filter((id: HabitatId) => VALID_HABITAT_IDS.has(id));
          return { ...reset, childName: reset.childName ?? null, habitatId, ownedHabitats };
        });
        if (!data.rewardPresents) data.rewardPresents = [];
        return data;
      }
    }
    return await migrateFromV1();
  } catch {
    return migrateFromV1();
  }
}

export async function writeAppDataAsync(data: AppData): Promise<void> {
  try {
    await AsyncStorage.setItem(APP_DATA_KEY, JSON.stringify(data));
  } catch {
    // silently fail
  }
}

export async function saveProfileAsync(appData: AppData, profile: ChildProfile): Promise<AppData> {
  const updated = {
    ...appData,
    profiles: appData.profiles.map(p =>
      p.id === profile.id ? { ...profile, lastPlayedDate: getToday() } : p
    ),
  };
  await writeAppDataAsync(updated);
  return updated;
}

export async function addProfileAsync(appData: AppData, profile: ChildProfile): Promise<AppData> {
  const updated = { ...appData, profiles: [...appData.profiles, profile] };
  await writeAppDataAsync(updated);
  return updated;
}

export async function removeProfileAsync(appData: AppData, profileId: string): Promise<AppData> {
  const updated = { ...appData, profiles: appData.profiles.filter(p => p.id !== profileId) };
  await writeAppDataAsync(updated);
  return updated;
}

export async function clearAllDataAsync(): Promise<void> {
  try {
    await AsyncStorage.multiRemove([APP_DATA_KEY, SAVE_KEY]);
  } catch {
    // ignore
  }
}

let _nextProfileId = Date.now();
export function generateProfileId(): string {
  return String(_nextProfileId++);
}

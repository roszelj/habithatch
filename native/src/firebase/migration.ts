/**
 * Local → Cloud migration — React Native version
 * Uses async useSaveData functions (AsyncStorage).
 */

import { loadAppDataAsync, clearAllDataAsync } from '../hooks/useSaveData';
import { createCloudProfile } from './profiles';
import { updateFamilyRewards, updateFamilyPin } from './families';
import { type CreatureType } from '../models/types';

const LEGACY_CREATURE_MAP: Record<string, CreatureType> = {
  bird: 'chick',
  turtle: 'gecko',
  cat: 'calico',
  dog: 'corgi',
};

export function migrateCreatureType(type: string): CreatureType {
  return (LEGACY_CREATURE_MAP[type] ?? type) as CreatureType;
}

export async function hasLocalData(): Promise<boolean> {
  const data = await loadAppDataAsync();
  return data !== null && data.profiles.length > 0;
}

export async function migrateLocalToCloud(familyId: string): Promise<number> {
  const data = await loadAppDataAsync();
  if (!data || data.profiles.length === 0) return 0;

  for (const profile of data.profiles) {
    await createCloudProfile(familyId, profile);
  }

  if (data.rewardPresents && data.rewardPresents.length > 0) {
    await updateFamilyRewards(familyId, data.rewardPresents);
  }

  if (data.parentPin) {
    await updateFamilyPin(familyId, data.parentPin);
  }

  await clearAllDataAsync();

  return data.profiles.length;
}

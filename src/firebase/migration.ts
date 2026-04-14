import { loadAppData, clearAllData } from '../hooks/useSaveData';
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

export function hasLocalData(): boolean {
  const data = loadAppData();
  return data !== null && data.profiles.length > 0;
}

export async function migrateLocalToCloud(familyId: string): Promise<number> {
  const data = loadAppData();
  if (!data || data.profiles.length === 0) return 0;

  // Migrate each profile to Firestore
  for (const profile of data.profiles) {
    await createCloudProfile(familyId, profile);
  }

  // Migrate reward presents
  if (data.rewardPresents && data.rewardPresents.length > 0) {
    await updateFamilyRewards(familyId, data.rewardPresents);
  }

  // Migrate parent PIN
  if (data.parentPin) {
    await updateFamilyPin(familyId, data.parentPin);
  }

  // Clear local data after successful migration
  clearAllData();

  return data.profiles.length;
}

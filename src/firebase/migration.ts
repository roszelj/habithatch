import { loadAppData, clearAllData } from '../hooks/useSaveData';
import { createCloudProfile } from './profiles';
import { updateFamilyRewards } from './families';
import { type AppData } from '../models/types';

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

  // Clear local data after successful migration
  clearAllData();

  return data.profiles.length;
}

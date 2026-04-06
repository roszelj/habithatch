import { useState, useEffect, useCallback, useRef } from 'react';
import { type AppData, type ChildProfile, type RewardPresent } from '../models/types';
import { loadAppData, writeAppData, addProfile as addLocalProfile, removeProfile as removeLocalProfile, clearAllData } from './useSaveData';
import { getCloudProfiles, createCloudProfile, updateCloudProfile, deleteCloudProfile } from '../firebase/profiles';
import { getFamily, updateFamilyRewards } from '../firebase/families';
import { onAllProfilesSnapshot, onFamilySnapshot } from '../firebase/listeners';

export type DataMode = 'local' | 'cloud';

export interface CloudContext {
  familyId: string;
  joinCode: string;
  isParent: boolean;
}

export interface DataProvider {
  mode: DataMode;
  appData: AppData;
  cloudContext: CloudContext | null;
  updateAppData: (data: AppData) => void;
  saveProfile: (profile: ChildProfile) => void;
  addProfile: (profile: ChildProfile) => void;
  removeProfile: (profileId: string) => void;
  updateRewards: (rewards: RewardPresent[]) => void;
  clearAll: () => void;
}

// Local-only provider (existing behavior)
export function useLocalDataProvider(): DataProvider {
  const [appData, setAppData] = useState<AppData>(() => {
    return loadAppData() ?? { version: 2, parentPin: null, profiles: [], rewardPresents: [] };
  });

  const updateAppData = useCallback((data: AppData) => {
    setAppData(data);
    writeAppData(data);
  }, []);

  return {
    mode: 'local',
    appData,
    cloudContext: null,
    updateAppData,
    saveProfile: (profile) => {
      const updated = {
        ...appData,
        profiles: appData.profiles.map(p => p.id === profile.id ? profile : p),
      };
      updateAppData(updated);
    },
    addProfile: (profile) => {
      const updated = addLocalProfile(appData, profile);
      setAppData(updated);
    },
    removeProfile: (profileId) => {
      const updated = removeLocalProfile(appData, profileId);
      setAppData(updated);
    },
    updateRewards: (rewards) => {
      updateAppData({ ...appData, rewardPresents: rewards });
    },
    clearAll: () => {
      clearAllData();
      setAppData({ version: 2, parentPin: null, profiles: [], rewardPresents: [] });
    },
  };
}

// Cloud provider (Firebase Firestore)
export function useCloudDataProvider(familyId: string, isParent: boolean): DataProvider {
  const [appData, setAppData] = useState<AppData>({
    version: 2, parentPin: null, profiles: [], rewardPresents: [],
  });
  const [joinCode, setJoinCode] = useState('');
  const familyIdRef = useRef(familyId);

  // Listen to family document (skip if no real familyId)
  useEffect(() => {
    if (!familyId || familyId === '__none__') return;
    const unsub = onFamilySnapshot(familyId, (data) => {
      setJoinCode(data.joinCode);
      setAppData(prev => ({ ...prev, rewardPresents: data.rewardPresents || [] }));
    });
    return unsub;
  }, [familyId]);

  // Listen to all profiles (skip if no real familyId)
  useEffect(() => {
    if (!familyId || familyId === '__none__') return;
    const unsub = onAllProfilesSnapshot(familyId, (profiles) => {
      setAppData(prev => ({ ...prev, profiles }));
    });
    return unsub;
  }, [familyId]);

  return {
    mode: 'cloud',
    appData,
    cloudContext: { familyId, joinCode, isParent },
    updateAppData: (data) => setAppData(data),
    saveProfile: (profile) => {
      if (familyIdRef.current && familyIdRef.current !== '__none__') {
        updateCloudProfile(familyIdRef.current, profile);
      }
    },
    addProfile: (profile) => {
      if (familyIdRef.current && familyIdRef.current !== '__none__') {
        createCloudProfile(familyIdRef.current, profile);
      }
    },
    removeProfile: (profileId) => {
      if (familyIdRef.current && familyIdRef.current !== '__none__') {
        deleteCloudProfile(familyIdRef.current, profileId);
      }
    },
    updateRewards: (rewards) => {
      if (familyIdRef.current && familyIdRef.current !== '__none__') {
        updateFamilyRewards(familyIdRef.current, rewards);
      }
    },
    clearAll: () => {
      // For cloud, clearing means signing out — handled at App level
    },
  };
}

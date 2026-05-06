/**
 * useDataProvider — React Native version
 *
 * Changes from web version:
 *   - localStorage sync calls → async loadAppDataAsync / writeAppDataAsync
 *   - document.visibilitychange → AppState for Firestore network cycling
 *   - disableNetwork / enableNetwork (web Firestore) → not needed; RN Firestore
 *     handles reconnection automatically via the native SDK
 *   - Sync init of local mode now triggers an async load on mount
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { AppState, type AppStateStatus } from 'react-native';
import { type AppData, type ChildProfile, type RewardPresent } from '../models/types';
import {
  loadAppDataAsync,
  writeAppDataAsync,
  addProfileAsync,
  removeProfileAsync,
  clearAllDataAsync,
} from './useSaveData';
import { createCloudProfile, updateCloudProfile, deleteCloudProfile } from '../firebase/profiles';
import { updateFamilyRewards, updateFamilyPin } from '../firebase/families';
import { onAllProfilesSnapshot, onFamilySnapshot } from '../firebase/listeners';
import { writePendingNotification, getSenderToken } from '../firebase/messaging';

export type DataMode = 'local' | 'cloud';

export interface CloudContext {
  familyId: string;
  joinCode: string;
  isParent: boolean;
}

export interface DataProvider {
  mode: DataMode;
  loaded: boolean;
  appData: AppData;
  cloudContext: CloudContext | null;
  updateAppData: (data: AppData) => void;
  saveProfile: (profile: ChildProfile) => void;
  addProfile: (profile: ChildProfile) => void;
  removeProfile: (profileId: string) => void;
  updateRewards: (rewards: RewardPresent[]) => void;
  clearAll: () => void;
  notify?: (targetProfileId: string, title: string, body: string) => void;
}

const EMPTY_APP_DATA: AppData = { version: 2, parentPin: null, profiles: [], rewardPresents: [] };

// Local-only provider
export function useLocalDataProvider(): DataProvider {
  const [appData, setAppData] = useState<AppData>(EMPTY_APP_DATA);
  const [loaded, setLoaded] = useState(false);
  const appDataRef = useRef(appData);
  appDataRef.current = appData;
  const clearedRef = useRef(false);

  // Async load from AsyncStorage on mount
  useEffect(() => {
    loadAppDataAsync().then(data => {
      if (!clearedRef.current) {
        setAppData(data ?? EMPTY_APP_DATA);
        setLoaded(true);
      }
    });
  }, []);

  const updateAppData = useCallback((data: AppData) => {
    if (clearedRef.current) return;
    setAppData(data);
    writeAppDataAsync(data).catch(() => {});
  }, []);

  const saveProfile = useCallback((profile: ChildProfile) => {
    if (clearedRef.current) return;
    const updated = {
      ...appDataRef.current,
      profiles: appDataRef.current.profiles.map(p => p.id === profile.id ? profile : p),
    };
    updateAppData(updated);
  }, [updateAppData]);

  return {
    mode: 'local',
    loaded,
    appData,
    cloudContext: null,
    updateAppData,
    saveProfile,
    addProfile: (profile) => {
      addProfileAsync(appDataRef.current, profile).then(updated => {
        if (!clearedRef.current) setAppData(updated);
      });
    },
    removeProfile: (profileId) => {
      removeProfileAsync(appDataRef.current, profileId).then(updated => {
        if (!clearedRef.current) setAppData(updated);
      });
    },
    updateRewards: (rewards) => {
      updateAppData({ ...appDataRef.current, rewardPresents: rewards });
    },
    clearAll: () => {
      clearedRef.current = true;
      clearAllDataAsync().catch(() => {});
      setAppData(EMPTY_APP_DATA);
    },
  };
}

// Cloud provider (Firebase Firestore)
export function useCloudDataProvider(familyId: string, isParent: boolean): DataProvider {
  const [appData, setAppData] = useState<AppData>(EMPTY_APP_DATA);
  const [joinCode, setJoinCode] = useState('');
  const [loaded, setLoaded] = useState(false);
  const familyIdRef = useRef(familyId);
  familyIdRef.current = familyId;
  const clearedRef = useRef(false);
  const appDataRef = useRef(appData);
  appDataRef.current = appData;

  // AppState listener: cycle Firestore network on foreground resume after long idle
  // (replaces document.visibilitychange — fixes stale data after background on iOS/Android)
  useEffect(() => {
    if (!familyId || familyId === '__none__') return;
    let hiddenAt = 0;
    const sub = AppState.addEventListener('change', (state: AppStateStatus) => {
      if (state === 'background' || state === 'inactive') {
        hiddenAt = Date.now();
      } else if (state === 'active' && hiddenAt > 0) {
        // @react-native-firebase/firestore reconnects automatically — no manual cycle needed
        hiddenAt = 0;
      }
    });
    return () => sub.remove();
  }, [familyId]);

  // Listen to family document
  useEffect(() => {
    if (!familyId || familyId === '__none__') return;
    const unsub = onFamilySnapshot(familyId, (data) => {
      setJoinCode(data.joinCode);
      setAppData(prev => ({
        ...prev,
        rewardPresents: data.rewardPresents || [],
        parentPin: data.parentPin ?? null,
      }));
    });
    return unsub;
  }, [familyId]);

  // Listen to all profiles
  useEffect(() => {
    if (!familyId || familyId === '__none__') return;
    const unsub = onAllProfilesSnapshot(familyId, (profiles) => {
      setAppData(prev => ({ ...prev, profiles }));
      setLoaded(true);
    });
    return unsub;
  }, [familyId]);

  return {
    mode: 'cloud',
    loaded,
    appData,
    cloudContext: { familyId, joinCode, isParent },
    updateAppData: (data) => {
      const fid = familyIdRef.current;
      if (fid && fid !== '__none__') {
        const prev = appDataRef.current;
        if (data.parentPin !== prev.parentPin) {
          updateFamilyPin(fid, data.parentPin).catch(() => {});
        }
        if (data.rewardPresents !== prev.rewardPresents) {
          updateFamilyRewards(fid, data.rewardPresents).catch(() => {});
        }
        for (const profile of data.profiles) {
          const prevProfile = prev.profiles.find(p => p.id === profile.id);
          if (prevProfile !== profile) {
            updateCloudProfile(fid, profile).catch(() => {});
          }
        }
      }
      setAppData(data);
    },
    saveProfile: (profile) => {
      if (clearedRef.current) return;
      if (familyIdRef.current && familyIdRef.current !== '__none__') {
        updateCloudProfile(familyIdRef.current, profile).catch(() => {});
      }
    },
    addProfile: (profile) => {
      if (familyIdRef.current && familyIdRef.current !== '__none__') {
        createCloudProfile(familyIdRef.current, profile).catch(() => {});
      }
    },
    removeProfile: (profileId) => {
      if (familyIdRef.current && familyIdRef.current !== '__none__') {
        deleteCloudProfile(familyIdRef.current, profileId).catch(() => {});
      }
    },
    updateRewards: (rewards) => {
      if (familyIdRef.current && familyIdRef.current !== '__none__') {
        updateFamilyRewards(familyIdRef.current, rewards).catch(() => {});
      }
    },
    clearAll: () => {
      clearedRef.current = true;
      const fid = familyIdRef.current;
      if (fid && fid !== '__none__') {
        for (const profile of appDataRef.current.profiles) {
          deleteCloudProfile(fid, profile.id).catch(() => {});
        }
        updateFamilyPin(fid, null).catch(() => {});
        updateFamilyRewards(fid, []).catch(() => {});
      }
    },
    notify: (targetProfileId, title, body) => {
      const fid = familyIdRef.current;
      if (fid && fid !== '__none__') {
        getSenderToken()
          .then(senderToken => writePendingNotification(fid, targetProfileId, title, body, senderToken))
          .catch(() => {});
      }
    },
  };
}

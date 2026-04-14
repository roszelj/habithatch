import { useState, useEffect, useCallback, useRef } from 'react';
import { type AppData, type ChildProfile, type RewardPresent } from '../models/types';
import { loadAppData, writeAppData, addProfile as addLocalProfile, removeProfile as removeLocalProfile, clearAllData } from './useSaveData';
import { createCloudProfile, updateCloudProfile, deleteCloudProfile } from '../firebase/profiles';
import { updateFamilyRewards, updateFamilyPin } from '../firebase/families';
import { onAllProfilesSnapshot, onFamilySnapshot } from '../firebase/listeners';
import { writePendingNotification, getSenderToken } from '../firebase/messaging';
import { disableNetwork, enableNetwork } from 'firebase/firestore';
import { db } from '../firebase/config';

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

// Local-only provider (existing behavior)
export function useLocalDataProvider(): DataProvider {
  const [appData, setAppData] = useState<AppData>(() => {
    return loadAppData() ?? { version: 2, parentPin: null, profiles: [], rewardPresents: [] };
  });
  const appDataRef = useRef(appData);
  appDataRef.current = appData;
  const clearedRef = useRef(false);

  const updateAppData = useCallback((data: AppData) => {
    if (clearedRef.current) return;
    setAppData(data);
    writeAppData(data);
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
    loaded: true,
    appData,
    cloudContext: null,
    updateAppData,
    saveProfile,
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
      clearedRef.current = true;
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
  const [loaded, setLoaded] = useState(false);
  const familyIdRef = useRef(familyId);
  familyIdRef.current = familyId;
  const clearedRef = useRef(false);

  // Force Firestore to reconnect when app returns from background/idle
  // This fixes stale data after QUIC connection timeout on mobile PWAs
  useEffect(() => {
    if (!familyId || familyId === '__none__') return;
    let lastHidden = 0;
    const handleVisibility = () => {
      if (document.visibilityState === 'hidden') {
        lastHidden = Date.now();
      } else if (document.visibilityState === 'visible' && lastHidden > 0) {
        const idleMs = Date.now() - lastHidden;
        // Only cycle network if idle for more than 30 seconds
        if (idleMs > 30_000) {
          disableNetwork(db).then(() => enableNetwork(db)).catch(() => {});
        }
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, [familyId]);

  // Listen to family document (skip if no real familyId)
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

  // Listen to all profiles (skip if no real familyId)
  useEffect(() => {
    if (!familyId || familyId === '__none__') return;
    const unsub = onAllProfilesSnapshot(familyId, (profiles) => {
      setAppData(prev => ({ ...prev, profiles }));
      setLoaded(true);
    });
    return unsub;
  }, [familyId]);

  const appDataRef = useRef(appData);
  appDataRef.current = appData;

  return {
    mode: 'cloud',
    loaded,
    appData,
    cloudContext: { familyId, joinCode, isParent },
    updateAppData: (data) => {
      const fid = familyIdRef.current;
      console.log('[cloud] updateAppData called, familyId:', fid, 'parentPin:', data.parentPin, 'rewards:', data.rewardPresents?.length);
      if (fid && fid !== '__none__') {
        const prev = appDataRef.current;
        if (data.parentPin !== prev.parentPin) {
          console.log('[cloud] Writing parentPin to Firestore:', data.parentPin);
          updateFamilyPin(fid, data.parentPin).catch(e => console.error('[cloud] Failed to save PIN:', e));
        }
        if (data.rewardPresents !== prev.rewardPresents) {
          console.log('[cloud] Writing rewards to Firestore:', data.rewardPresents);
          updateFamilyRewards(fid, data.rewardPresents).catch(e => console.error('[cloud] Failed to save rewards:', e));
        }
        // Write any changed profiles to Firestore (e.g. cross-profile chore edits, approvals, bonuses)
        for (const profile of data.profiles) {
          const prevProfile = prev.profiles.find(p => p.id === profile.id);
          if (prevProfile !== profile) {
            updateCloudProfile(fid, profile).catch(e => console.error('[cloud] Failed to save profile:', e));
          }
        }
      } else {
        console.warn('[cloud] updateAppData skipped — no valid familyId:', fid);
      }
      setAppData(data);
    },
    saveProfile: (profile) => {
      if (clearedRef.current) return;
      if (familyIdRef.current && familyIdRef.current !== '__none__') {
        updateCloudProfile(familyIdRef.current, profile).catch(e => console.error('[cloud] Failed to save profile:', e));
      } else {
        console.warn('[cloud] saveProfile skipped — no valid familyId:', familyIdRef.current);
      }
    },
    addProfile: (profile) => {
      if (familyIdRef.current && familyIdRef.current !== '__none__') {
        console.log('[cloud] Creating profile in Firestore:', profile.id, 'familyId:', familyIdRef.current);
        createCloudProfile(familyIdRef.current, profile).catch(e => console.error('[cloud] Failed to create profile:', e));
      } else {
        console.warn('[cloud] addProfile skipped — no valid familyId:', familyIdRef.current);
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
      clearedRef.current = true;
      const fid = familyIdRef.current;
      if (fid && fid !== '__none__') {
        // Delete all profiles from Firestore
        for (const profile of appDataRef.current.profiles) {
          deleteCloudProfile(fid, profile.id).catch(() => {});
        }
        // Reset family document (clear pin and rewards)
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

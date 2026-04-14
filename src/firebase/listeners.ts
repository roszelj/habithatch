import { doc, collection, onSnapshot, type Unsubscribe } from 'firebase/firestore';
import { db } from './config';
import { type ChildProfile, type RewardPresent } from '../models/types';
import { migrateCreatureType } from './migration';
import { migrateProfileChores } from '../hooks/useSaveData';

export interface FamilySnapshot {
  parentUid: string;
  joinCode: string;
  rewardPresents: RewardPresent[];
  parentPin?: string | null;
}

export function onFamilySnapshot(
  familyId: string,
  callback: (data: FamilySnapshot) => void,
): Unsubscribe {
  return onSnapshot(doc(db, 'families', familyId), (snap) => {
    if (snap.exists()) {
      callback(snap.data() as FamilySnapshot);
    }
  });
}

export function onProfileSnapshot(
  familyId: string,
  profileId: string,
  callback: (profile: ChildProfile) => void,
): Unsubscribe {
  return onSnapshot(doc(db, 'families', familyId, 'profiles', profileId), (snap) => {
    if (snap.exists()) {
      const data = snap.data();
      callback(migrateProfileChores({ ...data, id: snap.id, creatureType: migrateCreatureType(data.creatureType) }) as ChildProfile);
    }
  });
}

export function onAllProfilesSnapshot(
  familyId: string,
  callback: (profiles: ChildProfile[]) => void,
): Unsubscribe {
  return onSnapshot(collection(db, 'families', familyId, 'profiles'), (snap) => {
    const profiles = snap.docs.map(d => {
      const data = d.data();
      return migrateProfileChores({ ...data, id: d.id, creatureType: migrateCreatureType(data.creatureType) }) as ChildProfile;
    });
    callback(profiles);
  });
}

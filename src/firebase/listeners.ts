import { doc, collection, onSnapshot, type Unsubscribe } from 'firebase/firestore';
import { db } from './config';
import { type ChildProfile, type RewardPresent } from '../models/types';

export interface FamilySnapshot {
  parentUid: string;
  joinCode: string;
  rewardPresents: RewardPresent[];
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
      callback({ ...snap.data(), id: snap.id } as ChildProfile);
    }
  });
}

export function onAllProfilesSnapshot(
  familyId: string,
  callback: (profiles: ChildProfile[]) => void,
): Unsubscribe {
  return onSnapshot(collection(db, 'families', familyId, 'profiles'), (snap) => {
    const profiles = snap.docs.map(d => ({ ...d.data(), id: d.id } as ChildProfile));
    callback(profiles);
  });
}

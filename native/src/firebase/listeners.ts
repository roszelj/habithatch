/**
 * Firestore listeners — React Native version
 * Uses @react-native-firebase/firestore namespace API.
 */

import firestore from '@react-native-firebase/firestore';
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
): () => void {
  return firestore()
    .collection('families')
    .doc(familyId)
    .onSnapshot(snap => {
      if (snap.exists()) callback(snap.data() as FamilySnapshot);
    });
}

export function onProfileSnapshot(
  familyId: string,
  profileId: string,
  callback: (profile: ChildProfile) => void,
): () => void {
  return firestore()
    .collection('families')
    .doc(familyId)
    .collection('profiles')
    .doc(profileId)
    .onSnapshot(snap => {
      if (snap.exists()) {
        const data = snap.data()!;
        callback(migrateProfileChores({ ...data, id: snap.id, creatureType: migrateCreatureType(data.creatureType) }) as ChildProfile);
      }
    });
}

export function onAllProfilesSnapshot(
  familyId: string,
  callback: (profiles: ChildProfile[]) => void,
): () => void {
  return firestore()
    .collection('families')
    .doc(familyId)
    .collection('profiles')
    .onSnapshot(snap => {
      const profiles = snap.docs.map(d => {
        const data = d.data();
        return migrateProfileChores({ ...data, id: d.id, creatureType: migrateCreatureType(data.creatureType) }) as ChildProfile;
      });
      callback(profiles);
    });
}

/**
 * Firebase Profiles — React Native version
 * Uses @react-native-firebase/firestore namespace API.
 */

import firestore from '@react-native-firebase/firestore';
import { type ChildProfile } from '../models/types';

function profilesCollection(familyId: string) {
  return firestore().collection('families').doc(familyId).collection('profiles');
}

export async function createCloudProfile(familyId: string, profile: ChildProfile): Promise<void> {
  await profilesCollection(familyId).doc(profile.id).set(profile);
}

export async function updateCloudProfile(familyId: string, profile: ChildProfile): Promise<void> {
  await profilesCollection(familyId).doc(profile.id).set(profile, { merge: true });
}

export async function deleteCloudProfile(familyId: string, profileId: string): Promise<void> {
  await profilesCollection(familyId).doc(profileId).delete();
}

export async function getCloudProfiles(familyId: string): Promise<ChildProfile[]> {
  const snap = await profilesCollection(familyId).get();
  return snap.docs.map(d => ({ ...d.data(), id: d.id } as ChildProfile));
}

export async function getCloudProfile(familyId: string, profileId: string): Promise<ChildProfile | null> {
  const snap = await profilesCollection(familyId).doc(profileId).get();
  if (!snap.exists) return null;
  return { ...snap.data(), id: snap.id } as ChildProfile;
}

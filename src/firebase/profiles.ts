import { doc, setDoc, getDoc, getDocs, deleteDoc, collection } from 'firebase/firestore';
import { db } from './config';
import { type ChildProfile } from '../models/types';

function profilesCollection(familyId: string) {
  return collection(db, 'families', familyId, 'profiles');
}

export async function createCloudProfile(familyId: string, profile: ChildProfile): Promise<void> {
  await setDoc(doc(db, 'families', familyId, 'profiles', profile.id), profile);
}

export async function updateCloudProfile(familyId: string, profile: ChildProfile): Promise<void> {
  await setDoc(doc(db, 'families', familyId, 'profiles', profile.id), profile, { merge: true });
}

export async function deleteCloudProfile(familyId: string, profileId: string): Promise<void> {
  await deleteDoc(doc(db, 'families', familyId, 'profiles', profileId));
}

export async function getCloudProfiles(familyId: string): Promise<ChildProfile[]> {
  const snap = await getDocs(profilesCollection(familyId));
  return snap.docs.map(d => ({ ...d.data(), id: d.id } as ChildProfile));
}

export async function getCloudProfile(familyId: string, profileId: string): Promise<ChildProfile | null> {
  const snap = await getDoc(doc(db, 'families', familyId, 'profiles', profileId));
  if (!snap.exists()) return null;
  return { ...snap.data(), id: snap.id } as ChildProfile;
}

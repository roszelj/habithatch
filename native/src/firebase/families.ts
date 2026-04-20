/**
 * Firebase Families — React Native version
 * Uses @react-native-firebase/firestore namespace API.
 */

import firestore from '@react-native-firebase/firestore';
import { type RewardPresent } from '../models/types';

function generateCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

export interface FamilyData {
  parentUid: string;
  joinCode: string;
  rewardPresents: RewardPresent[];
  parentPin?: string | null;
  createdAt: any;
}

export async function createFamily(parentUid: string): Promise<{ familyId: string; joinCode: string }> {
  let joinCode = generateCode();
  let attempts = 0;
  while (attempts < 10) {
    const codeDoc = await firestore().collection('joinCodes').doc(joinCode).get();
    if (!codeDoc.exists) break;
    joinCode = generateCode();
    attempts++;
  }

  const familyRef = firestore().collection('families').doc();
  const familyId = familyRef.id;

  await familyRef.set({
    parentUid,
    joinCode,
    rewardPresents: [],
    createdAt: firestore.FieldValue.serverTimestamp(),
  });

  await firestore().collection('joinCodes').doc(joinCode).set({ familyId });

  return { familyId, joinCode };
}

export async function lookupJoinCode(code: string): Promise<string | null> {
  const codeDoc = await firestore().collection('joinCodes').doc(code.toUpperCase()).get();
  if (!codeDoc.exists) return null;
  return (codeDoc.data() as any).familyId;
}

export async function getFamily(familyId: string): Promise<FamilyData | null> {
  const familyDoc = await firestore().collection('families').doc(familyId).get();
  if (!familyDoc.exists) return null;
  return familyDoc.data() as FamilyData;
}

export async function updateFamilyRewards(familyId: string, rewardPresents: RewardPresent[]): Promise<void> {
  await firestore().collection('families').doc(familyId).set({ rewardPresents }, { merge: true });
}

export async function updateFamilyPin(familyId: string, parentPin: string | null): Promise<void> {
  await firestore().collection('families').doc(familyId).set({ parentPin }, { merge: true });
}

export async function findFamilyByParent(parentUid: string): Promise<{ familyId: string; joinCode: string } | null> {
  const snap = await firestore().collection('families').where('parentUid', '==', parentUid).get();
  if (snap.empty) return null;
  const familyDoc = snap.docs[0];
  return { familyId: familyDoc.id, joinCode: (familyDoc.data() as any).joinCode };
}

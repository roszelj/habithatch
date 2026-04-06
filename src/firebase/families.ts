import { doc, setDoc, getDoc, getDocs, collection, query, where, serverTimestamp } from 'firebase/firestore';
import { db } from './config';
import { type RewardPresent } from '../models/types';

function generateCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // no I/O/0/1 to avoid confusion
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
  createdAt: any;
}

export async function createFamily(parentUid: string): Promise<{ familyId: string; joinCode: string }> {
  // Generate unique join code (retry on collision)
  let joinCode = generateCode();
  let attempts = 0;
  while (attempts < 10) {
    const codeDoc = await getDoc(doc(db, 'joinCodes', joinCode));
    if (!codeDoc.exists()) break;
    joinCode = generateCode();
    attempts++;
  }

  const familyRef = doc(collection(db, 'families'));
  const familyId = familyRef.id;

  // Write family document
  await setDoc(familyRef, {
    parentUid,
    joinCode,
    rewardPresents: [],
    createdAt: serverTimestamp(),
  });

  // Write join code index
  await setDoc(doc(db, 'joinCodes', joinCode), { familyId });

  return { familyId, joinCode };
}

export async function lookupJoinCode(code: string): Promise<string | null> {
  const codeDoc = await getDoc(doc(db, 'joinCodes', code.toUpperCase()));
  if (!codeDoc.exists()) return null;
  return codeDoc.data().familyId;
}

export async function getFamily(familyId: string): Promise<FamilyData | null> {
  const familyDoc = await getDoc(doc(db, 'families', familyId));
  if (!familyDoc.exists()) return null;
  return familyDoc.data() as FamilyData;
}

export async function updateFamilyRewards(familyId: string, rewardPresents: RewardPresent[]): Promise<void> {
  await setDoc(doc(db, 'families', familyId), { rewardPresents }, { merge: true });
}

export async function findFamilyByParent(parentUid: string): Promise<{ familyId: string; joinCode: string } | null> {
  const q = query(collection(db, 'families'), where('parentUid', '==', parentUid));
  const snap = await getDocs(q);
  if (snap.empty) return null;
  const familyDoc = snap.docs[0];
  return { familyId: familyDoc.id, joinCode: familyDoc.data().joinCode };
}

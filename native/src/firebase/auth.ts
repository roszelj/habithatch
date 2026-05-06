/**
 * Firebase Auth — React Native version
 * Uses @react-native-firebase/auth (namespace API) instead of the web modular SDK.
 */

import auth from '@react-native-firebase/auth';
import type { FirebaseAuthTypes } from '@react-native-firebase/auth';

type User = FirebaseAuthTypes.User;

export async function signUpWithEmail(email: string, password: string): Promise<User> {
  const cred = await auth().createUserWithEmailAndPassword(email, password);
  return cred.user;
}

export async function signInWithEmail(email: string, password: string): Promise<User> {
  const cred = await auth().signInWithEmailAndPassword(email, password);
  return cred.user;
}

export async function signInAnonymous(): Promise<User> {
  const cred = await auth().signInAnonymously();
  return cred.user;
}

export async function signOut(): Promise<void> {
  await auth().signOut();
}

export function onAuthChange(callback: (user: User | null) => void): () => void {
  return auth().onAuthStateChanged(callback);
}

export async function reauthenticateWithPassword(password: string): Promise<void> {
  const user = auth().currentUser;
  if (!user || !user.email) throw new Error('No authenticated user');
  const credential = auth.EmailAuthProvider.credential(user.email, password);
  await user.reauthenticateWithCredential(credential);
}

export async function deleteCurrentUser(): Promise<void> {
  const user = auth().currentUser;
  if (!user) throw new Error('No authenticated user');
  await user.delete();
}

export async function sendPasswordReset(email: string): Promise<void> {
  await auth().sendPasswordResetEmail(email);
}

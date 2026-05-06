import { useState, useEffect } from 'react';
import type { FirebaseAuthTypes } from '@react-native-firebase/auth';
import auth from '@react-native-firebase/auth';
import { onAuthChange, signUpWithEmail, signInWithEmail, signOut } from '../firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

type User = FirebaseAuthTypes.User;
import { isFirebaseConfigured } from '../firebase/config';

const APP_INSTALLED_KEY = 'terragucci_installed';

export interface AuthState {
  user: User | null;
  loading: boolean;
  firebaseAvailable: boolean;
}

/**
 * Clear stale Keychain auth on fresh install.
 * AsyncStorage is wiped on uninstall; Keychain is not.
 * Must run BEFORE subscribing to onAuthStateChanged.
 */
async function clearStaleAuth(): Promise<void> {
  const installed = await AsyncStorage.getItem(APP_INSTALLED_KEY);
  if (!installed) {
    // Fresh install — if Firebase has a cached user from Keychain, sign out
    const currentUser = auth().currentUser;
    if (currentUser) {
      await auth().signOut();
    }
  }
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    firebaseAvailable: isFirebaseConfigured(),
  });

  useEffect(() => {
    if (!isFirebaseConfigured()) {
      setState({ user: null, loading: false, firebaseAvailable: false });
      return;
    }

    let unsubscribe: (() => void) | undefined;

    // First clear stale auth, then subscribe to auth changes
    clearStaleAuth().then(() => {
      unsubscribe = onAuthChange((user) => {
        // Set install marker when user is authenticated
        if (user) {
          AsyncStorage.setItem(APP_INSTALLED_KEY, '1').catch(() => {});
        }
        setState({ user, loading: false, firebaseAvailable: true });
      });
    });

    return () => unsubscribe?.();
  }, []);

  return {
    ...state,
    signUp: signUpWithEmail,
    signIn: signInWithEmail,
    signOut,
  };
}

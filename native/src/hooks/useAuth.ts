import { useState, useEffect } from 'react';
import type { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { onAuthChange, signUpWithEmail, signInWithEmail, signOut } from '../firebase/auth';

type User = FirebaseAuthTypes.User;
import { isFirebaseConfigured } from '../firebase/config';

export interface AuthState {
  user: User | null;
  loading: boolean;
  firebaseAvailable: boolean;
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
    const unsubscribe = onAuthChange((user) => {
      setState({ user, loading: false, firebaseAvailable: true });
    });
    return unsubscribe;
  }, []);

  return {
    ...state,
    signUp: signUpWithEmail,
    signIn: signInWithEmail,
    signOut,
  };
}

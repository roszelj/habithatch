/**
 * HabitHatch — React Native App entry point
 *
 * Phase routing mirrors the web App.tsx.
 * localStorage → AsyncStorage (all async).
 * window.confirm → Alert.alert.
 * Firebase: @react-native-firebase (namespace API).
 */

import React, { useState, useCallback, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, Image, Alert,
  ActivityIndicator, StyleSheet,
} from 'react-native';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  type CreatureType, type ChildProfile,
  MAX_PROFILES, createDefaultPoints, createDefaultChores, createDefaultStreak,
} from './src/models/types';
import { useAuth } from './src/hooks/useAuth';
import { useLocalDataProvider, useCloudDataProvider } from './src/hooks/useDataProvider';
import { registerFcmToken, subscribeFcmForeground } from './src/firebase/messaging';
import { createFamily, lookupJoinCode, findFamilyByParent } from './src/firebase/families';
import { signInAnonymous } from './src/firebase/auth';
import { loadAppDataAsync, generateProfileId } from './src/hooks/useSaveData';

import { SelectionScreen } from './src/components/SelectionScreen';
import { PinEntry } from './src/components/PinEntry';
import { NamingStep } from './src/components/NamingStep';
import { ProfilePicker } from './src/components/ProfilePicker';
import { AuthScreen } from './src/components/AuthScreen';
import { FamilySetup } from './src/components/FamilySetup';
import { Game } from './src/components/Game';

const FAMILY_ID_KEY = 'terragucci_familyId';
const DEVICE_PROFILE_KEY = 'terragucci_deviceProfile';

type AppPhase =
  | { step: 'loading' }
  | { step: 'auth' }
  | { step: 'familySetup'; joinCode: string }
  | { step: 'profiles' }
  | { step: 'select' }
  | { step: 'parentPin' }
  | { step: 'parentOnly' }
  | { step: 'name'; creatureType: CreatureType }
  | { step: 'play'; profileId: string; asParent?: boolean };

function AppInner() {
  const insets = useSafeAreaInsets();
  const { user, loading: authLoading, firebaseAvailable, signUp, signIn, signOut: doSignOut } = useAuth();
  const [familyId, setFamilyId] = useState<string | null>(null);
  const [familyIdLoaded, setFamilyIdLoaded] = useState(false);
  const [phase, setPhase] = useState<AppPhase>({ step: 'loading' });

  const isParent = Boolean(user && !user.isAnonymous);
  const isCloudMode = Boolean(user && familyId);

  const localProvider = useLocalDataProvider();
  const cloudProvider = useCloudDataProvider(familyId || '__none__', isParent);
  const provider = isCloudMode ? cloudProvider : localProvider;
  const appData = provider.appData;

  // Load familyId and determine initial phase
  useEffect(() => {
    async function init() {
      const storedFamilyId = await AsyncStorage.getItem(FAMILY_ID_KEY);
      setFamilyId(storedFamilyId);
      setFamilyIdLoaded(true);
    }
    init();
  }, []);

  // Determine phase once auth + familyId are both resolved
  useEffect(() => {
    if (authLoading || !familyIdLoaded) return;
    if (phase.step !== 'loading') return; // already resolved

    async function resolvePhase() {
      const savedData = await loadAppDataAsync();
      if (firebaseAvailable && !user && !savedData) {
        setPhase({ step: 'auth' });
        return;
      }
      if (!savedData || savedData.profiles.length === 0) {
        setPhase({ step: 'select' });
        return;
      }
      if (savedData.profiles.length === 1) {
        setPhase({ step: 'play', profileId: savedData.profiles[0].id });
        return;
      }
      setPhase({ step: 'profiles' });
    }
    resolvePhase();
  }, [authLoading, familyIdLoaded, user, firebaseAvailable]);

  // Restore parent session after Firebase auth resolves
  useEffect(() => {
    if (authLoading || !familyId) return;
    if (user && !user.isAnonymous && phase.step === 'auth') {
      setPhase({ step: 'profiles' });
    }
  }, [authLoading, user, familyId]);

  // Register FCM token when kid enters play mode in cloud context
  useEffect(() => {
    if (phase.step !== 'play' || !isCloudMode || !familyId) return;
    registerFcmToken(familyId, phase.profileId).catch(() => {});
  }, [phase, familyId, isCloudMode]);

  // Subscribe to foreground FCM messages
  useEffect(() => {
    if (!isCloudMode) return;
    return subscribeFcmForeground();
  }, [isCloudMode]);

  const handleSignUp = useCallback(async (email: string, password: string) => {
    const u = await signUp(email, password);
    const { familyId: fid, joinCode } = await createFamily(u.uid);
    await AsyncStorage.setItem(FAMILY_ID_KEY, fid);
    setFamilyId(fid);
    setPhase({ step: 'familySetup', joinCode });
  }, [signUp]);

  const handleSignIn = useCallback(async (email: string, password: string) => {
    const u = await signIn(email, password);
    let fid = await AsyncStorage.getItem(FAMILY_ID_KEY);
    if (!fid) {
      const family = await findFamilyByParent(u.uid);
      if (family) {
        fid = family.familyId;
        await AsyncStorage.setItem(FAMILY_ID_KEY, fid);
      }
    }
    if (fid) {
      setFamilyId(fid);
      setPhase({ step: 'profiles' });
    } else {
      const { familyId: newFid, joinCode } = await createFamily(u.uid);
      await AsyncStorage.setItem(FAMILY_ID_KEY, newFid);
      setFamilyId(newFid);
      setPhase({ step: 'familySetup', joinCode });
    }
  }, [signIn]);

  const handleJoinFamily = useCallback(async (code: string) => {
    const fid = await lookupJoinCode(code);
    if (!fid) throw new Error('Family not found. Check the code and try again.');
    await signInAnonymous();
    await AsyncStorage.setItem(FAMILY_ID_KEY, fid);
    setFamilyId(fid);
    setPhase({ step: 'profiles' });
  }, []);

  const handleSkipAuth = useCallback(async () => {
    const savedData = await loadAppDataAsync();
    if (savedData && savedData.profiles.length > 0) {
      if (savedData.profiles.length === 1) {
        setPhase({ step: 'play', profileId: savedData.profiles[0].id });
      } else {
        setPhase({ step: 'profiles' });
      }
    } else {
      setPhase({ step: 'select' });
    }
  }, []);

  const handleCreationComplete = useCallback((creatureType: CreatureType, childName: string, creatureName: string) => {
    const newProfile: ChildProfile = {
      id: generateProfileId(),
      childName,
      creatureType,
      creatureName,
      health: 100,
      points: createDefaultPoints(),
      coins: 0,
      weekdayChores: createDefaultChores(),
      weekendChores: createDefaultChores(),
      outfitId: null,
      accessoryId: null,
      ownedOutfits: [],
      ownedAccessories: [],
      habitatId: null,
      ownedHabitats: [],
      streak: createDefaultStreak(),
      notifications: [],
      redeemedRewards: [],
      lastPlayedDate: new Date().toISOString().slice(0, 10),
    };
    provider.addProfile(newProfile);
    AsyncStorage.setItem(DEVICE_PROFILE_KEY, newProfile.id).catch(() => {});
    setPhase({ step: 'play', profileId: newProfile.id });
  }, [provider]);

  const handleReset = useCallback(() => {
    Alert.alert(
      'Reset Game',
      'Are you sure you want to reset the entire game? All profiles, chores, points, coins, and progress will be permanently deleted.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset', style: 'destructive', onPress: async () => {
            provider.clearAll();
            await AsyncStorage.multiRemove([FAMILY_ID_KEY, DEVICE_PROFILE_KEY]);
            if (user) doSignOut().catch(() => {});
            setPhase({ step: 'auth' });
          },
        },
      ]
    );
  }, [provider, user, doSignOut]);

  const handleSwitchProfile = useCallback(() => {
    if (appData.profiles.length <= 1) return;
    setPhase({ step: 'profiles' });
  }, [appData]);

  const containerStyle = [
    styles.container,
    { paddingTop: insets.top, paddingBottom: insets.bottom },
  ];

  // Loading
  if (phase.step === 'loading' || authLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#f0e68c" />
      </View>
    );
  }

  // Auth
  if (phase.step === 'auth') {
    return (
      <View style={containerStyle}>
        <AuthScreen
          onSignUp={handleSignUp}
          onSignIn={handleSignIn}
          onJoinFamily={handleJoinFamily}
          onSkip={handleSkipAuth}
        />
      </View>
    );
  }

  // Family setup (join code display after parent signup)
  if (phase.step === 'familySetup') {
    return (
      <View style={containerStyle}>
        <FamilySetup
          joinCode={phase.joinCode}
          onContinue={() => {
            if (appData.profiles.length > 0) {
              setPhase({ step: 'profiles' });
            } else {
              setPhase({ step: 'select' });
            }
          }}
        />
      </View>
    );
  }

  // Profile picker
  if (phase.step === 'profiles') {
    if (!provider.loaded) {
      return (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#f0e68c" />
        </View>
      );
    }
    return (
      <View style={containerStyle}>
        <ProfilePicker
          profiles={appData.profiles}
          canAdd={appData.profiles.length < MAX_PROFILES}
          onSelect={(id) => {
            AsyncStorage.setItem(DEVICE_PROFILE_KEY, id).catch(() => {});
            setPhase({ step: 'play', profileId: id });
          }}
          onAddNew={() => setPhase({ step: 'select' })}
          parentPin={appData.parentPin}
          onParentSetup={!appData.parentPin ? () => setPhase({ step: 'parentPin' }) : undefined}
          onParentAccess={appData.parentPin && appData.profiles.length > 0 ? () => {
            const firstId = appData.profiles[0].id;
            AsyncStorage.setItem(DEVICE_PROFILE_KEY, firstId).catch(() => {});
            setPhase({ step: 'play', profileId: firstId, asParent: true });
          } : undefined}
        />
      </View>
    );
  }

  // Creature selection
  if (phase.step === 'select') {
    return (
      <View style={containerStyle}>
        <SelectionScreen
          onSelect={(type) => setPhase({ step: 'name', creatureType: type })}
          onParentSetup={() => setPhase({ step: 'parentPin' })}
        />
      </View>
    );
  }

  // Parent PIN creation
  if (phase.step === 'parentPin') {
    return (
      <View style={containerStyle}>
        <PinEntry
          mode="create"
          onSubmit={(pin) => {
            provider.updateAppData({ ...appData, parentPin: pin });
            if (appData.profiles.length > 0) {
              const firstId = appData.profiles[0].id;
              AsyncStorage.setItem(DEVICE_PROFILE_KEY, firstId).catch(() => {});
              setPhase({ step: 'play', profileId: firstId, asParent: true });
            } else {
              setPhase({ step: 'parentOnly' });
            }
            return true;
          }}
          onCancel={() => appData.profiles.length > 0 ? setPhase({ step: 'profiles' }) : setPhase({ step: 'select' })}
        />
      </View>
    );
  }

  // Parent-only (no kids yet)
  if (phase.step === 'parentOnly') {
    return (
      <View style={[containerStyle, styles.parentOnlyContainer]}>
        <Image source={require('./assets/logo_header.png')} style={styles.logo} resizeMode="contain" />
        <Text style={styles.parentOnlyTitle}>Parent Mode</Text>
        {provider.cloudContext?.joinCode && (
          <Text style={styles.joinCodeText}>
            Join code: <Text style={styles.joinCode}>{provider.cloudContext.joinCode}</Text>
          </Text>
        )}
        <Text style={styles.parentOnlyHint}>No children added yet. Add a child profile to get started.</Text>
        <TouchableOpacity style={styles.addChildBtn} onPress={() => setPhase({ step: 'select' })}>
          <Text style={styles.addChildBtnText}>Add Child</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Naming step
  if (phase.step === 'name') {
    return (
      <View style={containerStyle}>
        <NamingStep
          creatureType={phase.creatureType}
          onConfirm={(childName, creatureName) => handleCreationComplete(phase.creatureType, childName, creatureName)}
        />
      </View>
    );
  }

  // Play
  if (phase.step === 'play') {
    const activeProfile = appData.profiles.find(p => p.id === phase.profileId);
    if (!activeProfile) return null;
    return (
      <View style={containerStyle}>
        <Game
          key={activeProfile.id}
          profile={activeProfile}
          appData={appData}
          onUpdateAppData={provider.updateAppData}
          onSaveProfile={provider.saveProfile}
          onSwitchProfile={appData.profiles.length > 1 ? handleSwitchProfile : undefined}
          onAddChild={appData.profiles.length < MAX_PROFILES ? () => setPhase({ step: 'select' }) : undefined}
          onReset={appData.parentPin ? handleReset : undefined}
          joinCode={provider.cloudContext?.joinCode}
          onNotify={provider.notify}
          initialView={phase.asParent ? 'parent' : undefined}
        />
        {!appData.parentPin && (
          <TouchableOpacity style={styles.resetBtn} onPress={handleReset}>
            <Text style={styles.resetBtnText}>Reset Game</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }

  return null;
}

export default function App() {
  return (
    <SafeAreaProvider>
      <View style={styles.app}>
        <AppInner />
      </View>
      <StatusBar style="light" />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  app: { flex: 1, backgroundColor: '#275b7c' },
  center: {
    flex: 1,
    backgroundColor: '#275b7c',
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: '#275b7c',
  },
  parentOnlyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
    padding: 32,
  },
  logo: { width: 220, height: 70 },
  parentOnlyTitle: { fontSize: 24, fontWeight: '700', color: '#f0e68c' },
  joinCodeText: { fontSize: 15, color: 'rgba(255,255,255,0.6)', textAlign: 'center' },
  joinCode: { fontWeight: '700', color: '#f0e68c', letterSpacing: 2 },
  parentOnlyHint: { fontSize: 15, color: 'rgba(255,255,255,0.5)', textAlign: 'center' },
  addChildBtn: {
    paddingVertical: 14,
    paddingHorizontal: 32,
    backgroundColor: '#f0e68c',
    borderRadius: 12,
  },
  addChildBtnText: { fontSize: 17, fontWeight: '700', color: '#1a1a2e' },
  resetBtn: { padding: 10, alignItems: 'center' },
  resetBtnText: { fontSize: 13, color: 'rgba(255,255,255,0.3)', textDecorationLine: 'underline' },
});

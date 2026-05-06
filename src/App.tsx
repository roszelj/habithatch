import { useState, useCallback, useEffect } from 'react';
import {
  type CreatureType, type ChildProfile,
  MAX_PROFILES, createDefaultPoints, createDefaultChores, createDefaultStreak,
} from './models/types';
import { useAuth } from './hooks/useAuth';
import { useLocalDataProvider, useCloudDataProvider } from './hooks/useDataProvider';
import { registerFcmToken, subscribeFcmForeground } from './firebase/messaging';
import { createFamily, lookupJoinCode, findFamilyByParent, deleteFamily, removeProfile } from './firebase/families';
import { signInAnonymous, reauthenticateWithPassword, deleteCurrentUser } from './firebase/auth';
import { loadAppData, generateProfileId } from './hooks/useSaveData';
import { SelectionScreen } from './components/SelectionScreen';
import { PinEntry } from './components/PinEntry';
import { NamingStep } from './components/NamingStep';
import { ProfilePicker } from './components/ProfilePicker';
import { AuthScreen } from './components/AuthScreen';
import { FamilySetup } from './components/FamilySetup';
import { Game } from './components/Game';
import styles from './App.module.css';

const FAMILY_ID_KEY = 'terragucci_familyId';
const DEVICE_PROFILE_KEY = 'terragucci_deviceProfile';

type AppPhase =
  | { step: 'auth' }
  | { step: 'familySetup'; joinCode: string }
  | { step: 'profiles' }
  | { step: 'select' }
  | { step: 'parentPin' }
  | { step: 'parentOnly' }
  | { step: 'name'; creatureType: CreatureType }
  | { step: 'play'; profileId: string; asParent?: boolean };

function App() {
  const { user, loading: authLoading, firebaseAvailable, signUp, signIn, signOut: doSignOut } = useAuth();
  const [familyId, setFamilyId] = useState<string | null>(() => localStorage.getItem(FAMILY_ID_KEY));
  const isParent = Boolean(user && !user.isAnonymous);

  // Choose data provider based on auth state
  const isCloudMode = Boolean(user && familyId);
  console.log('[app] Provider mode:', isCloudMode ? 'CLOUD' : 'LOCAL', '| user:', !!user, '| familyId:', familyId);
  const localProvider = useLocalDataProvider();
  const cloudProvider = useCloudDataProvider(familyId || '__none__', isParent);
  const provider = isCloudMode ? cloudProvider : localProvider;

  const [phase, setPhase] = useState<AppPhase>(() => {
    if (firebaseAvailable && !user && !loadAppData()) return { step: 'auth' };
    const appData = loadAppData();
    if (!appData || appData.profiles.length === 0) return { step: 'select' };
    if (appData.profiles.length === 1) return { step: 'play', profileId: appData.profiles[0].id };
    return { step: 'profiles' };
  });

  // Restore parent session after Firebase auth resolves on page refresh
  useEffect(() => {
    if (authLoading) return;
    if (user && !user.isAnonymous && familyId && phase.step === 'auth') {
      setPhase({ step: 'profiles' });
    }
  }, [authLoading, user, familyId]);

  // Register FCM token when the kid enters play mode in cloud context
  useEffect(() => {
    if (phase.step !== 'play' || !isCloudMode || !familyId) return;
    registerFcmToken(familyId, phase.profileId);
  }, [phase, familyId, isCloudMode]);

  // Subscribe to foreground FCM messages in cloud mode — shows native OS banners
  // Depends only on isCloudMode (a stable boolean) to avoid re-subscribing on every render.
  // provider.cloudContext is a new object reference every render, which would cause
  // the listener to be torn down and re-created constantly, risking duplicate deliveries.
  useEffect(() => {
    if (!isCloudMode) return;
    return subscribeFcmForeground();
  }, [isCloudMode]);

  // Update phase when cloud profiles load
  const appData = provider.appData;

  const handleSignUp = useCallback(async (email: string, password: string) => {
    const u = await signUp(email, password);
    const { familyId: fid, joinCode } = await createFamily(u.uid);
    localStorage.setItem(FAMILY_ID_KEY, fid);
    setFamilyId(fid);
    setPhase({ step: 'familySetup', joinCode });
  }, [signUp]);

  const handleSignIn = useCallback(async (email: string, password: string) => {
    const u = await signIn(email, password);
    // Try localStorage first, then query Firestore for this parent's family
    let fid = localStorage.getItem(FAMILY_ID_KEY);
    if (!fid) {
      const family = await findFamilyByParent(u.uid);
      if (family) {
        fid = family.familyId;
        localStorage.setItem(FAMILY_ID_KEY, fid);
      }
    }
    if (fid) {
      setFamilyId(fid);
      setPhase({ step: 'profiles' });
    } else {
      // Signed in but no family exists yet — create one
      const { familyId: newFid, joinCode } = await createFamily(u.uid);
      localStorage.setItem(FAMILY_ID_KEY, newFid);
      setFamilyId(newFid);
      setPhase({ step: 'familySetup', joinCode });
    }
  }, [signIn]);

  const handleJoinFamily = useCallback(async (code: string) => {
    const fid = await lookupJoinCode(code);
    if (!fid) throw new Error('Family not found. Check the code and try again.');
    await signInAnonymous();
    localStorage.setItem(FAMILY_ID_KEY, fid);
    setFamilyId(fid);
    setPhase({ step: 'profiles' }); // child picks existing profile or adds new
  }, []);

  const handleSkipAuth = useCallback(() => {
    const appData = loadAppData();
    if (appData && appData.profiles.length > 0) {
      if (appData.profiles.length === 1) {
        setPhase({ step: 'play', profileId: appData.profiles[0].id });
      } else {
        setPhase({ step: 'profiles' });
      }
    } else {
      setPhase({ step: 'select' });
    }
  }, []);

  const handleCreationComplete = useCallback((creatureType: CreatureType, childName: string, creatureName: string) => {
    const profile: ChildProfile = {
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
    provider.addProfile(profile);
    localStorage.setItem(DEVICE_PROFILE_KEY, profile.id);
    setPhase({ step: 'play', profileId: profile.id });
  }, [provider]);

  const handleReset = () => {
    if (!window.confirm('Are you sure you want to reset the entire game? All profiles, chores, points, coins, and progress will be permanently deleted.')) {
      return;
    }
    provider.clearAll();
    localStorage.removeItem(FAMILY_ID_KEY);
    localStorage.removeItem(DEVICE_PROFILE_KEY);
    if (user) doSignOut();
    setPhase({ step: 'auth' });
  };

  const handleDeleteAccount = useCallback(async (password: string) => {
    await reauthenticateWithPassword(password);
    if (familyId) {
      const joinCode = provider.cloudContext?.joinCode ?? '';
      await deleteFamily(familyId, joinCode);
    }
    await deleteCurrentUser();
    provider.clearAll();
    localStorage.removeItem(FAMILY_ID_KEY);
    localStorage.removeItem(DEVICE_PROFILE_KEY);
    setFamilyId(null);
    setPhase({ step: 'auth' });
  }, [familyId, provider]);

  const handleRemoveProfile = useCallback(async (profileId: string) => {
    if (familyId) await removeProfile(familyId, profileId);
    const remaining = appData.profiles.filter(p => p.id !== profileId);
    provider.updateAppData({ ...appData, profiles: remaining });
    if (remaining.length === 0) {
      setPhase({ step: 'select' });
    }
  }, [familyId, appData, provider]);

  const handleSwitchProfile = useCallback(() => {
    if (appData.profiles.length <= 1) return;
    setPhase({ step: 'profiles' });
  }, [appData]);

  if (authLoading) {
    return <div className={styles.app} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', color: '#f0e68c', fontSize: '1.5rem' }}>Loading...</div>;
  }

  return (
    <div className={styles.app}>
      {phase.step === 'auth' && (
        <AuthScreen
          onSignUp={handleSignUp}
          onSignIn={handleSignIn}
          onJoinFamily={handleJoinFamily}
          onSkip={handleSkipAuth}
        />
      )}
      {phase.step === 'familySetup' && (
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
      )}
      {phase.step === 'profiles' && !provider.loaded && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', color: '#f0e68c', fontSize: '1.5rem' }}>Loading...</div>
      )}
      {phase.step === 'profiles' && provider.loaded && (
        <ProfilePicker
          profiles={appData.profiles}
          canAdd={true}
          onSelect={(id) => {
            localStorage.setItem(DEVICE_PROFILE_KEY, id);
            setPhase({ step: 'play', profileId: id });
          }}
          onAddNew={() => setPhase({ step: 'select' })}
          parentPin={appData.parentPin}
          onParentSetup={!appData.parentPin ? () => setPhase({ step: 'parentPin' }) : undefined}
          onParentAccess={appData.parentPin && appData.profiles.length > 0 ? () => {
            const firstId = appData.profiles[0].id;
            localStorage.setItem(DEVICE_PROFILE_KEY, firstId);
            setPhase({ step: 'play', profileId: firstId, asParent: true });
          } : undefined}
        />
      )}
      {phase.step === 'select' && (
        <SelectionScreen
          onSelect={(type) => setPhase({ step: 'name', creatureType: type })}
          onParentSetup={() => setPhase({ step: 'parentPin' })}
        />
      )}
      {phase.step === 'parentPin' && (
        <PinEntry
          mode="create"
          onSubmit={(pin) => {
            provider.updateAppData({ ...appData, parentPin: pin });
            if (appData.profiles.length > 0) {
              const firstId = appData.profiles[0].id;
              localStorage.setItem(DEVICE_PROFILE_KEY, firstId);
              setPhase({ step: 'play', profileId: firstId, asParent: true });
            } else {
              setPhase({ step: 'parentOnly' });
            }
            return true;
          }}
          onCancel={() => appData.profiles.length > 0 ? setPhase({ step: 'profiles' }) : setPhase({ step: 'select' })}
        />
      )}
      {phase.step === 'parentOnly' && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', gap: 24, padding: 24 }}>
          <img src="/logo_header.png" alt="HabitHatch" className="logo-header" />
          <div style={{ color: '#f0e68c', fontSize: '1.4rem', fontWeight: 700 }}>Parent Mode</div>
          {provider.cloudContext?.joinCode && (
            <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.95rem', textAlign: 'center' }}>
              Join code: <strong style={{ color: '#f0e68c', letterSpacing: 2 }}>{provider.cloudContext.joinCode}</strong>
            </div>
          )}
          <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem', textAlign: 'center' }}>
            No children added yet. Add a child profile to get started.
          </div>
          <button
            style={{ padding: '12px 28px', background: '#f0e68c', color: '#1a1a2e', border: 'none', borderRadius: 12, fontFamily: 'inherit', fontSize: '1rem', fontWeight: 700, cursor: 'pointer' }}
            onClick={() => setPhase({ step: 'select' })}
          >
            Add Child
          </button>
        </div>
      )}
      {phase.step === 'name' && (
        <NamingStep
          creatureType={phase.creatureType}
          onConfirm={(childName, creatureName) => handleCreationComplete(phase.creatureType, childName, creatureName)}
        />
      )}
      {phase.step === 'play' && (() => {
        const profile = appData.profiles.find(p => p.id === phase.profileId);
        if (!profile) return null;
        return (
          <>
            <Game
              key={profile.id}
              profile={profile}
              appData={appData}
              onUpdateAppData={provider.updateAppData}
              onSaveProfile={provider.saveProfile}
              onSwitchProfile={appData.profiles.length > 1 ? handleSwitchProfile : undefined}
              onAddChild={appData.profiles.length < MAX_PROFILES ? () => setPhase({ step: 'select' }) : undefined}
              onReset={appData.parentPin ? handleReset : undefined}
              onDeleteAccount={isParent ? handleDeleteAccount : undefined}
              onRemoveProfile={isCloudMode ? handleRemoveProfile : undefined}
              joinCode={provider.cloudContext?.joinCode}
              onNotify={provider.notify}
              initialView={phase.asParent ? 'parent' : undefined}
            />
            {!appData.parentPin && (
              <button className={styles.resetBtn} onClick={handleReset}>
                Reset Game
              </button>
            )}
          </>
        );
      })()}
    </div>
  );
}

export default App;

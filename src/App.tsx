import { useState, useCallback } from 'react';
import {
  type CreatureType, type AppData, type ChildProfile,
  MAX_PROFILES, createDefaultPoints, createDefaultChores, createDefaultStreak,
} from './models/types';
import { useAuth } from './hooks/useAuth';
import { useLocalDataProvider, useCloudDataProvider } from './hooks/useDataProvider';
import { createFamily, lookupJoinCode, findFamilyByParent } from './firebase/families';
import { isFirebaseConfigured } from './firebase/config';
import { loadAppData, generateProfileId } from './hooks/useSaveData';
import { SelectionScreen } from './components/SelectionScreen';
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
  | { step: 'name'; creatureType: CreatureType }
  | { step: 'play'; profileId: string };

function App() {
  const { user, loading: authLoading, firebaseAvailable, signUp, signIn, signOut: doSignOut } = useAuth();
  const [familyId, setFamilyId] = useState<string | null>(() => localStorage.getItem(FAMILY_ID_KEY));
  const [isParent, setIsParent] = useState(false);

  // Choose data provider based on auth state
  const isCloudMode = Boolean(user && familyId);
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

  // Update phase when cloud profiles load
  const appData = provider.appData;

  const handleSignUp = useCallback(async (email: string, password: string) => {
    const u = await signUp(email, password);
    const { familyId: fid, joinCode } = await createFamily(u.uid);
    localStorage.setItem(FAMILY_ID_KEY, fid);
    setFamilyId(fid);
    setIsParent(true);
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
      setIsParent(true);
      setPhase({ step: 'profiles' });
    } else {
      // Signed in but no family exists yet — create one
      const { familyId: newFid, joinCode } = await createFamily(u.uid);
      localStorage.setItem(FAMILY_ID_KEY, newFid);
      setFamilyId(newFid);
      setIsParent(true);
      setPhase({ step: 'familySetup', joinCode });
    }
  }, [signIn]);

  const handleJoinFamily = useCallback(async (code: string) => {
    const fid = await lookupJoinCode(code);
    if (!fid) throw new Error('Family not found. Check the code and try again.');
    localStorage.setItem(FAMILY_ID_KEY, fid);
    setFamilyId(fid);
    setIsParent(false);
    setPhase({ step: 'select' }); // child goes to creature creation
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

  const handleCreationComplete = useCallback((creatureType: CreatureType, name: string) => {
    const profile: ChildProfile = {
      id: generateProfileId(),
      creatureType,
      creatureName: name,
      health: 100,
      points: createDefaultPoints(),
      coins: 0,
      chores: createDefaultChores(),
      outfitId: null,
      accessoryId: null,
      ownedOutfits: [],
      ownedAccessories: [],
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
      {phase.step === 'profiles' && (
        <ProfilePicker
          profiles={appData.profiles}
          canAdd={appData.profiles.length < MAX_PROFILES}
          onSelect={(id) => {
            localStorage.setItem(DEVICE_PROFILE_KEY, id);
            setPhase({ step: 'play', profileId: id });
          }}
          onAddNew={() => setPhase({ step: 'select' })}
        />
      )}
      {phase.step === 'select' && (
        <SelectionScreen
          onSelect={(type) => setPhase({ step: 'name', creatureType: type })}
        />
      )}
      {phase.step === 'name' && (
        <NamingStep
          creatureType={phase.creatureType}
          onConfirm={(name) => handleCreationComplete(phase.creatureType, name)}
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
              onSwitchProfile={appData.profiles.length > 1 ? handleSwitchProfile : undefined}
              onAddChild={appData.profiles.length < MAX_PROFILES ? () => setPhase({ step: 'select' }) : undefined}
              onReset={appData.parentPin ? handleReset : undefined}
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

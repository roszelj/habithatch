import { useState, useCallback, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView, AppState, StyleSheet } from 'react-native';

const MOOD_FACES: Record<string, string> = {
  happy: '\u{1F60A}',
  neutral: '\u{1F610}',
  sad: '\u{1F622}',
  distressed: '\u{1F62D}',
};

import {
  type TimeActionType, type OutfitId, type AccessoryId, type HabitatId, type StreakData,
  type ChildProfile, type AppData, type CategoryChores,
  TIME_ACTIONS, MAX_COINS, FEED_COIN_COST, allChoresComplete, createDefaultStreak, isWeekend, getChorePoints,
} from '../models/types';

type DayType = 'weekday' | 'weekend';

function getChoreList(profile: ChildProfile, dayType: DayType): CategoryChores {
  return dayType === 'weekend' ? profile.weekendChores : profile.weekdayChores;
}

function setChoreList(profile: ChildProfile, dayType: DayType, chores: CategoryChores): ChildProfile {
  return dayType === 'weekend'
    ? { ...profile, weekendChores: chores }
    : { ...profile, weekdayChores: chores };
}

import { type FoodItem } from '../models/foods';
import { getHabitatById } from '../models/habitats';
import { HABITAT_IMAGES } from '../models/habitatImages';
import { getOutfitById, getAccessoryById } from '../models/outfits';
import { useCreature } from '../hooks/useCreature';
import { useChores } from '../hooks/useChores';
import { useGameLoop } from '../hooks/useGameLoop';
import { useDailyReset, getToday } from '../hooks/useDailyReset';
import { Creature } from './Creature';
import { StatBar } from './StatBar';
import { ActionButton } from './ActionButton';
import { ChorePanel } from './ChorePanel';
import { Store } from './Store';
import { StreakDisplay } from './StreakDisplay';
import { PinEntry } from './PinEntry';
import { ParentPanel } from './ParentPanel';
import { ChangeCreatureScreen } from './ChangeCreatureScreen';
import { PetFullscreen } from './PetFullscreen';
import { FoodMenu } from './FoodMenu';
import { HelpScreen } from './HelpScreen';
import { TimedChoreSection } from './TimedChoreSection';

interface GameProps {
  profile: ChildProfile;
  appData: AppData;
  onUpdateAppData: (data: AppData) => void;
  onSaveProfile: (profile: ChildProfile) => void;
  onSwitchProfile?: () => void;
  onAddChild?: () => void;
  onReset?: () => void;
  onLogout?: () => void;
  onDeleteAccount?: (email: string, password: string) => Promise<void>;
  onRemoveProfile?: (profileId: string) => Promise<void>;
  joinCode?: string;
  onNotify?: (profileId: string, title: string, body: string) => void;
  initialView?: 'parent';
}

export function Game({ profile, appData, onUpdateAppData, onSaveProfile, onSwitchProfile, onAddChild, onReset, onLogout, onDeleteAccount, onRemoveProfile, joinCode, onNotify, initialView }: GameProps) {
  const { state, mood, dispatch } = useCreature(
    profile.creatureName, profile.creatureType, profile.health, profile.points
  );
  const weekend = isWeekend();
  const activeDayType: DayType = weekend ? 'weekend' : 'weekday';
  const { chores, setChores, addChore, removeChore, checkOffChore, approveChore, rejectChore, resetCategory, resetAll } =
    useChores(weekend ? profile.weekendChores : profile.weekdayChores);
  const [outfitId, setOutfitId] = useState<OutfitId | null>(profile.outfitId);
  const [accessoryId, setAccessoryId] = useState<AccessoryId | null>(profile.accessoryId);
  const [coins, setCoins] = useState(profile.coins ?? 0);
  const [ownedOutfits, setOwnedOutfits] = useState<OutfitId[]>(profile.ownedOutfits ?? []);
  const [ownedAccessories, setOwnedAccessories] = useState<AccessoryId[]>(profile.ownedAccessories ?? []);
  const [habitatId, setHabitatId] = useState<HabitatId | null>(profile.habitatId ?? null);
  const [ownedHabitats, setOwnedHabitats] = useState<HabitatId[]>(profile.ownedHabitats ?? []);
  const [creatureType, setCreatureType] = useState(profile.creatureType);
  const [creatureName, setCreatureName] = useState(profile.creatureName);
  const [isPaused, setIsPaused] = useState(profile.isPaused ?? false);
  const [streak, setStreak] = useState<StreakData>(profile.streak ?? createDefaultStreak());
  const [parentPin, setParentPin] = useState<string | null>(appData.parentPin);
  const [redeemedRewards, setRedeemedRewards] = useState(profile.redeemedRewards || []);
  const [reacting, setReacting] = useState(false);
  const [message, setMessage] = useState('');
  const [speechBubble, setSpeechBubble] = useState<string | null>(null);
  const speechTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [justCompleted, setJustCompleted] = useState(false);
  const [view, setView] = useState<'pet' | 'chores' | 'store' | 'pin' | 'parent' | 'change-creature' | 'help'>(initialView ?? 'pet');
  const [showFullscreen, setShowFullscreen] = useState(false);
  const [showFoodMenu, setShowFoodMenu] = useState(false);
  const prevAllDone = useRef(streak.todayEarned);

  const [lastPlayedDate, setLastPlayedDate] = useState(profile.lastPlayedDate);
  const parentActive = parentPin !== null;

  const { triggerReset } = useDailyReset({
    lastPlayedDate,
    streak,
    weekdayChores: weekend ? profile.weekdayChores : chores,
    weekendChores: weekend ? chores : profile.weekendChores,
    onReset: (newWeekday, newWeekend, newStreak, newDate) => {
      setLastPlayedDate(newDate);
      if (isPausedRef.current) return;
      setChores(isWeekend() ? newWeekend : newWeekday);
      setStreak(newStreak);
    },
  });

  const isChoreStale = lastPlayedDate !== getToday();

  const earnCoins = useCallback((amount: number) => {
    setCoins(prev => Math.min(prev + amount, MAX_COINS));
  }, []);

  // Detect all-chores-complete
  useEffect(() => {
    if (streak.todayEarned) return;
    const done = allChoresComplete(chores);
    if (done && !prevAllDone.current) {
      const newStreak: StreakData = {
        current: streak.current + 1,
        best: Math.max(streak.best, streak.current + 1),
        todayEarned: true,
      };
      setStreak(newStreak);
      setJustCompleted(true);
      setTimeout(() => setJustCompleted(false), 3000);
    }
    prevAllDone.current = done;
  }, [chores, streak]);

  const appDataRef = useRef(appData);
  appDataRef.current = appData;
  const stateRef = useRef(state);
  stateRef.current = state;
  const profileRef = useRef(profile);
  profileRef.current = profile;
  const onSaveProfileRef = useRef(onSaveProfile);
  onSaveProfileRef.current = onSaveProfile;
  const isPausedRef = useRef(isPaused);
  isPausedRef.current = isPaused;
  const redeemedRewardsRef = useRef(redeemedRewards);
  redeemedRewardsRef.current = redeemedRewards;

  const buildProfile = useCallback((): ChildProfile => ({
    ...profileRef.current,
    health: stateRef.current.health,
    points: stateRef.current.points,
    coins,
    weekdayChores: weekend ? profileRef.current.weekdayChores : chores,
    weekendChores: weekend ? chores : profileRef.current.weekendChores,
    outfitId,
    accessoryId,
    ownedOutfits,
    ownedAccessories,
    habitatId,
    ownedHabitats,
    streak,
    notifications: [],
    redeemedRewards,
    creatureType,
    creatureName,
    lastPlayedDate,
    isPaused,
  }), [coins, chores, weekend, outfitId, accessoryId, ownedOutfits, ownedAccessories, habitatId, ownedHabitats, streak, redeemedRewards, creatureType, creatureName, lastPlayedDate, isPaused]);

  const buildProfileRef = useRef(buildProfile);
  buildProfileRef.current = buildProfile;

  // Save on discrete user-driven data changes
  const prevSaveKey = useRef('');
  useEffect(() => {
    const key = JSON.stringify({ coins, chores, outfitId, accessoryId, ownedOutfits, ownedAccessories, habitatId, ownedHabitats, streak, redeemedRewards, creatureType, creatureName, isPaused });
    if (key === prevSaveKey.current) return;
    prevSaveKey.current = key;
    onSaveProfileRef.current(buildProfile());
  }, [buildProfile, coins, chores, outfitId, accessoryId, ownedOutfits, ownedAccessories, habitatId, ownedHabitats, streak, redeemedRewards, creatureType, creatureName, isPaused]);

  // Flush save when app goes to background (AppState replaces pagehide/visibilitychange)
  useEffect(() => {
    const flush = () => { onSaveProfileRef.current(buildProfileRef.current()); };
    const subscription = AppState.addEventListener('change', (nextState) => {
      if (nextState === 'background' || nextState === 'inactive') flush();
    });
    return () => {
      flush(); // unmount path (profile switch)
      subscription.remove();
    };
  }, []);

  // Sync local state when profile prop changes externally (e.g. parent awards bonus on another device)
  const lastSyncedProfile = useRef(profile);
  useEffect(() => {
    const prev = lastSyncedProfile.current;
    if (prev === profile) return;
    lastSyncedProfile.current = profile;

    if (profile.coins !== prev.coins) setCoins(profile.coins ?? 0);
    if (profile.outfitId !== prev.outfitId) setOutfitId(profile.outfitId);
    if (profile.accessoryId !== prev.accessoryId) setAccessoryId(profile.accessoryId);
    if (profile.ownedOutfits !== prev.ownedOutfits) setOwnedOutfits(profile.ownedOutfits ?? []);
    if (profile.ownedAccessories !== prev.ownedAccessories) setOwnedAccessories(profile.ownedAccessories ?? []);
    if (profile.habitatId !== prev.habitatId) setHabitatId(profile.habitatId ?? null);
    if (profile.ownedHabitats !== prev.ownedHabitats) setOwnedHabitats(profile.ownedHabitats ?? []);
    if (profile.isPaused !== prev.isPaused) setIsPaused(profile.isPaused ?? false);
    if (profile.creatureType !== prev.creatureType) setCreatureType(profile.creatureType);
    if (profile.creatureName !== prev.creatureName) setCreatureName(profile.creatureName);
    if (profile.redeemedRewards !== prev.redeemedRewards) setRedeemedRewards(profile.redeemedRewards || []);

    // Sync health/points via reducer load
    const pointsChanged = JSON.stringify(profile.points) !== JSON.stringify(prev.points);
    if (profile.health !== prev.health || pointsChanged) {
      dispatch({ type: 'load', state: { name: profile.creatureName, creatureType: profile.creatureType, health: profile.health, points: profile.points } });
    }

    // Sync chores
    const newChores = weekend ? profile.weekendChores : profile.weekdayChores;
    const prevChores = weekend ? prev.weekendChores : prev.weekdayChores;
    if (JSON.stringify(newChores) !== JSON.stringify(prevChores)) {
      setChores(newChores);
    }
  }, [profile, weekend, dispatch, setChores]);

  useGameLoop((delta) => {
    if (!isPausedRef.current) dispatch({ type: 'decay', delta });
  });

  const handleFeedSelect = useCallback((food: FoodItem) => {
    if (coins < FEED_COIN_COST) return;
    setCoins(prev => prev - FEED_COIN_COST);
    dispatch({ type: 'feed' });
    setReacting(true);
    setTimeout(() => setReacting(false), 400);
    const msg = food.messages[Math.floor(Math.random() * food.messages.length)];
    if (speechTimerRef.current) clearTimeout(speechTimerRef.current);
    setSpeechBubble(msg);
    speechTimerRef.current = setTimeout(() => setSpeechBubble(null), 3000);
    setShowFoodMenu(false);
  }, [dispatch, coins]);

  const handleChoreCheckOff = useCallback((category: TimeActionType, id: string) => {
    checkOffChore(category, id, parentActive);
    const pts = getChorePoints(profile, category);
    if (!parentActive) {
      dispatch({ type: 'earn', category, amount: pts });
      earnCoins(pts);
      setMessage(`+${pts} ${category} pts & coins!`);
    } else {
      setMessage('Pending approval...');
    }
    setTimeout(() => setMessage(''), 1500);
  }, [checkOffChore, dispatch, parentActive, earnCoins, profile]);

  const handleApprove = useCallback((category: TimeActionType, id: string) => {
    approveChore(category, id);
    const pts = getChorePoints(profile, category);
    dispatch({ type: 'earn', category, amount: pts });
    earnCoins(pts);
  }, [approveChore, dispatch, earnCoins, profile]);

  const handleBuyItem = useCallback((type: 'outfit' | 'accessory' | 'habitat', id: string, price: number) => {
    if (coins < price) return;
    setCoins(prev => prev - price);
    if (type === 'outfit') {
      setOwnedOutfits(prev => [...prev, id]);
      setOutfitId(id);
    } else if (type === 'accessory') {
      setOwnedAccessories(prev => [...prev, id]);
      setAccessoryId(id);
    } else {
      setOwnedHabitats(prev => [...prev, id]);
      setHabitatId(id);
    }
    setMessage('Purchased!');
    setTimeout(() => setMessage(''), 1500);
  }, [coins]);

  const handlePinSubmit = useCallback((pin: string): boolean => {
    if (parentPin === null) {
      setParentPin(pin);
      onUpdateAppData({ ...appDataRef.current, parentPin: pin });
      setView('parent');
      return true;
    }
    if (pin === parentPin) {
      setView('parent');
      return true;
    }
    return false;
  }, [parentPin, onUpdateAppData]);

  const handleCrossProfileApprove = useCallback((profileId: string, category: TimeActionType, choreId: string, dayType: DayType = activeDayType) => {
    if (profileId === profile.id) {
      const choreName = chores[category].find(c => c.id === choreId)?.name ?? 'a chore';
      handleApprove(category, choreId);
      onNotify?.(profile.id, 'Chore approved! \u{1F389}', `Great job completing: ${choreName}`);
    } else {
      const targetProfile = appData.profiles.find(p => p.id === profileId);
      if (!targetProfile) return;
      const targetChores = getChoreList(targetProfile, dayType);
      const choreName = targetChores[category].find(c => c.id === choreId)?.name ?? 'a chore';
      const updatedChores = {
        ...targetChores,
        [category]: targetChores[category].map(c =>
          c.id === choreId && c.status === 'pending' ? { ...c, status: 'approved' as const } : c
        ),
      };
      const pts = getChorePoints(targetProfile, category);
      const updatedPoints = { ...targetProfile.points, [category]: Math.min(targetProfile.points[category] + pts, 999) };
      const updatedProfile = {
        ...setChoreList(targetProfile, dayType, updatedChores),
        points: updatedPoints,
        coins: Math.min((targetProfile.coins ?? 0) + pts, MAX_COINS),
      };
      onUpdateAppData({
        ...appData, parentPin,
        profiles: appData.profiles.map(p => p.id === profileId ? updatedProfile : p),
      });
      onNotify?.(profileId, 'Chore approved! \u{1F389}', `Great job completing: ${choreName}`);
    }
  }, [profile.id, chores, appData, parentPin, activeDayType, handleApprove, onUpdateAppData, onNotify]);

  const handleCrossProfileReject = useCallback((profileId: string, category: TimeActionType, choreId: string, dayType: DayType = activeDayType) => {
    if (profileId === profile.id) {
      rejectChore(category, choreId);
    } else {
      const targetProfile = appData.profiles.find(p => p.id === profileId);
      if (!targetProfile) return;
      const targetChores = getChoreList(targetProfile, dayType);
      const updatedChores = {
        ...targetChores,
        [category]: targetChores[category].map(c =>
          c.id === choreId && c.status === 'pending' ? { ...c, status: 'unchecked' as const } : c
        ),
      };
      onUpdateAppData({
        ...appData, parentPin,
        profiles: appData.profiles.map(p => p.id === profileId ? setChoreList(targetProfile, dayType, updatedChores) : p),
      });
    }
  }, [profile.id, appData, parentPin, activeDayType, rejectChore, onUpdateAppData]);

  const handleCrossProfileAddChore = useCallback((profileId: string, category: TimeActionType, name: string, dayType: DayType = activeDayType) => {
    if (profileId === profile.id && dayType === activeDayType) {
      addChore(category, name);
    } else {
      const targetProfile = profileId === profile.id ? buildProfile() : appData.profiles.find(p => p.id === profileId);
      if (!targetProfile) return;
      const trimmed = name.trim().slice(0, 40);
      if (!trimmed) return;
      const newChore = { id: String(Date.now()), name: trimmed, status: 'unchecked' as const };
      const targetChores = getChoreList(targetProfile, dayType);
      onUpdateAppData({
        ...appData, parentPin,
        profiles: appData.profiles.map(p => p.id === profileId
          ? setChoreList(targetProfile, dayType, { ...targetChores, [category]: [...targetChores[category], newChore] })
          : p),
      });
    }
  }, [profile.id, appData, parentPin, activeDayType, addChore, buildProfile, onUpdateAppData]);

  const handleAddChoreAllKids = useCallback((category: TimeActionType, name: string, dayType: DayType = activeDayType) => {
    const trimmed = name.trim().slice(0, 40);
    if (!trimmed) return;
    if (dayType === activeDayType) addChore(category, name);
    const now = Date.now();
    onUpdateAppData({
      ...appDataRef.current, parentPin,
      profiles: appDataRef.current.profiles.map((p, i) => {
        if (p.id === profile.id && dayType === activeDayType) return p;
        const newChore = { id: String(now + i), name: trimmed, status: 'unchecked' as const };
        const targetChores = getChoreList(p, dayType);
        return setChoreList(p, dayType, { ...targetChores, [category]: [...targetChores[category], newChore] });
      }),
    });
  }, [profile.id, parentPin, activeDayType, addChore, onUpdateAppData]);

  const handleCrossProfileRemoveChore = useCallback((profileId: string, category: TimeActionType, choreId: string, dayType: DayType = activeDayType) => {
    if (profileId === profile.id && dayType === activeDayType) {
      removeChore(category, choreId);
    } else {
      const targetProfile = profileId === profile.id ? buildProfile() : appData.profiles.find(p => p.id === profileId);
      if (!targetProfile) return;
      const targetChores = getChoreList(targetProfile, dayType);
      onUpdateAppData({
        ...appData, parentPin,
        profiles: appData.profiles.map(p => p.id === profileId
          ? setChoreList(targetProfile, dayType, { ...targetChores, [category]: targetChores[category].filter(c => c.id !== choreId) })
          : p),
      });
    }
  }, [profile.id, appData, parentPin, activeDayType, removeChore, buildProfile, onUpdateAppData]);

  const handleFulfillReward = useCallback((profileId: string, redeemedRewardId: string, rewardName: string) => {
    if (profileId === profile.id) {
      const updated = redeemedRewardsRef.current.map(r => r.id === redeemedRewardId ? { ...r, fulfilled: true } : r);
      setRedeemedRewards(updated);
      onUpdateAppData({
        ...appDataRef.current, parentPin,
        profiles: appDataRef.current.profiles.map(p => p.id === profileId ? { ...p, redeemedRewards: updated } : p),
      });
    } else {
      const target = appData.profiles.find(p => p.id === profileId);
      if (!target) return;
      onUpdateAppData({
        ...appData, parentPin,
        profiles: appData.profiles.map(p => p.id === profileId ? {
          ...target,
          redeemedRewards: (target.redeemedRewards || []).map(r =>
            r.id === redeemedRewardId ? { ...r, fulfilled: true } : r
          ),
        } : p),
      });
    }
    onNotify?.(profileId, 'Reward unlocked! \u{1F381}', `You earned: ${rewardName}`);
  }, [profile.id, appData, parentPin, onUpdateAppData, onNotify]);

  const handleCreatureChange = useCallback((type: typeof creatureType, name: string) => {
    setCreatureType(type);
    setCreatureName(name);
    setView('pet');
  }, []);

  const handleTogglePause = useCallback((profileId: string, paused: boolean) => {
    if (profileId === profile.id) {
      setIsPaused(paused);
    } else {
      const target = appDataRef.current.profiles.find(p => p.id === profileId);
      if (!target) return;
      onUpdateAppData({
        ...appDataRef.current, parentPin,
        profiles: appDataRef.current.profiles.map(p =>
          p.id === profileId
            ? { ...target, isPaused: paused, lastPlayedDate: paused ? target.lastPlayedDate : getToday() }
            : p
        ),
      });
    }
  }, [profile.id, parentPin, onUpdateAppData]);

  // --- Conditional views below ---

  if (view === 'change-creature') {
    return (
      <ChangeCreatureScreen
        currentType={creatureType}
        currentName={creatureName}
        onConfirm={handleCreatureChange}
        onCancel={() => setView('pet')}
      />
    );
  }

  if (view === 'pin') {
    return (
      <PinEntry
        mode={parentPin === null ? 'create' : 'verify'}
        onSubmit={handlePinSubmit}
        onCancel={() => setView('pet')}
      />
    );
  }

  if (view === 'parent') {
    const currentProfile: ChildProfile = {
      ...profile, health: state.health, points: state.points, coins,
      weekdayChores: weekend ? profile.weekdayChores : chores,
      weekendChores: weekend ? chores : profile.weekendChores,
      outfitId, accessoryId, ownedOutfits, ownedAccessories, habitatId, ownedHabitats, streak,
      redeemedRewards,
      creatureType, creatureName,
      lastPlayedDate: new Date().toISOString().slice(0, 10),
    };
    const liveProfiles = appData.profiles.map(p => p.id === profile.id ? currentProfile : p);

    return (
      <View style={[styles.game, styles.overlay]}>
        <Text style={styles.title}>PARENT MODE</Text>
        <ParentPanel
          profiles={liveProfiles}
          activeProfileId={profile.id}
          onAddChore={handleCrossProfileAddChore}
          onAddChoreAllKids={handleAddChoreAllKids}
          onRemoveChore={handleCrossProfileRemoveChore}
          onApprove={handleCrossProfileApprove}
          onReject={handleCrossProfileReject}
          onBonus={(profileId, category, amount, reason) => {
            const notification = {
              id: String(Date.now()), category, amount, reason,
              timestamp: new Date().toISOString(),
            };
            if (profileId === profile.id) {
              dispatch({ type: 'earn', category, amount });
              earnCoins(amount);
            } else {
              const target = appData.profiles.find(p => p.id === profileId);
              if (!target) return;
              onUpdateAppData({
                ...appData, parentPin,
                profiles: appData.profiles.map(p => p.id === profileId ? {
                  ...target,
                  points: { ...target.points, [category]: Math.min(target.points[category] + amount, 999) },
                  coins: Math.min((target.coins ?? 0) + amount, MAX_COINS),
                  notifications: [...(target.notifications || []), notification],
                } : p),
              });
            }
            onNotify?.(profileId, `+${amount} bonus points! \u{1F31F}`, reason || 'Great work!');
          }}
          rewardPresents={appData.rewardPresents || []}
          onAddReward={(name, price) => {
            const reward = { id: String(Date.now()), name, price };
            onUpdateAppData({ ...appData, parentPin, rewardPresents: [...(appData.rewardPresents || []), reward] });
          }}
          onRemoveReward={(id) => {
            onUpdateAppData({ ...appData, parentPin, rewardPresents: (appData.rewardPresents || []).filter(r => r.id !== id) });
          }}
          onFulfillReward={handleFulfillReward}
          joinCode={joinCode}
          onTogglePause={handleTogglePause}
          onUpdateChildName={(profileId, childName) => {
            onUpdateAppData({ ...appData, parentPin, profiles: appData.profiles.map(p => p.id === profileId ? { ...p, childName } : p) });
          }}
          onUpdateChorePoints={(profileId, chorePoints) => {
            onUpdateAppData({ ...appData, parentPin, profiles: appData.profiles.map(p => p.id === profileId ? { ...p, chorePointsPerCategory: chorePoints } : p) });
          }}
          onAddChild={onAddChild}
          onReset={onReset}
          onLogout={onLogout}
          onDeleteAccount={onDeleteAccount}
          onRemoveProfile={onRemoveProfile}
          onBack={() => setView('pet')}
        />
        <TouchableOpacity style={styles.parentBackBtn} onPress={() => setView('pet')}>
          <Text style={styles.parentBackBtnText}>{'\u{2190}'} Back to Kid Mode</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (view === 'help') {
    return (
      <View style={styles.game}>
        <HelpScreen onClose={() => setView('pet')} showSwitchProfile={!!onSwitchProfile} />
      </View>
    );
  }

  if (view === 'chores') {
    return (
      <View style={[styles.game, styles.overlay]}>
        <Text style={styles.title}>CHORES</Text>
        <ChorePanel
          chores={chores}
          points={state.points}
          parentActive={parentActive}
          dayTypeLabel={weekend ? 'Weekend Chores (Sat-Sun)' : 'Weekday Chores (Mon-Fri)'}
          onAdd={addChore}
          onRemove={removeChore}
          onToggle={handleChoreCheckOff}
          onResetCategory={resetCategory}
          onResetAll={resetAll}
          isStale={isChoreStale}
          onRefresh={triggerReset}
        />
        <TouchableOpacity style={styles.navBtn} onPress={() => setView('pet')}>
          <Text style={styles.navBtnText}>{'\u{2190}'} Back to Pet</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (view === 'store') {
    const storeHabitat = getHabitatById(habitatId);
    const storeOutfit = getOutfitById(outfitId);
    const storeAccessory = getAccessoryById(accessoryId);
    const storeHabitatImg = habitatId ? HABITAT_IMAGES[habitatId] : null;
    return (
      <View style={[styles.game, styles.overlay]}>
        <Text style={styles.title}>STORE</Text>
        <View style={styles.creatureStage}>
          {(storeOutfit || storeAccessory) && (
            <View style={styles.stageTopRow}>
              {storeOutfit && <Text style={styles.stageEquipEmoji}>{storeOutfit.emoji}</Text>}
              {storeAccessory && <Text style={styles.stageEquipEmoji}>{storeAccessory.emoji}</Text>}
            </View>
          )}
          {storeHabitat && storeHabitatImg && (
            <Image source={storeHabitatImg} style={styles.habitatBackground} resizeMode="cover" />
          )}
          <Creature
            name={creatureName}
            mood={mood}
            creatureType={creatureType}
            accessoryId={accessoryId}
            reacting={false}
          />
        </View>
        <Text style={styles.stageMood}>{MOOD_FACES[mood]}</Text>
        <Store
          coins={coins}
          outfitId={outfitId}
          accessoryId={accessoryId}
          ownedOutfits={ownedOutfits}
          ownedAccessories={ownedAccessories}
          habitatId={habitatId}
          ownedHabitats={ownedHabitats}
          rewardPresents={appData.rewardPresents || []}
          onBuy={handleBuyItem}
          onEquipHabitat={setHabitatId}
          onRedeemReward={(reward) => {
            if (coins < reward.price) return;
            setCoins(prev => prev - reward.price);
            setRedeemedRewards(prev => [...prev, {
              id: String(Date.now()),
              rewardId: reward.id,
              rewardName: reward.name,
              timestamp: new Date().toISOString(),
              fulfilled: false,
            }]);
            setMessage(`Redeemed: ${reward.name}!`);
            setTimeout(() => setMessage(''), 2000);
          }}
          onEquipOutfit={setOutfitId}
          onEquipAccessory={setAccessoryId}
        />
        <TouchableOpacity style={styles.navBtn} onPress={() => setView('pet')}>
          <Text style={styles.navBtnText}>{'\u{2190}'} Back to Pet</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // --- PET VIEW (default) ---
  const activeHabitat = getHabitatById(habitatId);
  const activeHabitatImg = habitatId ? HABITAT_IMAGES[habitatId] : null;
  const activeOutfit = getOutfitById(outfitId);
  const activeAccessory = getAccessoryById(accessoryId);

  const tabItems: Array<{ icon: string; label: string; onPress: () => void }> = [
    { icon: '\u{1F4CB}', label: 'Chores', onPress: () => setView('chores') },
    { icon: '\u{1F6CD}\u{FE0F}', label: 'Store', onPress: () => setView('store') },
    { icon: '\u{1F422}', label: 'Change', onPress: () => setView('change-creature') },
    { icon: '\u{1F512}', label: 'Parent', onPress: () => setView('pin') },
    { icon: '\u{2753}', label: 'Help', onPress: () => setView('help') },
  ];
  if (onSwitchProfile) {
    tabItems.push({ icon: '\u{1F465}', label: 'Switch', onPress: onSwitchProfile });
  }

  return (
    <View style={styles.game}>
      <ScrollView style={styles.gameContent} contentContainerStyle={styles.gameContentInner} showsVerticalScrollIndicator={false}>
        <Image source={require('../../assets/logo_header.png')} style={styles.logo} resizeMode="contain" />
        {isPaused && (
          <View style={styles.pauseBanner}>
            <Text style={styles.pauseBannerText}>💤 Resting — your pet is safe!</Text>
          </View>
        )}
        <TouchableOpacity
          style={styles.creatureStage}
          onPress={() => { if (state.health > 0) setShowFullscreen(true); }}
          activeOpacity={state.health > 0 ? 0.8 : 1}
        >
          {(activeOutfit || activeAccessory) && (
            <View style={styles.stageTopRow}>
              {activeOutfit && <Text style={styles.stageEquipEmoji}>{activeOutfit.emoji}</Text>}
              {activeAccessory && <Text style={styles.stageEquipEmoji}>{activeAccessory.emoji}</Text>}
            </View>
          )}
          {activeHabitat && activeHabitatImg && (
            <Image source={activeHabitatImg} style={styles.habitatBackground} resizeMode="cover" />
          )}
          {speechBubble && (
            <View style={styles.speechBubble}>
              <Text style={styles.speechBubbleText}>{speechBubble}</Text>
            </View>
          )}
          <Creature
            name={creatureName}
            mood={mood}
            creatureType={creatureType}
            accessoryId={accessoryId}
            reacting={reacting}
          />
        </TouchableOpacity>
        <Text style={styles.stageMood}>{MOOD_FACES[mood]}</Text>
        <StreakDisplay streak={streak} justCompleted={justCompleted} />
        {message ? <Text style={styles.message}>{message}</Text> : null}
        <View style={styles.pointsRow}>
          {TIME_ACTIONS.map(a => (
            <View key={a.type} style={styles.pointBadge}>
              <Text style={styles.pointBadgeText}>{a.emoji} {state.points[a.type]}</Text>
            </View>
          ))}
          <View style={styles.pointBadge}>
            <Text style={styles.totalPoints}>{'\u{1F4B0}'} {coins}</Text>
          </View>
        </View>
        <View style={styles.stats}>
          <StatBar label={'\u{2764}\u{FE0F}'} value={state.health} color="#e74c3c" />
        </View>
        <View style={styles.actions}>
          <ActionButton
            emoji={'\u{1F372}'}
            label="Feed"
            cost={FEED_COIN_COST}
            costUnit={'\u{1F4B0}'}
            disabled={coins < FEED_COIN_COST}
            onClick={() => setShowFoodMenu(true)}
          />
        </View>
        <TimedChoreSection
          chores={chores}
          parentActive={parentActive}
          onToggle={(category, id) => checkOffChore(category, id, parentActive)}
        />
      </ScrollView>

      <View style={styles.tabBar}>
        {tabItems.map(item => (
          <TouchableOpacity key={item.label} style={styles.tabItem} onPress={item.onPress}>
            <Text style={styles.tabIcon}>{item.icon}</Text>
            <Text style={styles.tabLabel}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {showFullscreen && (
        <PetFullscreen
          creatureType={creatureType}
          creatureName={creatureName}
          childName={profile.childName}
          habitatId={habitatId}
          onClose={() => setShowFullscreen(false)}
          onAwardCoins={(amount) => {
            setCoins(prev => Math.max(0, Math.min(prev + amount, MAX_COINS)));
          }}
        />
      )}
      {showFoodMenu && (
        <FoodMenu
          onSelect={handleFeedSelect}
          onClose={() => setShowFoodMenu(false)}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  game: { flex: 1 },
  gameContent: { flex: 1 },
  gameContentInner: { alignItems: 'center', padding: 16, gap: 10 },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 56,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(255,255,255,0.15)',
    backgroundColor: 'rgba(0,0,0,0.25)',
  },
  tabItem: { alignItems: 'center', justifyContent: 'center', flex: 1, paddingVertical: 4 },
  tabIcon: { fontSize: 20 },
  tabLabel: { fontSize: 10, fontWeight: '500', color: 'rgba(255,255,255,0.4)', marginTop: 2 },
  overlay: { paddingHorizontal: 16 },
  logo: { width: 180, height: 56 },
  title: { fontSize: 18, fontWeight: '700', color: '#f0e68c', letterSpacing: 2 },
  pauseBanner: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(240,230,140,0.1)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(240,230,140,0.3)',
  },
  pauseBannerText: { fontSize: 13, color: '#f0e68c' },
  creatureStage: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    overflow: 'hidden',
    minHeight: 180,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    position: 'relative',
  },
  stageTopRow: {
    position: 'absolute',
    top: 8,
    flexDirection: 'row',
    gap: 8,
    zIndex: 2,
  },
  stageEquipEmoji: { fontSize: 24 },
  habitatBackground: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  speechBubble: {
    position: 'absolute',
    top: 10,
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 14,
    zIndex: 3,
    maxWidth: '80%',
  },
  speechBubbleText: { fontSize: 14, color: '#1a1a2e', fontWeight: '600' },
  stageMood: { fontSize: 28, textAlign: 'center' },
  message: { fontSize: 14, color: '#f0e68c', fontWeight: '600' },
  pointsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    justifyContent: 'center',
  },
  pointBadge: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 12,
  },
  pointBadgeText: { fontSize: 13, color: 'rgba(255,255,255,0.7)' },
  totalPoints: { fontSize: 14, fontWeight: '700', color: '#f0e68c' },
  stats: { width: '100%' },
  actions: { width: '100%' },
  navBtn: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    borderRadius: 10,
    alignSelf: 'center',
  },
  navBtnText: { fontSize: 14, color: 'rgba(255,255,255,0.7)', fontWeight: '600' },
  parentBackBtn: {
    paddingVertical: 10,
    backgroundColor: '#f0e68c',
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 8,
  },
  parentBackBtnText: { fontSize: 15, fontWeight: '700', color: '#1a1a2e' },
});

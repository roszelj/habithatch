import { useState, useCallback, useEffect, useRef } from 'react';

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
import styles from './Game.module.css';

interface GameProps {
  profile: ChildProfile;
  appData: AppData;
  onUpdateAppData: (data: AppData) => void;
  onSaveProfile: (profile: ChildProfile) => void;
  onSwitchProfile?: () => void;
  onAddChild?: () => void;
  onReset?: () => void;
  joinCode?: string;
  onNotify?: (profileId: string, title: string, body: string) => void;
  initialView?: 'parent';
}

export function Game({ profile, appData, onUpdateAppData, onSaveProfile, onSwitchProfile, onAddChild, onReset, joinCode, onNotify, initialView }: GameProps) {
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
      setLastPlayedDate(newDate); // always advance date pointer (keeps lastPlayedDate current while paused)
      if (isPausedRef.current) return; // skip streak/chore reset when paused
      // Re-check day type since the day just changed
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

  // Auto-save: only on discrete user actions, never on continuous decay
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

  // Always keep a ref to the latest buildProfile to avoid stale closures in event handlers
  const buildProfileRef = useRef(buildProfile);
  buildProfileRef.current = buildProfile;

  // Save when user-driven data changes only
  const prevSaveKey = useRef('');
  useEffect(() => {
    const key = JSON.stringify({ coins, chores, outfitId, accessoryId, ownedOutfits, ownedAccessories, habitatId, ownedHabitats, streak, redeemedRewards, creatureType, creatureName, isPaused });
    if (key === prevSaveKey.current) return;
    prevSaveKey.current = key;
    onSaveProfileRef.current(buildProfile());
  }, [buildProfile, coins, chores, outfitId, accessoryId, ownedOutfits, ownedAccessories, habitatId, ownedHabitats, streak, redeemedRewards, creatureType, creatureName, isPaused]);

  // Flush save on unmount, pagehide, and visibility-hidden.
  // On iOS PWA, React cleanup (unmount) is NOT guaranteed when the app is backgrounded/killed —
  // iOS suspends JS abruptly. pagehide and visibilitychange are the reliable last-chance hooks.
  useEffect(() => {
    const flush = () => { onSaveProfileRef.current(buildProfileRef.current()); };
    const handleVisibility = () => { if (document.visibilityState === 'hidden') flush(); };
    window.addEventListener('pagehide', flush);
    document.addEventListener('visibilitychange', handleVisibility);
    return () => {
      flush(); // unmount path (e.g. profile switch)
      window.removeEventListener('pagehide', flush);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, []);

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
      setOutfitId(id); // auto-equip
    } else if (type === 'accessory') {
      setOwnedAccessories(prev => [...prev, id]);
      setAccessoryId(id); // auto-equip
    } else {
      setOwnedHabitats(prev => [...prev, id]);
      setHabitatId(id); // auto-equip
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
      onNotify?.(profile.id, 'Chore approved! 🎉', `Great job completing: ${choreName}`);
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
      const updatedPoints = {
        ...targetProfile.points,
        [category]: Math.min(targetProfile.points[category] + pts, 999),
      };
      const updatedProfile = {
        ...setChoreList(targetProfile, dayType, updatedChores),
        points: updatedPoints,
        coins: Math.min((targetProfile.coins ?? 0) + pts, MAX_COINS),
      };
      onUpdateAppData({
        ...appData, parentPin,
        profiles: appData.profiles.map(p => p.id === profileId ? updatedProfile : p),
      });
      onNotify?.(profileId, 'Chore approved! 🎉', `Great job completing: ${choreName}`);
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
    // Add to current profile's active chores via local state if matching day type
    if (dayType === activeDayType) {
      addChore(category, name);
    }
    const now = Date.now();
    onUpdateAppData({
      ...appDataRef.current, parentPin,
      profiles: appDataRef.current.profiles.map((p, i) => {
        // Skip current profile's active list (handled by addChore above)
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
        profiles: appDataRef.current.profiles.map(p => p.id === profileId ? {
          ...p, redeemedRewards: updated,
        } : p),
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
    onNotify?.(profileId, 'Reward unlocked! 🎁', `You earned: ${rewardName}`);
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

  // --- All hooks above this line --- conditional returns below ---

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
      creatureType, creatureName,
      lastPlayedDate: new Date().toISOString().slice(0, 10),
    };
    const liveProfiles = appData.profiles.map(p => p.id === profile.id ? currentProfile : p);

    return (
      <div className={styles.game}>
        <div className={styles.title}>PARENT MODE</div>
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
            onNotify?.(profileId, `+${amount} bonus points! 🌟`, reason || 'Great work!');
          }}
          rewardPresents={appData.rewardPresents || []}
          onAddReward={(name, price) => {
            const reward = { id: String(Date.now()), name, price };
            onUpdateAppData({
              ...appData,
              parentPin,
              rewardPresents: [...(appData.rewardPresents || []), reward],
            });
          }}
          onRemoveReward={(id) => {
            onUpdateAppData({
              ...appData,
              parentPin,
              rewardPresents: (appData.rewardPresents || []).filter(r => r.id !== id),
            });
          }}
          onFulfillReward={handleFulfillReward}
          joinCode={joinCode}
          onTogglePause={handleTogglePause}
          onUpdateChildName={(profileId, childName) => {
            onUpdateAppData({
              ...appData, parentPin,
              profiles: appData.profiles.map(p => p.id === profileId ? { ...p, childName } : p),
            });
          }}
          onUpdateChorePoints={(profileId, chorePoints) => {
            onUpdateAppData({
              ...appData, parentPin,
              profiles: appData.profiles.map(p => p.id === profileId ? { ...p, chorePointsPerCategory: chorePoints } : p),
            });
          }}
        />
        <div className={styles.parentToolbar}>
          {(onAddChild || onReset) && (
            <div className={styles.parentToolbarSecondary}>
              {onAddChild && (
                <button className={styles.parentSecondaryBtn} onClick={onAddChild}>
                  {'\u{2795}'} Add Child
                </button>
              )}
              {onReset && (
                <button className={styles.parentDangerBtn} onClick={onReset}>
                  {'\u{1F5D1}\u{FE0F}'} Reset Game
                </button>
              )}
            </div>
          )}
          <button className={styles.parentBackBtn} onClick={() => setView('pet')}>
            {'\u{2190}'} Back to Kid Mode
          </button>
        </div>
      </div>
    );
  }

  if (view === 'help') {
    return (
      <div className={styles.game}>
        <HelpScreen onClose={() => setView('pet')} showSwitchProfile={!!onSwitchProfile} />
      </div>
    );
  }

  if (view === 'chores') {
    return (
      <div className={styles.game}>
        <div className={styles.title}>CHORES</div>
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
        <button className={styles.choreToggle} onClick={() => setView('pet')}>
          {'\u{2190}'} Back to Pet
        </button>
      </div>
    );
  }

  if (view === 'store') {
    const storeHabitat = getHabitatById(habitatId);
    const storeOutfit = getOutfitById(outfitId);
    const storeAccessory = getAccessoryById(accessoryId);
    return (
      <div className={styles.game}>
        <div className={styles.title}>STORE</div>
        <div className={styles.creatureStage}>
          {(storeOutfit || storeAccessory) && (
            <div className={styles.stageTopRow}>
              {storeOutfit && <span className={styles.stageEquipEmoji}>{storeOutfit.emoji}</span>}
              {storeAccessory && <span className={styles.stageEquipEmoji}>{storeAccessory.emoji}</span>}
            </div>
          )}
          {storeHabitat && (
            <div className={styles.habitatBackground}>
              <img src={storeHabitat.image} alt={storeHabitat.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          )}
          <Creature
            name={creatureName}
            mood={mood}
            creatureType={creatureType}
            accessoryId={accessoryId}
            reacting={false}
          />
        </div>
        <div className={styles.stageMood}>{MOOD_FACES[mood]}</div>
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
        <button className={styles.choreToggle} onClick={() => setView('pet')}>
          {'\u{2190}'} Back to Pet
        </button>
      </div>
    );
  }

  const activeHabitat = getHabitatById(habitatId);
  const activeOutfit = getOutfitById(outfitId);
  const activeAccessory = getAccessoryById(accessoryId);

  return (
    <div className={styles.game}>
      <img src="/logo_header.png" alt="HabitHatch" className="logo-header" />
      {isPaused && (
        <div className={styles.pauseBanner}>💤 Resting — your pet is safe!</div>
      )}
      <div className={`${styles.creatureStage} ${styles.creatureStageGrow}`} onClick={() => { if (state.health > 0) setShowFullscreen(true); }} style={{ cursor: state.health > 0 ? 'pointer' : 'default' }}>
        {(activeOutfit || activeAccessory) && (
          <div className={styles.stageTopRow}>
            {activeOutfit && <span className={styles.stageEquipEmoji}>{activeOutfit.emoji}</span>}
            {activeAccessory && <span className={styles.stageEquipEmoji}>{activeAccessory.emoji}</span>}
          </div>
        )}
        {activeHabitat && (
          <div className={styles.habitatBackground}>
              <img src={activeHabitat.image} alt={activeHabitat.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
        )}
        {speechBubble && (
          <div className={styles.speechBubble}>{speechBubble}</div>
        )}
        <Creature
          name={creatureName}
          mood={mood}
          creatureType={creatureType}
          accessoryId={accessoryId}
          reacting={reacting}
        />
      </div>
      <div className={styles.stageMood}>{MOOD_FACES[mood]}</div>
      <StreakDisplay streak={streak} justCompleted={justCompleted} />
{message && <div className={styles.message}>{message}</div>}
      <div className={styles.pointsRow}>
        {TIME_ACTIONS.map(a => (
          <span key={a.type} className={styles.pointBadge}>
            {a.emoji} {state.points[a.type]}
          </span>
        ))}
        <span className={styles.totalPoints}>
          {'\u{1FA99}'} {coins}
        </span>
      </div>
      <div className={styles.stats}>
        <StatBar label={'\u{2764}\u{FE0F}'} value={state.health} color="#e74c3c" />
      </div>
      <div className={styles.actions}>
        <ActionButton
          emoji={'\u{1F372}'}
          label="Feed"
          cost={FEED_COIN_COST}
          costUnit={'\u{1FA99}'}
          disabled={coins < FEED_COIN_COST}
          onClick={() => setShowFoodMenu(true)}
        />
      </div>
      <div className={styles.toolbar}>
        <button className={styles.choreToggle} onClick={() => setView('chores')}>
          {'\u{1F4CB}'} Chores
        </button>
        <button className={styles.choreToggle} onClick={() => setView('store')}>
          {'\u{1F6CD}\u{FE0F}'} Store
        </button>
        <button className={styles.choreToggle} onClick={() => setView('change-creature')}>
          {'\u{1F422}'} Change
        </button>
        <button className={styles.choreToggle} onClick={() => setView('pin')}>
          {'\u{1F512}'} Parent
        </button>
        <button className={styles.choreToggle} onClick={() => setView('help')}>
          {'\u{2753}'} Help
        </button>
        {onSwitchProfile && (
          <button className={styles.choreToggle} onClick={onSwitchProfile}>
            {'\u{1F465}'} Switch
          </button>
        )}
      </div>
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
    </div>
  );
}

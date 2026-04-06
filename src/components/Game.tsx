import { useState, useCallback, useEffect, useRef } from 'react';
import {
  type TimeActionType, type OutfitId, type AccessoryId, type StreakData,
  type ChildProfile, type AppData,
  TIME_ACTIONS, POINTS_PER_CHORE, MAX_COINS, allChoresComplete, createDefaultStreak,
} from '../models/types';
import { useCreature } from '../hooks/useCreature';
import { useChores } from '../hooks/useChores';
import { useGameLoop } from '../hooks/useGameLoop';
import { saveProfile } from '../hooks/useSaveData';
import { Creature } from './Creature';
import { StatBar } from './StatBar';
import { ActionButton } from './ActionButton';
import { ChorePanel } from './ChorePanel';
import { Store } from './Store';
import { StreakDisplay } from './StreakDisplay';
import { PinEntry } from './PinEntry';
import { ParentPanel } from './ParentPanel';
import styles from './Game.module.css';

interface GameProps {
  profile: ChildProfile;
  appData: AppData;
  onUpdateAppData: (data: AppData) => void;
  onSwitchProfile?: () => void;
  onAddChild?: () => void;
  onReset?: () => void;
}

export function Game({ profile, appData, onUpdateAppData, onSwitchProfile, onAddChild, onReset }: GameProps) {
  const { state, mood, dispatch } = useCreature(
    profile.creatureName, profile.creatureType, profile.health, profile.points
  );
  const { chores, addChore, removeChore, checkOffChore, approveChore, rejectChore, resetCategory, resetAll } =
    useChores(profile.chores);
  const [outfitId, setOutfitId] = useState<OutfitId | null>(profile.outfitId);
  const [accessoryId, setAccessoryId] = useState<AccessoryId | null>(profile.accessoryId);
  const [coins, setCoins] = useState(profile.coins ?? 0);
  const [ownedOutfits, setOwnedOutfits] = useState<OutfitId[]>(profile.ownedOutfits ?? []);
  const [ownedAccessories, setOwnedAccessories] = useState<AccessoryId[]>(profile.ownedAccessories ?? []);
  const [streak, setStreak] = useState<StreakData>(profile.streak ?? createDefaultStreak());
  const [parentPin, setParentPin] = useState<string | null>(appData.parentPin);
  const [notifications, setNotifications] = useState(profile.notifications || []);
  const [redeemedRewards, setRedeemedRewards] = useState(profile.redeemedRewards || []);
  const [reacting, setReacting] = useState(false);
  const [message, setMessage] = useState('');
  const [justCompleted, setJustCompleted] = useState(false);
  const [view, setView] = useState<'pet' | 'chores' | 'store' | 'pin' | 'parent'>('pet');
  const prevAllDone = useRef(streak.todayEarned);

  const parentActive = parentPin !== null;

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

  // Auto-save
  const appDataRef = useRef(appData);
  appDataRef.current = appData;

  useEffect(() => {
    const updatedProfile: ChildProfile = {
      ...profile,
      health: state.health,
      points: state.points,
      coins,
      chores,
      outfitId,
      accessoryId,
      ownedOutfits,
      ownedAccessories,
      streak,
      notifications,
      redeemedRewards,
      lastPlayedDate: new Date().toISOString().slice(0, 10),
    };
    saveProfile({ ...appDataRef.current, parentPin }, updatedProfile);
  }, [state, chores, outfitId, accessoryId, coins, ownedOutfits, ownedAccessories, streak, parentPin, profile, notifications, redeemedRewards]);

  useGameLoop((delta) => {
    dispatch({ type: 'decay', delta });
  });

  const handleAction = useCallback((actionType: TimeActionType) => {
    const action = TIME_ACTIONS.find(a => a.type === actionType)!;
    if (state.points[actionType] < action.cost) return;
    dispatch({ type: actionType });
    setReacting(true);
    setTimeout(() => setReacting(false), 400);
  }, [dispatch, state.points]);

  const handleChoreCheckOff = useCallback((category: TimeActionType, id: string) => {
    checkOffChore(category, id, parentActive);
    if (!parentActive) {
      dispatch({ type: 'earn', category, amount: POINTS_PER_CHORE });
      earnCoins(POINTS_PER_CHORE);
      setMessage(`+${POINTS_PER_CHORE} ${category} pts & coins!`);
    } else {
      setMessage('Pending approval...');
    }
    setTimeout(() => setMessage(''), 1500);
  }, [checkOffChore, dispatch, parentActive, earnCoins]);

  const handleApprove = useCallback((category: TimeActionType, id: string) => {
    approveChore(category, id);
    dispatch({ type: 'earn', category, amount: POINTS_PER_CHORE });
    earnCoins(POINTS_PER_CHORE);
  }, [approveChore, dispatch, earnCoins]);

  const handleBuyItem = useCallback((type: 'outfit' | 'accessory', id: string, price: number) => {
    if (coins < price) return;
    setCoins(prev => prev - price);
    if (type === 'outfit') {
      setOwnedOutfits(prev => [...prev, id]);
      setOutfitId(id); // auto-equip
    } else {
      setOwnedAccessories(prev => [...prev, id]);
      setAccessoryId(id); // auto-equip
    }
    setMessage('Purchased!');
    setTimeout(() => setMessage(''), 1500);
  }, [coins]);

  const handlePinSubmit = useCallback((pin: string): boolean => {
    if (parentPin === null) {
      setParentPin(pin);
      setView('parent');
      return true;
    }
    if (pin === parentPin) {
      setView('parent');
      return true;
    }
    return false;
  }, [parentPin]);

  const handleCrossProfileApprove = useCallback((profileId: string, category: TimeActionType, choreId: string) => {
    if (profileId === profile.id) {
      handleApprove(category, choreId);
    } else {
      const targetProfile = appData.profiles.find(p => p.id === profileId);
      if (!targetProfile) return;
      const updatedChores = {
        ...targetProfile.chores,
        [category]: targetProfile.chores[category].map(c =>
          c.id === choreId && c.status === 'pending' ? { ...c, status: 'approved' as const } : c
        ),
      };
      const updatedPoints = {
        ...targetProfile.points,
        [category]: Math.min(targetProfile.points[category] + POINTS_PER_CHORE, 999),
      };
      const updatedProfile = {
        ...targetProfile,
        chores: updatedChores,
        points: updatedPoints,
        coins: Math.min((targetProfile.coins ?? 0) + POINTS_PER_CHORE, MAX_COINS),
      };
      onUpdateAppData({
        ...appData, parentPin,
        profiles: appData.profiles.map(p => p.id === profileId ? updatedProfile : p),
      });
    }
  }, [profile.id, appData, parentPin, handleApprove, onUpdateAppData]);

  const handleCrossProfileReject = useCallback((profileId: string, category: TimeActionType, choreId: string) => {
    if (profileId === profile.id) {
      rejectChore(category, choreId);
    } else {
      const targetProfile = appData.profiles.find(p => p.id === profileId);
      if (!targetProfile) return;
      const updatedChores = {
        ...targetProfile.chores,
        [category]: targetProfile.chores[category].map(c =>
          c.id === choreId && c.status === 'pending' ? { ...c, status: 'unchecked' as const } : c
        ),
      };
      onUpdateAppData({
        ...appData, parentPin,
        profiles: appData.profiles.map(p => p.id === profileId ? { ...targetProfile, chores: updatedChores } : p),
      });
    }
  }, [profile.id, appData, parentPin, rejectChore, onUpdateAppData]);

  const handleCrossProfileAddChore = useCallback((profileId: string, category: TimeActionType, name: string) => {
    if (profileId === profile.id) {
      addChore(category, name);
    } else {
      const targetProfile = appData.profiles.find(p => p.id === profileId);
      if (!targetProfile) return;
      const trimmed = name.trim().slice(0, 40);
      if (!trimmed) return;
      const newChore = { id: String(Date.now()), name: trimmed, status: 'unchecked' as const };
      onUpdateAppData({
        ...appData, parentPin,
        profiles: appData.profiles.map(p => p.id === profileId
          ? { ...targetProfile, chores: { ...targetProfile.chores, [category]: [...targetProfile.chores[category], newChore] } }
          : p),
      });
    }
  }, [profile.id, appData, parentPin, addChore, onUpdateAppData]);

  const handleCrossProfileRemoveChore = useCallback((profileId: string, category: TimeActionType, choreId: string) => {
    if (profileId === profile.id) {
      removeChore(category, choreId);
    } else {
      const targetProfile = appData.profiles.find(p => p.id === profileId);
      if (!targetProfile) return;
      onUpdateAppData({
        ...appData, parentPin,
        profiles: appData.profiles.map(p => p.id === profileId
          ? { ...targetProfile, chores: { ...targetProfile.chores, [category]: targetProfile.chores[category].filter(c => c.id !== choreId) } }
          : p),
      });
    }
  }, [profile.id, appData, parentPin, removeChore, onUpdateAppData]);

  // --- All hooks above this line --- conditional returns below ---

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
      ...profile, health: state.health, points: state.points, coins, chores,
      outfitId, accessoryId, ownedOutfits, ownedAccessories, streak,
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
              setNotifications(prev => [...prev, notification]);
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
        />
        <div className={styles.toolbar}>
          {onAddChild && (
            <button className={styles.choreToggle} onClick={onAddChild}>
              {'\u{2795}'} Add Child
            </button>
          )}
          {onReset && (
            <button className={styles.choreToggle} onClick={onReset} style={{ color: '#e74c3c', borderColor: '#e74c3c' }}>
              Reset Game
            </button>
          )}
          <button className={styles.choreToggle} onClick={() => setView('pet')}>
            {'\u{2190}'} Back to Kid Mode
          </button>
        </div>
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
          onAdd={addChore}
          onRemove={removeChore}
          onToggle={handleChoreCheckOff}
          onResetCategory={resetCategory}
          onResetAll={resetAll}
        />
        <button className={styles.choreToggle} onClick={() => setView('pet')}>
          {'\u{2190}'} Back to Pet
        </button>
      </div>
    );
  }

  if (view === 'store') {
    return (
      <div className={styles.game}>
        <div className={styles.title}>STORE</div>
        <Creature
          name={state.name}
          mood={mood}
          creatureType={state.creatureType}
          outfitId={outfitId}
          accessoryId={accessoryId}
          reacting={false}
        />
        <Store
          coins={coins}
          outfitId={outfitId}
          accessoryId={accessoryId}
          ownedOutfits={ownedOutfits}
          ownedAccessories={ownedAccessories}
          rewardPresents={appData.rewardPresents || []}
          onBuy={handleBuyItem}
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

  return (
    <div className={styles.game}>
      <div className={styles.title}>TERRAGUCCI</div>
      <Creature
        name={state.name}
        mood={mood}
        creatureType={state.creatureType}
        outfitId={outfitId}
        accessoryId={accessoryId}
        reacting={reacting}
      />
      <StreakDisplay streak={streak} justCompleted={justCompleted} />
      {notifications.length > 0 && (
        <div className={styles.notificationArea}>
          {notifications.map(n => (
            <div key={n.id} className={styles.notification}>
              <span>{'\u{1F381}'} +{n.amount} {n.category} pts & coins: {n.reason}</span>
              <button
                className={styles.dismissBtn}
                onClick={() => setNotifications(prev => prev.filter(x => x.id !== n.id))}
              >
                {'\u{2715}'}
              </button>
            </div>
          ))}
        </div>
      )}
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
        {TIME_ACTIONS.map(action => (
          <ActionButton
            key={action.type}
            emoji={action.emoji}
            label={action.label}
            cost={action.cost}
            disabled={state.points[action.type] < action.cost}
            onClick={() => handleAction(action.type)}
          />
        ))}
      </div>
      <div className={styles.toolbar}>
        <button className={styles.choreToggle} onClick={() => setView('chores')}>
          {'\u{1F4CB}'} Chores
        </button>
        <button className={styles.choreToggle} onClick={() => setView('store')}>
          {'\u{1F6CD}\u{FE0F}'} Store
        </button>
        <button className={styles.choreToggle} onClick={() => setView('pin')}>
          {'\u{1F512}'} Parent
        </button>
        {onSwitchProfile && (
          <button className={styles.choreToggle} onClick={onSwitchProfile}>
            {'\u{1F465}'} Switch
          </button>
        )}
      </div>
    </div>
  );
}

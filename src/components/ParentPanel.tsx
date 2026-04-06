import { useState } from 'react';
import {
  type ChildProfile, type TimeActionType, type RewardPresent,
  TIME_ACTIONS, CREATURE_SPRITES,
} from '../models/types';
import styles from './ParentPanel.module.css';

interface PendingItem {
  profileId: string;
  childName: string;
  creatureType: string;
  category: TimeActionType;
  choreId: string;
  choreName: string;
}

interface ParentPanelProps {
  profiles: ChildProfile[];
  activeProfileId: string;
  onAddChore: (profileId: string, category: TimeActionType, name: string) => void;
  onRemoveChore: (profileId: string, category: TimeActionType, id: string) => void;
  onApprove: (profileId: string, category: TimeActionType, id: string) => void;
  onReject: (profileId: string, category: TimeActionType, id: string) => void;
  onBonus: (profileId: string, category: TimeActionType, amount: number, reason: string) => void;
  rewardPresents: RewardPresent[];
  onAddReward: (name: string, price: number) => void;
  onRemoveReward: (id: string) => void;
}

function collectPending(profiles: ChildProfile[]): PendingItem[] {
  const items: PendingItem[] = [];
  for (const profile of profiles) {
    for (const action of TIME_ACTIONS) {
      for (const chore of profile.chores[action.type]) {
        if (chore.status === 'pending') {
          items.push({
            profileId: profile.id,
            childName: profile.creatureName,
            creatureType: profile.creatureType,
            category: action.type,
            choreId: chore.id,
            choreName: chore.name,
          });
        }
      }
    }
  }
  return items;
}

export function ParentPanel({
  profiles, activeProfileId,
  onAddChore, onRemoveChore, onApprove, onReject, onBonus,
  rewardPresents, onAddReward, onRemoveReward,
}: ParentPanelProps) {
  const [tab, setTab] = useState<'pending' | 'manage' | 'bonus' | 'rewards' | 'dashboard'>('pending');
  const [selectedChild, setSelectedChild] = useState(activeProfileId);
  const [newChoreInputs, setNewChoreInputs] = useState<Record<string, string>>({});
  const [bonusCategory, setBonusCategory] = useState<TimeActionType>('morning');
  const [bonusAmount, setBonusAmount] = useState('');
  const [bonusReason, setBonusReason] = useState('');
  const [bonusMessage, setBonusMessage] = useState('');
  const [newRewardName, setNewRewardName] = useState('');
  const [newRewardPrice, setNewRewardPrice] = useState('');

  const allPending = collectPending(profiles);
  const selectedProfile = profiles.find(p => p.id === selectedChild) ?? profiles[0];

  function handleAdd(category: TimeActionType) {
    const val = newChoreInputs[category] || '';
    if (val.trim()) {
      onAddChore(selectedChild, category, val);
      setNewChoreInputs(prev => ({ ...prev, [category]: '' }));
    }
  }

  const displayStreak = selectedProfile
    ? (selectedProfile.streak.todayEarned ? selectedProfile.streak.current + 1 : selectedProfile.streak.current)
    : 0;

  return (
    <div className={styles.panel}>
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${tab === 'pending' ? styles.active : ''}`}
          onClick={() => setTab('pending')}
        >
          Pending ({allPending.length})
        </button>
        <button
          className={`${styles.tab} ${tab === 'manage' ? styles.active : ''}`}
          onClick={() => setTab('manage')}
        >
          Manage
        </button>
        <button
          className={`${styles.tab} ${tab === 'bonus' ? styles.active : ''}`}
          onClick={() => setTab('bonus')}
        >
          Bonus
        </button>
        <button
          className={`${styles.tab} ${tab === 'rewards' ? styles.active : ''}`}
          onClick={() => setTab('rewards')}
        >
          {'\u{1F381}'} Rewards
        </button>
        <button
          className={`${styles.tab} ${tab === 'dashboard' ? styles.active : ''}`}
          onClick={() => setTab('dashboard')}
        >
          Stats
        </button>
      </div>

      {/* Child selector for Manage, Bonus, and Stats tabs */}
      {(tab === 'manage' || tab === 'bonus' || tab === 'dashboard') && profiles.length > 1 && (
        <div className={styles.childSelector}>
          {profiles.map(p => (
            <button
              key={p.id}
              className={`${styles.childBtn} ${p.id === selectedChild ? styles.childBtnActive : ''}`}
              onClick={() => setSelectedChild(p.id)}
            >
              {CREATURE_SPRITES[p.creatureType].happy} {p.creatureName}
            </button>
          ))}
        </div>
      )}

      {tab === 'pending' && (
        <div className={styles.section}>
          <div className={styles.sectionTitle}>Awaiting Approval</div>
          {allPending.length === 0 ? (
            <div className={styles.noPending}>No chores waiting for approval.</div>
          ) : (
            <div className={styles.pendingList}>
              {allPending.map(p => (
                <div key={`${p.profileId}-${p.choreId}`} className={styles.pendingItem}>
                  <div style={{ flex: 1 }}>
                    <div className={styles.pendingName}>{p.choreName}</div>
                    <div className={styles.pendingCategory}>
                      {CREATURE_SPRITES[p.creatureType as keyof typeof CREATURE_SPRITES].happy}{' '}
                      {p.childName} {'\u{2022}'} {p.category}
                    </div>
                  </div>
                  <button className={styles.approveBtn} onClick={() => onApprove(p.profileId, p.category, p.choreId)}>
                    {'\u{2705}'}
                  </button>
                  <button className={styles.rejectBtn} onClick={() => onReject(p.profileId, p.category, p.choreId)}>
                    {'\u{274C}'}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === 'manage' && selectedProfile && (
        <div className={styles.section}>
          <div className={styles.sectionTitle}>
            Manage Chores for {selectedProfile.creatureName}
          </div>
          {TIME_ACTIONS.map(action => (
            <div key={action.type} className={styles.section}>
              <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'rgba(255,255,255,0.7)' }}>
                {action.emoji} {action.label}
              </div>
              {selectedProfile.chores[action.type].map(c => (
                <div key={c.id} className={styles.choreItem}>
                  <span className={styles.choreItemName}>{c.name}</span>
                  <button className={styles.removeBtn} onClick={() => onRemoveChore(selectedChild, action.type, c.id)}>x</button>
                </div>
              ))}
              <form className={styles.addRow} onSubmit={(e) => { e.preventDefault(); handleAdd(action.type); }}>
                <input
                  className={styles.addInput}
                  type="text"
                  value={newChoreInputs[action.type] || ''}
                  onChange={e => setNewChoreInputs(prev => ({ ...prev, [action.type]: e.target.value.slice(0, 40) }))}
                  placeholder={`Add ${action.label.toLowerCase()} chore...`}
                  maxLength={40}
                />
                <button className={styles.addBtn} type="submit" disabled={!(newChoreInputs[action.type] || '').trim()}>+</button>
              </form>
            </div>
          ))}
        </div>
      )}

      {tab === 'bonus' && selectedProfile && (
        <div className={styles.section}>
          <div className={styles.sectionTitle}>
            Give Bonus to {selectedProfile.creatureName}
          </div>
          <div style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)' }}>
            Category
          </div>
          <div className={styles.tabs}>
            {TIME_ACTIONS.map(a => (
              <button
                key={a.type}
                className={`${styles.tab} ${bonusCategory === a.type ? styles.active : ''}`}
                onClick={() => setBonusCategory(a.type)}
              >
                {a.emoji} {a.label}
              </button>
            ))}
          </div>
          <div style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)' }}>
            Reason (shown to kid)
          </div>
          <input
            className={styles.addInput}
            type="text"
            value={bonusReason}
            onChange={e => setBonusReason(e.target.value.slice(0, 60))}
            placeholder="e.g. Helped with dishes!"
            maxLength={60}
            style={{ width: '100%' }}
          />
          <div style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)' }}>
            Points
          </div>
          <form className={styles.addRow} onSubmit={(e) => {
            e.preventDefault();
            const amt = parseInt(bonusAmount, 10);
            if (amt > 0) {
              onBonus(selectedChild, bonusCategory, amt, bonusReason.trim() || 'Bonus!');
              setBonusMessage(`+${amt} ${bonusCategory} pts awarded!`);
              setBonusAmount('');
              setBonusReason('');
              setTimeout(() => setBonusMessage(''), 2000);
            }
          }}>
            <input
              className={styles.addInput}
              type="number"
              min="1"
              max="999"
              value={bonusAmount}
              onChange={e => setBonusAmount(e.target.value)}
              placeholder="Amount..."
            />
            <button
              className={styles.addBtn}
              type="submit"
              disabled={!bonusAmount || parseInt(bonusAmount, 10) <= 0}
            >
              {'\u{1F381}'} Give
            </button>
          </form>
          {bonusMessage && (
            <div style={{ color: '#2ecc71', fontWeight: 600, fontSize: '1rem' }}>
              {bonusMessage}
            </div>
          )}
        </div>
      )}

      {tab === 'rewards' && (
        <div className={styles.section}>
          <div className={styles.sectionTitle}>
            {'\u{1F381}'} Manage Reward Presents
          </div>
          <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)' }}>
            Create rewards kids can redeem with coins in the Store.
          </div>
          {rewardPresents.map(r => (
            <div key={r.id} className={styles.choreItem}>
              <span>{'\u{1F381}'}</span>
              <span className={styles.choreItemName}>{r.name}</span>
              <span style={{ fontSize: '0.8rem', color: '#f0e68c' }}>{r.price} {'\u{1FA99}'}</span>
              <button className={styles.removeBtn} onClick={() => onRemoveReward(r.id)}>x</button>
            </div>
          ))}
          <form className={styles.addRow} onSubmit={(e) => {
            e.preventDefault();
            const price = parseInt(newRewardPrice, 10);
            if (newRewardName.trim() && price > 0) {
              onAddReward(newRewardName.trim(), price);
              setNewRewardName('');
              setNewRewardPrice('');
            }
          }}>
            <input
              className={styles.addInput}
              type="text"
              value={newRewardName}
              onChange={e => setNewRewardName(e.target.value.slice(0, 40))}
              placeholder="Reward name..."
              maxLength={40}
              style={{ flex: 2 }}
            />
            <input
              className={styles.addInput}
              type="number"
              min="1"
              max="9999"
              value={newRewardPrice}
              onChange={e => setNewRewardPrice(e.target.value)}
              placeholder="Price"
              style={{ flex: 1 }}
            />
            <button
              className={styles.addBtn}
              type="submit"
              disabled={!newRewardName.trim() || !newRewardPrice || parseInt(newRewardPrice, 10) <= 0}
            >
              +
            </button>
          </form>
        </div>
      )}

      {tab === 'dashboard' && selectedProfile && (
        <div className={styles.section}>
          <div className={styles.sectionTitle}>
            Stats for {selectedProfile.creatureName}
          </div>
          <div className={styles.dashboard}>
            <div className={styles.stat}>
              <div className={styles.statLabel}>Health</div>
              <div className={styles.statValue}>{Math.round(selectedProfile.health)}%</div>
            </div>
            <div className={styles.stat}>
              <div className={styles.statLabel}>Streak</div>
              <div className={styles.statValue}>{displayStreak} days</div>
            </div>
            {TIME_ACTIONS.map(a => (
              <div key={a.type} className={styles.stat}>
                <div className={styles.statLabel}>{a.emoji} {a.label} pts</div>
                <div className={styles.statValue}>{selectedProfile.points[a.type]}</div>
              </div>
            ))}
          </div>
          <div className={styles.stat}>
            <div className={styles.statLabel}>Best Streak</div>
            <div className={styles.statValue}>{selectedProfile.streak.best} days</div>
          </div>
        </div>
      )}
    </div>
  );
}

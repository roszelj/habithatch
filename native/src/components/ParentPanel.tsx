import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import {
  type ChildProfile, type TimeActionType, type RewardPresent, type CategoryPoints,
  TIME_ACTIONS, POINTS_PER_CHORE,
} from '../models/types';
import { CreatureSprite } from './CreatureSprite';

type DayType = 'weekday' | 'weekend';

interface PendingItem {
  profileId: string;
  childName: string;
  creatureType: string;
  category: TimeActionType;
  choreId: string;
  choreName: string;
  dayType: DayType;
}

interface ParentPanelProps {
  profiles: ChildProfile[];
  activeProfileId: string;
  onAddChore: (profileId: string, category: TimeActionType, name: string, dayType: DayType) => void;
  onAddChoreAllKids: (category: TimeActionType, name: string, dayType: DayType) => void;
  onRemoveChore: (profileId: string, category: TimeActionType, id: string, dayType: DayType) => void;
  onApprove: (profileId: string, category: TimeActionType, id: string, dayType: DayType) => void;
  onReject: (profileId: string, category: TimeActionType, id: string, dayType: DayType) => void;
  onBonus: (profileId: string, category: TimeActionType, amount: number, reason: string) => void;
  rewardPresents: RewardPresent[];
  onAddReward: (name: string, price: number) => void;
  onRemoveReward: (id: string) => void;
  onFulfillReward?: (profileId: string, redeemedRewardId: string, rewardName: string) => void;
  joinCode?: string;
  onUpdateChildName?: (profileId: string, childName: string) => void;
  onUpdateChorePoints?: (profileId: string, chorePoints: CategoryPoints) => void;
  onTogglePause?: (profileId: string, paused: boolean) => void;
}

function displayName(p: ChildProfile): string {
  return p.childName || p.creatureName;
}

function collectPending(profiles: ChildProfile[]): PendingItem[] {
  const items: PendingItem[] = [];
  for (const profile of profiles) {
    for (const dayType of ['weekday', 'weekend'] as DayType[]) {
      const choreList = dayType === 'weekend' ? profile.weekendChores : profile.weekdayChores;
      for (const action of TIME_ACTIONS) {
        for (const chore of choreList[action.type]) {
          if (chore.status === 'pending') {
            items.push({
              profileId: profile.id,
              childName: displayName(profile),
              creatureType: profile.creatureType,
              category: action.type,
              choreId: chore.id,
              choreName: chore.name,
              dayType,
            });
          }
        }
      }
    }
  }
  return items;
}

export function ParentPanel({
  profiles, activeProfileId,
  onAddChore, onAddChoreAllKids, onRemoveChore, onApprove, onReject, onBonus,
  rewardPresents, onAddReward, onRemoveReward, onFulfillReward, joinCode, onUpdateChildName, onUpdateChorePoints, onTogglePause,
}: ParentPanelProps) {
  const [tab, setTab] = useState<'pending' | 'manage' | 'bonus' | 'rewards' | 'dashboard'>('pending');
  const [selectedChild, setSelectedChild] = useState(activeProfileId);
  const [newChoreInputs, setNewChoreInputs] = useState<Record<string, string>>({});
  const [forAllKids, setForAllKids] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState('');
  const [bonusCategory, setBonusCategory] = useState<TimeActionType>('morning');
  const [bonusAmount, setBonusAmount] = useState('');
  const [bonusReason, setBonusReason] = useState('');
  const [bonusMessage, setBonusMessage] = useState('');
  const [newRewardName, setNewRewardName] = useState('');
  const [newRewardPrice, setNewRewardPrice] = useState('');
  const [editingName, setEditingName] = useState(false);
  const [editNameValue, setEditNameValue] = useState('');

  const allPending = collectPending(profiles);
  const selectedProfile = profiles.find(p => p.id === selectedChild) ?? profiles[0];

  function handleAddChore(category: TimeActionType, dayType: DayType) {
    const key = `${dayType}-${category}`;
    const val = newChoreInputs[key] || '';
    if (!val.trim()) return;
    if (forAllKids) {
      onAddChoreAllKids(category, val, dayType);
      setConfirmMessage(`Added to ${profiles.length} kid${profiles.length !== 1 ? 's' : ''}!`);
      setTimeout(() => setConfirmMessage(''), 2000);
    } else {
      onAddChore(selectedChild, category, val, dayType);
    }
    setNewChoreInputs(prev => ({ ...prev, [key]: '' }));
  }

  const displayStreak = selectedProfile
    ? (selectedProfile.streak.todayEarned ? selectedProfile.streak.current + 1 : selectedProfile.streak.current)
    : 0;

  const TABS: Array<{ id: typeof tab; label: string }> = [
    { id: 'pending', label: `Pending (${allPending.length})` },
    { id: 'manage', label: 'Manage' },
    { id: 'bonus', label: 'Bonus' },
    { id: 'rewards', label: '\u{1F381}Rewards' },
    { id: 'dashboard', label: 'Stats' },
  ];

  return (
    <View style={styles.panel}>
      {joinCode && (
        <View style={styles.joinCodeBanner}>
          <Text style={styles.joinCodeLabel}>Family Code: </Text>
          <Text style={styles.joinCode}>{joinCode}</Text>
        </View>
      )}

      {/* Tab bar */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabBar} contentContainerStyle={styles.tabBarContent}>
        {TABS.map(t => (
          <TouchableOpacity
            key={t.id}
            style={[styles.tab, tab === t.id && styles.tabActive]}
            onPress={() => setTab(t.id)}
          >
            <Text style={[styles.tabText, tab === t.id && styles.tabTextActive]}>{t.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Child selector for Manage, Bonus, and Stats tabs */}
      {(tab === 'manage' || tab === 'bonus' || tab === 'dashboard') && profiles.length > 1 && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.childSelectorBar}>
          {profiles.map(p => (
            <TouchableOpacity
              key={p.id}
              style={[styles.childBtn, p.id === selectedChild && styles.childBtnActive]}
              onPress={() => setSelectedChild(p.id)}
            >
              <CreatureSprite creatureType={p.creatureType} size={20} />
              <Text style={styles.childBtnText}>{displayName(p)}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      <ScrollView style={styles.content} contentContainerStyle={styles.contentInner}>

        {/* PENDING TAB */}
        {tab === 'pending' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Awaiting Approval</Text>
            {allPending.length === 0 ? (
              <Text style={styles.emptyText}>No chores waiting for approval.</Text>
            ) : (
              allPending.map(p => (
                <View key={`${p.profileId}-${p.choreId}`} style={styles.pendingItem}>
                  <View style={{ flex: 1, gap: 2 }}>
                    <Text style={styles.pendingName}>{p.choreName}</Text>
                    <View style={styles.pendingMeta}>
                      <CreatureSprite creatureType={p.creatureType as any} size={16} />
                      <Text style={styles.pendingCategory}> {p.childName} • {p.category}</Text>
                    </View>
                  </View>
                  <TouchableOpacity style={styles.approveBtn} onPress={() => onApprove(p.profileId, p.category, p.choreId, p.dayType)}>
                    <Text style={styles.approveBtnText}>{'\u{2705}'}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.rejectBtn} onPress={() => onReject(p.profileId, p.category, p.choreId, p.dayType)}>
                    <Text style={styles.rejectBtnText}>{'\u{274C}'}</Text>
                  </TouchableOpacity>
                </View>
              ))
            )}
          </View>
        )}

        {/* MANAGE TAB */}
        {tab === 'manage' && selectedProfile && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Manage Chores for {displayName(selectedProfile)}</Text>

            {profiles.length > 1 && (
              <TouchableOpacity
                style={styles.allKidsRow}
                onPress={() => setForAllKids(v => !v)}
              >
                <View style={[styles.checkbox, forAllKids && styles.checkboxChecked]}>
                  {forAllKids && <Text style={styles.checkMark}>✓</Text>}
                </View>
                <Text style={styles.allKidsLabel}>Add for all kids</Text>
              </TouchableOpacity>
            )}

            {confirmMessage ? <Text style={styles.confirmMsg}>{confirmMessage}</Text> : null}

            {(['weekday', 'weekend'] as DayType[]).map(dayType => {
              const choreList = dayType === 'weekend' ? selectedProfile.weekendChores : selectedProfile.weekdayChores;
              const label = dayType === 'weekday' ? 'Weekday Chores (Mon-Fri)' : 'Weekend Chores (Sat-Sun)';
              return (
                <View key={dayType} style={styles.dayTypeSection}>
                  <Text style={styles.dayTypeHeader}>{label}</Text>
                  {TIME_ACTIONS.map(action => {
                    const inputKey = `${dayType}-${action.type}`;
                    return (
                      <View key={action.type} style={styles.actionGroup}>
                        <Text style={styles.actionLabel}>{action.emoji} {action.label}</Text>
                        {choreList[action.type].map(c => (
                          <View key={c.id} style={styles.choreItem}>
                            <Text style={styles.choreItemName}>{c.name}</Text>
                            <TouchableOpacity onPress={() => onRemoveChore(selectedChild, action.type, c.id, dayType)}>
                              <Text style={styles.removeBtnText}>✕</Text>
                            </TouchableOpacity>
                          </View>
                        ))}
                        <View style={styles.addRow}>
                          <TextInput
                            style={styles.addInput}
                            value={newChoreInputs[inputKey] || ''}
                            onChangeText={text => setNewChoreInputs(prev => ({ ...prev, [inputKey]: text.slice(0, 40) }))}
                            placeholder={`Add ${action.label.toLowerCase()} chore...`}
                            placeholderTextColor="rgba(255,255,255,0.3)"
                            maxLength={40}
                            onSubmitEditing={() => handleAddChore(action.type, dayType)}
                          />
                          <TouchableOpacity
                            style={[styles.addBtn, !(newChoreInputs[inputKey] || '').trim() && styles.btnDisabled]}
                            onPress={() => handleAddChore(action.type, dayType)}
                            disabled={!(newChoreInputs[inputKey] || '').trim()}
                          >
                            <Text style={styles.addBtnText}>+</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    );
                  })}
                </View>
              );
            })}

            {onUpdateChorePoints && (
              <View style={styles.dayTypeSection}>
                <Text style={styles.dayTypeHeader}>Points Per Chore</Text>
                <Text style={styles.hintText}>How many points & coins each completed chore earns</Text>
                {TIME_ACTIONS.map(action => {
                  const currentVal = selectedProfile.chorePointsPerCategory?.[action.type] ?? POINTS_PER_CHORE;
                  return (
                    <View key={action.type} style={styles.chorePointsRow}>
                      <Text style={styles.chorePointsLabel}>{action.emoji} {action.label}</Text>
                      <TextInput
                        style={styles.chorePointsInput}
                        keyboardType="numeric"
                        value={String(currentVal)}
                        onChangeText={text => {
                          const val = Math.max(1, Math.min(99, parseInt(text, 10) || 1));
                          const current = selectedProfile.chorePointsPerCategory ?? { morning: POINTS_PER_CHORE, afternoon: POINTS_PER_CHORE, evening: POINTS_PER_CHORE };
                          onUpdateChorePoints(selectedChild, { ...current, [action.type]: val });
                        }}
                        maxLength={2}
                      />
                      <Text style={styles.hintText}>pts</Text>
                    </View>
                  );
                })}
              </View>
            )}

            {onTogglePause && (
              <View style={styles.dayTypeSection}>
                <Text style={styles.dayTypeHeader}>Pet Pause</Text>
                <View style={styles.pauseRow}>
                  <Text style={styles.pauseStatus}>
                    {selectedProfile.isPaused ? '💤 Pet is paused' : '▶️ Pet is active'}
                  </Text>
                  <TouchableOpacity
                    style={selectedProfile.isPaused ? styles.resumeBtn : styles.pauseBtn}
                    onPress={() => onTogglePause(selectedProfile.id, !selectedProfile.isPaused)}
                  >
                    <Text style={styles.pauseBtnText}>
                      {selectedProfile.isPaused ? 'Resume Pet' : 'Pause Pet'}
                    </Text>
                  </TouchableOpacity>
                </View>
                <Text style={styles.hintText}>
                  {selectedProfile.isPaused
                    ? 'Health and streak are frozen. Tap Resume when ready.'
                    : 'Pause to protect health and streak while your child is away.'}
                </Text>
              </View>
            )}
          </View>
        )}

        {/* BONUS TAB */}
        {tab === 'bonus' && selectedProfile && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Give Bonus to {displayName(selectedProfile)}</Text>
            <Text style={styles.fieldLabel}>Category</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.miniTabs}>
                {TIME_ACTIONS.map(a => (
                  <TouchableOpacity
                    key={a.type}
                    style={[styles.tab, bonusCategory === a.type && styles.tabActive]}
                    onPress={() => setBonusCategory(a.type)}
                  >
                    <Text style={[styles.tabText, bonusCategory === a.type && styles.tabTextActive]}>
                      {a.emoji} {a.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
            <Text style={styles.fieldLabel}>Reason (shown to kid)</Text>
            <TextInput
              style={styles.addInput}
              value={bonusReason}
              onChangeText={text => setBonusReason(text.slice(0, 60))}
              placeholder="e.g. Helped with dishes!"
              placeholderTextColor="rgba(255,255,255,0.3)"
              maxLength={60}
            />
            <Text style={styles.fieldLabel}>Points</Text>
            <View style={styles.addRow}>
              <TextInput
                style={styles.addInput}
                keyboardType="numeric"
                value={bonusAmount}
                onChangeText={setBonusAmount}
                placeholder="Amount..."
                placeholderTextColor="rgba(255,255,255,0.3)"
              />
              <TouchableOpacity
                style={[styles.addBtn, (!bonusAmount || parseInt(bonusAmount, 10) <= 0) && styles.btnDisabled]}
                disabled={!bonusAmount || parseInt(bonusAmount, 10) <= 0}
                onPress={() => {
                  const amt = parseInt(bonusAmount, 10);
                  if (amt > 0) {
                    onBonus(selectedChild, bonusCategory, amt, bonusReason.trim() || 'Bonus!');
                    setBonusMessage(`+${amt} ${bonusCategory} pts awarded!`);
                    setBonusAmount('');
                    setBonusReason('');
                    setTimeout(() => setBonusMessage(''), 2000);
                  }
                }}
              >
                <Text style={styles.addBtnText}>{'\u{1F381}'} Give</Text>
              </TouchableOpacity>
            </View>
            {bonusMessage ? <Text style={styles.successText}>{bonusMessage}</Text> : null}
          </View>
        )}

        {/* REWARDS TAB */}
        {tab === 'rewards' && (
          <View style={styles.section}>
            {onFulfillReward && (() => {
              const pending = profiles.flatMap(p =>
                (p.redeemedRewards || [])
                  .filter(r => !r.fulfilled)
                  .map(r => ({ profile: p, reward: r }))
              );
              if (pending.length === 0) return null;
              return (
                <>
                  <Text style={styles.sectionTitle}>Pending Redemptions</Text>
                  {pending.map(({ profile: p, reward: r }) => (
                    <View key={r.id} style={styles.choreItem}>
                      <Text>{'\u{1F381}'}</Text>
                      <Text style={styles.choreItemName}>{displayName(p)}: {r.rewardName}</Text>
                      <TouchableOpacity style={styles.approveBtn} onPress={() => onFulfillReward(p.id, r.id, r.rewardName)}>
                        <Text style={styles.approveBtnText}>Give it!</Text>
                      </TouchableOpacity>
                    </View>
                  ))}
                </>
              );
            })()}
            <Text style={styles.sectionTitle}>{'\u{1F381}'} Manage Reward Presents</Text>
            <Text style={styles.hintText}>Create rewards kids can redeem with coins in the Store.</Text>
            {rewardPresents.map(r => (
              <View key={r.id} style={styles.choreItem}>
                <Text>{'\u{1F381}'}</Text>
                <Text style={styles.choreItemName}>{r.name}</Text>
                <Text style={styles.rewardPrice}>{r.price} {'\u{1FA99}'}</Text>
                <TouchableOpacity onPress={() => onRemoveReward(r.id)}>
                  <Text style={styles.removeBtnText}>✕</Text>
                </TouchableOpacity>
              </View>
            ))}
            <View style={styles.addRow}>
              <TextInput
                style={[styles.addInput, { flex: 2 }]}
                value={newRewardName}
                onChangeText={text => setNewRewardName(text.slice(0, 40))}
                placeholder="Reward name..."
                placeholderTextColor="rgba(255,255,255,0.3)"
                maxLength={40}
              />
              <TextInput
                style={[styles.addInput, { flex: 1 }]}
                keyboardType="numeric"
                value={newRewardPrice}
                onChangeText={setNewRewardPrice}
                placeholder="Price"
                placeholderTextColor="rgba(255,255,255,0.3)"
              />
              <TouchableOpacity
                style={[styles.addBtn, (!newRewardName.trim() || !newRewardPrice || parseInt(newRewardPrice, 10) <= 0) && styles.btnDisabled]}
                disabled={!newRewardName.trim() || !newRewardPrice || parseInt(newRewardPrice, 10) <= 0}
                onPress={() => {
                  const price = parseInt(newRewardPrice, 10);
                  if (newRewardName.trim() && price > 0) {
                    onAddReward(newRewardName.trim(), price);
                    setNewRewardName('');
                    setNewRewardPrice('');
                  }
                }}
              >
                <Text style={styles.addBtnText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* DASHBOARD TAB */}
        {tab === 'dashboard' && selectedProfile && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Stats for {displayName(selectedProfile)}</Text>
            {onUpdateChildName && (
              <View style={styles.editNameSection}>
                {editingName ? (
                  <View style={styles.addRow}>
                    <TextInput
                      style={styles.addInput}
                      value={editNameValue}
                      onChangeText={text => setEditNameValue(text.slice(0, 20))}
                      placeholder="Child's name..."
                      placeholderTextColor="rgba(255,255,255,0.3)"
                      maxLength={20}
                      autoFocus
                    />
                    <TouchableOpacity
                      style={[styles.addBtn, !editNameValue.trim() && styles.btnDisabled]}
                      disabled={!editNameValue.trim()}
                      onPress={() => {
                        const trimmed = editNameValue.trim();
                        if (trimmed.length >= 1 && trimmed.length <= 20) {
                          onUpdateChildName(selectedChild, trimmed);
                          setEditingName(false);
                        }
                      }}
                    >
                      <Text style={styles.addBtnText}>Save</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.cancelBtn} onPress={() => setEditingName(false)}>
                      <Text style={styles.cancelBtnText}>Cancel</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View style={styles.nameDisplayRow}>
                    <Text style={styles.nameLabel}>Child's Name: </Text>
                    <Text style={styles.nameValue}>{selectedProfile.childName || 'Add name'}</Text>
                    <TouchableOpacity onPress={() => { setEditNameValue(selectedProfile.childName || ''); setEditingName(true); }}>
                      <Text style={styles.editBtnText}>{'\u{270F}\u{FE0F}'}</Text>
                    </TouchableOpacity>
                  </View>
                )}
                <Text style={styles.hintText}>Creature: {selectedProfile.creatureName}</Text>
              </View>
            )}
            {selectedProfile.isPaused && (
              <View style={styles.pausedBadge}>
                <Text style={styles.pausedBadgeText}>💤 Pet is paused — health & streak are protected</Text>
              </View>
            )}
            <View style={styles.dashboard}>
              {[
                { label: 'Health', value: `${Math.round(selectedProfile.health)}%` },
                { label: 'Streak', value: `${displayStreak} days` },
                ...TIME_ACTIONS.map(a => ({ label: `${a.emoji} ${a.label} pts`, value: String(selectedProfile.points[a.type]) })),
                { label: 'Best Streak', value: `${selectedProfile.streak.best} days` },
              ].map(({ label, value }) => (
                <View key={label} style={styles.stat}>
                  <Text style={styles.statLabel}>{label}</Text>
                  <Text style={styles.statValue}>{value}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  panel: { flex: 1 },
  joinCodeBanner: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 8,
    backgroundColor: 'rgba(240,230,140,0.08)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(240,230,140,0.2)',
  },
  joinCodeLabel: { fontSize: 13, color: 'rgba(255,255,255,0.5)' },
  joinCode: { fontSize: 13, fontWeight: '700', color: '#f0e68c', letterSpacing: 2 },
  tabBar: { flexGrow: 0 },
  tabBarContent: { gap: 6, padding: 8 },
  tab: {
    paddingVertical: 7,
    paddingHorizontal: 14,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: 8,
  },
  tabActive: { borderColor: '#f0e68c', backgroundColor: 'rgba(240,230,140,0.1)' },
  tabText: { fontSize: 13, fontWeight: '600', color: 'rgba(255,255,255,0.5)' },
  tabTextActive: { color: '#f0e68c' },
  miniTabs: { flexDirection: 'row', gap: 6 },
  childSelectorBar: { flexGrow: 0, paddingHorizontal: 8 },
  childBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 6,
    marginVertical: 4,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: 8,
  },
  childBtnActive: { borderColor: '#f0e68c' },
  childBtnText: { fontSize: 13, color: '#fff' },
  content: { flex: 1 },
  contentInner: { padding: 12, gap: 12, paddingBottom: 32 },
  section: { gap: 10 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#f0e68c' },
  emptyText: { fontSize: 14, color: 'rgba(255,255,255,0.4)', textAlign: 'center', paddingVertical: 12 },
  pendingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 10,
    padding: 10,
  },
  pendingName: { fontSize: 14, fontWeight: '600', color: '#fff' },
  pendingMeta: { flexDirection: 'row', alignItems: 'center' },
  pendingCategory: { fontSize: 12, color: 'rgba(255,255,255,0.4)' },
  approveBtn: { padding: 6, backgroundColor: 'rgba(46,204,113,0.15)', borderRadius: 6 },
  approveBtnText: { fontSize: 16 },
  rejectBtn: { padding: 6, backgroundColor: 'rgba(231,76,60,0.15)', borderRadius: 6 },
  rejectBtnText: { fontSize: 16 },
  allKidsRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  checkbox: {
    width: 20, height: 20, borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)', borderRadius: 4,
    alignItems: 'center', justifyContent: 'center',
  },
  checkboxChecked: { backgroundColor: '#f0e68c', borderColor: '#f0e68c' },
  checkMark: { fontSize: 12, color: '#1a1a2e', fontWeight: '700' },
  allKidsLabel: { fontSize: 14, color: 'rgba(255,255,255,0.7)' },
  confirmMsg: { fontSize: 13, color: '#2ecc71', fontWeight: '600' },
  dayTypeSection: { gap: 8, marginTop: 4 },
  dayTypeHeader: {
    fontSize: 13, fontWeight: '700',
    color: 'rgba(255,255,255,0.6)',
    backgroundColor: 'rgba(255,255,255,0.04)',
    paddingVertical: 6, paddingHorizontal: 10, borderRadius: 6,
  },
  actionGroup: { gap: 6 },
  actionLabel: { fontSize: 13, fontWeight: '600', color: 'rgba(255,255,255,0.7)' },
  choreItem: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    paddingVertical: 6, paddingHorizontal: 8,
    backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: 6,
  },
  choreItemName: { flex: 1, fontSize: 13, color: '#fff' },
  removeBtnText: { fontSize: 14, color: 'rgba(255,255,255,0.3)' },
  addRow: { flexDirection: 'row', gap: 6 },
  addInput: {
    flex: 1, padding: 8, fontSize: 14, color: '#fff',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)', borderRadius: 8,
  },
  addBtn: {
    paddingHorizontal: 14, paddingVertical: 8,
    backgroundColor: '#f0e68c', borderRadius: 8, justifyContent: 'center',
  },
  btnDisabled: { opacity: 0.35 },
  addBtnText: { fontSize: 14, fontWeight: '700', color: '#1a1a2e' },
  cancelBtn: {
    paddingHorizontal: 10, paddingVertical: 8,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)', borderRadius: 8,
  },
  cancelBtnText: { fontSize: 13, color: 'rgba(255,255,255,0.5)' },
  hintText: { fontSize: 12, color: 'rgba(255,255,255,0.4)' },
  fieldLabel: { fontSize: 13, color: 'rgba(255,255,255,0.6)', marginTop: 4 },
  successText: { fontSize: 14, color: '#2ecc71', fontWeight: '600' },
  rewardPrice: { fontSize: 13, color: '#f0e68c' },
  chorePointsRow: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    paddingVertical: 4,
  },
  chorePointsLabel: { flex: 1, fontSize: 13, color: 'rgba(255,255,255,0.7)' },
  chorePointsInput: {
    width: 50, padding: 6, fontSize: 14, color: '#fff', textAlign: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)', borderRadius: 6,
  },
  pauseRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  pauseStatus: { fontSize: 14, color: 'rgba(255,255,255,0.7)' },
  pauseBtn: {
    paddingVertical: 8, paddingHorizontal: 16,
    backgroundColor: 'rgba(231,76,60,0.2)',
    borderWidth: 1, borderColor: '#e74c3c', borderRadius: 8,
  },
  resumeBtn: {
    paddingVertical: 8, paddingHorizontal: 16,
    backgroundColor: 'rgba(46,204,113,0.2)',
    borderWidth: 1, borderColor: '#2ecc71', borderRadius: 8,
  },
  pauseBtnText: { fontSize: 13, fontWeight: '600', color: '#fff' },
  editNameSection: { gap: 6 },
  nameDisplayRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  nameLabel: { fontSize: 13, color: 'rgba(255,255,255,0.5)' },
  nameValue: { fontSize: 14, fontWeight: '600', color: '#fff' },
  editBtnText: { fontSize: 16 },
  pausedBadge: {
    padding: 10, borderRadius: 8,
    backgroundColor: 'rgba(240,230,140,0.1)',
    borderWidth: 1, borderColor: 'rgba(240,230,140,0.3)',
  },
  pausedBadgeText: { fontSize: 13, color: '#f0e68c', textAlign: 'center' },
  dashboard: { gap: 6 },
  stat: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingVertical: 8, paddingHorizontal: 12,
    backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: 8,
  },
  statLabel: { fontSize: 13, color: 'rgba(255,255,255,0.5)' },
  statValue: { fontSize: 16, fontWeight: '700', color: '#f0e68c' },
});

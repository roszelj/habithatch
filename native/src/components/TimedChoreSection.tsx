import { useEffect, useRef, useState } from 'react';
import { AppState, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { type CategoryChores, type TimeActionType, TIME_ACTIONS, getCurrentPeriod } from '../models/types';

interface TimedChoreSectionProps {
  chores: CategoryChores;
  parentActive: boolean;
  onToggle: (category: TimeActionType, id: string) => void;
}

export function TimedChoreSection({ chores, parentActive, onToggle }: TimedChoreSectionProps) {
  const [currentPeriod, setCurrentPeriod] = useState<TimeActionType>(getCurrentPeriod);

  // Refresh period on a 60s interval (US3: stays open across time boundary)
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPeriod(getCurrentPeriod());
    }, 60_000);
    return () => clearInterval(interval);
  }, []);

  // Refresh immediately when returning to foreground (US3)
  const appStateRef = useRef(AppState.currentState);
  useEffect(() => {
    const sub = AppState.addEventListener('change', (nextState) => {
      if (appStateRef.current !== 'active' && nextState === 'active') {
        setCurrentPeriod(getCurrentPeriod());
      }
      appStateRef.current = nextState;
    });
    return () => sub.remove();
  }, []);

  const periodAction = TIME_ACTIONS.find(a => a.type === currentPeriod)!;
  const currentChores = chores[currentPeriod];

  return (
    <View style={styles.container}>
      <Text style={styles.header}>
        {periodAction.emoji} {periodAction.label} Chores
      </Text>

      {currentChores.length === 0 ? (
        <Text style={styles.empty}>
          No {periodAction.label.toLowerCase()} chores — enjoy your free time! 🎉
        </Text>
      ) : (
        <View style={styles.list}>
          {currentChores.map(chore => {
            const isApproved = chore.status === 'approved';
            const isPending = chore.status === 'pending';
            const isDone = isApproved || isPending;
            return (
              <TouchableOpacity
                key={chore.id}
                style={[styles.row, isApproved && styles.rowApproved, isPending && styles.rowPending]}
                onPress={() => !isDone && onToggle(currentPeriod, chore.id)}
                disabled={isDone}
                activeOpacity={isDone ? 1 : 0.6}
              >
                <View style={[styles.checkbox, isDone && styles.checkboxChecked]}>
                  {isDone && <Text style={styles.checkMark}>✓</Text>}
                </View>
                <Text style={[styles.choreName, isApproved && styles.choreNameDone]}>
                  {chore.name}
                </Text>
                {isPending && (
                  <Text style={styles.pendingBadge}>pending</Text>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      )}

      {!parentActive && currentChores.every(c => c.status === 'approved') && currentChores.length > 0 && (
        <Text style={styles.allDone}>All done! Great job! ⭐</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginTop: 12,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 12,
    padding: 14,
    gap: 10,
  },
  header: {
    fontSize: 15,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.8)',
  },
  empty: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.45)',
    textAlign: 'center',
    paddingVertical: 8,
  },
  list: { gap: 4 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    minHeight: 44,
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderRadius: 8,
  },
  rowApproved: { opacity: 0.5 },
  rowPending: { opacity: 0.7 },
  checkbox: {
    width: 22,
    height: 22,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#2ecc71',
    borderColor: '#2ecc71',
  },
  checkMark: { fontSize: 12, color: '#fff', fontWeight: '700' },
  choreName: { flex: 1, fontSize: 14, color: '#fff' },
  choreNameDone: {
    textDecorationLine: 'line-through',
    color: 'rgba(255,255,255,0.5)',
  },
  pendingBadge: {
    fontSize: 10,
    color: '#f0e68c',
    backgroundColor: 'rgba(240,230,140,0.15)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    overflow: 'hidden',
  },
  allDone: {
    fontSize: 13,
    color: '#2ecc71',
    textAlign: 'center',
    paddingTop: 4,
  },
});

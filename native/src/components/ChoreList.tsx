import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { type Chore } from '../models/types';

interface ChoreListProps {
  chores: Chore[];
  parentActive: boolean;
  onAdd: (name: string) => void;
  onRemove: (id: string) => void;
  onToggle: (id: string) => void;
  onReset: () => void;
}

export function ChoreList({ chores, parentActive, onAdd, onRemove, onToggle, onReset }: ChoreListProps) {
  const [newChore, setNewChore] = useState('');

  function handleAdd() {
    if (newChore.trim()) {
      onAdd(newChore);
      setNewChore('');
    }
  }

  const hasCompleted = chores.some(c => c.status === 'approved');
  const showAddRemove = !parentActive;

  return (
    <View style={styles.container}>
      {showAddRemove && (
        <View style={styles.addRow}>
          <TextInput
            style={styles.addInput}
            value={newChore}
            onChangeText={text => setNewChore(text.slice(0, 40))}
            placeholder="Add a chore..."
            placeholderTextColor="rgba(255,255,255,0.3)"
            maxLength={40}
            onSubmitEditing={handleAdd}
          />
          <TouchableOpacity
            style={[styles.addBtn, !newChore.trim() && styles.btnDisabled]}
            onPress={handleAdd}
            disabled={!newChore.trim()}
          >
            <Text style={styles.addBtnText}>+</Text>
          </TouchableOpacity>
        </View>
      )}

      {chores.length === 0 ? (
        <Text style={styles.empty}>
          {parentActive ? 'No chores set up. Ask a parent to add some!' : 'No chores yet!'}
        </Text>
      ) : (
        <View style={styles.list}>
          {chores.map(chore => {
            const isDone = chore.status === 'approved';
            const isPending = chore.status === 'pending';
            return (
              <View key={chore.id} style={[styles.choreItem, isDone && styles.done, isPending && styles.pending]}>
                <TouchableOpacity
                  style={[styles.checkbox, (isDone || isPending) && styles.checkboxChecked]}
                  onPress={() => !(isDone || isPending) && onToggle(chore.id)}
                  disabled={isDone || isPending}
                >
                  {(isDone || isPending) && <Text style={styles.checkMark}>✓</Text>}
                </TouchableOpacity>
                <Text style={[styles.choreName, isDone && styles.choreNameDone]}>{chore.name}</Text>
                {isPending && <Text style={styles.pendingBadge}>pending</Text>}
                {showAddRemove && (
                  <TouchableOpacity style={styles.removeBtn} onPress={() => onRemove(chore.id)}>
                    <Text style={styles.removeBtnText}>✕</Text>
                  </TouchableOpacity>
                )}
              </View>
            );
          })}
        </View>
      )}

      {hasCompleted && !parentActive && (
        <TouchableOpacity style={styles.resetBtn} onPress={onReset}>
          <Text style={styles.resetBtnText}>Reset</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 8 },
  addRow: { flexDirection: 'row', gap: 8 },
  addInput: {
    flex: 1,
    padding: 8,
    fontSize: 14,
    color: '#fff',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    borderRadius: 8,
  },
  addBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: '#f0e68c',
    borderRadius: 8,
    justifyContent: 'center',
  },
  btnDisabled: { opacity: 0.35 },
  addBtnText: { fontSize: 18, fontWeight: '700', color: '#1a1a2e' },
  empty: { fontSize: 13, color: 'rgba(255,255,255,0.4)', textAlign: 'center', paddingVertical: 8 },
  list: { gap: 4 },
  choreItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 6,
    paddingHorizontal: 8,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 8,
  },
  done: { opacity: 0.5 },
  pending: { opacity: 0.7 },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#2ecc71',
    borderColor: '#2ecc71',
  },
  checkMark: { fontSize: 12, color: '#fff', fontWeight: '700' },
  choreName: { flex: 1, fontSize: 14, color: '#fff' },
  choreNameDone: { textDecorationLine: 'line-through', color: 'rgba(255,255,255,0.5)' },
  pendingBadge: {
    fontSize: 10,
    color: '#f0e68c',
    backgroundColor: 'rgba(240,230,140,0.15)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  removeBtn: { padding: 4 },
  removeBtnText: { fontSize: 12, color: 'rgba(255,255,255,0.3)' },
  resetBtn: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 8,
    alignSelf: 'flex-end',
  },
  resetBtnText: { fontSize: 13, color: 'rgba(255,255,255,0.5)' },
});

import { useState } from 'react';
import { type Chore } from '../models/types';
import styles from './ChoreList.module.css';

interface ChoreListProps {
  chores: Chore[];
  parentActive: boolean; // true = parent mode active (hide add/remove for kids)
  onAdd: (name: string) => void;
  onRemove: (id: string) => void;
  onToggle: (id: string) => void;
  onReset: () => void;
}

export function ChoreList({ chores, parentActive, onAdd, onRemove, onToggle, onReset }: ChoreListProps) {
  const [newChore, setNewChore] = useState('');

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (newChore.trim()) {
      onAdd(newChore);
      setNewChore('');
    }
  }

  const hasCompleted = chores.some(c => c.status === 'approved');
  const showAddRemove = !parentActive; // kid can add/remove only if no parent mode

  return (
    <div className={styles.container}>
      {showAddRemove && (
        <form className={styles.addRow} onSubmit={handleAdd}>
          <input
            className={styles.addInput}
            type="text"
            value={newChore}
            onChange={e => setNewChore(e.target.value.slice(0, 40))}
            placeholder="Add a chore..."
            maxLength={40}
          />
          <button className={styles.addBtn} type="submit" disabled={!newChore.trim()}>+</button>
        </form>
      )}

      {chores.length === 0 ? (
        <div className={styles.empty}>
          {parentActive ? 'No chores set up. Ask a parent to add some!' : 'No chores yet!'}
        </div>
      ) : (
        <div className={styles.list}>
          {chores.map(chore => {
            const isDone = chore.status === 'approved';
            const isPending = chore.status === 'pending';
            const itemClass = [
              styles.choreItem,
              isDone ? styles.done : '',
              isPending ? styles.pending : '',
            ].filter(Boolean).join(' ');

            return (
              <div key={chore.id} className={itemClass}>
                <input
                  type="checkbox"
                  className={styles.checkbox}
                  checked={isDone || isPending}
                  disabled={isDone || isPending}
                  onChange={() => onToggle(chore.id)}
                />
                <span className={styles.choreName}>{chore.name}</span>
                {isPending && <span className={styles.pendingBadge}>pending</span>}
                {showAddRemove && (
                  <button className={styles.removeBtn} onClick={() => onRemove(chore.id)}>x</button>
                )}
              </div>
            );
          })}
        </div>
      )}

      {hasCompleted && !parentActive && (
        <button className={styles.resetBtn} onClick={onReset}>Reset</button>
      )}
    </div>
  );
}

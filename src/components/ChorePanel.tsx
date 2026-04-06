import { type CategoryChores, type CategoryPoints, type TimeActionType, TIME_ACTIONS } from '../models/types';
import { ChoreList } from './ChoreList';
import styles from './ChorePanel.module.css';

interface ChorePanelProps {
  chores: CategoryChores;
  points: CategoryPoints;
  parentActive: boolean;
  onAdd: (category: TimeActionType, name: string) => void;
  onRemove: (category: TimeActionType, id: string) => void;
  onToggle: (category: TimeActionType, id: string) => void;
  onResetCategory: (category: TimeActionType) => void;
  onResetAll: () => void;
}

export function ChorePanel({
  chores, points, parentActive, onAdd, onRemove, onToggle, onResetCategory, onResetAll,
}: ChorePanelProps) {
  const hasAnyCompleted = TIME_ACTIONS.some(a => chores[a.type].some(c => c.status === 'approved'));

  return (
    <div className={styles.panel}>
      {TIME_ACTIONS.map(action => (
        <div key={action.type} className={styles.section}>
          <div className={styles.sectionHeader}>
            {action.emoji} {action.label}
            <span className={styles.sectionPoints}>
              ({points[action.type]} pts)
            </span>
          </div>
          <ChoreList
            chores={chores[action.type]}
            parentActive={parentActive}
            onAdd={(name) => onAdd(action.type, name)}
            onRemove={(id) => onRemove(action.type, id)}
            onToggle={(id) => onToggle(action.type, id)}
            onReset={() => onResetCategory(action.type)}
          />
        </div>
      ))}
      {hasAnyCompleted && !parentActive && (
        <button className={styles.resetAllBtn} onClick={onResetAll}>
          {'\u{1F504}'} Reset All for New Day
        </button>
      )}
    </div>
  );
}

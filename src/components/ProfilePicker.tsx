import { type ChildProfile, CREATURE_SPRITES } from '../models/types';
import styles from './ProfilePicker.module.css';

interface ProfilePickerProps {
  profiles: ChildProfile[];
  canAdd: boolean;
  onSelect: (profileId: string) => void;
  onAddNew: () => void;
}

export function ProfilePicker({ profiles, canAdd, onSelect, onAddNew }: ProfilePickerProps) {
  return (
    <div className={styles.screen}>
      <div className={styles.title}>TERRAGUCCI</div>
      <div className={styles.subtitle}>Who's playing?</div>
      <div className={styles.grid}>
        {profiles.map(p => (
          <button
            key={p.id}
            className={styles.card}
            onClick={() => onSelect(p.id)}
          >
            <span className={styles.cardSprite}>
              {CREATURE_SPRITES[p.creatureType].happy}
            </span>
            <span className={styles.cardName}>{p.creatureName}</span>
          </button>
        ))}
        {canAdd && (
          <button className={styles.addCard} onClick={onAddNew}>
            <span className={styles.addIcon}>+</span>
            <span className={styles.addLabel}>Add Child</span>
          </button>
        )}
      </div>
    </div>
  );
}

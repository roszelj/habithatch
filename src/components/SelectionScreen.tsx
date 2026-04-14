import {
  type CreatureType,
  ALL_CREATURE_TYPES,
  CREATURE_LABELS,
} from '../models/types';
import { CreatureSprite } from './CreatureSprite';
import styles from './SelectionScreen.module.css';

interface SelectionScreenProps {
  onSelect: (type: CreatureType) => void;
  onParentSetup?: () => void;
}

export function SelectionScreen({ onSelect, onParentSetup }: SelectionScreenProps) {
  return (
    <div className={styles.screen}>
      <img src="/logo_header.png" alt="HabitHatch" className="logo-header" />
      <div className={styles.subtitle}>Choose your creature!</div>
      <div className={styles.grid}>
        {ALL_CREATURE_TYPES.map((type) => (
          <button
            key={type}
            className={styles.card}
            onClick={() => onSelect(type)}
          >
            <div className={styles.cardSprite}>
              <CreatureSprite creatureType={type} size={80} />
            </div>
            <span className={styles.cardLabel}>
              {CREATURE_LABELS[type]}
            </span>
          </button>
        ))}
      </div>
      {onParentSetup && (
        <button className={styles.parentBtn} onClick={onParentSetup}>
          Continue as Parent
        </button>
      )}
    </div>
  );
}

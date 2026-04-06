import {
  type CreatureType,
  ALL_CREATURE_TYPES,
  CREATURE_SPRITES,
  CREATURE_LABELS,
} from '../models/types';
import styles from './SelectionScreen.module.css';

interface SelectionScreenProps {
  onSelect: (type: CreatureType) => void;
}

export function SelectionScreen({ onSelect }: SelectionScreenProps) {
  return (
    <div className={styles.screen}>
      <div className={styles.title}>TERRAGUCCI</div>
      <div className={styles.subtitle}>Choose your creature!</div>
      <div className={styles.grid}>
        {ALL_CREATURE_TYPES.map((type) => (
          <button
            key={type}
            className={styles.card}
            onClick={() => onSelect(type)}
          >
            <span className={styles.cardSprite}>
              {CREATURE_SPRITES[type].happy}
            </span>
            <span className={styles.cardLabel}>
              {CREATURE_LABELS[type]}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

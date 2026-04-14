import { useState } from 'react';
import {
  type CreatureType,
  ALL_CREATURE_TYPES,
  CREATURE_LABELS,
} from '../models/types';
import { CreatureSprite } from './CreatureSprite';
import styles from './ChangeCreatureScreen.module.css';

const MAX_NAME_LENGTH = 20;

interface ChangeCreatureScreenProps {
  currentType: CreatureType;
  currentName: string;
  onConfirm: (type: CreatureType, name: string) => void;
  onCancel: () => void;
}

export function ChangeCreatureScreen({ currentType, currentName, onConfirm, onCancel }: ChangeCreatureScreenProps) {
  const [selectedType, setSelectedType] = useState<CreatureType>(currentType);
  const [name, setName] = useState(currentName);

  const trimmed = name.trim();
  const isValid = trimmed.length >= 1 && trimmed.length <= MAX_NAME_LENGTH;

  function handleConfirm(e: React.FormEvent) {
    e.preventDefault();
    if (isValid) {
      onConfirm(selectedType, trimmed);
    }
  }

  return (
    <div className={styles.screen}>
      <div className={styles.title}>Change Creature</div>
      <div className={styles.grid}>
        {ALL_CREATURE_TYPES.map((type) => (
          <button
            key={type}
            className={`${styles.card} ${type === selectedType ? styles.cardActive : ''}`}
            onClick={() => setSelectedType(type)}
            type="button"
          >
            <div className={styles.cardSprite}>
              <CreatureSprite creatureType={type} size={60} />
            </div>
            <span className={styles.cardLabel}>{CREATURE_LABELS[type]}</span>
          </button>
        ))}
      </div>
      <form onSubmit={handleConfirm} className={styles.nameSection}>
        <input
          className={styles.nameInput}
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value.slice(0, MAX_NAME_LENGTH))}
          placeholder="Name your creature..."
          maxLength={MAX_NAME_LENGTH}
        />
        <div className={styles.charCount}>{trimmed.length}/{MAX_NAME_LENGTH}</div>
        <div className={styles.actions}>
          <button className={styles.cancelBtn} type="button" onClick={onCancel}>
            Cancel
          </button>
          <button className={styles.confirmBtn} type="submit" disabled={!isValid}>
            Confirm
          </button>
        </div>
      </form>
    </div>
  );
}

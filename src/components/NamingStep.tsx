import { useState } from 'react';
import {
  type CreatureType,
  CREATURE_SPRITES,
  CREATURE_LABELS,
  DEFAULT_NAMES,
} from '../models/types';
import styles from './NamingStep.module.css';

interface NamingStepProps {
  creatureType: CreatureType;
  onConfirm: (name: string) => void;
}

const MAX_NAME_LENGTH = 20;

export function NamingStep({ creatureType, onConfirm }: NamingStepProps) {
  const [name, setName] = useState(DEFAULT_NAMES[creatureType]);

  const trimmed = name.trim();
  const isValid = trimmed.length >= 1 && trimmed.length <= MAX_NAME_LENGTH;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (isValid) {
      onConfirm(trimmed);
    }
  }

  return (
    <div className={styles.screen}>
      <div className={styles.title}>TERRAGUCCI</div>
      <div className={styles.sprite}>
        {CREATURE_SPRITES[creatureType].happy}
      </div>
      <div className={styles.prompt}>
        Name your {CREATURE_LABELS[creatureType]}!
      </div>
      <form onSubmit={handleSubmit} className={styles.inputRow}>
        <input
          className={styles.nameInput}
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value.slice(0, MAX_NAME_LENGTH))}
          placeholder="Enter a name..."
          maxLength={MAX_NAME_LENGTH}
          autoFocus
        />
        <button
          className={styles.confirmBtn}
          type="submit"
          disabled={!isValid}
        >
          Go!
        </button>
      </form>
      <div className={styles.charCount}>
        {trimmed.length}/{MAX_NAME_LENGTH}
      </div>
      {trimmed.length === 0 && name.length > 0 && (
        <div className={styles.error}>Name cannot be empty</div>
      )}
    </div>
  );
}

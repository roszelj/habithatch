import { useState } from 'react';
import {
  type CreatureType,
  CREATURE_LABELS,
  DEFAULT_NAMES,
} from '../models/types';
import { CreatureSprite } from './CreatureSprite';
import styles from './NamingStep.module.css';

interface NamingStepProps {
  creatureType: CreatureType;
  onConfirm: (childName: string, creatureName: string) => void;
}

const MAX_NAME_LENGTH = 20;

export function NamingStep({ creatureType, onConfirm }: NamingStepProps) {
  const [childName, setChildName] = useState('');
  const [creatureName, setCreatureName] = useState(DEFAULT_NAMES[creatureType]);

  const trimmedChild = childName.trim();
  const trimmedCreature = creatureName.trim();
  const isValid = trimmedChild.length >= 1 && trimmedChild.length <= MAX_NAME_LENGTH
    && trimmedCreature.length >= 1 && trimmedCreature.length <= MAX_NAME_LENGTH;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (isValid) {
      onConfirm(trimmedChild, trimmedCreature);
    }
  }

  return (
    <div className={styles.screen}>
      <img src="/logo_header.png" alt="HabitHatch" className="logo-header" />
      <div className={styles.sprite}>
        <CreatureSprite creatureType={creatureType} size={120} />
      </div>
      <div className={styles.prompt}>
        Child's Name
      </div>
      <div className={styles.inputRow}>
        <input
          className={styles.nameInput}
          type="text"
          value={childName}
          onChange={(e) => setChildName(e.target.value.slice(0, MAX_NAME_LENGTH))}
          placeholder="e.g. Emma"
          maxLength={MAX_NAME_LENGTH}
          autoFocus
        />
      </div>
      <div className={styles.prompt}>
        Name your {CREATURE_LABELS[creatureType]}!
      </div>
      <form onSubmit={handleSubmit} className={styles.inputRow}>
        <input
          className={styles.nameInput}
          type="text"
          value={creatureName}
          onChange={(e) => setCreatureName(e.target.value.slice(0, MAX_NAME_LENGTH))}
          placeholder="Enter a name..."
          maxLength={MAX_NAME_LENGTH}
        />
        <button
          className={styles.confirmBtn}
          type="submit"
          disabled={!isValid}
        >
          Go!
        </button>
      </form>
      {trimmedChild.length === 0 && childName.length > 0 && (
        <div className={styles.error}>Child's name cannot be empty</div>
      )}
    </div>
  );
}

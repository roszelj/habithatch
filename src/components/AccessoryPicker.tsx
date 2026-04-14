import { useState } from 'react';
import { type CreatureType, type AccessoryId } from '../models/types';
import { ACCESSORIES } from '../models/outfits';
import { Creature } from './Creature';
import styles from './AccessoryPicker.module.css';

interface AccessoryPickerProps {
  creatureType: CreatureType;
  creatureName: string;
  onConfirm: (accessoryId: AccessoryId | null) => void;
}

export function AccessoryPicker({ creatureType, creatureName, onConfirm }: AccessoryPickerProps) {
  const [selected, setSelected] = useState<AccessoryId | null>(null);

  return (
    <div className={styles.screen}>
      <img src="/logo_header.png" alt="HabitHatch" className="logo-header" />
      <div className={styles.subtitle}>Add an accessory!</div>
      <Creature
        name={creatureName}
        mood="happy"
        creatureType={creatureType}
        accessoryId={selected}
        reacting={false}
      />
      <div className={styles.grid}>
        <button
          className={`${styles.card} ${selected === null ? styles.selected : ''}`}
          onClick={() => setSelected(null)}
        >
          <span className={styles.cardEmoji}>{'\u{1F6AB}'}</span>
          <span className={styles.cardLabel}>No Accessory</span>
        </button>
        {ACCESSORIES.map(acc => (
          <button
            key={acc.id}
            className={`${styles.card} ${selected === acc.id ? styles.selected : ''}`}
            onClick={() => setSelected(acc.id)}
          >
            <span className={styles.cardEmoji}>{acc.emoji}</span>
            <span className={styles.cardLabel}>{acc.name}</span>
          </button>
        ))}
      </div>
      <button className={styles.confirmBtn} onClick={() => onConfirm(selected)}>
        Let's Go! {'\u{1F389}'}
      </button>
    </div>
  );
}

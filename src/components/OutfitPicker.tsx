import { useState } from 'react';
import { type CreatureType, type OutfitId } from '../models/types';
import { OUTFITS } from '../models/outfits';
import { Creature } from './Creature';
import styles from './OutfitPicker.module.css';

interface OutfitPickerProps {
  creatureType: CreatureType;
  creatureName: string;
  onConfirm: (outfitId: OutfitId | null) => void;
}

export function OutfitPicker({ creatureType, creatureName, onConfirm }: OutfitPickerProps) {
  const [selected, setSelected] = useState<OutfitId | null>(null);

  return (
    <div className={styles.screen}>
      <img src="/logo_header.png" alt="HabitHatch" className="logo-header" />
      <div className={styles.subtitle}>Pick an outfit!</div>
      <Creature
        name={creatureName}
        mood="happy"
        creatureType={creatureType}
        accessoryId={null}
        reacting={false}
      />
      <div className={styles.grid}>
        <button
          className={`${styles.card} ${selected === null ? styles.selected : ''}`}
          onClick={() => setSelected(null)}
        >
          <span className={styles.cardEmoji}>{'\u{1F6AB}'}</span>
          <span className={styles.cardLabel}>No Outfit</span>
        </button>
        {OUTFITS.map(outfit => (
          <button
            key={outfit.id}
            className={`${styles.card} ${selected === outfit.id ? styles.selected : ''}`}
            onClick={() => setSelected(outfit.id)}
          >
            <span className={styles.cardEmoji}>{outfit.emoji}</span>
            <span className={styles.cardLabel}>{outfit.name}</span>
          </button>
        ))}
      </div>
      <button className={styles.confirmBtn} onClick={() => onConfirm(selected)}>
        Next {'\u{2192}'}
      </button>
    </div>
  );
}

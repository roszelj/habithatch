import { type OutfitId, type AccessoryId } from '../models/types';
import { OUTFITS, ACCESSORIES } from '../models/outfits';
import styles from './Wardrobe.module.css';

interface WardrobeProps {
  outfitId: OutfitId | null;
  accessoryId: AccessoryId | null;
  onOutfitChange: (id: OutfitId | null) => void;
  onAccessoryChange: (id: AccessoryId | null) => void;
}

export function Wardrobe({ outfitId, accessoryId, onOutfitChange, onAccessoryChange }: WardrobeProps) {
  return (
    <div className={styles.wardrobe}>
      <div className={styles.sectionTitle}>Outfits</div>
      <div className={styles.grid}>
        <button
          className={`${styles.card} ${outfitId === null ? styles.selected : ''}`}
          onClick={() => onOutfitChange(null)}
        >
          <span className={styles.cardEmoji}>{'\u{1F6AB}'}</span>
          <span className={styles.cardLabel}>None</span>
        </button>
        {OUTFITS.map(o => (
          <button
            key={o.id}
            className={`${styles.card} ${outfitId === o.id ? styles.selected : ''}`}
            onClick={() => onOutfitChange(o.id)}
          >
            <span className={styles.cardEmoji}>{o.emoji}</span>
            <span className={styles.cardLabel}>{o.name}</span>
          </button>
        ))}
      </div>

      <div className={styles.sectionTitle}>Accessories</div>
      <div className={styles.grid}>
        <button
          className={`${styles.card} ${accessoryId === null ? styles.selected : ''}`}
          onClick={() => onAccessoryChange(null)}
        >
          <span className={styles.cardEmoji}>{'\u{1F6AB}'}</span>
          <span className={styles.cardLabel}>None</span>
        </button>
        {ACCESSORIES.map(a => (
          <button
            key={a.id}
            className={`${styles.card} ${accessoryId === a.id ? styles.selected : ''}`}
            onClick={() => onAccessoryChange(a.id)}
          >
            <span className={styles.cardEmoji}>{a.emoji}</span>
            <span className={styles.cardLabel}>{a.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

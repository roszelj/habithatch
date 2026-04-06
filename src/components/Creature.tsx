import { type Mood, type CreatureType, type OutfitId, type AccessoryId, CREATURE_SPRITES } from '../models/types';
import { getOutfitById, getAccessoryById } from '../models/outfits';
import styles from './Creature.module.css';

// Mood face emojis (overlay on creature body)
const MOOD_FACES: Record<Mood, string> = {
  happy: '\u{1F60A}',
  neutral: '\u{1F610}',
  sad: '\u{1F622}',
  distressed: '\u{1F62D}',
};

interface CreatureProps {
  name: string;
  mood: Mood;
  creatureType: CreatureType;
  outfitId: OutfitId | null;
  accessoryId: AccessoryId | null;
  reacting: boolean;
}

export function Creature({ name, mood, creatureType, outfitId, accessoryId, reacting }: CreatureProps) {
  const classes = [
    styles.creature,
    reacting ? styles.bounce : '',
    mood === 'distressed' ? styles.distressed : '',
  ].filter(Boolean).join(' ');

  const bodyEmoji = CREATURE_SPRITES[creatureType].happy; // body is always the base
  const outfit = getOutfitById(outfitId);
  const accessory = getAccessoryById(accessoryId);

  return (
    <div className={classes}>
      <div className={styles.body}>
        <div className={styles.bodyEmoji}>{bodyEmoji}</div>
        <div className={styles.moodOverlay}>{MOOD_FACES[mood]}</div>
        {outfit && <div className={styles.outfitOverlay}>{outfit.emoji}</div>}
        {accessory && <div className={styles.accessoryOverlay}>{accessory.emoji}</div>}
      </div>
      <div className={styles.name}>{name}</div>
    </div>
  );
}

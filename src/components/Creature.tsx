import { type Mood, type CreatureType, type AccessoryId } from '../models/types';
import { getAccessoryById } from '../models/outfits';
import { CreatureSprite } from './CreatureSprite';
import styles from './Creature.module.css';

interface CreatureProps {
  name: string;
  mood: Mood;
  creatureType: CreatureType;
  accessoryId: AccessoryId | null;
  reacting: boolean;
}

export function Creature({ name, mood, creatureType, accessoryId, reacting }: CreatureProps) {
  const classes = [
    styles.creature,
    reacting ? styles.bounce : '',
    mood === 'distressed' ? styles.distressed : '',
  ].filter(Boolean).join(' ');

  const accessory = getAccessoryById(accessoryId);

  return (
    <div className={classes}>
      <div className={styles.body}>
        <div className={styles.bodyEmoji}>
          <CreatureSprite creatureType={creatureType} size={160} />
        </div>
        {accessory && <div className={styles.accessoryOverlay}>{accessory.emoji}</div>}
      </div>
      <div className={styles.name}>{name}</div>
    </div>
  );
}

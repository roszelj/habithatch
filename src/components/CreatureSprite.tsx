import { type CreatureType } from '../models/types';

interface CreatureSpriteProps {
  creatureType: CreatureType;
  size: number;
}

export function CreatureSprite({ creatureType, size }: CreatureSpriteProps) {
  return (
    <div style={{ width: size, height: size, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <img
        src={`/creature-charactors/${creatureType}.png`}
        alt={creatureType}
        style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', display: 'block' }}
      />
    </div>
  );
}

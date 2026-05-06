import { Image, View } from 'react-native';
import { type CreatureType } from '../models/types';

const CREATURE_IMAGES: Record<CreatureType, any> = {
  bunny:    require('../../assets/creatures/bunny.png'),
  calico:   require('../../assets/creatures/calico.png'),
  chick:    require('../../assets/creatures/chick.png'),
  cockatoo: require('../../assets/creatures/cockatoo.png'),
  corgi:    require('../../assets/creatures/corgi.png'),
  dragon:   require('../../assets/creatures/dragon.png'),
  elephant: require('../../assets/creatures/elephant.png'),
  fish:     require('../../assets/creatures/fish.png'),
  gecko:    require('../../assets/creatures/gecko.png'),
  giraffe:  require('../../assets/creatures/giraffe.png'),
  husky:    require('../../assets/creatures/husky.png'),
  leopard:  require('../../assets/creatures/leopard.png'),
  monkey:   require('../../assets/creatures/monkey.png'),
  panda:    require('../../assets/creatures/panda.png'),
  sloth:    require('../../assets/creatures/sloth.png'),
  snake:    require('../../assets/creatures/snake.png'),
  tiger:    require('../../assets/creatures/tiger.png'),
};

interface CreatureSpriteProps {
  creatureType: CreatureType;
  size: number;
}

export function CreatureSprite({ creatureType, size }: CreatureSpriteProps) {
  const source = CREATURE_IMAGES[creatureType];
  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Image
        source={source}
        style={{ width: size, height: size }}
        resizeMode="contain"
      />
    </View>
  );
}

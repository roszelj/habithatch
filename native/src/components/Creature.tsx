import { useRef, useEffect } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';
import { type Mood, type CreatureType, type AccessoryId } from '../models/types';
import { getAccessoryById } from '../models/outfits';
import { CreatureSprite } from './CreatureSprite';

interface CreatureProps {
  name: string;
  mood: Mood;
  creatureType: CreatureType;
  accessoryId: AccessoryId | null;
  reacting: boolean;
}

export function Creature({ name, mood, creatureType, accessoryId, reacting }: CreatureProps) {
  const bounceAnim = useRef(new Animated.Value(0)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (reacting) {
      Animated.sequence([
        Animated.timing(bounceAnim, { toValue: -12, duration: 100, useNativeDriver: true }),
        Animated.timing(bounceAnim, { toValue: 0, duration: 150, useNativeDriver: true }),
        Animated.timing(bounceAnim, { toValue: -6, duration: 80, useNativeDriver: true }),
        Animated.timing(bounceAnim, { toValue: 0, duration: 100, useNativeDriver: true }),
      ]).start();
    }
  }, [reacting, bounceAnim]);

  useEffect(() => {
    if (mood === 'distressed') {
      Animated.loop(
        Animated.sequence([
          Animated.timing(shakeAnim, { toValue: 4, duration: 80, useNativeDriver: true }),
          Animated.timing(shakeAnim, { toValue: -4, duration: 80, useNativeDriver: true }),
          Animated.timing(shakeAnim, { toValue: 0, duration: 80, useNativeDriver: true }),
        ])
      ).start();
    } else {
      shakeAnim.setValue(0);
    }
  }, [mood, shakeAnim]);

  const accessory = getAccessoryById(accessoryId);

  return (
    <Animated.View style={[styles.creature, { transform: [{ translateY: bounceAnim }, { translateX: shakeAnim }] }]}>
      <View style={styles.body}>
        <CreatureSprite creatureType={creatureType} size={160} />
        {accessory && (
          <View style={styles.accessoryOverlay}>
            <Text style={styles.accessoryEmoji}>{accessory.emoji}</Text>
          </View>
        )}
      </View>
      <Text style={styles.name}>{name}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  creature: { alignItems: 'center', gap: 8 },
  body: { position: 'relative', alignItems: 'center' },
  accessoryOverlay: {
    position: 'absolute',
    top: -10,
    right: -10,
  },
  accessoryEmoji: { fontSize: 32 },
  name: { fontSize: 18, fontWeight: '700', color: '#fff', textAlign: 'center' },
});

import { View, Text, TouchableOpacity, Image, ScrollView, StyleSheet } from 'react-native';
import { type CreatureType, ALL_CREATURE_TYPES, CREATURE_LABELS } from '../models/types';
import { CreatureSprite } from './CreatureSprite';

interface SelectionScreenProps {
  onSelect: (type: CreatureType) => void;
  onParentSetup?: () => void;
}

export function SelectionScreen({ onSelect, onParentSetup }: SelectionScreenProps) {
  return (
    <ScrollView contentContainerStyle={styles.screen}>
      <Image source={require('../../assets/logo_header.png')} style={styles.logo} resizeMode="contain" />
      <Text style={styles.subtitle}>Choose your creature!</Text>
      <View style={styles.grid}>
        {ALL_CREATURE_TYPES.map((type) => (
          <TouchableOpacity key={type} style={styles.card} onPress={() => onSelect(type)}>
            <View style={styles.cardSprite}>
              <CreatureSprite creatureType={type} size={80} />
            </View>
            <Text style={styles.cardLabel}>{CREATURE_LABELS[type]}</Text>
          </TouchableOpacity>
        ))}
      </View>
      {onParentSetup && (
        <TouchableOpacity style={styles.parentBtn} onPress={onParentSetup}>
          <Text style={styles.parentBtnText}>Continue as Parent</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  logo: { width: 220, height: 70 },
  subtitle: { fontSize: 18, color: 'rgba(255,255,255,0.7)', fontWeight: '600' },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'center',
    width: '100%',
  },
  card: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.15)',
    borderRadius: 12,
    padding: 12,
    minWidth: 100,
    gap: 6,
  },
  cardSprite: { alignItems: 'center' },
  cardLabel: { fontSize: 13, fontWeight: '600', color: 'rgba(255,255,255,0.8)', textAlign: 'center' },
  parentBtn: {
    paddingVertical: 10,
    paddingHorizontal: 24,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    borderRadius: 8,
  },
  parentBtnText: { fontSize: 14, color: 'rgba(255,255,255,0.6)' },
});

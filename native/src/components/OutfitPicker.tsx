import { useState } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView, StyleSheet } from 'react-native';
import { type CreatureType, type OutfitId } from '../models/types';
import { OUTFITS } from '../models/outfits';
import { Creature } from './Creature';

interface OutfitPickerProps {
  creatureType: CreatureType;
  creatureName: string;
  onConfirm: (outfitId: OutfitId | null) => void;
}

export function OutfitPicker({ creatureType, creatureName, onConfirm }: OutfitPickerProps) {
  const [selected, setSelected] = useState<OutfitId | null>(null);

  return (
    <ScrollView contentContainerStyle={styles.screen}>
      <Image source={require('../../assets/logo_header.png')} style={styles.logo} resizeMode="contain" />
      <Text style={styles.subtitle}>Pick an outfit!</Text>
      <Creature
        name={creatureName}
        mood="happy"
        creatureType={creatureType}
        accessoryId={null}
        reacting={false}
      />
      <View style={styles.grid}>
        <TouchableOpacity
          style={[styles.card, selected === null && styles.selected]}
          onPress={() => setSelected(null)}
        >
          <Text style={styles.cardEmoji}>{'\u{1F6AB}'}</Text>
          <Text style={styles.cardLabel}>No Outfit</Text>
        </TouchableOpacity>
        {OUTFITS.map(outfit => (
          <TouchableOpacity
            key={outfit.id}
            style={[styles.card, selected === outfit.id && styles.selected]}
            onPress={() => setSelected(outfit.id)}
          >
            <Text style={styles.cardEmoji}>{outfit.emoji}</Text>
            <Text style={styles.cardLabel}>{outfit.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <TouchableOpacity style={styles.confirmBtn} onPress={() => onConfirm(selected)}>
        <Text style={styles.confirmBtnText}>Next {'\u{2192}'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flexGrow: 1,
    alignItems: 'center',
    gap: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  logo: { width: 200, height: 60 },
  subtitle: { fontSize: 18, color: 'rgba(255,255,255,0.7)', fontWeight: '600' },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'center',
    width: '100%',
  },
  card: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.12)',
    borderRadius: 10,
    padding: 12,
    minWidth: 80,
    gap: 4,
  },
  selected: {
    borderColor: '#f0e68c',
    backgroundColor: 'rgba(240,230,140,0.1)',
  },
  cardEmoji: { fontSize: 28 },
  cardLabel: { fontSize: 11, color: 'rgba(255,255,255,0.7)', textAlign: 'center' },
  confirmBtn: {
    paddingVertical: 12,
    paddingHorizontal: 32,
    backgroundColor: '#f0e68c',
    borderRadius: 10,
  },
  confirmBtnText: { fontSize: 16, fontWeight: '700', color: '#1a1a2e' },
});

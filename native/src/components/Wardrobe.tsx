import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { type OutfitId, type AccessoryId } from '../models/types';
import { OUTFITS, ACCESSORIES } from '../models/outfits';

interface WardrobeProps {
  outfitId: OutfitId | null;
  accessoryId: AccessoryId | null;
  onOutfitChange: (id: OutfitId | null) => void;
  onAccessoryChange: (id: AccessoryId | null) => void;
}

export function Wardrobe({ outfitId, accessoryId, onOutfitChange, onAccessoryChange }: WardrobeProps) {
  return (
    <ScrollView contentContainerStyle={styles.wardrobe}>
      <Text style={styles.sectionTitle}>Outfits</Text>
      <View style={styles.grid}>
        <TouchableOpacity
          style={[styles.card, outfitId === null && styles.selected]}
          onPress={() => onOutfitChange(null)}
        >
          <Text style={styles.cardEmoji}>{'\u{1F6AB}'}</Text>
          <Text style={styles.cardLabel}>None</Text>
        </TouchableOpacity>
        {OUTFITS.map(o => (
          <TouchableOpacity
            key={o.id}
            style={[styles.card, outfitId === o.id && styles.selected]}
            onPress={() => onOutfitChange(o.id)}
          >
            <Text style={styles.cardEmoji}>{o.emoji}</Text>
            <Text style={styles.cardLabel}>{o.name}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.sectionTitle}>Accessories</Text>
      <View style={styles.grid}>
        <TouchableOpacity
          style={[styles.card, accessoryId === null && styles.selected]}
          onPress={() => onAccessoryChange(null)}
        >
          <Text style={styles.cardEmoji}>{'\u{1F6AB}'}</Text>
          <Text style={styles.cardLabel}>None</Text>
        </TouchableOpacity>
        {ACCESSORIES.map(a => (
          <TouchableOpacity
            key={a.id}
            style={[styles.card, accessoryId === a.id && styles.selected]}
            onPress={() => onAccessoryChange(a.id)}
          >
            <Text style={styles.cardEmoji}>{a.emoji}</Text>
            <Text style={styles.cardLabel}>{a.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  wardrobe: { gap: 12, paddingBottom: 24 },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: 'rgba(255,255,255,0.7)', marginTop: 4 },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'flex-start',
  },
  card: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: 10,
    padding: 10,
    minWidth: 72,
    gap: 3,
  },
  selected: {
    borderColor: '#f0e68c',
    backgroundColor: 'rgba(240,230,140,0.08)',
  },
  cardEmoji: { fontSize: 24 },
  cardLabel: { fontSize: 10, color: 'rgba(255,255,255,0.6)', textAlign: 'center' },
});

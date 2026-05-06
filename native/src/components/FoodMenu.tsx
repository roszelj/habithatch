import { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import { FOOD_ITEMS, type FoodItem } from '../models/foods';

interface FoodMenuProps {
  onSelect: (food: FoodItem) => void;
  onClose: () => void;
}

export function FoodMenu({ onSelect, onClose }: FoodMenuProps) {
  const [selected, setSelected] = useState(false);

  const handleSelect = (food: FoodItem) => {
    if (selected) return;
    setSelected(true);
    onSelect(food);
  };

  return (
    <Modal transparent animationType="fade" onRequestClose={onClose}>
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose}>
        <TouchableOpacity style={styles.popup} activeOpacity={1} onPress={() => {}}>
          <View style={styles.header}>
            <Text style={styles.title}>Pick a food!</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.closeBtn}>✕</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.grid}>
            {FOOD_ITEMS.map(food => (
              <TouchableOpacity
                key={food.id}
                style={[styles.foodCard, selected && styles.foodCardDisabled]}
                onPress={() => handleSelect(food)}
                disabled={selected}
              >
                <Text style={styles.foodEmoji}>{food.emoji}</Text>
                <Text style={styles.foodName}>{food.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  popup: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: '#1e3a5f',
    borderRadius: 16,
    padding: 20,
    gap: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: { fontSize: 18, fontWeight: '700', color: '#fff' },
  closeBtn: { fontSize: 20, color: 'rgba(255,255,255,0.5)', padding: 4 },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'center',
  },
  foodCard: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    borderRadius: 12,
    padding: 12,
    minWidth: 80,
    gap: 4,
  },
  foodCardDisabled: { opacity: 0.4 },
  foodEmoji: { fontSize: 32 },
  foodName: { fontSize: 12, color: 'rgba(255,255,255,0.7)', textAlign: 'center' },
});

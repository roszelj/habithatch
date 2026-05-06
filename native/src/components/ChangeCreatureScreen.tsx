import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { type CreatureType, ALL_CREATURE_TYPES, CREATURE_LABELS } from '../models/types';
import { CreatureSprite } from './CreatureSprite';

const MAX_NAME_LENGTH = 20;

interface ChangeCreatureScreenProps {
  currentType: CreatureType;
  currentName: string;
  onConfirm: (type: CreatureType, name: string) => void;
  onCancel: () => void;
}

export function ChangeCreatureScreen({ currentType, currentName, onConfirm, onCancel }: ChangeCreatureScreenProps) {
  const [selectedType, setSelectedType] = useState<CreatureType>(currentType);
  const [name, setName] = useState(currentName);

  const trimmed = name.trim();
  const isValid = trimmed.length >= 1 && trimmed.length <= MAX_NAME_LENGTH;

  return (
    <ScrollView contentContainerStyle={styles.screen} keyboardShouldPersistTaps="handled">
      <Text style={styles.title}>Change Creature</Text>
      <View style={styles.grid}>
        {ALL_CREATURE_TYPES.map((type) => (
          <TouchableOpacity
            key={type}
            style={[styles.card, type === selectedType && styles.cardActive]}
            onPress={() => setSelectedType(type)}
          >
            <CreatureSprite creatureType={type} size={60} />
            <Text style={styles.cardLabel}>{CREATURE_LABELS[type]}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.nameSection}>
        <TextInput
          style={styles.nameInput}
          value={name}
          onChangeText={text => setName(text.slice(0, MAX_NAME_LENGTH))}
          placeholder="Name your creature..."
          placeholderTextColor="rgba(255,255,255,0.3)"
          maxLength={MAX_NAME_LENGTH}
        />
        <Text style={styles.charCount}>{trimmed.length}/{MAX_NAME_LENGTH}</Text>
        <View style={styles.actions}>
          <TouchableOpacity style={styles.cancelBtn} onPress={onCancel}>
            <Text style={styles.cancelBtnText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.confirmBtn, !isValid && styles.btnDisabled]}
            onPress={() => isValid && onConfirm(selectedType, trimmed)}
            disabled={!isValid}
          >
            <Text style={styles.confirmBtnText}>Confirm</Text>
          </TouchableOpacity>
        </View>
      </View>
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
  title: { fontSize: 22, fontWeight: '700', color: '#f0e68c' },
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
    padding: 10,
    minWidth: 88,
    gap: 4,
  },
  cardActive: {
    borderColor: '#f0e68c',
    backgroundColor: 'rgba(240,230,140,0.1)',
  },
  cardLabel: { fontSize: 11, fontWeight: '600', color: 'rgba(255,255,255,0.7)', textAlign: 'center' },
  nameSection: { width: '100%', gap: 8 },
  nameInput: {
    width: '100%',
    padding: 12,
    fontSize: 16,
    color: '#fff',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.2)',
    borderRadius: 10,
  },
  charCount: { fontSize: 12, color: 'rgba(255,255,255,0.3)', textAlign: 'right' },
  actions: { flexDirection: 'row', gap: 10 },
  cancelBtn: {
    flex: 1,
    padding: 12,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    borderRadius: 10,
    alignItems: 'center',
  },
  cancelBtnText: { fontSize: 15, color: 'rgba(255,255,255,0.6)', fontWeight: '600' },
  confirmBtn: {
    flex: 1,
    padding: 12,
    backgroundColor: '#f0e68c',
    borderRadius: 10,
    alignItems: 'center',
  },
  btnDisabled: { opacity: 0.4 },
  confirmBtnText: { fontSize: 15, fontWeight: '700', color: '#1a1a2e' },
});

import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { type CreatureType, CREATURE_LABELS, DEFAULT_NAMES } from '../models/types';
import { CreatureSprite } from './CreatureSprite';

interface NamingStepProps {
  creatureType: CreatureType;
  onConfirm: (childName: string, creatureName: string) => void;
}

const MAX_NAME_LENGTH = 20;

export function NamingStep({ creatureType, onConfirm }: NamingStepProps) {
  const [childName, setChildName] = useState('');
  const [creatureName, setCreatureName] = useState(DEFAULT_NAMES[creatureType]);

  const trimmedChild = childName.trim();
  const trimmedCreature = creatureName.trim();
  const isValid = trimmedChild.length >= 1 && trimmedChild.length <= MAX_NAME_LENGTH
    && trimmedCreature.length >= 1 && trimmedCreature.length <= MAX_NAME_LENGTH;

  return (
    <View style={styles.screen}>
      <Image source={require('../../assets/logo_header.png')} style={styles.logo} resizeMode="contain" />
      <CreatureSprite creatureType={creatureType} size={120} />

      <Text style={styles.prompt}>Child's Name</Text>
      <TextInput
        style={styles.nameInput}
        value={childName}
        onChangeText={text => setChildName(text.slice(0, MAX_NAME_LENGTH))}
        placeholder="e.g. Emma"
        placeholderTextColor="rgba(255,255,255,0.3)"
        maxLength={MAX_NAME_LENGTH}
        autoFocus
      />

      <Text style={styles.prompt}>Name your {CREATURE_LABELS[creatureType]}!</Text>
      <View style={styles.inputRow}>
        <TextInput
          style={[styles.nameInput, { flex: 1 }]}
          value={creatureName}
          onChangeText={text => setCreatureName(text.slice(0, MAX_NAME_LENGTH))}
          placeholder="Enter a name..."
          placeholderTextColor="rgba(255,255,255,0.3)"
          maxLength={MAX_NAME_LENGTH}
          onSubmitEditing={() => isValid && onConfirm(trimmedChild, trimmedCreature)}
        />
        <TouchableOpacity
          style={[styles.confirmBtn, !isValid && styles.btnDisabled]}
          onPress={() => isValid && onConfirm(trimmedChild, trimmedCreature)}
          disabled={!isValid}
        >
          <Text style={styles.confirmBtnText}>Go!</Text>
        </TouchableOpacity>
      </View>

      {trimmedChild.length === 0 && childName.length > 0 && (
        <Text style={styles.error}>Child's name cannot be empty</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 24,
    width: '100%',
    maxWidth: 360,
    alignSelf: 'center',
    padding: 24,
  },
  logo: { width: 200, height: 60 },
  prompt: { fontSize: 18, color: 'rgba(255,255,255,0.7)' },
  inputRow: { flexDirection: 'row', gap: 8, width: '100%' },
  nameInput: {
    width: '100%',
    paddingVertical: 10,
    paddingHorizontal: 14,
    fontSize: 18,
    color: '#fff',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.2)',
    borderRadius: 10,
  },
  confirmBtn: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#f0e68c',
    borderRadius: 10,
    justifyContent: 'center',
  },
  btnDisabled: { opacity: 0.4 },
  confirmBtnText: { fontSize: 18, fontWeight: '600', color: '#1a1a2e' },
  error: { fontSize: 14, color: '#e74c3c' },
});

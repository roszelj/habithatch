import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView, StyleSheet } from 'react-native';
import { type ChildProfile } from '../models/types';
import { CreatureSprite } from './CreatureSprite';

interface ProfilePickerProps {
  profiles: ChildProfile[];
  canAdd: boolean;
  onSelect: (profileId: string) => void;
  onAddNew: () => void;
  parentPin?: string | null;
  onParentAccess?: () => void;
  onParentSetup?: () => void;
}

export function ProfilePicker({ profiles, canAdd, onSelect, onAddNew, parentPin, onParentAccess, onParentSetup }: ProfilePickerProps) {
  const [showPinEntry, setShowPinEntry] = useState(false);
  const [pin, setPin] = useState('');
  const [pinError, setPinError] = useState(false);

  function handleParentClick() {
    if (!parentPin) {
      onParentAccess?.();
    } else {
      setShowPinEntry(true);
      setPin('');
      setPinError(false);
    }
  }

  function handlePinSubmit() {
    if (pin === parentPin) {
      onParentAccess?.();
    } else {
      setPinError(true);
      setPin('');
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.screen} keyboardShouldPersistTaps="handled">
      <Image source={require('../../assets/logo_header.png')} style={styles.logo} resizeMode="contain" />
      <Text style={styles.subtitle}>Who's playing?</Text>

      <View style={styles.grid}>
        {profiles.map(p => (
          <TouchableOpacity key={p.id} style={styles.card} onPress={() => onSelect(p.id)}>
            <View style={styles.cardSprite}>
              <CreatureSprite creatureType={p.creatureType} size={70} />
            </View>
            <Text style={styles.cardName}>{p.childName || p.creatureName}</Text>
            {p.childName ? <Text style={styles.cardCreature}>{p.creatureName}</Text> : null}
          </TouchableOpacity>
        ))}
        {canAdd && (
          <TouchableOpacity style={styles.addCard} onPress={onAddNew}>
            <Text style={styles.addIcon}>+</Text>
            <Text style={styles.addLabel}>Add Child</Text>
          </TouchableOpacity>
        )}
      </View>

      {onParentAccess && parentPin && !showPinEntry && (
        <TouchableOpacity style={styles.parentBtn} onPress={handleParentClick}>
          <Text style={styles.parentBtnText}>{'\u{1F512}'} Parent Access</Text>
        </TouchableOpacity>
      )}

      {onParentSetup && !parentPin && !showPinEntry && (
        <TouchableOpacity style={styles.parentBtn} onPress={onParentSetup}>
          <Text style={styles.parentBtnText}>Continue as Parent</Text>
        </TouchableOpacity>
      )}

      {showPinEntry && (
        <View style={styles.pinEntry}>
          <Text style={styles.pinLabel}>Enter parent PIN</Text>
          <TextInput
            style={[styles.pinInput, pinError && styles.pinInputError]}
            keyboardType="numeric"
            maxLength={8}
            value={pin}
            onChangeText={text => { setPin(text.replace(/\D/g, '')); setPinError(false); }}
            onSubmitEditing={handlePinSubmit}
            secureTextEntry
            autoFocus
            placeholder="••••"
            placeholderTextColor="rgba(255,255,255,0.3)"
          />
          {pinError && <Text style={styles.pinErrorMsg}>Incorrect PIN</Text>}
          <View style={styles.pinButtons}>
            <TouchableOpacity style={[styles.pinSubmitBtn, !pin.length && styles.btnDisabled]} onPress={handlePinSubmit} disabled={!pin.length}>
              <Text style={styles.pinSubmitText}>Enter</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.pinCancelBtn} onPress={() => { setShowPinEntry(false); setPin(''); setPinError(false); }}>
              <Text style={styles.pinCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
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
  cardName: { fontSize: 14, fontWeight: '700', color: '#fff', textAlign: 'center' },
  cardCreature: { fontSize: 12, color: 'rgba(255,255,255,0.5)', textAlign: 'center' },
  addCard: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    borderStyle: 'dashed',
    padding: 16,
    minWidth: 100,
    gap: 4,
  },
  addIcon: { fontSize: 28, color: 'rgba(255,255,255,0.4)' },
  addLabel: { fontSize: 13, color: 'rgba(255,255,255,0.4)' },
  parentBtn: {
    paddingVertical: 10,
    paddingHorizontal: 24,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    borderRadius: 8,
  },
  parentBtnText: { fontSize: 14, color: 'rgba(255,255,255,0.6)' },
  pinEntry: {
    width: '100%',
    alignItems: 'center',
    gap: 10,
    padding: 16,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 12,
  },
  pinLabel: { fontSize: 15, color: 'rgba(255,255,255,0.7)', fontWeight: '600' },
  pinInput: {
    width: 160,
    padding: 12,
    fontSize: 24,
    textAlign: 'center',
    letterSpacing: 8,
    color: '#fff',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.2)',
    borderRadius: 10,
  },
  pinInputError: { borderColor: '#e74c3c' },
  pinErrorMsg: { fontSize: 13, color: '#e74c3c' },
  pinButtons: { flexDirection: 'row', gap: 10 },
  pinSubmitBtn: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    backgroundColor: '#f0e68c',
    borderRadius: 8,
  },
  btnDisabled: { opacity: 0.4 },
  pinSubmitText: { fontSize: 14, fontWeight: '600', color: '#1a1a2e' },
  pinCancelBtn: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    borderRadius: 8,
  },
  pinCancelText: { fontSize: 14, color: 'rgba(255,255,255,0.5)' },
});

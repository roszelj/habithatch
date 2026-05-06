import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

interface PinEntryProps {
  mode: 'create' | 'verify';
  onSubmit: (pin: string) => boolean;
  onCancel: () => void;
}

export function PinEntry({ mode, onSubmit, onCancel }: PinEntryProps) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  function handleSubmit() {
    if (pin.length !== 4) return;
    const ok = onSubmit(pin);
    if (!ok) {
      setError('Incorrect PIN. Try again!');
      setPin('');
    }
  }

  return (
    <View style={styles.screen}>
      <Text style={styles.title}>
        {mode === 'create' ? 'Create Parent PIN' : 'Enter Parent PIN'}
      </Text>
      <Text style={styles.subtitle}>
        {mode === 'create'
          ? 'Choose a 4-digit PIN to protect Parent Mode.'
          : 'Enter your 4-digit PIN to access Parent Mode.'}
      </Text>
      <TextInput
        style={styles.pinInput}
        value={pin}
        onChangeText={text => { setPin(text.replace(/\D/g, '').slice(0, 4)); setError(''); }}
        keyboardType="numeric"
        maxLength={4}
        secureTextEntry
        placeholder="____"
        placeholderTextColor="rgba(255,255,255,0.3)"
        autoFocus
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <TouchableOpacity
        style={[styles.confirmBtn, pin.length !== 4 && styles.btnDisabled]}
        onPress={handleSubmit}
        disabled={pin.length !== 4}
      >
        <Text style={styles.confirmBtnText}>{mode === 'create' ? 'Set PIN' : 'Enter'}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.cancelBtn} onPress={onCancel}>
        <Text style={styles.cancelBtnText}>Cancel</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
    width: '100%',
    maxWidth: 320,
    alignSelf: 'center',
    padding: 24,
  },
  title: { fontSize: 24, fontWeight: '700', color: '#f0e68c' },
  subtitle: { fontSize: 15, color: 'rgba(255,255,255,0.5)', textAlign: 'center' },
  pinInput: {
    width: 160,
    padding: 12,
    fontSize: 32,
    textAlign: 'center',
    letterSpacing: 12,
    color: '#fff',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.2)',
    borderRadius: 12,
  },
  error: { fontSize: 14, color: '#e74c3c' },
  confirmBtn: {
    paddingVertical: 10,
    paddingHorizontal: 28,
    backgroundColor: '#f0e68c',
    borderRadius: 10,
  },
  btnDisabled: { opacity: 0.4 },
  confirmBtnText: { fontSize: 16, fontWeight: '600', color: '#1a1a2e' },
  cancelBtn: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    borderRadius: 8,
  },
  cancelBtnText: { fontSize: 14, color: 'rgba(255,255,255,0.5)' },
});

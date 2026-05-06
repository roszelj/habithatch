import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface FamilySetupProps {
  joinCode: string;
  onContinue: () => void;
}

export function FamilySetup({ joinCode, onContinue }: FamilySetupProps) {
  return (
    <View style={styles.screen}>
      <Text style={styles.title}>✅ Family Created!</Text>
      <Text style={styles.subtitle}>
        Share this code with your kids so they can join from their own devices.
      </Text>
      <Text style={styles.codeBox}>{joinCode}</Text>
      <Text style={styles.hint}>
        Kids tap "I'm a Kid" and enter this code to join.
        You can find this code later in Parent Mode → Stats.
      </Text>
      <TouchableOpacity style={styles.continueBtn} onPress={onContinue}>
        <Text style={styles.continueBtnText}>Continue to Game →</Text>
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
    maxWidth: 360,
    alignSelf: 'center',
    padding: 24,
  },
  title: { fontSize: 29, fontWeight: '700', color: '#f0e68c' },
  subtitle: { fontSize: 16, color: 'rgba(255,255,255,0.6)', textAlign: 'center' },
  codeBox: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    fontSize: 32,
    fontWeight: '700',
    letterSpacing: 8,
    color: '#f0e68c',
    backgroundColor: 'rgba(240,230,140,0.1)',
    borderWidth: 2,
    borderColor: '#f0e68c',
    borderRadius: 12,
  },
  hint: { fontSize: 14, color: 'rgba(255,255,255,0.4)', textAlign: 'center' },
  continueBtn: {
    paddingVertical: 12,
    paddingHorizontal: 32,
    backgroundColor: '#f0e68c',
    borderRadius: 10,
  },
  continueBtnText: { fontSize: 18, fontWeight: '700', color: '#1a1a2e' },
});

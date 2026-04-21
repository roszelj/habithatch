import { View, Text, StyleSheet } from 'react-native';

interface StatBarProps {
  label: string;
  value: number;
  color: string;
}

export function StatBar({ label, value, color }: StatBarProps) {
  const pct = Math.max(0, Math.min(100, value));
  const barColor = pct < 20 ? '#e74c3c' : color;

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${pct}%` as any, backgroundColor: barColor }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    width: '100%',
  },
  label: {
    fontSize: 19,
    width: 32,
    textAlign: 'center',
  },
  track: {
    flex: 1,
    height: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 10,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 10,
  },
});

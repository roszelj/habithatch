import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';

interface ActionButtonProps {
  label: string;
  emoji: string;
  cost?: number;
  costUnit?: string;
  disabled?: boolean;
  onClick: () => void;
}

export function ActionButton({ label, emoji, cost, costUnit = 'pt', disabled, onClick }: ActionButtonProps) {
  return (
    <TouchableOpacity
      style={[styles.button, disabled && styles.disabled]}
      onPress={onClick}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <Text style={styles.emoji}>{emoji}</Text>
      <Text style={styles.label}>{label}</Text>
      {cost !== undefined && (
        <Text style={styles.cost}>{cost}{costUnit}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 18,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.2)',
    borderRadius: 12,
  },
  disabled: {
    opacity: 0.35,
  },
  emoji: {
    fontSize: 20,
    color: '#fff',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  cost: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.6)',
    marginLeft: 2,
  },
});

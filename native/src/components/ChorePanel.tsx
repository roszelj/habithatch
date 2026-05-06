import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { type CategoryChores, type CategoryPoints, type TimeActionType, TIME_ACTIONS } from '../models/types';
import { ChoreList } from './ChoreList';

interface ChorePanelProps {
  chores: CategoryChores;
  points: CategoryPoints;
  parentActive: boolean;
  dayTypeLabel?: string;
  onAdd: (category: TimeActionType, name: string) => void;
  onRemove: (category: TimeActionType, id: string) => void;
  onToggle: (category: TimeActionType, id: string) => void;
  onResetCategory: (category: TimeActionType) => void;
  onResetAll: () => void;
  isStale?: boolean;
  onRefresh?: () => void;
}

export function ChorePanel({
  chores, points, parentActive, dayTypeLabel, onAdd, onRemove, onToggle, onResetCategory, onResetAll, isStale, onRefresh,
}: ChorePanelProps) {
  const hasAnyCompleted = TIME_ACTIONS.some(a => chores[a.type].some(c => c.status === 'approved'));

  return (
    <ScrollView style={styles.panel} contentContainerStyle={styles.content}>
      {dayTypeLabel && <Text style={styles.dayTypeLabel}>{dayTypeLabel}</Text>}
      {isStale && onRefresh && (
        <TouchableOpacity style={styles.refreshBtn} onPress={onRefresh}>
          <Text style={styles.refreshBtnText}>{'\u{1F504}'} New day! Tap to refresh chores</Text>
        </TouchableOpacity>
      )}
      {TIME_ACTIONS.map(action => (
        <View key={action.type} style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionHeaderText}>{action.emoji} {action.label}</Text>
            <Text style={styles.sectionPoints}>({points[action.type]} pts)</Text>
          </View>
          <ChoreList
            chores={chores[action.type]}
            parentActive={parentActive}
            onAdd={(name) => onAdd(action.type, name)}
            onRemove={(id) => onRemove(action.type, id)}
            onToggle={(id) => onToggle(action.type, id)}
            onReset={() => onResetCategory(action.type)}
          />
        </View>
      ))}
      {hasAnyCompleted && !parentActive && (
        <TouchableOpacity style={styles.resetAllBtn} onPress={onResetAll}>
          <Text style={styles.resetAllBtnText}>{'\u{1F504}'} Reset All for New Day</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  panel: { flex: 1 },
  content: { gap: 16, paddingBottom: 32 },
  dayTypeLabel: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.4)',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  refreshBtn: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(240,230,140,0.15)',
    borderWidth: 1,
    borderColor: '#f0e68c',
    borderRadius: 10,
    alignItems: 'center',
  },
  refreshBtnText: { fontSize: 14, color: '#f0e68c', fontWeight: '600' },
  section: { gap: 8 },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionHeaderText: { fontSize: 15, fontWeight: '700', color: 'rgba(255,255,255,0.8)' },
  sectionPoints: { fontSize: 13, color: 'rgba(255,255,255,0.4)' },
  resetAllBtn: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 10,
    alignItems: 'center',
  },
  resetAllBtnText: { fontSize: 14, color: 'rgba(255,255,255,0.5)' },
});

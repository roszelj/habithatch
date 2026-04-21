import { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { KID_HELP_TOPICS, PARENT_HELP_TOPICS, type HelpTopic } from '../models/helpContent';

interface HelpScreenProps {
  onClose: () => void;
  showSwitchProfile?: boolean;
}

export function HelpScreen({ onClose, showSwitchProfile }: HelpScreenProps) {
  const [selectedTopic, setSelectedTopic] = useState<HelpTopic | null>(null);

  const kidTopics = showSwitchProfile
    ? KID_HELP_TOPICS
    : KID_HELP_TOPICS.filter(t => t.id !== 'kid-switch-profile');

  if (selectedTopic) {
    return (
      <View style={styles.screen}>
        <TouchableOpacity style={styles.backBtn} onPress={() => setSelectedTopic(null)}>
          <Text style={styles.backBtnText}>{'\u2190'} Back</Text>
        </TouchableOpacity>
        <ScrollView style={styles.scrollArea} contentContainerStyle={styles.detailContainer}>
          <Text style={styles.detailTitle}>{selectedTopic.title}</Text>
          <Text style={styles.detailBody}>{selectedTopic.detail}</Text>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <TouchableOpacity style={styles.backBtn} onPress={onClose}>
        <Text style={styles.backBtnText}>{'\u2190'} Back</Text>
      </TouchableOpacity>
      <ScrollView style={styles.scrollArea}>
        <Text style={styles.sectionHeader}>{'\u{1F476}'} For Kids</Text>
        {kidTopics.map(topic => (
          <TouchableOpacity key={topic.id} style={styles.topicRow} onPress={() => setSelectedTopic(topic)}>
            <Text style={styles.topicTitle}>{topic.title}</Text>
            <Text style={styles.topicSummary}>{topic.summary}</Text>
          </TouchableOpacity>
        ))}

        <Text style={[styles.sectionHeader, styles.sectionHeaderParent]}>
          {'\u{1F9D1}\u200D\u{1F4BB}'} For Parents
        </Text>
        {PARENT_HELP_TOPICS.map(topic => (
          <TouchableOpacity key={topic.id} style={[styles.topicRow, styles.topicRowParent]} onPress={() => setSelectedTopic(topic)}>
            <Text style={styles.topicTitle}>{topic.title}</Text>
            <Text style={styles.topicSummary}>{topic.summary}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, padding: 16 },
  backBtn: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 12,
    alignSelf: 'flex-start',
  },
  backBtnText: { fontSize: 15, color: '#f0e68c', fontWeight: '600' },
  scrollArea: { flex: 1 },
  sectionHeader: {
    fontSize: 15,
    fontWeight: '700',
    color: '#f0e68c',
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(240,230,140,0.08)',
    borderRadius: 6,
    marginBottom: 4,
  },
  sectionHeaderParent: {
    marginTop: 12,
    color: 'rgba(255,255,255,0.7)',
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  topicRow: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.06)',
    gap: 3,
  },
  topicRowParent: {
    opacity: 0.7,
  },
  topicTitle: { fontSize: 15, fontWeight: '600', color: '#fff' },
  topicSummary: { fontSize: 13, color: 'rgba(255,255,255,0.5)' },
  detailContainer: { gap: 14, paddingBottom: 32 },
  detailTitle: { fontSize: 20, fontWeight: '700', color: '#f0e68c' },
  detailBody: { fontSize: 15, color: 'rgba(255,255,255,0.8)', lineHeight: 22 },
});

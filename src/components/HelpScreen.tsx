import { useState } from 'react';
import { KID_HELP_TOPICS, PARENT_HELP_TOPICS, type HelpTopic } from '../models/helpContent';
import styles from './HelpScreen.module.css';

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
      <div className={styles.screen}>
        <button className={styles.backBtn} onClick={() => setSelectedTopic(null)}>
          {'\u2190'} Back
        </button>
        <div className={styles.detailContainer}>
          <div className={styles.detailTitle}>{selectedTopic.title}</div>
          <p className={styles.detailBody}>{selectedTopic.detail}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.screen}>
      <button className={styles.backBtn} onClick={onClose}>
        {'\u2190'} Back
      </button>
      <div className={styles.scrollArea}>
        <div className={styles.sectionHeader}>{'\u{1F476}'} For Kids</div>
        {kidTopics.map(topic => (
          <button
            key={topic.id}
            className={styles.topicRow}
            onClick={() => setSelectedTopic(topic)}
          >
            <span className={styles.topicTitle}>{topic.title}</span>
            <span className={styles.topicSummary}>{topic.summary}</span>
          </button>
        ))}

        <div className={`${styles.sectionHeader} ${styles.sectionHeaderParent}`}>
          {'\u{1F9D1}\u200D\u{1F4BB}'} For Parents
        </div>
        {PARENT_HELP_TOPICS.map(topic => (
          <button
            key={topic.id}
            className={`${styles.topicRow} ${styles.topicRowParent}`}
            onClick={() => setSelectedTopic(topic)}
          >
            <span className={styles.topicTitle}>{topic.title}</span>
            <span className={styles.topicSummary}>{topic.summary}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

import { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { pickTriviaQuestions, type TriviaResult } from '../models/triviaQuestions';

interface TriviaGameProps {
  onResult: (result: TriviaResult) => void;
}

const QUESTIONS_PER_GAME = 3;

export function TriviaGame({ onResult }: TriviaGameProps) {
  const [questions] = useState(() => pickTriviaQuestions(QUESTIONS_PER_GAME));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);

  const current = questions[currentIndex];
  const isAnswered = selectedAnswer !== null;
  const isLastQuestion = currentIndex === QUESTIONS_PER_GAME - 1;

  const handleAnswer = useCallback((optionIndex: number) => {
    if (isAnswered) return;
    setSelectedAnswer(optionIndex);
    if (optionIndex === current.correctShuffledIndex) {
      setScore(s => s + 1);
    }
  }, [isAnswered, current.correctShuffledIndex]);

  const handleNext = useCallback(() => {
    setCurrentIndex(i => i + 1);
    setSelectedAnswer(null);
  }, []);

  const handleFinish = useCallback(() => {
    onResult({ score, total: QUESTIONS_PER_GAME });
  }, [onResult, score]);

  function getOptionStyle(idx: number) {
    if (!isAnswered) return styles.option;
    if (idx === current.correctShuffledIndex) return [styles.option, styles.correct];
    if (idx === selectedAnswer) return [styles.option, styles.incorrect];
    return [styles.option, styles.dimmed];
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.progress}>
        Question {currentIndex + 1} of {QUESTIONS_PER_GAME}
      </Text>
      <Text style={styles.category}>{current.question.category}</Text>
      <View style={styles.questionCard}>
        <Text style={styles.questionText}>{current.question.question}</Text>
        <View style={styles.options}>
          {current.shuffledOptions.map((option, idx) => (
            <TouchableOpacity
              key={idx}
              style={getOptionStyle(idx)}
              onPress={() => handleAnswer(idx)}
              disabled={isAnswered}
            >
              <Text style={styles.optionText}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>
        {isAnswered && (
          <TouchableOpacity
            style={styles.nextBtn}
            onPress={isLastQuestion ? handleFinish : handleNext}
          >
            <Text style={styles.nextBtnText}>{isLastQuestion ? 'See Results' : 'Next'}</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { gap: 12, paddingBottom: 24, alignItems: 'stretch' },
  progress: { fontSize: 13, color: 'rgba(255,255,255,0.4)', textAlign: 'center' },
  category: { fontSize: 13, fontWeight: '600', color: '#f0e68c', textAlign: 'center' },
  questionCard: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 14,
    padding: 16,
    gap: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  questionText: { fontSize: 16, fontWeight: '600', color: '#fff', textAlign: 'center', lineHeight: 22 },
  options: { gap: 8 },
  option: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.15)',
    borderRadius: 10,
  },
  correct: { borderColor: '#2ecc71', backgroundColor: 'rgba(46,204,113,0.15)' },
  incorrect: { borderColor: '#e74c3c', backgroundColor: 'rgba(231,76,60,0.15)' },
  dimmed: { opacity: 0.4 },
  optionText: { fontSize: 14, color: '#fff', fontWeight: '500' },
  nextBtn: {
    paddingVertical: 12,
    backgroundColor: '#f0e68c',
    borderRadius: 10,
    alignItems: 'center',
  },
  nextBtnText: { fontSize: 16, fontWeight: '700', color: '#1a1a2e' },
});

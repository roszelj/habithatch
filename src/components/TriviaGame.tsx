import { useState, useCallback } from 'react';
import { pickTriviaQuestions, type TriviaResult } from '../models/triviaQuestions';
import styles from './TriviaGame.module.css';

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

  return (
    <div className={styles.container}>
      <div className={styles.progress}>
        Question {currentIndex + 1} of {QUESTIONS_PER_GAME}
      </div>

      <div className={styles.category}>{current.question.category}</div>

      <div className={styles.questionCard}>
        <div className={styles.questionText}>{current.question.question}</div>

        <div className={styles.options}>
          {current.shuffledOptions.map((option, idx) => {
            let optionClass = styles.option;
            if (isAnswered) {
              if (idx === current.correctShuffledIndex) {
                optionClass += ' ' + styles.correct;
              } else if (idx === selectedAnswer) {
                optionClass += ' ' + styles.incorrect;
              } else {
                optionClass += ' ' + styles.dimmed;
              }
            }

            return (
              <button
                key={idx}
                className={optionClass}
                onClick={() => handleAnswer(idx)}
                disabled={isAnswered}
              >
                {option}
              </button>
            );
          })}
        </div>

        {isAnswered && (
          <button
            className={styles.nextBtn}
            onClick={isLastQuestion ? handleFinish : handleNext}
          >
            {isLastQuestion ? 'See Results' : 'Next'}
          </button>
        )}
      </div>
    </div>
  );
}

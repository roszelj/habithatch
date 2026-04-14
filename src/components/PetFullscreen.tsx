import { useState, useEffect, useRef } from 'react';
import { type CreatureType, type HabitatId } from '../models/types';
import { getHabitatById } from '../models/habitats';
import { WHEEL_SEGMENTS, type WheelSegment } from '../models/wheelSegments';
import { pickMiniGame, type TicTacToeResult } from '../models/miniGames';
import { type TriviaResult } from '../models/triviaQuestions';
import { CreatureSprite } from './CreatureSprite';
import { SpinWheel } from './SpinWheel';
import { TicTacToe } from './TicTacToe';
import { TriviaGame } from './TriviaGame';
import styles from './PetFullscreen.module.css';

interface PetFullscreenProps {
  creatureType: CreatureType;
  creatureName: string;
  childName: string | null;
  habitatId: HabitatId | null;
  onClose: () => void;
  onAwardCoins?: (amount: number) => void;
}

type GamePhase = 'greeting' | 'prompt' | 'wheel' | 'result' | 'tictactoe' | 'ttt-result' | 'trivia' | 'trivia-result' | 'done';

function getGreeting(name: string): string {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return `Good Morning, ${name}!`;
  if (hour >= 12 && hour < 17) return `Good Afternoon, ${name}!`;
  return `Good Evening, ${name}!`;
}

export function PetFullscreen({ creatureType, creatureName, childName, habitatId, onClose, onAwardCoins }: PetFullscreenProps) {
  const [gamePhase, setGamePhase] = useState<GamePhase>('greeting');
  const [winningSegment, setWinningSegment] = useState<WheelSegment | null>(null);
  const [tttResult, setTttResult] = useState<TicTacToeResult | null>(null);
  const tttCoinReward = useRef(0);
  const [triviaResult, setTriviaResult] = useState<TriviaResult | null>(null);
  const habitat = getHabitatById(habitatId);
  const displayName = childName || creatureName;
  const greeting = getGreeting(displayName);

  useEffect(() => {
    const greetTimer = setTimeout(() => setGamePhase('greeting'), 0);
    return () => clearTimeout(greetTimer);
  }, []);

  useEffect(() => {
    if (gamePhase !== 'greeting') return;
    const showGreeting = setTimeout(() => {
      // Greeting is already shown; after 3 more seconds, show game prompt
    }, 0);
    const promptTimer = setTimeout(() => setGamePhase('prompt'), 3800);
    return () => { clearTimeout(showGreeting); clearTimeout(promptTimer); };
  }, [gamePhase]);

  const showGreetingBubble = gamePhase === 'greeting' || gamePhase === 'prompt';
  const showCreature = gamePhase !== 'wheel' && gamePhase !== 'tictactoe' && gamePhase !== 'trivia';

  function handlePlayGame() {
    const game = pickMiniGame();
    if (game === 'spin-wheel') setGamePhase('wheel');
    else if (game === 'tictactoe') setGamePhase('tictactoe');
    else setGamePhase('trivia');
  }

  function handleResult(segment: WheelSegment) {
    setWinningSegment(segment);
    setGamePhase('result');
  }

  function handleCollect() {
    if (winningSegment && winningSegment.coinAmount !== 0 && onAwardCoins) {
      onAwardCoins(winningSegment.coinAmount);
    }
    setGamePhase('done');
  }

  function handleTttResult(result: TicTacToeResult) {
    setTttResult(result);
    if (result === 'child-won') {
      tttCoinReward.current = Math.floor(Math.random() * 46) + 30;
    }
    setGamePhase('ttt-result');
  }

  function handleTttCollect() {
    if (tttResult === 'child-won' && tttCoinReward.current > 0 && onAwardCoins) {
      onAwardCoins(tttCoinReward.current);
    }
    setGamePhase('done');
  }

  function handleTriviaResult(result: TriviaResult) {
    setTriviaResult(result);
    setGamePhase('trivia-result');
  }

  function handleTriviaCollect() {
    if (triviaResult && triviaResult.score > 0 && onAwardCoins) {
      onAwardCoins(triviaResult.score);
    }
    setGamePhase('done');
  }

  const resultEmoji = winningSegment?.type === 'coin-prize' ? '\u{1FA99}'
    : winningSegment?.type === 'kindness-challenge' ? '\u{2764}\u{FE0F}'
    : '\u{1F605}';

  const tttEmoji = tttResult === 'child-won' ? '\u{1F3C6}'
    : tttResult === 'pet-won' ? '\u{1F4AA}'
    : '\u{1F91D}';

  const tttMessage = tttResult === 'child-won'
    ? `You won! Here's ${tttCoinReward.current} coins!`
    : tttResult === 'pet-won'
    ? 'Good try! Let\'s play again next time!'
    : 'A tie! You\'re getting good!';

  const triviaEmoji = triviaResult?.score === 3 ? '\u{1F31F}'
    : triviaResult?.score === 0 ? '\u{1F4AA}'
    : '\u{1F389}';

  const triviaMessage = triviaResult?.score === 3
    ? `Perfect score! ${triviaResult.score} out of ${triviaResult.total}!`
    : triviaResult?.score === 0
    ? `Great try! ${triviaResult?.score ?? 0} out of ${triviaResult?.total ?? 3} — you'll get them next time!`
    : `Nice job! ${triviaResult?.score ?? 0} out of ${triviaResult?.total ?? 3}!`;

  return (
    <div className={styles.overlay}>
      {habitat ? (
        <img className={styles.background} src={habitat.image} alt={habitat.name} />
      ) : (
        <div className={styles.defaultBackground} />
      )}
      <button className={styles.closeBtn} onClick={onClose}>
        {'\u{2715}'}
      </button>

      {gamePhase === 'wheel' && (
        <div className={styles.wheelContainer}>
          <SpinWheel
            segments={WHEEL_SEGMENTS}
            onResult={handleResult}
          />
        </div>
      )}

      {gamePhase === 'tictactoe' && (
        <div className={styles.tttContainer}>
          <TicTacToe onResult={handleTttResult} />
        </div>
      )}

      {gamePhase === 'trivia' && (
        <div className={styles.tttContainer}>
          <TriviaGame onResult={handleTriviaResult} />
        </div>
      )}

      {showCreature && (
        <div className={styles.creatureArea}>
          {showGreetingBubble && gamePhase === 'greeting' && (
            <div className={styles.speechBubble}>{greeting}</div>
          )}

          {gamePhase === 'prompt' && (
            <div className={styles.speechBubble}>
              <div>Want to play a game?</div>
              <div className={styles.promptButtons}>
                <button className={styles.yesBtn} onClick={handlePlayGame}>
                  Yes!
                </button>
                <button className={styles.noBtn} onClick={() => setGamePhase('done')}>
                  No thanks
                </button>
              </div>
            </div>
          )}

          {gamePhase === 'result' && winningSegment && (
            <div className={`${styles.speechBubble} ${styles.resultBubble} ${
              winningSegment.type === 'coin-prize' ? styles.resultPrize
                : winningSegment.type === 'kindness-challenge' ? styles.resultChallenge
                : styles.resultPenalty
            }`}>
              <div className={styles.resultEmoji}>{resultEmoji}</div>
              <div className={styles.resultMessage}>{winningSegment.message}</div>
              <button className={styles.collectBtn} onClick={handleCollect}>
                Collect!
              </button>
            </div>
          )}

          {gamePhase === 'ttt-result' && tttResult && (
            <div className={`${styles.speechBubble} ${styles.resultBubble} ${
              tttResult === 'child-won' ? styles.resultWin
                : tttResult === 'pet-won' ? styles.resultLoss
                : styles.resultDraw
            }`}>
              <div className={styles.resultEmoji}>{tttEmoji}</div>
              <div className={styles.resultMessage}>{tttMessage}</div>
              <button className={styles.collectBtn} onClick={handleTttCollect}>
                {tttResult === 'child-won' ? 'Collect!' : 'OK'}
              </button>
            </div>
          )}

          {gamePhase === 'trivia-result' && triviaResult && (
            <div className={`${styles.speechBubble} ${styles.resultBubble} ${
              triviaResult.score === 3 ? styles.resultWin
                : triviaResult.score === 0 ? styles.resultDraw
                : styles.resultPrize
            }`}>
              <div className={styles.resultEmoji}>{triviaEmoji}</div>
              <div className={styles.resultMessage}>{triviaMessage}</div>
              <button className={styles.collectBtn} onClick={handleTriviaCollect}>
                {triviaResult.score > 0 ? 'Collect!' : 'OK'}
              </button>
            </div>
          )}

          {gamePhase === 'done' && (
            <div className={styles.speechBubble}>
              {'\u{1F44B}'} See you later!
            </div>
          )}

          <div className={styles.wanderer}>
            <CreatureSprite creatureType={creatureType} size={200} />
          </div>
        </div>
      )}
    </div>
  );
}

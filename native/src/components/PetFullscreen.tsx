import { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Image, Modal, StyleSheet, Dimensions } from 'react-native';
import { type CreatureType, type HabitatId } from '../models/types';
import { WHEEL_SEGMENTS, type WheelSegment } from '../models/wheelSegments';
import { pickMiniGame, type TicTacToeResult } from '../models/miniGames';
import { type TriviaResult } from '../models/triviaQuestions';
import { HABITAT_IMAGES } from '../models/habitatImages';
import { CreatureSprite } from './CreatureSprite';
import { SpinWheel } from './SpinWheel';
import { TicTacToe } from './TicTacToe';
import { TriviaGame } from './TriviaGame';

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

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export function PetFullscreen({ creatureType, creatureName, childName, habitatId, onClose, onAwardCoins }: PetFullscreenProps) {
  const [gamePhase, setGamePhase] = useState<GamePhase>('greeting');
  const [winningSegment, setWinningSegment] = useState<WheelSegment | null>(null);
  const [tttResult, setTttResult] = useState<TicTacToeResult | null>(null);
  const tttCoinReward = useRef(0);
  const [triviaResult, setTriviaResult] = useState<TriviaResult | null>(null);
  const displayName = childName || creatureName;
  const greeting = getGreeting(displayName);

  useEffect(() => {
    const timer = setTimeout(() => setGamePhase('prompt'), 3800);
    return () => clearTimeout(timer);
  }, []);

  const showCreature = gamePhase !== 'wheel' && gamePhase !== 'tictactoe' && gamePhase !== 'trivia';

  function handlePlayGame() {
    const game = pickMiniGame();
    if (game === 'spin-wheel') setGamePhase('wheel');
    else if (game === 'tictactoe') setGamePhase('tictactoe');
    else setGamePhase('trivia');
  }

  function handleWheelResult(segment: WheelSegment) {
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

  const resultEmoji = winningSegment?.type === 'coin-prize' ? '\u{1F4B0}'
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

  const habitatImage = habitatId ? HABITAT_IMAGES[habitatId] : null;

  return (
    <Modal animationType="fade" statusBarTranslucent>
      <View style={styles.overlay}>
        {habitatImage ? (
          <Image source={habitatImage} style={styles.background} resizeMode="cover" />
        ) : (
          <View style={styles.defaultBackground} />
        )}

        <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
          <Text style={styles.closeBtnText}>{'\u{2715}'}</Text>
        </TouchableOpacity>

        {gamePhase === 'wheel' && (
          <View style={styles.gameContainer}>
            <SpinWheel segments={WHEEL_SEGMENTS} onResult={handleWheelResult} />
          </View>
        )}

        {gamePhase === 'tictactoe' && (
          <View style={styles.gameContainer}>
            <TicTacToe onResult={handleTttResult} />
          </View>
        )}

        {gamePhase === 'trivia' && (
          <View style={styles.gameContainer}>
            <TriviaGame onResult={handleTriviaResult} />
          </View>
        )}

        {showCreature && (
          <View style={styles.creatureArea}>
            {(gamePhase === 'greeting' || gamePhase === 'prompt') && (
              <View style={styles.speechBubble}>
                {gamePhase === 'greeting' && (
                  <Text style={styles.bubbleText}>{greeting}</Text>
                )}
                {gamePhase === 'prompt' && (
                  <>
                    <Text style={styles.bubbleText}>Want to play a game?</Text>
                    <View style={styles.promptButtons}>
                      <TouchableOpacity style={styles.yesBtn} onPress={handlePlayGame}>
                        <Text style={styles.yesBtnText}>Yes!</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.noBtn} onPress={() => setGamePhase('done')}>
                        <Text style={styles.noBtnText}>No thanks</Text>
                      </TouchableOpacity>
                    </View>
                  </>
                )}
              </View>
            )}

            {gamePhase === 'result' && winningSegment && (
              <View style={[styles.speechBubble, styles.resultBubble,
                winningSegment.type === 'coin-prize' ? styles.resultPrize
                  : winningSegment.type === 'kindness-challenge' ? styles.resultChallenge
                  : styles.resultPenalty]}>
                <Text style={styles.resultEmoji}>{resultEmoji}</Text>
                <Text style={styles.resultMessage}>{winningSegment.message}</Text>
                <TouchableOpacity style={styles.collectBtn} onPress={handleCollect}>
                  <Text style={styles.collectBtnText}>Collect!</Text>
                </TouchableOpacity>
              </View>
            )}

            {gamePhase === 'ttt-result' && tttResult && (
              <View style={[styles.speechBubble, styles.resultBubble,
                tttResult === 'child-won' ? styles.resultWin
                  : tttResult === 'pet-won' ? styles.resultLoss
                  : styles.resultDraw]}>
                <Text style={styles.resultEmoji}>{tttEmoji}</Text>
                <Text style={styles.resultMessage}>{tttMessage}</Text>
                <TouchableOpacity style={styles.collectBtn} onPress={handleTttCollect}>
                  <Text style={styles.collectBtnText}>{tttResult === 'child-won' ? 'Collect!' : 'OK'}</Text>
                </TouchableOpacity>
              </View>
            )}

            {gamePhase === 'trivia-result' && triviaResult && (
              <View style={[styles.speechBubble, styles.resultBubble,
                triviaResult.score === 3 ? styles.resultWin
                  : triviaResult.score === 0 ? styles.resultDraw
                  : styles.resultPrize]}>
                <Text style={styles.resultEmoji}>{triviaEmoji}</Text>
                <Text style={styles.resultMessage}>{triviaMessage}</Text>
                <TouchableOpacity style={styles.collectBtn} onPress={handleTriviaCollect}>
                  <Text style={styles.collectBtnText}>{triviaResult.score > 0 ? 'Collect!' : 'OK'}</Text>
                </TouchableOpacity>
              </View>
            )}

            {gamePhase === 'done' && (
              <View style={styles.speechBubble}>
                <Text style={styles.bubbleText}>{'\u{1F44B}'} See you later!</Text>
              </View>
            )}

            <CreatureSprite creatureType={creatureType} size={200} />
          </View>
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: '#1a2a4a',
    alignItems: 'center',
    justifyContent: 'center',
  },
  background: {
    position: 'absolute',
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },
  defaultBackground: {
    position: 'absolute',
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    backgroundColor: '#1a2a4a',
  },
  closeBtn: {
    position: 'absolute',
    top: 52,
    right: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  closeBtnText: { fontSize: 18, color: '#fff', fontWeight: '700' },
  gameContainer: {
    width: '90%',
    maxWidth: 360,
    backgroundColor: 'rgba(26,42,74,0.95)',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  creatureArea: { alignItems: 'center', gap: 16 },
  speechBubble: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 16,
    padding: 16,
    maxWidth: 280,
    alignItems: 'center',
    gap: 10,
  },
  bubbleText: { fontSize: 18, fontWeight: '600', color: '#1a1a2e', textAlign: 'center' },
  promptButtons: { flexDirection: 'row', gap: 10 },
  yesBtn: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    backgroundColor: '#f0e68c',
    borderRadius: 8,
  },
  yesBtnText: { fontSize: 16, fontWeight: '700', color: '#1a1a2e' },
  noBtn: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: 8,
  },
  noBtnText: { fontSize: 14, color: '#555' },
  resultBubble: { paddingVertical: 20 },
  resultPrize: { backgroundColor: 'rgba(240,230,140,0.95)' },
  resultChallenge: { backgroundColor: 'rgba(255,220,230,0.95)' },
  resultPenalty: { backgroundColor: 'rgba(240,240,240,0.95)' },
  resultWin: { backgroundColor: 'rgba(212,255,212,0.95)' },
  resultLoss: { backgroundColor: 'rgba(255,220,210,0.95)' },
  resultDraw: { backgroundColor: 'rgba(230,230,255,0.95)' },
  resultEmoji: { fontSize: 40 },
  resultMessage: { fontSize: 16, fontWeight: '600', color: '#1a1a2e', textAlign: 'center' },
  collectBtn: {
    paddingVertical: 10,
    paddingHorizontal: 24,
    backgroundColor: '#1a1a2e',
    borderRadius: 10,
  },
  collectBtnText: { fontSize: 16, fontWeight: '700', color: '#f0e68c' },
});

export interface WheelSegment {
  id: string;
  label: string;
  type: 'coin-prize' | 'kindness-challenge' | 'coin-penalty';
  coinAmount: number;
  message: string;
  color: string;
  weight: number;
}

export const WHEEL_SEGMENTS: WheelSegment[] = [
  { id: 'prize-5',      label: '+5 coins',      type: 'coin-prize',         coinAmount: 5,   message: 'You won 5 coins!',                              color: '#2ecc71', weight: 25 },
  { id: 'kind-1',       label: 'Be Kind!',      type: 'kindness-challenge', coinAmount: 0,   message: 'Go say something kind to someone! It\'ll make their day!', color: '#e91e8c', weight: 15 },
  { id: 'prize-10',     label: '+10 coins',     type: 'coin-prize',         coinAmount: 10,  message: 'Amazing! You won 10 coins!',                    color: '#3498db', weight: 15 },
  { id: 'penalty-5',    label: '-5 coins',      type: 'coin-penalty',       coinAmount: -5,  message: 'Oh no! You lost 5 coins!',                      color: '#e74c3c', weight: 10 },
  { id: 'prize-3',      label: '+3 coins',      type: 'coin-prize',         coinAmount: 3,   message: 'Nice! You won 3 coins!',                        color: '#1abc9c', weight: 25 },
  { id: 'kind-2',       label: 'Give a Hug!',   type: 'kindness-challenge', coinAmount: 0,   message: 'Go give someone a big hug! Hugs are the best!', color: '#9b59b6', weight: 15 },
  { id: 'prize-20',     label: '+20 coins',     type: 'coin-prize',         coinAmount: 20,  message: 'JACKPOT! You won 20 coins!',                    color: '#f1c40f', weight: 5  },
  { id: 'penalty-10',   label: '-10 coins',     type: 'coin-penalty',       coinAmount: -10, message: 'Oh no! You lost 10 coins! Better luck next time!', color: '#c0392b', weight: 5  },
];

export function pickRandomSegment(): WheelSegment {
  const totalWeight = WHEEL_SEGMENTS.reduce((sum, s) => sum + s.weight, 0);
  let roll = Math.random() * totalWeight;
  for (const segment of WHEEL_SEGMENTS) {
    roll -= segment.weight;
    if (roll <= 0) return segment;
  }
  return WHEEL_SEGMENTS[0];
}

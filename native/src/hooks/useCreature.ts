import { useReducer } from 'react';
import {
  type CreatureState, type CreatureAction, type CreatureType,
  type CategoryPoints, type Mood,
  getMood, clamp, TIME_ACTIONS, MAX_POINTS, HEALTH_DECAY_RATE, FEED_HEALTH_RESTORE, createDefaultPoints,
} from '../models/types';

function createInitialState(name: string, creatureType: CreatureType, health = 100, points?: CategoryPoints): CreatureState {
  return { name, creatureType, health, points: points ?? createDefaultPoints() };
}

function creatureReducer(state: CreatureState, action: CreatureAction): CreatureState {
  if (action.type === 'load') return action.state;

  const timeAction = TIME_ACTIONS.find(a => a.type === action.type);
  if (timeAction) {
    const cat = timeAction.type;
    if (state.points[cat] < timeAction.cost) return state;
    return {
      ...state,
      health: clamp(state.health + timeAction.healthRestore, 0, 100),
      points: { ...state.points, [cat]: clamp(state.points[cat] - timeAction.cost, 0, MAX_POINTS) },
    };
  }

  switch (action.type) {
    case 'feed':
      return { ...state, health: clamp(state.health + FEED_HEALTH_RESTORE, 0, 100) };
    case 'decay': {
      const dt = action.delta / 1000;
      return { ...state, health: clamp(state.health - HEALTH_DECAY_RATE * dt, 0, 100) };
    }
    case 'earn':
      return {
        ...state,
        points: { ...state.points, [action.category]: clamp(state.points[action.category] + action.amount, 0, MAX_POINTS) },
      };
    default:
      return state;
  }
}

export function useCreature(name: string, creatureType: CreatureType, initialHealth?: number, initialPoints?: CategoryPoints) {
  const [state, dispatch] = useReducer(
    creatureReducer,
    { name, creatureType, initialHealth, initialPoints },
    (args) => createInitialState(args.name, args.creatureType, args.initialHealth, args.initialPoints),
  );
  const mood: Mood = getMood(state);
  return { state, mood, dispatch };
}

export { creatureReducer, createInitialState };

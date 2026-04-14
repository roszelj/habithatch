# Data Model: Creature Speech Bubble

**Feature**: 022-creature-speech-bubble | **Date**: 2026-04-07

## Entities

This feature introduces no persistent data. All state is ephemeral UI state within the `Game` component.

### Speech Bubble (UI State)

| Field         | Type           | Description                                                   |
|---------------|----------------|---------------------------------------------------------------|
| speechBubble  | string \| null | Currently displayed message. `null` = no bubble visible.     |

**Lifecycle**:
- Set to a random message string on successful feed action
- Reset to `null` after 3 seconds (via timeout)
- Reset to a new string immediately if another feed fires while a bubble is showing

### Message Pool (Static Constant)

| Field          | Type     | Description                                        |
|----------------|----------|----------------------------------------------------|
| SPEECH_MESSAGES | string[] | Fixed array of encouraging messages. Module-scoped constant in Game.tsx. |

**Contents** (initial pool):
1. "Yummy, thank you!"
2. "You are crushing your chores!"
3. "I was so hungry!"
4. "You are a chore master!"
5. "I can't wait to see what happens next!"
6. "That felt amazing!"
7. "You're the best!"

**Selection rule**: `Math.floor(Math.random() * SPEECH_MESSAGES.length)` — uniform random, no uniqueness guarantee.

## State Transitions

```
speechBubble = null
  → [successful feed action]
  → speechBubble = randomMessage
  → [3 seconds elapse OR new feed fires]
  → speechBubble = null  (or new randomMessage)
```

## No Persistent Storage

Speech bubble content is never saved to localStorage or Firestore. It is purely in-session UI state.

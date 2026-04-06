# Data Model: Virtual Pet Creature

**Feature**: 001-virtual-pet-creature
**Date**: 2026-04-02

## Entities

### Creature

The central game entity — the virtual pet.

| Field      | Type   | Range/Constraints         | Description                          |
|------------|--------|---------------------------|--------------------------------------|
| name       | string | 1-20 characters           | Display name of the creature         |
| hunger     | number | 0-100, integer            | How fed the creature is (100 = full) |
| happiness  | number | 0-100, integer            | How happy the creature is            |
| energy     | number | 0-100, integer            | How rested the creature is           |

**Derived state** (not stored, computed from stats):

| Mood       | Condition                                       |
|------------|-------------------------------------------------|
| happy      | All stats >= 60                                 |
| neutral    | At least one stat 30-59, none below 30          |
| sad        | At least one stat 10-29                         |
| distressed | Any stat < 10                                   |

### Action

A player-initiated interaction with the creature.

| Action | Target Stat | Effect      | Cooldown |
|--------|-------------|-------------|----------|
| feed   | hunger      | +25 (cap 100) | none  |
| play   | happiness   | +20 (cap 100) | none  |
| sleep  | energy      | +30 (cap 100) | none  |

### Stat Decay

Time-based reduction of creature stats while game is active.

| Stat      | Decay Rate          | Notes                        |
|-----------|---------------------|------------------------------|
| hunger    | -2 per 10 seconds   | Fastest decay — feeds urgency |
| happiness | -1.5 per 10 seconds | Medium decay                 |
| energy    | -1 per 10 seconds   | Slowest — sleep is less frequent |

**Decay rules**:
- Stats floor at 0 (never negative)
- Decay pauses when browser tab is hidden (requestAnimationFrame)
- All three stats decay simultaneously and independently

## State Transitions

```text
                    ┌──────────┐
  Game Start ──────►│  happy   │
                    └────┬─────┘
                         │ stats decline
                         ▼
                    ┌──────────┐
                    │ neutral  │◄──── player action restores stats
                    └────┬─────┘
                         │ stats decline further
                         ▼
                    ┌──────────┐
                    │   sad    │◄──── player action restores stats
                    └────┬─────┘
                         │ stats decline further
                         ▼
                    ┌──────────┐
                    │distressed│◄──── player action restores stats
                    └──────────┘
                    (never dies — always recoverable)
```

Mood transitions are instantaneous and derived from current stat
values. There is no hysteresis — mood recalculates on every frame.

## Validation Rules

- Stats MUST be clamped to [0, 100] after any modification
- Creature name MUST be non-empty
- Action effects MUST NOT cause stats to exceed 100
- Decay MUST NOT cause stats to go below 0

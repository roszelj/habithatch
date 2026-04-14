# Data Model: Spin Wheel Mini Game

## Overview

This feature introduces **no new persistent data**. The wheel configuration is static. Coin changes flow through the existing profile save mechanism.

## New Static Data (not persisted)

### WheelSegment

Represents one slice of the prize wheel.

| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Unique identifier (e.g., "prize-5", "challenge-kind") |
| `label` | `string` | Text shown on the segment (e.g., "+5 coins") |
| `type` | `'coin-prize' \| 'kindness-challenge' \| 'coin-penalty'` | Determines how the outcome is handled |
| `coinAmount` | `number` | Coins to add (positive) or deduct (negative). 0 for challenges. |
| `message` | `string` | Message the pet says when this segment wins (e.g., "You won 5 coins!") |
| `color` | `string` | CSS color for the segment (e.g., "#2ecc71") |
| `weight` | `number` | Probability weight (higher = more likely to land) |

### Wheel Configuration (8 segments)

| # | Label | Type | Coins | Weight | Color |
|---|-------|------|-------|--------|-------|
| 1 | +5 coins | coin-prize | +5 | 25 | green |
| 2 | Be Kind! | kindness-challenge | 0 | 15 | pink |
| 3 | +10 coins | coin-prize | +10 | 15 | blue |
| 4 | -5 coins | coin-penalty | -5 | 10 | red |
| 5 | +3 coins | coin-prize | +3 | 25 | teal |
| 6 | Give a Hug! | kindness-challenge | 0 | 15 | purple |
| 7 | +20 coins | coin-prize | +20 | 5 | gold |
| 8 | -10 coins | coin-penalty | -10 | 5 | dark red |

**Probability distribution** (total weight: 115):
- Coin prizes: 70/115 (~61%) — most common
- Kindness challenges: 30/115 (~26%) — moderate
- Coin penalties: 15/115 (~13%) — least common

## Existing Entities Used (modified)

### ChildProfile (write via existing callback)

| Field | Usage |
|-------|-------|
| `coins` | Increased by coin-prize amount, decreased by coin-penalty amount (floored at 0, capped at MAX_COINS) |

## State (ephemeral, component-local)

| State | Location | Type | Purpose |
|-------|----------|------|---------|
| `gamePhase` | PetFullscreen | `'greeting' \| 'prompt' \| 'wheel' \| 'done'` | Tracks the mini game invitation flow |
| `spinning` | SpinWheel | `boolean` | Whether the wheel is currently spinning |
| `result` | SpinWheel | `WheelSegment \| null` | The winning segment after spin completes |
| `targetAngle` | SpinWheel | `number` | Final rotation angle for the spin animation |

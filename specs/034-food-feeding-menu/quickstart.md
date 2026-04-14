# Quickstart: Food Feeding Menu

**Feature**: 034-food-feeding-menu
**Date**: 2026-04-11

## Overview

Replace the 3 time-of-day feeding buttons with a single "Feed" button (2 coins) that opens a food selection popup with 8 food items. Selecting a food restores 10 HP, deducts 2 coins, and shows a food-specific speech bubble.

## Implementation Order

### Step 1: Add food data and constants

Create `src/models/foods.ts` with the static `FOOD_ITEMS` array (8 items, each with id/name/emoji/messages). Add `FEED_COIN_COST` and `FEED_HEALTH_RESTORE` constants to `src/models/types.ts`.

### Step 2: Add 'feed' action to creature reducer

Add `| { type: 'feed' }` to the `CreatureAction` union in `src/models/types.ts`. Handle it in the reducer in `src/hooks/useCreature.ts` to restore `FEED_HEALTH_RESTORE` HP.

### Step 3: Create FoodMenu component

Create `src/components/FoodMenu.tsx` + `FoodMenu.module.css`. Modal overlay with a grid of food item cards (emoji + name). Props: `onSelect(foodId)`, `onClose()`. Dismissible via backdrop click or close button.

### Step 4: Wire into Game.tsx

- Remove the `TIME_ACTIONS.map(...)` action button row
- Add a single "Feed" button (disabled when `coins < FEED_COIN_COST`)
- Add `showFoodMenu` state toggle
- On food selection: deduct coins, dispatch `'feed'`, show food-specific speech bubble, close popup
- Keep the points display row (points are still earned via chores)

## Key Files

| File | Action | What changes |
|------|--------|-------------|
| `src/models/foods.ts` | CREATE | Food items array with emojis and messages |
| `src/models/types.ts` | MODIFY | Add FoodItem type, 'feed' action variant, constants |
| `src/hooks/useCreature.ts` | MODIFY | Handle 'feed' action in reducer |
| `src/components/FoodMenu.tsx` | CREATE | Food selection popup component |
| `src/components/FoodMenu.module.css` | CREATE | Popup styles |
| `src/components/Game.tsx` | MODIFY | Replace action buttons with Feed + FoodMenu |

## Testing

1. Verify Feed button shows on main pet screen with coin cost
2. Verify Feed button is disabled when coins < 2
3. Verify tapping Feed opens food popup with 8 items
4. Verify selecting a food: closes popup, deducts 2 coins, restores health, shows speech bubble
5. Verify dismissing popup without selection spends no coins
6. Verify rapid taps only process one feeding per popup open

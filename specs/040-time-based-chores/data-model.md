# Data Model: Time-Based Chore List in Kid View

**Feature**: 040-time-based-chores  
**Date**: 2026-04-26

## No New Entities

This feature introduces no new data types, Firestore documents, or localStorage keys. All required entities already exist in `native/src/models/types.ts`.

---

## Existing Entities Used

### `TimeActionType`
```ts
type TimeActionType = 'morning' | 'afternoon' | 'evening';
```
Used to key into `CategoryChores` and to select the active time period.

### `Chore`
```ts
interface Chore {
  id: string;
  name: string;
  status: 'unchecked' | 'pending' | 'approved';
}
```
Each row rendered in `TimedChoreSection`. `status` drives visual state (actionable / pending badge / completed strikethrough).

### `CategoryChores`
```ts
interface CategoryChores {
  morning: Chore[];
  afternoon: Chore[];
  evening: Chore[];
}
```
The full chore set passed to `TimedChoreSection`. The component reads only the slice matching the current time period.

---

## Derived Runtime Value: `currentPeriod`

This is a computed value, not persisted. Derived on mount and refreshed via interval + AppState:

```
hour = new Date().getHours()
currentPeriod =
  hour < 12           → 'morning'
  hour >= 12 && < 18  → 'afternoon'
  hour >= 18          → 'evening'
```

---

## Props Contract for `TimedChoreSection`

```ts
interface TimedChoreSectionProps {
  chores: CategoryChores;        // full chore set for current weekday/weekend
  parentActive: boolean;         // drives pending vs. approved on toggle
  onToggle: (category: TimeActionType, id: string) => void;
}
```

`onToggle` maps directly to `checkOffChore(category, id, parentActive)` called from `Game.tsx`.

# Quickstart: Time-Based Chore List in Kid View

**Feature**: 040-time-based-chores

## What's Being Built

A new `TimedChoreSection` component that renders the current time period's chores (morning / afternoon / evening) inline on the main pet view screen, directly below the Feed button. Children can mark chores done from this section. The section auto-updates when the time period changes.

---

## Files to Create

### `native/src/components/TimedChoreSection.tsx` (new)

Responsibilities:
- Determine current time period from device clock
- Render only the chores for that period from the passed `CategoryChores`
- Allow toggling chores via `onToggle(category, id)`
- Show a friendly empty state when no chores exist for the period
- Subscribe to a 60s interval and AppState foreground events to refresh the active period

Key logic sketch:
```ts
function getCurrentPeriod(): TimeActionType {
  const hour = new Date().getHours();
  if (hour < 12) return 'morning';
  if (hour < 18) return 'afternoon';
  return 'evening';
}
```

Render the chore rows using the same visual pattern as `ChoreList` (checkbox, name, pending badge, strikethrough for approved) — but without the add/remove controls (those belong to the parent panel only).

---

## Files to Modify

### `native/src/components/Game.tsx`

1. Import `TimedChoreSection`
2. Mount it inside the existing `ScrollView` (pet view), directly after the `<View style={styles.actions}>` block:

```tsx
<TimedChoreSection
  chores={chores}
  parentActive={parentActive}
  onToggle={(category, id) => checkOffChore(category, id, parentActive)}
/>
```

No other changes to `Game.tsx` are needed.

---

## How to Test

1. Run `cd native && npx expo start`
2. Open the kid view on a device or simulator
3. Set device time to a morning hour — confirm only morning chores appear below Feed
4. Set device time to afternoon — confirm section updates
5. Test with no chores in the current period — confirm friendly empty state
6. Mark a chore done — confirm it moves to pending (if parent PIN set) or approved (if not)
7. Confirm existing Chores tab still works independently

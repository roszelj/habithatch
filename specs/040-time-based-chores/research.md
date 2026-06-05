# Research: Time-Based Chore List in Kid View

**Feature**: 040-time-based-chores  
**Date**: 2026-04-26

## Time Period Detection

**Decision**: Use `new Date().getHours()` to determine current time period on each render and re-check via `setInterval` every 60 seconds while the component is mounted.

**Rationale**: No external library needed. `Date` is available in React Native JS runtime. A 60s polling interval means the section updates within 1 minute of a time boundary crossing (FR-007), which is accurate enough for this use case. Alternatively, `AppState` change events could trigger a re-check on foreground, providing near-instant updates when the user returns to the app.

**Alternatives considered**:
- `react-native-device-time` or similar packages — rejected, unnecessary dependency
- Checking on every render — would work but wastes cycles; interval + AppState is more targeted

**Time period mapping** (matching FR-003 and existing `TIME_ACTIONS` constants):
```
hour < 12           → 'morning'
hour >= 12 && < 18  → 'afternoon'
hour >= 18          → 'evening'
```

---

## Component Integration Point

**Decision**: Mount `<TimedChoreSection>` inside the existing `ScrollView` in `Game.tsx`, directly after the `<View style={styles.actions}>` block (Feed button row), before `</ScrollView>`.

**Rationale**: The spec requires "inline below the feed area, continuous scroll" (FR-001, clarification Q3). The existing ScrollView at line 650 of `Game.tsx` already handles the pet view scroll. Appending to it avoids any new scroll container nesting and keeps the layout flat per Apple HIG guidelines.

**Alternatives considered**:
- Separate tab — rejected by spec (clarification Q3 chose Option A: inline)
- Modal/sheet — rejected by spec (clarification Q3)

---

## Chore Interaction Model

**Decision**: `TimedChoreSection` calls `checkOffChore(category, id, parentActive)` from the existing `useChores` hook, which is already threaded through `Game.tsx`. The section receives `chores`, `parentActive`, and `onToggle` as props.

**Rationale**: `checkOffChore` already handles the full flow — unchecked → pending (if parentActive) or unchecked → approved (if no parent). No new state or logic is needed (clarification Q2 confirmed full interaction parity with existing chore panel).

**Alternatives considered**:
- Duplicating toggle logic inline — rejected, unnecessary duplication
- Direct state mutation — rejected, violates existing pattern

---

## Empty State

**Decision**: When `currentChores.length === 0`, render a centered text message: `"No {period} chores — enjoy your free time! 🎉"`.

**Rationale**: Friendly, age-appropriate, constitution-compliant (Fun-First). Short enough to not crowd the screen. Uses the same text color/opacity as other empty states in the app.

---

## Auto-Update Mechanism

**Decision**: Combine two triggers:
1. `setInterval` every 60 000 ms to update `currentPeriod` state
2. `AppState` listener to re-evaluate period when app returns to foreground

**Rationale**: `setInterval` alone handles the stay-open-across-boundary case. `AppState` foreground event handles the common case where the user closes and reopens the app after a time boundary — ensuring the correct period shows immediately without waiting up to 60s.

**Alternatives considered**:
- `setInterval` only — adequate but 60s lag on foreground
- No auto-update — violates FR-007

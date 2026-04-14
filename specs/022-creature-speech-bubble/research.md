# Research: Creature Speech Bubble

**Feature**: 022-creature-speech-bubble | **Date**: 2026-04-07

No NEEDS CLARIFICATION items existed in the spec. Research focused on confirming the right integration approach within the existing codebase.

## Decision 1 — Separate state vs. reusing `message`

**Decision**: New `speechBubble: string | null` state, separate from `message`.

**Rationale**: The existing `message` state drives a generic text banner below the creature stage ("+5 morning pts & coins!", "Purchased!", etc.). The speech bubble is a different visual element positioned inside the creature stage with comic-bubble styling. Mixing would require conditional styling that adds complexity without benefit.

**Alternatives considered**: Reusing `message` with a flag — rejected (increases coupling, risks breaking existing message UX).

## Decision 2 — Timeout management

**Decision**: `useRef<ReturnType<typeof setTimeout> | null>` to hold the timer ID, cleared on each new trigger.

**Rationale**: The existing `reacting` state uses bare `setTimeout` without cleanup — acceptable for a 400ms flag that can't overlap meaningfully. For the speech bubble, which lasts 3 seconds and can overlap with rapid taps, clearing the previous timer prevents stale `setSpeechBubble(null)` calls that would prematurely hide a new bubble.

**Alternatives considered**: `useEffect` cleanup — more idiomatic React but adds boilerplate for a simple one-shot timer. The `useRef` pattern is already used elsewhere in Game.tsx (e.g., `speechTimerRef`) and is appropriate here.

## Decision 3 — CSS positioning

**Decision**: `position: absolute` inside `.creatureStage`, horizontally centred, floating above the creature with a downward CSS arrow.

**Rationale**: `.creatureStage` is already `position: relative` — a perfect absolute-positioning context. Placing the bubble inside the stage keeps it visually anchored to the creature regardless of screen width.

**Alternatives considered**: Fixed position overlay — rejected (would escape the stage boundary and look disconnected from the creature).

## Decision 4 — No speech bubble in store view

**Decision**: Speech bubble only renders in the pet view (the main `return` at the bottom of `Game`), not in the store view's creature preview.

**Rationale**: The store view's creature preview is a passive display; the child is not performing feed actions there. The store view's `handleAction` is not callable from the store layout. No change needed.

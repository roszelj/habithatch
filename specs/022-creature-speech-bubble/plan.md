# Implementation Plan: Creature Speech Bubble

**Branch**: `022-creature-speech-bubble` | **Date**: 2026-04-07 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/022-creature-speech-bubble/spec.md`

## Summary

When a child successfully feeds the creature (Morning, Afternoon, or Evening action), a speech bubble with a randomly selected encouraging message appears near the creature on the game screen and disappears automatically after 3 seconds. The existing `handleAction` callback in `Game.tsx` is the natural hook point. A new `speechBubble` state (separate from the existing `message` state) drives the bubble. No new components are required — a styled div inside the creature stage does the job.

## Technical Context

**Language/Version**: TypeScript 5.6
**Primary Dependencies**: React 19, Vite 5, CSS Modules
**Storage**: N/A (ephemeral UI state only)
**Testing**: `npm run build` (TypeScript gate)
**Target Platform**: Web browser (mobile-first)
**Project Type**: React SPA
**Performance Goals**: Bubble appears within 1 frame of the feed action (≤16ms)
**Constraints**: No new dependencies; no new files required beyond a CSS module addition
**Scale/Scope**: 2 files changed (Game.tsx, Game.module.css); message pool is a constant

## Constitution Check

| Principle | Assessment | Pass/Fail |
|-----------|-----------|-----------|
| I. Fun-First Design | The creature speaking after being fed is a direct delight mechanic — responsive (appears immediately), playful (encouraging words), and rewarding. Well within the 200ms feedback requirement. | PASS |
| II. Ship & Iterate | Scope is minimal: one new state, one render element, one CSS rule. Deliverable in a single cycle with no rework risk. | PASS |
| III. Kid-Safe Always | All messages are age-appropriate encouragement. No PII, no network calls, no third-party content. | PASS |

**Verdict**: All gates pass. Proceed.

## Project Structure

### Documentation (this feature)

```text
specs/022-creature-speech-bubble/
├── plan.md          ← this file
├── research.md      ← Phase 0 output
├── data-model.md    ← Phase 1 output
├── quickstart.md    ← Phase 1 output
└── tasks.md         ← Phase 2 output (/speckit-tasks)
```

### Source Code (files changed)

```text
src/
├── components/
│   ├── Game.tsx           ← speechBubble state + SPEECH_MESSAGES pool + render bubble
│   └── Game.module.css    ← .speechBubble + .speechBubbleArrow styles
```

No new files, no new components.

## Phase 0: Research

### Decision 1 — Where to render the speech bubble

**Decision**: Render the bubble as a styled `<div>` inside `.creatureStage`, positioned `absolute` above the creature. Use a separate `speechBubble: string | null` state rather than reusing the existing `message` state.

**Rationale**: The existing `message` state drives a generic feedback banner ("+5 pts", "Purchased!") rendered below the creature stage. The speech bubble is visually distinct — it should appear near the creature's head, styled like a comic speech bubble. Mixing the two would require conditional styling logic. Keeping them separate is cleaner and avoids regression risk on existing message flows.

**Alternatives considered**: Reusing `message` state with conditional CSS — rejected because the existing message div is positioned outside the creature stage and has different visual design intent.

### Decision 2 — Message pool location

**Decision**: Define `SPEECH_MESSAGES` as a `const string[]` at the top of `Game.tsx` (module scope, not component scope).

**Rationale**: The pool is static, small (5–8 entries), and only consumed by `Game.tsx`. No need for a separate file or shared model. Keeping it co-located with the only consumer avoids over-engineering.

**Alternatives considered**: Adding messages to `types.ts` or a new `messages.ts` — rejected because it adds indirection for no benefit (no other consumer exists).

### Decision 3 — Bubble duration and reset

**Decision**: Display for 3 seconds (`setTimeout 3000`), mirroring the existing `reacting` state timer pattern. If a new feed fires while a bubble is visible, clear the old timeout and start a fresh 3-second window (replace-on-new-trigger behaviour).

**Rationale**: 3 seconds is long enough for a child to read the message but short enough not to clutter the screen. The replace behaviour (FR-005) matches what kids expect — the new message appears immediately.

**Implementation note**: Use a `useRef` to hold the timeout ID so it can be cleared on new triggers without causing stale-closure issues.

### Decision 4 — CSS speech bubble styling

**Decision**: Rounded white/light bubble with a downward-pointing CSS triangle arrow (`:after` pseudo-element) anchored beneath the bubble pointing toward the creature. `position: absolute; bottom: calc(100% + 8px)` relative to the creature container so it floats above the creature.

**Rationale**: Classic comic-book speech bubble appearance is immediately recognisable to children. Pure CSS — no image assets needed.

**Alternatives considered**: SVG speech bubble — unnecessary complexity for a simple rounded rect + arrow shape.

## Phase 1: Design

### Data Model

See [data-model.md](./data-model.md).

### Implementation Steps

#### Step 1 — Add `SPEECH_MESSAGES` pool to `src/components/Game.tsx`

At module scope (above the component), add:

```ts
const SPEECH_MESSAGES = [
  "Yummy, thank you!",
  "You are crushing your chores!",
  "I was so hungry!",
  "You are a chore master!",
  "I can't wait to see what happens next!",
  "That felt amazing!",
  "You're the best!",
];
```

#### Step 2 — Add `speechBubble` state and timeout ref to `Game`

Inside the `Game` component, alongside existing state:

```ts
const [speechBubble, setSpeechBubble] = useState<string | null>(null);
const speechTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
```

#### Step 3 — Trigger speech bubble from `handleAction`

Inside `handleAction`, after the successful action branch (after `setReacting`):

```ts
// Pick a random message
const msg = SPEECH_MESSAGES[Math.floor(Math.random() * SPEECH_MESSAGES.length)];
// Clear any running timer
if (speechTimerRef.current) clearTimeout(speechTimerRef.current);
setSpeechBubble(msg);
speechTimerRef.current = setTimeout(() => setSpeechBubble(null), 3000);
```

#### Step 4 — Render bubble in the pet view creature stage

Inside the `return` (pet view), inside `.creatureStage`, before `<Creature>`:

```tsx
{speechBubble && (
  <div className={styles.speechBubble}>
    {speechBubble}
  </div>
)}
```

Place it after the habitat background div and before `<Creature>` so z-index layering is natural (bubble renders above habitat, creature renders above bubble via the Creature component's own z-index).

#### Step 5 — Add `.speechBubble` to `src/components/Game.module.css`

```css
.speechBubble {
  position: absolute;
  bottom: calc(100% - 60px);
  left: 50%;
  transform: translateX(-50%);
  background: #fff;
  color: #1a1a2e;
  font-size: 0.85rem;
  font-weight: 600;
  padding: 8px 14px;
  border-radius: 16px;
  white-space: nowrap;
  z-index: 10;
  pointer-events: none;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  animation: bubblePop 0.2s ease-out;
}

.speechBubble::after {
  content: '';
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  border: 6px solid transparent;
  border-top-color: #fff;
}

@keyframes bubblePop {
  from { opacity: 0; transform: translateX(-50%) scale(0.85); }
  to   { opacity: 1; transform: translateX(-50%) scale(1); }
}
```

### Contracts

No external contracts. UI-only change, no data persistence.

## Complexity Tracking

No constitution violations. No complexity table needed.

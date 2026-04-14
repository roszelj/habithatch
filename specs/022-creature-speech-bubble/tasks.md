# Tasks: Creature Speech Bubble

**Input**: Design documents from `/specs/022-creature-speech-bubble/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, quickstart.md

**Organization**: Single user story — all tasks serve US1 (creature speaks when fed).

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to
- Include exact file paths in descriptions

---

## Phase 1: Setup

**Purpose**: No setup required — this feature adds to an existing component. No new dependencies, no new files to scaffold.

*(No setup tasks needed — proceed directly to implementation.)*

---

## Phase 2: Foundational

**Purpose**: No blocking prerequisites — the feature builds entirely on existing Game.tsx state and CSS module patterns.

*(No foundational tasks needed — proceed directly to user story.)*

---

## Phase 3: User Story 1 — Creature Speaks When Fed (Priority: P1) 🎯 MVP

**Goal**: When a child successfully feeds the creature, a speech bubble with a random encouraging message appears near the creature for 3 seconds then disappears.

**Independent Test**: Tap Morning/Afternoon/Evening action button with sufficient points → verify white speech bubble appears above creature with an encouraging message → verify it disappears automatically after ~3 seconds.

### Implementation for User Story 1

- [x] T001 [US1] Add `SPEECH_MESSAGES` constant array (7 messages) and `speechBubble` state (`string | null`) and `speechTimerRef` (`useRef`) to `src/components/Game.tsx`
- [x] T002 [US1] In `handleAction` in `src/components/Game.tsx`, after the successful action branch: pick a random message, clear any existing speech timer, call `setSpeechBubble(msg)`, and set a 3-second timeout to call `setSpeechBubble(null)`
- [x] T003 [US1] In the pet view `return` in `src/components/Game.tsx`, render `{speechBubble && <div className={styles.speechBubble}>{speechBubble}</div>}` inside `.creatureStage` (after the habitatBackground div, before `<Creature>`)
- [x] T004 [P] [US1] Add `.speechBubble` CSS rule (position: absolute, white rounded bubble, centred, z-index: 10, `bubblePop` animation) and `.speechBubble::after` CSS arrow (downward-pointing triangle) and `@keyframes bubblePop` to `src/components/Game.module.css`

**Checkpoint**: All 4 tasks complete → speech bubble appears on feed, replaces on rapid taps, never shows on failed feed, disappears after 3 seconds.

---

## Phase 4: Polish & Validation

- [x] T005 Run `npm run build` and confirm zero TypeScript errors

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 3 (US1)**: No blocking dependencies — can start immediately
- **Phase 4 (Polish)**: Depends on all Phase 3 tasks complete

### Within User Story 1

- T001 must complete before T002 and T003 (they depend on `speechBubble` state and `speechTimerRef` existing)
- T002 must complete before T003 can be meaningfully tested (trigger exists)
- T004 is independent of T001–T003 (different file) — can run in parallel with any of them
- T005 depends on all prior tasks

### Parallel Opportunities

- T004 (CSS) can run in parallel with T001, T002, or T003 (touches a different file)

---

## Parallel Example: User Story 1

```
Start T001 (Game.tsx — add state/const)
In parallel: T004 (Game.module.css — add styles)
After T001: T002 (Game.tsx — trigger in handleAction)
After T002: T003 (Game.tsx — render bubble in JSX)
After all: T005 (build check)
```

---

## Implementation Strategy

### MVP (only story, so full scope = MVP)

1. T001 → T002 → T003 (Game.tsx changes, in order)
2. T004 in parallel with any of the above
3. T005 (build gate)

### Notes

- T001, T002, T003 all touch `src/components/Game.tsx` — run **sequentially** (same file)
- T004 touches `src/components/Game.module.css` only — safe to run in parallel
- The `speechBubble` state is intentionally separate from the existing `message` state (different visual, different position — see research.md Decision 1)
- Do NOT show the bubble in the store view's creature preview — only in the main pet view `return`
- The `speechTimerRef` must be cleared before each new `setSpeechBubble` call to prevent stale `null` resets on rapid taps (see research.md Decision 2)

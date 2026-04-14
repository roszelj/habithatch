# Tasks: Spin Wheel Mini Game

**Input**: Design documents from `/specs/032-spin-wheel-minigame/`
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, quickstart.md

**Tests**: Not requested — manual playtesting per constitution.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Create the wheel segment data model used by all user stories.

- [X] T001 Create wheel segment configuration in src/models/wheelSegments.ts — define WheelSegment type with fields: id, label, type ('coin-prize' | 'kindness-challenge' | 'coin-penalty'), coinAmount (positive for prizes, negative for penalties, 0 for challenges), message (pet's result text), color (CSS color string), weight (probability weight). Export WHEEL_SEGMENTS array with 8 segments: "+5 coins" (green, weight 25), "Be Kind!" (pink, weight 15), "+10 coins" (blue, weight 15), "-5 coins" (red, weight 10), "+3 coins" (teal, weight 25), "Give a Hug!" (purple, weight 15), "+20 coins" (gold, weight 5), "-10 coins" (dark red, weight 5). Export a `pickRandomSegment()` function that does weighted random selection and returns the winning segment.

**Checkpoint**: Wheel data model ready.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Add coin mutation callback plumbing from Game.tsx through PetFullscreen.

- [X] T002 Add `onAwardCoins` prop to PetFullscreen in src/components/PetFullscreen.tsx — accept `onAwardCoins: (amount: number) => void` prop. No UI changes yet, just add the prop to the interface and pass-through.
- [X] T003 Pass coin callback from Game.tsx to PetFullscreen in src/components/Game.tsx — where PetFullscreen is rendered, add an `onAwardCoins` callback that adjusts the coin balance: positive amounts add coins (capped at MAX_COINS), negative amounts deduct coins (floored at 0). Use the existing `setCoins` state setter and trigger `onSaveProfile` / `onUpdateAppData` to persist the change.

**Checkpoint**: Coin mutation plumbing is wired. PetFullscreen can award or deduct coins.

---

## Phase 3: User Story 1 — Pet Invites Child to Play (Priority: P1) MVP

**Goal**: After the greeting bubble, the pet asks "Want to play a game?" with Yes/No buttons. The child can accept or decline.

**Independent Test**: Open fullscreen view. Wait for greeting. Verify game prompt appears after ~3 seconds. Tap "No thanks" — prompt disappears. Reopen and tap "Yes!" — verify wheel phase begins.

### Implementation for User Story 1

- [X] T004 [US1] Add game phase state to PetFullscreen in src/components/PetFullscreen.tsx — replace the single `showBubble` boolean with a `gamePhase` state: 'greeting' | 'prompt' | 'wheel' | 'done'. On mount: start at 'greeting', show greeting bubble after 800ms, transition to 'prompt' after 3 more seconds. In 'prompt' phase, show a second speech bubble "Want to play a game?" with "Yes!" and "No thanks" buttons. "No thanks" transitions to 'done' (hides prompt, shows wandering creature only). "Yes!" transitions to 'wheel'.
- [X] T005 [P] [US1] Style game prompt buttons in src/components/PetFullscreen.module.css — add styles for Yes/No buttons below the speech bubble. "Yes!" button: bright, inviting (green or gold background, bold text, rounded). "No thanks" button: subtle, muted (semi-transparent, smaller text). Both buttons must be at least 44px tall for kid-friendly tap targets.

**Checkpoint**: Game invitation flow works. Child can accept or decline. Declining hides the prompt. Accepting transitions to 'wheel' phase (no wheel UI yet).

---

## Phase 4: User Story 2 — Spin the Prize Wheel (Priority: P2)

**Goal**: Colorful spinning wheel with 8 segments appears. Child taps "Spin!" — wheel spins, decelerates, stops on random segment.

**Independent Test**: Accept game invitation. Verify wheel renders with 8 colored segments. Tap "Spin!" and verify wheel spins smoothly, decelerates, and stops on a segment. Verify the winning segment is visually highlighted.

### Implementation for User Story 2

- [X] T006 [US2] Create SpinWheel component in src/components/SpinWheel.tsx — accept props: `segments: WheelSegment[]`, `onResult: (segment: WheelSegment) => void`, `onClose: () => void`. Render a circular wheel with 8 colored segments arranged as pie slices using CSS conic-gradient or absolutely-positioned triangle segments. Each segment shows its label text. Add a "Spin!" button centered below the wheel. On spin: use `pickRandomSegment()` to determine the winner, calculate the target rotation angle (multiple full rotations + offset to land on winning segment), apply CSS transition with cubic-bezier deceleration easing over 4 seconds. After transition ends, call `onResult` with the winning segment. Disable "Spin!" button while spinning.
- [X] T007 [P] [US2] Create SpinWheel styles in src/components/SpinWheel.module.css — wheel container (circular, centered in viewport), segment rendering (conic-gradient with segment colors), segment labels (positioned radially within each slice, rotated to be readable), pointer/indicator arrow at top of wheel, spin button (large, kid-friendly, gold/bright color, 48px+ height), spinning animation (CSS transition on transform: rotate with cubic-bezier(0.2, 0.8, 0.3, 1) over 4s), disabled state for spin button (dimmed).
- [X] T008 [US2] Integrate SpinWheel into PetFullscreen in src/components/PetFullscreen.tsx — when gamePhase is 'wheel', render SpinWheel component instead of the wandering creature. Import WHEEL_SEGMENTS from src/models/wheelSegments.ts. Pass segments and onResult callback. On result: store the winning segment in state and transition gamePhase to 'result' (a new phase between 'wheel' and 'done').

**Checkpoint**: Wheel spins, decelerates, and stops on a random segment. Winning segment is determined.

---

## Phase 5: User Story 3 — Wheel Outcomes Are Applied (Priority: P3)

**Goal**: After the wheel stops, show the result with the pet's message. Apply coin changes. Child collects and returns to fullscreen view.

**Independent Test**: Spin the wheel. Verify coin prizes increase balance, penalties decrease balance (floor at 0), challenges show message without coin change. Verify "Collect!" dismisses and returns to fullscreen view.

### Implementation for User Story 3

- [X] T009 [US3] Add result display phase to PetFullscreen in src/components/PetFullscreen.tsx — add 'result' to gamePhase union. When in 'result' phase: show the pet with a speech bubble containing the winning segment's message. Show a "Collect!" button. On "Collect!" tap: if coinAmount !== 0, call `onAwardCoins(segment.coinAmount)`. Transition to 'done' phase (back to wandering creature, no game prompt).
- [X] T010 [P] [US3] Style result display in src/components/PetFullscreen.module.css — result speech bubble (larger than greeting, celebratory feel). Different visual treatment per outcome type: coin-prize (green tint, coin emoji), kindness-challenge (warm pink/purple tint, heart emoji), coin-penalty (playful red tint, "oh no" styling). "Collect!" button (large, prominent, gold background, 48px+ height).

**Checkpoint**: All three outcome types work correctly. Coins are awarded/deducted. Challenges show messages. Child can collect and return.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final validation and edge case handling.

- [X] T011 Verify coin floor logic in src/components/Game.tsx — confirm that negative onAwardCoins amounts never result in a coin balance below 0. Test with a balance of 3 coins and a -10 penalty.
- [X] T012 Run all quickstart.md scenarios end-to-end (happy path, decline, kindness challenge, coin penalty, low balance penalty, one-play-per-session, close during spin)
- [X] T013 Verify wheel renders correctly on small viewports (320px wide) — wheel should be sized to fit with margins, no overflow, all labels readable

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately
- **Foundational (Phase 2)**: No dependencies on Phase 1 (different files) — can start in parallel
- **User Story 1 (Phase 3)**: Depends on Phase 2 (needs onAwardCoins prop added to PetFullscreen)
- **User Story 2 (Phase 4)**: Depends on Phase 1 (needs WHEEL_SEGMENTS) and US1 (needs gamePhase state)
- **User Story 3 (Phase 5)**: Depends on US2 (needs wheel result)
- **Polish (Phase 6)**: Depends on all user stories being complete

### User Story Dependencies

- **US1 (P1)**: Depends on Phase 2 — game invitation flow in PetFullscreen
- **US2 (P2)**: Depends on Phase 1 + US1 — wheel component uses segments data and integrates into PetFullscreen's gamePhase
- **US3 (P3)**: Depends on US2 — result display requires the spin outcome

### Within Each User Story

- US1: Game phase state logic (T004) before button styles (T005)
- US2: SpinWheel component (T006) and styles (T007) can be parallel, then integration (T008)
- US3: Result phase logic (T009) and result styles (T010) can be parallel

### Parallel Opportunities

- T001 and T002/T003 can run in parallel (different files)
- T006 and T007 can run in parallel (TSX vs CSS)
- T009 and T010 can run in parallel (TSX vs CSS)

---

## Parallel Example: User Story 2

```bash
# T006 and T007 can run in parallel:
Task T006: "Create SpinWheel component in src/components/SpinWheel.tsx"
Task T007: "Create SpinWheel styles in src/components/SpinWheel.module.css"
# Then T008 (integration) after both complete
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Wheel segments data (T001)
2. Complete Phase 2: Coin callback plumbing (T002-T003)
3. Complete Phase 3: Game invitation flow (T004-T005)
4. **STOP and VALIDATE**: Pet asks "Want to play?" — child can accept or decline

### Incremental Delivery

1. Phase 1 + 2 → Data model + coin plumbing ready
2. User Story 1 → Game invitation flow (MVP!)
3. User Story 2 → Spinning wheel with animation
4. User Story 3 → Outcomes applied (coins, challenges, penalties)
5. Polish → Full validation across scenarios and viewports

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story
- Coin penalties floor at 0 — never negative
- Kindness challenges change no coins — message only
- One play per fullscreen session (ephemeral state resets on reopen)
- Wheel spin uses CSS transition with pre-determined result for visual/logical consistency
- Commit after each task or logical group

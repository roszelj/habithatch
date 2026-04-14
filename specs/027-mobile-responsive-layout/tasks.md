# Tasks: Mobile Responsive Layout

**Input**: Design documents from `/specs/027-mobile-responsive-layout/`
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅

**Tests**: Not requested — this feature is verified visually in DevTools and on-device.

**Organization**: Tasks grouped by user story. All three user stories share the same foundational changes; story phases focus on the specific CSS/HTML work each story requires.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no blocking dependencies)
- **[Story]**: Which user story this task belongs to

---

## Phase 1: Foundational (Blocking Prerequisites)

**Purpose**: HTML and global CSS changes that all three user stories depend on. Must complete before any user story work.

**⚠️ CRITICAL**: No user story implementation can begin until this phase is complete.

- [x] T001 Add `viewport-fit=cover` to the viewport meta tag in `index.html`
- [x] T002 Add `padding-top: env(safe-area-inset-top)` to the `body` rule in `src/index.css`

**Checkpoint**: Foundation ready — the app now extends full-bleed to screen edges and respects the top safe area system-wide.

---

## Phase 2: User Story 1 — Game Fits on Screen Without Scrolling (Priority: P1) 🎯 MVP

**Goal**: All primary game elements (creature, mood, points, health, action buttons, toolbar) are visible on a 19.5:9 iPhone without any vertical scrolling.

**Independent Test**: Open DevTools at 390×844 (iPhone 14 Pro preset). Navigate to the game/pet screen. Confirm all elements from the title through the toolbar are visible with zero scroll.

### Implementation

- [x] T003 [US1] Update `.game` in `src/components/Game.module.css`: `height: 100dvh; overflow: hidden; max-width: 430px; gap: clamp(8px, 1.5dvh, 16px); padding: 12px 16px env(safe-area-inset-bottom, 12px)`
- [x] T004 [US1] Add `.creatureStageGrow` modifier to `src/components/Game.module.css` with `flex: 1; min-height: 0`
- [x] T005 [US1] Add `flex-shrink: 0; flex-wrap: wrap` to `.toolbar` in `src/components/Game.module.css`
- [x] T006 [US1] Apply `.creatureStageGrow` class to creature stage div in pet view return of `src/components/Game.tsx`

**Checkpoint**: Game screen fits entirely on 19.5:9 without scrolling. Creature stage fills available space. Sub-view content is contained.

---

## Phase 3: User Story 2 — Navigation Controls Are Thumb-Reachable (Priority: P2)

**Goal**: The toolbar (Pet / Chores / Store / Parent buttons) is always visible at the bottom of the screen without scrolling, and has proper bottom safe-area padding so it clears the home indicator.

**Independent Test**: On the same 390×844 DevTools viewport, scroll is impossible (fixed height from Phase 2). Confirm the toolbar sits at the very bottom, not cut off by the home indicator. Also test at 430×932 (iPhone 15 Plus).

### Implementation

- [x] T007 [US2] Update `.toolbar` in `src/components/Game.module.css`: `flex-shrink: 0; flex-wrap: wrap` — safe-area bottom handled by `.game` padding

**Checkpoint**: Toolbar is always anchored at the bottom, cleared from the home indicator, and never scrolls off-screen.

---

## Phase 4: User Story 3 — Secondary Screens Scroll Internally (Priority: P3)

**Goal**: When the user switches to Chores, Store, or Parent Panel, the list content scrolls within its own region. The title and toolbar remain fixed; only the list moves.

**Independent Test**: On the 390×844 DevTools viewport, switch to Chores view with several chores added. Scroll within the chore list and confirm the toolbar and any header remain stationary. Repeat for Store (items grid) and Parent Panel.

### Implementation

- [x] T008 [P] [US3] Update `.panel` in `src/components/ChorePanel.module.css`: added `min-height: 0`
- [x] T009 [P] [US3] Update `.store` in `src/components/Store.module.css`: added `flex: 1; min-height: 0; overflow-y: auto`
- [x] T010 [P] [US3] Update `.panel` in `src/components/ParentPanel.module.css`: added `min-height: 0`

**Checkpoint**: All three secondary screens scroll internally. Switching between views and scrolling within them does not affect the outer toolbar or title.

---

## Phase 5: Polish & Validation

**Purpose**: Verify the full feature across representative device sizes.

- [ ] T011 Validate the game screen in Chrome DevTools at three presets: iPhone SE (375×667 — narrowest target), iPhone 15 Pro (393×852 — primary target), iPhone 15 Plus (430×932 — widest target). Confirm FR-001 through FR-007 all pass at each size.
- [ ] T012 Verify no horizontal scroll exists at any viewport width between 320px and 430px by dragging the DevTools width slider across that range
- [ ] T013 [P] Verify safe area insets by enabling "Show device frame" in DevTools and checking that no interactive elements are obscured by the notch or home indicator region
- [x] Build verified clean (tsc + vite build, 0 errors)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Foundational (Phase 1)**: No dependencies — start immediately
- **US1 (Phase 2)**: Requires Phase 1 complete
- **US2 (Phase 3)**: Requires Phase 2 complete (toolbar visibility depends on fixed-height layout)
- **US3 (Phase 4)**: Requires Phase 2 complete (internal scroll depends on `.subView` wrapper from T005/T006)
- **Polish (Phase 5)**: Requires all story phases complete

### User Story Dependencies

- **US1**: Depends on Foundational (T001–T002)
- **US2**: Depends on US1 (T003–T006 establish the fixed layout that makes US2 possible)
- **US3**: Depends on US1 (T005–T006 provide the `.subView` wrapper that US3 panels scroll within)

### Parallel Opportunities

- T001 and T002 can run in parallel (different files)
- T008, T009, T010 can all run in parallel (different files, no inter-dependency)
- T011, T012, T013 validation tasks can run in parallel

---

## Implementation Strategy

### MVP (User Story 1 Only)

1. Complete Phase 1 (T001–T002)
2. Complete Phase 2 (T003–T006)
3. **STOP and validate**: Open DevTools at 393×852, confirm pet view fits without scrolling
4. If passing, proceed to Phase 3

### Incremental Delivery

1. Phase 1 → Phase 2 → Validate US1 → MVP shipped
2. Phase 3 (T007) → Validate toolbar anchoring → US2 done
3. Phase 4 (T008–T010) → Validate internal scroll → US3 done
4. Phase 5 → Full validation → Deploy

---

## Notes

- All changes are CSS Modules + one HTML attribute — zero game logic touched
- `flex: 1; min-height: 0` is the key pattern: `flex: 1` makes an element grow to fill space, `min-height: 0` overrides the default `min-height: auto` that prevents flex children from shrinking below content size
- `dvh` vs `vh`: use `dvh` throughout — it accounts for dynamic browser chrome on non-PWA contexts
- `env(safe-area-inset-bottom, 16px)` — the fallback `16px` ensures padding exists on devices without a home indicator (older iPhones, desktop)
- Test with "Simulate touch events" ON in DevTools to catch any touch-specific layout shifts

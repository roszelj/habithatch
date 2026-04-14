# Tasks: Pet Fullscreen Interactive View

**Input**: Design documents from `/specs/031-pet-fullscreen-view/`
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, quickstart.md

**Tests**: Not requested — manual playtesting per constitution.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: No setup needed — no new dependencies, data models, or migrations. This feature is purely presentational using existing data.

**Checkpoint**: No setup required. Proceed directly to user stories.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Create the new component files that both user stories will build on.

- [X] T001 Create PetFullscreen component shell in src/components/PetFullscreen.tsx — accept props for creatureType, creatureName, childName, habitatId. Render a fixed-position fullscreen overlay (100vw x 100vh) with a close button. Import and display CreatureSprite at large size (200px+). Look up habitat image via getHabitatById from src/models/habitats.ts and render as full background with object-fit cover. Show default dark gradient background when habitatId is null.
- [X] T002 Create PetFullscreen styles in src/components/PetFullscreen.module.css — fullscreen overlay (position fixed, inset 0, z-index above game), habitat background image (full cover, no repeat), creature container (centered/positioned), close button (top-right corner, visible against any background), and idle wandering CSS keyframe animation (multi-waypoint translateX/translateY over 8-12 seconds, infinite loop) applied to the creature container.
- [X] T003 Add click handler to creature area in src/components/Game.tsx — add onClick to the creature stage div (or Creature component wrapper) that sets a new `showFullscreen` boolean state to true. When showFullscreen is true, render PetFullscreen component with profile.creatureType, profile.creatureName, profile.childName, and profile.habitatId. Pass an onClose callback that sets showFullscreen back to false.

**Checkpoint**: Tapping the creature opens a fullscreen view with habitat background and wandering creature. Close button returns to game. No speech bubble yet.

---

## Phase 3: User Story 1 — Kid Opens Fullscreen Pet View (Priority: P1) MVP

**Goal**: Child taps creature to open fullscreen view with habitat background and idle wandering animation.

**Independent Test**: Tap creature on game screen. Verify fullscreen opens with habitat background, creature visible and wandering, close button works.

### Implementation for User Story 1

- [X] T004 [US1] Polish wandering animation in src/components/PetFullscreen.module.css — ensure the creature's idle drift covers a natural-feeling area (not just horizontal or vertical). Use a keyframe with at least 6-8 waypoints combining both X and Y translations. Animation duration 8-12 seconds, ease-in-out, infinite. Creature should stay within visible bounds (not drift off-screen).
- [X] T005 [US1] Handle no-habitat fallback in src/components/PetFullscreen.tsx — when habitatId is null or getHabitatById returns undefined, render a gradient background (e.g., dark blue to purple, matching the app's dark theme). Verify no broken image tag is shown.
- [X] T006 [US1] Style close button in src/components/PetFullscreen.module.css — semi-transparent rounded button in top-right corner with a back arrow or X icon. Must be visible against both light and dark habitat backgrounds (use backdrop or shadow). Large enough tap target for kids (at least 44x44px).

**Checkpoint**: Fullscreen view is fully functional with habitat background, wandering animation, default fallback, and close button. MVP complete — can be playtested.

---

## Phase 4: User Story 2 — Pet Greets Child by Name Based on Time of Day (Priority: P2)

**Goal**: Speech bubble appears with time-of-day greeting using the child's name.

**Independent Test**: Open fullscreen view at different times of day. Verify correct greeting text with correct name.

### Implementation for User Story 2

- [X] T007 [US2] Add time-of-day greeting logic to src/components/PetFullscreen.tsx — compute greeting on mount using `new Date().getHours()`: hours 5-11 = "Good Morning", hours 12-16 = "Good Afternoon", hours 17-23 or 0-4 = "Good Evening". Build greeting string as `"[greeting], [name]!"` where name = childName || creatureName.
- [X] T008 [US2] Add speech bubble UI to src/components/PetFullscreen.tsx — render a speech bubble element near the creature displaying the greeting text. Bubble should appear with a pop-in animation after a short delay (0.5-1 second) so the view loads first, then the creature "speaks."
- [X] T009 [P] [US2] Style speech bubble in src/components/PetFullscreen.module.css — white/light background, rounded corners (16px), tail/pointer pointing toward creature, pop-in animation (scale from 0 to 1 with slight overshoot). Text should be bold, dark color, 1rem+ font size. Bubble must accommodate names up to 20 characters without overflow.

**Checkpoint**: Fullscreen view shows personalized time-of-day greeting in speech bubble. Feature complete.

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Final validation and edge case handling.

- [X] T010 Run all quickstart.md scenarios end-to-end (open with habitat, open without habitat, correct name usage, time-of-day greetings, wandering animation, rapid open/close)
- [X] T011 Verify fullscreen view renders correctly on small viewports (320px wide) and large viewports (430px wide) — no overflow, no scrolling, creature and bubble stay within bounds

---

## Dependencies & Execution Order

### Phase Dependencies

- **Foundational (Phase 2)**: No dependencies — start immediately. Creates the component files and Game.tsx wiring.
- **User Story 1 (Phase 3)**: Depends on Phase 2 (component must exist to polish)
- **User Story 2 (Phase 4)**: Depends on Phase 2 (component must exist to add speech bubble). Can run in parallel with US1.
- **Polish (Phase 5)**: Depends on both user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Depends on Phase 2 only — animation and visual polish
- **User Story 2 (P2)**: Depends on Phase 2 only — greeting logic and speech bubble. Independent of US1.

### Within Each User Story

- US1: CSS animation polish (T004) → fallback handling (T005) → close button polish (T006)
- US2: Greeting logic (T007) → speech bubble UI (T008), speech bubble CSS (T009 can parallel with T008)

### Parallel Opportunities

- T004, T005, T006 (US1 polish tasks) are somewhat sequential (same files) but T004 is CSS-only
- T008 and T009 (US2 bubble UI + CSS) can run in parallel (different files)
- US1 and US2 can run in parallel after Phase 2

---

## Parallel Example: User Story 2

```bash
# After T007 (greeting logic) is complete:
Task T008: "Add speech bubble UI to src/components/PetFullscreen.tsx"
Task T009: "Style speech bubble in src/components/PetFullscreen.module.css"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 2: Create component + wire Game.tsx (T001–T003)
2. Complete Phase 3: Polish animation + fallback + close button (T004–T006)
3. **STOP and VALIDATE**: Tap creature → fullscreen opens with habitat + wandering creature
4. Deploy if ready — kids can already enjoy the immersive pet view

### Incremental Delivery

1. Phase 2 → Component exists, basic fullscreen works
2. User Story 1 → Polished animation + fallback (MVP!)
3. User Story 2 → Personalized greeting in speech bubble
4. Polish → Full validation across viewports

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story
- No new data persistence — purely presentational feature
- Reuses existing CreatureSprite, habitat data, and speech bubble CSS patterns
- Commit after each task or logical group

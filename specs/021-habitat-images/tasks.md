# Tasks: Update Habitat Images

**Input**: Design documents from `/specs/021-habitat-images/`
**Prerequisites**: plan.md, spec.md, data-model.md, quickstart.md

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Data model change that unblocks all rendering work

- [x] T001 Update `Habitat` interface in `src/models/types.ts` — replace `emoji: string` with `image: string`
- [x] T002 Rewrite `src/models/habitats.ts` — replace 7 emoji entries with 9 image-based entries (water-park, beach, cosy-bedroom, waterfall-forest, candy-village, magic-forest-pond, sunny-farm, snowy-cabin, fairytale-castle)

**Checkpoint**: Data model and catalog ready — all rendering tasks can now begin

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Migration logic that must exist before profile loading is tested

**⚠️ CRITICAL**: Migration must be in place before any profile-load testing

- [x] T003 Add `VALID_HABITAT_IDS` set and filter logic to `src/hooks/useSaveData.ts` — reset `profile.habitatId` to null and filter `profile.ownedHabitats` when IDs are not in the valid set

**Checkpoint**: Migration ready — old profiles load cleanly; user story work can begin

---

## Phase 3: User Story 1 — Store Shows Illustrated Habitat Images (Priority: P1) 🎯 MVP

**Goal**: Replace emoji spans in the Store habitat section with `<img>` elements showing the illustrated PNG

**Independent Test**: Open store → Habitats tab → verify 9 illustrated cards (no emoji text)

### Implementation for User Story 1

- [x] T004 [US1] Replace habitat emoji span with `<img className={styles.habitatCardImage}>` in `src/components/Store.tsx`
- [x] T005 [P] [US1] Add `.habitatCardImage` rule (`width: 100%; aspect-ratio: 16/9; object-fit: cover; border-radius: 6px`) to `src/components/Store.module.css`

**Checkpoint**: Store habitat cards show illustrated images. Lock indicator and price remain visible alongside the image.

---

## Phase 4: User Story 2 — Game Screen Shows Active Habitat as Background (Priority: P2)

**Goal**: Replace emoji text inside `.habitatBackground` with a full-bleed `<img>` at 25% opacity

**Independent Test**: Equip any habitat → game screen shows illustrated backdrop

### Implementation for User Story 2

- [x] T006 [US2] Replace `{activeHabitat.emoji}` with `<img>` inside `.habitatBackground` in `src/components/Game.tsx` (both pet view and store view renderings)
- [x] T007 [P] [US2] Remove `font-size: 7rem` from `.habitatBackground` in `src/components/Game.module.css` (keep `opacity: 0.25` and layout rules)

**Checkpoint**: Game screen backdrop shows illustrated habitat image. No-habitat case shows no broken image.

---

## Phase 5: Polish & Validation

**Purpose**: Build verification and final review

- [x] T008 Run `npm run build` and confirm zero TypeScript errors

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies — start immediately
- **Phase 2 (Foundational)**: Depends on Phase 1 (needs updated `HabitatId` type)
- **Phase 3 (US1)**: Depends on Phase 1 — can start immediately after T001/T002
- **Phase 4 (US2)**: Depends on Phase 1 — can start immediately after T001/T002; T006/T007 independent of T004/T005
- **Phase 5 (Polish)**: Depends on all prior phases complete

### User Story Dependencies

- **US1 and US2** are independent of each other — both only depend on the Phase 1 data model/catalog changes
- T004 and T006 touch different files (Store.tsx vs Game.tsx) — can run in parallel

### Parallel Opportunities

- T004 + T006 can run in parallel (different component files)
- T005 + T007 can run in parallel (different CSS module files)
- T005 can run alongside T004 (same feature, different file)
- T007 can run alongside T006 (same feature, different file)

---

## Parallel Example: All implementation tasks

```
After T001 + T002 complete:
  Parallel group A: T003 (migration), T004 (Store.tsx), T005 (Store.module.css)
  Parallel group B: T006 (Game.tsx), T007 (Game.module.css)
  (T003, A, B can all run simultaneously — all touch different files)
Then: T008 (build check)
```

---

## Implementation Strategy

### MVP First (User Story 1 — Store Cards)

1. Complete Phase 1: T001, T002
2. Complete Phase 3: T004, T005
3. **VALIDATE**: Open store, verify 9 illustrated habitat cards
4. Add Phase 2 + Phase 4 for full game screen backdrop

### Full Delivery (Sequential)

1. T001 → T002 (data model + catalog)
2. T003 (migration)
3. T004 + T005 (Store — US1)
4. T006 + T007 (Game — US2)
5. T008 (build gate)

---

## Notes

- [P] tasks touch different files — no conflicts
- T001 changes the `Habitat` interface; all other tasks depend on this completing first
- `beach` habitat ID is preserved from old catalog — no special migration code needed
- `.cardEmoji` class in Store.module.css is still used by outfits/accessories — do NOT remove it
- Keep `opacity: 0.25` on `.habitatBackground` — only remove `font-size: 7rem`

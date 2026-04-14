# Tasks: Creature Habitats

**Input**: Design documents from `/specs/017-creature-habitats/`
**Prerequisites**: plan.md (required), spec.md (required), data-model.md, research.md, quickstart.md

**Tests**: No automated tests — manual testing only per spec.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

---

## Phase 1: Setup

_(No project setup needed — feature extends existing app)_

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Types and catalog that ALL user stories depend on. Must complete before any story work.

- [x] T001 [P] Add `HabitatId` type alias and `Habitat` interface to `src/models/types.ts`
- [x] T002 [P] Extend `ChildProfile` interface with `habitatId: HabitatId | null` and `ownedHabitats: HabitatId[]` in `src/models/types.ts`
- [x] T003 Create `src/models/habitats.ts` with `HABITATS` catalog (7 entries) and `getHabitatById` helper
- [x] T004 Add `habitatId: null` and `ownedHabitats: []` defaults to existing profile migration/defaults in `src/hooks/useSaveData.ts` and `src/App.tsx`

**Checkpoint**: Types compile, catalog exists — user story work can begin

---

## Phase 3: User Story 1 — Browse & Buy a Habitat (Priority: P1) 🎯 MVP

**Goal**: Child opens the store, sees the Habitats section, and purchases a habitat with coins.

**Independent Test**: Open store with 20+ coins. Navigate to Habitats. Buy "Bedroom". Verify coins deducted, habitat auto-equips, and game screen background changes.

### Implementation for User Story 1

- [x] T005 [US1] Add `habitatId` and `ownedHabitats` state to `src/components/Game.tsx` (initialize from `profile.habitatId ?? null` and `profile.ownedHabitats ?? []`)
- [x] T006 [US1] Extend `handleBuyItem` in `src/components/Game.tsx` with `type: 'habitat'` branch (deduct coins, add to `ownedHabitats`, auto-set `habitatId`)
- [x] T007 [US1] Include `habitatId` and `ownedHabitats` in `buildProfile()` return value and its `useCallback` deps in `src/components/Game.tsx`
- [x] T008 [US1] Pass `habitatId`, `ownedHabitats`, and `onBuyItem` props to `<Store>` in `src/components/Game.tsx`
- [x] T009 [US1] Add Habitats section to `src/components/Store.tsx` (section heading, None button, card grid mirroring Outfits section — buy/equip/remove states)

**Checkpoint**: Habitats tab visible in store; purchasing deducts coins and sets active habitat; persists on save

---

## Phase 4: User Story 2 — Equip Habitat and See Background (Priority: P1)

**Goal**: Active habitat renders as background behind the creature on the game screen.

**Independent Test**: After equipping a habitat (e.g., Space), navigate to the game screen. Confirm habitat emoji/visual fills the background and creature is visible in foreground.

### Implementation for User Story 2

- [x] T010 [US2] Add `.habitatBackground` CSS rule to `src/components/Game.module.css` (`position: absolute; inset: 0; z-index: 0; display: flex; align-items: center; justify-content: center; font-size: 6rem; opacity: 0.35; overflow: hidden; pointer-events: none`)
- [x] T011 [US2] Import `getHabitatById` from `../models/habitats` in `src/components/Game.tsx`
- [x] T012 [US2] Render habitat background div in `src/components/Game.tsx` inside the `.game` container, before the creature: `{habitat && <div className={styles.habitatBackground}>{habitat.emoji}</div>}`
- [x] T013 [US2] Confirm `.game` container in `src/components/Game.module.css` has `position: relative` (already present — verified)

**Checkpoint**: Game screen shows habitat background behind creature for all 7 habitats; default background shows when none equipped

---

## Phase 5: User Story 3 — Switch Between Owned Habitats (Priority: P2)

**Goal**: Child can re-equip any owned habitat or remove the active one from the store view.

**Independent Test**: Own 2+ habitats. From the store, equip one then the other. Verify game screen updates each time. Equip "None" — verify background clears.

### Implementation for User Story 3

- [x] T014 [US3] Verify Store.tsx Habitats section has working Equip/Remove/None buttons (should already work from T009 — manual test covers this)
- [x] T015 [US3] Add `setHabitatId` callback prop to `Store` component signature in `src/components/Store.tsx` to allow equip/unequip without purchase

**Checkpoint**: Switching between owned habitats and removing active habitat all work from the store

---

## Phase 6: Creature View Redesign

- [x] T016 [P] Confirm `habitatId` and `ownedHabitats` are included in Firestore cloud profile writes in `src/firebase/profiles.ts` (verified — `setDoc` writes full `ChildProfile` object, new fields auto-included)
- [x] T020 [P] Add `.creatureStage`, `.equipmentRow`, `.equipBox`, `.equipBoxEmoji`, `.equipBoxLabel` CSS rules to `src/components/Game.module.css`; scope `.habitatBackground` to fill stage instead of full game container
- [x] T021 Import `getOutfitById` and `getAccessoryById` from `../models/outfits` in `src/components/Game.tsx`
- [x] T022 Wrap `<Creature>` in `.creatureStage` div with habitat background inside it in main pet view in `src/components/Game.tsx`
- [x] T023 Add `.equipmentRow` with two `.equipBox` buttons (Outfits, Accessories) below the creature stage in main pet view — tapping opens store
- [x] T024 Apply same `.creatureStage` restructuring to the store view in `src/components/Game.tsx`

---

## Phase 7: Polish & Manual Testing

- [ ] T025 Manual test: buy all 7 habitats, verify each background fills the creature stage and creature remains clearly visible
- [ ] T026 Manual test: close and reopen app, verify equipped habitat persists correctly
- [ ] T027 Manual test: verify on iPhone 15 Pro (393px) — creature stage and equipment row fit without horizontal overflow
- [ ] T028 Manual test: equipment boxes show correct emoji for equipped outfit/accessory; tap each to confirm store opens

---

## Dependencies & Execution Order

### Phase Dependencies

- **Foundational (Phase 2)**: Start immediately — blocks all story phases
- **US1 (Phase 3)**: Requires Phase 2 complete
- **US2 (Phase 4)**: Requires Phase 2 complete — can run in parallel with US1
- **US3 (Phase 5)**: Requires US1 (Phase 3) complete (needs store section to exist)
- **Polish (Phase 6)**: Requires all story phases complete

### Parallel Opportunities

```
Phase 2: T001 + T002 can run in parallel (same file but different interface blocks — sequence if editor conflicts)
Phase 2: T003 + T004 can run in parallel (different files)
Phase 3 + Phase 4: Can run in parallel after Phase 2 (different concerns: store vs. game screen)
```

---

## Implementation Strategy

### MVP (US1 + US2 — Phases 2–4)

1. Complete Phase 2 (types + catalog)
2. Complete Phase 3 (store purchase flow)
3. Complete Phase 4 (background render)
4. **Validate**: Buy a habitat, see it on game screen, reopen app and verify it persists

### Full Feature (add Phase 5)

5. Complete Phase 5 (equip/switch/remove from store)
6. Complete Phase 6 (cloud persistence + manual regression)

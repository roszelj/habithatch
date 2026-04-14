# Tasks: Change Creature

**Input**: Design documents from `/specs/024-change-creature/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, quickstart.md

**Organization**: Two user stories — US1 (change creature type) is the MVP; US2 (rename at same time) extends it in the same flow.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to
- Include exact file paths in descriptions

---

## Phase 1: Setup

No new dependencies or project structure changes required — feature adds new components within the existing `src/components/` directory.

---

## Phase 2: Foundational

No blocking prerequisites — US1 and US2 share the same new component and Game.tsx changes; all work is sequential within one story group.

---

## Phase 3: User Story 1 — Kid Changes Creature Type (Priority: P1) 🎯 MVP

**Goal**: Kid taps "Change Creature" in the pet view, selects any creature type from a grid (current one highlighted), confirms, and the pet view immediately shows the new creature — with all progress preserved.

**Independent Test**: Open game as a kid → tap "Change Creature" → pick a different creature → tap Confirm → verify pet view shows new creature sprite, name unchanged, coins/points/chores unaffected, and the change persists after navigating away and back.

### Implementation for User Story 1

- [x] T001 [US1] Add `creatureType` and `creatureName` as local `useState` in `src/components/Game.tsx`, initialized from `profile.creatureType` and `profile.creatureName`; update `buildProfile` to spread `creatureType` and `creatureName` after `...profileRef.current` so they override the prop; add both to `buildProfile`'s `useCallback` deps and the auto-save effect deps
- [x] T002 [US1] Replace `state.creatureType` → `creatureType` and `state.name` → `creatureName` everywhere they are passed as props to `Creature` or `CreatureSprite` in `src/components/Game.tsx`
- [x] T003 [P] [US1] Create `src/components/ChangeCreatureScreen.tsx` — accepts props `currentType: CreatureType`, `currentName: string`, `onConfirm: (type: CreatureType, name: string) => void`, `onCancel: () => void`; internal state: `selectedType` (init from `currentType`) and `name` (init from `currentName`); renders a title ("Change Creature"), a scrollable grid of all 18 creature types using `ALL_CREATURE_TYPES` + `CreatureSprite` (80px) + `CREATURE_LABELS`, highlights `selectedType` with an active style; a name input pre-filled with `currentName`, max 20 chars; Cancel and Confirm buttons — Confirm disabled when `name.trim().length === 0`
- [x] T004 [P] [US1] Create `src/components/ChangeCreatureScreen.module.css` — styles for the screen (`.screen`, `.title`, `.grid`, `.card`, `.cardActive`, `.cardSprite`, `.cardLabel`, `.nameRow`, `.nameInput`, `.actions`, `.cancelBtn`, `.confirmBtn`)
- [x] T005 [US1] Add `'change-creature'` to the view union in `src/components/Game.tsx`; add a `handleCreatureChange` callback that calls `setCreatureType(type)`, `setCreatureName(name)`, `setView('pet')`; add a "Change Creature" button in the pet view toolbar; add the `view === 'change-creature'` branch rendering `<ChangeCreatureScreen currentType={creatureType} currentName={creatureName} onConfirm={handleCreatureChange} onCancel={() => setView('pet')} />`

**Checkpoint**: All 5 tasks complete → "Change Creature" button visible in pet view → picker opens with all 18 creatures → selecting and confirming updates the sprite immediately → stats/coins/chores unchanged → change persists on reload → build passes.

---

## Phase 4: User Story 2 — Kid Also Changes Creature Name (Priority: P2)

**Goal**: The same ChangeCreatureScreen flow (US1) also lets the kid rename their creature. The name field is pre-filled with the current name and can be edited before confirming.

**Independent Test**: Open the creature picker → change the name to "Mango" → confirm → verify "Mango" appears in the pet view title and in the parent panel; also verify that leaving the name unchanged still works.

### Implementation for User Story 2

US2 is fully delivered by T003 (US1) — the `ChangeCreatureScreen` component already includes the name field and `onConfirm` passes both `type` and `name`. The `handleCreatureChange` callback in T005 already calls `setCreatureName(name)`.

- [x] T006 [US2] Verify end-to-end in `src/components/Game.tsx` that `creatureName` (the local state from T001) is passed as the `name` prop to the `Creature` component and reflected in any other places the creature name is displayed (e.g., stat bar title in the pet view); confirm no places still read `state.name` or `profile.creatureName` for display

**Checkpoint**: Name change works end-to-end — new name shown in pet view, parent panel, and persists across sessions.

---

## Phase 5: Polish & Validation

- [x] T007 Run `npm run build` and confirm zero TypeScript errors

---

## Dependencies & Execution Order

### Within User Story 1

- T001 must complete before T002 (state must exist before replacing references)
- T001 must complete before T005 (callback depends on setCreatureType/setCreatureName)
- T003 and T004 are independent of T001/T002 (different files) — can run in parallel with any of them
- T005 depends on T001, T002, T003 (wires everything together in Game.tsx)

### Within User Story 2

- T006 depends on T001 and T005 (requires creatureName state and handleCreatureChange to be in place)

### Parallel Opportunities

- T003 (new component) and T004 (new CSS) can both run in parallel with T001 and T002
- T003 and T004 can also run in parallel with each other

---

## Parallel Example: User Story 1

```
Start T001 (Game.tsx — add creatureType/creatureName state)
In parallel: T003 (ChangeCreatureScreen.tsx — new component)
In parallel: T004 (ChangeCreatureScreen.module.css — new styles)
After T001: T002 (Game.tsx — replace state.creatureType/state.name refs)
After T001 + T002 + T003: T005 (Game.tsx — wire view, button, callback)
```

---

## Implementation Strategy

### MVP First (User Story 1)

1. T001 → T002 → T005 (Game.tsx changes, sequential)
2. T003 + T004 in parallel (new component + CSS)
3. T005 wires it all together
4. T007 (build gate)

### Full Feature (Both Stories)

US2 is essentially free — `ChangeCreatureScreen` already has the name field, and `handleCreatureChange` already receives the name. T006 is just a verification pass to ensure `creatureName` is displayed everywhere.

---

## Notes

- T001, T002, T005 all touch `src/components/Game.tsx` — run **sequentially**
- T003 touches `src/components/ChangeCreatureScreen.tsx` only — safe to parallelize
- T004 touches `src/components/ChangeCreatureScreen.module.css` only — safe to parallelize
- T006 touches `src/components/Game.tsx` — run after T005
- The name input in `ChangeCreatureScreen` uses the same 20-char limit as `NamingStep` (`MAX_NAME_LENGTH = 20`)
- `ALL_CREATURE_TYPES`, `CREATURE_LABELS`, `CreatureSprite` are already exported and ready to use
- The `currentType` highlight uses a CSS class toggle (`.cardActive`) on the grid item matching `selectedType`

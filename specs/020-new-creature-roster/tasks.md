# Tasks: New Creature Roster

**Input**: Design documents from `/specs/020-new-creature-roster/`
**Prerequisites**: plan.md ✅ spec.md ✅ research.md ✅ data-model.md ✅ quickstart.md ✅

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to
- No test tasks — not requested in the spec

---

## Phase 1: Setup (Assets & Foundation Data)

**Purpose**: Copy PNG assets to public/ and update the core data model. Every user story depends on both.

- [x] T001 Copy `creature-charactors/creature-happy-pack1.png` to `public/creature-charactors/creature-happy-pack1.png` (create the directory if it doesn't exist)
- [x] T002 [P] Copy `creature-charactors/creature-happy-pack2.png` to `public/creature-charactors/creature-happy-pack2.png`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Update `src/models/types.ts` with the new 18-creature type system, and create the shared `CreatureSprite` component. All user story components depend on both.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [x] T003 In `src/models/types.ts`, add the `CreatureSpritePosition` interface: `{ pack: 1 | 2; col: 0 | 1 | 2; row: 0 | 1 | 2 }` and replace the `CreatureType` union type with all 18 new types: `'corgi' | 'samoyed' | 'husky' | 'panda' | 'chick' | 'bunny' | 'calico' | 'tiger' | 'monkey' | 'sloth' | 'dragon' | 'snake' | 'gecko' | 'cockatoo' | 'fish' | 'giraffe' | 'elephant' | 'leopard'`
- [x] T004 In `src/models/types.ts`, replace `CREATURE_SPRITES` (currently `Record<CreatureType, Record<Mood, string>>` emoji strings) with `Record<CreatureType, CreatureSpritePosition>`. Map all 18 creatures to their pack/col/row position. **⚠️ VERIFY each position against the actual PNG by running the app after T009 completes and checking each creature renders correctly.** Initial mapping per research.md: Pack 1 — corgi(0,0), samoyed(1,0), husky(2,0), panda(0,1), chick(1,1), bunny(2,1), calico(0,2), tiger(1,2), monkey(2,2). Pack 2 — sloth(0,0), dragon(1,0), snake(2,0), gecko(0,1), cockatoo(1,1), fish(2,1), giraffe(0,2), elephant(1,2), leopard(2,2).
- [x] T005 In `src/models/types.ts`, update `CREATURE_LABELS` to include all 18 new creature types with their display names: corgi→'Corgi', samoyed→'Samoyed', husky→'Husky', panda→'Panda', chick→'Chick', bunny→'Bunny', calico→'Calico', tiger→'Tiger', monkey→'Monkey', sloth→'Sloth', dragon→'Dragon', snake→'Snake', gecko→'Gecko', cockatoo→'Cockatoo', fish→'Goldfish', giraffe→'Giraffe', elephant→'Elephant', leopard→'Leopard'
- [x] T006 In `src/models/types.ts`, update `DEFAULT_NAMES` to include all 18 new creature types with fun kid-friendly default names (e.g., corgi→'Biscuit', samoyed→'Cloud', husky→'Blizzard', panda→'Dumpling', chick→'Peep', bunny→'Cotton', calico→'Patches', tiger→'Stripes', monkey→'Bongo', sloth→'Mochi', dragon→'Ember', snake→'Noodle', gecko→'Zigzag', cockatoo→'Sunny', fish→'Bubbles', giraffe→'Patches', elephant→'Peanut', leopard→'Dot')
- [x] T007 In `src/models/types.ts`, update `ALL_CREATURE_TYPES` array to list all 18 new type strings in order (Pack 1 first, Pack 2 second). Remove the old 4-item array.
- [x] T008 Create `src/components/CreatureSprite.tsx` — a new component that accepts `{ creatureType: CreatureType; size: number }` props. It reads `CREATURE_SPRITES[creatureType]` to get `{ pack, col, row }`, builds the PNG URL (`/creature-charactors/creature-happy-pack1.png` or `pack2`), and renders a `<div>` with inline styles: `width: size, height: size, backgroundImage: url(…), backgroundSize: '300% 300%', backgroundPosition: \`${col * 50}% ${row * 50}%\`, backgroundRepeat: 'no-repeat'`. No CSS module needed — all styling is inline for the sprite positioning.

**Checkpoint**: TypeScript compiles (`npm run build`). The `CreatureSprite` component exists and `types.ts` exports the 18 new types.

---

## Phase 3: User Story 1 — Kid Picks a New Creature When Starting (Priority: P1) 🎯 MVP

**Goal**: The creature selection screen displays all 18 illustrated creatures as selectable options.

**Independent Test**: Open the creature selection screen → verify 18 cards each showing an illustrated creature image with a name label → tap any to advance to naming.

### Implementation for User Story 1

- [x] T009 [US1] In `src/components/SelectionScreen.tsx`, replace `<span className={styles.cardSprite}>{CREATURE_SPRITES[type].happy}</span>` with `<CreatureSprite creatureType={type} size={80} />`. Import `CreatureSprite` from `./CreatureSprite`. Remove `CREATURE_SPRITES` from the import list (keep `ALL_CREATURE_TYPES`, `CREATURE_LABELS`, `CreatureType`).
- [x] T010 [US1] In `src/components/SelectionScreen.module.css`, update `.cardSprite` — remove `font-size: 4rem; line-height: 1` and replace with `width: 80px; height: 80px; display: flex; align-items: center; justify-content: center;` (or simply remove font-size since the sprite div handles sizing). Ensure the card layout still looks correct with an image instead of text.

**Checkpoint**: User Story 1 testable. Selection screen shows 18 illustrated creature images. TypeScript builds clean.

---

## Phase 4: User Story 2 — Creature Appears Correctly in the Game (Priority: P2)

**Goal**: After selecting a creature, its illustrated image appears in the main game screen and responds to mood/health animations.

**Independent Test**: Select any creature → name it → enter the game → verify illustrated image appears at appropriate size → bounce animation plays on tap → wobble animation plays at low health.

### Implementation for User Story 2

- [x] T011 [US2] In `src/components/Creature.tsx`, replace `const bodyEmoji = CREATURE_SPRITES[creatureType].happy` and `<div className={styles.bodyEmoji}>{bodyEmoji}</div>` with `<CreatureSprite creatureType={creatureType} size={160} />`. Import `CreatureSprite` from `./CreatureSprite`. Remove `CREATURE_SPRITES` from the import list.
- [x] T012 [US2] In `src/components/Creature.module.css`, update `.bodyEmoji` — remove `font-size: 8rem; line-height: 1`. Add or update the class to position the sprite div correctly within the 200×200px `.body` container. Update bounce animation selector from `.creature.bounce .bodyEmoji` to target the sprite div (or wrap `<CreatureSprite>` in a div with the `bodyEmoji` class to keep the existing animation selectors working).

**Checkpoint**: User Story 2 testable. Creature image displays in the game, bounce and wobble animations still work.

---

## Phase 5: User Story 3 — Profile Picker Shows Correct Creature (Priority: P3)

**Goal**: Profile picker cards show the correct illustrated creature image for each profile.

**Independent Test**: Create 2 profiles with different creatures → return to "Who's playing?" → verify each card shows the correct creature image.

### Implementation for User Story 3

- [x] T013 [US3] In `src/components/ProfilePicker.tsx`, replace `<span className={styles.cardSprite}>{CREATURE_SPRITES[p.creatureType].happy}</span>` with `<CreatureSprite creatureType={p.creatureType} size={70} />`. Import `CreatureSprite` from `./CreatureSprite`. Remove `CREATURE_SPRITES` from the import list.
- [x] T014 [US3] In `src/components/ProfilePicker.module.css`, update `.cardSprite` — remove `font-size: 3rem` and replace with `width: 70px; height: 70px;` to accommodate the image div.
- [x] T015 [P] [US3] In `src/components/NamingStep.tsx`, replace `<div className={styles.sprite}>{CREATURE_SPRITES[creatureType].happy}</div>` with `<CreatureSprite creatureType={creatureType} size={120} />`. Import `CreatureSprite`. Remove `CREATURE_SPRITES` from the import list (keep `CREATURE_LABELS`, `DEFAULT_NAMES`, `CreatureType`).
- [x] T016 [P] [US3] In `src/components/NamingStep.module.css`, update the `.sprite` class — remove any font-size emoji sizing and add `width: 120px; height: 120px;` to accommodate the image.

**Checkpoint**: User Story 3 testable. Profile picker cards and naming step both show correct illustrated creatures.

---

## Phase 6: Migration — Existing Profiles (Cross-cutting)

**Purpose**: Ensure existing profiles using old creature types (bird, turtle, cat, dog) continue to work with valid new creature types. Applies to both cloud and local profiles.

- [x] T017 In `src/firebase/migration.ts`, add a `LEGACY_CREATURE_MAP` constant (`{ bird: 'chick', turtle: 'gecko', cat: 'calico', dog: 'corgi' }`) and a `migrateCreatureType(type: string): CreatureType` function that returns the mapped type or the input unchanged (for already-new types). Export this function.
- [x] T018 In `src/hooks/useSaveData.ts`, import `migrateCreatureType` from `../firebase/migration`. In the `loadAppData()` function (where local profiles are read from localStorage), apply `profile.creatureType = migrateCreatureType(profile.creatureType)` to each profile before returning. This handles guest/local mode migration transparently.

**Checkpoint**: Existing local profiles with old creature types (bird/turtle/cat/dog) are automatically remapped on load. No profile shows a broken or empty creature.

---

## Phase 7: Polish & Cross-Cutting Concerns

- [x] T019 Run `npm run build` and confirm TypeScript compiles with zero errors. Fix any remaining type errors (e.g., any reference to the old `CreatureType` values `'bird'|'turtle'|'cat'|'dog'` in non-migrated locations).
- [ ] T020 [P] Visually verify all 18 sprite positions in the running app by opening the selection screen. If any creature shows the wrong animal (col/row mismatch), correct the `col`/`row` values for that creature in `CREATURE_SPRITES` in `src/models/types.ts`.
- [ ] T021 [P] Follow quickstart.md test scenarios in `specs/020-new-creature-roster/quickstart.md` to validate all 6 test flows end-to-end.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies — T001/T002 can run in parallel immediately
- **Phase 2 (Foundational)**: Depends on Phase 1 (PNGs in public/ needed to test sprites). T003–T007 are sequential (same file). T008 depends on T003 (needs `CreatureType` and `CreatureSpritePosition` to exist).
- **Phase 3 (US1)**: Depends on Phase 2 (needs `CreatureSprite` component and updated types)
- **Phase 4 (US2)**: Depends on Phase 2 (needs `CreatureSprite`). Independent of US1.
- **Phase 5 (US3)**: Depends on Phase 2 (needs `CreatureSprite`). T013/T014 and T015/T016 can run in parallel.
- **Phase 6 (Migration)**: Depends on Phase 2 (needs new `CreatureType` values). T017 before T018.
- **Phase 7 (Polish)**: Depends on all prior phases

### Within Phase 2 (Sequential)

T003 → T004 → T005 → T006 → T007 → T008 (all modify/depend on types.ts, then T008 uses it)

### Parallel Opportunities

- T001 and T002 (Phase 1): different files, run in parallel
- T009 and T011 and T013 and T015 (component updates): different files, can run in parallel once Phase 2 is done
- T010, T012, T014, T016 (CSS updates): different files, can run in parallel
- T019, T020, T021 (Polish): T019 first, then T020/T021 in parallel

---

## Implementation Strategy

### MVP First (User Story 1 — Selection Screen)

1. Complete Phase 1 (T001–T002): Copy assets
2. Complete Phase 2 (T003–T008): Update types + create `CreatureSprite`
3. Complete Phase 3 (T009–T010): Update SelectionScreen
4. **STOP and VALIDATE**: All 18 creatures appear on selection screen
5. Verify sprite positions (T020)

### Incremental Delivery

1. Setup + Foundational → selection screen works (MVP)
2. US2 (T011–T012) → creature appears in game
3. US3 (T013–T016) → profile picker + naming step updated
4. Migration (T017–T018) → existing profiles safe
5. Polish (T019–T021) → full validation

### Note on Sprite Position Verification (T020)

The col/row positions in `CREATURE_SPRITES` are derived from visual analysis of PNG thumbnails. They may need adjustment. After completing T009, open the selection screen and check each creature image. If a position is wrong, update the `col`/`row` values in `types.ts` — this is a trivial fix. Do this before moving to US2/US3.

---

## Notes

- [P] tasks = different files, safe to run in parallel
- Commit after T008 (foundational complete) and after T010 (MVP: selection screen works)
- The `DEFAULT_NAMES` in T006 are suggestions — feel free to choose cuter names during implementation
- Keep the `.bodyEmoji` CSS class name in `Creature.module.css` for the bounce/distressed animation selectors to continue targeting the same element

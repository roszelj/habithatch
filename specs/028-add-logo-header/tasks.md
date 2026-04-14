# Tasks: Add Logo Header Image

**Input**: Design documents from `/specs/028-add-logo-header/`
**Prerequisites**: plan.md ✓, spec.md ✓, research.md ✓

---

## Phase 1: Foundational (Shared CSS Rule)

**Purpose**: Add the shared responsive CSS rule that all component swaps depend on.

- [X] T001 Add `.logo-header` CSS rule to `src/index.css` (max-height: 48px, width: auto, max-width: 100%, display: block, margin: 0 auto)

---

## Phase 2: User Story 1 — Logo Replaces Title Text (Priority: P1)

**Goal**: Replace every `<div className={styles.title}>HabitHatch</div>` with `<img src="/logo_header.png" alt="HabitHatch" className="logo-header" />` across all affected components.

**Independent Test**: Open the app and visually verify the logo image appears in place of the "HabitHatch" text on the main screen, auth screen, selection screen, profile picker, naming step, outfit picker, and accessory picker.

### Implementation for User Story 1

- [X] T002 [P] [US1] Replace HabitHatch title div with logo img in `src/components/Game.tsx` (line ~534, pet view)
- [X] T003 [P] [US1] Replace HabitHatch title div with logo img in `src/components/AuthScreen.tsx` (3 occurrences)
- [X] T004 [P] [US1] Replace HabitHatch title div with logo img in `src/components/SelectionScreen.tsx`
- [X] T005 [P] [US1] Replace HabitHatch title div with logo img in `src/components/ProfilePicker.tsx`
- [X] T006 [P] [US1] Replace HabitHatch title div with logo img in `src/components/NamingStep.tsx`
- [X] T007 [P] [US1] Replace HabitHatch title div with logo img in `src/components/OutfitPicker.tsx`
- [X] T008 [P] [US1] Replace HabitHatch title div with logo img in `src/components/AccessoryPicker.tsx`

**Checkpoint**: Zero instances of the text "HabitHatch" visible as a heading in any app view. Logo renders correctly on mobile viewport (320px+) without overflow.

---

## Dependencies & Execution Order

- **T001** must complete before T002–T008 (CSS rule must exist)
- **T002–T008** are all independent of each other (different files) — run in parallel

---

## Parallel Execution

```
After T001:
  Launch T002, T003, T004, T005, T006, T007, T008 simultaneously
  (all touch different files, no conflicts)
```

---

## Implementation Strategy

1. Complete T001 (add CSS rule)
2. Complete T002–T008 in parallel (9 text replacements across 7 files)
3. Verify: `grep -r "HabitHatch" src/` returns zero results
4. Visual check: logo renders at correct size, no overflow, no broken image

---

## Notes

- Replace pattern exactly: `<div className={styles.title}>HabitHatch</div>` → `<img src="/logo_header.png" alt="HabitHatch" className="logo-header" />`
- The `styles.title` class is kept in CSS modules — it is still used for other labels ("PARENT MODE", "CHORES", etc.)
- `alt="HabitHatch"` ensures accessibility and screen-reader fallback
- The image path `/logo_header.png` works because Vite serves `public/` at the root

# Implementation Plan: Change Creature

**Branch**: `024-change-creature` | **Date**: 2026-04-07 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/024-change-creature/spec.md`

## Summary

Kids can tap "Change Creature" in the pet view toolbar to open a combined picker screen showing all 18 creature types (current one highlighted) plus an editable name field. Confirming updates local React state in `Game.tsx` — `creatureType` and `creatureName` are promoted to `useState` (same pattern as `outfitId`/`habitatId`) — which triggers the existing auto-save to persist the change. No schema migrations needed.

## Technical Context

**Language/Version**: TypeScript 5.6
**Primary Dependencies**: React 19, Vite 5, CSS Modules
**Storage**: N/A — `creatureType` and `creatureName` already on `ChildProfile`; no new storage
**Testing**: npm run build (TypeScript gate)
**Target Platform**: Web (mobile-first PWA)
**Project Type**: Web application (SPA)
**Performance Goals**: Visual feedback within 200ms of creature selection (constitution requirement)
**Constraints**: Name 1–20 characters (matches existing `NamingStep` constraint)
**Scale/Scope**: 1 new component, modifications to `Game.tsx` only

## Constitution Check

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Fun-First Design | PASS | Kid gets an exciting creature-swap moment with immediate visual preview; change is instant with no loading |
| II. Ship & Iterate | PASS | Scoped to 1 new component + ~20 lines in Game.tsx; fully testable in isolation |
| III. Kid-Safe Always | PASS | No PII, no network calls, purely cosmetic; name is locally validated |

## Project Structure

### Documentation (this feature)

```text
specs/024-change-creature/
├── plan.md           # This file
├── research.md       # Phase 0 output
├── data-model.md     # Phase 1 output
├── quickstart.md     # Phase 1 output
└── tasks.md          # Phase 2 output (/speckit.tasks)
```

### Source Code

```text
src/
├── components/
│   ├── ChangeCreatureScreen.tsx        (NEW)
│   ├── ChangeCreatureScreen.module.css (NEW)
│   └── Game.tsx                        (MODIFY)
```

**Structure Decision**: Single-project SPA. Two new files; one modified file. No new directories.

## Implementation Detail

### ChangeCreatureScreen.tsx

```
Props:
  currentType: CreatureType       — pre-selects in grid
  currentName: string             — pre-fills name input
  onConfirm: (type, name) => void — fires on Confirm tap
  onCancel: () => void            — fires on Cancel tap

Internal state:
  selectedType: CreatureType      — init from currentType
  name: string                    — init from currentName

Layout (top to bottom):
  Title: "Change Creature"
  Creature grid (same as SelectionScreen) — click to select, current highlighted
  Name input — pre-filled, maxLength=20
  Row: [Cancel button] [Confirm button — disabled if name empty]
```

### Game.tsx changes

1. Add `const [creatureType, setCreatureType] = useState<CreatureType>(profile.creatureType);`
2. Add `const [creatureName, setCreatureName] = useState(profile.creatureName);`
3. Add `'change-creature'` to the view union type
4. Update `buildProfile` to spread `creatureType` and `creatureName` after `...profileRef.current` (so they override the prop values)
5. Add `creatureType` and `creatureName` to `buildProfile`'s `useCallback` deps
6. Add `creatureType` and `creatureName` to the auto-save effect deps
7. Replace `state.name` → `creatureName` and `state.creatureType` → `creatureType` everywhere they are passed as props to `Creature` and `CreatureSprite`
8. Add `handleCreatureChange` callback: `setCreatureType(type)`, `setCreatureName(name)`, `setView('pet')`
9. Add "Change Creature" button in pet view toolbar
10. Add `view === 'change-creature'` branch rendering `<ChangeCreatureScreen />`

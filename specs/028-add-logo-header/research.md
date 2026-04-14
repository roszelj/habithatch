# Research: Add Logo Header Image

## Affected Locations

**Decision**: Replace all 9 occurrences of `<div className={styles.title}>HabitHatch</div>` across 7 component files with an `<img>` element.

**Files**:
- `src/components/SelectionScreen.tsx` (×1)
- `src/components/OutfitPicker.tsx` (×1)
- `src/components/AccessoryPicker.tsx` (×1)
- `src/components/Game.tsx` (×1, line 534 — pet view)
- `src/components/NamingStep.tsx` (×1)
- `src/components/ProfilePicker.tsx` (×1)
- `src/components/AuthScreen.tsx` (×3)

**Rationale**: All screens that currently show the "HabitHatch" text heading should show the logo for brand consistency. The pet view sub-screens (PARENT MODE, CHORES, STORE) keep their existing text labels since those are functional context labels, not the brand title.

## Logo Image

**Decision**: Use `/logo_header.png` (already present in `public/`).

**Rationale**: The file is already production-ready at the correct path. `logo_main.png` also exists but the spec explicitly requests `logo_header.png`.

## CSS Approach

**Decision**: Add a shared `.logoHeader` CSS class in `src/index.css` (global) rather than duplicating it in each component's CSS module.

**Rationale**: All 7 components need identical sizing/responsive behavior. A single global rule avoids 7 nearly-identical CSS additions and ensures visual consistency if the logo dimensions need adjusting later.

**Rule**:
```css
.logo-header {
  max-height: 48px;
  width: auto;
  max-width: 100%;
  display: block;
  margin: 0 auto;
}
```

**Alternatives considered**:
- Adding `.logoHeader` to each component CSS module — rejected: duplication, harder to maintain
- CSS-in-JS or inline styles — rejected: not used in this codebase (uses CSS Modules + global CSS)

## No Data Model Changes

This feature is purely presentational. No Firestore, localStorage, or state changes required.

## No Interface Contracts

Static image swap; no external interfaces affected.

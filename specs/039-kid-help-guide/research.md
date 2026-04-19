# Research: Kid Help Guide (039)

## View Navigation Pattern

**Decision**: Add `'help'` to the existing `view` state union in `Game.tsx`  
**Rationale**: The app already manages all major screen transitions via a `view` state variable typed as `'pet' | 'chores' | 'store' | 'pin' | 'parent' | 'change-creature'`. The help screen follows exactly this pattern — a full view swap with a Back button that returns to `'pet'`. No new navigation infrastructure needed.  
**Alternatives considered**: Modal/overlay approach — rejected because all other screens in the app use full view replacement, and an overlay would require z-index management and may obscure the pause banner and toolbar.

---

## Static Content Storage

**Decision**: Static TypeScript module (`src/models/helpContent.ts`) exporting typed arrays of help topic objects  
**Rationale**: Help content never changes at runtime, requires no network fetch, and has no per-user variance. A typed constant module is consistent with how other static data (outfits, habitats, foods, wheel segments, trivia questions) is handled in this codebase.  
**Alternatives considered**: CMS / remote fetch — rejected per spec assumption (static content); inline JSX strings — rejected because separating data from presentation makes future updates easier.

---

## Two-Section Layout

**Decision**: Render two collapsible or stacked sections ("For Kids" / "For Parents") in the `HelpScreen` component, each with a list of tappable topic rows that expand to show detail text  
**Rationale**: Matches the spec clarification (two clearly labeled top-level sections). Expand/collapse on tap is consistent with the touch-first mobile UX already in the app and avoids nested navigation stacks.  
**Alternatives considered**: Tabbed interface — deferred as additional complexity; flat mixed list — rejected per spec clarification Q2.

---

## CSS Modules

**Decision**: New `HelpScreen.module.css` file following the same module-per-component pattern used throughout the codebase  
**Rationale**: All existing components use CSS Modules. No shared style system to integrate with beyond matching the existing visual tone (rounded cards, emoji accents).

---

## Conditional Switch Profile Topic

**Decision**: Pass a boolean prop `showSwitchProfile` to `HelpScreen`; topic is included or excluded at render time  
**Rationale**: `onSwitchProfile` is already an optional prop on `Game`. The help screen must mirror this conditionality per FR-010.

---

## No NEEDS CLARIFICATION items remain

All technical decisions are resolved. No new dependencies, no storage changes, no external integrations.

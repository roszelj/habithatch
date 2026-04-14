# Research: Change Creature

**Feature**: 024-change-creature | **Date**: 2026-04-07

---

## Decision 1: How to manage mutable creatureType/creatureName in Game.tsx

**Decision**: Promote `creatureType` and `creatureName` to local `useState` in `Game.tsx`, initialized from `profile.creatureType` / `profile.creatureName`. Override the `profileRef.current` spread in `buildProfile` with these local values, add them to `buildProfile`'s deps and to the auto-save effect's dep array.

**Rationale**: This is the same pattern already used for `outfitId`, `accessoryId`, `habitatId`, `coins`, etc. It integrates with the existing auto-save mechanism without any new infrastructure. The `useCreature` hook keeps managing health and points; we simply replace `state.name` and `state.creatureType` with local state wherever they are passed to child components.

**Alternatives considered**:
- Adding a `setCreature` dispatch action to `useCreature` — rejected: the hook's reducer handles game mechanics, not identity fields. Mixing concerns would complicate the hook.
- Remounting `Game` to re-initialize — rejected: loses in-flight state (unreacted game loop ticks), jarring UX.

---

## Decision 2: New screen vs. repurposing SelectionScreen + NamingStep

**Decision**: Create a single new `ChangeCreatureScreen` component that combines creature grid + name field in one screen. Do not modify or directly reuse `SelectionScreen` or `NamingStep`.

**Rationale**: The in-game change flow differs from initial setup:
- Grid click = *select*, not *confirm* (because the name field must be filled before confirming)
- Current creature is highlighted
- A Cancel button must exist
- Name is pre-filled (not defaulted by creature type)

Modifying `SelectionScreen` to accommodate all these flags would make it harder to understand. A focused new component is cleaner and fully fits the Ship & Iterate principle.

**Alternatives considered**:
- Wrapping `SelectionScreen` + `NamingStep` sequentially — rejected: two separate screens for one action is more friction for a kid than a combined single-screen flow.

---

## Decision 3: Entry point location

**Decision**: "Change Creature" button in the pet view toolbar (same row as the existing Chores / Store buttons), shown always.

**Rationale**: The toolbar is the established navigation zone for the kid; placing the button there requires no new UI pattern. Always visible = discoverable without instructions (satisfies SC-004).

**Alternatives considered**:
- In the Store under a "Customise" tab — rejected: the Store is about spending coins; changing creature is free and identity-driven, not a purchase.
- Hidden behind a settings icon — rejected: reduces discoverability for young users.

---

## Decision 4: Persist via existing auto-save

**Decision**: Changing creature type updates local state → triggers the auto-save effect (because `buildProfile` deps include `creatureType`/`creatureName`) → `onSaveProfile(buildProfile())` is called → profile is persisted via the existing save mechanism.

**Rationale**: Zero new persistence code. The auto-save effect already handles all profile state changes this way. Cloud and local modes both receive the update correctly.

**Alternatives considered**:
- Calling `onSaveProfile` immediately in the confirm handler — rejected: the auto-save effect is the single source of truth for when saves happen. Double-saving is harmless but inconsistent.

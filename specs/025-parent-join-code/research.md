# Research: Parent Join Code Display

**Feature**: 025-parent-join-code | **Date**: 2026-04-07

---

## Decision 1: Where to source the join code

**Decision**: Use `provider.cloudContext.joinCode` already available in `App.tsx`. Pass it as an optional prop (`joinCode?: string`) through `Game` → `ParentPanel`.

**Rationale**: `cloudContext` is already populated on the `DataProvider` interface. `joinCode` is non-null in cloud mode and absent (`cloudContext` is `null`) in local mode — the optional prop naturally handles both cases without any new state or data fetching.

**Alternatives considered**:
- Fetching the join code fresh from Firestore inside ParentPanel — rejected: over-engineered; the value is already in memory.
- Storing join code in `appData` — rejected: it's a family-level property managed by the cloud provider, not profile data.

---

## Decision 2: Where to display the join code in ParentPanel

**Decision**: Display the join code at the top of the parent panel, above the tabs, as a small persistent banner — visible on every tab without extra navigation.

**Rationale**: Satisfies FR-003 (always visible) and SC-002 (reachable on every tab). The area above tabs already exists and is the natural place for global panel context.

**Alternatives considered**:
- Only in the Stats tab — rejected: parent would need to switch tabs to find it.
- A dedicated "Info" tab — rejected: adds navigation friction for what is one small piece of info.

---

## Decision 3: Hiding in local mode

**Decision**: `joinCode` prop is `string | undefined`. When `undefined`, the banner is simply not rendered. No conditional logic needed in App.tsx beyond `provider.cloudContext?.joinCode`.

**Rationale**: Optional prop with no-render-when-undefined is the simplest pattern. Local mode `provider.cloudContext` is `null`, so the optional chain produces `undefined` → component skips the banner. Zero extra logic.

# Research: Kid Join Profile Selection

**Feature**: 018-kid-join-profile
**Date**: 2026-04-07

## Decision 1: Where to change routing

**Decision**: Change `handleJoinFamily` in `App.tsx` (line 94) from `setPhase({ step: 'select' })` to `setPhase({ step: 'profiles' })`.

**Rationale**: This is the single call site that handles the post-join routing. The `profiles` step already renders `ProfilePicker`, which already handles the multi-profile display and "Add Child" flow. No new UI components needed.

**Alternatives considered**:
- Adding a new `childJoin` step with custom logic — rejected as unnecessary complexity; `profiles` step already does what's needed.
- Routing based on profile count at join time — rejected because Firestore data hasn't loaded yet at the moment `handleJoinFamily` completes (see Decision 2).

---

## Decision 2: Handling async profile load after join

**Decision**: Add a `loaded: boolean` field to the `DataProvider` interface. The cloud provider initializes it `false` and sets it `true` on the first Firestore profiles snapshot. The local provider always returns `loaded: true`. In `App.tsx`, while `phase.step === 'profiles'` and `!provider.loaded`, render a loading indicator instead of `ProfilePicker`.

**Rationale**: The `useCloudDataProvider` hook starts with `appData.profiles = []` and populates via async Firestore listener. When a kid joins, there's a ~500ms–2s window where profiles are empty even though the family may have existing profiles. Without a loading gate, the kid sees a blank picker (just "Add Child") before profiles arrive — confusing for a returning child.

**Alternatives considered**:
- No loading state — rejected because it causes a flash of "Add Child only" screen for families with existing profiles.
- `useEffect` in App.tsx watching `appData.profiles.length` — rejected because an empty array is a valid end state (truly new family), so we can't distinguish "not yet loaded" from "loaded and empty" without an explicit flag.
- Separate `childJoinLoading` state in App — rejected in favor of a provider-level `loaded` flag that's reusable and keeps App.tsx clean.

---

## Decision 3: Empty-family routing (FR-002 / User Story 3)

**Decision**: Do not add special-case routing for the zero-profiles scenario on join. When a kid joins an empty family, the `ProfilePicker` shows only the "Add Child" option (since `canAdd` is `true` when `profiles.length === 0 < MAX_PROFILES`). The kid taps it and proceeds to creature creation.

**Rationale**: FR-002 calls for going "directly to creature creation" when the family is empty, but this can only be determined *after* profiles load from Firestore. Adding conditional navigation after load introduces a race — if we re-route from `profiles → select` after load, we risk a jarring redirect. The one-tap difference is negligible, and the loaded-state gate already prevents the confusing "Add Child only" flash.

**Alternatives considered**:
- Post-load useEffect that redirects `profiles → select` if `profiles.length === 0` — rejected because a re-route after render is jarring and adds complexity disproportionate to the UX gain.
- Pre-fetching profiles before transition — rejected as over-engineering; Firestore latency is acceptable with a loading state.

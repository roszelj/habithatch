# Research: Parent Persistent Session

**Feature**: 019-parent-persistent-auth
**Date**: 2026-04-07

## Root Cause Analysis

The app currently breaks parent session persistence because:

1. **`phase` is initialized synchronously** using the initial `user` value, which is always `null` at startup (Firebase auth resolution is async). So every page refresh sets `phase = { step: 'auth' }` regardless of whether a parent session exists.

2. **`isParent` is not persisted**. It starts as `false` and is set to `true` only inside `handleSignUp` / `handleSignIn`. On refresh, it resets to `false`, which breaks cloud provider behavior even if we fix the phase.

Firebase Auth itself already persists the session token via browser storage — the parent's credential is available. The app just doesn't react to the restored session correctly.

---

## Decision 1: How to detect "parent vs kid" after session restore

**Decision**: Derive `isParent` from `user.isAnonymous` instead of storing it as React state.

Parents always authenticate with email/password (non-anonymous). Kids always authenticate via anonymous sign-in. Therefore `isParent = user !== null && !user.isAnonymous` is always accurate, requires no storage, and survives page refreshes automatically.

**Rationale**: Removes a manual tracking variable that was fragile (only updated inside sign-in handlers, missed on restore). Simpler and always correct.

**Alternatives considered**:
- Store `isParent` in `localStorage` — rejected because deriving from auth state is more reliable and eliminates a desync risk.
- Store in Firestore on the user document — rejected as over-engineering; the anonymous flag is already available client-side.

---

## Decision 2: How to restore the correct phase after auth resolves

**Decision**: Add a `useEffect` in `App.tsx` that watches `authLoading`, `user`, and `familyId`. When auth finishes loading (`!authLoading`) and a non-anonymous user is found with a valid `familyId`, and the current `phase` is still `auth` (i.e., initialization defaulted there), set `phase` to `profiles`.

**Rationale**: The phase initializer runs once synchronously before Firebase resolves. A reactive `useEffect` is the right mechanism to respond to the async auth resolution. Gating on `phase.step === 'auth'` prevents overwriting any phase the user legitimately navigated to.

**Alternatives considered**:
- Move phase initialization into a `useEffect` — rejected because it introduces a flicker where nothing renders until auth resolves; the current loading state already handles this correctly.
- Store phase in `sessionStorage` — rejected; restoring a mid-session phase (e.g., `play`) would be incorrect across browser closes.
- Remove the `{ step: 'auth' }` default when `familyId` exists in localStorage — rejected because familyId alone doesn't confirm a valid session (user could be signed out).

---

## Decision 3: Anonymous (kid) sessions

**Decision**: Kids who signed in anonymously are NOT restored to their previous phase. After a page refresh, a kid who joined via join code sees the auth screen again and must re-enter the join code.

**Rationale**: Anonymous sessions don't have the same "persistent family member" expectation. The spec explicitly limits persistent sessions to parent accounts. This also avoids showing a kid's profile to whoever opens the browser next (shared device concern).

**Alternatives considered**:
- Also restore anonymous sessions — rejected as out of scope per spec; also raises kid-safety questions about shared devices.

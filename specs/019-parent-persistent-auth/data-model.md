# Data Model: Parent Persistent Session

**Feature**: 019-parent-persistent-auth
**Date**: 2026-04-07

## No New Entities

This feature introduces no new data entities or storage changes.

## Removed State

| Field     | Location       | Change                                                                 |
|-----------|----------------|------------------------------------------------------------------------|
| `isParent` | `src/App.tsx` | Removed as React `useState`. Now derived: `user !== null && !user.isAnonymous` |

## Existing Storage Used (no changes)

| Storage          | Key                       | Value       | Role in this feature                                      |
|------------------|---------------------------|-------------|-----------------------------------------------------------|
| `localStorage`   | `terragucci_familyId`     | family ID   | Used alongside restored `user` to confirm a parent session |
| Firebase Auth    | (browser-managed)         | session token | Already persists parent credentials across refreshes      |

## Behavior Change (not a data change)

The `isParent` flag was previously set manually in `handleSignUp`, `handleSignIn`, and `handleJoinFamily`. It is now a pure derivation: `Boolean(user && !user.isAnonymous)`. This makes it automatically correct on every render, including after a page refresh.

# Research: Points Persistence Fix

**Feature**: 013-fix-points-persistence
**Date**: 2026-04-06

## Root Cause Finding

### Decision: The bug is a wrong call site — local utility called instead of provider method

**Rationale**:

`Game.tsx` imports and calls `saveProfile` directly from `useSaveData.ts`:

```typescript
// Game.tsx line 10
import { saveProfile } from '../hooks/useSaveData';

// Game.tsx auto-save effect (~line 94)
saveProfile({ ...appDataRef.current, parentPin }, updatedProfile);
```

`useSaveData.saveProfile()` writes **only to localStorage** — it is a pure local utility with no awareness of the active data provider.

The data provider interface (`useDataProvider.ts`) exposes a `saveProfile(profile)` method that routes correctly:
- **Local mode** → writes to localStorage via `writeAppData()`
- **Cloud mode** → calls `updateCloudProfile()` which writes to Firestore

Because `Game.tsx` bypasses the provider interface, cloud-mode users never have their points written to Firestore. On reload or login, the Firestore real-time listener restores the last Firestore state — which never had the new points.

**Alternatives considered**:

| Alternative | Rejected Because |
|-------------|-----------------|
| Dual-write: call both util and provider.saveProfile() | Redundant; local provider already writes to localStorage. Would cause double-writes in local mode. |
| Make useSaveData.saveProfile() cloud-aware | Violates separation of concerns; useSaveData is correctly scoped to localStorage only |
| Add a cloud-write to the auto-save effect directly | Harder to maintain; duplicates provider logic; bypasses the provider abstraction |

---

## Data Flow (Current — Broken)

```
Chore completed
  → Game.tsx handleChoreCheckOff() / handleApprove()
  → React state updated (useReducer)
  → auto-save useEffect fires
  → saveProfile(appData, profile)  ← calls useSaveData utility
  → localStorage.setItem(...)       ← only local write, cloud skipped
```

## Data Flow (Fixed)

```
Chore completed
  → Game.tsx handleChoreCheckOff() / handleApprove()
  → React state updated (useReducer)
  → auto-save useEffect fires
  → provider.saveProfile(profile)   ← routes via active provider
     ├── Local mode → writeAppData() → localStorage
     └── Cloud mode → updateCloudProfile() → Firestore
```

---

## Scope Confirmation

The fix is **entirely contained in Game.tsx**:

1. Remove the direct import of `saveProfile` from `useSaveData`
2. Accept `provider.saveProfile` (or the provider itself) as a prop or access it via context
3. Call `provider.saveProfile(updatedProfile)` in the auto-save effect

The `useSaveData.saveProfile` utility is still used correctly by `useLocalDataProvider` in `useDataProvider.ts` — that code path is not changed.

---

## Related Data (also affected, same fix)

The same auto-save effect persists the full profile, which includes:
- Points (the reported symptom)
- Coins
- Streak data
- Chore completion status
- Outfit/accessory selections
- Notifications
- Redeemed rewards

All of these share the same broken save path and will be fixed by the same change.

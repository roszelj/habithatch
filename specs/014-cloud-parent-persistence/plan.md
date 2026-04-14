# Implementation Plan: Cloud Parent Data Persistence

**Branch**: `014-cloud-parent-persistence` | **Date**: 2026-04-06 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/014-cloud-parent-persistence/spec.md`

## Summary

Parent PIN and rewards created by parents must persist in Firebase Firestore so they are available across all family devices in cloud mode. Research found that rewards are already partially synced but have a gap in the `updateAppData` flow, and parentPin is entirely local-only. The fix touches 4 files — adding parentPin to the Firestore family document, syncing it via the existing real-time listener, and fixing the `updateAppData` flow to write both parentPin and rewards changes to Firestore.

## Technical Context

**Language/Version**: TypeScript 5.6 + React 19
**Primary Dependencies**: Vite 5, Firebase JS SDK v12
**Storage**: Firebase Firestore (cloud mode) + localStorage (local/guest mode)
**Testing**: Manual testing (no automated test framework currently configured)
**Target Platform**: Web browser (desktop + mobile)
**Project Type**: Web application (single-page React app)
**Performance Goals**: Real-time sync within 5 seconds across devices
**Constraints**: Must preserve local-mode behavior; no breaking changes
**Scale/Scope**: Family-sized (1 parent + up to 8 children)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### I. Fun-First Design ✅
- This feature is infrastructure — it doesn't change any gameplay mechanics
- Ensures parent rewards (a motivational mechanic) are reliably available across devices, which supports fun
- No new UI changes that could impact player experience

### II. Ship & Iterate ✅
- Minimal scope: 4 files modified, no new files
- Builds directly on existing Firebase infrastructure (listeners, family document, cloud provider)
- No speculative abstractions — just extends existing patterns

### III. Kid-Safe Always ✅
- Parent PIN stored in Firestore is protected by Firebase security rules (family members only)
- No personally identifiable information collected or exposed
- PIN is a 4-digit numeric child-deterrent, not a security credential — appropriate for the threat model
- Network feature (cloud sync) already opted-in by user when they created a family account

### Post-Design Re-check ✅
- No constitution violations introduced by the design
- All changes follow existing patterns in the codebase

## Project Structure

### Documentation (this feature)

```text
specs/014-cloud-parent-persistence/
├── plan.md              # This file
├── spec.md              # Feature specification
├── research.md          # Phase 0 research output
├── data-model.md        # Phase 1 data model
├── quickstart.md        # Phase 1 quickstart guide
└── checklists/
    └── requirements.md  # Spec quality checklist
```

### Source Code (repository root)

```text
src/
├── firebase/
│   ├── families.ts      # MODIFY: Add parentPin to FamilyData, add updateFamilyPin()
│   ├── listeners.ts     # MODIFY: Add parentPin to FamilySnapshot
│   ├── migration.ts     # MODIFY: Add parentPin to migrateLocalToCloud()
│   └── config.ts        # (no changes)
├── hooks/
│   └── useDataProvider.ts  # MODIFY: Cloud provider syncs parentPin + fixes reward sync gap
├── models/
│   └── types.ts         # (no changes — AppData already has parentPin)
└── components/
    └── Game.tsx          # (no changes — already passes parentPin via updateAppData)
```

**Structure Decision**: Single project, React SPA. All changes are in existing files within `src/firebase/` and `src/hooks/`.

## Implementation Steps

### Step 1: Add parentPin to Firestore interfaces and functions

**File: `src/firebase/families.ts`**
- Add `parentPin?: string | null` to `FamilyData` interface
- Add `updateFamilyPin(familyId: string, parentPin: string | null)` function (uses `setDoc` with merge, same pattern as `updateFamilyRewards`)

**File: `src/firebase/listeners.ts`**
- Add `parentPin?: string | null` to `FamilySnapshot` interface

### Step 2: Update cloud provider to sync parentPin and fix reward sync

**File: `src/hooks/useDataProvider.ts`**

In `useCloudDataProvider`:
- **Family snapshot listener** (line 80-83): Also read `parentPin` from the snapshot and set it on appData
- **`updateAppData`** (line 100): Replace the simple `setAppData(data)` with a function that:
  1. Sets local state
  2. Compares `data.parentPin` to previous `appData.parentPin` — if changed, call `updateFamilyPin()`
  3. Compares `data.rewardPresents` to previous `appData.rewardPresents` — if changed, call `updateFamilyRewards()`

### Step 3: Add parentPin to migration

**File: `src/firebase/migration.ts`**
- After migrating profiles and rewards, also migrate parentPin:
  ```
  if (data.parentPin) {
    await updateFamilyPin(familyId, data.parentPin);
  }
  ```

### Step 4: Manual testing

1. **Local mode**: Set PIN, create rewards, refresh → verify persistence (regression test)
2. **Cloud mode — PIN**: Set PIN on device A, check device B → PIN required
3. **Cloud mode — Rewards**: Create reward on device A, check device B → reward visible
4. **Migration**: Start local with PIN + rewards, sign up for cloud → verify both migrate

## Complexity Tracking

No constitution violations. No complexity justifications needed.

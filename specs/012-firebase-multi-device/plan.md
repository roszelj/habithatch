# Implementation Plan: Firebase Multi-Device Sync

**Branch**: `012-firebase-multi-device` | **Date**: 2026-04-06 | **Spec**: [spec.md](spec.md)

## Summary

Replace localStorage-only persistence with a dual-mode system:
local-only (no sign-up) or Firebase Firestore (signed in). Parent
authenticates via email, creates a family with a join code. Children
join from their own devices. Real-time Firestore listeners sync
all game data across devices. Offline play supported via Firestore's
built-in IndexedDB cache.

## Technical Context

**Language/Version**: TypeScript 5.x (existing)
**Primary Dependencies**: React 19, Vite 5, Firebase JS SDK v10
**Storage**: Firebase Firestore (cloud) + localStorage (fallback)
**Testing**: Vitest 1.x
**Target Platform**: Web browser (mobile Safari + Chrome priority)
**Project Type**: Web application (SPA, client-only + Firebase BaaS)
**Performance Goals**: <5 second cross-device sync, 60fps UI
**Constraints**: Offline-capable, kid-safe, Firebase free tier
**Scale/Scope**: 1 family per account, up to 8 profiles

## Constitution Check

| Principle | Gate | Status |
|-----------|------|--------|
| I. Fun-First | Multi-device doesn't degrade responsiveness | PASS — Firestore offline cache ensures instant local reads |
| I. Fun-First | Sync feels magical, not technical | PASS — snapshot listeners auto-update UI |
| II. Ship & Iterate | Scoped to deliverable increment | PASS — 4 phases, each shippable |
| II. Ship & Iterate | Local-only mode preserved | PASS — DataProvider abstraction |
| III. Kid-Safe | No child PII collected | PASS — only parent email |
| III. Kid-Safe | Data access controlled | PASS — Firestore security rules |
| III. Kid-Safe | Dependencies audited | PASS — Firebase is Google's flagship BaaS |

## Project Structure

```text
src/
├── firebase/
│   ├── config.ts              # Firebase app initialization
│   ├── auth.ts                # Sign up, sign in, sign out
│   ├── families.ts            # Create family, generate join code
│   ├── profiles.ts            # CRUD for child profiles in Firestore
│   ├── listeners.ts           # Real-time snapshot listeners
│   └── migration.ts           # localStorage → Firestore migration
├── hooks/
│   ├── useAuth.ts             # NEW — Firebase auth state hook
│   ├── useFamily.ts           # NEW — family data + join code
│   ├── useCloudProfile.ts     # NEW — Firestore profile sync
│   ├── useDataProvider.ts     # NEW — abstraction: local or cloud
│   ├── useSaveData.ts         # EXISTING — becomes local-only provider
│   └── ... (existing hooks unchanged)
├── components/
│   ├── AuthScreen.tsx         # NEW — sign up / sign in / join family
│   ├── FamilySetup.tsx        # NEW — create family, show join code
│   └── ... (existing — minimal changes)
├── App.tsx                    # UPDATED — auth gate before game

firestore.rules                # Firestore security rules
```

## Implementation Phases

### Phase 1: Firebase Setup + Auth
- Install Firebase SDK (`firebase` npm package)
- Create `src/firebase/config.ts` with project config
- Implement `src/firebase/auth.ts` (signUp, signIn, signOut)
- Implement `useAuth` hook (auth state, loading, user)
- Create `AuthScreen` component (sign up / sign in / join family / skip)
- Update `App.tsx` to show AuthScreen or existing flow

### Phase 2: Family Management
- Implement `src/firebase/families.ts` (createFamily, generateJoinCode, lookupJoinCode)
- Create `FamilySetup` component (shows join code, share button)
- Implement join flow (child enters code → links to family)
- Create `joinCodes` index collection for O(1) lookup

### Phase 3: Firestore Data Sync
- Implement `src/firebase/profiles.ts` (read, write, create, delete profiles)
- Implement `src/firebase/listeners.ts` (onSnapshot for family + profiles)
- Implement `useCloudProfile` hook (Firestore read/write + listener)
- Implement `useDataProvider` hook (routes to localStorage OR Firestore)
- Update `Game.tsx` auto-save to use DataProvider
- Enable Firestore offline persistence

### Phase 4: Migration + Security + Polish
- Implement `src/firebase/migration.ts` (detect localStorage data, import to Firestore)
- Write + deploy Firestore security rules
- Server-timestamp daily reset
- Cross-device integration testing
- Offline → reconnect testing

## Firestore Data Model

See [data-model.md](data-model.md) for full schema.

```
families/{familyId}
  ├── parentUid, joinCode, rewardPresents[], createdAt
  └── profiles/{profileId}
       └── creatureType, creatureName, health, points, coins,
           chores, outfit, accessories, streak, notifications...

joinCodes/{code}
  └── familyId
```

## Complexity Tracking

| Complexity | Why Needed | Simpler Rejected Because |
|------------|------------|--------------------------|
| Firebase SDK | Cross-device sync needs cloud | No cloud = no multi-device |
| DataProvider abstraction | Local-only must keep working | Direct Firestore breaks non-signed-up users |
| Security rules | Prevent cross-family data access | Without rules, anyone can read any family |

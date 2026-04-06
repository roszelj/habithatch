# Research: Firebase Multi-Device Sync

**Feature**: 012-firebase-multi-device
**Date**: 2026-04-06

## Technology Decisions

### Decision: Firebase Firestore (not Realtime Database)

**Decision**: Use Cloud Firestore for data storage.

**Rationale**: Firestore has built-in offline persistence for web
(IndexedDB), structured document/collection model that maps well to
our Family → Profiles → Chores hierarchy, and snapshot listeners for
real-time sync. Realtime Database is flatter and lacks offline web
support without manual caching.

**Alternatives considered**:
- Realtime Database: Simpler, but no built-in web offline persistence
- Supabase: Good Postgres alternative but no native offline sync

### Decision: Firebase Auth with Email + Password

**Decision**: Email + password authentication for parents only.

**Rationale**: Simplest auth method. No OAuth complexity. Kids don't
need accounts — they join via family code. Parent is the only
authenticated user.

**Alternatives considered**:
- Anonymous auth for kids: Adds complexity, no real benefit since
  kids join via code
- Google/Apple sign-in: Can be added later but adds SDK complexity

### Decision: Family Join Code via Client-Side Generation

**Decision**: Generate 6-character alphanumeric codes client-side
with collision check against Firestore.

**Rationale**: No Cloud Functions needed for v1. Generate a random
code, check if it exists in Firestore, retry if collision. With
36^6 = 2.1 billion possible codes and <1000 families, collisions
are statistically negligible.

**Alternatives considered**:
- Cloud Functions: More reliable but adds deployment complexity
- UUID: Too long for humans to type

### Decision: Data Layer Abstraction

**Decision**: Create a `DataProvider` abstraction that wraps either
localStorage or Firestore. Components interact with the provider,
not directly with storage.

**Rationale**: Allows local-only mode (no sign-up) and cloud mode
(signed in) to coexist. Existing code changes are minimal — swap
the provider based on auth state.

**Alternatives considered**:
- Direct Firestore calls everywhere: Breaks local-only mode
- Migrate entirely to cloud: Loses offline-first simplicity

### Decision: Firestore Document Structure

**Decision**: One document per family, with child profiles as a
subcollection.

```
families/{familyId}
  - parentUid: string
  - joinCode: string
  - parentPin: string | null  (hashed)
  - rewardPresents: RewardPresent[]
  - createdAt: timestamp

families/{familyId}/profiles/{profileId}
  - creatureName, creatureType, health, points, coins
  - chores: CategoryChores
  - outfitId, accessoryId, ownedOutfits, ownedAccessories
  - streak: StreakData
  - notifications: BonusNotification[]
  - redeemedRewards: RedeemedReward[]
  - lastPlayedDate: string
```

**Rationale**: Subcollection for profiles allows per-profile
listeners (child only listens to their own profile). Family-level
data (rewards, PIN) is in the parent document.

### Decision: Firestore Security Rules

**Decision**: Rules enforce:
- Only the parent (auth UID matches `parentUid`) can write to
  the family document and manage chore definitions
- Children can only write to their own profile subcollection
- Children can read family-level data (rewards, join code) but
  not write it
- Anyone with the join code can create a new profile (one-time)

### Decision: Offline Persistence

**Decision**: Enable Firestore's built-in offline persistence
(`enableIndexedDbPersistence`). The app reads/writes to Firestore
normally — the SDK handles caching and sync.

**Rationale**: Zero custom offline logic needed. Firestore queues
writes when offline and syncs when reconnected. Snapshot listeners
fire from cache immediately, then update when cloud data arrives.

## Kid-Safety Audit (Constitution Principle III)

- **PII**: Only parent email collected. Child profiles contain
  creature name only (no real names). PASS.
- **Data storage**: Firestore data is encrypted at rest. Security
  rules prevent cross-family access. PASS.
- **Network**: Firebase SDK handles all network communication over
  HTTPS. No raw API calls. PASS.
- **Age-appropriate**: No change to game content. PASS.

# Data Model: Firebase Multi-Device Sync

**Feature**: 012-firebase-multi-device
**Date**: 2026-04-06

## Firestore Document Structure

### Collection: `families`

```
families/{familyId}
```

| Field          | Type      | Description                              |
|----------------|-----------|------------------------------------------|
| parentUid      | string    | Firebase Auth UID of the parent          |
| joinCode       | string    | 6-char alphanumeric code (e.g. "GUC7X3") |
| rewardPresents | array     | RewardPresent[] — parent-defined rewards |
| createdAt      | timestamp | Server timestamp of family creation       |

### Subcollection: `families/{familyId}/profiles`

```
families/{familyId}/profiles/{profileId}
```

| Field             | Type     | Description                            |
|-------------------|----------|----------------------------------------|
| creatureType      | string   | 'bird' | 'turtle' | 'cat' | 'dog'     |
| creatureName      | string   | Player-chosen creature name            |
| health            | number   | 0-100 percentage                       |
| points            | map      | { morning: N, afternoon: N, evening: N } |
| coins             | number   | 0-9999 store currency                  |
| chores            | map      | { morning: Chore[], afternoon: Chore[], evening: Chore[] } |
| outfitId          | string?  | Currently equipped outfit ID or null   |
| accessoryId       | string?  | Currently equipped accessory ID or null |
| ownedOutfits      | array    | string[] of purchased outfit IDs       |
| ownedAccessories  | array    | string[] of purchased accessory IDs    |
| streak            | map      | { current: N, best: N, todayEarned: bool } |
| notifications     | array    | BonusNotification[]                    |
| redeemedRewards   | array    | RedeemedReward[]                       |
| lastPlayedDate    | string   | ISO date YYYY-MM-DD (server-derived)   |
| deviceId          | string?  | Device that "owns" this profile        |

### Index Collection: `joinCodes`

```
joinCodes/{code}
```

| Field    | Type   | Description                    |
|----------|--------|--------------------------------|
| familyId | string | Points to the family document  |

Used for O(1) lookup when a child enters a join code.

## Entity Relationships

```
Family (1) ──── has ────► (N) ChildProfile
   │
   ├── parentUid (auth)
   ├── joinCode
   └── rewardPresents[]

ChildProfile
   ├── creature (type, name, outfit, accessory)
   ├── economy (points, coins, ownedItems)
   ├── chores (per-category, with status)
   ├── streak
   └── notifications + redeemedRewards
```

## Security Rules (Pseudo)

```
match /families/{familyId} {
  // Parent can read/write family doc
  allow read, write: if request.auth.uid == resource.data.parentUid;
  
  // Anyone authenticated can read (for join code lookup)
  allow read: if request.auth != null;
  
  match /profiles/{profileId} {
    // Parent can read/write all profiles
    allow read, write: if request.auth.uid == 
      get(/databases/$(database)/documents/families/$(familyId)).data.parentUid;
    
    // Child device can read/write own profile
    allow read, write: if resource.data.deviceId == request.auth.uid;
  }
}

match /joinCodes/{code} {
  allow read: if request.auth != null;
  // Only parent can create (during family setup)
  allow create: if request.auth != null;
}
```

## State Transitions

### Auth State Machine

```
No Auth → Sign Up (parent) → Authenticated (parent)
                                    ↓
                              Create Family
                                    ↓
                              Family Active
                              
No Auth → Join Family (child) → Anonymous Auth → Linked to Family
```

### Sync State Machine

```
Local Only ←→ Syncing ←→ Offline (queued)
     ↓
  Sign Up
     ↓
  Cloud Mode ←→ Syncing ←→ Offline (Firestore cache)
```

## Migration Path (localStorage → Firestore)

1. User signs up → family created
2. App detects existing localStorage data
3. Prompt: "Import existing game data?"
4. If yes: each local ChildProfile → Firestore profile document
5. localStorage cleared after successful migration
6. If no: start fresh in cloud

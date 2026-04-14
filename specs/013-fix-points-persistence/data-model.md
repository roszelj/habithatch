# Data Model: Points Persistence Fix

**Feature**: 013-fix-points-persistence
**Date**: 2026-04-06

## Affected Entities

No schema changes. The data model is correct; the bug is in the write path.

### ChildProfile (existing — no changes)

| Field | Type | Description |
|-------|------|-------------|
| id | string | Unique profile identifier |
| creatureType | CreatureType | Selected creature |
| creatureName | string | Child-chosen name |
| health | number | 0–100 |
| points | CategoryPoints | Points by time-of-day category (morning/afternoon/evening) |
| coins | number | 0–9999 |
| chores | CategoryChores | Chore list with completion status per category |
| outfitId | OutfitId \| null | Equipped outfit |
| accessoryId | AccessoryId \| null | Equipped accessory |
| ownedOutfits | OutfitId[] | Unlocked outfits |
| ownedAccessories | AccessoryId[] | Unlocked accessories |
| streak | StreakData | current/best/todayEarned |
| notifications | BonusNotification[] | Pending bonus notifications |
| redeemedRewards | RedeemedReward[] | History of redeemed rewards |
| lastPlayedDate | string | ISO date (YYYY-MM-DD) |

### AppData (existing — no changes)

| Field | Type | Description |
|-------|------|-------------|
| version | 2 | Schema version |
| parentPin | string \| null | Optional parent lock PIN |
| profiles | ChildProfile[] | All child profiles for this family/device |
| rewardPresents | RewardPresent[] | Parent-configured reward catalog |

## Write Path (post-fix)

### Local mode
```
provider.saveProfile(profile)
  → useLocalDataProvider.saveProfile()
  → writeAppData({ ...appData, profiles: [...updated] })
  → localStorage.setItem(APP_DATA_KEY, JSON.stringify(data))
```

### Cloud mode
```
provider.saveProfile(profile)
  → useCloudDataProvider.saveProfile()
  → updateCloudProfile(familyId, profile)
  → Firestore: setDoc('families/{familyId}/profiles/{profileId}', profile, { merge: true })
```

## Read Path (unchanged)

### Local mode
- `loadAppData()` reads from `localStorage[APP_DATA_KEY]`
- Called once on app mount

### Cloud mode
- `onAllProfilesSnapshot()` sets up a Firestore real-time listener
- Updates React state whenever any profile document changes
- Called once when familyId is established after login

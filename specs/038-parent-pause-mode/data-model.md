# Data Model: Parent Pause Mode (038)

## Changed Entity: ChildProfile

**File**: `src/models/types.ts`

### New field

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `isPaused` | `boolean` (optional) | `false` (absent = not paused) | When `true`, health decay is skipped and streak resets are suppressed for this child. |

### Full updated interface (diff)

```typescript
export interface ChildProfile {
  id: string;
  childName: string | null;
  creatureType: CreatureType;
  creatureName: string;
  health: number;
  points: CategoryPoints;
  coins: number;
  weekdayChores: CategoryChores;
  weekendChores: CategoryChores;
  outfitId: OutfitId | null;
  accessoryId: AccessoryId | null;
  ownedOutfits: OutfitId[];
  ownedAccessories: AccessoryId[];
  habitatId: HabitatId | null;
  ownedHabitats: HabitatId[];
  chorePointsPerCategory?: CategoryPoints;
  streak: StreakData;
  notifications: BonusNotification[];
  redeemedRewards: RedeemedReward[];
  lastPlayedDate: string;
  fcmTokens?: string[];
+ isPaused?: boolean;          // NEW — true while parent has paused this child
}
```

### Migration

No migration needed. Existing serialized profiles (localStorage and Firestore) without `isPaused` will read the field as `undefined`, which is treated identically to `false` everywhere in the implementation (`profile.isPaused ?? false`).

---

## State transitions

```
Active (isPaused = false / undefined)
  │
  │  Parent enables pause
  ▼
Paused (isPaused = true)
  │
  │  Parent disables pause
  ▼
Active (isPaused = false)
     lastPlayedDate is set to today on resume
     so no streak penalty on first active day
```

---

## Persistence

- **Local mode**: Stored in `localStorage` key `terragucci_v2` as part of the `AppData.profiles` array. Written synchronously via `writeAppData()` on every `saveProfile()` call.
- **Cloud mode**: Stored in Firestore at `families/{familyId}/profiles/{profileId}` via `updateCloudProfile(..., { merge: true })`. Propagated to all listening devices via `onAllProfilesSnapshot`.

---

## No new collections or documents

The pause state is co-located with the rest of the child profile. No new Firestore collections, localStorage keys, or data structures are introduced.

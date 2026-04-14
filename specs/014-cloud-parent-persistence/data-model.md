# Data Model: Cloud Parent Data Persistence

## Entity Changes

### Family (Firestore: `families/{familyId}`)

**Existing fields** (no changes):
| Field | Type | Description |
|-------|------|-------------|
| parentUid | string | Firebase Auth UID of the parent who created the family |
| joinCode | string | 6-character alphanumeric code for children to join |
| rewardPresents | RewardPresent[] | Array of rewards created by the parent |
| createdAt | Timestamp | Server timestamp when family was created |

**New field**:
| Field | Type | Default | Description |
|-------|------|---------|-------------|
| parentPin | string \| null | null | 4-digit numeric PIN that gates access to the parent management panel |

### RewardPresent (unchanged)

| Field | Type | Description |
|-------|------|-------------|
| id | string | Auto-generated ID (Date.now() as string) |
| name | string | Display name of the reward |
| price | number | Coin cost to redeem |

### AppData (TypeScript interface — unchanged)

| Field | Type | Description |
|-------|------|-------------|
| version | 2 | Schema version |
| parentPin | string \| null | Parent PIN (local or cloud depending on mode) |
| profiles | ChildProfile[] | All child profiles |
| rewardPresents | RewardPresent[] | Rewards available in the family |

## Sync Mapping

| AppData Field | Local Mode Storage | Cloud Mode Storage | Real-time Sync |
|---------------|-------------------|-------------------|----------------|
| parentPin | localStorage (APP_DATA_KEY) | Firestore: families/{familyId}.parentPin | Yes (onFamilySnapshot) |
| rewardPresents | localStorage (APP_DATA_KEY) | Firestore: families/{familyId}.rewardPresents | Yes (onFamilySnapshot) |
| profiles | localStorage (APP_DATA_KEY) | Firestore: families/{familyId}/profiles/* | Yes (onAllProfilesSnapshot) |

## State Transitions

### Parent PIN Lifecycle
```
null → "1234"     (parent creates PIN)
"1234" → "5678"   (parent changes PIN — re-create flow)
"1234" → null      (not currently supported in UI, but data model allows it)
```

### Sync Flow (Cloud Mode)
```
Parent sets PIN on Device A
  → updateAppData({ ...appData, parentPin: "1234" })
  → Cloud provider detects parentPin change
  → updateFamilyPin(familyId, "1234") → Firestore write
  → onFamilySnapshot fires on Device B
  → appData.parentPin updated to "1234" on Device B
  → Parent panel now gated on Device B
```

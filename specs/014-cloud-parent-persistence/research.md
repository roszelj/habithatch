# Research: Cloud Parent Data Persistence

## R1: Current State of Parent PIN Persistence

**Finding**: Parent PIN (`parentPin: string | null`) is stored in `AppData` and persisted only to localStorage. In cloud mode, it initializes as `null` and is never read from or written to Firestore.

- **`FamilyData` interface** (`src/firebase/families.ts:14-19`): Does not include `parentPin`
- **`FamilySnapshot` interface** (`src/firebase/listeners.ts:5-9`): Does not include `parentPin`
- **`useCloudDataProvider`** (`src/hooks/useDataProvider.ts:71-73`): Initializes parentPin as `null`
- **`onFamilySnapshot` callback** (`src/hooks/useDataProvider.ts:80-83`): Only syncs `rewardPresents` and `joinCode` — ignores parentPin
- **Migration** (`src/firebase/migration.ts:10-28`): Does NOT migrate parentPin to cloud

**Decision**: Add `parentPin` to the Firestore `families/{familyId}` document alongside existing fields.

**Rationale**: The family document already holds family-level data (parentUid, joinCode, rewardPresents). Parent PIN is family-level data — one PIN per family, not per device.

**Alternatives considered**:
- Store PIN per-user in a separate `users/` collection → Rejected: PIN belongs to the family, not an individual. Any parent device should enforce the same PIN.
- Keep PIN local-only → Rejected: Defeats the feature purpose.

## R2: Current State of Rewards Persistence

**Finding**: Rewards (`rewardPresents: RewardPresent[]`) are ALREADY cloud-synced in cloud mode.

- **Stored in**: `families/{familyId}` document, `rewardPresents` field
- **Written by**: `updateFamilyRewards()` (`src/firebase/families.ts:61-63`)
- **Synced via**: `onFamilySnapshot` listener → updates `appData.rewardPresents` in real time
- **Migrated**: Yes, `migrateLocalToCloud()` uploads local rewards to Firestore

**Decision**: Rewards already persist in the cloud. No new persistence work needed.

**Rationale**: The existing family listener and `updateFamilyRewards` function handle the full lifecycle.

**Issue identified**: The cloud provider's `updateAppData` method (`src/hooks/useDataProvider.ts:100`) only calls `setAppData(data)` — it does NOT trigger `updateFamilyRewards()`. Rewards only get synced when `updateRewards()` is called directly. However, Game.tsx calls `onUpdateAppData()` (which maps to `updateAppData`) for reward changes, NOT `updateRewards()`. This means **reward changes from the Game component may not be syncing to Firestore in cloud mode**.

**Decision**: The `updateAppData` function in the cloud provider needs to detect reward changes and sync them, OR the Game component's reward handlers need to call `updateRewards()` instead.

## R3: Cloud Provider updateAppData Gap

**Finding**: `updateAppData` in the cloud provider (`useDataProvider.ts:100`) only sets local React state. It does NOT write to Firestore. This is a critical gap.

When Game.tsx calls `onUpdateAppData({ ...appData, parentPin, rewardPresents: [...] })`, the cloud provider:
1. Updates local React state ✓
2. Does NOT call `updateFamilyRewards()` ✗
3. Does NOT save parentPin anywhere ✗

Profile saves work because Game.tsx calls `onSaveProfile()` separately, which maps to `saveProfile()` → `updateCloudProfile()`.

**Decision**: Modify `updateAppData` in the cloud provider to:
1. Detect parentPin changes and sync to Firestore
2. Detect rewardPresents changes and sync to Firestore

**Rationale**: This fixes the existing reward sync gap AND adds parentPin sync with a single change. The alternative (modifying every call site in Game.tsx) is more error-prone and invasive.

## R4: Migration of Parent PIN

**Finding**: `migrateLocalToCloud()` does NOT migrate `parentPin`. It only migrates profiles and rewardPresents.

**Decision**: Add parentPin migration to `migrateLocalToCloud()`.

**Rationale**: When a user transitions from local to cloud mode, their existing PIN should transfer. Otherwise they lose parental gating on the new cloud family.

## R5: Firestore Security Considerations

**Finding**: The parent PIN is a simple 4-digit numeric code used as a child-deterrent, not a security credential. It's entered on-device and compared client-side.

**Decision**: Store the PIN as a plain string in Firestore. No hashing needed.

**Rationale**: The PIN's threat model is "prevent a child from accidentally accessing parent controls." It's not protecting against network attackers or database breaches. Firestore security rules (which limit reads to family members) provide adequate protection. Adding hashing would add complexity without meaningful security benefit for this use case.

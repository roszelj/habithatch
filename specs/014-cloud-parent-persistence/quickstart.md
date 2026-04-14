# Quickstart: Cloud Parent Data Persistence

## What This Feature Does

Makes two pieces of parent-managed data persist in Firebase Firestore when the app is in cloud mode:
1. **Parent PIN** — the 4-digit code that locks the parent management panel
2. **Rewards** — custom rewards with names and coin prices (already partially synced; this fixes a gap in the `updateAppData` flow)

## Files to Modify

| File | Change |
|------|--------|
| `src/firebase/families.ts` | Add `parentPin` to `FamilyData` interface; add `updateFamilyPin()` function |
| `src/firebase/listeners.ts` | Add `parentPin` to `FamilySnapshot` interface |
| `src/hooks/useDataProvider.ts` | Update cloud provider to sync parentPin and rewardPresents changes in `updateAppData`; read parentPin from family snapshot |
| `src/firebase/migration.ts` | Add parentPin to `migrateLocalToCloud()` |

## No Files to Create

This feature extends existing infrastructure. No new files needed.

## How to Test

1. **Cloud PIN sync**: Sign in as parent → set PIN → open another browser/incognito → sign in → verify PIN is required
2. **Cloud rewards sync**: Sign in as parent → create reward → check second device → verify reward appears
3. **Local mode unchanged**: Use app without signing in → set PIN → create rewards → refresh page → verify everything persists locally
4. **Migration**: Use app locally with PIN and rewards → sign up for cloud → verify PIN and rewards appear on cloud

## Key Architectural Decisions

- Parent PIN is stored on the `families/{familyId}` document (same as rewards) because it's family-level data
- The cloud provider's `updateAppData` is enhanced to detect and sync parentPin/rewards changes, rather than modifying every call site in Game.tsx
- No hashing for PIN — it's a child-deterrent, not a security credential

# Data Model: Child Real Name

## Entity Changes

### ChildProfile (modified)

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `childName` | string or null | No | The child's real name, set by the parent. Null for profiles created before this feature or when the parent hasn't set one. Max 20 characters. |

**Existing fields unchanged**: `id`, `creatureType`, `creatureName`, `health`, `points`, `coins`, `chores`, `outfitId`, `accessoryId`, `ownedOutfits`, `ownedAccessories`, `habitatId`, `ownedHabitats`, `streak`, `notifications`, `redeemedRewards`, `lastPlayedDate`

### Validation Rules

- `childName` must be 1–20 characters when provided (trimmed of leading/trailing whitespace)
- `childName` may contain any printable characters including emoji
- `childName` is optional — null is a valid value (backward compatibility)
- Duplicate child names across profiles are permitted

### Display Logic

| Context | Primary Label | Secondary Label |
|---------|--------------|-----------------|
| Profile picker (parent view) | `childName` (if set) | `creatureName` below |
| Profile picker (no childName) | `creatureName` | — |
| Parent panel child selector | `childName` (if set) | `creatureName` in parenthetical |
| Parent panel sections | `childName` (if set) | `creatureName` fallback |
| Child's game view | `creatureName` only | — (childName never shown) |

### Migration

- Existing profiles: `childName` defaults to `null`
- No data migration script needed — the app code treats missing/undefined `childName` as `null`
- Firestore documents: field is simply absent on old profiles (Firestore is schemaless)
- localStorage: migration function adds `childName: null` when loading old profiles

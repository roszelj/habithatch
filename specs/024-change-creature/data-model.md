# Data Model: Change Creature

**Feature**: 024-change-creature | **Date**: 2026-04-07

---

## Changed Entities

### ChildProfile (existing — minimal change)

`creatureType` and `creatureName` already exist on `ChildProfile`. No schema migration needed.

What changes: `Game.tsx` now manages these two fields as local mutable state (promoted from initial-only `profile` prop values), so they can be changed at runtime and included in the next auto-save.

| Field          | Type           | Notes                                         |
|----------------|----------------|-----------------------------------------------|
| `creatureType` | `CreatureType` | Existing field — now writable during gameplay |
| `creatureName` | `string`       | Existing field — now writable during gameplay |

**Validation**:
- `creatureName`: 1–20 characters (same as `NamingStep.tsx` `MAX_NAME_LENGTH = 20`)
- `creatureType`: must be one of `ALL_CREATURE_TYPES`

---

## New Components (UI only, no data persistence changes)

### ChangeCreatureScreen

| Prop          | Type                                            | Description                              |
|---------------|-------------------------------------------------|------------------------------------------|
| `currentType` | `CreatureType`                                  | Pre-selects this type in the grid        |
| `currentName` | `string`                                        | Pre-fills the name input                 |
| `onConfirm`   | `(type: CreatureType, name: string) => void`    | Called when kid taps Confirm             |
| `onCancel`    | `() => void`                                    | Called when kid taps Cancel              |

**Internal state**:
- `selectedType: CreatureType` — initialized from `currentType`; updates on grid tap
- `name: string` — initialized from `currentName`; user-editable

---

## No migrations required

`creatureType` and `creatureName` are already serialized in every saved profile. Existing profiles load correctly with no changes to `useSaveData.ts` or Firestore schema.

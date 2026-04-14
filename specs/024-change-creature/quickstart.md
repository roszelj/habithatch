# Quickstart: Change Creature

**Feature**: 024-change-creature | **Date**: 2026-04-07

---

## Scenario 1 — Kid changes to a different creature (US1)

**Setup**: Kid is on the main pet screen playing as "Buddy" (corgi).

**Flow**:
1. Kid taps "Change Creature" in the toolbar
2. `ChangeCreatureScreen` mounts with `currentType='corgi'`, `currentName='Buddy'`
3. All 18 creature types appear in a grid; corgi is highlighted
4. Kid taps "Dragon" → `selectedType` updates to `'dragon'`, preview updates
5. Name field still shows "Buddy" (unchanged)
6. Kid taps Confirm → `onConfirm('dragon', 'Buddy')` fires
7. `Game.tsx` `handleCreatureChange('dragon', 'Buddy')` runs:
   - `setCreatureType('dragon')`
   - `setCreatureName('Buddy')`
   - `setView('pet')`
8. Pet view renders with dragon sprite; "Buddy" label unchanged
9. Auto-save fires (creatureType changed in deps) → profile saved with new creatureType

**Expected result**: Dragon sprite shown, all stats/coins/chores intact, "Buddy" name preserved. Persists on next load.

---

## Scenario 2 — Kid changes creature AND renames (US2)

**Setup**: Same as Scenario 1.

**Flow**:
1. Kid taps "Change Creature"
2. Taps "Sloth" → `selectedType = 'sloth'`
3. Clears the name field, types "Mango"
4. Taps Confirm → `onConfirm('sloth', 'Mango')`
5. `setCreatureType('sloth')`, `setCreatureName('Mango')`, `setView('pet')`
6. Pet view shows sloth with "Mango" label

**Expected result**: Sloth sprite shown, name "Mango" displayed everywhere (pet view, parent panel).

---

## Scenario 3 — Kid dismisses without confirming (cancel)

**Setup**: Kid opens the picker, taps on a different creature, then taps Cancel.

**Flow**:
1. `ChangeCreatureScreen` opens
2. Kid taps "Panda" → `selectedType = 'panda'`
3. Kid taps Cancel → `onCancel()` fires → `setView('pet')`
4. No state changes were committed

**Expected result**: Original creature still shown; no changes.

---

## Scenario 4 — Kid tries to confirm with empty name (disabled button)

**Setup**: Kid opens the picker and clears the name field.

**Flow**:
1. `name` state = `''`
2. `trimmed.length === 0` → Confirm button is `disabled`
3. Kid cannot submit

**Expected result**: Confirm button is greyed out; no confirmation possible.

---

## Scenario 5 — Kid selects the same creature they already have

**Setup**: Kid is corgi. Opens picker, clicks corgi, taps Confirm.

**Flow**:
1. `selectedType = 'corgi'` (same as before)
2. Confirm fires → `setCreatureType('corgi')` (no visible change), `setView('pet')`

**Expected result**: Same creature shown; if name was changed it is saved. No errors.

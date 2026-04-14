# Quickstart: Update Habitat Images

**Feature**: 021-habitat-images | **Date**: 2026-04-07

## Integration Scenarios

### Scenario 1 — Store displays 9 illustrated habitat cards

**Setup**: App loaded, store open, Habitats tab selected.

**Flow**:
1. `HABITATS` array (from `habitats.ts`) is passed to the store habitat section
2. For each habitat `h`, render `<img src={h.image} alt={h.name} className={styles.habitatCardImage} />`
3. The image fills the card with `object-fit: cover`

**Expected result**: All 9 habitat cards show their illustrated PNG. No emoji text visible.

---

### Scenario 2 — Game screen shows equipped habitat as backdrop

**Setup**: Profile has `habitatId = 'candy-village'` (purchased and equipped).

**Flow**:
1. `Game.tsx` resolves `activeHabitat` from `HABITATS.find(h => h.id === profile.habitatId)`
2. Renders `<div className={styles.habitatBackground}><img src={activeHabitat.image} ... /></div>`
3. `.habitatBackground` is `position: absolute; inset: 0; overflow: hidden; opacity: 0.25`
4. The `<img>` fills it with `width: 100%; height: 100%; object-fit: cover`

**Expected result**: Candy Village illustrated scene fills the game backdrop at 25% opacity behind the creature.

---

### Scenario 3 — No habitat equipped (default state)

**Setup**: Profile has `habitatId = null`.

**Flow**:
1. `activeHabitat` is `undefined`
2. `Game.tsx` renders nothing for `.habitatBackground` (conditional rendering)

**Expected result**: Plain game background, no broken image or error.

---

### Scenario 4 — Migration clears old habitat ID on load

**Setup**: Profile in localStorage has `habitatId = 'space'` (old emoji habitat).

**Flow**:
1. `useSaveData.ts` loads profile
2. `VALID_HABITAT_IDS.has('space')` → false
3. `profile.habitatId` set to `null`
4. `profile.ownedHabitats` filtered to `[]` (old IDs removed)

**Expected result**: Profile loads without error, no habitat equipped, no crash.

---

### Scenario 5 — Old `beach` ID preserved

**Setup**: Profile has `habitatId = 'beach'` and `ownedHabitats = ['beach']`.

**Flow**:
1. `VALID_HABITAT_IDS.has('beach')` → true (new catalog includes `beach`)
2. No change needed

**Expected result**: Profile keeps the beach habitat equipped, displayed with the new illustrated image.

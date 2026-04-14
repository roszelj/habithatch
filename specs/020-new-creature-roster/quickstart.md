# Quickstart: New Creature Roster

**Feature**: 020-new-creature-roster

## Manual Verification Flow

### Test 1 — Selection Screen Shows All 18 Creatures

1. Open the app, skip auth (local mode), or start creature creation.
2. **Expected**: The selection screen shows an 18-creature grid, each displaying the correct illustrated image with a name label below.
3. Verify Pack 1 creatures (corgi, samoyed, husky, panda, chick, bunny, calico, tiger, monkey) and Pack 2 creatures (sloth, dragon, snake, gecko, cockatoo, fish, giraffe, elephant, leopard) are all present.

### Test 2 — Correct Sprite at Each Grid Position

For each creature on the selection screen:
1. Compare the rendered image to the expected creature from the pack PNG.
2. **Expected**: No creature shows the wrong animal (this would indicate a col/row position is swapped).

### Test 3 — Creature in Game Screen

1. Select any creature, name it, enter the game.
2. **Expected**: The creature's illustrated image appears in the game at the correct size (~150–200px). Bounce animation plays on interaction. Wobble animation plays when health is low.

### Test 4 — Profile Picker Cards

1. Create 2+ profiles with different creatures.
2. Return to "Who's playing?" screen.
3. **Expected**: Each profile card shows the correct creature image.

### Test 5 — Naming Step Preview

1. Select any creature, reach the naming step.
2. **Expected**: The chosen creature is displayed as an image (not an emoji box/missing character).

### Test 6 — Migration of Old Profiles

1. If testing with existing local data (bird/turtle/cat/dog profiles):
2. **Expected**: After migration, existing profiles show their mapped new creature (bird→chick, turtle→gecko, cat→calico, dog→corgi) — no blank or broken creature displays.

## Files Changed

| File | Change |
|------|--------|
| `src/models/types.ts` | New `CreatureType` (18 types), new `CreatureSpritePosition` interface, updated `CREATURE_SPRITES`, `CREATURE_LABELS`, `DEFAULT_NAMES`, `ALL_CREATURE_TYPES` |
| `src/components/CreatureSprite.tsx` | New shared component for sprite sheet rendering |
| `src/components/Creature.tsx` | Use `<CreatureSprite>` instead of emoji text |
| `src/components/Creature.module.css` | Replace `.bodyEmoji` font-size rules with image sizing |
| `src/components/SelectionScreen.tsx` | Use `<CreatureSprite>` instead of emoji text |
| `src/components/SelectionScreen.module.css` | Update `.cardSprite` for image sizing |
| `src/components/NamingStep.tsx` | Use `<CreatureSprite>` instead of emoji text |
| `src/components/NamingStep.module.css` | Update `.sprite` for image sizing |
| `src/components/ProfilePicker.tsx` | Use `<CreatureSprite>` instead of emoji text |
| `src/components/ProfilePicker.module.css` | Update `.cardSprite` for image sizing |
| `src/firebase/migration.ts` | Add `migrateCreatureType()` function |
| `src/hooks/useSaveData.ts` | Apply `migrateCreatureType()` when loading local profiles |
| `public/creature-charactors/` | Add both PNG files here |

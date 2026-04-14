# Implementation Plan: New Creature Roster

**Branch**: `020-new-creature-roster` | **Date**: 2026-04-07 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/020-new-creature-roster/spec.md`

## Summary

Replace the 4 current emoji-based creature types (bird, turtle, cat, dog) with 18 illustrated creatures from two 3×3 PNG sprite sheets. The rendering approach switches from emoji `<span>` text to CSS background-position sprite sheet technique via a new shared `CreatureSprite` component. Existing profiles are migrated to the closest matching new creature type.

## Technical Context

**Language/Version**: TypeScript 5.6
**Primary Dependencies**: React 19, Vite 5, CSS Modules
**Storage**: N/A (static asset change + data migration)
**Testing**: `npm run build` (TypeScript gate)
**Target Platform**: Web browser (mobile-first)
**Project Type**: React SPA
**Performance Goals**: Creature images load without perceptible delay; sprite sheet technique avoids extra HTTP requests
**Constraints**: No external image processing tools; two PNG sprite sheets are the only new assets
**Scale/Scope**: 12 files changed, 1 new component, 2 new assets

## Constitution Check

| Principle | Assessment | Pass/Fail |
|-----------|-----------|-----------|
| I. Fun-First Design | 18 unique illustrated characters dramatically expand creature variety and visual delight. Each kid finds a creature that feels uniquely theirs — a direct joy improvement. | PASS |
| II. Ship & Iterate | Clear scope: replace 4 with 18, one new component, migration function. Deliverable in a single cycle. | PASS |
| III. Kid-Safe Always | All new creatures are age-appropriate illustrated animals. No PII changes. Image assets are local (no external CDN). | PASS |

**Verdict**: All gates pass. Proceed.

## Project Structure

### Documentation (this feature)

```text
specs/020-new-creature-roster/
├── plan.md          ← this file
├── research.md      ← 5 decisions + creature roster
├── data-model.md    ← type changes + migration mapping
├── quickstart.md    ← 6 manual test scenarios
└── tasks.md         ← Phase 2 output (/speckit-tasks)
```

### Source Code (files changed)

```text
public/
└── creature-charactors/
    ├── creature-happy-pack1.png   ← copied from repo root
    └── creature-happy-pack2.png   ← copied from repo root

src/
├── models/
│   └── types.ts                  ← CreatureType (18), CREATURE_SPRITES, labels, migration
├── components/
│   ├── CreatureSprite.tsx         ← NEW: shared sprite sheet renderer
│   ├── Creature.tsx               ← use <CreatureSprite> instead of emoji
│   ├── Creature.module.css        ← update bodyEmoji → image sizing
│   ├── SelectionScreen.tsx        ← use <CreatureSprite> instead of emoji
│   ├── SelectionScreen.module.css ← update cardSprite sizing
│   ├── NamingStep.tsx             ← use <CreatureSprite> instead of emoji
│   ├── NamingStep.module.css      ← update sprite sizing
│   ├── ProfilePicker.tsx          ← use <CreatureSprite> instead of emoji
│   └── ProfilePicker.module.css   ← update cardSprite sizing
├── firebase/
│   └── migration.ts              ← add migrateCreatureType()
└── hooks/
    └── useSaveData.ts            ← apply migration when loading local profiles
```

## Phase 0: Research Findings

See [research.md](./research.md). Summary:

- **Sprite rendering**: CSS background-position sprite technique on a `<div>` with `background-size: 300% 300%`. Position formula: `col * 50%`, `row * 50%`.
- **Data structure**: `CREATURE_SPRITES` changes from `Record<CreatureType, Record<Mood, string>>` to `Record<CreatureType, { pack: 1|2; col: 0|1|2; row: 0|1|2 }>`.
- **Mood**: CSS animations only (unchanged). No per-mood images needed — current code already only uses `.happy`.
- **Asset location**: Copy PNGs to `public/creature-charactors/`.
- **Shared component**: `CreatureSprite.tsx` renders sprite CSS for all 4 consumer components.
- **Migration**: bird→chick, turtle→gecko, cat→calico, dog→corgi.

## Phase 1: Design

### Data Model

See [data-model.md](./data-model.md).

### Implementation Steps

#### Step 1 — Copy assets to public/

```
cp creature-charactors/creature-happy-pack1.png public/creature-charactors/creature-happy-pack1.png
cp creature-charactors/creature-happy-pack2.png public/creature-charactors/creature-happy-pack2.png
```

#### Step 2 — Update `src/models/types.ts`

1. Add `CreatureSpritePosition` interface: `{ pack: 1|2; col: 0|1|2; row: 0|1|2 }`
2. Replace `CreatureType` union with 18 new types
3. Replace `CREATURE_SPRITES` with new `Record<CreatureType, CreatureSpritePosition>` mapping all 18 creatures to their grid positions (verify positions against actual PNG during implementation)
4. Update `CREATURE_LABELS` with 18 display names
5. Update `DEFAULT_NAMES` with 18 default creature names
6. Update `ALL_CREATURE_TYPES` array to list all 18

#### Step 3 — Create `src/components/CreatureSprite.tsx`

A minimal component:
```tsx
interface CreatureSpriteProps {
  creatureType: CreatureType;
  size: number;
}

export function CreatureSprite({ creatureType, size }: CreatureSpriteProps) {
  const sprite = CREATURE_SPRITES[creatureType];
  const url = sprite.pack === 1
    ? '/creature-charactors/creature-happy-pack1.png'
    : '/creature-charactors/creature-happy-pack2.png';
  return (
    <div style={{
      width: size,
      height: size,
      backgroundImage: `url(${url})`,
      backgroundSize: '300% 300%',
      backgroundPosition: `${sprite.col * 50}% ${sprite.row * 50}%`,
      backgroundRepeat: 'no-repeat',
      imageRendering: 'auto',
    }} />
  );
}
```

#### Step 4 — Update `src/components/Creature.tsx`

Replace:
```tsx
<div className={styles.bodyEmoji}>{bodyEmoji}</div>
```
With:
```tsx
<CreatureSprite creatureType={creatureType} size={160} />
```
Remove the `CREATURE_SPRITES` import and `bodyEmoji` constant.

Update `Creature.module.css`: remove `font-size: 8rem; line-height: 1` from `.bodyEmoji`. Add sizing to accommodate 160px image. Keep bounce/wobble animation targeting the sprite element.

#### Step 5 — Update `src/components/SelectionScreen.tsx`

Replace:
```tsx
<span className={styles.cardSprite}>{CREATURE_SPRITES[type].happy}</span>
```
With:
```tsx
<CreatureSprite creatureType={type} size={80} />
```
Remove `CREATURE_SPRITES` from imports. Update `SelectionScreen.module.css` `.cardSprite` to remove `font-size: 4rem`.

#### Step 6 — Update `src/components/NamingStep.tsx`

Replace:
```tsx
<div className={styles.sprite}>{CREATURE_SPRITES[creatureType].happy}</div>
```
With:
```tsx
<CreatureSprite creatureType={creatureType} size={120} />
```
Remove `CREATURE_SPRITES` from imports. Update `NamingStep.module.css` to accommodate 120px image.

#### Step 7 — Update `src/components/ProfilePicker.tsx`

Replace:
```tsx
<span className={styles.cardSprite}>{CREATURE_SPRITES[p.creatureType].happy}</span>
```
With:
```tsx
<CreatureSprite creatureType={p.creatureType} size={70} />
```
Remove `CREATURE_SPRITES` from imports. Update `ProfilePicker.module.css` `.cardSprite` to remove `font-size: 3rem`.

#### Step 8 — Add migration in `src/firebase/migration.ts`

Add:
```ts
const LEGACY_CREATURE_MAP: Record<string, CreatureType> = {
  bird: 'chick',
  turtle: 'gecko',
  cat: 'calico',
  dog: 'corgi',
};

export function migrateCreatureType(type: string): CreatureType {
  return (LEGACY_CREATURE_MAP[type] ?? type) as CreatureType;
}
```

#### Step 9 — Apply migration in `src/hooks/useSaveData.ts`

When `loadAppData()` reads profiles from localStorage, apply `migrateCreatureType(profile.creatureType)` to each profile's `creatureType`. This handles the local/guest mode case. Cloud profiles will be migrated passively on next read (the display code will call `migrateCreatureType` if the stored type is an old key).

### Contracts

No external contracts. UI-only and data-model change.

## Complexity Tracking

No constitution violations. No complexity table needed.

## ⚠️ Implementation Note: Verify Sprite Grid Positions

The creature-to-grid-position mapping in `research.md` is based on visual analysis of the PNG thumbnails. During implementation, **each position must be verified** by rendering the sprite and checking it shows the correct creature. Positions (col, row) may need adjustment if the visual analysis was off. The CSS approach makes this trivial to fix — just update the col/row values in `CREATURE_SPRITES`.

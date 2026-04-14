# Implementation Plan: Update Habitat Images

**Branch**: `021-habitat-images` | **Date**: 2026-04-07 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/021-habitat-images/spec.md`

## Summary

Replace the 7 emoji-based habitats with 9 illustrated PNG habitats. The `Habitat` data model drops the `emoji` field in favour of an `image` path. Store cards and the game backdrop both switch from rendering emoji text to `<img>` elements. Old habitat IDs are migrated or cleared on load.

## Technical Context

**Language/Version**: TypeScript 5.6
**Primary Dependencies**: React 19, Vite 5, CSS Modules
**Storage**: N/A (static asset + data model change)
**Testing**: `npm run build` (TypeScript gate)
**Target Platform**: Web browser (mobile-first)
**Project Type**: React SPA
**Performance Goals**: Habitat images load without perceptible delay; images are already in `public/` so no additional HTTP overhead vs emojis
**Constraints**: No external image tools; 9 PNG files in `public/creature-habitats/` are the only new assets
**Scale/Scope**: 5 files changed, no new components required

## Constitution Check

| Principle | Assessment | Pass/Fail |
|-----------|-----------|-----------|
| I. Fun-First Design | Illustrated habitat scenes are dramatically more visually engaging for kids than emoji glyphs. The backdrop fills the creature stage with a rich illustrated world. | PASS |
| II. Ship & Iterate | Scope is minimal: swap emoji for image in two render locations plus the data model. Deliverable in a single cycle. | PASS |
| III. Kid-Safe Always | All 9 habitat images are age-appropriate illustrated scenes. Assets are local — no CDN or external fetch. No PII involved. | PASS |

**Verdict**: All gates pass. Proceed.

## Project Structure

### Documentation (this feature)

```text
specs/021-habitat-images/
├── plan.md          ← this file
├── research.md      ← Phase 0 output
├── data-model.md    ← Phase 1 output
├── quickstart.md    ← Phase 1 output
└── tasks.md         ← Phase 2 output (/speckit-tasks)
```

### Source Code (files changed)

```text
src/
├── models/
│   ├── types.ts          ← Habitat interface: drop emoji, add image
│   └── habitats.ts       ← Replace 7 emoji habitats with 9 image habitats
├── components/
│   ├── Store.tsx          ← Habitat section: <span emoji> → <img>
│   ├── Store.module.css   ← Habitat card image sizing
│   ├── Game.tsx           ← habitatBackground: emoji text → <img>
│   └── Game.module.css    ← .habitatBackground: emoji sizing → image fill
└── hooks/
    └── useSaveData.ts     ← Filter unrecognised habitatId and ownedHabitats on load

public/creature-habitats/   ← Already present — no changes needed
    01_water_park.png
    02_beach.png
    03_cosy_bedroom.png
    04_waterfall_forest.png
    05_candy_village.png
    06_magic_forest_pond.png
    07_sunny_farm.png
    08_snowy_cabin.png
    09_fairytale_castle.png
```

## Phase 0: Research

### Decision 1 — Habitat Image Display in Store Cards

**Decision**: Use `<img>` with `object-fit: cover` inside the existing `.card` layout for habitat cards. The card already has a fixed height; an image fills it more engagingly than a centred emoji.

**Rationale**: Consistent with the `CreatureSprite` approach used for creature cards in `SelectionScreen`. `object-fit: cover` fills the card area without distortion.

**Alternatives considered**: CSS `background-image` on the card element — rejected because it complicates the existing flex card layout and requires more CSS restructuring.

### Decision 2 — Habitat Backdrop in Game Screen

**Decision**: Replace the emoji text inside `.habitatBackground` with an `<img>` styled `width: 100%; height: 100%; object-fit: cover; opacity: 0.4`.

**Rationale**: The `.habitatBackground` div is already `position: absolute; inset: 0` — a perfect container for a full-bleed cover image. No layout changes needed; just swap the emoji text for an image element and remove the `font-size` rule.

**Alternatives considered**: `background-image` CSS property on `.habitatBackground` itself — viable but requires passing the image URL via inline style, which is slightly more complex than a simple `<img>` inside the div.

### Decision 3 — New Habitat IDs and Migration

**Decision**: New habitat IDs are derived from filenames (e.g., `01_water_park.png` → id `water-park`). One legacy ID maps cleanly: old `beach` → new `beach`. All other old IDs (`bedroom`, `forest`, `desert`, `rainforest`, `space`, `amusement`) are cleared on load (habitatId reset to null, ownedHabitats filtered to valid new IDs only).

**Rationale**: Clearing unknown IDs is safe, silent, and avoids broken display. The `beach` identity is preserved as a natural upgrade — users who owned the old emoji beach get the new illustrated beach automatically.

**Migration map**:
| Old ID | Action |
|--------|--------|
| `beach` | Keep → maps to new `beach` |
| `bedroom` | Clear |
| `forest` | Clear |
| `desert` | Clear |
| `rainforest` | Clear |
| `space` | Clear |
| `amusement` | Clear |

### Decision 4 — `Habitat` Interface Change

**Decision**: Replace `emoji: string` with `image: string` on the `Habitat` interface in `types.ts`. Remove the `emoji` field entirely.

**Rationale**: The `emoji` field is only used in `Store.tsx` and `Game.tsx` — both are being updated. No other consumers. A clean removal avoids dead fields.

## Phase 1: Design

### Data Model

See [data-model.md](./data-model.md).

### Implementation Steps

#### Step 1 — Update `Habitat` interface in `src/models/types.ts`

Replace:
```ts
export interface Habitat {
  id: HabitatId;
  name: string;
  emoji: string;
  price: number;
}
```
With:
```ts
export interface Habitat {
  id: HabitatId;
  name: string;
  image: string;  // path to PNG, e.g. '/creature-habitats/02_beach.png'
  price: number;
}
```

#### Step 2 — Rewrite `src/models/habitats.ts`

Replace all 7 emoji entries with 9 image-based entries:

```ts
export const HABITATS: Habitat[] = [
  { id: 'water-park',       name: 'Water Park',       image: '/creature-habitats/01_water_park.png',       price: 20 },
  { id: 'beach',            name: 'Beach',             image: '/creature-habitats/02_beach.png',             price: 20 },
  { id: 'cosy-bedroom',     name: 'Cosy Bedroom',      image: '/creature-habitats/03_cosy_bedroom.png',      price: 20 },
  { id: 'waterfall-forest', name: 'Waterfall Forest',  image: '/creature-habitats/04_waterfall_forest.png',  price: 25 },
  { id: 'candy-village',    name: 'Candy Village',     image: '/creature-habitats/05_candy_village.png',     price: 25 },
  { id: 'magic-forest-pond',name: 'Magic Forest',      image: '/creature-habitats/06_magic_forest_pond.png', price: 25 },
  { id: 'sunny-farm',       name: 'Sunny Farm',        image: '/creature-habitats/07_sunny_farm.png',        price: 30 },
  { id: 'snowy-cabin',      name: 'Snowy Cabin',       image: '/creature-habitats/08_snowy_cabin.png',       price: 30 },
  { id: 'fairytale-castle', name: 'Fairytale Castle',  image: '/creature-habitats/09_fairytale_castle.png',  price: 35 },
];
```

#### Step 3 — Update `src/components/Store.tsx` — habitat section

Replace `<span className={styles.cardEmoji}>{h.emoji}</span>` with:
```tsx
<img
  src={h.image}
  alt={h.name}
  className={styles.habitatCardImage}
/>
```

#### Step 4 — Update `src/components/Store.module.css`

Add `.habitatCardImage`:
```css
.habitatCardImage {
  width: 100%;
  aspect-ratio: 16 / 9;
  object-fit: cover;
  border-radius: 6px;
}
```

Remove or leave unused `.cardEmoji` (it's still used by outfits/accessories sections, so leave it unchanged).

#### Step 5 — Update `src/components/Game.tsx` — backdrop

In both the `pet` view and `store` view, replace:
```tsx
<div className={styles.habitatBackground}>{activeHabitat.emoji}</div>
```
With:
```tsx
<div className={styles.habitatBackground}>
  <img src={activeHabitat.image} alt={activeHabitat.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
</div>
```

#### Step 6 — Update `src/components/Game.module.css`

Remove `font-size: 7rem` from `.habitatBackground`. It already has `position: absolute; inset: 0; overflow: hidden` — the `<img>` will fill it naturally. Keep `opacity: 0.25` for the subtle backdrop effect.

#### Step 7 — Migration in `src/hooks/useSaveData.ts`

Add a `VALID_HABITAT_IDS` set (the 9 new IDs). When loading profiles, filter:
```ts
profile.habitatId = VALID_HABITAT_IDS.has(profile.habitatId) ? profile.habitatId : null;
profile.ownedHabitats = (profile.ownedHabitats ?? []).filter(id => VALID_HABITAT_IDS.has(id));
```
Exception: old `beach` → new `beach` maps cleanly since the ID is unchanged.

### Contracts

No external contracts. UI-only and data-model change.

## Complexity Tracking

No constitution violations. No complexity table needed.

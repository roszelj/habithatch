# Research: Creature View Redesign

## Finding 1 — Current Habitat Background Scope

**Current state**: `.habitatBackground` uses `position: absolute; inset: 0; z-index: 0` inside `.game`, which makes it fill the entire screen — behind the title, streak, points, toolbar, and everything else.

**Decision**: Scope the habitat background to a new dedicated `.creatureStage` wrapper div that contains only the creature. The `.game` container loses `position: relative` dependence on the background; the stage div becomes the new habitat canvas.

**Rationale**: A habitat is an environment for the creature, not for the whole app UI. Filling the creature's stage creates a clear visual "scene" — like a diorama — while keeping the UI controls (points, actions, toolbar) clean and readable outside it.

---

## Finding 2 — Outfit/Accessory Display Reorganization

**Current state**: Outfit and accessory emojis are overlaid on the creature sprite (absolute positioned inside the 200×200px `.body` div). There is no separate UI element elsewhere that shows what's currently equipped.

**Decision**: Keep the overlays on the creature sprite (they visually dress the creature). Add a new `.equipmentRow` below the creature stage with two tappable boxes — "Outfits" and "Accessories" — each showing the equipped item's emoji (or a placeholder icon) and its label. Tapping either box navigates to the store (`setView('store')`).

**Rationale**: The overlays are the visual payoff — removing them would make the equipped items invisible on the creature. The new boxes serve as quick-access indicators and store shortcuts, giving kids a clear "what am I wearing?" summary without hunting through the store.

---

## Finding 3 — Creature Stage Design

**Decision**: The `.creatureStage` div will:
- Use `position: relative` (contains the absolute habitat background)
- Have `overflow: hidden` and `border-radius: 20px` (visual boundary for the habitat)
- Include a subtle border or background color for when no habitat is equipped
- Auto-size to fit the creature (no fixed height — let the creature content set the height naturally)
- Appear directly after the title, above the equipment row

**No size constraints needed**: The `<Creature>` component is 200×200px for the body. The stage just wraps it with some padding so the habitat background has breathing room.

---

## Finding 4 — Files to Change

Only CSS and JSX layout changes — no data model, no new components, no new files needed:

| File | Change |
|------|--------|
| `src/components/Game.tsx` | Wrap `<Creature>` in `.creatureStage`; move habitat bg render inside stage; add `.equipmentRow` with two `.equipBox` divs |
| `src/components/Game.module.css` | Add `.creatureStage`, update `.habitatBackground` (remove inset:0, use full fill within stage), add `.equipmentRow` + `.equipBox` styles |

No changes to `Creature.tsx` or `Creature.module.css` — overlays stay as-is.

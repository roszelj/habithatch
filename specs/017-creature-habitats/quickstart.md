# Quickstart: Creature View Redesign

## What This Changes

Redesigns the main game screen layout:
1. **Habitat background** moves from full-screen to a contained "creature stage" box around the creature
2. **New equipment row** below the stage: two labeled boxes (Outfits, Accessories) showing what's equipped; tapping opens the store

## New Layout (main pet view)

```
HabitHatch

┌─────────────────────────┐
│  [habitat background]    │  ← .creatureStage (rounded, bordered, overflow hidden)
│                          │
│      🐱 (creature)       │
│   🧸 🎩 (overlays)       │
│                          │
└─────────────────────────┘

[ Outfits  🧸 ]  [ Accessories  🕶️ ]  ← .equipmentRow — taps open store

[streak]
[points]  [stats]
[actions]
[toolbar]
```

## Files Changed

| File | Change |
|------|--------|
| `src/components/Game.tsx` | Wrap `<Creature>` in `.creatureStage` div; move habitat background inside stage; add `.equipmentRow` with two `.equipBox` buttons below |
| `src/components/Game.module.css` | Add `.creatureStage`, revise `.habitatBackground` to fill stage, add `.equipmentRow` + `.equipBox` styles |

## CSS Details

### `.creatureStage`
```css
position: relative;
width: 100%;
display: flex;
align-items: center;
justify-content: center;
border-radius: 20px;
overflow: hidden;
background: rgba(255, 255, 255, 0.05);
border: 2px solid rgba(255, 255, 255, 0.1);
padding: 16px;
```

### `.habitatBackground` (inside stage, not the full game)
```css
position: absolute;
inset: 0;
z-index: 0;
display: flex;
align-items: center;
justify-content: center;
font-size: 7rem;
opacity: 0.25;
overflow: hidden;
pointer-events: none;
```

### `.equipmentRow`
```css
display: flex;
gap: 12px;
width: 100%;
```

### `.equipBox`
```css
flex: 1;
display: flex;
flex-direction: column;
align-items: center;
gap: 4px;
padding: 10px 8px;
background: rgba(255, 255, 255, 0.08);
border: 2px solid rgba(255, 255, 255, 0.15);
border-radius: 12px;
cursor: pointer;
font-family: inherit;
color: #fff;
```

## How to Test

1. Open app on main game screen — creature should be in a boxed stage with the habit background inside it
2. Equip a habitat — verify background appears inside the stage box, not behind the whole screen
3. No habitat equipped — stage box shows a plain subtle background
4. Equipment row shows correct emoji for equipped outfit/accessory (or placeholder if none)
5. Tap "Outfits" box → store opens; tap "Accessories" box → store opens
6. Store view — verify creature stage also shows habitat background in the store preview

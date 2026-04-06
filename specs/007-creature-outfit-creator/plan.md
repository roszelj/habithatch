# Implementation Plan: Creature Outfit Creator

**Branch**: `007-creature-outfit-creator` | **Date**: 2026-04-02

## Summary

Replace single-emoji creatures with full-size layered characters.
Creature = body emoji (large) + face/mood emoji (overlay) + outfit
emoji + accessory emoji, all CSS-positioned. Add outfit/accessory
selection steps to creation flow. Add Wardrobe button to change
outfit/accessory anytime. Persist choices in save data.

## Approach

Use emoji composition with CSS absolute positioning to layer:
1. Body: large creature emoji (type-specific)
2. Mood: smaller face overlay (mood-specific)
3. Outfit: emoji positioned on body
4. Accessory: emoji positioned on head area

No image assets needed — pure emoji + CSS.

## Changes

```text
src/models/types.ts           # Outfit, Accessory types + data
src/models/outfits.ts         # NEW — outfit/accessory catalog
src/components/Creature.tsx    # Layered composed display
src/components/Creature.module.css
src/components/OutfitPicker.tsx    # NEW — outfit selection step
src/components/OutfitPicker.module.css
src/components/AccessoryPicker.tsx # NEW — accessory selection step  
src/components/AccessoryPicker.module.css
src/components/Wardrobe.tsx    # NEW — change outfit/accessory in-game
src/components/Game.tsx        # Add wardrobe toggle + outfit/accessory props
src/hooks/useSaveData.ts       # Add outfit/accessory to SaveData
src/App.tsx                    # Add outfit/accessory steps to creation flow
tests/outfits.test.ts         # NEW — catalog completeness tests
```

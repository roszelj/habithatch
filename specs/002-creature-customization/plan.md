# Implementation Plan: Creature Customization

**Branch**: `002-creature-customization` | **Date**: 2026-04-02 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/002-creature-customization/spec.md`

## Summary

Add creature type selection (Bird, Turtle, Cat, Dog) with type-specific
emoji visuals across all mood states, plus an optional naming step. The
App gains a selection screen before the game starts. Existing game
mechanics are unchanged — creature type is cosmetic only.

## Technical Context

**Language/Version**: TypeScript 5.x (existing)
**Primary Dependencies**: React 19, Vite 5 (existing)
**Storage**: N/A
**Testing**: Vitest 1.x (existing)
**Target Platform**: Web browser
**Project Type**: Web application (single-page, client-only)
**Performance Goals**: 60fps, <200ms interaction feedback
**Constraints**: No PII, kid-safe, no network
**Scale/Scope**: 4 creature types, 1 selection screen, 1 naming input

## Constitution Check

| Principle | Gate | Status |
|-----------|------|--------|
| I. Fun-First | Selection screen is playful and engaging | PASS — large emoji cards with hover effects |
| I. Fun-First | Type-specific visuals spark delight | PASS — unique emoji per type per mood (16 total) |
| II. Ship & Iterate | Scoped to single increment | PASS — adds selection screen + type data, no other changes |
| III. Kid-Safe | No PII in naming input | PASS — name stored in React state only, never transmitted |
| III. Kid-Safe | Age-appropriate content | PASS — animal emojis only |

## Project Structure

### Source Code Changes

```text
src/
├── models/
│   └── types.ts              # Add CreatureType, CREATURE_SPRITES, DEFAULT_NAMES
├── hooks/
│   └── useCreature.ts        # Accept initial name + creatureType params
├── components/
│   ├── Creature.tsx           # Use creatureType for type-specific sprites
│   ├── SelectionScreen.tsx    # NEW — creature type picker grid
│   ├── SelectionScreen.module.css
│   ├── NamingStep.tsx         # NEW — name input with validation
│   ├── NamingStep.module.css
│   └── Game.tsx               # Accept creatureType prop
├── App.tsx                    # App state machine: select → name → play

tests/
├── useCreature.test.ts        # Update for new initial state params
└── creatureTypes.test.ts      # NEW — verify sprite mappings complete
```

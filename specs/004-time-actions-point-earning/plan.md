# Implementation Plan: Time-Based Actions & Point Earning

**Branch**: `004-time-actions-point-earning` | **Date**: 2026-04-02 | **Spec**: [spec.md](spec.md)

## Summary

Replace the three-stat system (hunger/happiness/energy) with a single
health percentage + point economy. Actions become Morning/Afternoon/
Evening (costing points, restoring health). Points are earned via a
chore checklist where kids check off real-world tasks. Also subsumes
feature 003 (health/point system).

## Technical Context

**Language/Version**: TypeScript 5.x
**Primary Dependencies**: React 19, Vite 5
**Testing**: Vitest 1.x
**Target Platform**: Web browser
**Project Type**: SPA, client-only

## Changes

```text
src/models/types.ts         # Replace 3 stats with health; new TimeAction, Chore types
src/hooks/useCreature.ts    # Single health + points state, time actions + decay
src/hooks/useChores.ts      # NEW — chore list management (add/remove/check/reset)
src/components/Game.tsx      # Single health bar, point display, time action buttons, chores button
src/components/StatBar.tsx   # Reuse for single health bar (no changes needed)
src/components/ActionButton.tsx # Add cost display + disabled state
src/components/ChoreList.tsx # NEW — chore checklist panel
src/components/ChoreList.module.css
tests/useCreature.test.ts   # Update for health/points
tests/useChores.test.ts     # NEW — chore logic tests
```

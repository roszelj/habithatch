# Implementation Plan: Categorized Chores + Persistence

**Branch**: `006-daily-reset-persist-points` | **Date**: 2026-04-02
Subsumes feature 005 (categorized chores) and 006 (daily reset + persistence).

## Summary

Replace single shared point pool with 3 per-category pools (morning/
afternoon/evening). Chores are grouped by category. Add localStorage
persistence for all game state. Auto-reset chore checkmarks on new
calendar day while preserving points and chore definitions.

## Changes

```text
src/models/types.ts          # CategoryPoints, CategoryChores, SaveData types
src/hooks/useCreature.ts     # Per-category points instead of single pool
src/hooks/useChores.ts       # Per-category chore lists
src/hooks/useSaveData.ts     # NEW — localStorage save/load + daily reset
src/components/Game.tsx       # Per-category point display, categorized chore panel
src/components/ChoreList.tsx  # Accept category, show per-category
src/components/ChorePanel.tsx # NEW — tabbed/sectioned view of 3 ChoreList
src/App.tsx                   # Load saved data, skip selection if exists
tests/useCreature.test.ts    # Per-category point tests
tests/useSaveData.test.ts    # NEW — save/load + daily reset tests
```

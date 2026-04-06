# Implementation Plan: Chore Streak Counter

**Branch**: `008-chore-streak-counter` | **Date**: 2026-04-06

## Summary

Add a streak counter tracking consecutive days of all-chores-complete.
Display on main game screen with visual scaling. Streak evaluated on
daily reset in useSaveData. Best streak tracked separately.

## Changes

```text
src/models/types.ts           # Add StreakData to SaveData
src/hooks/useSaveData.ts      # Streak evaluation on daily reset
src/components/StreakDisplay.tsx    # NEW — streak counter with flame visual
src/components/StreakDisplay.module.css
src/components/Game.tsx        # Add streak display + completion detection
tests/streak.test.ts          # NEW — streak logic tests
```

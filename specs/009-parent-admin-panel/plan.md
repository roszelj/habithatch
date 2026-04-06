# Implementation Plan: Parent Admin Panel

**Branch**: `009-parent-admin-panel` | **Date**: 2026-04-06

## Summary

Add Parent Mode with PIN protection. Parents manage chore lists and
approve/reject child completions. Chore status: unchecked → pending → approved.
Backward compatible when no PIN set.

## Changes

```text
src/models/types.ts              # ChoreStatus type, parentPin in SaveData
src/hooks/useChores.ts           # 3-state chore logic
src/hooks/useSaveData.ts         # Persist parentPin, reset pending on daily
src/components/PinEntry.tsx      # NEW — PIN create/verify screen
src/components/ParentPanel.tsx   # NEW — chore management + approval + dashboard
src/components/ChoreList.tsx     # parentMode prop: hide add/remove in kid mode
src/components/ChorePanel.tsx    # Pass parentActive flag
src/components/Game.tsx          # Parent button, pending chore logic
src/App.tsx                      # No changes needed (parent mode is in-game)
tests/parentMode.test.ts         # NEW — chore status + approval tests
```

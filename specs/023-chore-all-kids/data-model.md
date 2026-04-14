# Data Model: Chore for All Kids

**Feature**: 023-chore-all-kids | **Date**: 2026-04-07

## No New Persistent Entities

This feature introduces no new data model changes. Chores are already stored on each `ChildProfile` under `chores: CategoryChores`. The broadcast action simply calls the existing add-chore logic once per profile.

## Ephemeral UI State (ParentPanel)

| Field          | Type    | Description                                                            |
|----------------|---------|------------------------------------------------------------------------|
| forAllKids     | boolean | Whether the current add action should broadcast to all profiles. Default: `false`. |
| confirmMessage | string  | Brief confirmation shown after a successful broadcast. Auto-clears after 2s. |

## Affected Existing Entities

### Chore (unchanged shape)

| Field  | Type        | Description                          |
|--------|-------------|--------------------------------------|
| id     | string      | Unique ID (Date.now() string)        |
| name   | string      | Chore name, max 40 chars             |
| status | ChoreStatus | `'unchecked'` \| `'pending'` \| `'approved'` |

When `forAllKids` is true, N independent `Chore` instances are created (one per profile), each with their own unique `id`. They are entirely separate records — no shared state.

### ChildProfile (unchanged shape)

`chores.morning`, `chores.afternoon`, `chores.evening` each receive one new `Chore` entry when the broadcast fires for that profile.

## Broadcast Logic (not a data model change — UI logic only)

```
forAllKids = true, category = 'morning', name = 'Clean room'
  → for each profile p in profiles:
      onAddChore(p.id, 'morning', 'Clean room')
      → creates Chore { id: unique, name: 'Clean room', status: 'unchecked' }
         appended to p.chores.morning
```

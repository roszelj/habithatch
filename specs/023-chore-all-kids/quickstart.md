# Quickstart: Chore for All Kids

**Feature**: 023-chore-all-kids | **Date**: 2026-04-07

## Integration Scenarios

### Scenario 1 — Parent broadcasts a chore to all 3 children

**Setup**: 3 child profiles (Alice, Bob, Charlie). Parent is in Manage tab.

**Flow**:
1. Parent checks "Add for all kids" checkbox
2. Types "Clean your room" in the Morning add-input
3. Taps + button
4. `handleAdd('morning')` sees `forAllKids = true`
5. Loops: `onAddChore('alice-id', 'morning', 'Clean your room')`, `onAddChore('bob-id', ...)`, `onAddChore('charlie-id', ...)`
6. `confirmMessage = "Added to 3 kids!"`
7. Input cleared, message auto-clears after 2 seconds

**Expected result**: All three profiles have "Clean your room" in their morning chore list. Each is independent (separate `id`).

---

### Scenario 2 — Parent adds a chore for just one child (default behaviour unchanged)

**Setup**: 3 child profiles. Parent is in Manage tab, "Add for all kids" is unchecked (default).

**Flow**:
1. Parent selects Bob from the child selector
2. Types "Feed the dog" in the Evening input
3. Taps + button
4. `handleAdd('evening')` sees `forAllKids = false`
5. `onAddChore('bob-id', 'evening', 'Feed the dog')`
6. No confirmation message

**Expected result**: Only Bob's profile has "Feed the dog" in evening. Alice and Charlie are unaffected.

---

### Scenario 3 — Single-child family (checkbox hidden)

**Setup**: 1 child profile. Parent is in Manage tab.

**Flow**:
1. `profiles.length === 1` → "Add for all kids" checkbox is not rendered
2. Parent adds chore normally

**Expected result**: No checkbox visible. Normal single-add behaviour.

---

### Scenario 4 — Approving one child's chore doesn't affect another's

**Setup**: All three children received "Clean your room" via broadcast.

**Flow**:
1. Alice marks "Clean your room" as done (pending)
2. Parent approves Alice's chore
3. Bob and Charlie's "Clean your room" remain at `unchecked`

**Expected result**: Each copy is independent. Approving Alice's has zero effect on Bob or Charlie.

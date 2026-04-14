# Quickstart: Child Real Name

## Scenario 1: New Profile Creation

1. Start the app fresh (or reset)
2. Sign in as parent or skip auth
3. On creature selection, pick any creature
4. On the naming step:
   - Enter child's real name (e.g., "Emma")
   - Enter creature name (e.g., "Sparkles")
5. Verify: Profile picker shows "Emma" with "Sparkles" as secondary
6. Enter parent mode → verify parent panel shows "Emma" in child selector

## Scenario 2: Existing Profile (No Real Name)

1. Load app with existing profiles (created before this feature)
2. Go to profile picker → verify creature name is shown (no blank/error)
3. Enter parent mode → verify creature name is shown as fallback
4. Optionally set child name from parent panel

## Scenario 3: Parent Edits Real Name

1. Enter parent mode (via PIN or parent auth)
2. Find the edit option for a child's real name
3. Change the name (e.g., "Emma" → "Em")
4. Verify: Profile picker immediately shows "Em"
5. Verify: Parent panel sections show "Em"

## Scenario 4: Child Renames Creature

1. As a child, go to change creature name (e.g., "Sparkles" → "Mr. Wiggles")
2. Switch to parent mode
3. Verify: Parent panel still shows child's real name "Emma" (unchanged)
4. Verify: Creature name shows "Mr. Wiggles" as secondary

## Scenario 5: Child View Unchanged

1. Create a profile with real name "Emma" and creature "Sparkles"
2. Play as the child
3. Verify: Only "Sparkles" appears in the game view — "Emma" is never shown

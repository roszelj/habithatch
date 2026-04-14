# Quickstart: Creature Speech Bubble

**Feature**: 022-creature-speech-bubble | **Date**: 2026-04-07

## Integration Scenarios

### Scenario 1 — Child taps Morning feed button successfully

**Setup**: Profile has enough morning points to spend. Game screen is in pet view.

**Flow**:
1. Child taps the Morning action button
2. `handleAction('morning')` fires — points check passes
3. `dispatch({ type: 'morning' })` runs (existing behaviour, unchanged)
4. `setReacting(true)` fires (existing behaviour, unchanged)
5. A random message is selected from `SPEECH_MESSAGES`
6. Any existing speech timer is cleared
7. `setSpeechBubble(msg)` — bubble appears above the creature
8. Timer set for 3000ms → `setSpeechBubble(null)`

**Expected result**: Creature bounces (existing `reacting` animation) AND a white speech bubble with e.g. "Yummy, thank you!" appears above it. Bubble disappears after 3 seconds.

---

### Scenario 2 — Feed fires while a bubble is already showing

**Setup**: Child tapped Morning 1 second ago; bubble "I was so hungry!" is still visible.

**Flow**:
1. Child taps Afternoon action button (sufficient points)
2. Existing timeout (`speechTimerRef.current`) is cleared
3. New random message selected: "You are a chore master!"
4. `setSpeechBubble("You are a chore master!")` — old bubble replaced immediately
5. New 3-second timer starts

**Expected result**: No double bubble. Previous message immediately replaced by new message.

---

### Scenario 3 — Feed fails (insufficient points)

**Setup**: Profile has 0 morning points.

**Flow**:
1. Child taps Morning button
2. `handleAction` returns early (points check fails)
3. `setSpeechBubble` is never called

**Expected result**: No speech bubble appears. Existing behaviour (button visually disabled) is unchanged.

---

### Scenario 4 — Bubble disappears on its own

**Setup**: Bubble is showing "You're the best!" (triggered 2.9 seconds ago).

**Flow**:
1. 3-second timer fires
2. `setSpeechBubble(null)`
3. Bubble element unmounts from DOM

**Expected result**: Bubble is gone. No user action required. Screen is clean for the next interaction.

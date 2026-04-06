# Feature Specification: Chore Streak Counter

**Feature Branch**: `008-chore-streak-counter`
**Created**: 2026-04-06
**Status**: Draft
**Input**: User description: "add a streak counter that tracks how many days in a row the player completes all chores"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - See My Streak (Priority: P1)

The player sees a streak counter on the main game screen showing how
many consecutive days they have completed all their chores. The
streak is displayed prominently with a fire/flame visual that grows
more impressive at higher streaks. This motivates the player to
come back every day and finish all their tasks.

**Why this priority**: Displaying the streak is the core feature.
Without visibility, the tracking has no motivational effect.

**Independent Test**: Can be tested by completing all chores on
consecutive days and verifying the streak counter increments each
day.

**Acceptance Scenarios**:

1. **Given** a new player with no history, **When** they view the
   game screen, **Then** the streak counter shows 0 days.
2. **Given** the player completed all chores yesterday and today,
   **When** they view the game screen, **Then** the streak counter
   shows 2 days.
3. **Given** the player has a 7-day streak, **When** they view the
   game screen, **Then** the streak display is visually enhanced
   (e.g., bigger flame, celebratory styling) compared to a 1-day
   streak.

---

### User Story 2 - Streak Increments on All-Chores-Done (Priority: P1)

When the player checks off every chore across all three categories
(Morning, Afternoon, Evening) on a given day, the streak increments
by one. The streak only counts if ALL chores in ALL categories are
completed — partial completion does not count. The player gets a
congratulatory message when they complete the last chore of the day.

**Why this priority**: Co-equal with US1 — the streak logic is what
makes the counter meaningful. It must be all-or-nothing to drive
full completion.

**Independent Test**: Can be tested by adding chores in all
categories, completing all of them, and verifying the streak
increments. Then testing that leaving one chore unchecked does NOT
increment the streak.

**Acceptance Scenarios**:

1. **Given** the player has 3 Morning chores, 2 Afternoon chores,
   and 1 Evening chore, **When** they check off all 6, **Then**
   the streak increments and a "Day complete!" celebration appears.
2. **Given** the player has completed 5 of 6 chores today, **When**
   they view the streak counter, **Then** the streak has NOT yet
   incremented for today.
3. **Given** the player completed all chores today (streak earned),
   **When** they add a new chore and leave it unchecked, **Then**
   the streak for today remains earned (it was already locked in).

---

### User Story 3 - Streak Breaks on Missed Day (Priority: P1)

If the player misses a day (opens the game and has not completed all
chores from the previous day, or simply didn't play), the streak
resets to 0. The player sees a gentle message acknowledging the break
and encouraging them to start a new streak. The best streak ever
achieved is remembered.

**Why this priority**: Streak breaks are essential to the mechanic —
without consequences, the streak has no tension or value.

**Independent Test**: Can be tested by completing all chores on day 1,
skipping day 2, and verifying the streak resets to 0 on day 3.

**Acceptance Scenarios**:

1. **Given** the player had a 5-day streak and missed yesterday,
   **When** they open the game today, **Then** the streak resets
   to 0 and a message says "Streak ended at 5 days. Start a new
   one today!"
2. **Given** the player's streak just broke, **When** they complete
   all chores today, **Then** the streak shows 1 (new streak
   started).
3. **Given** the player achieved a best streak of 12 days, **When**
   they view the streak area, **Then** their best streak (12) is
   displayed alongside the current streak.

---

### Edge Cases

- What if the player has zero chores set up? A day with no chores
  does NOT count as "all complete" — the player must have at least
  one chore to earn a streak day.
- What if the player adds chores mid-day after already earning the
  streak? Once all chores are completed and the streak is earned
  for the day, adding new unchecked chores does not revoke it.
- What if the player misses multiple days in a row? The streak
  resets to 0 regardless of how many days were missed.
- What if the player resets their chores mid-day? Resetting chores
  un-completes them, so the streak for today would need to be
  re-earned by completing all chores again.
- What about the best streak and game reset? Resetting the game
  clears the best streak along with all other data.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The game MUST display a streak counter on the main
  game screen showing the current consecutive-day streak.
- **FR-002**: The streak MUST increment by 1 when the player
  completes ALL chores across ALL categories (Morning, Afternoon,
  Evening) on a given calendar day.
- **FR-003**: "All chores complete" MUST mean every chore in every
  category is checked off. Partial completion MUST NOT count.
- **FR-004**: The player MUST have at least one chore defined to
  earn a streak day. Zero chores = no streak earned.
- **FR-005**: When the player checks off the final chore of the
  day (completing all), a congratulatory message or animation MUST
  appear.
- **FR-006**: Once the streak is earned for a day (all chores
  complete), it MUST remain earned even if new chores are added
  later that day.
- **FR-007**: If the player opens the game and the previous day's
  chores were NOT all completed, the streak MUST reset to 0.
- **FR-008**: If the player missed one or more days entirely
  (didn't play), the streak MUST reset to 0.
- **FR-009**: The game MUST track and display the player's best
  (longest) streak ever achieved alongside the current streak.
- **FR-010**: The streak counter MUST be visually styled to reflect
  its magnitude — higher streaks appear more impressive (e.g.,
  flame grows, color intensifies).
- **FR-011**: When a streak breaks, the game MUST display a gentle,
  encouraging message (not punishing — kid-friendly per
  Constitution Principle III).
- **FR-012**: The current streak, best streak, and streak-earned
  status for today MUST persist in save data.

### Key Entities

- **Streak**: The current count of consecutive days with all chores
  completed. Resets to 0 on a missed day. Increments by 1 per
  qualifying day.
- **BestStreak**: The highest streak value ever achieved. Only
  increases, never resets (except on full game reset).
- **DayComplete**: A boolean flag for the current day indicating
  whether all chores have been completed and the streak earned.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Players who see the streak counter return the next
  day at a higher rate than before the feature — targeting 20%
  improvement in day-over-day retention.
- **SC-002**: 70% of active players achieve at least a 3-day streak
  within their first week of play.
- **SC-003**: The streak display is immediately understandable —
  players can identify their current streak and best streak within
  3 seconds.
- **SC-004**: No child tester reports feeling bad or punished when
  their streak breaks — the message is encouraging, not shaming.
- **SC-005**: The streak completion celebration is noticeable and
  rewarding — 90% of players smile or react positively when they
  see it.

## Assumptions

- This feature builds on the existing categorized chore system
  (feature 005) and daily reset persistence (feature 006).
- The streak is purely motivational — it does NOT unlock rewards,
  bonus points, or gameplay advantages. It's a personal achievement
  tracker.
- "Day" is determined by the browser's local calendar date, same
  as the daily chore reset.
- The streak evaluation happens on game load when the daily reset
  is processed: if yesterday's chores were all done, the streak
  continues; if not, it resets.
- Streak data (current, best, today's earned status) is added to
  the existing save data in localStorage.
- The streak counter does not decay health or affect any other
  game mechanic.

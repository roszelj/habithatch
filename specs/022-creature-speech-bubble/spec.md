# Feature Specification: Creature Speech Bubble

**Feature Branch**: `022-creature-speech-bubble`
**Created**: 2026-04-07
**Status**: Draft
**Input**: User description: "create a new feature that has the creature talking into a message bubble every time the kid feeds it. Random things like (Yummy thank you!, You are crushing your chores, I was so hungry, You are a chore master, I can't wait to see what happens next)"

## User Scenarios & Testing *(mandatory)*

### User Story 1 — Creature Speaks When Fed (Priority: P1)

When a child taps one of the feed/care buttons (Morning, Afternoon, or Evening), the creature responds by displaying a cheerful speech bubble with a randomly chosen message. The bubble appears near the creature, is clearly readable, and fades away after a short moment so it does not clutter the screen.

**Why this priority**: This is the entire feature — the creature speaking when fed is the core delightful interaction. Without it, nothing else in this spec exists.

**Independent Test**: Tap any feed button on the game screen → verify a speech bubble appears near the creature containing one of the defined messages → verify it disappears after a few seconds.

**Acceptance Scenarios**:

1. **Given** a child is on the game screen, **When** they tap a feed button (Morning, Afternoon, or Evening), **Then** a speech bubble appears near the creature containing a randomly selected encouraging message.
2. **Given** a speech bubble is displayed, **When** 2–4 seconds have passed, **Then** the bubble disappears automatically without any action from the child.
3. **Given** a child taps a feed button multiple times in quick succession, **When** a new message is triggered while one is already showing, **Then** the new message replaces the current one (no stacking of bubbles).
4. **Given** a child taps a feed button when they do not have enough points, **When** the action is rejected, **Then** no speech bubble appears (the creature only speaks on a successful feed).

---

### Edge Cases

- What happens if the child taps feed very rapidly? → Each successful feed replaces the previous bubble with a new message immediately; no visual stacking.
- What if the same message appears twice in a row? → Acceptable — the messages are chosen randomly from the pool; no uniqueness guarantee is required for simplicity.
- What happens on a slow device where the animation lags? → The bubble still appears and disappears correctly; timing is based on elapsed time, not frame rate.
- What happens when the child switches to a different view (Chores, Store) while a bubble is showing? → The bubble is no longer visible since the game screen is not shown; it does not need to be preserved.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST display a speech bubble near the creature immediately after a successful feed action (Morning, Afternoon, or Evening button tap).
- **FR-002**: The speech bubble MUST contain a randomly selected message from the defined message pool.
- **FR-003**: The message pool MUST include at least the following messages: "Yummy, thank you!", "You are crushing your chores!", "I was so hungry!", "You are a chore master!", "I can't wait to see what happens next!".
- **FR-004**: The speech bubble MUST disappear automatically after 2–4 seconds without requiring any action from the child.
- **FR-005**: If a new feed action triggers a message while a bubble is already showing, the existing bubble MUST be replaced by the new message immediately.
- **FR-006**: The speech bubble MUST NOT appear when a feed action fails (e.g., insufficient points).
- **FR-007**: The speech bubble MUST be clearly readable over the game screen background and habitat image.

### Key Entities

- **Message Pool**: A fixed set of short, encouraging phrases spoken by the creature after a successful feed. Messages are selected at random each time.
- **Speech Bubble**: A transient visual element displayed near the creature containing the selected message. Appears on successful feed, disappears automatically after a short duration.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A speech bubble appears within 0.2 seconds of a successful feed action — no perceptible delay for the child.
- **SC-002**: The speech bubble disappears on its own within 2–4 seconds in 100% of cases — no manual dismissal required.
- **SC-003**: Over 10 consecutive successful feeds, at least 3 different messages appear — confirming randomness is working.
- **SC-004**: Zero speech bubbles appear following a failed feed attempt (rejected due to insufficient points).

## Assumptions

- Feed actions are the Morning, Afternoon, and Evening buttons already present on the game screen; no new feed mechanism is introduced by this feature.
- The message pool is fixed at launch; no parent configuration or personalisation of messages is required for this version.
- Messages are child-appropriate; the example messages provided by the user are the intended baseline pool (the developer may add similar messages to increase variety).
- The speech bubble is a simple visual overlay near the creature — no audio or animation beyond appearing and disappearing.
- The bubble does not need to persist or be remembered across sessions; it is purely in-the-moment feedback.

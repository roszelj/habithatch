# Feature Specification: Pet Fullscreen Interactive View

**Feature Branch**: `031-pet-fullscreen-view`
**Created**: 2026-04-10
**Status**: Draft
**Input**: User description: "Add a new view when the kid presses on the pet area it loads a new page that takes up the entire view with pet and their habitat in the background. The pet will move around and then the pet will speak in the message bubble whatever time of day it is 'Good Morning' childName"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Kid Opens Fullscreen Pet View (Priority: P1)

As a child using the app, when I tap on my creature in the main game screen, a fullscreen view opens showing my creature with its habitat as the background. The creature moves around the screen with idle animations, making the experience feel alive and interactive.

**Why this priority**: This is the core interaction — without the fullscreen view opening and displaying the pet with its habitat, no other features in this spec can function.

**Independent Test**: Tap the creature on the game screen. Verify a fullscreen view opens showing the creature over its habitat background. Verify the creature moves around with idle animation. Verify tapping a back/close button returns to the main game screen.

**Acceptance Scenarios**:

1. **Given** a child is on the main game screen, **When** they tap the creature area, **Then** a fullscreen view opens covering the entire screen with the creature displayed over its habitat background.
2. **Given** the fullscreen pet view is open, **When** the child observes the creature, **Then** the creature moves around the screen with idle wandering animation.
3. **Given** the fullscreen pet view is open, **When** the child taps a back/close control, **Then** the view closes and the child returns to the main game screen.
4. **Given** a child has no habitat set (default), **When** they open the fullscreen view, **Then** a default background is shown behind the creature.

---

### User Story 2 - Pet Greets Child by Name Based on Time of Day (Priority: P2)

When the fullscreen pet view opens, the creature speaks a time-of-day greeting in a speech bubble, using the child's real name (or creature name if no real name is set). The greeting changes based on the current time: "Good Morning," "Good Afternoon," or "Good Evening."

**Why this priority**: The personalized greeting adds emotional connection and delight, but the fullscreen view is usable without it.

**Independent Test**: Open the fullscreen pet view at different times of day. Verify the speech bubble shows the correct greeting with the child's name. Verify the greeting updates if opened at a different time of day.

**Acceptance Scenarios**:

1. **Given** the fullscreen view opens between 5:00 AM and 11:59 AM, **When** the creature's speech bubble appears, **Then** it reads "Good Morning, [name]!"
2. **Given** the fullscreen view opens between 12:00 PM and 4:59 PM, **When** the creature's speech bubble appears, **Then** it reads "Good Afternoon, [name]!"
3. **Given** the fullscreen view opens between 5:00 PM and 4:59 AM, **When** the creature's speech bubble appears, **Then** it reads "Good Evening, [name]!"
4. **Given** the child has a real name set (childName), **When** the greeting appears, **Then** it uses the child's real name.
5. **Given** the child has no real name set, **When** the greeting appears, **Then** it uses the creature's name as fallback.

---

### Edge Cases

- What happens when the child has no habitat selected? A default background color or generic scene is shown.
- What happens if the child opens and closes the fullscreen view rapidly? The view should open and close cleanly without animation glitches.
- What happens on very small screens? The fullscreen view should fill the available viewport without scrolling, scaling the creature and background appropriately.
- What happens if the child's name is very long (up to 20 characters)? The speech bubble should accommodate the name without breaking layout.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST open a fullscreen view when the child taps the creature area on the main game screen.
- **FR-002**: The fullscreen view MUST display the child's creature sprite at a large size, centered or positioned prominently.
- **FR-003**: The fullscreen view MUST show the child's selected habitat as the full background image. If no habitat is set, a default background MUST be shown.
- **FR-004**: The creature MUST animate with idle wandering movement within the fullscreen view — drifting or walking around the screen area.
- **FR-005**: A speech bubble MUST appear near the creature with a time-of-day greeting using the child's name.
- **FR-006**: The greeting MUST reflect the current local time: "Good Morning" (5 AM - 11:59 AM), "Good Afternoon" (12 PM - 4:59 PM), "Good Evening" (5 PM - 4:59 AM).
- **FR-007**: The name in the greeting MUST use `childName` if set, falling back to `creatureName`.
- **FR-008**: The fullscreen view MUST provide a visible close/back control to return to the main game screen.
- **FR-009**: The fullscreen view MUST fill the entire viewport (100% width and height) with no scrolling.

### Key Entities

- **Fullscreen Pet View**: A transient UI state — no data persistence needed. Uses existing creature sprite, habitat, and child profile data.
- **Time-of-Day Greeting**: Derived from the device's local clock at the moment the view opens. Three greeting variants: morning, afternoon, evening.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Child can open the fullscreen pet view in under 1 second from tapping the creature.
- **SC-002**: The creature visibly moves at least once within the first 3 seconds of the view opening.
- **SC-003**: The speech bubble with the correct time-of-day greeting appears within 2 seconds of the view opening.
- **SC-004**: 100% of greeting text uses the correct name (childName when set, creatureName otherwise).
- **SC-005**: The fullscreen view renders correctly on screens from 320px to 430px wide (standard mobile range) without overflow or scrolling.

## Assumptions

- The existing creature sprite system supports rendering at larger sizes for the fullscreen view.
- Habitat background images already exist in the app and can be used as fullscreen backgrounds.
- The idle wandering animation is a simple positional drift (not complex skeletal animation) — movement is sufficient.
- The speech bubble component already exists in the codebase from a prior feature and can be reused or adapted.
- No new data needs to be persisted — this is a purely presentational feature using existing profile data.
- The greeting is determined once when the view opens and does not update in real-time if the time changes while viewing.

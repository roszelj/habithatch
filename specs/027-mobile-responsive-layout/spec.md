# Feature Specification: Mobile Responsive Layout

**Feature Branch**: `027-mobile-responsive-layout`
**Created**: 2026-04-09
**Status**: Draft
**Input**: User description: "I would like to change the layout so it's more mobile responsive fitting on a Aspect Ratio: 19.5:9"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Game Fits on Screen Without Scrolling (Priority: P1)

A child opens HabitHatch as a home screen app on a modern iPhone. All key game elements — the creature, mood indicator, point badges, health bar, and action buttons — are visible without scrolling. Nothing is cut off by the notch, dynamic island, or home indicator bar.

**Why this priority**: The core gameplay loop must be fully accessible at a glance. Requiring scroll to reach action buttons degrades the experience and makes the app feel unfinished.

**Independent Test**: Can be fully tested by opening the app on a 19.5:9 device (or browser emulator at that ratio) and confirming the pet view requires zero scrolling to access all primary actions.

**Acceptance Scenarios**:

1. **Given** the app is opened in PWA mode on a 19.5:9 iPhone, **When** the game screen loads, **Then** the creature, mood face, points row, health bar, and all action buttons are visible without any vertical scroll.
2. **Given** the app is open, **When** the user has not scrolled, **Then** no interactive element is hidden behind the device's notch, dynamic island, or home indicator.
3. **Given** a 19.5:9 viewport, **When** the creature stage is displayed, **Then** it occupies a proportional portion of the screen height — large enough to be engaging but leaving room for controls below.

---

### User Story 2 - Navigation Controls Are Thumb-Reachable (Priority: P2)

A child switches between the Pet, Chores, and Store views. The navigation controls sit in the lower portion of the screen so they can be tapped with a thumb without repositioning the phone.

**Why this priority**: Thumb-reachability is a core mobile UX principle. Controls at the top of a tall screen create friction for single-handed use by children.

**Independent Test**: Can be fully tested by verifying that view-switching controls land in the bottom half of the screen on a 19.5:9 device, without any other changes needed.

**Acceptance Scenarios**:

1. **Given** the game screen is visible, **When** the user looks at the screen, **Then** the primary navigation controls (Pet / Chores / Store) are located in the bottom portion of the screen.
2. **Given** the user is on any view, **When** they tap a navigation option, **Then** the view switches without requiring a scroll to find the content.

---

### User Story 3 - Secondary Screens Scroll Internally (Priority: P3)

A parent or child opens the Store, Chores panel, or Parent Panel on a 19.5:9 phone. Lists scroll within their own containers without pushing navigation or title chrome off-screen.

**Why this priority**: Secondary screens are used less frequently, but scrollable lists within them must not break the outer page shell.

**Independent Test**: Can be tested by opening the Store with several items and confirming only the item list scrolls — not the whole page.

**Acceptance Scenarios**:

1. **Given** the Store is open with multiple purchasable items, **When** the user scrolls through items, **Then** only the item list area scrolls — the screen title and navigation remain fixed.
2. **Given** the Chores panel is open with many chores, **When** the user scrolls, **Then** chores scroll within their panel without the entire page scrolling.
3. **Given** the Parent Panel is open, **When** the user interacts with it, **Then** all controls are accessible without the panel overflowing off-screen.

---

### Edge Cases

- What happens on a wider device (tablet or landscape mode)? Layout should remain centered and usable, capped at a sensible maximum width.
- How does the layout handle very long creature names or chore titles? Text should truncate or wrap without causing horizontal overflow.
- How does the screen behave when the software keyboard opens (e.g., naming a chore)? Content should not be permanently obscured by the keyboard.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The game screen MUST display all primary elements (creature, mood face, points row, health bar, action buttons) within the visible viewport on a 19.5:9 device without requiring vertical scroll.
- **FR-002**: The layout MUST respect device safe area insets (notch, dynamic island, home indicator) so no interactive element is obscured by hardware chrome.
- **FR-003**: The creature stage area MUST scale proportionally to the available screen height — neither dominating the screen nor shrinking so small it loses visual impact.
- **FR-004**: Navigation controls for switching views MUST be positioned in the lower portion of the screen to support thumb-reachable single-handed use.
- **FR-005**: List-heavy secondary screens (Store, Chores, Parent Panel) MUST use internal scrolling so the surrounding page structure remains fixed.
- **FR-006**: The layout MUST remain centered and usable at viewport widths from 320px to 430px, with a maximum content width cap to avoid stretching on larger screens.
- **FR-007**: No screen in the app MUST cause horizontal scrolling at any supported viewport width.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: On a 19.5:9 device (or browser emulator at that ratio), a user can complete the full primary game loop — view creature, check points, perform an action — without scrolling.
- **SC-002**: All primary tap targets on the game screen are located in the bottom 60% of the screen height, reachable with a thumb in single-handed use.
- **SC-003**: No content is visually clipped by device hardware chrome (notch, home indicator) on any screen of the app.
- **SC-004**: Secondary screens with lists (Store, Chores) scroll internally without displacing the page-level navigation or title.
- **SC-005**: The layout renders without horizontal scroll at all viewport widths between 320px and 430px.

## Assumptions

- The primary target device is a modern iPhone with a 19.5:9 aspect ratio and a home indicator (no physical home button), such as iPhone 12 through iPhone 16 series.
- Landscape orientation support is out of scope; the app is intended for portrait-only use.
- The existing maximum content width (~360px) may need to be widened slightly to make better use of modern phone screens (up to ~430px wide).
- Safe area insets will be addressed using standard CSS device safe-area mechanisms rather than hardcoded pixel offsets.
- The HTML viewport meta tag may need `viewport-fit=cover` added to allow full bleed to the edges while still respecting safe areas via CSS.
- This feature is layout and presentation only — no changes to game logic, data model, or backend are required.

# Feature Specification: Fix Horizontal Scroll on iPhone 15 Pro

**Feature Branch**: `016-fix-viewport-scroll`
**Created**: 2026-04-07
**Status**: Draft
**Input**: User description: "refine the viewport to fit without scrolling horizontal on a iPhone 15 pro"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - App Fits Fully Within Screen Width (Priority: P1)

A user opens the app on an iPhone 15 Pro and can use every screen — the selection screen, game screen, auth screen, and profile picker — without the content overflowing the screen edge or requiring horizontal scrolling.

**Why this priority**: Horizontal scrolling is a broken layout. It causes unintended UI interactions, hides content, and makes the app feel unpolished. This is the core fix.

**Independent Test**: Open the app on an iPhone 15 Pro (393pt logical width). Navigate through every major screen. No horizontal scroll bar appears and no content is clipped beyond the screen edge.

**Acceptance Scenarios**:

1. **Given** the app is open on an iPhone 15 Pro, **When** any screen is displayed, **Then** the layout fits entirely within the 393pt logical viewport width.
2. **Given** the auth/join screen is displayed, **When** the user views the page, **Then** no horizontal scrollbar appears and no content extends beyond the screen edge.
3. **Given** the game screen (creature + chores) is displayed, **When** the user views the page, **Then** all UI elements are visible without horizontal scrolling.
4. **Given** the profile picker or outfit/accessory picker is displayed, **When** the user views the page, **Then** picker items wrap or scroll vertically, not horizontally.

---

### User Story 2 - Layout Remains Usable at All iPhone Widths (Priority: P2)

After fixing the overflow, the layout looks intentional and usable — not just "not broken". Elements are centered, padded appropriately, and readable at the iPhone 15 Pro screen width.

**Why this priority**: A fix that simply clips or hides overflow is worse than no fix. The layout must look designed for the screen size.

**Independent Test**: View each screen on iPhone 15 Pro. All interactive elements are fully visible, tap targets are not cut off, and text is not truncated unexpectedly.

**Acceptance Scenarios**:

1. **Given** any screen is rendered on an iPhone 15 Pro, **When** the user inspects the layout, **Then** no interactive elements are partially off-screen or unreachable.
2. **Given** a screen has a fixed-width element wider than the viewport, **When** the screen renders, **Then** the element is constrained to the viewport width, not allowed to overflow.

---

### Edge Cases

- What happens on an iPhone SE (smaller viewport, 375pt)? Layout should also fit without horizontal scroll.
- What happens in landscape orientation? Content should reflow or remain within bounds; no horizontal overflow.
- What happens if a creature name or child name is very long? Text should truncate or wrap rather than push layout wider.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The app MUST NOT produce horizontal scroll or horizontal overflow on an iPhone 15 Pro (393pt logical width) in portrait orientation.
- **FR-002**: All screens (auth, join, profile picker, game, outfit/accessory pickers, naming step) MUST render fully within the viewport width.
- **FR-003**: The viewport MUST be configured to match the device's logical pixel width so the browser does not scale content incorrectly.
- **FR-004**: No interactive element (button, input, profile card, creature) MUST be partially hidden or unreachable due to horizontal overflow.
- **FR-005**: The layout MUST remain intact and usable after the fix — no content should be hidden by clipping as a workaround.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Zero screens in the app produce horizontal scroll on an iPhone 15 Pro in portrait orientation.
- **SC-002**: All tap targets and interactive elements are fully visible and reachable on an iPhone 15 Pro without horizontal scrolling.
- **SC-003**: The fix does not introduce vertical overflow or layout breakage on any screen at 393pt width.
- **SC-004**: Layout continues to function correctly on smaller widths (375pt / iPhone SE) without regression.

## Assumptions

- The primary device to fix is iPhone 15 Pro (393pt logical width, portrait orientation). Landscape and other devices are secondary.
- The horizontal overflow originates from CSS layout rules — likely fixed widths, min-widths, or missing width constraints — rather than from JavaScript logic.
- The viewport meta tag may be missing or misconfigured, causing the browser to render at a desktop width and scale down.
- No design changes are required — the existing layout intent should be preserved; only overflow/width constraints need correction.
- The fix applies to all screens, not just one specific screen.

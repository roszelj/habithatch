# Feature Specification: Add Logo Header Image

**Feature Branch**: `028-add-logo-header`
**Created**: 2026-04-09
**Status**: Draft
**Input**: User description: "add a new logo replacing the text 'HabitHatch' with /public/logo_header.png"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Logo Replaces Title Text (Priority: P1)

When any user opens HabitHatch, the header area that previously displayed the plain text "HabitHatch" now shows the branded logo image instead. The logo image is served from the app's public assets and renders consistently across all screens and views.

**Why this priority**: Brand identity is a first impression element visible on every screen load. Replacing placeholder text with the actual logo is the core deliverable of this feature.

**Independent Test**: Open the app and verify that no screen shows the raw text "HabitHatch" as a heading; instead the logo image appears in its place.

**Acceptance Scenarios**:

1. **Given** the app is loaded on any screen, **When** the user views the header area, **Then** the logo image is displayed instead of the text "HabitHatch"
2. **Given** the logo image file exists in the public assets folder, **When** the app loads, **Then** the logo renders without a broken image icon
3. **Given** the app is displayed on a narrow mobile screen, **When** the user views the header, **Then** the logo scales proportionally and does not overflow its container or clip

---

### Edge Cases

- What happens if the logo image fails to load? The app should not show a broken image icon in a prominent location; a graceful fallback (empty space or hidden element) is acceptable since this is a branding asset.
- What if the screen is very narrow (320px or less)? The logo must not cause horizontal scrolling or layout overflow.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The app MUST display the logo image (`logo_header.png`) in every location where the text "HabitHatch" currently appears as a heading or title
- **FR-002**: The logo image MUST be sourced from the app's public assets folder so it is served efficiently as a static asset
- **FR-003**: The logo MUST scale responsively to fit within the available header width without causing horizontal overflow or layout shifts
- **FR-004**: The logo MUST maintain its aspect ratio when scaled; it MUST NOT be stretched or distorted
- **FR-005**: If the logo image fails to load, the layout MUST NOT break; the space may remain empty or the element may be hidden

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Zero instances of the literal text "HabitHatch" appearing as a visible heading or title in any app view after the change is applied
- **SC-002**: The logo image loads successfully (no broken image icon) on 100% of page loads in standard network conditions
- **SC-003**: No horizontal scrolling is introduced on any screen at viewport widths of 320px and above
- **SC-004**: The logo renders without layout shift on initial page load, delivering a polished brand impression on first view

## Assumptions

- The logo image file (`logo_header.png`) already exists at `/public/logo_header.png` and is production-ready (correct dimensions, format, and quality)
- The logo image is designed to be displayed on the app's dark background; no background color adjustment is required
- There is no requirement to support a dark-mode/light-mode variant of the logo; a single image is used for all themes
- The logo replaces text-based titles only (e.g., the "HabitHatch" heading in Game screens and any other screens that show this title); navigation labels or metadata titles (browser tab title) are out of scope

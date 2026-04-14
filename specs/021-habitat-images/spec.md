# Feature Specification: Update Habitat Images

**Feature Branch**: `021-habitat-images`
**Created**: 2026-04-07
**Status**: Draft
**Input**: User description: "change the images being used for habitats replacing with new ones located here: /public/creature-habitats"

## User Scenarios & Testing *(mandatory)*

### User Story 1 — Store Shows Illustrated Habitat Images (Priority: P1)

A child browsing the in-game store sees illustrated habitat images instead of emoji icons when choosing which habitat to buy. Each habitat card displays a rich, colorful PNG image that makes the habitats feel more exciting and real.

**Why this priority**: The store is the primary entry point for habitats. If illustrated images don't appear here, the whole feature is invisible to kids.

**Independent Test**: Open the store → navigate to the Habitats section → verify each habitat card shows its illustrated PNG image with the correct name and price label.

**Acceptance Scenarios**:

1. **Given** a child is in the store, **When** they view the habitats section, **Then** each of the 9 habitats displays its unique illustrated PNG image (not an emoji).
2. **Given** a child views a habitat card, **When** the image loads, **Then** the image fills the card area cleanly without distortion or visible seams.
3. **Given** a habitat has not been purchased, **When** the card is displayed, **Then** the lock indicator and price are still visible alongside the image.

---

### User Story 2 — Game Screen Shows Active Habitat as Background (Priority: P2)

When a child has equipped a habitat, the game screen background reflects the chosen habitat using its illustrated PNG image instead of an emoji or plain background.

**Why this priority**: The habitat background is the most visible payoff for buying a habitat — kids want to see their creature living in a beautiful illustrated world.

**Independent Test**: Purchase and equip any habitat → return to the game screen → verify the illustrated habitat image appears as the scene backdrop behind the creature.

**Acceptance Scenarios**:

1. **Given** a child has equipped a habitat, **When** they enter the game screen, **Then** the habitat's illustrated PNG image is displayed as the scene backdrop.
2. **Given** no habitat is equipped, **When** the game screen loads, **Then** the default background is shown with no broken image.
3. **Given** a child switches to a different habitat, **When** they return to the game screen, **Then** the newly equipped habitat image is displayed.

---

### Edge Cases

- What happens when a habitat image file fails to load? → Display a plain colored background fallback; no broken image icon shown.
- What happens for profiles that owned one of the old emoji-based habitats? → The old habitat id is cleared or migrated gracefully; no crash or broken state.
- What happens if a profile has a `habitatId` that doesn't match any of the 9 new habitats? → Treat as no habitat equipped (use default background).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST replace all emoji-based habitat representations with their corresponding illustrated PNG images from `/public/creature-habitats/`.
- **FR-002**: The system MUST define 9 habitats matching the provided images: Water Park, Beach, Cozy Bedroom, Waterfall Forest, Candy Village, Magic Forest Pond, Sunny Farm, Snowy Cabin, Fairytale Castle.
- **FR-003**: The system MUST display each habitat's illustrated image in the store so children can preview what they are buying.
- **FR-004**: The system MUST display the equipped habitat's illustrated image as the game screen backdrop when a habitat is active.
- **FR-005**: The system MUST handle missing or unequipped habitats gracefully — no crash, no broken image placeholder.
- **FR-006**: The system MUST replace the previous 7 emoji-based habitat entries with the 9 new illustrated habitat entries.
- **FR-007**: The system MUST migrate profiles that have an old habitat id so they display without error (reset to no habitat if unmappable).

### Key Entities

- **Habitat**: Has an id, display name, price in coins, and an image path pointing to its PNG file. 9 total habitats.
- **Child Profile**: Stores `habitatId` (currently equipped habitat) and `ownedHabitats` (list of purchased habitat ids). Both fields must remain compatible after the habitat catalog changes.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: All 9 habitat images display correctly in the store with zero broken or missing images.
- **SC-002**: The equipped habitat image appears on the game screen within the same load time as the rest of the screen — no perceptible additional delay.
- **SC-003**: Zero crashes or error states when navigating habitats for both new and existing profiles, including profiles with no habitat equipped.
- **SC-004**: Each habitat image is visually matched to its correct habitat name (verified by manual review of all 9 entries).

## Assumptions

- The 9 PNG files in `/public/creature-habitats/` are final and already at the correct location; no additional asset processing is needed.
- The filenames follow the pattern `NN_habitat_name.png` (e.g., `01_water_park.png`) and are stable.
- The 7 existing emoji-based habitats are fully replaced with no hybrid emoji/image display.
- Habitat prices for the 9 new entries are similar in range to the current pricing (20–35 coins); exact pricing is a developer decision.
- Existing profiles that owned old habitat ids will have those ids cleared on load (treated as no habitat), as the old ids do not map to new habitats.

# Feature Specification: Kid Help Guide

**Feature Branch**: `039-kid-help-guide`  
**Created**: 2026-04-19  
**Status**: Draft  
**Input**: User description: "Add a new help selection that explains in detail how every feature works in the game available in the kid view"

## Clarifications

### Session 2026-04-19

- Q: Where should the parent help be accessible? → A: Same Help button in the kid toolbar opens a combined guide with both kid and parent sections (no PIN required to view help content).
- Q: How should kid and parent topics be organized in the combined guide? → A: Two clearly labeled top-level sections — "For Kids" and "For Parents".

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Access Help from Kid View (Priority: P1)

A child is playing HabitHatch for the first time or feels confused about how something works. They tap a Help button in the main kid view toolbar, which opens a combined help screen. The kid section lists all game features available to children with clear, kid-friendly explanations.

**Why this priority**: Without discoverability, kids will not understand how to earn points, feed their pet, or use mini-games. This is the core value of the feature and covers the entire kid feature surface area.

**Independent Test**: Can be fully tested by opening the app as a kid user, tapping the Help button, and verifying the "For Kids" section contains explanations for every kid-facing feature.

**Acceptance Scenarios**:

1. **Given** a child is on the main pet screen, **When** they tap the Help button in the toolbar, **Then** a help screen opens showing two labeled sections: "For Kids" and "For Parents".
2. **Given** the help screen is open, **When** the child taps a topic in the "For Kids" section, **Then** a detailed explanation of that feature is shown in plain, kid-friendly language.
3. **Given** the help screen is open, **When** the child taps Back or a close button, **Then** they return to the main pet screen.

---

### User Story 2 - Browse Help Topics Individually (Priority: P2)

A child or parent wants to learn about one specific feature. They open help and navigate directly to that topic without reading everything.

**Why this priority**: Topic-level navigation makes the help guide useful beyond the first visit without requiring the user to read every entry.

**Independent Test**: Can be fully tested by opening Help, selecting a specific topic from either section (e.g., "Mini-Games" or "Approving Chores"), and verifying the right detailed content is shown.

**Acceptance Scenarios**:

1. **Given** the help screen is open, **When** the user selects a topic, **Then** the detailed explanation for that topic is displayed.
2. **Given** a topic detail is open, **When** the user navigates back, **Then** they see the full help topic list again (not the pet screen).

---

### User Story 3 - Parent Reads How to Manage Their Kids (Priority: P2)

A parent wants to understand how to approve chores, add rewards, pause a profile, or use the join code. They open Help from the kid view toolbar and go to the "For Parents" section for clear explanations of every parent-facing feature.

**Why this priority**: Parents who don't understand how to set up chores, approvals, or rewards will not engage with the management side of the app, reducing the game's core value loop.

**Independent Test**: Can be fully tested by opening Help and verifying the "For Parents" section contains accurate, adult-readable explanations for every parent feature.

**Acceptance Scenarios**:

1. **Given** the help screen is open, **When** a parent taps the "For Parents" section, **Then** a list of parent-facing topics is shown.
2. **Given** a parent topic is selected, **When** the explanation is read, **Then** it accurately describes the current behavior of that parent feature (PIN setup, chore management, approvals, rewards, bonus points, pause mode, join code, child profiles, chore points).
3. **Given** no PIN has been entered, **When** a parent opens the help screen, **Then** the "For Parents" section is still fully visible without requiring PIN entry.

---

### User Story 4 - Help Is Always Current (Priority: P3)

All explanations accurately reflect the features that exist in the game. Every feature in the kid view and every feature in Parent Mode has a corresponding help entry.

**Why this priority**: A help guide that misses features is more confusing than no guide at all.

**Independent Test**: Can be validated by comparing the help topic list against all active screens and buttons in both the kid view and Parent Mode.

**Acceptance Scenarios**:

1. **Given** the help guide is displayed, **When** a user reviews the "For Kids" topic list, **Then** every interactive feature accessible from the kid view has a corresponding topic.
2. **Given** the help guide is displayed, **When** a user reviews the "For Parents" topic list, **Then** every feature accessible in Parent Mode has a corresponding topic.

---

### Edge Cases

- What happens when the help screen is opened while the pet is in a "paused" state — does the pause banner remain visible or is it hidden behind the help overlay?
- How does the help screen render on very small screens where the toolbar is already crowded — does the Help button get cut off or replaced?
- What happens if a feature (e.g., Switch Profile) is conditionally hidden for some users — is its help topic hidden too, or shown regardless?
- Since the "For Parents" section is visible without a PIN, kids can read parent instructions — this is an accepted trade-off given the non-sensitive nature of help content.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The kid view toolbar MUST include a clearly labeled Help button accessible from the main pet screen.
- **FR-002**: Tapping the Help button MUST open a dedicated help screen without leaving the kid view context.
- **FR-003**: The help screen MUST display two clearly labeled top-level sections: "For Kids" and "For Parents".
- **FR-004**: The "For Kids" section MUST contain a navigable list of topics covering every feature available in the kid view, including:
  - Your Pet (creature, mood, health bar)
  - Feeding Your Pet (how to feed, coin cost, food menu)
  - Points & Coins (how they are earned, what they represent)
  - Streak (what a streak is, how to build and maintain it)
  - Chores (how to check off chores, weekday vs. weekend, pending approval)
  - The Store (outfits, accessories, habitats, reward presents)
  - Mini-Games (how to access via tapping the pet, Spin the Wheel, Tic Tac Toe, Trivia)
  - Change Creature (how to change pet type and name)
  - Switch Profile (if the feature is enabled for the user)
- **FR-005**: The "For Parents" section MUST contain a navigable list of topics covering every feature available in Parent Mode, including:
  - PIN Setup & Access (how to create a PIN and enter Parent Mode)
  - Managing Chores (adding and removing chores for one child or all children, weekday vs. weekend)
  - Approving Chores (reviewing pending chore submissions, approving or rejecting them)
  - Bonus Points (awarding extra points and coins to a child)
  - Reward Presents (creating rewards, what happens when a child redeems one, marking rewards fulfilled)
  - Pause Mode (pausing a child's profile so their pet does not decay and daily resets are skipped)
  - Child Profiles (updating a child's display name, managing multiple profiles)
  - Join Code (how to use the join code to access the family on another device)
  - Chore Points (setting the point value earned per chore category)
- **FR-006**: Each help topic in both sections MUST provide a plain-language explanation of how the feature works; kid section topics MUST be written at a school-age reading level, parent section topics at an adult reading level.
- **FR-007**: The help screen MUST provide a way to return to the main pet screen (back button or close button).
- **FR-008**: The help screen MUST be accessible even when the pet's health is at zero or the game is paused.
- **FR-009**: The "For Parents" section MUST be visible without PIN entry (help content is read-only and non-sensitive).
- **FR-010**: The Switch Profile help topic MUST only appear when the Switch Profile button is present in the kid view toolbar.

### Key Entities

- **Help Topic**: A named section of the help guide covering one feature; has a title, a short summary (shown in the list), an audience tag (kid or parent), and a detailed explanation (shown when selected).
- **Help Section**: A top-level grouping of help topics — either "For Kids" or "For Parents".
- **Help Screen**: The full-screen overlay or view that renders both help sections, their topic lists, and individual topic detail views.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A child can open the help guide and find an explanation for any kid-view feature in under 30 seconds.
- **SC-002**: A parent can open the help guide and find an explanation for any Parent Mode feature in under 30 seconds.
- **SC-003**: 100% of interactive features accessible from the kid toolbar and pet screen have a corresponding "For Kids" help topic.
- **SC-004**: 100% of features accessible in Parent Mode have a corresponding "For Parents" help topic.
- **SC-005**: Kid section help text is written at or below a 4th-grade reading level (verified by readability review).
- **SC-006**: The help screen renders without layout issues on screens ranging from 320px to 428px wide (covers common phone sizes).
- **SC-007**: Opening and closing the help screen does not change any game state (coins, health, chores, streak remain unchanged).

## Assumptions

- The Help button will be added to the existing kid view toolbar alongside Chores, Store, Change, Parent, and Switch.
- Help content will be static (hardcoded strings), not fetched from a remote source.
- No parental permission or PIN is required to view either help section — help is freely accessible to anyone using the app.
- Reading level for the "For Kids" section targets school-age children (approximately ages 6–12); "For Parents" section uses standard adult language.
- The Switch Profile topic is conditionally rendered based on whether the Switch Profile button is visible to the user.
- Parent help content is not considered sensitive — kids reading it does not compromise any PIN or security mechanism.

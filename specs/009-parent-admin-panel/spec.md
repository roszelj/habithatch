# Feature Specification: Parent Admin Panel

**Feature Branch**: `009-parent-admin-panel`
**Created**: 2026-04-06
**Status**: Draft
**Input**: User description: "parents should have a separate administrative side of the app to create the chore list and validate that the child completed successfully"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Parent Mode Access (Priority: P1)

The app has two modes: Kid Mode (the existing game) and Parent Mode
(an administrative panel). The parent accesses Parent Mode through a
button protected by a simple PIN code. This prevents the child from
accessing admin functions while keeping the barrier low enough that
parents can switch quickly. The PIN is set during first parent access.

**Why this priority**: Without a way to enter Parent Mode, the admin
panel doesn't exist. The PIN gate is essential to separate the two
experiences.

**Independent Test**: Can be tested by tapping the parent mode
button, entering the PIN, and verifying the admin panel appears.

**Acceptance Scenarios**:

1. **Given** the game is running in Kid Mode, **When** the parent
   taps the "Parent" button, **Then** a PIN entry screen appears.
2. **Given** no PIN has been set yet, **When** the parent opens
   Parent Mode for the first time, **Then** they are prompted to
   create a 4-digit PIN.
3. **Given** a PIN is set, **When** the parent enters the correct
   PIN, **Then** the Parent Mode admin panel opens.
4. **Given** a PIN is set, **When** an incorrect PIN is entered,
   **Then** access is denied with a friendly message and the user
   stays in Kid Mode.

---

### User Story 2 - Parent Manages Chore Lists (Priority: P1)

In Parent Mode, the parent can create, edit, and remove chores
across all three categories (Morning, Afternoon, Evening). This
replaces the child's ability to add/remove chores — in Parent Mode,
chore list management is the parent's responsibility. The child can
still check off chores but cannot add or remove them.

**Why this priority**: Co-equal with US1 — the primary purpose of
Parent Mode is chore management. Parents set the expectations, kids
execute them.

**Independent Test**: Can be tested by entering Parent Mode, adding
chores to each category, then switching to Kid Mode and verifying
the chores appear but add/remove controls are hidden.

**Acceptance Scenarios**:

1. **Given** the parent is in Parent Mode, **When** they view the
   chore management screen, **Then** they see all three categories
   with full add/edit/remove controls.
2. **Given** the parent adds a chore "Make bed" to Morning, **When**
   they switch to Kid Mode, **Then** the child sees "Make bed" in
   Morning chores.
3. **Given** Parent Mode is active (PIN set), **When** the child
   views the chore panel in Kid Mode, **Then** add and remove
   controls are hidden — the child can only check off chores.
4. **Given** no PIN has been set (Parent Mode never used), **When**
   the child views the chore panel, **Then** add/remove controls
   remain available (backward compatible).

---

### User Story 3 - Parent Validates Chore Completion (Priority: P1)

When the child checks off a chore, it enters a "pending" state
instead of immediately awarding points. The parent reviews pending
chores in Parent Mode and either approves (awarding points) or
rejects (unchecking the chore). This ensures the child actually
completed the task and didn't just check the box.

**Why this priority**: Validation is the core differentiator — it
turns the honor system into a verified system. Without it, Parent
Mode is just chore management.

**Independent Test**: Can be tested by having the child check off a
chore, then entering Parent Mode and approving/rejecting it, and
verifying points are only awarded on approval.

**Acceptance Scenarios**:

1. **Given** a chore is unchecked, **When** the child checks it off,
   **Then** the chore enters "pending" state (visually distinct from
   done) and points are NOT yet awarded.
2. **Given** a chore is pending, **When** the parent opens Parent
   Mode, **Then** they see a list of pending chores awaiting
   approval.
3. **Given** a pending chore, **When** the parent approves it,
   **Then** the chore moves to "approved" state and points are
   awarded to the child's balance.
4. **Given** a pending chore, **When** the parent rejects it,
   **Then** the chore returns to unchecked state with a gentle
   message visible to the child ("Try again!").

---

### User Story 4 - Parent Dashboard (Priority: P2)

Parent Mode shows a simple dashboard with the child's stats: current
streak, health, per-category point balances, and how many chores
were completed today. This gives the parent a quick overview without
having to switch to Kid Mode.

**Why this priority**: Nice-to-have overview. The game is fully
functional without it, but it helps parents stay engaged.

**Independent Test**: Can be tested by entering Parent Mode and
verifying the dashboard shows current game stats.

**Acceptance Scenarios**:

1. **Given** the parent enters Parent Mode, **When** the dashboard
   loads, **Then** they see the child's streak, health %, point
   balances, and today's chore completion count.

---

### Edge Cases

- What if the parent forgets the PIN? A "Reset PIN" option is
  available that clears the PIN (requires confirming by entering
  the child's creature name as a safety check).
- What if there are no pending chores when the parent opens admin?
  A message says "No chores waiting for approval" with the option
  to manage chore lists.
- What if the parent approves a chore but the child already added
  new chores? Approval only affects the specific pending chore.
- What if the daily reset happens while chores are pending? Pending
  chores reset to unchecked (same as completed chores) — the parent
  did not approve them in time.
- What if the parent removes a chore that the child already checked
  off (pending)? The pending check is discarded — the chore is
  gone.
- What if Parent Mode is never activated? The game works exactly
  as before — children manage their own chores and earn points
  immediately on check-off (no approval required).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The game MUST support two modes: Kid Mode (default)
  and Parent Mode (admin panel).
- **FR-002**: Parent Mode MUST be accessible via a "Parent" button
  on the game screen, protected by a 4-digit PIN.
- **FR-003**: On first Parent Mode access, the parent MUST be
  prompted to create a 4-digit PIN.
- **FR-004**: The PIN MUST be stored locally and persist between
  sessions.
- **FR-005**: In Parent Mode, the parent MUST be able to add, edit,
  and remove chores across all three categories.
- **FR-006**: When Parent Mode is active (PIN set), the child's
  chore panel MUST hide add/remove controls — the child can only
  check off chores.
- **FR-007**: When Parent Mode is active, checking off a chore MUST
  set it to "pending" state instead of "done".
- **FR-008**: Pending chores MUST NOT award points until approved by
  the parent.
- **FR-009**: In Parent Mode, the parent MUST see a list of all
  pending chores with approve/reject actions for each.
- **FR-010**: Approving a pending chore MUST award the standard
  points to the appropriate category.
- **FR-011**: Rejecting a pending chore MUST return it to unchecked
  state.
- **FR-012**: Parent Mode MUST display a dashboard showing: streak,
  health, per-category points, and today's chore status.
- **FR-013**: A "Reset PIN" option MUST be available, requiring the
  child's creature name as confirmation.
- **FR-014**: If Parent Mode has never been activated (no PIN set),
  the game MUST behave exactly as before (child manages chores,
  immediate point award).
- **FR-015**: The PIN MUST NOT be visible or recoverable by the
  child. The PIN entry screen MUST mask input.
- **FR-016**: All Parent Mode data (PIN, pending states) MUST be
  stored locally only (Constitution Principle III).

### Key Entities

- **ParentMode**: The administrative state of the game. Activated
  by setting a PIN. Controls whether chores require approval and
  whether the child can manage chore lists.
- **ChoreStatus**: Extended from boolean (done/not done) to
  three states: unchecked, pending (child checked off, awaiting
  parent approval), and approved (parent verified, points awarded).
- **PIN**: A 4-digit code protecting Parent Mode access. Stored
  locally, masked on entry.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Parents can set up a PIN and enter Parent Mode within
  30 seconds on first use.
- **SC-002**: The parent can review and approve/reject all pending
  chores in under 1 minute per session.
- **SC-003**: Children cannot access Parent Mode — 100% of attempts
  without the correct PIN are blocked.
- **SC-004**: The approval workflow does not slow down the child's
  experience — checking off a chore is still instant (it just enters
  pending instead of done).
- **SC-005**: Parents report increased confidence that chores are
  actually being completed — the verification step adds trust.

## Assumptions

- This feature uses shared local storage — parent and child use the
  same device/browser. There is no multi-device sync.
- The PIN is a simple 4-digit code, not a password. It's a
  kid-barrier, not a security system.
- When Parent Mode is not activated (no PIN), the game is fully
  backward compatible with the existing chore system.
- The three chore states (unchecked → pending → approved) replace
  the current two-state (unchecked → done) only when Parent Mode
  is active.
- Daily reset clears both "pending" and "approved" states back to
  "unchecked" — same behavior as current daily reset.
- The streak system treats "approved" chores as complete. Pending
  chores do NOT count toward the streak.
- Parent Mode is an overlay/panel within the same app — not a
  separate URL or application.

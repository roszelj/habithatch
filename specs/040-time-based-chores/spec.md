# Feature Specification: Time-Based Chore List in Kid View

**Feature Branch**: `040-time-based-chores`  
**Created**: 2026-04-26  
**Status**: Draft  
**Input**: User description: "I want to add a new section on the kid view under feed that shows the chores list based on the time of day. So if it's morning time it would show just those chores"

## Clarifications

### Session 2026-04-26

- Q: What UI design guidelines should govern the new section's visual design? → A: Apple Human Interface Guidelines (HIG)
- Q: Can children mark chores as done directly from this new section? → A: Yes — full interaction, same as existing chore panel (Option A)
- Q: Where does this section appear on the kid view screen? → A: Inline on the same screen, directly below the existing feed section (continuous scroll)

## User Scenarios & Testing *(mandatory)*

### User Story 1 - See Relevant Chores by Time of Day (Priority: P1)

A child opens the app during the morning and sees only their morning chores displayed in a dedicated section beneath the feed area. They do not need to scroll through irrelevant afternoon or evening chores to find what they should be doing right now.

**Why this priority**: This is the core value of the feature — reducing cognitive load by surfacing the right chores at the right time. Without this, the section has no value.

**Independent Test**: Open the kid view during a morning hour and confirm the chore section shows only morning chores. Delivers value immediately as a focused task list.

**Acceptance Scenarios**:

1. **Given** it is currently morning (before noon), **When** the child opens the kid view, **Then** only morning chores are shown in the time-based section
2. **Given** it is currently afternoon (noon–6 PM), **When** the child opens the kid view, **Then** only afternoon chores are shown
3. **Given** it is currently evening (after 6 PM), **When** the child opens the kid view, **Then** only evening chores are shown
4. **Given** a time period's chore list is empty, **When** the child views the section, **Then** a friendly empty state message is shown (e.g., "No chores for this time of day!")

---

### User Story 2 - Chore Completion Status Visible (Priority: P2)

A child can see whether each chore in the time-based section is unchecked, pending approval, or already approved — so they know what still needs to be done during the current time period.

**Why this priority**: Without status visibility the list is read-only and children cannot understand their progress for the current time slot.

**Independent Test**: Can be verified by checking that chore status indicators (unchecked/pending/approved) appear correctly on each chore row in the new section.

**Acceptance Scenarios**:

1. **Given** a morning chore is unchecked, **When** the morning section is displayed, **Then** the chore appears as actionable/incomplete
2. **Given** a morning chore is pending parent approval, **When** the morning section is displayed, **Then** the chore appears in a pending state
3. **Given** a morning chore is approved, **When** the morning section is displayed, **Then** the chore appears as completed

---

### User Story 3 - Section Updates When Time Period Changes (Priority: P3)

If a child leaves the app open across a time boundary (e.g., from morning into afternoon), the section automatically reflects the new time period's chores without requiring a full app restart.

**Why this priority**: Nice-to-have for accuracy, but the primary use case is opening the app fresh each session.

**Independent Test**: Simulate a time boundary crossing and confirm the displayed chores update to match the new period.

**Acceptance Scenarios**:

1. **Given** the app is open and the time crosses from morning to afternoon, **When** the child views the section, **Then** afternoon chores are now displayed instead of morning chores

---

### Edge Cases

- What happens when the child has no chores assigned for the current time period? → Show a friendly empty-state message.
- What happens on a weekday vs. weekend? → The section respects the existing weekday/weekend chore schedule.
- What if the device clock is incorrect? → The section relies on device time; no special handling required.
- What if all chores for the current time period are already approved? → All chores display as completed; an optional celebratory message may appear.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The kid view MUST display a dedicated chore section inline on the same screen, directly below the existing feed section, within a continuous vertical scroll
- **FR-002**: The section MUST display only the chores assigned to the current time period (morning, afternoon, or evening) based on the device's local time
- **FR-003**: Time periods MUST map as follows: morning = before 12:00 PM, afternoon = 12:00 PM–5:59 PM, evening = 6:00 PM onward
- **FR-004**: The section MUST respect the existing weekday vs. weekend chore schedule
- **FR-005**: Each chore in the section MUST display its current completion status (unchecked, pending, approved)
- **FR-006**: When no chores exist for the current time period, the section MUST display a friendly empty-state message
- **FR-007**: The section MUST update its displayed time period if the app remains open across a time boundary
- **FR-008**: Children MUST be able to mark chores as done directly within this section, using the same interaction model as the existing chore panel (tap to mark done → pending approval flow)

### Key Entities

- **Chore**: An individual task with a name and status (unchecked/pending/approved), belonging to one time period category
- **CategoryChores**: The grouped chore collection split into morning, afternoon, and evening lists
- **Time Period**: The current slot (morning/afternoon/evening) derived from device local time, used to filter which chores to display

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A child can identify their current time period's chores within 5 seconds of opening the kid view
- **SC-002**: The correct time period's chores are displayed 100% of the time based on the device's local clock
- **SC-003**: The section renders within the normal screen load time with no perceptible additional delay
- **SC-004**: Children complete their time-period chores at a measurably higher rate as relevant tasks are immediately visible upon opening the app

## Assumptions

- Time period boundaries follow the thresholds already established in the app: morning = before noon, afternoon = noon–6 PM, evening = after 6 PM
- The chore data for the child is already loaded into the kid view via the existing data provider; no new data-fetching is required
- Children can mark chores as done directly within this section; the full completion/approval interaction model (tap to mark → pending → approved) is available inline
- The feature applies to the React Native kid view (iOS and Android); the web version may be addressed in a separate feature
- All visual design decisions (layout, spacing, typography, color, interactive states) MUST follow Apple Human Interface Guidelines (HIG)
- Children are assumed to have at least one time period's chores defined by a parent; parent setup flow is out of scope

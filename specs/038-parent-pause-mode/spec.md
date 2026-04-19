# Feature Specification: Parent Pause Mode

**Feature Branch**: `038-parent-pause-mode`  
**Created**: 2026-04-19  
**Status**: Draft  
**Input**: User description: "add way for the parent to pause the kid so if they are not able to use the app for awhile it won't affect the health and the streak of the pet"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Parent Pauses a Child Profile (Priority: P1)

A parent whose child will be away (vacation, illness, no-device period) wants to prevent the pet's health from decaying and the daily streak from breaking during that time. The parent enters parent mode, finds the child's profile, and enables a pause. From that moment, the child's pet health holds steady and the streak is protected until the parent resumes it.

**Why this priority**: This is the core value of the feature. Without pause, parents have no recourse when a child cannot use the app — the pet degrades and streaks are lost, which is demoralizing and undermines the habit-tracking purpose.

**Independent Test**: Can be fully tested by pausing a child profile and verifying that after waiting (or simulating time passage), neither health nor streak changes; delivers full protective value on its own.

**Acceptance Scenarios**:

1. **Given** a parent is in parent mode, **When** they enable the pause for a child, **Then** that child's profile is marked as paused and no further health decay or streak risk applies.
2. **Given** a child profile is paused, **When** time passes without chore completion, **Then** the pet's health remains at the same value it had when paused.
3. **Given** a child profile is paused, **When** the day rolls over without chore completion, **Then** the child's streak is not broken or reset.

---

### User Story 2 - Parent Resumes a Paused Child Profile (Priority: P1)

After the away period ends, the parent returns to parent mode and resumes the child's profile. Health decay and streak tracking restart from that point forward, preserving the values they had when paused.

**Why this priority**: Equal priority to pausing — a pause that cannot be undone (or that causes unexpected state on resume) is a bug, not a feature.

**Independent Test**: Can be fully tested by pausing a profile, then resuming it and confirming health and streak match the values saved at pause time, and that normal decay and streak tracking resume.

**Acceptance Scenarios**:

1. **Given** a child profile is paused, **When** the parent disables the pause, **Then** the profile is marked active and health decay and streak tracking resume normally.
2. **Given** a profile was paused with health at 70 and streak at 5, **When** the parent resumes it, **Then** the pet's health starts at 70 (no retroactive decay for the paused period) and streak remains 5.
3. **Given** a profile is resumed, **When** the next day passes without chore completion, **Then** the streak breaks as normal (pause protection is no longer active).

---

### User Story 3 - Child Sees Their Pet Is Resting (Priority: P2)

When a child opens the app and their profile is paused, they see a clear visual indicator showing the pet is resting or on a break. The child can still view their pet and chores but understands nothing negative is happening to the pet.

**Why this priority**: Without feedback, a child may be confused by a static health bar or wonder if the app is broken. A clear paused state sets expectations and reduces anxiety about the pet's wellbeing.

**Independent Test**: Can be fully tested by pausing a profile and viewing it as the child — the paused indicator is visible without needing to wait for any time-based effect.

**Acceptance Scenarios**:

1. **Given** a child's profile is paused, **When** the child views the pet screen, **Then** a visible indicator communicates the pet is paused or resting.
2. **Given** a child's profile is paused, **When** the child completes chores, **Then** points and coins are still awarded normally (pause only protects against negative effects, not positive ones).
3. **Given** a child's profile is paused, **When** the child feeds the pet or interacts with it, **Then** those interactions continue to work as normal.

---

### Edge Cases

- What happens if the parent pauses after a streak was already broken that day? Pause does not retroactively recover a streak that was already lost before the pause was enabled.
- What happens if a child is paused across a daily reset boundary? The streak is preserved and the last-played date is refreshed on resume so no missed-day penalty is applied.
- What happens if multiple children are in the same family and one is paused while the other is not? Each child's pause state is independent; the unpaused child's experience is unaffected.
- What if the parent never resumes a pause? The child remains protected indefinitely — there is no automatic expiry.
- What if the app is opened on a different device while the profile is paused? The paused state propagates across devices so health does not decay anywhere during the pause.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST allow a parent (authenticated via parent PIN) to enable a pause on any child profile in their family.
- **FR-002**: System MUST allow a parent to disable (resume) a pause on any child profile at any time.
- **FR-003**: While a child profile is paused, pet health MUST NOT decay over time.
- **FR-004**: While a child profile is paused, the child's streak MUST NOT break or reset due to missed chore days.
- **FR-005**: On resume, pet health MUST be restored to the exact value it held at the time of pausing (no retroactive decay for the paused period).
- **FR-006**: On resume, the child's streak MUST be preserved at the value it held at the time of pausing, and the last-played date MUST be updated to the current date so no missed-day penalty is applied on the first active day.
- **FR-007**: A child profile's paused state MUST be visible in the parent panel so the parent can easily see at a glance which children are currently paused.
- **FR-008**: The child's pet screen MUST display a clear visual indicator when the profile is paused.
- **FR-009**: Pausing MUST NOT prevent the child from completing chores, earning points and coins, feeding the pet, or any other positive interactions.
- **FR-010**: The paused state MUST persist across app restarts and device switches (stored as part of the child's profile data).
- **FR-011**: In cloud-synced families, the pause state MUST propagate to all devices so that health does not decay on any device while the profile is paused.

### Key Entities

- **Child Profile**: Gains a paused flag and a timestamp recording when the pause was enabled. These two values allow the system to freeze health and protect the streak during the away period.
- **Pause Record**: The paused flag plus the timestamp of when pausing began. Used to restore health and streak correctly on resume without retroactive decay.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A parent can enable or disable a pause for any child in 3 taps or fewer from within parent mode.
- **SC-002**: When paused, a child's health value does not change by any amount regardless of how much time passes.
- **SC-003**: When paused, a child's streak value does not decrease even after one or more days pass without chore completion.
- **SC-004**: On resume, the child's health and streak values match exactly what they were at the moment of pausing (zero data loss during pause period).
- **SC-005**: The paused indicator is visible to the child on the pet screen without any additional navigation or action required.
- **SC-006**: 100% of child profiles that were paused across a day boundary retain their streak on resume.

## Assumptions

- Pause is a parent-only action, always gated behind the parent PIN — children cannot pause or resume their own profiles.
- There is no automatic expiry for a pause; it remains active until the parent manually resumes it.
- Pause protects only against negative effects (health decay, streak loss). All positive interactions remain fully functional while paused.
- The pause is per-child, not family-wide — each child's pause state is independent.
- No retroactive recovery: if a streak was already broken or health already decayed before the pause was enabled, those losses are not reversed by pausing.
- Last-played date is updated to the current date on resume (not to the date the pause was enabled), so the first day after resume is treated as today for streak purposes.
- The existing parent PIN authentication flow is sufficient for gating access to the pause control — no additional authentication step is needed.

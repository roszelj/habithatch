# Feature Specification: Cloud Parent Data Persistence

**Feature Branch**: `014-cloud-parent-persistence`
**Created**: 2026-04-06
**Status**: Draft
**Input**: User description: "the parent pin, rewards created by the parent should persist in the cloud"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Parent PIN Persists Across Devices (Priority: P1)

A parent sets up a PIN to lock the parent management panel on one device. When they log in on another device (or after clearing browser data), the PIN is still in place and must be entered to access parent controls. The PIN is stored in the cloud so it follows the family, not the device.

**Why this priority**: Without cloud-persisted PIN, any new device or cleared cache exposes parent controls to children, undermining the entire parental gating mechanism.

**Independent Test**: Can be tested by setting a PIN on one device, then accessing the app from a different device/browser and verifying the parent panel requires the same PIN.

**Acceptance Scenarios**:

1. **Given** a parent in cloud mode with no PIN set, **When** they create a new parent PIN, **Then** the PIN is saved to the cloud and immediately enforced on all devices connected to the family.
2. **Given** a parent PIN exists in the cloud, **When** a user accesses the parent panel on a new device, **Then** they are prompted to enter the PIN before gaining access.
3. **Given** a parent PIN exists in the cloud, **When** the parent enters the correct PIN, **Then** they gain access to the parent management panel.
4. **Given** a parent PIN exists in the cloud, **When** an incorrect PIN is entered, **Then** access is denied and the user is shown an error message.

---

### User Story 2 - Parent-Created Rewards Persist Across Devices (Priority: P1)

A parent creates custom rewards (with names and coin prices) for their children. These rewards are stored in the cloud so they are visible and redeemable on any device connected to the family. Adding, editing, or removing a reward on one device is reflected everywhere.

**Why this priority**: Rewards are a core motivational mechanic. If they only exist on one device, children on other devices cannot see or redeem them, breaking the multi-device family experience.

**Independent Test**: Can be tested by creating a reward on one device, then checking a second device to verify the reward appears with the correct name and price.

**Acceptance Scenarios**:

1. **Given** a parent in cloud mode, **When** they create a new reward with a name and coin price, **Then** the reward is saved to the cloud and appears on all family devices.
2. **Given** rewards exist in the cloud, **When** a parent edits a reward's name or price, **Then** the updated reward is reflected on all connected devices.
3. **Given** rewards exist in the cloud, **When** a parent deletes a reward, **Then** it is removed from all connected devices.
4. **Given** rewards exist in the cloud, **When** a child views available rewards on any device, **Then** they see the current set of rewards with correct names and prices.

---

### User Story 3 - Graceful Behavior in Local/Guest Mode (Priority: P2)

When a user is in local (guest/offline) mode rather than cloud mode, parent PIN and rewards continue to work as they do today using local storage. There is no disruption to the offline experience.

**Why this priority**: Preserving the local-mode experience ensures the app remains usable without a Firebase account, maintaining backward compatibility.

**Independent Test**: Can be tested by using the app in local mode, setting a PIN, creating rewards, and verifying they persist across page refreshes via local storage.

**Acceptance Scenarios**:

1. **Given** a user in local/guest mode, **When** they set a parent PIN, **Then** the PIN is stored locally and enforced on that device only.
2. **Given** a user in local/guest mode, **When** they create rewards, **Then** rewards are stored locally and available on that device only.

---

### Edge Cases

- What happens when a parent sets a PIN on one device while another device is actively open? The PIN should be enforced on the other device in real time (or on next interaction with the parent panel).
- What happens if two parents on different devices edit the same reward simultaneously? The most recent write should win.
- What happens if the cloud is temporarily unavailable when a parent tries to save a PIN or reward? The system should show an error or retry, not silently fail and lose the data.
- What happens when a family migrates from local mode to cloud mode? Existing local PIN and rewards should be carried over to the cloud.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST store the parent PIN in the cloud when the family is in cloud mode.
- **FR-002**: System MUST store parent-created rewards in the cloud when the family is in cloud mode.
- **FR-003**: System MUST sync the parent PIN to all devices connected to the same family in real time.
- **FR-004**: System MUST sync rewards to all devices connected to the same family in real time.
- **FR-005**: System MUST continue to store parent PIN and rewards in local storage when in local/guest mode.
- **FR-006**: System MUST enforce the cloud-persisted parent PIN on all family devices before granting access to the parent panel.
- **FR-007**: System MUST support creating, editing, and deleting rewards from any authenticated parent device, with changes reflected everywhere.
- **FR-008**: System MUST preserve existing local PIN and rewards when a family transitions from local to cloud mode.

### Key Entities

- **Parent PIN**: A short numeric code that gates access to the parent management panel. Belongs to a family, not an individual device.
- **Reward (RewardPresent)**: A named item with a coin price that children can redeem. Belongs to a family and is managed by parents.
- **Family**: The top-level grouping that owns the parent PIN and rewards. In cloud mode, this is the unit of sync.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A parent PIN set on one device is enforceable on a second device within 5 seconds of being created.
- **SC-002**: A reward created on one device is visible on a second device within 5 seconds.
- **SC-003**: 100% of parent PIN and reward data survives device switches, browser cache clears, and app restarts in cloud mode.
- **SC-004**: Local/guest mode continues to function identically to current behavior with no regressions.
- **SC-005**: Existing users transitioning to cloud mode retain their previously created PIN and rewards without manual re-entry.

## Assumptions

- The app already supports cloud mode via Firebase with real-time data listeners for other data types (e.g., profiles, chores).
- The parent PIN is a simple numeric code (not a cryptographic credential) and does not require server-side hashing for this use case.
- Only parents (the family creator) can set/change the PIN and manage rewards; children cannot.
- The existing family data structure in the cloud already includes a rewards array and can be extended with a parent PIN field.
- Network connectivity is required for cloud operations; the system does not need to support offline-first with eventual sync for parent data.

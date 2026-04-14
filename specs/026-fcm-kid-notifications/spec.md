# Feature Specification: Push Notifications for Kids

**Feature Branch**: `026-fcm-kid-notifications`
**Created**: 2026-04-07
**Status**: Draft
**Input**: User description: "using firebase I want to send Cloud Messaging notifications to the kid when their parent has approved a chore, gave an award and bonus"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Kid Notified When Chore Is Approved (Priority: P1)

When a parent approves a chore a kid submitted, that kid's device receives a push notification celebrating the approval. The notification shows on the kid's device even if the app is not open, letting them know their effort was recognized.

**Why this priority**: Chore approval is the most frequent parent–kid interaction in the app and the primary reward loop. Instant feedback reinforces positive behavior and makes kids want to return to the app.

**Independent Test**: Parent logs in on Device A, approves a pending chore for Kid → Kid's Device B (with app closed or backgrounded) receives a push notification within a few seconds showing the chore name and a congratulatory message.

**Acceptance Scenarios**:

1. **Given** a kid has submitted a chore as pending, **When** the parent approves it in the Parent Panel, **Then** the kid's device receives a push notification within 10 seconds containing the chore name and a positive message (e.g., "Chore approved! Great job!")
2. **Given** the kid's app is open in the foreground, **When** the parent approves a chore, **Then** an in-app notification or visual indicator appears on the kid's screen acknowledging the approval
3. **Given** the kid has not granted notification permissions, **When** a chore is approved, **Then** no notification is sent (graceful failure, no error shown to parent)

---

### User Story 2 - Kid Notified When Parent Gives a Bonus (Priority: P2)

When a parent awards a bonus (extra points/coins) to a kid, the kid's device receives a push notification telling them about the bonus and the reason.

**Why this priority**: Bonus notifications reinforce spontaneous praise from parents. Without a notification, a bonus may go unnoticed until the kid next opens the app.

**Independent Test**: Parent opens Bonus tab, selects a kid and a point amount with a reason → Kid's device receives a push notification showing the bonus amount and reason within a few seconds.

**Acceptance Scenarios**:

1. **Given** a parent is in the Bonus tab, **When** the parent submits a bonus for a kid with an amount and reason, **Then** the kid's device receives a push notification within 10 seconds showing the bonus amount and reason (e.g., "+10 points — You helped with dinner!")
2. **Given** the kid's app is in the foreground, **When** a bonus is received, **Then** the notification is surfaced visibly within the app
3. **Given** the kid does not have notifications enabled, **When** a bonus is granted, **Then** the bonus still applies to their profile; no notification is sent silently

---

### User Story 3 - Kid Notified When a Reward Is Confirmed (Priority: P3)

When a parent confirms that a reward (a redeemable present from the reward list) has been given to a kid, the kid's device receives a push notification celebrating the reward.

**Why this priority**: Reward confirmation is a special milestone. A push notification makes the moment feel more exciting even if the kid is not looking at their device.

**Independent Test**: Parent confirms a reward redemption for a kid → Kid's device receives a push notification naming the reward within a few seconds.

**Acceptance Scenarios**:

1. **Given** a kid has redeemed a reward present, **When** the parent confirms it in the Parent Panel, **Then** the kid's device receives a push notification within 10 seconds (e.g., "You earned your reward: Ice Cream!")
2. **Given** the kid's app is open, **When** the reward notification arrives, **Then** an in-app indication confirms receipt
3. **Given** the kid's device is temporarily offline, **When** it reconnects, **Then** the queued notification is delivered

---

### Edge Cases

- What happens when a kid has never opened the app on their device (no notification token registered)? No notification is sent; the event (approval, bonus, reward) still updates their profile normally.
- What happens when the app is running in local (offline) mode? Push notifications are not sent — they only apply in cloud/family mode.
- What happens if the same family has multiple kids and the parent acts on one? Only the targeted kid receives the notification.
- What happens if notification delivery fails? The in-app action (approval, bonus, reward) succeeds regardless; notification failure is silent to both parent and kid.
- What happens when a kid uses the app on multiple devices? The notification is delivered to all registered devices for that kid's profile.
- What happens when the parent rejects a chore instead of approving it? No notification is sent for rejections (out of scope for v1).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST send a push notification to a kid's device when their parent approves one of their pending chores
- **FR-002**: The system MUST send a push notification to a kid's device when their parent grants them a bonus
- **FR-003**: The system MUST send a push notification to a kid's device when a reward redemption is confirmed by the parent
- **FR-004**: Each push notification MUST include a human-readable message identifying the event: the chore name for approvals, the bonus amount and reason for bonuses, and the reward name for reward confirmations
- **FR-005**: The system MUST request notification permission from the kid's device the first time they open the app in cloud/family mode
- **FR-006**: The system MUST store each kid's device notification token alongside their profile so the parent-triggered event can target the correct device(s)
- **FR-007**: Push notifications MUST only be attempted in cloud/family mode; local mode MUST NOT request permissions or attempt delivery
- **FR-008**: When the kid's app is in the foreground and a notification event arrives, the existing in-app notification display MUST be used to surface the event
- **FR-009**: All profile actions (chore approval, bonus grant, reward confirmation) MUST succeed even when notification delivery fails — no core behavior may be blocked by a notification error

### Key Entities

- **NotificationToken**: A device-level identifier associated with a kid's profile, enabling push delivery to their specific device(s); a kid may have tokens from multiple devices
- **PushEvent**: A transient event (chore approved, bonus granted, reward confirmed) that carries an event type, the target kid's profile ID, and a human-readable message payload
- **ChildProfile** (existing, extended): Stores one or more notification tokens per kid alongside existing profile data

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A push notification is delivered to the kid's device within 10 seconds of the parent action in a connected environment
- **SC-002**: 100% of parent actions (approve, bonus, reward confirmation) complete successfully even when notification delivery fails — zero regressions in core app behavior
- **SC-003**: Notification permission is requested at most once per device; a kid is never repeatedly prompted after granting or denying
- **SC-004**: Each notification reaches only the targeted kid — no cross-profile notification leakage
- **SC-005**: In local mode, zero notification-related errors, permission prompts, or messages appear to the user

## Assumptions

- The app already uses Firebase in cloud/family mode; this feature only activates when a family is connected
- Kids access the app via a web browser or PWA-capable device that supports the Web Push API and service workers
- The parent and kid are on separate devices within the same family
- Sending push messages from the client (parent's browser) to the cloud messaging service requires a server-side relay (e.g., a Firebase Cloud Function), since browser clients cannot directly send push messages to other devices
- Notification token storage is scoped per kid profile in the cloud datastore; no separate authentication account is needed for the kid
- The existing parent-side actions (approve, bonus, reward) are already implemented; this feature adds notification side-effects without altering their existing logic
- Delivery is best-effort: the system does not retry failed notifications or guarantee exactly-once delivery
- Chore rejections do not trigger notifications (excluded from scope)
- No notification management UI, history view, or read receipts are in scope for this feature

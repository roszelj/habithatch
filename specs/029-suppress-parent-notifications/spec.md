# Feature Specification: Suppress Parent-Device Notifications When Initiating Rewards

**Feature Branch**: `029-suppress-parent-notifications`
**Created**: 2026-04-10
**Status**: Draft
**Input**: User description: "do not send a push notification to the parent's device when they are initiating a bonus or reward for a kid"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Parent Grants Reward Without Receiving Own Notification (Priority: P1)

When a parent opens the Parent Panel and grants a bonus or reward to one of their kids, the kid's device receives a push notification as usual. The parent's own device does NOT receive a notification for this action, since the parent already knows what they just did — the notification would be noise.

**Why this priority**: This is the entire scope of the feature. Receiving your own notification when you triggered the action is universally considered a poor UX pattern. Eliminating it removes unnecessary interruption for parents without affecting the kid's experience.

**Independent Test**: Sign in as a parent, grant a bonus or reward to a kid profile that has notifications enabled. Verify the kid's device receives a notification. Verify the parent's device does NOT receive a notification.

**Acceptance Scenarios**:

1. **Given** a parent is signed in and grants a bonus to a kid, **When** the notification system delivers the reward alert, **Then** the kid's device receives the push notification and the parent's device does not
2. **Given** a parent is signed in and grants a reward redemption to a kid, **When** the notification system delivers the reward alert, **Then** the kid's device receives the push notification and the parent's device does not
3. **Given** the parent has no device registered for notifications, **When** a reward is granted, **Then** the kid's notification is delivered normally with no errors

---

### Edge Cases

- What if the parent and kid are sharing a device? The device would be excluded due to parent's token suppression, so the kid may not get a notification on that shared device. This is an acceptable trade-off.
- What if there are multiple parents in a family? Only the parent who initiated the reward action has their device suppressed; any co-parent's device is not affected.
- What if the kid has no devices registered for notifications? No notification is sent; behavior is unchanged from current.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: When a parent initiates a bonus or reward, the notification delivery system MUST exclude the initiating parent's registered device(s) from receiving the notification
- **FR-002**: All kid device(s) that have push notifications enabled MUST still receive the notification when a parent grants a bonus or reward
- **FR-003**: The parent's device suppression MUST apply both to bonus grants and to reward redemption approvals
- **FR-004**: The feature MUST NOT affect any other notification types (e.g., chore reminders, other events)
- **FR-005**: If the initiating parent has no registered device, the system MUST proceed normally without errors

### Key Entities

- **Notification event**: A triggered push alert associated with a specific action (bonus granted, reward redeemed) and an initiating user
- **Initiating parent**: The authenticated parent user who performed the reward or bonus action; their device tokens are excluded from delivery
- **Kid recipient**: The child profile receiving the reward; their registered devices receive the notification as normal

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 0% of bonus or reward notifications are delivered to the device of the parent who initiated the action
- **SC-002**: 100% of eligible kid devices continue to receive notifications for bonuses and rewards (no regression)
- **SC-003**: No errors or delivery failures are introduced to the notification pipeline as a result of the exclusion logic

## Assumptions

- The notification system already tracks which device tokens belong to which authenticated user (parent vs. kid)
- A parent's device is identifiable at the time of notification delivery via their authenticated user ID and registered FCM tokens
- This suppression applies only to the single parent who initiated the action, not all parent accounts in the family
- The feature does not require any new UI — it is a backend delivery behavior change only
- In-app state (points displayed, reward history) is not affected by this change; it is purely a notification routing change

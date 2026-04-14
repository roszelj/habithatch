# Tasks: Suppress Parent-Device Notifications When Initiating Rewards

**Input**: Design documents from `/specs/029-suppress-parent-notifications/`
**Prerequisites**: plan.md ✓, spec.md ✓, research.md ✓, data-model.md ✓

---

## Phase 1: User Story 1 — Parent Grants Reward Without Receiving Own Notification (Priority: P1) 🎯 MVP

**Goal**: When a parent triggers a bonus or reward, their own device's FCM token is excluded from delivery. Kids' devices still receive the notification.

**Independent Test**: Sign in as a parent on Device A (the same device the kid used to register push notifications). Grant a bonus to a kid. Verify Device A does NOT show the notification. If the kid has a second device (Device B), verify Device B receives the notification normally.

### Implementation for User Story 1

- [X] T001 [P] [US1] Add `getSenderToken(): Promise<string | null>` function and update `writePendingNotification` to accept optional `senderToken` parameter in `src/firebase/messaging.ts`
- [X] T002 [P] [US1] Update Cloud Function to read `senderToken` from notification document and filter it from target token list before sending in `functions/src/index.ts`
- [X] T003 [US1] Update `notify` method in `useCloudDataProvider` to call `getSenderToken()` and pass result to `writePendingNotification` in `src/hooks/useDataProvider.ts` (depends on T001)

**Checkpoint**: Grant a bonus from the parent panel. The parent's device receives no notification. The kid's separate device still receives the notification.

---

## Dependencies & Execution Order

- **T001** and **T002** are in different files — run in parallel
- **T003** depends on T001 (imports `getSenderToken` and calls the updated `writePendingNotification`)
- **T002** (Cloud Function) can be deployed independently after it is complete

---

## Parallel Execution

```
Launch T001 and T002 simultaneously (different files):
  T001: src/firebase/messaging.ts
  T002: functions/src/index.ts

After T001 completes:
  T003: src/hooks/useDataProvider.ts
```

---

## Implementation Strategy

1. Complete T001 and T002 in parallel
2. Complete T003 (requires T001)
3. Deploy Cloud Function: `firebase deploy --only functions`
4. Test: grant bonus from parent panel, verify parent device silent, kid device notified

---

## Notes

- `getSenderToken` must NOT prompt for permission — it returns `null` silently if permission not already granted or service worker unavailable
- The `senderToken` field in the Firestore document is optional — Cloud Function handles missing field gracefully (sends to all tokens unchanged)
- The fix applies to all `onNotify` call sites (bonus, reward unlock, chore approval) automatically since the pipeline change is in `useDataProvider.ts`
- Cloud Function changes are backward-compatible: old documents without `senderToken` are unaffected

# Research: Suppress Parent-Device Notifications When Initiating Rewards

**Branch**: `029-suppress-parent-notifications`
**Date**: 2026-04-10

---

## How the Current Notification Pipeline Works

### Full flow (as-implemented)

1. Parent grants bonus or reward in `ParentPanel` → `Game.tsx` calls `onNotify(profileId, title, body)`
2. `onNotify` is wired to `provider.notify` (defined in `useDataProvider.ts`)
3. `provider.notify` calls `writePendingNotification(familyId, targetProfileId, title, body)` in `src/firebase/messaging.ts`
4. `writePendingNotification` writes `{ targetProfileId, title, body, createdAt }` to `families/{fid}/notifications/{nid}` in Firestore
5. Cloud Function `sendKidNotification` (`functions/src/index.ts`) triggers on the new document:
   - Reads `profiles/{targetProfileId}.fcmTokens` (the kid's registered tokens)
   - Calls `getMessaging().sendEachForMulticast({ tokens: fcmTokens, … })`
   - Prunes stale tokens; deletes the notification document

### Why parents receive their own notification

FCM tokens are registered only for **kid profiles** via `registerFcmToken(familyId, profileId)`. When a parent uses the same device/browser that the kid previously used, the browser holds the same FCM token that was registered under the kid's profile. The Cloud Function sends to all tokens in that profile, which includes the parent's device — the parent receives the notification even though they triggered it.

---

## Decision: Sender-Token Exclusion Pattern

**Decision**: Pass the initiating device's current FCM token as a `senderToken` field in the pending notification document. The Cloud Function filters it out before sending.

**Rationale**:
- No new Firestore schema is needed beyond one optional field
- No parent-specific token storage is required
- Works regardless of whether the parent has registered for notifications explicitly
- Gracefully degrades: if `senderToken` is null (parent on a device without push permission granted), the Cloud Function sends to all tokens unchanged
- Does not affect any other notification type (chore approvals are not from the parent panel directly — they are initiated from within the Game and use the same `onNotify` path, so they would also benefit from this pattern if desired in future)

**Alternatives considered**:

| Alternative | Why Rejected |
|---|---|
| Store parent FCM tokens in `families/{fid}.parentFcmTokens` | Requires new registration flow for parents; parents currently never register FCM tokens under their own identity. Higher complexity for same outcome. |
| Pass initiator UID; look up parent tokens server-side | No parent FCM token collection exists; same problem as above — needs a new registration path. |
| Filter by profile type (parent vs kid) in Cloud Function | FCM tokens are attached to kid profiles only; no parent profile entity. No data to filter on. |
| Skip `writePendingNotification` when caller is in parent mode | Would suppress ALL notifications including ones that should reach the kid's separate device. Incorrect behavior. |

---

## Implementation Design

### Change 1: `src/firebase/messaging.ts`

Add `getSenderToken(): Promise<string | null>` — retrieves the current browser's FCM token without prompting for permission. Returns `null` if permission not granted, VAPID key missing, or service worker unavailable.

Update `writePendingNotification` to accept an optional `senderToken` parameter and include it in the Firestore document when present.

### Change 2: `src/hooks/useDataProvider.ts`

In `useCloudDataProvider`, the `notify` method calls `writePendingNotification`. Update it to first call `getSenderToken()` and pass the result as the fourth argument.

### Change 3: `functions/src/index.ts`

Update the Cloud Function's data type to include `senderToken?: string`. Before calling `sendEachForMulticast`, filter `fcmTokens` to exclude any token matching `senderToken`.

---

## Scope Boundaries

- **In scope**: bonus grants (ParentPanel → Game `onBonus` → `onNotify`) and reward unlocks (Game `handleRedeemReward` → `onNotify`)
- **In scope**: chore approvals that use the same `onNotify` path — the fix is in the notification pipeline itself, so all callers automatically benefit
- **Out of scope**: local-mode (no Firestore, no Cloud Functions, no FCM)
- **Out of scope**: UI changes — the feature is purely a backend delivery routing change

---

## Constitution Check

| Principle | Status | Notes |
|---|---|---|
| I. Fun-First Design | ✓ PASS | No player-facing change; kids still receive notifications as before |
| II. Ship & Iterate | ✓ PASS | Minimal 3-file change; no new dependencies |
| III. Kid-Safe Always | ✓ PASS | Does not affect PII handling; no new data collected |

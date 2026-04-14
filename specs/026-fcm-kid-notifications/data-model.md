# Data Model: FCM Push Notifications for Kids

**Feature**: 026-fcm-kid-notifications | **Date**: 2026-04-07

---

## Entities

### 1. ChildProfile (modified)

**Existing entity** in `families/{familyId}/profiles/{profileId}`.

**Added field**:

| Field | Type | Description |
|-------|------|-------------|
| `fcmTokens` | `string[]` (optional) | FCM registration tokens for all of the kid's devices. Array because a kid may use the app on multiple browsers/devices. Absent if the kid has never granted push permission. |

**Validation**:
- Maximum reasonable length: 10 tokens (deduplicate on write; remove stale tokens returned as invalid by FCM)
- Each token is a non-empty string

**Change behavior**: When a new token is obtained on the kid's device, compare with the stored array. If not present, append and write to Firestore. If already present, skip write.

---

### 2. PendingNotification (new, transient)

**Firestore path**: `families/{familyId}/notifications/{notificationId}`

This document is written by the parent's app when a triggering event occurs (chore approval, bonus, reward confirmation). It is consumed and deleted by the Cloud Function.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `type` | `'chore-approved' \| 'bonus' \| 'reward'` | Yes | Discriminator for the event type |
| `targetProfileId` | `string` | Yes | Profile ID of the kid who should receive the notification |
| `title` | `string` | Yes | Short notification title (e.g., `"Chore approved! 🎉"`) |
| `body` | `string` | Yes | Notification body (e.g., `"Great job completing: Make bed!"`) |
| `createdAt` | `Timestamp` | Yes | Server timestamp; used for TTL cleanup if function fails |

**Lifecycle**:
1. Written by parent's browser when a chore is approved, bonus is granted, or reward is confirmed
2. Cloud Function triggers on creation, reads `targetProfileId`, fetches tokens, sends FCM
3. Cloud Function deletes the document after processing (success or failure after retries)
4. If processing fails permanently, document stays in Firestore (can be cleaned up manually or via a scheduled function — out of scope for v1)

---

### 3. NotificationPayload (conceptual, not stored)

The data passed to FCM for delivery. Not persisted in Firestore — exists only in transit.

| Field | Value source |
|-------|-------------|
| `notification.title` | `PendingNotification.title` |
| `notification.body` | `PendingNotification.body` |
| `notification.icon` | `/creature-charactors/sloth.png` (fixed app icon) |
| `tokens` | `ChildProfile.fcmTokens` for the target profile |

---

## Firestore Collection Additions

```
families/
└── {familyId}/
    ├── profiles/
    │   └── {profileId}           (MODIFIED: + fcmTokens: string[])
    └── notifications/            (NEW collection)
        └── {notificationId}      (PendingNotification — transient)
```

---

## State Transitions

### Token Registration

```
[Kid opens app in cloud mode]
       ↓
[Notification permission requested]
       ↓
  Permission granted?
  ├── Yes → getToken() → compare with stored fcmTokens
  │          ├── Token new → append to fcmTokens, write to Firestore
  │          └── Token known → no-op
  └── No  → store denial flag in localStorage, do not prompt again
```

### Notification Delivery

```
[Parent action: approve / bonus / reward]
       ↓
[Write PendingNotification to Firestore]
       ↓
[Cloud Function: onDocumentCreated]
       ↓
[Read targetProfile.fcmTokens]
  ├── Empty/absent → skip FCM, delete notification doc
  └── Has tokens → sendEachForMulticast
             ├── Success → delete notification doc
             └── Invalid tokens → remove from profile.fcmTokens, delete doc
```

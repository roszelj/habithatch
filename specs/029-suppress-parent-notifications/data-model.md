# Data Model: Suppress Parent-Device Notifications

**Branch**: `029-suppress-parent-notifications`
**Date**: 2026-04-10

---

## Firestore: Pending Notification Document

Collection path: `families/{familyId}/notifications/{notifId}`

### Before (current)

```
{
  targetProfileId: string,   // kid's profile ID to deliver to
  title: string,             // notification title
  body: string,              // notification body
  createdAt: Timestamp       // server timestamp (for ordering/TTL)
}
```

### After (this feature)

```
{
  targetProfileId: string,   // kid's profile ID to deliver to
  title: string,             // notification title
  body: string,              // notification body
  createdAt: Timestamp,      // server timestamp (for ordering/TTL)
  senderToken?: string       // [NEW, OPTIONAL] FCM token of the initiating device;
                             // Cloud Function excludes this token from delivery targets
}
```

**Notes**:
- `senderToken` is optional. If absent or null, the Cloud Function sends to all tokens in the kid's profile (existing behavior, fully backward-compatible).
- No new collections or documents are introduced.
- Existing profile schema (`families/{fid}/profiles/{pid}.fcmTokens: string[]`) is unchanged.

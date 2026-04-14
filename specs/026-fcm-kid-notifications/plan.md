# Implementation Plan: FCM Push Notifications for Kids

**Branch**: `026-fcm-kid-notifications` | **Date**: 2026-04-07 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/026-fcm-kid-notifications/spec.md`

## Summary

Send Firebase Cloud Messaging (FCM) push notifications to a kid's device when their parent approves a chore, gives a bonus, or confirms a reward. The architecture: kid's browser registers for push and stores an FCM token on their Firestore profile; parent actions write a transient "notification outbox" document to Firestore; a Cloud Function (2nd gen) triggers on the new doc, reads the kid's token(s), and sends the push via FCM Admin SDK; a service worker handles background delivery; the existing in-app notification area handles foreground delivery.

## Technical Context

**Language/Version**: TypeScript 5.6 (app) + TypeScript 5.x (Cloud Functions)
**Primary Dependencies**: React 19, Vite 5, Firebase JS SDK v12 (`firebase/messaging`), Firebase Cloud Functions v2 (`firebase-functions/v2`), Firebase Admin SDK v13 (`firebase-admin`)
**Storage**: Firestore — `families/{fid}/profiles/{pid}` extended with `fcmTokens: string[]`; new `families/{fid}/notifications/{nid}` outbox collection (transient)
**Testing**: `npm run build` (TypeScript gate); manual end-to-end test per quickstart.md scenarios
**Target Platform**: Web PWA (Chrome/Edge/Firefox on desktop + Android; Safari 16.4+ on iOS)
**Project Type**: Web SPA + Firebase Cloud Functions (2nd gen)
**Performance Goals**: Notification delivered within 10 seconds of parent action (FCM SLA)
**Constraints**: Browser notification permission required; local mode MUST NOT trigger any FCM logic; all parent actions must succeed even when FCM fails
**Scale/Scope**: 6 source files modified, 4 new files created (service worker, messaging module, Cloud Function, types extension)

## Constitution Check

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Fun-First Design | PASS | Push notifications reinforce the reward loop — kid gets instant delight when parent approves a chore, even with the app closed |
| II. Ship & Iterate | PASS | All three event types share the same infrastructure (service worker, token registration, Cloud Function); implementing all three together is the smallest viable unit |
| III. Kid-Safe Always | PASS (with note) | FCM tokens are device identifiers, not PII (no name/email/phone). No new personal data collected. Notification payloads contain only game context (chore names, bonus amounts). Parent has already opted in to cloud mode. Browser push permission requires explicit user grant. Note: review for COPPA compliance if app targets users under 13 |

## Project Structure

### Documentation (this feature)

```text
specs/026-fcm-kid-notifications/
├── plan.md           # This file
├── research.md       # Phase 0 output
├── data-model.md     # Phase 1 output
├── quickstart.md     # Phase 1 output
└── tasks.md          # Phase 2 output (/speckit.tasks command)
```

### Source Code

```text
functions/                                (NEW — Cloud Functions project)
├── package.json
├── tsconfig.json
└── src/
    └── index.ts                          (NEW — FCM send trigger)

public/
└── firebase-messaging-sw.js             (NEW — background push service worker)

src/
├── firebase/
│   ├── config.ts                        (MODIFY — export messaging instance)
│   └── messaging.ts                     (NEW — token registration, onMessage)
├── models/
│   └── types.ts                         (MODIFY — add fcmTokens?: string[] to ChildProfile)
└── hooks/
    └── useDataProvider.ts               (MODIFY — call registerFcmToken in cloud provider; write PendingNotification on approve/bonus/reward)

.env.local                               (MODIFY — add VITE_FIREBASE_VAPID_KEY)
firebase.json                            (MODIFY — add functions config)
```

## Implementation Detail

### Environment Variables

Add to `.env.local`:
```
VITE_FIREBASE_VAPID_KEY=<from Firebase Console → Project Settings → Cloud Messaging → Web Push certificates>
```

### `public/firebase-messaging-sw.js` (new)

Service worker for background FCM messages. Must use the compat SDK (ES modules not supported in all SW environments):

```js
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: '...',          // hardcoded — this is a public key, safe in SW
  projectId: '...',
  messagingSenderId: '...',
  appId: '...',
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const { title, body } = payload.notification ?? {};
  self.registration.showNotification(title ?? 'HabitHatch', {
    body: body ?? '',
    icon: '/creature-charactors/sloth.png',
  });
});
```

Note: The config values in the service worker must be hardcoded (Vite env vars are not available in service workers). These are client-facing public keys — it's safe to hardcode them.

### `src/firebase/config.ts` (modify)

Add `getMessaging` export:
```ts
import { getMessaging } from 'firebase/messaging';
export const messaging = getMessaging(app);
```

### `src/firebase/messaging.ts` (new)

```ts
import { getToken, onMessage } from 'firebase/messaging';
import { messaging } from './config';
import { doc, arrayUnion, updateDoc } from 'firebase/firestore';
import { db } from './config';

const VAPID_KEY = import.meta.env.VITE_FIREBASE_VAPID_KEY as string;
const DENIED_KEY = 'fcm_permission_denied';

export async function registerFcmToken(familyId: string, profileId: string): Promise<void> {
  if (localStorage.getItem(DENIED_KEY)) return;
  if (!('Notification' in window)) return;

  let permission = Notification.permission;
  if (permission === 'default') {
    permission = await Notification.requestPermission();
  }
  if (permission !== 'granted') {
    localStorage.setItem(DENIED_KEY, '1');
    return;
  }

  try {
    const token = await getToken(messaging, { vapidKey: VAPID_KEY });
    if (token) {
      await updateDoc(doc(db, 'families', familyId, 'profiles', profileId), {
        fcmTokens: arrayUnion(token),
      });
    }
  } catch {
    // Browser doesn't support push or service worker not registered — fail silently
  }
}

export function subscribeFcmForeground(
  onNotification: (title: string, body: string) => void
): () => void {
  return onMessage(messaging, (payload) => {
    const title = payload.notification?.title ?? '';
    const body = payload.notification?.body ?? '';
    onNotification(title, body);
  });
}
```

### `src/models/types.ts` (modify)

Add `fcmTokens` to `ChildProfile`:
```ts
export interface ChildProfile {
  // ... existing fields ...
  fcmTokens?: string[];  // FCM registration tokens for push notifications (one per device)
}
```

### `src/hooks/useDataProvider.ts` (modify — cloud provider only)

1. After the kid's cloud context is established (`cloudContext` set), call `registerFcmToken(familyId, profileId)` for the active profile.
2. Add a helper `writePendingNotification(familyId, notification)` that writes to `families/{familyId}/notifications/{id}`.
3. In `approveChore` (cross-profile approval path), call `writePendingNotification` with `type: 'chore-approved'`, `title`, `body` (chore name).
4. In the bonus handler, call `writePendingNotification` with `type: 'bonus'`, `title`, `body` (amount + reason).
5. In the reward fulfillment handler (when parent marks a reward fulfilled), call `writePendingNotification` with `type: 'reward'`, `title`, `body` (reward name).
6. Subscribe to `subscribeFcmForeground` for the active kid's session; route incoming foreground messages into the existing notification display.

All `writePendingNotification` calls are fire-and-forget (`.catch(() => {})`). Parent actions MUST NOT await notification delivery.

### `functions/src/index.ts` (new Cloud Function)

```ts
import { onDocumentCreated } from 'firebase-functions/v2/firestore';
import { initializeApp } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { getMessaging } from 'firebase-admin/messaging';

initializeApp();
const db = getFirestore();
const fcm = getMessaging();

export const sendKidNotification = onDocumentCreated(
  'families/{familyId}/notifications/{notifId}',
  async (event) => {
    const data = event.data?.data();
    if (!data) return;

    const { targetProfileId, title, body, familyId } = data as {
      targetProfileId: string;
      title: string;
      body: string;
      familyId: string;
    };

    // Get the kid's FCM tokens
    const profileSnap = await db
      .doc(`families/${event.params.familyId}/profiles/${targetProfileId}`)
      .get();
    const fcmTokens: string[] = profileSnap.data()?.fcmTokens ?? [];

    if (fcmTokens.length > 0) {
      const response = await fcm.sendEachForMulticast({
        tokens: fcmTokens,
        notification: { title, body },
        webpush: {
          notification: {
            icon: '/creature-charactors/sloth.png',
          },
        },
      });

      // Remove invalid tokens
      const invalidTokens = response.responses
        .map((r, i) => (!r.success ? fcmTokens[i] : null))
        .filter(Boolean) as string[];

      if (invalidTokens.length > 0) {
        await db
          .doc(`families/${event.params.familyId}/profiles/${targetProfileId}`)
          .update({ fcmTokens: FieldValue.arrayRemove(...invalidTokens) });
      }
    }

    // Delete the notification doc after processing
    await event.data?.ref.delete();
  }
);
```

### `functions/package.json` (new)

```json
{
  "name": "habithatch-functions",
  "version": "1.0.0",
  "main": "lib/index.js",
  "scripts": {
    "build": "tsc",
    "serve": "npm run build && firebase emulators:start --only functions",
    "deploy": "firebase deploy --only functions"
  },
  "engines": { "node": "20" },
  "dependencies": {
    "firebase-admin": "^13.0.0",
    "firebase-functions": "^6.0.0"
  },
  "devDependencies": {
    "typescript": "^5.6.0",
    "@types/node": "^20.0.0"
  }
}
```

### `firebase.json` (modify)

Add functions configuration to the existing firebase.json (which currently has hosting/firestore config):
```json
{
  "functions": {
    "source": "functions",
    "runtime": "nodejs20"
  }
}
```

## Firestore Security Rules Update

The `families/{familyId}/notifications` collection needs to be writable by authenticated parents. Kids do not need read access (the Cloud Function uses Admin SDK). Add to Firestore rules:

```
match /families/{familyId}/notifications/{notifId} {
  allow create: if request.auth != null &&
    get(/databases/$(database)/documents/families/$(familyId)).data.parentUid == request.auth.uid;
  allow read, update, delete: if false; // Cloud Function uses Admin SDK
}
```

## Deployment Notes

1. `npm install firebase/messaging` is already in Firebase JS SDK v12 — no new client dependency
2. Cloud Functions require `firebase-admin` and `firebase-functions` in `functions/package.json`
3. Deploy Cloud Functions: `firebase deploy --only functions`
4. The VAPID key must be created in Firebase Console before testing
5. Service worker (`firebase-messaging-sw.js`) is served from the root — Vite's `/public` directory handles this automatically in both dev and prod

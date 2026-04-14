# Research: FCM Push Notifications for Kids

**Feature**: 026-fcm-kid-notifications | **Date**: 2026-04-07

---

## Decision 1: Token registration and storage

**Decision**: Use `getToken(messaging, { vapidKey })` from `firebase/messaging` on the kid's device to obtain an FCM registration token. Store it as `fcmTokens: string[]` on the kid's `ChildProfile` document in Firestore (`families/{familyId}/profiles/{profileId}`). An array supports multiple devices per kid.

**Rationale**: The kid's profile already lives in Firestore, making it the natural home for their device tokens. An array allows notifications to reach the kid on any device they use. The token must be re-fetched on every app load (it may rotate) and compared with the stored value; if different, update Firestore.

**Alternatives considered**:
- Separate `fcmTokens` subcollection — rejected: unnecessary indirection for a small number of tokens per kid.
- Store token in localStorage only — rejected: token needs to be accessible to the parent's Cloud Function trigger, which reads Firestore.

---

## Decision 2: Notification relay architecture

**Decision**: Use the **Firestore notification outbox pattern** with a Firebase Cloud Function (2nd gen) trigger.

Flow:
1. Parent action (approve chore, give bonus, confirm reward) writes a document to `families/{familyId}/notifications/{notifId}` with fields: `type`, `targetProfileId`, `title`, `body`, `createdAt`.
2. A Cloud Function (`onDocumentCreated`) fires on new documents in that path.
3. The function reads the target profile's `fcmTokens` from Firestore.
4. The function calls `admin.messaging().sendEachForMulticast(...)` to push to all registered tokens.
5. The notification document is deleted after processing (or after a TTL).

**Rationale**: Browser clients cannot send FCM messages to other devices — FCM sending requires the Firebase Admin SDK, which can only run in a trusted server environment (Cloud Functions, backend). The outbox pattern decouples the parent's action from the notification send: the parent writes a Firestore doc (cheap, reliable), and the Cloud Function delivers asynchronously. This means parent actions are never blocked by notification failures.

**Alternatives considered**:
- Firebase Callable Function (parent calls it directly) — viable, but requires the parent's app to make an extra HTTP call; the outbox trigger is more fire-and-forget and doesn't add latency to the parent's UI action.
- FCM HTTP v1 API called from the parent's browser — rejected: requires a server auth token (Admin SDK) that must not be exposed to browser clients.
- Firebase Extensions (FCM Send) — rejected: overkill for a simple three-event use case.

---

## Decision 3: Service worker for background notifications

**Decision**: Place `firebase-messaging-sw.js` in `/public` (Vite serves `/public` as the root). The service worker must import the Firebase messaging compat SDK and call `firebase.messaging()`.

Required content:
```js
importScripts('https://www.gstatic.com/firebasejs/10.x.x/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.x.x/firebase-messaging-compat.js');

firebase.initializeApp({ /* same config as app */ });
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const { title, body } = payload.notification;
  self.registration.showNotification(title, { body, icon: '/creature-charactors/sloth.png' });
});
```

**Rationale**: Firebase requires a service worker named exactly `firebase-messaging-sw.js` at the root path. Vite's `/public` directory copies files verbatim to the build output root, making it the correct location. The compat SDK is used in the service worker because ES module imports are not supported in all service worker environments.

**Alternatives considered**:
- Custom service worker with workbox — rejected: adds complexity without benefit for this use case.
- Inline service worker registration — not supported by Firebase messaging.

---

## Decision 4: Foreground message handling

**Decision**: In the React app, use `onMessage(messaging, handler)` from `firebase/messaging` to receive FCM messages when the app is in the foreground. Feed the payload into the existing `notifications` state in `Game.tsx` (the `BonusNotification` array already displayed in the notification area).

**Rationale**: The in-app notification display already exists (`notifications` state, `styles.notificationArea`). Reusing it avoids creating a separate UI component and keeps the kid experience consistent with bonus notifications they already receive.

**Alternatives considered**:
- Show a browser notification even in foreground — rejected: browser suppresses duplicate notifications; the in-app display is friendlier.
- New dedicated FCM notification component — rejected: over-engineering; the existing area works.

---

## Decision 5: Cloud Functions project setup

**Decision**: Create a `functions/` directory at the repo root with TypeScript, Firebase Functions v2 (2nd gen), and `firebase-admin` v13. Use `onDocumentCreated` from `firebase-functions/v2/firestore`.

Key files:
```
functions/
├── package.json          (firebase-admin, firebase-functions)
├── tsconfig.json
└── src/
    └── index.ts          (onDocumentCreated trigger + FCM send)
```

The VAPID key is stored as `VITE_FIREBASE_VAPID_KEY` in `.env.local` (client side). Cloud Functions use the default Firebase Admin credentials — no additional env config needed.

**Rationale**: Cloud Functions v2 (2nd gen) uses Google Cloud Run under the hood and is the current recommended approach. TypeScript matches the rest of the codebase. `onDocumentCreated` is the correct trigger for a "new document in collection" pattern.

**Alternatives considered**:
- Firebase Functions v1 — rejected: v1 is being deprecated; v2 is the current standard.
- Cloud Run directly — rejected: unnecessary complexity; Cloud Functions abstracts the container lifecycle.

---

## Decision 6: VAPID key and environment config

**Decision**: Generate a VAPID key in Firebase Console → Project Settings → Cloud Messaging → Web Push certificates. Add it as `VITE_FIREBASE_VAPID_KEY` in `.env.local`. Also add `VITE_FIREBASE_MESSAGING_SENDER_ID` (already captured in the existing firebase config as `messagingSenderId`, but confirmed it's needed for messaging).

**Rationale**: The VAPID key is required by browsers to authenticate web push subscriptions. It's a public key and safe to expose to the client. It must be available at runtime for `getToken()` to work.

---

## Decision 7: Token permission UX

**Decision**: Request notification permission once, immediately after a kid joins a family in cloud mode (when `cloudContext` is first set). If permission is denied, store `fcmPermissionDenied: true` in localStorage to avoid re-prompting. If the browser does not support push (e.g., Safari < 16.4), skip silently.

**Rationale**: One-time prompt avoids annoying the kid. Storing the denial flag in localStorage (not Firestore) avoids a write for a negative result. Browser compatibility is handled gracefully with a try/catch around `getToken`.

---

## Decision 8: Scope for v1 (MVP)

**Decision**: Implement all three notification types (chore approval, bonus, reward) together in one branch. The Cloud Function handles all three event types from the same outbox collection with a `type` field discriminator. Client-side token registration is shared infrastructure.

**Rationale**: The service worker, token registration, and Cloud Function scaffolding are shared across all three event types. Building them together avoids setting up the same infrastructure three times across three branches. All three are low-complexity additions once the infrastructure is in place.

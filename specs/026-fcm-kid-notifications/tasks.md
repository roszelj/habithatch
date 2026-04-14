# Tasks: FCM Push Notifications for Kids

**Input**: Design documents from `/specs/026-fcm-kid-notifications/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, quickstart.md

**Organization**: Three user stories — US1 (chore approval), US2 (bonus), US3 (reward confirmation). All share foundational infrastructure (Phase 2) before story-specific wiring begins.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to
- Include exact file paths in descriptions

---

## Phase 1: Setup

**Purpose**: Create the Cloud Functions project structure required by all user stories.

**⚠️ Manual step before coding**: Generate a VAPID key in Firebase Console → Project Settings → Cloud Messaging → Web Push certificates. Copy the key value for use in T002.

- [x] T001 Create `functions/` directory at repo root with `functions/package.json` (name: "habithatch-functions", engines: {node:"22"}, main: "lib/index.js", scripts: {build:"tsc", serve:"npm run build && firebase emulators:start --only functions", deploy:"firebase deploy --only functions"}, dependencies: {firebase-admin:"^13.0.0", firebase-functions:"^6.0.0"}, devDependencies: {typescript:"^5.6.0", "@types/node":"^20.0.0"}) and `functions/tsconfig.json` (compilerOptions: {module:"commonjs", outDir:"lib", target:"es2022", strict:true, skipLibCheck:true, noImplicitReturns:true, sourceMap:true}, include:["src"])
- [x] T002 Add `VITE_FIREBASE_VAPID_KEY=<paste-your-vapid-key-here>` to `.env.local` at repo root (add below the existing VITE_FIREBASE_* vars with a comment: `# FCM Web Push — get from Firebase Console → Project Settings → Cloud Messaging → Web Push certificates`)
- [x] T003 In `firebase.json` at repo root, add a `"functions"` block: `"functions": { "source": "functions", "runtime": "nodejs22" }` alongside the existing hosting/firestore blocks

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Shared client-side infrastructure and the Cloud Function — all three user stories depend on this.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [x] T004 [P] Add `fcmTokens?: string[]` optional field to the `ChildProfile` interface in `src/models/types.ts` immediately after the `redeemedRewards` field (no migration needed — existing profiles without the field simply cannot receive push notifications)
- [x] T005 [P] In `src/firebase/config.ts`: (a) change `const app = initializeApp(firebaseConfig)` to `export const app = initializeApp(firebaseConfig)`; (b) add `import { getMessaging } from 'firebase/messaging'` and `export const messaging = getMessaging(app)` after the `db` export
- [x] T006 [P] Create `public/firebase-messaging-sw.js`: import Firebase compat SDK v12.11.0 via `importScripts('https://www.gstatic.com/firebasejs/12.11.0/firebase-app-compat.js')` and `importScripts('https://www.gstatic.com/firebasejs/12.11.0/firebase-messaging-compat.js')`; call `firebase.initializeApp({ apiKey, authDomain, projectId, storageBucket, messagingSenderId, appId })` with the same values from `.env.local` (hardcoded — these public client keys are safe in service workers); call `firebase.messaging().onBackgroundMessage(payload => { const {title,body} = payload.notification ?? {}; self.registration.showNotification(title ?? 'HabitHatch', { body: body ?? '', icon: '/creature-charactors/sloth.png' }); })`
- [x] T007 Create `src/firebase/messaging.ts` with three exported functions (all import from `'firebase/messaging'`, `'firebase/firestore'`, and `'./config'`): (a) `export async function registerFcmToken(familyId: string, profileId: string): Promise<void>` — if `localStorage.getItem('fcm_denied')` return early; if `!('Notification' in window)` return; request permission with `Notification.requestPermission()`; if not granted set `localStorage.setItem('fcm_denied','1')` and return; call `getToken(messaging, { vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY as string })` inside try/catch; if token obtained call `updateDoc(doc(db,'families',familyId,'profiles',profileId), { fcmTokens: arrayUnion(token) })`; (b) `export function subscribeFcmForeground(cb: (title: string, body: string) => void): () => void` — returns `onMessage(messaging, payload => { cb(payload.notification?.title ?? '', payload.notification?.body ?? '') })`; (c) `export async function writePendingNotification(familyId: string, targetProfileId: string, title: string, body: string): Promise<void>` — calls `addDoc(collection(db,'families',familyId,'notifications'), { targetProfileId, title, body, createdAt: serverTimestamp() })` (depends on T005)
- [x] T008 Create `functions/src/index.ts`: import `initializeApp` from `'firebase-admin/app'` and call `initializeApp()`; import `getFirestore`, `FieldValue` from `'firebase-admin/firestore'`; import `getMessaging` from `'firebase-admin/messaging'`; import `onDocumentCreated` from `'firebase-functions/v2/firestore'`; export `sendKidNotification = onDocumentCreated('families/{familyId}/notifications/{notifId}', async event => { const data = event.data?.data(); if (!data) return; const { targetProfileId, title, body } = data; const db = getFirestore(); const profileSnap = await db.doc(\`families/${event.params.familyId}/profiles/${targetProfileId}\`).get(); const fcmTokens: string[] = profileSnap.data()?.fcmTokens ?? []; if (fcmTokens.length > 0) { const response = await getMessaging().sendEachForMulticast({ tokens: fcmTokens, notification: { title, body }, webpush: { notification: { icon: '/creature-charactors/sloth.png' } } }); const stale = fcmTokens.filter((_,i) => !response.responses[i].success); if (stale.length > 0) await db.doc(\`families/${event.params.familyId}/profiles/${targetProfileId}\`).update({ fcmTokens: FieldValue.arrayRemove(...stale) }); } await event.data?.ref.delete(); })` (depends on T001)
- [x] T009 In `src/hooks/useDataProvider.ts`: (a) add `notify?: (targetProfileId: string, title: string, body: string) => void` to the `DataProvider` interface; (b) in `useCloudDataProvider`, implement `notify: (targetProfileId, title, body) => { writePendingNotification(familyIdRef.current, targetProfileId, title, body).catch(() => {}); }` (import `writePendingNotification` from `'../firebase/messaging'`); the local provider does not need a `notify` implementation (undefined is acceptable for the optional field) (depends on T007)

**Checkpoint**: Foundation complete — `npm run build` passes, `cd functions && npm run build` passes, service worker exists at `/public/firebase-messaging-sw.js`.

---

## Phase 3: User Story 1 — Kid Notified When Chore Is Approved (Priority: P1) 🎯 MVP

**Goal**: When a parent approves a chore in the Parent Panel, the kid's device receives a push notification with the chore name.

**Independent Test**: Parent on Device A approves a pending chore → Kid's Device B (app backgrounded) shows a system push notification titled "Chore approved! 🎉" with the chore name in the body within 10 seconds.

### Implementation for User Story 1

- [x] T010 [US1] In `src/App.tsx`: (a) add `const [fcmToast, setFcmToast] = useState<{ title: string; body: string } | null>(null)`; (b) add a `useEffect` that subscribes to `subscribeFcmForeground((title, body) => setFcmToast({ title, body }))` when `provider.cloudContext !== null` — store the returned unsubscribe fn and call it on cleanup; (c) add a `useEffect` that calls `registerFcmToken(provider.cloudContext.familyId, phase.profileId)` when `phase.step === 'play' && provider.cloudContext !== null`; (d) add `onNotify={provider.notify}` and `fcmToast={fcmToast}` props to the `<Game />` element; (e) import `registerFcmToken`, `subscribeFcmForeground` from `'./firebase/messaging'` (depends on T007, T009)
- [x] T011 [US1] In `src/components/Game.tsx`: (a) add `onNotify?: (profileId: string, title: string, body: string) => void` and `fcmToast?: { title: string; body: string } | null` to `GameProps` and destructure in the function signature; (b) in `handleCrossProfileApprove`, before the `onUpdateAppData` call for cross-profile approvals, find the chore name: `const choreName = appData.profiles.find(p => p.id === profileId)?.chores[category].find(c => c.id === choreId)?.name ?? 'a chore'`; then after updating, call `onNotify?.(profileId, 'Chore approved! 🎉', \`Great job completing: ${choreName}!\`)`; (c) for the same-profile approve path (where `profileId === profile.id`), find the chore name from `chores[category]` and also call `onNotify?.(profile.id, 'Chore approved! 🎉', \`Great job completing: ${choreName}!\`)`; (d) add a `useEffect` that watches `fcmToast` — when non-null, create a `BonusNotification`-shaped object (`{ id: String(Date.now()), category: 'morning', amount: 0, reason: \`${fcmToast.title}: ${fcmToast.body}\`, timestamp: new Date().toISOString() }`) and push it into `notifications` state (depends on T010)

**Checkpoint**: Parent approves chore → push notification appears on kid's device within 10 seconds → in-app toast appears if app is open.

---

## Phase 4: User Story 2 — Kid Notified When Parent Gives a Bonus (Priority: P2)

**Goal**: When a parent submits a bonus in the Bonus tab, the kid receives a push notification showing the bonus amount and reason.

**Independent Test**: Parent opens Bonus tab, enters amount + reason, submits → Kid's device receives push notification "+N bonus points — [reason]" within 10 seconds.

### Implementation for User Story 2

- [x] T012 [US2] In `src/components/Game.tsx`, inside the `onBonus` callback prop passed to `<ParentPanel />`: for the cross-profile path (where `profileId !== profile.id`), after the `onUpdateAppData` call, add `onNotify?.(profileId, \`+${amount} bonus points! 🌟\`, reason || 'Great work!')`; for the same-profile path (where `profileId === profile.id`), after `dispatch({ type: 'earn', ... })`, add `onNotify?.(profile.id, \`+${amount} bonus points! 🌟\`, reason || 'Great work!')` (depends on T011)

**Checkpoint**: Parent submits bonus for any kid → push notification appears on kid's device with amount and reason.

---

## Phase 5: User Story 3 — Kid Notified When a Reward Is Confirmed (Priority: P3)

**Goal**: When a parent marks a redeemed reward as fulfilled, the kid receives a push notification naming the reward.

**Independent Test**: Kid redeems a reward in the Store (coins deducted, `fulfilled: false` added to their `redeemedRewards`) → Parent sees the pending redemption in the Rewards tab → Parent clicks "Give it!" → Kid's device receives push notification "Reward unlocked! 🎁 — [reward name]" within 10 seconds.

### Implementation for User Story 3

- [x] T013 [US3] In `src/components/ParentPanel.tsx`: (a) add `onFulfillReward: (profileId: string, redeemedRewardId: string, rewardName: string) => void` to `ParentPanelProps` and destructure it; (b) in the rewards tab content (where `tab === 'rewards'`), after the existing reward management UI, add a section titled "Pending Redemptions" that iterates over all profiles' `redeemedRewards.filter(r => !r.fulfilled)` and renders each as `"[childName] wants: [rewardName]"` with a "Give it! 🎁" button that calls `onFulfillReward(p.id, r.id, r.rewardName)`; import necessary types from `'../models/types'` (depends on T010)
- [x] T014 [US3] In `src/components/Game.tsx`: (a) add `onFulfillReward?: (profileId: string, redeemedRewardId: string, rewardName: string) => void` to `GameProps` and destructure it; (b) implement `handleFulfillReward = useCallback((profileId, redeemedRewardId, rewardName) => { if (profileId === profile.id) { setRedeemedRewards(prev => prev.map(r => r.id === redeemedRewardId ? { ...r, fulfilled: true } : r)); } else { const target = appData.profiles.find(p => p.id === profileId); if (!target) return; onUpdateAppData({ ...appData, parentPin, profiles: appData.profiles.map(p => p.id === profileId ? { ...target, redeemedRewards: target.redeemedRewards.map(r => r.id === redeemedRewardId ? { ...r, fulfilled: true } : r) } : p) }); } onNotify?.(profileId, 'Reward unlocked! 🎁', \`You earned: ${rewardName}!\`); }, [profile.id, appData, onUpdateAppData, parentPin, onNotify])`; (c) pass `onFulfillReward={handleFulfillReward}` to the `<ParentPanel />` element in the `view === 'parent'` branch (depends on T013)
- [x] T015 [US3] In `src/App.tsx`, pass `onFulfillReward` (no-op or undefined; the prop is optional) — verify that the `<Game />` element still compiles after T014 adds the new optional prop. No code change needed if the prop is optional. (depends on T014)

**Checkpoint**: Kid redeems reward → Parent sees it in Rewards tab → Parent clicks "Give it!" → push notification delivered to kid.

---

## Phase 6: Polish & Validation

- [x] T016 Run `npm run build` from repo root and confirm zero TypeScript errors in the main app
- [x] T017 Run `cd functions && npm run build` and confirm zero TypeScript errors in the Cloud Function; fix any type errors before proceeding
- [x] T018 Manually validate quickstart.md Scenario 4 (no permission granted → no error shown) and Scenario 5 (local mode → no FCM prompt, no errors)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)** — T001, T002, T003: No dependencies, can start immediately; T001 and T002/T003 can run in parallel
- **Foundational (Phase 2)** — T004, T005, T006 can run in parallel (different files); T007 depends on T005; T008 depends on T007; T009 depends on T007; T004 has no dependents beyond compile-time type correctness
- **US1 (Phase 3)** — T010 depends on T007 + T009; T011 depends on T010
- **US2 (Phase 4)** — T012 depends on T011
- **US3 (Phase 5)** — T013 depends on T010 (needs `onNotify` in scope); T014 depends on T013; T015 depends on T014
- **Polish (Phase 6)** — depends on all desired stories complete

### Within User Story 1

- T010 (App.tsx wiring) must complete before T011 (Game.tsx uses the new props)
- T011 must complete before US2 and US3 (they extend Game.tsx)

### Parallel Opportunities

- T004 [P], T005 [P], T006 [P] — all different files, no inter-dependencies
- T001 (functions dir) can run in parallel with T002/T003/T004/T005/T006
- T008 (Cloud Function) can be developed in parallel with T009 (provider notify) since they are different codebases (functions/ vs src/)

---

## Parallel Example

```
Start in parallel:
  T001 (functions/ project init)
  T002 (.env.local VAPID key)
  T003 (firebase.json)
  T004 (types.ts — fcmTokens field)
  T005 (config.ts — export app + messaging)
  T006 (firebase-messaging-sw.js)

After T005:
  T007 (messaging.ts — registerFcmToken, subscribeFcmForeground, writePendingNotification)
  T008 (functions/src/index.ts — Cloud Function) [can start after T001]

After T007:
  T009 (useDataProvider.ts — add notify to DataProvider + cloud impl)

After T009:
  T010 (App.tsx — FCM wiring + props to Game)

After T010:
  T011 (Game.tsx — onNotify prop + chore approve notification)  [US1 complete]
  T013 (ParentPanel.tsx — pending redemptions UI)               [US3 starts]

After T011:
  T012 (Game.tsx — bonus notification)                          [US2 complete]

After T013:
  T014 (Game.tsx — handleFulfillReward)
  T015 (App.tsx — verify compile)                              [US3 complete]

After all:
  T016, T017, T018 (build gates + manual validation)
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1 (Setup) + Phase 2 (Foundational)
2. Deploy Cloud Function: `firebase deploy --only functions`
3. Complete Phase 3 (US1 — chore approval notification)
4. **STOP and VALIDATE**: Test with two real devices per quickstart.md Scenario 1
5. Deliver chore approval notification before implementing US2/US3

### Incremental Delivery

1. Phase 1 + Phase 2 → Foundation + Cloud Function deployed
2. US1 (chore approval) → Test → Ship
3. US2 (bonus) → T012 only (one task) → Test → Ship
4. US3 (reward) → T013–T015 → Test → Ship

### Important Deployment Note

The Cloud Function must be deployed to Firebase before end-to-end testing is possible. Run:
```bash
cd functions && npm install && npm run build
firebase deploy --only functions
```

The VAPID key in `.env.local` must be set before running the app in dev mode.

---

## Notes

- T006 (`firebase-messaging-sw.js`) requires hardcoding the Firebase client config values — these are public keys and safe to include in a service worker file
- T015 may require no code changes if `onFulfillReward` is declared optional in T014; it exists only to confirm the build still passes
- The `fcmToast` state in App.tsx auto-clears when the `useEffect` in Game.tsx processes it — add a `setTimeout(() => setFcmToast(null), 100)` in App.tsx after setting the toast so it doesn't fire the Game.tsx effect twice
- Stale FCM token cleanup is handled automatically by the Cloud Function (T008) — no client-side cleanup needed
- Local mode: `provider.notify` will be `undefined` (not implemented); `onNotify?.()` calls are safe no-ops
- In local mode, `provider.cloudContext` is `null`, so the `useEffect` in T010 never calls `registerFcmToken` and never subscribes to foreground messages — fully isolated

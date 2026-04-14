# Quickstart: FCM Push Notifications for Kids

**Feature**: 026-fcm-kid-notifications | **Date**: 2026-04-07

---

## Scenario 1 — Kid receives a push notification when a chore is approved

**Setup**:
- Family is in cloud mode; parent is signed in on Device A (browser)
- Kid has the app open on Device B (different browser/device), has granted notification permission, FCM token stored in Firestore
- Kid has a pending chore "Make bed" in the Morning category

**Flow**:
1. Parent opens Parent Mode on Device A → Pending tab → sees "Make bed" from kid
2. Parent taps the approve (✓) button
3. App writes a `PendingNotification` doc: `{ type: 'chore-approved', targetProfileId: kidId, title: 'Chore approved! 🎉', body: 'Great job completing: Make bed!' }`
4. Cloud Function fires within seconds, reads the kid's `fcmTokens`, calls FCM
5. If Device B has the app in the **background**: OS displays a push notification with title "Chore approved! 🎉" and body "Great job completing: Make bed!"
6. If Device B has the app in the **foreground**: The notification is caught by `onMessage` handler and displayed in the existing in-app notification area (the colored banner already visible after bonuses)

**Expected result**: Kid sees the notification within ~5 seconds, whether or not the app is open.

---

## Scenario 2 — Kid is notified of a bonus

**Setup**:
- Same family, cloud mode
- Parent wants to give the kid 10 bonus points for helping with dinner

**Flow**:
1. Parent opens Parent Mode → Bonus tab → selects kid, enters "10" and reason "You helped with dinner!"
2. Parent submits the bonus
3. App writes `PendingNotification`: `{ type: 'bonus', targetProfileId: kidId, title: '10 bonus points! 🌟', body: 'You helped with dinner!' }`
4. Cloud Function sends FCM to kid's device

**Expected result**: Kid receives a push notification "+10 bonus points — You helped with dinner!" within seconds.

---

## Scenario 3 — Kid is notified when a reward is confirmed

**Setup**:
- Kid has redeemed a reward "Ice Cream" by spending coins in the store
- Parent is confirming the reward in the Rewards tab

**Flow**:
1. Parent opens Parent Mode → Rewards tab → sees "Ice Cream" is pending redemption
2. Parent marks it as fulfilled
3. App writes `PendingNotification`: `{ type: 'reward', targetProfileId: kidId, title: 'Reward unlocked! 🎁', body: 'You earned: Ice Cream!' }`
4. Cloud Function sends FCM

**Expected result**: Kid receives push notification "You earned: Ice Cream!" even if the app is closed.

---

## Scenario 4 — Kid has not granted notification permission

**Setup**: Kid is in cloud mode but denied the browser notification permission prompt

**Flow**:
1. Parent approves a chore
2. App writes `PendingNotification` to Firestore (this still happens)
3. Cloud Function reads kid's `fcmTokens` → empty array (no token registered)
4. Cloud Function skips FCM send, deletes the notification doc

**Expected result**: Parent action completes normally (chore is approved in the profile). No notification is sent. No error is shown to either parent or kid.

---

## Scenario 5 — Local (offline) mode

**Setup**: App running without Firebase family (local mode, no `cloudContext`)

**Flow**:
1. Parent approves a chore in local mode Parent Panel
2. App does NOT write a `PendingNotification` (notification outbox is only used in cloud mode)
3. No FCM token was ever requested (permission prompt skipped in local mode)

**Expected result**: Everything behaves exactly as before — no push notification infrastructure is activated.

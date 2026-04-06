# Feature Specification: Firebase Multi-Device Sync

**Feature Branch**: `012-firebase-multi-device`
**Created**: 2026-04-06
**Status**: Draft
**Input**: User description: "Multi-device sync using Firebase so parent on iPhone can manage child on iPad"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Parent Creates a Family Account (Priority: P1)

The parent opens Terragucci and signs up with their email address.
This creates a "family" in the cloud. The parent receives a short
family code (e.g., "GUCCI-7X3K") that they can share with their
children's devices to link them to the family. The parent's device
is automatically designated as the admin.

**Why this priority**: Without an account, there's no cloud to sync
to. The family account is the foundation of multi-device.

**Independent Test**: Can be tested by signing up on one device and
verifying a family code is generated.

**Acceptance Scenarios**:

1. **Given** a new user opens the app, **When** they tap "Create
   Family", **Then** they are prompted to sign in with email and a
   family is created in the cloud with a unique join code.
2. **Given** the parent has signed up, **When** they view their
   settings, **Then** they see their family code and can share it.
3. **Given** the parent is signed in, **When** they open Parent
   Mode, **Then** all admin features work as before but data syncs
   to the cloud.

---

### User Story 2 - Child Joins the Family from Their Device (Priority: P1)

A child (or the parent helping them) opens Terragucci on the child's
own device (e.g., their iPad) and enters the family code. The child
then goes through the creature creation flow (type → name) and their
profile is linked to the family. From this point, their game data
syncs to the cloud — the parent can see and manage it from their
own device.

**Why this priority**: Co-equal with US1 — the child joining is
what creates the cross-device link. Without it, multi-device doesn't
work.

**Independent Test**: Can be tested by entering a family code on a
second device and verifying the child profile appears in the
parent's admin panel.

**Acceptance Scenarios**:

1. **Given** a child opens the app on their iPad, **When** they tap
   "Join Family" and enter the code "GUCCI-7X3K", **Then** they are
   linked to the parent's family and proceed to creature creation.
2. **Given** the child has joined and created a profile, **When**
   the parent opens Parent Mode on their iPhone, **Then** the
   child's profile appears in the child selector.
3. **Given** the child has joined, **When** they complete a chore
   on their iPad, **Then** the parent sees the pending chore on
   their iPhone within a few seconds.

---

### User Story 3 - Real-Time Sync Between Devices (Priority: P1)

When either the parent or child makes a change (checking off a chore,
approving a chore, giving a bonus, buying a store item), the change
appears on the other person's device in real time — within a few
seconds, without needing to refresh or restart the app. This makes
the app feel like a shared, live experience.

**Why this priority**: Real-time sync is the core value of going
multi-device. Without it, the parent would need to manually refresh.

**Independent Test**: Can be tested by having two devices open
simultaneously and verifying that a chore check-off on one appears
on the other within 5 seconds.

**Acceptance Scenarios**:

1. **Given** the child checks off "Brush teeth" on their iPad,
   **When** the parent views pending chores on their iPhone, **Then**
   "Brush teeth" appears as pending within 5 seconds.
2. **Given** the parent approves a chore on their iPhone, **When**
   the child views their game on their iPad, **Then** the points
   and coins are updated within 5 seconds.
3. **Given** the parent gives a bonus on their iPhone, **When** the
   child views their game, **Then** the bonus notification appears
   within 5 seconds.

---

### User Story 4 - Offline Play with Sync on Reconnect (Priority: P2)

If the child's device loses internet (e.g., on a car ride), the game
continues to work locally. Chores can still be checked off, care
actions can still be performed, and the creature still responds.
When the device reconnects, all changes sync automatically — no data
is lost.

**Why this priority**: Kids won't always have internet. The game
must remain playable offline and catch up when back online.

**Independent Test**: Can be tested by going offline, making changes,
reconnecting, and verifying all changes sync.

**Acceptance Scenarios**:

1. **Given** the child is offline, **When** they check off a chore,
   **Then** the chore shows as pending locally (or approved if no
   parent mode).
2. **Given** the child was offline and made changes, **When** the
   device reconnects, **Then** all changes sync to the cloud within
   10 seconds.
3. **Given** both the parent and child made changes while the child
   was offline, **When** the child reconnects, **Then** both sets
   of changes are merged without data loss.

---

### User Story 5 - Each Child Has Their Own Device Login (Priority: P2)

Each child's device remembers which child they are — they don't need
to pick a profile every time they open the app. The child's device
is linked to their specific profile. If a sibling uses the same
device, they can switch profiles just like before (profile picker).

**Why this priority**: Convenience for the common case where each
child has their own device. Avoids the "who are you?" prompt every
launch.

**Independent Test**: Can be tested by joining as a specific child,
closing and reopening the app, and verifying the correct profile
loads automatically.

**Acceptance Scenarios**:

1. **Given** a child joined as "Emma" on their iPad, **When** they
   close and reopen the app, **Then** Emma's game loads directly
   (no profile picker).
2. **Given** a device has one child linked, **When** a sibling
   wants to play on the same device, **Then** they can switch
   profiles or link their own profile.

---

### Edge Cases

- What if the parent signs up but the child never joins? The family
  exists in the cloud with zero child profiles. Parent Mode shows
  an empty state.
- What if the family code is entered incorrectly? An error message
  says "Family not found. Check the code and try again."
- What if two devices edit the same data simultaneously? Firebase's
  real-time database handles conflict resolution — last write wins
  for simple fields, arrays merge for collections like chores.
- What if the parent loses their device? They can sign in on a new
  device with the same email and regain access to the family.
- What if a child's device is lost? The parent can remove that
  child's profile from their admin panel. The child can rejoin on
  a new device.
- What about data migration? Existing localStorage data (pre-
  Firebase) is offered for migration when the user first signs up.
  They can import their existing profiles into the cloud family.
- What if Firebase is down? The app falls back to local-only mode
  and syncs when Firebase becomes available again.
- What about cost? Firebase offers a free tier (Spark plan) that
  supports up to 100 concurrent connections and 1 GB storage — more
  than enough for a family app.

## Requirements *(mandatory)*

### Functional Requirements

**Authentication & Family Setup**

- **FR-001**: The app MUST support Firebase Authentication for
  parent sign-up/sign-in via email + password.
- **FR-002**: When a parent creates a family, the system MUST
  generate a unique, short, human-readable family join code
  (6-8 characters).
- **FR-003**: The parent MUST be able to view and share their
  family join code from the settings.
- **FR-004**: A child MUST be able to join a family by entering
  the join code on their device.
- **FR-005**: The app MUST remember which user is signed in on
  each device (persistent auth session).

**Data Sync**

- **FR-006**: All game data (profiles, chores, points, coins,
  health, streak, outfits, store purchases, notifications,
  redeemed rewards, reward presents) MUST sync to Firebase
  Firestore in real time.
- **FR-007**: Changes made on one device MUST appear on other
  devices within 5 seconds when both are online.
- **FR-008**: The app MUST continue to function fully when offline
  using local data.
- **FR-009**: When a device reconnects after being offline, all
  local changes MUST sync to the cloud automatically.
- **FR-010**: The daily chore reset MUST be triggered based on
  the cloud's server timestamp, not the device's local clock (to
  prevent kids changing the device time to re-earn points).

**Parent Admin**

- **FR-011**: Parent Mode MUST work across devices — chores added
  on the parent's phone appear on the child's tablet.
- **FR-012**: Chore approvals, rejections, and bonuses given on
  the parent's device MUST reflect on the child's device in real
  time.
- **FR-013**: Reward presents managed by the parent MUST appear
  in the store on all children's devices.

**Security & Privacy**

- **FR-014**: Firebase security rules MUST ensure only family
  members can read/write their family's data.
- **FR-015**: Children MUST NOT be able to modify parent-only
  fields (PIN, chore definitions when parent mode is active,
  reward presents, approval status).
- **FR-016**: The parent PIN MUST NOT be stored in the cloud —
  it remains per-device (the parent enters it on each device
  they use).
- **FR-017**: No child PII beyond creature name MUST be stored.
  Email is only collected from the parent (Constitution
  Principle III).

**Migration & Backward Compatibility**

- **FR-018**: Existing users with localStorage data MUST be
  offered a one-time migration to import their data into a new
  cloud family.
- **FR-019**: The app MUST remain functional in local-only mode
  if the user chooses not to sign up. All existing features
  continue to work without Firebase.

### Key Entities

- **Family**: A cloud-hosted group created by a parent. Contains
  a unique join code, the parent's auth UID, a list of child
  profiles, shared reward presents, and the parent PIN hash.
- **FamilyMember**: A device linked to a family. Can be the parent
  (admin) or a child (linked to a specific ChildProfile).
- **SyncState**: The mechanism that keeps local state and cloud
  state in sync. Handles offline queuing and conflict resolution.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A parent can create a family and a child can join
  from a separate device within 3 minutes total.
- **SC-002**: Changes sync between devices in under 5 seconds
  when both are online.
- **SC-003**: The app works fully offline — a child can complete
  chores with zero internet and sync later.
- **SC-004**: 100% of game features (chores, approvals, store,
  bonuses, streak, wardrobe) work identically in multi-device
  mode as they did in single-device mode.
- **SC-005**: Existing single-device users can migrate to multi-
  device without losing any data.
- **SC-006**: The parent can manage multiple children from their
  phone without touching any child's device.

## Assumptions

- Firebase project will be created separately (Spark/free tier).
  The app code will include Firebase SDK configuration.
- Firebase Authentication (email + password) is the auth method.
  No social login (Google, Apple) in v1 — can be added later.
- Firebase Firestore is used for data storage (not Realtime
  Database). Firestore has better offline support and structured
  queries.
- Firestore security rules will be written to enforce family-
  level access control.
- The family join code is generated server-side (via a Cloud
  Function or client-generated with collision detection).
- The parent PIN is stored locally per-device, not in the cloud.
  Each device where the parent wants admin access requires
  entering the PIN separately.
- The daily chore reset uses Firestore server timestamps to
  prevent clock manipulation.
- Offline mode uses Firestore's built-in offline persistence
  (enabled by default on web).
- The existing localStorage system becomes a fallback for users
  who don't sign up. The app detects whether to use localStorage
  or Firestore based on auth state.
- Firebase costs are expected to stay within free tier for
  typical family usage (1-8 profiles, <100 document writes/day).

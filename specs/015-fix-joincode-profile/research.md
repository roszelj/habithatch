# Research: Fix Join Code Profile Creation

## R1: Root Cause Analysis

**Finding**: When a child enters a join code in `handleJoinFamily` (`src/App.tsx:85-92`), the app:
1. Looks up the familyId from the join code via Firestore
2. Stores familyId in localStorage and React state
3. Sets `isParent = false`
4. Navigates to creature selection

But it does NOT authenticate the child. The `user` from `useAuth()` remains `null`.

The cloud mode gate on line 35 is: `isCloudMode = Boolean(user && familyId)`. Since `user` is null, `isCloudMode` is false, and the app uses `localProvider` instead of `cloudProvider`. All subsequent operations (addProfile, saveProfile) go to localStorage.

**Decision**: Use Firebase Anonymous Authentication for children who join via code.

**Rationale**:
- Firebase anonymous auth creates a lightweight, credential-free user identity
- It gives the child a `user` object (so `isCloudMode` becomes true) without requiring email/password
- It's the Firebase-recommended pattern for unauthenticated users who need to interact with cloud services
- It satisfies Firestore security rules (`request.auth != null`)
- It's kid-safe: no PII collected (no email, no password, no name)
- It's a 1-function-call fix in the join flow

**Alternatives considered**:
- **Remove `user` from `isCloudMode` check** (use `Boolean(familyId)` only) → Rejected: breaks the conceptual model where cloud mode means authenticated, and could allow unauthenticated writes if Firestore rules are tightened later
- **Require children to sign up with email/password** → Rejected: too heavy for kids, violates kid-safety principle (collects PII from minors), poor UX
- **Create a custom token system** → Rejected: over-engineered for this use case, anonymous auth does exactly this

## R2: Firebase Anonymous Auth Integration

**Finding**: Firebase JS SDK provides `signInAnonymously(auth)` which:
- Creates an anonymous user account
- Returns a `UserCredential` with a `user` object
- The `user` has a unique `uid` but no email/password
- `onAuthStateChanged` fires, updating `useAuth()` state
- The anonymous user persists across page refreshes (Firebase stores the session)

**Integration point**: Call `signInAnonymously(auth)` inside `handleJoinFamily`, before setting familyId. This ensures `user` is non-null by the time the child reaches creature creation.

**Timing concern**: `signInAnonymously` is async and `onAuthStateChanged` fires asynchronously. However, since `handleJoinFamily` already awaits `lookupJoinCode`, adding another await is consistent. The `user` state update from `onAuthStateChanged` will happen before the next render where the child interacts with the cloud provider.

Actually — there's a subtle issue. `setFamilyId(fid)` triggers a re-render. At that point, `user` might still be null if `onAuthStateChanged` hasn't fired yet. But since both state updates happen in the same event handler, React will batch them. The cloud provider selection happens on the next render, and by then `onAuthStateChanged` should have fired.

To be safe, we should await the anonymous sign-in first, then set familyId.

## R3: Persistence Across App Restarts

**Finding**: Firebase anonymous auth sessions persist in the browser by default (using IndexedDB). On next app load:
- `onAuthStateChanged` fires with the anonymous `user`
- `familyId` is in localStorage (`FAMILY_ID_KEY`)
- `isCloudMode = Boolean(user && familyId)` is true
- Cloud provider loads and listeners sync the child's profile

No additional work needed for persistence.

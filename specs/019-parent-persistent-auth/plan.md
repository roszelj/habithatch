# Implementation Plan: Parent Persistent Session

**Branch**: `019-parent-persistent-auth` | **Date**: 2026-04-07 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/019-parent-persistent-auth/spec.md`

## Summary

Firebase Auth already persists the parent's session token across page refreshes. The bug is in `App.tsx`: the routing phase is initialized synchronously to `{ step: 'auth' }` because `user` is always `null` at startup (Firebase auth is async). Additionally, `isParent` resets to `false` on refresh, breaking cloud provider mode. The fix is one file, two changes: derive `isParent` from auth type, and add a `useEffect` that routes the parent to game content when their session is restored.

## Technical Context

**Language/Version**: TypeScript 5.6
**Primary Dependencies**: React 19, Firebase JS SDK v12
**Storage**: Firebase Auth (browser-managed session persistence) + localStorage
**Testing**: `npm run build` (TypeScript gate)
**Target Platform**: Web browser
**Project Type**: React SPA
**Performance Goals**: Restored parent session lands on game content in under 3 seconds
**Constraints**: Kid anonymous sessions must NOT be auto-restored; parent-only
**Scale/Scope**: One file (`App.tsx`), two targeted changes

## Constitution Check

| Principle | Assessment | Pass/Fail |
|-----------|-----------|-----------|
| I. Fun-First Design | Removing the login friction on every refresh directly improves the parent experience and makes the app feel polished. | PASS |
| II. Ship & Iterate | One-file change, no new dependencies, testable in under a minute. | PASS |
| III. Kid-Safe Always | Anonymous (kid) sessions are explicitly NOT restored. Parents are identified by non-anonymous auth. No PII change. | PASS |

**Verdict**: All gates pass. Proceed.

## Project Structure

### Documentation (this feature)

```text
specs/019-parent-persistent-auth/
├── plan.md        ← this file
├── research.md    ← root cause + 3 decisions
├── data-model.md  ← isParent state removal
├── quickstart.md  ← manual test guide
└── tasks.md       ← Phase 2 output (/speckit-tasks)
```

### Source Code (files changed)

```text
src/
└── App.tsx   ← only file changed
```

## Phase 0: Research Findings

See [research.md](./research.md). Summary:

- **Root cause**: `phase` initializes to `{ step: 'auth' }` synchronously because `user` is `null` during Firebase auth resolution. Firebase does restore the session — the app just doesn't react to it.
- **`isParent` fix**: Replace `useState(false)` + manual `setIsParent` calls with a derived constant: `const isParent = Boolean(user && !user.isAnonymous)`. Always accurate, survives refreshes.
- **Phase fix**: Add a `useEffect` watching `authLoading`, `user`, and `familyId`. When auth finishes loading, user is non-anonymous, familyId exists, and phase is still `auth` → set phase to `profiles`.
- **Kids excluded**: Anonymous sessions are not restored (Decision 3).

## Phase 1: Design

### Data Model

See [data-model.md](./data-model.md). No new entities. `isParent` changes from `useState` to a derived value.

### Implementation Steps

#### Step 1 — Replace `isParent` state with derived value (`App.tsx`)

Remove:
```
const [isParent, setIsParent] = useState(false);
```

Replace with:
```
const isParent = Boolean(user && !user.isAnonymous);
```

Remove `setIsParent(true)` from `handleSignUp` and `handleSignIn`.
Remove `setIsParent(false)` from `handleJoinFamily`.

#### Step 2 — Add session-restore `useEffect` (`App.tsx`)

After the phase `useState` declaration, add:

```tsx
useEffect(() => {
  if (authLoading) return;
  if (user && !user.isAnonymous && familyId && phase.step === 'auth') {
    setPhase({ step: 'profiles' });
  }
}, [authLoading, user, familyId]);
```

**Why `phase.step === 'auth'` guard**: Prevents overwriting a phase the parent has legitimately navigated to (e.g., if they are on the game screen and something re-triggers this effect).

**Why `!user.isAnonymous`**: Kids (anonymous) are not auto-restored per Decision 3.

**Why `familyId`**: A non-anonymous user without a familyId would be a parent with no family yet — they should go through `familySetup`, not `profiles`.

### Contracts

No external contracts. Internal routing change only.

## Complexity Tracking

No constitution violations.

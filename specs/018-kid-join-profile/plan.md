# Implementation Plan: Kid Join Profile Selection

**Branch**: `018-kid-join-profile` | **Date**: 2026-04-07 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/018-kid-join-profile/spec.md`

## Summary

After a kid enters a valid family join code, the app currently skips the profile picker and sends them directly to creature creation. This plan routes them to the "Who's playing?" profile picker instead, with a loading gate to handle Firestore's async first snapshot. Two files require changes; no new components or data entities are needed.

## Technical Context

**Language/Version**: TypeScript 5.6
**Primary Dependencies**: React 19, Vite 5, Firebase JS SDK v12
**Storage**: Firebase Firestore (cloud mode after anonymous sign-in)
**Testing**: `npm test && npm run lint`
**Target Platform**: Web browser (mobile-first)
**Project Type**: React SPA
**Performance Goals**: Profile picker visible within 2s of join code submission
**Constraints**: Kid-safe (no PII); offline / local mode unaffected
**Scale/Scope**: Single-screen routing change, 2 files

## Constitution Check

*GATE: Must pass before implementation.*

| Principle | Assessment | Pass/Fail |
|-----------|-----------|-----------|
| I. Fun-First Design | Kid lands on a familiar, visual profile picker instead of being forced into creature creation every session. Interactions remain responsive — loading gate prevents blank flashes. | PASS |
| II. Ship & Iterate | Two-file change, no new components, fully testable end-to-end in a single cycle. | PASS |
| III. Kid-Safe Always | No change to PII handling. Anonymous sign-in preserved. Join code flow unchanged. | PASS |

**Verdict**: All gates pass. Proceed.

## Project Structure

### Documentation (this feature)

```text
specs/018-kid-join-profile/
├── plan.md          ← this file
├── research.md      ← Phase 0 decisions
├── data-model.md    ← interface change
├── quickstart.md    ← manual test guide
└── tasks.md         ← Phase 2 output (/speckit-tasks)
```

### Source Code (files changed)

```text
src/
├── hooks/
│   └── useDataProvider.ts   ← add `loaded` field to DataProvider + implementations
└── App.tsx                  ← change join routing + add loaded gate in profiles render
```

**Structure Decision**: Single-project React SPA. No new directories or files in `src/`.

## Phase 0: Research Findings

See [research.md](./research.md) for full decisions. Summary:

- **Routing change**: `handleJoinFamily` in `App.tsx` → change `step: 'select'` to `step: 'profiles'`.
- **Loading gate**: Add `loaded: boolean` to `DataProvider`. Cloud provider sets it `true` on first profiles snapshot. App.tsx shows a spinner while `!provider.loaded` during the `profiles` step.
- **Empty family**: No special-case re-route after load. ProfilePicker with only "Add Child" is acceptable UX for new families. Avoids post-render redirect complexity.

## Phase 1: Design

### Data Model

See [data-model.md](./data-model.md). One interface field added:

```
DataProvider.loaded: boolean
```

No new data entities or Firestore schema changes.

### Implementation Steps

#### Step 1 — Add `loaded` to `DataProvider` interface (`useDataProvider.ts`)

```
interface DataProvider {
  ...
  loaded: boolean;   // ← add this
}
```

- `useLocalDataProvider`: return `loaded: true` (data is synchronous).
- `useCloudDataProvider`: add `const [loaded, setLoaded] = useState(false)`. In the `onAllProfilesSnapshot` callback, call `setLoaded(true)` after `setAppData(...)`. Return `loaded` from the hook.

#### Step 2 — Change post-join routing (`App.tsx`)

In `handleJoinFamily` (currently line 94):

```diff
- setPhase({ step: 'select' }); // child goes to creature creation
+ setPhase({ step: 'profiles' }); // child picks existing profile or adds new
```

#### Step 3 — Add loading gate for profiles step (`App.tsx`)

Where `phase.step === 'profiles'` is rendered, gate on `provider.loaded`:

```tsx
{phase.step === 'profiles' && !provider.loaded && (
  <div ...>Loading...</div>
)}
{phase.step === 'profiles' && provider.loaded && (
  <ProfilePicker ... />
)}
```

The loading indicator should use existing app styles (centered, same background). No new CSS needed if a simple inline loading div is used — match the existing authLoading style at line 152 of App.tsx.

### Contracts

No external contracts (no API, no new public interface). This is an internal routing change.

## Complexity Tracking

No constitution violations. No complexity table needed.

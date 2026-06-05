# Implementation Plan: Account Deletion

**Branch**: `041-account-deletion` | **Date**: 2026-04-27 | **Spec**: [spec.md](./spec.md)  
**Input**: Feature specification from `/specs/041-account-deletion/spec.md`

## Summary

Add a self-service account deletion flow for parent accounts in both the web and React Native apps, satisfying Apple App Store guideline 5.1.1 (account deletion requirement). The deletion permanently removes the parent's Firebase Auth credentials, all Firestore family data (profiles, chores, notifications, join code), and clears local storage — implemented as a client-side cascading delete with a re-authentication prompt to satisfy Firebase's `requires-recent-login` constraint.

## Technical Context

**Language/Version**: TypeScript 5.6 + React 19 (web); TypeScript 5.9 + React Native 0.81.5, Expo ~54 (mobile)  
**Primary Dependencies**: Firebase JS SDK v12 (web); @react-native-firebase v24 (native); React Native 0.81.5  
**Storage**: Firestore (cloud) — `families/{fid}`, `families/{fid}/profiles/{pid}`, `families/{fid}/notifications/{nid}`, `joinCodes/{code}`; localStorage (web) / AsyncStorage (native)  
**Testing**: Manual smoke test (no automated tests per constitution — UI-only change)  
**Target Platform**: iOS 15+ (React Native via Expo), Web (Vite/React)  
**Project Type**: Mobile app + web app  
**Performance Goals**: Deletion completes in under 10 seconds on standard connections  
**Constraints**: Firebase `deleteUser()` requires recent authentication — must re-authenticate or catch `auth/requires-recent-login` and prompt for password; Firestore client SDK cannot recursively delete subcollections — must enumerate and delete profile and notification documents individually before deleting the family document  
**Scale/Scope**: Families have 1–5 profiles and minimal notification documents; client-side sequential delete is sufficient (no Cloud Function needed)

## Constitution Check

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Fun-First Design | ✅ Pass | Deletion UI lives in the parent settings area, fully outside the child gameplay loop. No impact on kid experience. |
| II. Ship & Iterate | ✅ Pass | Scoped to two files per platform (firebase util + ParentPanel UI). Shippable in one cycle. |
| III. Kid-Safe Always | ✅ Pass | Deletion is gated behind parent PIN + password re-entry. Gives parents control over family data — directly serves COPPA compliance. |

No violations. Proceed to implementation.

## Project Structure

### Documentation (this feature)

```text
specs/041-account-deletion/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
└── tasks.md             # Phase 2 output (/speckit.tasks command)
```

### Source Code

```text
# Web app changes
src/firebase/
├── auth.ts              # Add reauthenticate() + deleteCurrentUser()
└── families.ts          # Add deleteFamily(familyId, joinCode)

src/components/
├── ParentPanel.tsx       # Add "Delete Account" section + "Remove Profile" per-profile action
└── ParentPanel.module.css  # Styles for deletion UI

src/
└── App.tsx              # Wire onDeleteAccount prop → reset flow

# Native app changes (mirrors web)
native/src/firebase/
├── auth.ts              # Add reauthenticate() + deleteCurrentUser()
└── families.ts          # Add deleteFamily(familyId, joinCode)

native/src/components/
└── ParentPanel.tsx       # Add "Delete Account" section + "Remove Profile" per-profile action

native/
└── App.tsx              # Wire onDeleteAccount prop → reset flow
```

**Structure Decision**: Changes touch only existing files. No new files required. Web and native share the same logical structure — each platform's firebase utils and ParentPanel component get parallel additions.

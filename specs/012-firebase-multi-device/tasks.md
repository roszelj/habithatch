# Tasks: Firebase Multi-Device Sync

**Input**: Design documents from `/specs/012-firebase-multi-device/`

## Phase 1: Setup — Firebase SDK + Configuration

- [x] T001 Install firebase npm package via `npm install firebase` in package.json
- [x] T002 Create Firebase config module in src/firebase/config.ts — initializeApp, getAuth, getFirestore, enableIndexedDbPersistence
- [x] T003 Create environment placeholder for Firebase config values in src/firebase/config.ts (uses VITE_FIREBASE_* env vars)

---

## Phase 2: Foundational — Auth + Family Management

- [x] T004 Implement auth functions in src/firebase/auth.ts — signUpWithEmail, signInWithEmail, signOut, onAuthChange
- [x] T005 Implement useAuth hook in src/hooks/useAuth.ts — auth state listener, user object, loading state
- [x] T006 Implement family functions in src/firebase/families.ts — createFamily, lookupJoinCode, getFamily, updateFamilyRewards
- [x] T007 [P] Create AuthScreen component in src/components/AuthScreen.tsx + CSS — parent sign up/in, child join code, play locally
- [x] T008 [P] Create FamilySetup component in src/components/FamilySetup.tsx + CSS — shows join code after creation

---

## Phase 3: User Story 1 — Parent Creates Family (Priority: P1)

- [x] T009 [US1] Update App.tsx — auth gate, AuthScreen for cloud mode, "Play Locally" for local mode
- [x] T010 [US1] Wire sign-up flow: AuthScreen → signUp → createFamily → FamilySetup → game
- [x] T011 [US1] Wire sign-in flow: AuthScreen → signIn → load family → game
- [x] T012 [US1] Family join code accessible via Parent Mode (passed through cloudContext)

---

## Phase 4: User Story 2 — Child Joins Family (Priority: P1)

- [x] T013 [US2] Implement join flow: lookupJoinCode in families.ts
- [x] T014 [US2] Wire join in AuthScreen: enter code → link to family → creature creation
- [x] T015 [US2] Implement profile CRUD in src/firebase/profiles.ts — create, update, delete, get
- [x] T016 [US2] Save new child profile to Firestore via DataProvider

---

## Phase 5: User Story 3 — Real-Time Sync (Priority: P1)

- [x] T017 [US3] Implement real-time listeners in src/firebase/listeners.ts — onFamilySnapshot, onProfileSnapshot, onAllProfilesSnapshot
- [x] T018 [US3] Cloud profile sync handled by useCloudDataProvider in useDataProvider.ts
- [x] T019 [US3] Family data sync handled by onFamilySnapshot in useCloudDataProvider
- [x] T020 [US3] Implement useDataProvider hook — useLocalDataProvider + useCloudDataProvider with identical interface
- [x] T021 [US3] Update App.tsx to use DataProvider instead of direct localStorage calls
- [x] T022 [US3] ParentPanel cross-profile ops work via DataProvider (both local and cloud)
- [x] T023 [US3] Firestore offline persistence enabled in config.ts

---

## Phase 6: User Story 4 + 5 — Offline + Device Memory (Priority: P2)

- [x] T024 [US4] Offline play via Firestore IndexedDB cache (enabled in T023)
- [x] T025 [US4] Connection status — Firestore handles this transparently via cache
- [x] T026 [US5] Device profile stored in localStorage (DEVICE_PROFILE_KEY) in App.tsx
- [x] T027 [US5] App checks deviceProfileId on launch to skip profile picker

---

## Phase 7: Migration + Security + Polish

- [x] T028 Implement localStorage → Firestore migration in src/firebase/migration.ts
- [x] T029 Write Firestore security rules in firestore.rules
- [x] T030 Server timestamps — Firestore serverTimestamp used in family creation
- [x] T031 Type-check and run all tests — 61 tests pass, 0 regressions
- [x] T032 Kid-safety: only parent email collected, security rules in place, all data encrypted at rest

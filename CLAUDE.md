# terragucci Development Guidelines

Auto-generated from all feature plans. Last updated: 2026-04-13

## Active Technologies
- TypeScript 5.x (existing) + React 19, Vite 5, Firebase JS SDK v10 (012-firebase-multi-device)
- Firebase Firestore (cloud) + localStorage (fallback) (012-firebase-multi-device)
- TypeScript 5.6 + React 19, Vite 5, Firebase JS SDK v12 (013-fix-points-persistence)
- Firebase Firestore (cloud mode) + localStorage (local/guest mode) (013-fix-points-persistence)
- TypeScript 5.6 + React 19 + Vite 5, Firebase JS SDK v12 (014-cloud-parent-persistence)
- TypeScript 5.6 + React 19 + Vite 5, CSS Modules (016-fix-viewport-scroll)
- TypeScript 5.6 + React 19 + Vite 5, CSS Modules, Firebase JS SDK v12 (017-creature-habitats)
- N/A (layout only) (017-creature-habitats)
- Firebase Firestore (cloud mode after anonymous sign-in) (018-kid-join-profile)
- TypeScript 5.6 + React 19, Firebase JS SDK v12 (019-parent-persistent-auth)
- Firebase Auth (browser-managed session persistence) + localStorage (019-parent-persistent-auth)
- TypeScript 5.6 + React 19, Vite 5, CSS Modules (020-new-creature-roster)
- N/A (static asset change + data migration) (020-new-creature-roster)
- N/A (static asset + data model change) (021-habitat-images)
- N/A (ephemeral UI state only) (022-creature-speech-bubble)
- N/A (no new storage — chores already persist via existing save logic) (023-chore-all-kids)
- N/A — `creatureType` and `creatureName` already on `ChildProfile`; no new storage (024-change-creature)
- TypeScript 5.6 + React 19, CSS Modules (025-parent-join-code)
- N/A — join code already exists in `provider.cloudContext.joinCode` (025-parent-join-code)
- TypeScript 5.6 (app) + TypeScript 5.x (Cloud Functions) + React 19, Vite 5, Firebase JS SDK v12 (`firebase/messaging`), Firebase Cloud Functions v2 (`firebase-functions/v2`), Firebase Admin SDK v13 (`firebase-admin`) (026-fcm-kid-notifications)
- Firestore — `families/{fid}/profiles/{pid}` extended with `fcmTokens: string[]`; new `families/{fid}/notifications/{nid}` outbox collection (transient) (026-fcm-kid-notifications)
- TypeScript 5.6 (app) + TypeScript 5.x (Cloud Functions) + Firebase JS SDK v12 (`firebase/messaging`), Firebase Admin SDK v13, Firebase Cloud Functions v2 (029-suppress-parent-notifications)
- Firestore — `families/{fid}/notifications/{nid}` document extended with optional `senderToken: string` (029-suppress-parent-notifications)
- TypeScript 5.6 + React 19, Vite 5, CSS Modules + Firebase JS SDK v12 (Firestore for cloud persistence) (030-kid-real-name)
- Firestore `families/{fid}/profiles/{pid}` (cloud) + localStorage (local mode) (030-kid-real-name)
- TypeScript 5.6 + React 19, Vite 5, CSS Modules + None new — uses existing CreatureSprite, habitat data, speech bubble patterns (031-pet-fullscreen-view)
- N/A — purely presentational, no persistence needed (031-pet-fullscreen-view)
- TypeScript 5.6 + React 19, Vite 5, CSS Modules + None new — builds on existing PetFullscreen component (feature 031) (032-spin-wheel-minigame)
- N/A for wheel config (static). Coin balance changes go through existing profile save mechanism (onSaveProfile / onUpdateAppData) (032-spin-wheel-minigame)
- TypeScript 5.6 + React 19, Vite 5, CSS Modules + None new — builds on existing PetFullscreen component (features 031/032) (033-tictactoe-minigame)
- N/A for game state (ephemeral). Coin balance changes go through existing profile save mechanism (onAwardCoins callback) (033-tictactoe-minigame)
- N/A for food config (static). Coin balance changes go through existing profile save mechanism (onSaveProfile) (034-food-feeding-menu)
- Firestore `families/{fid}/profiles/{pid}` (cloud) + localStorage (local mode) — existing ChildProfile document gains `weekdayChores` and `weekendChores` fields (035-weekday-weekend-chores)
- TypeScript 5.6 + React 19, Vite 5, CSS Modules + None new — builds on existing PetFullscreen component (features 031/032/033) (036-trivia-minigame)
- N/A for trivia config (static). Coin balance changes go through existing profile save mechanism (onAwardCoins callback) (036-trivia-minigame)
- TypeScript 5.6 + React 19, Vite 5, CSS Modules + None new — builds on existing `useDailyReset` hook and `ChorePanel` componen (037-manual-chore-refresh)
- N/A — no new storage. Uses existing `lastPlayedDate` and chore save mechanism (037-manual-chore-refresh)

- TypeScript 5.x + React 19, Vite 6 (001-virtual-pet-creature)

## Project Structure

```text
src/
tests/
```

## Commands

npm test && npm run lint

## Code Style

TypeScript 5.x: Follow standard conventions

## Recent Changes
- 037-manual-chore-refresh: Added TypeScript 5.6 + React 19, Vite 5, CSS Modules + None new — builds on existing `useDailyReset` hook and `ChorePanel` componen
- 036-trivia-minigame: Added TypeScript 5.6 + React 19, Vite 5, CSS Modules + None new — builds on existing PetFullscreen component (features 031/032/033)
- 035-weekday-weekend-chores: Added TypeScript 5.6 + React 19 + Vite 5, CSS Modules


<!-- MANUAL ADDITIONS START -->
<!-- MANUAL ADDITIONS END -->

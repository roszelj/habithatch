# Research: Logout Button & Reset Button Relocation (042-logout-reset-nav)

## Finding 1: Reset Button Location(s)

**Decision**: There are two distinct Reset surfaces today; the spec targets the parent tab bar one.

**Current state**:
- `native/src/components/ParentPanel.tsx` lines 557-562 — `🗑️ Reset` rendered as a tab bar button at the bottom of the Parent Panel. Shown only when the `onReset` prop is provided (i.e., parent PIN is set).
- `native/App.tsx` lines 430-434 — small "Reset Game" text button shown at the bottom of the game screen when **no** parent PIN is configured. This is outside the tab bar entirely.

**Rationale**: The ParentPanel tab bar Reset is the one the user wants moved. The App.tsx fallback Reset (no-PIN path) is unaffected by this feature.

---

## Finding 2: Danger Zone Already Exists

**Decision**: No new section needs to be created — the Danger Zone already exists in ParentPanel.

**Current state**: `native/src/components/ParentPanel.tsx` lines 297-326. It has:
- Red-bordered container (`rgba(231,76,60,0.3)` border)
- Red uppercase header "Danger Zone"
- Conditional buttons: "Remove {child}'s Profile" and "Delete Parent Account"

**Rationale**: The Reset button just needs to be added to this existing section as a new `TouchableOpacity` with `dangerBtn` style.

---

## Finding 3: Auth Sign-Out Implementation

**Decision**: Use the existing `signOut()` from `native/src/firebase/auth.ts`.

**Current state**:
```ts
// native/src/firebase/auth.ts line 26-28
export async function signOut(): Promise<void> {
  await auth().signOut();
}
```
Called as `doSignOut` in App.tsx. This function is already battle-tested.

**Rationale**: No new auth plumbing needed. The Logout handler in App.tsx will mirror the existing reset flow minus the game-data wipe.

---

## Finding 4: AsyncStorage Keys to Clear on Logout

**Decision**: Clear session/identity keys; do NOT wipe `terragucci_v2` (game data) on logout — that lives in Firestore for cloud users and should survive re-login.

| Key | Clear on Logout? | Reason |
|-----|-----------------|--------|
| `terragucci_familyId` (FAMILY_ID_KEY) | ✅ Yes | Links device to family; must be cleared |
| `terragucci_deviceProfile` (DEVICE_PROFILE_KEY) | ✅ Yes | Active profile pointer; must be cleared |
| `terragucci_installed` | ✅ Yes | Triggers fresh-install detection on next launch |
| `fcm_permission_denied` | ✅ Yes | Per-session push preference; reset on logout |
| `terragucci_v2` (APP_DATA_KEY) | ✅ Yes | Per spec: "all locally stored app data"; cloud data safe in Firestore |
| `terragucci_save` (SAVE_KEY) | ✅ Yes | Legacy key; clear as part of full wipe |
| `terragucci_pin` (PIN_SAVE_KEY) | ✅ Yes | Legacy key; clear as part of full wipe |

**Rationale**: The spec says "destroy all auth and local storage" and clarified that cloud Firestore data is preserved. On next login, cloud data re-syncs from Firestore.

---

## Finding 5: Navigation to Auth Screen After Logout

**Decision**: Set `phase` state to `'auth'` in App.tsx (same as reset flow).

**Current state**: `App.tsx` manages a `phase` state (`'loading' | 'auth' | 'game'`). After reset, `setPhase('auth')` is called. The same mechanism works for logout.

**Rationale**: Reusing existing phase transition is the minimal correct implementation.

---

## Finding 6: Logout Prop Threading

**Decision**: Add `onLogout` prop to ParentPanel (same pattern as existing `onReset` prop).

**Current state**: ParentPanel already receives `onReset` as a prop and calls it when the Reset tab is tapped. The same prop-threading pattern applies to Logout.

**Rationale**: Keeps App.tsx as the single owner of auth/data logic; ParentPanel remains a pure UI component.

---

## Alternatives Considered

- **Put Logout in the child (kid) tab bar**: Rejected — clarified parent-only scope.
- **Use a separate Logout screen instead of tab button**: Rejected — tab button with confirmation is the minimal pattern; no additional screen needed.
- **Wipe only session keys (not `terragucci_v2`) on logout**: Rejected — spec says "all locally stored app data". Cloud users can re-sync from Firestore after re-login.

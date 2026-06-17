# Data Model: Logout Button & Reset Button Relocation (042-logout-reset-nav)

## No New Persistent Entities

This feature introduces no new data entities. All changes are:
1. UI rearrangement (button locations)
2. A new in-memory event handler (`handleLogout`) that clears existing storage

---

## Storage Operations

### On Logout (new `handleLogout` in App.tsx)

**AsyncStorage keys cleared** (full wipe):

| Key Constant | String Value | Purpose |
|---|---|---|
| `FAMILY_ID_KEY` | `terragucci_familyId` | Cloud family linkage |
| `DEVICE_PROFILE_KEY` | `terragucci_deviceProfile` | Last-active profile pointer |
| `APP_DATA_KEY` | `terragucci_v2` | All local game data |
| — | `terragucci_installed` | Fresh-install marker |
| — | `fcm_permission_denied` | FCM permission preference |
| — | `terragucci_save` | Legacy v1 save (migration artifact) |
| — | `terragucci_pin` | Legacy PIN storage (migration artifact) |

**Auth operation**: `auth().signOut()` (via existing `signOut()` in `native/src/firebase/auth.ts`)

**In-memory reset**: `provider.clearAll()` (existing call pattern from `handleReset`)

---

## State Transitions

```
Authenticated (phase = 'game')
  │
  ├─ User taps Logout → confirmation dialog shown
  │     │
  │     ├─ Cancel → stays on current screen (no state change)
  │     │
  │     └─ Confirm →
  │           1. AsyncStorage.multiRemove([all keys above])
  │           2. provider.clearAll()
  │           3. auth().signOut()
  │           4. setPhase('auth')
  │
  └─ phase = 'auth' (sign-in / sign-up screen displayed)
```

---

## Props Interface Change

### ParentPanel (existing component)

One new prop added:

```ts
// Addition to ParentPanelProps interface
onLogout?: () => void;  // Called when user confirms logout from tab bar
```

No other interface changes. `onReset` prop is retained (used by Reset button in Danger Zone).

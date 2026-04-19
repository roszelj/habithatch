# Research: Parent Pause Mode (038)

## Decision 1: Data field for pause state

**Decision**: Add `isPaused?: boolean` to `ChildProfile` in `src/models/types.ts`.

**Rationale**: A single boolean flag is the minimal change that represents the entire pause state. Health is already stored as a concrete number in `ChildProfile.health`; since decay is skipped while paused, health stays at the stored value automatically — no separate "health at pause time" field is needed. The `?:` optional type means existing serialized profiles load without migration (absent = `false`).

**Alternatives considered**:
- `pausedAt: string | null` (ISO timestamp) — unnecessary complexity; the spec requires no time-based auto-expiry, so the timestamp buys nothing.
- Separate `PauseRecord` entity — overkill for a single boolean; adds indirection with no benefit at this scale.

---

## Decision 2: Preventing health decay while paused

**Decision**: Guard the `useGameLoop` callback in `Game.tsx` with the `isPaused` state variable.

**Current code** (`Game.tsx` lines 191–193):
```typescript
useGameLoop((delta) => {
  dispatch({ type: 'decay', delta });
});
```

**With pause guard:**
```typescript
const isPausedRef = useRef(isPaused);
isPausedRef.current = isPaused;

useGameLoop((delta) => {
  if (!isPausedRef.current) dispatch({ type: 'decay', delta });
});
```

**Rationale**: Using a ref instead of capturing `isPaused` directly avoids stale closure issues inside `useGameLoop` (which registers a single `requestAnimationFrame` loop on mount). The ref always holds the latest value. No changes needed to `useGameLoop`, `useCreature`, or `HEALTH_DECAY_RATE`.

**Alternatives considered**:
- Adding an `isPaused` param to `useGameLoop` — would require rewriting the loop hook itself and breaking its simple contract.
- Adding a flag check inside `useCreature`'s `'decay'` reducer — would require threading pause state into the creature hook, leaking game-level logic into a lower-level hook.

---

## Decision 3: Protecting streak across day boundaries while paused

**Decision**: Modify the `onReset` callback passed to `useDailyReset` in `Game.tsx` to always update `lastPlayedDate` but skip streak/chore reset when paused.

**How streak breaking works** (`useSaveData.ts` — `evaluateStreak`):
- `lastPlayedDate === today` → no-op (most common case)
- `lastPlayedDate` is yesterday and `todayEarned === false` → streak resets to 0
- Multi-day gap → streak resets to 0

**With pause guard in `onReset`:**
```typescript
onReset: (newWeekday, newWeekend, newStreak, newDate) => {
  setLastPlayedDate(newDate); // always advance the date pointer
  if (isPausedRef.current) return; // skip streak/chore reset when paused
  setChores(isWeekend() ? newWeekend : newWeekday);
  setStreak(newStreak);
},
```

**Why this works**: Every time `checkAndReset` fires (on visibility change or 60 s interval) while paused, `lastPlayedDate` is updated to the current day. This means on the *next* fire, `lastPlayedDate === today` and `evaluateStreak` returns early without breaking the streak. The streak is preserved without disabling the reset mechanism.

**Resume behavior**: On resume, `lastPlayedDate` is already today (kept current during pause), so the first day back is treated as "today" — no streak penalty. Normal streak rules apply from that day forward.

**Alternatives considered**:
- Disabling `useDailyReset` entirely (pass a no-op) while paused — would require re-mounting the hook on resume (not straightforward with React hooks).
- Storing and restoring streak on resume — fragile; the simpler approach above achieves the same result without extra state.

---

## Decision 4: Pause toggle UI placement

**Decision**: Add a pause toggle button per child inside the existing **Manage** tab of `ParentPanel`, near the child name / points editor.

**Rationale**: The Manage tab is already the home for per-child configuration (name, chore points). A pause toggle fits naturally there. Adding a new tab would increase cognitive overhead with no benefit given the feature's simplicity.

**UI**: A clearly labelled toggle button — "Pause Pet" / "Resume Pet" — with a brief explanatory label ("Pet and streak are protected while paused."). The pause state should also appear in the **Dashboard** tab summary per child.

**Alternatives considered**:
- New "Pause" tab — unnecessary navigation step for one toggle.
- Inline on the child selector list — too small a target, easy to hit accidentally.

---

## Decision 5: Pause indicator on child pet screen

**Decision**: Show a small banner or badge on the pet screen (above or below the creature) when `isPaused === true`, communicating that the pet is resting. No gameplay interactions are blocked.

**Rationale**: Constitution Principle I (Fun-First Design) requires creature state changes to be communicated through clear, playful visuals. A short "💤 Resting — your pet is safe!" banner achieves this without complex animation work.

**Alternatives considered**:
- Greying out or overlaying the creature — risks confusing children into thinking the app is broken.
- No indicator — violates the spec (FR-008) and leaves children confused about the static health bar.

---

## Decision 6: Firestore / cloud propagation

**Decision**: No special handling needed beyond the existing `saveProfile` call.

**Rationale**: The `isPaused` flag is stored on `ChildProfile`, which is already written to Firestore via `updateCloudProfile(..., profile, { merge: true })` on every `saveProfile` call. When the parent toggles pause, `onUpdateAppData` is called (same pattern as name/chore-point edits in the current `ParentPanel`), which triggers `updateCloudProfile` for the changed profile. All devices listening via `onAllProfilesSnapshot` receive the updated `isPaused` flag and will stop/start decay accordingly.

---

## Decision 7: Auto-save key inclusion

**Decision**: Add `isPaused` to the `prevSaveKey` JSON in `Game.tsx` auto-save effect.

**Rationale**: If a parent pauses/resumes a child from the parent panel, the change flows through `onUpdateAppData` and is saved there. However, `isPaused` could theoretically be toggled for the *active* child profile via `onSaveProfile`, so including it in the save key ensures it's persisted if the pattern ever changes. Low cost, defensive.

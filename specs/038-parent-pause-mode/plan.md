# Implementation Plan: Parent Pause Mode

**Branch**: `038-parent-pause-mode` | **Date**: 2026-04-19 | **Spec**: [spec.md](./spec.md)  
**Input**: Feature specification from `/specs/038-parent-pause-mode/spec.md`

## Summary

Parents need a way to pause a child's pet so health doesn't decay and the streak doesn't break during periods when the child can't use the app. The implementation adds a single `isPaused?: boolean` field to `ChildProfile`, guards the game loop's decay dispatch behind that flag, suppresses the daily streak reset while paused (while keeping `lastPlayedDate` current), and exposes a toggle in the parent panel.

## Technical Context

**Language/Version**: TypeScript 5.6  
**Primary Dependencies**: React 19, Vite 5, Firebase JS SDK v12  
**Storage**: Firestore (cloud mode) + localStorage (local/guest mode) — `ChildProfile` document extended with `isPaused?: boolean`  
**Testing**: Manual playtesting (per project convention — no automated test framework configured)  
**Target Platform**: iOS PWA + Android/desktop browser  
**Project Type**: Mobile-first web application (PWA)  
**Performance Goals**: Pause/resume state change must be visible to child in ≤ 1 render cycle; no new async paths introduced  
**Constraints**: Offline-capable (localStorage fallback), kid-safe (no PII), one new optional field — no breaking schema changes  
**Scale/Scope**: Per-child flag; affects one game loop, one daily-reset callback, one parent UI section, one child UI element

## Constitution Check

*GATE: Must pass before implementation begins.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Fun-First Design | ✅ Pass | Pause indicator uses a playful "💤 Resting" banner. Pause/resume is instant (no loading state). Positive interactions (feeding, chores) remain unblocked. |
| II. Ship & Iterate | ✅ Pass | Smallest possible change: one optional field, three guarded code paths, one toggle button. No new hooks, no new routes. |
| III. Kid-Safe Always | ✅ Pass | No PII collected. `isPaused` is a boolean on an already-existing private profile document. No new third-party dependencies. |

**Gate result**: All three principles satisfied. Proceed to implementation.

## Project Structure

### Documentation (this feature)

```text
specs/038-parent-pause-mode/
├── plan.md              # This file
├── spec.md              # Feature specification
├── research.md          # Phase 0 output — all decisions resolved
├── data-model.md        # Phase 1 output — ChildProfile change
├── checklists/
│   └── requirements.md  # Spec quality checklist (all pass)
└── tasks.md             # Phase 2 output (created by /speckit.tasks)
```

### Source Code (affected files)

```text
src/
├── models/
│   └── types.ts                    # Add isPaused?: boolean to ChildProfile
├── components/
│   ├── Game.tsx                    # Pause guard on decay + daily reset
│   └── ParentPanel.tsx             # Pause toggle button in Manage tab
└── (no new files needed)
```

## Complexity Tracking

No constitution violations. No complexity justification required.

---

## Implementation Details (for /speckit.tasks)

### Change 1 — `src/models/types.ts`

Add one optional field to `ChildProfile`:

```typescript
isPaused?: boolean;
```

Location: after `fcmTokens?: string[];` (last field in the interface).

---

### Change 2 — `src/components/Game.tsx`

**2a. Add `isPaused` state** (after existing `useState` declarations):
```typescript
const [isPaused, setIsPaused] = useState(profile.isPaused ?? false);
```

**2b. Add `isPausedRef`** (after `onSaveProfileRef`):
```typescript
const isPausedRef = useRef(isPaused);
isPausedRef.current = isPaused;
```

**2c. Add `isPaused` to `buildProfile()`** return object and dependency array:
```typescript
// In return object:
isPaused,
// In dependency array:
// ..., isPaused
```

**2d. Add `isPaused` to auto-save key** (`prevSaveKey` JSON):
```typescript
const key = JSON.stringify({ coins, chores, ..., creatureName, isPaused });
```

**2e. Guard `useGameLoop` callback**:
```typescript
useGameLoop((delta) => {
  if (!isPausedRef.current) dispatch({ type: 'decay', delta });
});
```

**2f. Guard `useDailyReset.onReset` callback**:
```typescript
onReset: (newWeekday, newWeekend, newStreak, newDate) => {
  setLastPlayedDate(newDate); // always advance date pointer while paused
  if (isPausedRef.current) return; // skip streak/chore reset when paused
  setChores(isWeekend() ? newWeekend : newWeekday);
  setStreak(newStreak);
},
```

**2g. Add `onTogglePause` handler** (passed down to `ParentPanel`):
```typescript
const handleTogglePause = useCallback((profileId: string, paused: boolean) => {
  if (profileId === profile.id) {
    setIsPaused(paused);
  } else {
    const target = appData.profiles.find(p => p.id === profileId);
    if (!target) return;
    onUpdateAppData({
      ...appData, parentPin,
      profiles: appData.profiles.map(p =>
        p.id === profileId ? { ...target, isPaused: paused, lastPlayedDate: paused ? target.lastPlayedDate : getToday() } : p
      ),
    });
  }
}, [profile.id, appData, parentPin, onUpdateAppData]);
```

Note: on resume (`paused = false`) for *other* profiles, `lastPlayedDate` is set to today so no streak penalty. For the active child profile, `lastPlayedDate` will be updated naturally by the daily-reset logic since `setLastPlayedDate` now always fires.

**2h. Add pause indicator banner** in the pet view JSX (inside the `return` for the main pet screen, above the creature stage or below the title):
```tsx
{isPaused && (
  <div className={styles.pauseBanner}>💤 Resting — your pet is safe!</div>
)}
```

**2i. Pass `onTogglePause` to `ParentPanel`**:
```tsx
<ParentPanel
  ...
  onTogglePause={handleTogglePause}
/>
```

---

### Change 3 — `src/components/ParentPanel.tsx`

**3a. Add prop to interface**:
```typescript
onTogglePause?: (profileId: string, paused: boolean) => void;
```

**3b. Destructure in component signature**.

**3c. Add pause toggle in the Manage tab**, in the per-child section near the child name editor:
```tsx
{onTogglePause && (
  <div className={styles.pauseRow}>
    <span className={styles.pauseLabel}>
      {selectedProfile.isPaused ? '💤 Pet is paused' : '▶️ Pet is active'}
    </span>
    <button
      className={styles.pauseBtn}
      onClick={() => onTogglePause(selectedProfile.id, !selectedProfile.isPaused)}
    >
      {selectedProfile.isPaused ? 'Resume Pet' : 'Pause Pet'}
    </button>
    <p className={styles.pauseHint}>
      {selectedProfile.isPaused
        ? 'Health and streak are frozen. Tap Resume when ready.'
        : 'Pause to protect health and streak while your child is away.'}
    </p>
  </div>
)}
```

**3d. Show pause badge in Dashboard tab** per-child summary (alongside health and streak):
```tsx
{profile.isPaused && <span className={styles.pausedBadge}>💤 Paused</span>}
```

---

### Change 4 — CSS (Game.module.css and ParentPanel.module.css)

Add minimal styles for:
- `.pauseBanner` — centered banner, soft color (e.g., light blue background), medium font
- `.pauseRow` — flex row with gap
- `.pauseBtn` — consistent with existing button styles
- `.pauseHint` — small muted helper text
- `.pausedBadge` — inline badge matching existing badge patterns

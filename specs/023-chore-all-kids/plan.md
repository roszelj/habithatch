# Implementation Plan: Chore for All Kids

**Branch**: `023-chore-all-kids` | **Date**: 2026-04-07 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/023-chore-all-kids/spec.md`

## Summary

When a parent adds a chore in the Manage tab of Parent Mode, a "For all kids" checkbox lets them broadcast the chore to every child profile in one submission. The change is entirely within `ParentPanel.tsx`: loop over `profiles` and call the existing `onAddChore` prop once per profile. A brief confirmation message shows how many children received the chore. No new components, no new props, no data model changes.

## Technical Context

**Language/Version**: TypeScript 5.6
**Primary Dependencies**: React 19, Vite 5, CSS Modules
**Storage**: N/A (no new storage — chores already persist via existing save logic)
**Testing**: `npm run build` (TypeScript gate)
**Target Platform**: Web browser (mobile-first)
**Project Type**: React SPA
**Performance Goals**: Chore broadcast completes synchronously — no perceptible delay
**Constraints**: No new props, no new components; change is self-contained in ParentPanel
**Scale/Scope**: 2 files changed (ParentPanel.tsx, ParentPanel.module.css)

## Constitution Check

| Principle | Assessment | Pass/Fail |
|-----------|-----------|-----------|
| I. Fun-First Design | Reduces friction for parents managing multi-child households — directly improves the setup experience that enables kids to use the chore system. | PASS |
| II. Ship & Iterate | Minimal scope: one checkbox, one loop, one confirmation message. No architectural change. | PASS |
| III. Kid-Safe Always | Parent Mode only feature. No PII, no network calls, no content displayed to children. | PASS |

**Verdict**: All gates pass. Proceed.

## Project Structure

### Documentation (this feature)

```text
specs/023-chore-all-kids/
├── plan.md          ← this file
├── research.md      ← Phase 0 output
├── data-model.md    ← Phase 1 output
├── quickstart.md    ← Phase 1 output
└── tasks.md         ← Phase 2 output (/speckit-tasks)
```

### Source Code (files changed)

```text
src/
└── components/
    ├── ParentPanel.tsx        ← Add forAllKids state + broadcast loop + confirmation
    └── ParentPanel.module.css ← Add .allKidsRow and .confirmMessage styles
```

## Phase 0: Research

### Decision 1 — Broadcast via existing prop vs. new prop

**Decision**: Loop inside `ParentPanel`, calling the existing `onAddChore(profileId, category, name)` prop once per profile. No new prop needed.

**Rationale**: The existing `onAddChore` already handles cross-profile adds correctly. Calling it N times achieves the broadcast with zero changes to `Game.tsx` or `ParentPanel`'s interface.

**Alternatives considered**: Adding an `onAddChoreAllKids(category, name)` prop — rejected because it requires changing Game.tsx, the ParentPanel interface, and prop threading, all for logic achievable with a simple loop.

### Decision 2 — State shape for the checkbox

**Decision**: Single `forAllKids` boolean state (not per-category). One checkbox applies to all three category forms simultaneously.

**Rationale**: Parents setting a chore for all kids want the broadcast to apply to whatever category they're adding to — they don't need different toggles per category. A single toggle is simpler and less cluttered on mobile.

**Alternatives considered**: `Record<TimeActionType, boolean>` per-category toggles — rejected (unnecessary complexity).

### Decision 3 — Confirmation message

**Decision**: Brief inline confirmation "Added to N kids!" displayed for 2 seconds, using the same `state + setTimeout` pattern as `bonusMessage` in the bonus tab.

**Rationale**: Consistent with existing UI pattern in the same component. No new UI pattern needed.

**Alternatives considered**: Toast notification — unnecessary, the inline pattern is already established.

### Decision 4 — Checkbox placement

**Decision**: Single "For all kids" checkbox row placed inside the manage tab section, above the per-category chore forms. Hidden when there is only 1 profile (still works, just not needed).

**Rationale**: Mobile-first: one compact row signals its scope (all categories). Hiding it for single-child families avoids confusion.

## Phase 1: Design

### Data Model

See [data-model.md](./data-model.md).

### Implementation Steps

#### Step 1 — Add `forAllKids` and `confirmMessage` state to `ParentPanel`

Inside the `ParentPanel` component, alongside existing state:

```ts
const [forAllKids, setForAllKids] = useState(false);
const [confirmMessage, setConfirmMessage] = useState('');
```

#### Step 2 — Update `handleAdd` to broadcast when `forAllKids` is true

Replace the current single-profile `handleAdd`:

```ts
function handleAdd(category: TimeActionType) {
  const val = newChoreInputs[category] || '';
  if (!val.trim()) return;
  if (forAllKids) {
    profiles.forEach(p => onAddChore(p.id, category, val));
    setConfirmMessage(`Added to ${profiles.length} kid${profiles.length !== 1 ? 's' : ''}!`);
    setTimeout(() => setConfirmMessage(''), 2000);
  } else {
    onAddChore(selectedChild, category, val);
  }
  setNewChoreInputs(prev => ({ ...prev, [category]: '' }));
}
```

#### Step 3 — Add the "For all kids" checkbox and confirmation to the manage tab JSX

Inside `{tab === 'manage' && selectedProfile && (` section, after the section title div and before the `TIME_ACTIONS.map(...)` loop:

```tsx
{profiles.length > 1 && (
  <label className={styles.allKidsRow}>
    <input
      type="checkbox"
      checked={forAllKids}
      onChange={e => setForAllKids(e.target.checked)}
    />
    Add for all kids
  </label>
)}
{confirmMessage && (
  <div className={styles.confirmMessage}>{confirmMessage}</div>
)}
```

#### Step 4 — Add styles to `ParentPanel.module.css`

```css
.allKidsRow {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  padding: 4px 0;
}

.confirmMessage {
  color: #2ecc71;
  font-size: 0.85rem;
  font-weight: 600;
  padding: 4px 0;
}
```

### Contracts

No external contracts. Parent Mode UI change only.

## Complexity Tracking

No constitution violations. No complexity table needed.

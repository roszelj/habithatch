# Quickstart: Manual Chore Refresh

## Files to Modify (4 total)

| File | Change |
|------|--------|
| `src/hooks/useDailyReset.ts` | Return `triggerReset` function from hook |
| `src/components/Game.tsx` | Capture `triggerReset`, compute `isStale`, pass both to ChorePanel |
| `src/components/ChorePanel.tsx` | Accept `isStale` + `onRefresh` props, render refresh button |
| `src/components/ChorePanel.module.css` | Add styles for refresh banner/button |

## Key Patterns

### 1. Exposing `checkAndReset` from `useDailyReset`

```typescript
// useDailyReset.ts — return the function
export function useDailyReset(callbacks): { triggerReset: () => void } {
  // ... existing logic ...
  return { triggerReset: checkAndReset };
}
```

### 2. Computing staleness in Game.tsx

```typescript
// Game.tsx
const today = new Date().toISOString().slice(0, 10);
const isStale = lastPlayedDate !== today;
```

### 3. Refresh button in ChorePanel

```tsx
// ChorePanel.tsx — at top of panel, before chore sections
{isStale && (
  <button className={styles.refreshBtn} onClick={onRefresh}>
    🔄 New day! Tap to refresh chores
  </button>
)}
```

## Integration Test Scenario

1. Open app, complete some chores
2. Change device clock to next day (or wait past midnight)
3. Navigate to chores view
4. Verify refresh banner appears at top
5. Tap refresh button
6. Verify: chores reset to unchecked, correct day-type loaded, banner disappears
7. Verify: streak evaluated correctly, last-played date updated

# Quickstart: Kid Help Guide (039)

## What This Feature Does

Adds a Help button to the kid view toolbar. Tapping it opens a combined help guide with two labeled sections — "For Kids" and "For Parents" — each containing tappable topics that expand to show detailed, plain-language explanations of every game feature.

## Files to Create

| File | Purpose |
|------|---------|
| `src/models/helpContent.ts` | Static data — typed arrays of all 18 help topics |
| `src/components/HelpScreen.tsx` | New view component rendering both sections |
| `src/components/HelpScreen.module.css` | Styles for the help screen |

## Files to Modify

| File | Change |
|------|--------|
| `src/components/Game.tsx` | Add `'help'` to `view` union type; add Help button to toolbar; render `<HelpScreen>` when `view === 'help'`; pass `showSwitchProfile={!!onSwitchProfile}` |

## Workflow

1. Create `helpContent.ts` with all 18 `HelpTopic` objects (9 kid, 9 parent).
2. Create `HelpScreen.tsx` — renders two stacked sections from `KID_HELP_TOPICS` and `PARENT_HELP_TOPICS`; each topic row expands inline to show detail text on tap; Back button calls `onClose`.
3. Create `HelpScreen.module.css` — styles consistent with existing screens (same card/button visual language).
4. Modify `Game.tsx`:
   - Extend the `view` type to include `'help'`.
   - Add a Help button to the toolbar (alongside Chores, Store, Change, Parent, Switch).
   - Add a conditional render block: `if (view === 'help') return <HelpScreen onClose={() => setView('pet')} showSwitchProfile={!!onSwitchProfile} />`.

## Verification

1. Tap Help → combined guide opens with "For Kids" and "For Parents" sections visible.
2. Tap any topic → detail text expands.
3. Tap Back → returns to pet screen with all game state unchanged (coins, health, chores, streak).
4. Tap Help while pet is paused → pause banner not required inside help screen; returns cleanly to paused pet view.
5. When `onSwitchProfile` is not provided → Switch Profile topic is absent from the guide.

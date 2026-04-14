# Implementation Plan: Parent Join Code Display

**Branch**: `025-parent-join-code` | **Date**: 2026-04-07 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/025-parent-join-code/spec.md`

## Summary

Display the family join code at the top of the parent panel (above the tabs) so parents can share it with their kids. `joinCode` is threaded as an optional prop from `App.tsx` → `Game.tsx` → `ParentPanel.tsx`. Renders only in cloud mode; invisible in local mode.

## Technical Context

**Language/Version**: TypeScript 5.6
**Primary Dependencies**: React 19, CSS Modules
**Storage**: N/A — join code already exists in `provider.cloudContext.joinCode`
**Testing**: npm run build (TypeScript gate)
**Target Platform**: Web (mobile-first PWA)
**Project Type**: Web application (SPA)
**Performance Goals**: N/A
**Constraints**: Display only — no editing, no copy button
**Scale/Scope**: 4 files modified, ~10 lines of code total

## Constitution Check

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Fun-First Design | PASS | Unblocks kids joining the family → enables the fun |
| II. Ship & Iterate | PASS | 4 file touches, ~10 lines — minimum possible scope |
| III. Kid-Safe Always | PASS | Join code is already stored; no new data collection or PII exposure |

## Project Structure

### Documentation (this feature)

```text
specs/025-parent-join-code/
├── plan.md        # This file
├── research.md    # Phase 0 output
├── quickstart.md  # Phase 1 output
└── tasks.md       # Phase 2 output (/speckit.tasks)
```

### Source Code

```text
src/
├── App.tsx                          (MODIFY — pass joinCode prop to Game)
└── components/
    ├── Game.tsx                     (MODIFY — add joinCode to GameProps, pass to ParentPanel)
    ├── ParentPanel.tsx              (MODIFY — add joinCode prop, render banner above tabs)
    └── ParentPanel.module.css       (MODIFY — add .joinCodeBanner and .joinCode styles)
```

## Implementation Detail

### App.tsx

Add `joinCode={provider.cloudContext?.joinCode}` to the `<Game />` element.

### Game.tsx

- Add `joinCode?: string` to `GameProps` interface
- Destructure it in the component
- Pass `joinCode={joinCode}` to `<ParentPanel />`

### ParentPanel.tsx

- Add `joinCode?: string` to `ParentPanelProps`
- Render above `.tabs`: `{joinCode && <div className={styles.joinCodeBanner}>Family Code: <span className={styles.joinCode}>{joinCode}</span></div>}`

### ParentPanel.module.css

```css
.joinCodeBanner {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.5);
  text-align: center;
}
.joinCode {
  font-weight: 700;
  color: #f0e68c;
  letter-spacing: 0.15em;
}
```

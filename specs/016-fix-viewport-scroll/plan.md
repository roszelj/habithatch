# Implementation Plan: Fix Horizontal Scroll on iPhone 15 Pro

**Branch**: `016-fix-viewport-scroll` | **Date**: 2026-04-07 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/016-fix-viewport-scroll/spec.md`

## Summary

Several screen containers have `max-width` values of 400–500px that exceed the iPhone 15 Pro's 393px logical viewport. Combined with iOS Safari's known bug where `overflow-x: hidden` on `body` alone does not prevent scroll (must also be set on `html`), users experience horizontal scrolling. The fix adds `overflow-x: hidden` to `html` in `index.css` and reduces screen container max-widths to 360px across 6 component CSS files.

## Technical Context

**Language/Version**: TypeScript 5.6 + React 19
**Primary Dependencies**: Vite 5, CSS Modules
**Storage**: N/A
**Testing**: Manual only (no automated tests per spec)
**Target Platform**: iOS Safari on iPhone 15 Pro (393pt logical width)
**Project Type**: Mobile web app
**Performance Goals**: No measurable performance impact — CSS-only change
**Constraints**: Fix must not break layout on iPhone SE (375px) or wider screens
**Scale/Scope**: 7 CSS files, no logic changes

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Fun-First Design | ✅ Pass | Fixing a broken layout directly improves the kid's play experience |
| II. Ship & Iterate | ✅ Pass | Pure CSS fix, minimal scope, shippable in one cycle |
| III. Kid-Safe Always | ✅ Pass | No data changes, no network, no PII involved |

## Project Structure

### Documentation (this feature)

```text
specs/016-fix-viewport-scroll/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── quickstart.md        # Phase 1 output
└── tasks.md             # Phase 2 output (/speckit-tasks command)
```

### Source Code (affected files)

```text
src/
├── index.css                              # Add overflow-x: hidden to html
└── components/
    ├── SelectionScreen.module.css         # max-width: 500px → 360px
    ├── AccessoryPicker.module.css         # max-width: 450px → 360px
    ├── OutfitPicker.module.css            # max-width: 450px → 360px
    ├── ProfilePicker.module.css           # max-width: 450px → 360px
    ├── Game.module.css                    # max-width: 420px → 360px
    └── NamingStep.module.css              # max-width: 400px → 360px
```

**Structure Decision**: Single project, CSS Modules — no new files, modifications only.

## Phase 0: Research

See [research.md](./research.md).

**Key findings**:
- Viewport meta tag is correct — no change needed
- iOS Safari requires `overflow-x: hidden` on `html`, not just `body`
- Six screen container `max-width` values exceed 393px and should be capped at 360px
- No JavaScript or component logic changes required

## Phase 1: Design

### Change 1 — `src/index.css`

Add `overflow-x: hidden` to the `html` selector to close the iOS Safari overflow gap.

```css
html, body, #root {
  height: 100%;
  width: 100%;
  overflow-x: hidden;   /* add this */
}
```

### Change 2 — Screen container max-widths

Reduce all `.screen` container `max-width` values that exceed 393px down to `360px`. This leaves 16px breathing room inside the iPhone 15 Pro viewport after typical 24px side padding, and is well within iPhone SE (375px) bounds.

Files and specific changes documented in [quickstart.md](./quickstart.md).

### Why 360px?

- iPhone 15 Pro: 393px − 2×24px padding = 345px usable. 360px max-width will resolve to 345px on device. Safe.
- iPhone SE: 375px − 2×24px padding = 327px usable. Same reasoning — 360px resolves to 327px. Safe.
- Desktop/tablet: 360px centered, unchanged from current intent.

No data model or contracts needed — this is a pure layout fix.

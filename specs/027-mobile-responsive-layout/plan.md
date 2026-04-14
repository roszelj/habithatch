# Implementation Plan: Mobile Responsive Layout

**Branch**: `027-mobile-responsive-layout` | **Date**: 2026-04-09 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/027-mobile-responsive-layout/spec.md`

## Summary

The game UI must fit entirely within the visible viewport on 19.5:9 iPhones (iPhone 12–16 series) without scrolling. The fix is a fixed-height layout (`100dvh`), safe area insets via `env(safe-area-inset-*)`, adaptive spacing via `clamp()`, a wider max-width (430px), and internal scrolling for list-heavy sub-views. No changes to game logic, data model, or backend.

## Technical Context

**Language/Version**: TypeScript 5.6 + React 19
**Primary Dependencies**: Vite 5, CSS Modules
**Storage**: N/A (layout only)
**Testing**: Visual/manual — open in browser DevTools at 390×844 (iPhone 14 Pro) and 393×852 (iPhone 15 Pro)
**Target Platform**: iOS 16.4+ PWA, portrait orientation, 320px–430px viewport widths
**Project Type**: Web application (PWA)
**Performance Goals**: Layout paint must not degrade perceived responsiveness (interactions remain within 200ms per constitution)
**Constraints**: Portrait-only, no horizontal scroll, safe area compliance, 320px–430px width range
**Scale/Scope**: ~6 CSS files + 1 HTML file

## Constitution Check

### I. Fun-First Design ✅

Layout changes directly improve player delight — children will see the creature and controls without awkward scrolling. The creature stage will grow to fill available space, making it more visually engaging. No interaction latency is introduced.

### II. Ship & Iterate ✅

Pure CSS + one HTML attribute change. Zero game logic touched. Deliverable in a single cycle and testable immediately in DevTools. No speculative additions — only what FR-001 through FR-007 require.

### III. Kid-Safe Always ✅

Layout-only change. No data collection, content, or network behavior modified.

**Gate result**: PASS — no violations. Complexity Tracking table not required.

## Project Structure

### Documentation (this feature)

```text
specs/027-mobile-responsive-layout/
├── plan.md              # This file
├── research.md          # Phase 0 output
└── tasks.md             # Phase 2 output (/speckit-tasks — not yet created)
```

### Source Code (files changed by this feature)

```text
index.html                                    # viewport-fit=cover
src/
└── index.css                                 # body/root safe-area padding
src/components/
├── Game.module.css                           # primary layout changes
├── ChorePanel.module.css                     # internal scroll region
├── Store.module.css                          # internal scroll region
└── ParentPanel.module.css                    # internal scroll region
```

**Structure Decision**: Single-project web app. Changes are confined to CSS Modules and the HTML shell — no new files, no new components.

---

## Phase 0: Research

Complete. See [research.md](research.md).

All questions resolved — no NEEDS CLARIFICATION items remain.

Key decisions:
- `100dvh` for container height (not `vh`)
- Fixed-height no-scroll game container; internal scroll for lists
- Bottom toolbar stays at bottom (already correct placement, fixed by layout)
- `viewport-fit=cover` + `env(safe-area-inset-*)` for notch/home-indicator
- Max-width 360px → 430px
- `clamp()` for gap/padding; font sizes unchanged
- Store grid and Parent dashboard grid unchanged in this feature

---

## Phase 1: Design & Contracts

### Data Model

No data model changes. This feature is presentation-only.

### Contracts

No external interface changes. This feature modifies only visual layout.

### Detailed Change Plan

#### 1. `index.html` — Add `viewport-fit=cover`

```html
<!-- Before -->
<meta name="viewport" content="width=device-width, initial-scale=1.0" />

<!-- After -->
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
```

This enables full-bleed layout to the physical screen edges so we can control safe areas explicitly via CSS.

---

#### 2. `src/index.css` — Body safe-area top padding

Add padding-top to body so content never overlaps the notch/dynamic island:

```css
body {
  /* existing rules ... */
  padding-top: env(safe-area-inset-top);
}
```

---

#### 3. `src/components/Game.module.css` — Core layout overhaul

**`.game`**: Switch from `min-height: 100vh` (scrollable) to `height: 100dvh; overflow: hidden` (fixed). Reduce gap with `clamp()`. Increase max-width to 430px. Add bottom safe-area padding.

```css
.game {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: clamp(10px, 2.5dvh, 20px);
  height: 100dvh;
  width: 100%;
  max-width: 430px;
  margin: 0 auto;
  padding: 16px 16px env(safe-area-inset-bottom, 16px);
  overflow: hidden;
  position: relative;
}
```

**`.creatureStage`**: Change from content-driven height to `flex: 1; min-height: 0` so it fills all remaining vertical space between the header elements above and the action/toolbar below.

```css
.creatureStage {
  /* existing visual rules preserved */
  flex: 1;
  min-height: 0;
  width: 100%;
  /* rest unchanged: border-radius, background, border, padding, overflow */
}
```

**Sub-view containers** (the `<div>` wrapping ChorePanel, Store, ParentPanel when active): These should also be `flex: 1; min-height: 0; overflow: hidden; width: 100%` so list views fill the space and scroll internally.

---

#### 4. `src/components/Game.tsx` — Wrap sub-views in a flex-fill container

The conditional rendering of ChorePanel, Store, and ParentPanel needs a wrapper div that takes `flex: 1; min-height: 0; width: 100%; overflow: hidden` so those panels can scroll internally within the fixed-height game container. Add a CSS class `.subView` to Game.module.css and apply it to that wrapper.

```css
/* Game.module.css — new rule */
.subView {
  flex: 1;
  min-height: 0;
  width: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
```

In Game.tsx, the chore/store/parent panel rendering is currently done conditionally at the end of the game JSX. Each alternate view should be wrapped:

```tsx
{view === 'chores' && (
  <div className={styles.subView}>
    <ChorePanel ... />
  </div>
)}
{view === 'store' && (
  <div className={styles.subView}>
    <Store ... />
  </div>
)}
{view === 'parent' && (
  <div className={styles.subView}>
    <ParentPanel ... />
  </div>
)}
```

---

#### 5. `src/components/ChorePanel.module.css` — Ensure internal scroll

`.panel` already has `overflow-y: auto`. Confirm `flex: 1; min-height: 0` is present so it fills the `.subView` wrapper:

```css
.panel {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  /* existing rules preserved */
}
```

---

#### 6. `src/components/Store.module.css` — Ensure internal scroll

`.store` needs `flex: 1; min-height: 0; overflow-y: auto` to scroll within the `.subView` wrapper:

```css
.store {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  /* existing rules preserved */
}
```

---

#### 7. `src/components/ParentPanel.module.css` — Ensure internal scroll

`.panel` already has `overflow-y: auto`. Same pattern as ChorePanel — confirm `flex: 1; min-height: 0`:

```css
.panel {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  /* existing rules preserved */
}
```

---

### Quickstart: How to Test This Feature

**DevTools method (fastest)**:
1. Open the app in Chrome
2. Open DevTools → Toggle device toolbar (⌘⇧M)
3. Select "iPhone 15 Pro" (393 × 852) or manually enter 393 × 852
4. Navigate to the game screen
5. Verify: creature, points, health bar, action buttons, and toolbar all visible without scroll
6. Switch to Chores view — confirm chores scroll internally, toolbar stays visible
7. Switch to Store — confirm items scroll internally

**PWA on device**:
1. Deploy to Firebase Hosting (`firebase deploy --only hosting`)
2. Open on iPhone, add to Home Screen
3. Launch from Home Screen icon
4. Verify zero scrolling on pet view
5. Test all sub-views

### Agent Context

No new technologies introduced. Existing CLAUDE.md stack entry for `016-fix-viewport-scroll` (CSS Modules) covers this feature.

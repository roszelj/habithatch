# Research: Fix Horizontal Scroll on iPhone 15 Pro

## Findings

### 1. Viewport Meta Tag
**Decision**: The `index.html` viewport meta tag is correct: `width=device-width, initial-scale=1.0`. No change needed here.
**Rationale**: This tag is already present and correct. The overflow is CSS-origin, not viewport-config origin.

### 2. Global CSS Baseline
**Decision**: `index.css` already applies `box-sizing: border-box` globally and `overflow-x: hidden` on `body`. However, `html` does not have `overflow-x: hidden`.
**Rationale**: iOS Safari has a known bug where `overflow-x: hidden` on `body` alone does not prevent horizontal scroll — the `html` element must also have `overflow-x: hidden` (or `overflow: hidden`). This is likely the primary enabler of the overflow being visible to the user despite the body constraint.

### 3. Container max-width Values Exceeding iPhone 15 Pro Width (393px)
**Decision**: Several `.screen` containers use `max-width` values between 400–500px. Because these paired with `width: 100%` should resolve to the viewport width, this alone does not cause overflow. However, if any child element inside these containers has a fixed width or `min-width` exceeding the viewport, it will push the layout wider.
**Files affected**:
- `SelectionScreen.module.css`: `max-width: 500px`
- `AccessoryPicker.module.css`: `max-width: 450px`
- `OutfitPicker.module.css`: `max-width: 450px`
- `ProfilePicker.module.css`: `max-width: 450px`
- `Game.module.css`: `max-width: 420px`
- `NamingStep.module.css`: `max-width: 400px`
**Rationale**: Should be capped to `min(Xpx, 100%)` or just `100%` to be safe. On a 393px device they will render at 393px anyway, but using `width: 100%; max-width: Xpx` is idiomatic and safe.

### 4. Root Cause Hypothesis
**Decision**: The overflow is most likely caused by:
1. `overflow-x: hidden` not set on `html` (iOS Safari bug)
2. One or more elements with fixed pixel widths wider than 393px that push the layout beyond the viewport before the body's `overflow-x: hidden` can clip it

**Fix approach**:
1. Add `overflow-x: hidden` to `html` in `index.css`
2. Audit and constrain any fixed-width elements that could exceed 393px
3. Use `max-width: min(Xpx, 100%)` or `max-width: 100%` on screen containers to guarantee containment

### 5. Alternatives Considered
- Adding `overflow: hidden` to every screen container — rejected as too heavy-handed; hides scrollable content
- Restructuring layouts from scratch — rejected; the existing layout structure is correct, only width constraints need tightening

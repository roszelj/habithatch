# Quickstart: Fix Horizontal Scroll on iPhone 15 Pro

## What This Fix Does

Prevents horizontal scrolling on iPhone 15 Pro (393px logical width) by:
1. Adding `overflow-x: hidden` to the `html` element (fixes iOS Safari's known gap)
2. Constraining screen container widths to not exceed the viewport

## Files to Change

| File | Change |
|------|--------|
| `src/index.css` | Add `overflow-x: hidden` to `html` selector |
| `src/components/SelectionScreen.module.css` | Reduce `max-width: 500px` → `360px` |
| `src/components/AccessoryPicker.module.css` | Reduce `max-width: 450px` → `360px` |
| `src/components/OutfitPicker.module.css` | Reduce `max-width: 450px` → `360px` |
| `src/components/ProfilePicker.module.css` | Reduce `max-width: 450px` → `360px` |
| `src/components/Game.module.css` | Reduce `max-width: 420px` → `360px` |
| `src/components/NamingStep.module.css` | Reduce `max-width: 400px` → `360px` |

## How to Test

1. Open the app in Chrome DevTools with the iPhone 15 Pro device preset (393×852px)
2. Navigate through: auth screen → join/setup → profile picker → game screen → outfit picker → accessory picker → naming step
3. Verify no horizontal scrollbar appears on any screen
4. Also test iPhone SE preset (375px) for regression

## Notes

- All screen containers already use `width: 100%`, so reducing `max-width` only affects desktop/tablet views where the app is centered — it does not break the mobile layout.
- The `360px` target gives ~16px breathing room on iPhone 15 Pro after container padding.

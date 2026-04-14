# Quickstart: Parent Join Code Display

**Feature**: 025-parent-join-code | **Date**: 2026-04-07

---

## Scenario 1 — Parent opens Parent Mode in cloud mode

**Setup**: Parent logged in to Firebase, family join code = `"HX7K2P"`.

**Flow**:
1. Parent taps the lock icon → enters PIN → parent panel opens
2. At the top of the panel, above the tabs, the banner reads:
   `Family Code: HX7K2P`
3. Parent reads it and gives the code to their child

**Expected result**: Join code visible immediately on every tab, no additional taps needed.

---

## Scenario 2 — Local mode (no join code)

**Setup**: App running in local/offline mode, no Firebase family.

**Flow**:
1. Parent opens Parent Mode
2. No join code banner is rendered

**Expected result**: Panel looks identical to the current state — no join code section, no empty placeholder.

# Research: Mobile Responsive Layout (027)

## Decision 1: Viewport Height Units — `dvh` over `vh`

**Decision**: Use `100dvh` (dynamic viewport height) for the game container height.

**Rationale**: On mobile browsers, `100vh` is computed from the maximum viewport height (before the browser chrome collapses), causing content to be clipped behind the address bar. `dvh` reflects the *actual* available height at any moment. Since HabitHatch is installed as a home-screen PWA with no browser chrome, `dvh` and `vh` behave identically in that context — but `dvh` is the correct semantic choice and handles any edge case where the PWA shell is visible.

**Alternatives considered**: `100vh` — rejected because it overflows on mobile browsers when used as an app outside PWA mode.

---

## Decision 2: Game Screen as Fixed-Height, No-Scroll Container

**Decision**: Make the `.game` container `height: 100dvh; overflow: hidden` so the entire game UI fits within the screen with zero full-page scrolling. Sub-views with lists (Chores, Store, Parent Panel) use internal `overflow-y: auto` within a flex-grown middle region.

**Rationale**: The current `min-height: 100vh` allows the page to scroll, which pushes the toolbar out of view. By fixing the height and using `flex: 1; min-height: 0` on the scrollable inner region, all primary controls remain anchored — action buttons and toolbar stay at the bottom regardless of content length.

**Alternatives considered**:
- Keep scrollable page, sticky toolbar — rejected because sticky positioning is fragile across iOS PWA versions.
- Reduce content density enough that it fits without overflow — rejected because it would require sacrificing too many UI elements.

---

## Decision 3: Bottom Toolbar Stays at Bottom (Not Moved to Top)

**Decision**: Keep the toolbar at the bottom of the screen. With the fixed-height layout (Decision 2), the toolbar is always visible and thumb-reachable without scrolling.

**Rationale**: The spec calls for controls in the bottom portion of the screen. The current code already places the toolbar at the bottom — the problem was it was scrolling off-screen. The fixed-height approach fixes this without restructuring the component tree. Bottom tab bars also match the native iOS navigation pattern that children are already familiar with.

**Alternatives considered**: Move toolbar to top — rejected because the spec explicitly calls for bottom placement for thumb reachability, and top placement means reaching across the full screen height.

---

## Decision 4: `viewport-fit=cover` + CSS Safe Area Insets

**Decision**: Add `viewport-fit=cover` to the HTML viewport meta tag and apply `env(safe-area-inset-*)` padding to the game container and toolbar.

**Rationale**: Without `viewport-fit=cover`, iOS adds automatic safe area padding that prevents the background from reaching the edges, creating an ugly white/grey gap on notch devices. With `viewport-fit=cover`, the app extends full-bleed to the screen edges, and we manually apply padding using `env(safe-area-inset-top/bottom)` to keep interactive elements out of the notch and home indicator zones.

**Alternatives considered**: Let the OS handle safe areas automatically — rejected because it prevents full-bleed background color and gives no control over which elements get padded.

---

## Decision 5: Max-Width Increased to 430px

**Decision**: Change `.game` max-width from `360px` to `430px`.

**Rationale**: 360px was designed for older, narrower phones. The iPhone 15 Pro Max has a 430pt logical width. Keeping 360px wastes ~35px of screen real estate on each side on modern phones, making the game feel cramped and leaving visible dead space. 430px matches the widest current iPhone, while keeping the cap means it degrades gracefully on wider screens (tablet, desktop).

**Alternatives considered**: Remove max-width entirely — rejected because the game would look stretched on tablets/desktop. Keep 360px — rejected because it wastes meaningful space on current devices.

---

## Decision 6: `clamp()` for Adaptive Spacing

**Decision**: Replace fixed `px` values for gaps and padding with `clamp(min, preferred, max)` where spacing needs to adapt. Key substitutions:
- `.game` gap: `20px` → `clamp(10px, 2.5dvh, 20px)`
- `.game` padding: `20px` → `16px` (fixed reduction is sufficient given the fixed-height model)
- `.creatureStage` height: implicit (content-driven) → `flex: 1; min-height: 0` (grows to fill available space)

**Rationale**: `clamp()` lets spacing scale with viewport height, preventing overflow on shorter viewports while retaining comfort on taller ones. The creature stage switching to `flex: 1` means it automatically claims all space not consumed by other elements — no magic numbers needed.

**Alternatives considered**: Media queries at specific breakpoints — retained as a supplementary tool for aspect-ratio-specific overrides, but `clamp()` handles the continuous range more elegantly.

---

## Decision 7: No Font Size Changes Needed

**Decision**: Keep existing `rem`-based font sizes. Do not add `clamp()` to typography.

**Rationale**: The current font sizes (`0.9rem`, `1.1rem`, `1.8rem`) are already modest and render well at all target widths (320–430px). The layout problem is vertical overflow, not horizontal text overflow. Reducing font sizes would hurt readability for children.

**Alternatives considered**: `clamp()` on all font sizes — rejected as unnecessary complexity that risks hurting child readability.

---

## Decision 8: No Changes to Grid Layouts (Store, Parent Dashboard)

**Decision**: Leave the 3-column Store grid and 2-column Parent dashboard grid unchanged in this feature.

**Rationale**: The primary problem is the game screen's vertical fit. Store and Parent Panel already have `overflow-y: auto` and will scroll internally once the fixed-height layout is in place. Changing grid columns is a separate cosmetic improvement outside the scope of this feature (FR-001 through FR-007 are all satisfied without grid changes).

**Alternatives considered**: Responsive grid with `auto-fit` — deferred to a future layout polish feature.

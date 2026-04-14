# Research: Pet Fullscreen Interactive View

## Decision 1: Idle Wandering Animation Approach

**Decision**: CSS keyframe animation with random-feeling movement using a multi-step translateX/translateY keyframe sequence.

**Rationale**: The app already uses CSS animations for creature interactions (bounce, wobble in Creature.module.css). CSS keyframes are zero-dependency, GPU-accelerated, and work smoothly on mobile Safari/Chrome. A multi-waypoint keyframe (8-10 stops) gives the illusion of random wandering without JavaScript timers or requestAnimationFrame loops.

**Alternatives considered**:
- JavaScript setInterval with random positions — heavier, battery-draining, risk of jank on low-end devices
- Web Animations API — more control but overkill for simple idle drift, browser support concerns on older mobile
- CSS transitions with JS-driven random targets — requires JS timer to update targets, more complex state management

## Decision 2: Fullscreen View Architecture

**Decision**: New `PetFullscreen` component rendered as a fixed-position overlay inside Game.tsx, controlled by a boolean state (`showFullscreen`).

**Rationale**: The game already uses inline state management (no router). A fixed overlay is the simplest approach — it covers the viewport, doesn't affect the underlying game state, and can be dismissed cleanly. This matches the existing pattern where Game.tsx manages sub-views like the store, outfit picker, and change creature screen.

**Alternatives considered**:
- React Portal — unnecessary complexity for a simple overlay within the same component tree
- New route/page — the app has no router; adding one for a single view is overengineering
- Modal library — adds a dependency for what is essentially a fullscreen div

## Decision 3: Speech Bubble Implementation

**Decision**: Reuse the existing speech bubble CSS pattern from Game.module.css (`.speechBubble` class) adapted into PetFullscreen. The bubble appears on mount with the time-of-day greeting.

**Rationale**: The speech bubble design is already proven and styled for the app's aesthetic. The existing `bubblePop` animation provides a polished entrance. The greeting text is computed once on mount using `new Date().getHours()`.

**Alternatives considered**:
- Extracting a shared SpeechBubble component — nice in theory but over-abstraction for 2 usages; can refactor later if needed
- Typing animation (letter by letter) — fun but adds complexity; can be a follow-up enhancement

## Decision 4: Habitat Background Display

**Decision**: Use the habitat image at full opacity as the background (via CSS `background-image` or `<img>` with `object-fit: cover`). Fall back to a solid dark gradient if no habitat is set.

**Rationale**: The game already renders habitat images in the creature stage at 0.25 opacity. The fullscreen view is the creature's "home" — showing the habitat at full opacity makes it feel immersive and distinct from the main game view. The `getHabitatById()` helper and image paths already exist in `src/models/habitats.ts`.

**Alternatives considered**:
- Same 0.25 opacity as main view — defeats the purpose of an immersive fullscreen experience
- Animated/parallax background — scope creep; can be a polish item later

## Decision 5: Time-of-Day Greeting Ranges

**Decision**: Use the ranges from the spec:
- Morning: 5:00 AM – 11:59 AM
- Afternoon: 12:00 PM – 4:59 PM
- Evening: 5:00 PM – 4:59 AM

**Rationale**: These are intuitive, kid-friendly ranges. "Good Evening" covers nighttime because kids using the app late should still get a warm greeting, not "Good Night" (which implies bedtime and is a different social cue).

**Alternatives considered**: None — the spec defines clear ranges and they make sense.

## Decision 6: Name Fallback Logic

**Decision**: Use `childName || creatureName` — same pattern as ProfilePicker and ParentPanel's `displayName()` helper.

**Rationale**: Consistent with the just-implemented child real name feature (030-kid-real-name). If childName is null or empty, creature name is the natural fallback. This is already a proven pattern throughout the parent-facing UI.

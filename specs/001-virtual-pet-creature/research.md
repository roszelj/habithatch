# Research: Virtual Pet Creature

**Feature**: 001-virtual-pet-creature
**Date**: 2026-04-02

## Technology Decisions

### Decision: TypeScript + React for Web

**Decision**: Build as a React web application using TypeScript.

**Rationale**: React's component model maps naturally to the game's
UI structure (creature display, stat bars, action buttons). TypeScript
adds type safety for game state management. Web platform means zero
install friction — kids (or parents) just open a URL.

**Alternatives considered**:
- Pygame: Good for prototyping but limited distribution (requires
  Python install)
- Swift/iOS: Great UX but limits audience to Apple devices
- Vanilla HTML/Canvas: Lower-level, more work for UI components
  that React handles well

### Decision: Vite for Build Tooling

**Decision**: Use Vite as the build tool and dev server.

**Rationale**: Fast HMR for rapid iteration (aligns with Ship &
Iterate principle). Zero-config TypeScript support. Lightweight
compared to webpack.

**Alternatives considered**:
- Create React App: Deprecated, heavier
- Next.js: Server-side features unnecessary for a client-only game

### Decision: CSS Modules for Styling

**Decision**: Use CSS Modules for component-scoped styles.

**Rationale**: Simple, no extra dependencies. Scoped by default.
Sufficient for a game UI that's mostly custom visuals rather than
standard layouts.

**Alternatives considered**:
- Tailwind: Utility classes don't map well to game-specific visuals
- styled-components: Extra dependency, runtime cost for no benefit
  in this context

### Decision: Local State with React useState/useReducer

**Decision**: Manage creature state with React's built-in hooks
(useReducer for the creature state machine).

**Rationale**: The game state is simple (one creature, three stats,
a timer). No need for external state management. useReducer fits
naturally for action → state transitions.

**Alternatives considered**:
- Zustand/Redux: Overkill for single-creature state
- Context API: Unnecessary since state lives in one component tree

### Decision: requestAnimationFrame for Time-Based Decay

**Decision**: Use requestAnimationFrame (via a custom hook) for the
game loop that drives stat decay over time.

**Rationale**: Browser-native, battery-friendly, pauses when tab is
hidden (desirable — stats don't drain while kid isn't looking).
Provides smooth visual updates tied to frame rate.

**Alternatives considered**:
- setInterval: Less precise, doesn't pause when tab hidden, can
  drift over time
- Web Workers: Overkill for a simple timer

### Decision: No Backend / No Persistence (This Feature)

**Decision**: Purely client-side. No server, no database, no
localStorage (save/load is a separate feature).

**Rationale**: Spec explicitly scopes persistence out. Keeping it
client-only means zero infrastructure and instant playability.

### Decision: Vitest for Testing

**Decision**: Use Vitest for unit testing game logic.

**Rationale**: Native Vite integration, fast execution, Jest-
compatible API. Focus tests on state machine logic per constitution
(test what adds confidence, not ceremony).

**Alternatives considered**:
- Jest: Slower, requires separate config for TypeScript
- No tests: Constitution says test game-logic correctness

## Kid-Safety Audit (Constitution Principle III)

- **No PII collection**: App is purely client-side, no forms, no
  network requests. PASS.
- **Age-appropriate content**: All visuals are cartoon creature
  states. No text input from children. PASS.
- **No third-party tracking**: No analytics, no ads, no external
  scripts. PASS.
- **Dependencies**: React and Vite are well-audited, widely used
  libraries with no known kid-safety concerns. PASS.

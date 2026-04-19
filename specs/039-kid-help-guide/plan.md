# Implementation Plan: Kid Help Guide

**Branch**: `039-kid-help-guide` | **Date**: 2026-04-19 | **Spec**: [spec.md](spec.md)  
**Input**: Feature specification from `/specs/039-kid-help-guide/spec.md`

## Summary

Add a Help button to the kid view toolbar that opens a combined, two-section help guide ("For Kids" / "For Parents") with 18 static help topics covering every feature accessible in the kid view and in Parent Mode. The feature requires one new view component, one static data module, and a small extension to the existing `Game.tsx` view-switcher.

## Technical Context

**Language/Version**: TypeScript 5.6 + React 19  
**Primary Dependencies**: React 19, Vite 5, CSS Modules  
**Storage**: N/A — static help content, no persistence  
**Testing**: npm test (existing Jest/Vitest setup)  
**Target Platform**: Mobile web / PWA (iOS + Android browsers, 320–428px screens)  
**Project Type**: mobile-app / PWA  
**Performance Goals**: Help screen must be interactive within 200ms of tap (Constitution Principle I)  
**Constraints**: No state side-effects on open/close; conditional Switch Profile topic  
**Scale/Scope**: 18 static help topics, 3 new files, 1 modified file

## Constitution Check

### I. Fun-First Design ✅

The help screen uses the same visual language as the rest of the app (emoji icons, rounded cards, playful language). Kid-section topics are written at a 4th-grade reading level. The feature does not block or slow any game interaction — it is a separate view. Responsive feedback (tap to expand) is instant (no async work).

### II. Ship & Iterate ✅

Smallest possible deliverable: static content, one component, one data file, minimal changes to `Game.tsx`. No speculative abstractions. Can be tested in isolation (render `<HelpScreen>` standalone) before integration. Content can be updated independently of the component structure.

### III. Kid-Safe Always ✅

Help content is read-only plain text. No PII collected or displayed. Parent section content (PIN setup, chore management) is non-sensitive operational guidance. No new network calls, third-party dependencies, or data storage introduced.

**Gate result**: All three principles satisfied. No violations.

## Project Structure

### Documentation (this feature)

```text
specs/039-kid-help-guide/
├── plan.md              ← this file
├── research.md          ← Phase 0 output
├── data-model.md        ← Phase 1 output
├── quickstart.md        ← Phase 1 output
└── tasks.md             ← Phase 2 output (/speckit.tasks)
```

### Source Code

```text
src/
├── models/
│   └── helpContent.ts           (NEW — 18 static HelpTopic objects)
└── components/
    ├── HelpScreen.tsx            (NEW — combined help view component)
    ├── HelpScreen.module.css     (NEW — styles)
    └── Game.tsx                  (MODIFIED — add 'help' view, Help toolbar button)
```

**Structure Decision**: Single-project layout, existing `src/components` and `src/models` directories. No new directories needed.

## Complexity Tracking

No constitution violations — table not required.

<!--
Sync Impact Report
- Version change: 0.0.0 → 1.0.0
- Modified principles: N/A (initial creation)
- Added sections:
  - Core Principles (3): Fun-First Design, Ship & Iterate, Kid-Safe Always
  - Development Workflow
  - Governance
- Removed sections:
  - [SECTION_2_NAME] / [SECTION_3_NAME] replaced with concrete sections
- Templates requiring updates:
  - .specify/templates/plan-template.md — ✅ no updates needed (Constitution Check is dynamic)
  - .specify/templates/spec-template.md — ✅ no updates needed (generic structure)
  - .specify/templates/tasks-template.md — ✅ no updates needed (generic structure)
- Follow-up TODOs: none
-->

# Terragucci Constitution

## Core Principles

### I. Fun-First Design

Every feature MUST prioritize player delight and engagement above
technical elegance. Decisions about mechanics, UI, and feedback loops
MUST be evaluated through the lens of "is this fun for a kid?"

- Interactions MUST feel responsive and rewarding (visual/audio feedback
  within 200ms of player action).
- Creature state changes (hunger, happiness, energy) MUST be
  communicated through clear, playful visuals — never raw numbers alone.
- New features MUST be playtestable in isolation before integration.

**Rationale**: A kids game lives or dies on whether it sparks joy.
Technical correctness without fun is a failed product.

### II. Ship & Iterate

Working software beats perfect plans. Ship the smallest playable
increment, get feedback, and improve.

- Features MUST be scoped to deliverable increments that can be
  tested within a single development cycle.
- Refactoring is permitted only when it unblocks a concrete next
  feature — not for speculative improvement.
- Prototypes and experiments are encouraged; delete them without guilt
  when they don't work out.

**Rationale**: Iteration speed is the primary competitive advantage
for a small project. Overplanning kills momentum.

### III. Kid-Safe Always

All content, data handling, and interactions MUST be appropriate and
safe for children. This principle is NON-NEGOTIABLE and overrides
all other principles when in conflict.

- The game MUST NOT collect, store, or transmit personally
  identifiable information from players.
- All text, imagery, and audio MUST be age-appropriate.
- Network features (if any) MUST default to off and require explicit
  opt-in with guardian consent.
- Third-party dependencies MUST be audited for kid-safety compliance
  before adoption.

**Rationale**: Legal (COPPA) and ethical obligation. A breach of
child safety is an existential risk to the project.

## Development Workflow

- **Branching**: Feature branches with sequential numbering per the
  Specify workflow. Merge to main when playable and tested.
- **Testing**: Tests are written when they add confidence — not as
  ceremony. Focus testing effort on game-logic correctness (creature
  state machines, timer behavior, save/load) rather than UI pixel
  tests.
- **Code Review**: Self-review is acceptable for small changes. Any
  change touching kid-safety (Principle III) MUST be reviewed by at
  least one other person or explicitly justified in the commit message.
- **Releases**: Ship early, ship often. Version tags on main when a
  milestone is playable end-to-end.

## Governance

This constitution is the highest-authority document for the Terragucci
project. All development decisions MUST be consistent with these
principles.

- **Amendments**: Any change to this constitution MUST be documented
  with a version bump, rationale, and updated date. Changes that remove
  or redefine a principle require a MAJOR version bump. New principles
  or material expansions require MINOR. Wording fixes require PATCH.
- **Compliance**: When planning a feature (via `/speckit-plan`), the
  Constitution Check gate MUST verify alignment with all three
  principles before implementation begins.
- **Conflict resolution**: If two principles conflict, Principle III
  (Kid-Safe Always) wins. Between I and II, favor whichever unblocks
  shipping a playable increment.

**Version**: 1.0.0 | **Ratified**: 2026-04-02 | **Last Amended**: 2026-04-02

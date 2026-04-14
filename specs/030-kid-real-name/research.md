# Research: Child Real Name

## Decision 1: Field naming convention

**Decision**: Use `childName` as the field name on `ChildProfile`.
**Rationale**: Consistent with existing naming patterns (`creatureName`, `creatureType`). Clear distinction: `childName` = the human child, `creatureName` = the pet/creature.
**Alternatives considered**:
- `realName` — ambiguous (real name of what?)
- `displayName` — conflicts with common auth patterns
- `playerName` — less clear for parents

## Decision 2: Where to collect the real name

**Decision**: Add a "child name" input to the existing `NamingStep` component, shown before the creature name input.
**Rationale**: Keeps the creation flow compact (no extra screen). The parent enters the child's name first, then the creature name. Natural order: "Who is this for?" → "What should we name the creature?"
**Alternatives considered**:
- Separate screen for child name — adds friction, unnecessary for one field
- Collect after creature creation — confusing order (name creature, then name child)
- Optional prompt on first parent panel visit — easy to miss, breaks the "set once at creation" pattern

## Decision 3: How to display real name in parent contexts

**Decision**: Show `childName` as the primary label in parent-facing areas, with `creatureName` shown secondarily (smaller text or parenthetical).
**Rationale**: The whole point is for parents to see the child's name prominently. The creature name is secondary context.
**Alternatives considered**:
- Show both equally — dilutes the purpose of having real names
- Show only childName — loses creature context that some parents may want

## Decision 4: Backward compatibility strategy

**Decision**: `childName` defaults to `null` (not set). When `childName` is null, the system displays `creatureName` as before. Migration adds `childName: null` to existing profiles.
**Rationale**: Zero disruption for existing users. No forced data entry. Parent can optionally set the name at any time.
**Alternatives considered**:
- Force migration prompt — disruptive, against Ship & Iterate principle
- Default to creature name — would confuse parents if they think it's already set

## Decision 5: PII and Kid-Safe compliance

**Decision**: Proceed with storing child's real name with the following safeguards:
1. Name is entered by parent only (parent PIN / auth required)
2. Name is displayed only in parent-facing contexts
3. Name is stored in existing Firestore profile document (no new collection or transmission)
4. Name is never exposed in child's game view
**Rationale**: The parent is the data controller. They choose to label their child's profile for their own management. This is equivalent to a parent writing their child's name on their tablet — low risk, high utility.
**Alternatives considered**:
- Don't store real name at all — fails the core requirement
- Store only initials — insufficient for multi-child households with similar initials

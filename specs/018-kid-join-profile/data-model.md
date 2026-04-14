# Data Model: Kid Join Profile Selection

**Feature**: 018-kid-join-profile
**Date**: 2026-04-07

## No New Entities

This feature introduces no new data entities or schema changes. All required data structures already exist.

## Modified Interfaces

### `DataProvider` (src/hooks/useDataProvider.ts)

Add one field:

| Field  | Type    | Description                                                             |
|--------|---------|-------------------------------------------------------------------------|
| loaded | boolean | `true` once the provider has completed its first data fetch/snapshot. Always `true` for local provider. Starts `false` for cloud provider and becomes `true` after the first Firestore profiles snapshot. |

**Why**: Needed to distinguish "cloud data not yet arrived" from "cloud data arrived and profiles list is empty" so App.tsx can gate the ProfilePicker render correctly.

## Existing Entities Used (no changes)

| Entity       | Source                          | Role in this feature                              |
|--------------|---------------------------------|---------------------------------------------------|
| ChildProfile | src/models/types.ts             | Displayed in ProfilePicker after join             |
| AppData      | src/models/types.ts             | Container for profiles; read-only for this feature|
| AppPhase     | src/App.tsx (local type)        | `profiles` step used as post-join destination     |

# Data Model: Kid Help Guide (039)

## Overview

This feature introduces no new persistent data. All help content is static and defined as TypeScript constants. No changes to Firestore, localStorage, or existing model types are required.

---

## New Types

### `HelpAudience`

```
'kid' | 'parent'
```

Tags a help topic as belonging to the "For Kids" or "For Parents" section.

---

### `HelpTopic`

| Field     | Type           | Description                                              |
|-----------|----------------|----------------------------------------------------------|
| `id`      | `string`       | Unique identifier (used as React key)                    |
| `title`   | `string`       | Short display name shown in the topic list row           |
| `summary` | `string`       | One-sentence description shown beneath the title in list |
| `detail`  | `string`       | Full explanation shown when topic is expanded/selected   |
| `audience`| `HelpAudience` | Determines which section this topic appears under        |

---

## Static Content Module

**File**: `src/models/helpContent.ts`

Exports:
- `KID_HELP_TOPICS: HelpTopic[]` — all topics with `audience: 'kid'`
- `PARENT_HELP_TOPICS: HelpTopic[]` — all topics with `audience: 'parent'`

### Kid Help Topics (9)

| ID | Title | Feature Covered |
|----|-------|-----------------|
| `kid-pet` | Your Pet | Creature, mood indicator, health bar |
| `kid-feed` | Feeding Your Pet | Feed button, food menu, coin cost |
| `kid-points-coins` | Points & Coins | How points and coins are earned, what they represent |
| `kid-streak` | Your Streak | Daily streak, how to build and maintain it |
| `kid-chores` | Chores | Checking off chores, weekday vs. weekend, pending approval |
| `kid-store` | The Store | Outfits, accessories, habitats, reward presents |
| `kid-minigames` | Mini-Games | Tap pet to play, Spin the Wheel, Tic Tac Toe, Trivia |
| `kid-change-creature` | Change Creature | Changing pet type and name |
| `kid-switch-profile` | Switch Profile | Switching between child profiles (conditional) |

### Parent Help Topics (9)

| ID | Title | Feature Covered |
|----|-------|-----------------|
| `parent-pin` | PIN Setup & Access | Creating a PIN, entering Parent Mode |
| `parent-chores` | Managing Chores | Adding/removing chores, weekday vs. weekend, all kids at once |
| `parent-approve` | Approving Chores | Reviewing pending submissions, approve or reject |
| `parent-bonus` | Bonus Points | Awarding extra points and coins to a child |
| `parent-rewards` | Reward Presents | Creating rewards, what happens when redeemed, marking fulfilled |
| `parent-pause` | Pause Mode | Pausing a child's profile, what pausing does and doesn't affect |
| `parent-profiles` | Child Profiles | Updating child display names, managing multiple profiles |
| `parent-join-code` | Join Code | Using the join code to access the family on another device |
| `parent-chore-points` | Chore Points | Setting point and coin values earned per chore category |

---

## Component Interface

### `HelpScreen` Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `onClose` | `() => void` | Yes | Called when the user taps Back — returns to pet view |
| `showSwitchProfile` | `boolean` | No | When `false` or absent, the Switch Profile topic is hidden |

---

## No Storage Changes

- No new Firestore fields
- No localStorage keys added or modified
- No changes to `ChildProfile`, `AppData`, or any existing model type

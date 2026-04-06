# Quickstart: Terragucci Virtual Pet

## Prerequisites

- Node.js 18+ installed
- npm or pnpm

## Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open the URL shown in terminal (typically http://localhost:5173).

## What You Should See

1. A creature appears on screen with a name and a happy expression
2. Three stat bars (hunger, happiness, energy) all start full
3. Three buttons: Feed, Play, Sleep
4. Over time, stat bars gradually decrease
5. Click any button — the corresponding stat increases and the
   creature reacts visually

## Verify It Works

- [ ] Creature displays with happy mood on first load
- [ ] Clicking "Feed" increases the hunger bar
- [ ] Clicking "Play" increases the happiness bar
- [ ] Clicking "Sleep" increases the energy bar
- [ ] Stats decrease over time without interaction
- [ ] Creature mood changes as stats drop (happy → neutral → sad → distressed)
- [ ] Stats never go below 0 or above 100
- [ ] Creature never disappears, even at 0 stats

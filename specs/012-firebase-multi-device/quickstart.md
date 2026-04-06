# Quickstart: Firebase Multi-Device Sync

## Prerequisites

- Node.js 18+
- A Firebase project (Spark/free tier)
- Firebase project config (apiKey, authDomain, projectId, etc.)

## Firebase Setup

1. Go to https://console.firebase.google.com
2. Create a new project (e.g., "terragucci")
3. Enable Authentication → Email/Password sign-in method
4. Enable Cloud Firestore → Start in test mode (update rules later)
5. Copy the Firebase config from Project Settings → Your Apps → Web

## Local Setup

```bash
npm install
npm install firebase
npm run dev
```

Create `src/firebase/config.ts` with your Firebase config.

## Verify It Works

### Parent Flow (Device 1)
- [ ] Open app → "Create Family" → sign up with email
- [ ] Family code appears (e.g., "GUC7X3")
- [ ] Enter Parent Mode → add chores for Morning/Afternoon/Evening
- [ ] Create a reward present in the Rewards tab

### Child Flow (Device 2)
- [ ] Open app → "Join Family" → enter the code
- [ ] Create creature (type → name)
- [ ] See the chores the parent added
- [ ] Check off a chore → shows as "pending"

### Cross-Device Sync
- [ ] Parent sees the pending chore on Device 1 within 5 seconds
- [ ] Parent approves the chore
- [ ] Child sees points + coins increase on Device 2 within 5 seconds
- [ ] Parent gives a bonus → child sees notification on Device 2

### Offline
- [ ] Child goes offline (airplane mode)
- [ ] Child checks off a chore → works locally
- [ ] Child goes back online → chore syncs to parent's view

# Quickstart: Spin Wheel Mini Game

## Scenario 1: Full Happy Path (Accept Game, Win Coins)

1. Open the fullscreen pet view by tapping the creature
2. Wait for the greeting bubble ("Good Morning, [name]!")
3. Wait 3 seconds — verify a second bubble appears: "Want to play a game?" with "Yes!" and "No thanks" buttons
4. Tap "Yes!"
5. Verify: A colorful spinning wheel appears with 8 labeled segments
6. Tap "Spin!"
7. Verify: Wheel spins smoothly and decelerates over 3-5 seconds
8. Verify: Wheel stops on a segment, result is highlighted
9. If coin prize: Verify coin balance increased by the prize amount
10. Tap "Collect!" to dismiss
11. Verify: Returns to fullscreen pet view (no game prompt reappears)

## Scenario 2: Decline Game

1. Open fullscreen pet view
2. Wait for greeting, then game prompt
3. Tap "No thanks"
4. Verify: Prompt disappears, fullscreen view continues with wandering creature
5. Verify: Game prompt does NOT reappear during this session

## Scenario 3: Win Kindness Challenge

1. Open fullscreen view, accept game, spin wheel
2. If wheel lands on a kindness challenge (e.g., "Be Kind!")
3. Verify: Pet displays an encouraging message (e.g., "Go say something kind to someone!")
4. Verify: Coin balance is unchanged
5. Tap "Collect!" to dismiss

## Scenario 4: Win Coin Penalty

1. Note current coin balance (e.g., 50 coins)
2. Open fullscreen view, accept game, spin wheel
3. If wheel lands on "-10 coins"
4. Verify: Pet displays playful message ("Oh no! You lost 10 coins!")
5. Verify: Coin balance decreased by 10 (now 40)
6. Tap "Collect!" to dismiss

## Scenario 5: Penalty with Low Balance

1. Ensure child has 3 coins
2. Open fullscreen view, accept game, spin wheel
3. If wheel lands on "-10 coins"
4. Verify: Coin balance becomes 0 (NOT negative)
5. Verify: Playful message still shows

## Scenario 6: One Play Per Session

1. Open fullscreen view, play the game (accept + spin + collect)
2. Close fullscreen view
3. Reopen fullscreen view
4. Verify: After greeting, game prompt appears again (new session)
5. Play again — verify it works

## Scenario 7: Close During Spin

1. Open fullscreen view, accept game, tap "Spin!"
2. While wheel is still spinning, tap the close button (X)
3. Verify: Fullscreen view closes, no coins awarded/deducted
4. Reopen fullscreen view
5. Verify: Game prompt appears again (previous spin was cancelled)

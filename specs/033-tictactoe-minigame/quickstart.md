# Quickstart Test Scenarios: Tic-Tac-Toe Mini Game

## Scenario 1: Random Game Selection

1. Open fullscreen pet view (tap pet area)
2. Wait for greeting, then game prompt
3. Tap "Yes!"
4. Note which game appears (spin wheel or tic-tac-toe)
5. Close and repeat ~10 times
6. **Expected**: Both games appear across sessions (roughly 50/50)

## Scenario 2: Child Wins Tic-Tac-Toe

1. Get tic-tac-toe selected
2. Play strategically to win (get 3 X's in a row)
3. **Expected**: Game announces "You won!" with coin reward between 30-75
4. Tap "Collect!"
5. **Expected**: Coins are added to balance, returns to fullscreen view with "See you later!" message

## Scenario 3: Pet Wins Tic-Tac-Toe

1. Get tic-tac-toe selected
2. Play poorly (let pet get 3 O's in a row)
3. **Expected**: Game shows encouraging message from pet (e.g., "Good try!")
4. Tap "OK"
5. **Expected**: No coin change, returns to fullscreen view

## Scenario 4: Draw Game

1. Get tic-tac-toe selected
2. Play to a draw (fill all 9 cells with no winner)
3. **Expected**: Game shows draw message (e.g., "A tie! You're getting good!")
4. Tap "OK"
5. **Expected**: No coin change, returns to fullscreen view

## Scenario 5: Tap Occupied Cell

1. Start tic-tac-toe game
2. Place an X in a cell
3. Tap the same cell again
4. **Expected**: Nothing happens — cell is already occupied, no error shown

## Scenario 6: Close During Game

1. Start tic-tac-toe game, make a few moves
2. Tap the close (X) button on the overlay
3. **Expected**: Overlay closes, no coins awarded
4. Reopen fullscreen view
5. **Expected**: Fresh greeting → game prompt cycle (no resumed game)

## Scenario 7: Coin Cap on Win

1. Set coin balance near maximum (e.g., MAX_COINS - 10)
2. Win tic-tac-toe (reward would be 30-75)
3. **Expected**: Coins are capped at MAX_COINS, not exceeded

## Scenario 8: Pet Thinking Delay

1. Start tic-tac-toe game
2. Place an X
3. **Expected**: Brief pause (~0.8s) before pet places O
4. Try tapping another cell during the delay
5. **Expected**: Tap is ignored until pet finishes its move

## Scenario 9: Decline Game

1. Open fullscreen pet view
2. Wait for game prompt
3. Tap "No thanks"
4. **Expected**: Same behavior as before — prompt disappears, creature wanders, "See you later!" message

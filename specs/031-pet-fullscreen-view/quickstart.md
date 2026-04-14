# Quickstart: Pet Fullscreen Interactive View

## Scenario 1: Open Fullscreen View (New Profile with Habitat)

1. Create a new profile with child name "Emma" and creature "Sparkles" (any creature type)
2. In the game, purchase and equip a habitat from the Store
3. Tap the creature on the main game screen
4. Verify: A fullscreen view opens covering the entire screen
5. Verify: The equipped habitat is shown as the full background
6. Verify: The creature (Sparkles) is visible and wandering/drifting around
7. Verify: A speech bubble appears with a time-appropriate greeting (e.g., "Good Morning, Emma!")
8. Tap the close/back button
9. Verify: Returns to the main game screen with everything intact

## Scenario 2: Open Fullscreen View (No Habitat)

1. Use a profile that has no habitat equipped (default state)
2. Tap the creature on the main game screen
3. Verify: Fullscreen view opens with a default background (no broken image)
4. Verify: Creature is visible and animating
5. Verify: Speech bubble greeting still appears correctly

## Scenario 3: Greeting Uses Correct Name

1. Profile with childName "Max" and creatureName "Ziggy"
2. Open fullscreen view
3. Verify: Greeting says "Good [TimeOfDay], Max!" (uses childName)

4. Load an older profile with no childName set (childName is null)
5. Open fullscreen view
6. Verify: Greeting says "Good [TimeOfDay], [creatureName]!" (falls back to creature name)

## Scenario 4: Time-of-Day Greetings

1. Open fullscreen view in the morning (5 AM - 11:59 AM)
2. Verify: "Good Morning, [name]!"

3. Open fullscreen view in the afternoon (12 PM - 4:59 PM)
4. Verify: "Good Afternoon, [name]!"

5. Open fullscreen view in the evening (5 PM - 4:59 AM)
6. Verify: "Good Evening, [name]!"

## Scenario 5: Creature Wandering Animation

1. Open fullscreen view
2. Observe the creature for 5-10 seconds
3. Verify: The creature moves/drifts to different positions on screen
4. Verify: Movement feels smooth and natural (no jerky jumps)

## Scenario 6: Rapid Open/Close

1. Tap creature to open fullscreen view
2. Immediately tap close
3. Tap creature again to reopen
4. Verify: No visual glitches, broken animations, or stuck states

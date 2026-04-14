# Feature Specification: Spin Wheel Mini Game

**Feature Branch**: `032-spin-wheel-minigame`
**Created**: 2026-04-10
**Status**: Draft
**Input**: User description: "Create the concept of a mini game that can be played from the fullscreen overlay of the pet. After the first speech bubble the pet will ask the kid a question 'do you want to play a game?' The child can press Yes or No. If yes the mini game will pop in like a spinning wheel that has possible prizes wherever the wheel stops at."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Pet Invites Child to Play (Priority: P1)

After the initial time-of-day greeting in the fullscreen pet view, the pet asks the child "Want to play a game?" via a second speech bubble. Two buttons appear: "Yes!" and "No thanks." If the child taps "No thanks," the prompt disappears and the child continues enjoying the fullscreen view. If the child taps "Yes!", the spinning prize wheel appears.

**Why this priority**: This is the entry point to the mini game. Without the invitation flow, the child cannot access the wheel.

**Independent Test**: Open the fullscreen pet view. Wait for the greeting bubble. Verify a second bubble appears asking to play. Tap "No thanks" and verify the prompt disappears. Reopen the fullscreen view and tap "Yes!" to verify the wheel appears.

**Acceptance Scenarios**:

1. **Given** the fullscreen pet view is open and the greeting bubble has appeared, **When** 2-3 seconds pass, **Then** a second speech bubble appears asking "Want to play a game?" with "Yes!" and "No thanks" buttons.
2. **Given** the "play a game" prompt is showing, **When** the child taps "No thanks," **Then** the prompt disappears and the fullscreen view remains with the wandering creature.
3. **Given** the "play a game" prompt is showing, **When** the child taps "Yes!," **Then** the spinning prize wheel appears on screen.

---

### User Story 2 - Spin the Prize Wheel (Priority: P2)

When the child accepts the game invitation, a colorful prize wheel appears with multiple segments showing different prizes. The child taps a "Spin!" button to start the wheel spinning. The wheel gradually slows down and stops on a random prize. A celebratory result is shown announcing what the child won.

**Why this priority**: This is the core game mechanic — the wheel must spin, stop, and award a prize for the mini game to deliver value.

**Independent Test**: Accept the game invitation. Verify the wheel appears with visible prize segments. Tap "Spin!" and verify the wheel animates (spins and slows). Verify the wheel stops on a segment and the prize is announced.

**Acceptance Scenarios**:

1. **Given** the child tapped "Yes!" on the game prompt, **When** the wheel appears, **Then** it displays 6-8 colored segments each showing a label. Segments include a mix of: coin prizes (e.g., "+5 coins," "+10 coins," "+20 coins"), kindness challenges (e.g., "Say something kind to someone," "Give someone a hug"), and coin penalties (e.g., "Lose 10 coins").
2. **Given** the wheel is displayed, **When** the child taps the "Spin!" button, **Then** the wheel begins spinning with a smooth rotation animation.
3. **Given** the wheel is spinning, **When** it slows to a stop (over 3-5 seconds), **Then** it lands on a random segment and the result is clearly highlighted.
4. **Given** the wheel has stopped, **When** the prize is determined, **Then** a celebratory announcement appears showing the prize (e.g., "You won +10 coins!") and the prize is awarded to the child's profile.

---

### User Story 3 - Wheel Outcomes Are Applied (Priority: P3)

The wheel has three types of outcomes that are each handled differently:

1. **Coin prizes** (e.g., "+10 coins") — coins are immediately added to the child's balance.
2. **Kindness challenges** (e.g., "Say something kind to someone," "Give someone a hug") — a fun message is displayed encouraging the child to complete the action. No coins are added or removed. The challenge is displayed as a feel-good moment — no tracking of whether the child actually does it.
3. **Coin penalties** (e.g., "Lose 10 coins") — coins are immediately deducted from the child's balance (minimum 0, never goes negative).

After the result is shown, the child can close the mini game and return to the fullscreen pet view or the main game.

**Why this priority**: The variety of outcomes makes the wheel exciting and unpredictable. Coin prizes reward, challenges encourage kindness, and penalties add stakes — all contributing to a fun and meaningful experience.

**Independent Test**: Spin the wheel multiple times across sessions. Verify coin prizes increase balance, penalties decrease balance (not below 0), and challenges show an encouraging message without changing coins. Verify the child can dismiss results and return to the game.

**Acceptance Scenarios**:

1. **Given** the wheel stopped on a coin prize (e.g., "+10 coins"), **When** the prize is awarded, **Then** the child's coin balance increases by that amount (capped at the existing maximum).
2. **Given** the wheel stopped on a kindness challenge (e.g., "Say something kind to someone"), **When** the result is shown, **Then** the pet displays an encouraging message (e.g., "Your pet says: Go say something kind to someone! It'll make their day!") and no coins are added or removed.
3. **Given** the wheel stopped on a coin penalty (e.g., "Lose 10 coins"), **When** the penalty is applied, **Then** the child's coin balance decreases by that amount (minimum 0 — never goes negative). The pet displays a playful message (e.g., "Oh no! You lost 10 coins! Better luck next time!").
4. **Given** the child has fewer coins than the penalty amount (e.g., 3 coins and "Lose 10 coins"), **When** the penalty is applied, **Then** the balance is set to 0 (not negative).
5. **Given** the prize or outcome has been announced, **When** the child taps a "Collect!" or close button, **Then** the mini game closes and the child returns to the fullscreen pet view.

---

### Edge Cases

- What happens if the child has already played the mini game during this fullscreen session? The game prompt only appears once per fullscreen session — reopening the fullscreen view allows a new game.
- What happens if the child's coins are already at the maximum? Coins are capped at the maximum; excess coins are not awarded but the child still sees the celebration.
- What happens if a penalty lands when the child has 0 coins? Balance stays at 0. The playful "Oh no!" message still appears — no special handling needed.
- What happens if the child closes the fullscreen view while the wheel is spinning? The spin is cancelled; no prize is awarded. The child can play again next time they open the fullscreen view.
- What happens if the child rapidly taps "Spin!" multiple times? The spin button is disabled after the first tap until the wheel stops and the result is collected.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: After the initial greeting bubble in the fullscreen pet view, the pet MUST display a second speech bubble asking "Want to play a game?" with "Yes!" and "No thanks" response buttons.
- **FR-002**: The game prompt MUST appear after a short delay (2-3 seconds) following the greeting bubble to feel like a natural conversation.
- **FR-003**: Tapping "No thanks" MUST dismiss the prompt and allow the child to continue in the fullscreen view without interruption.
- **FR-004**: Tapping "Yes!" MUST display a spinning prize wheel with 6-8 distinct colored segments, each labeled with a prize.
- **FR-005**: The wheel MUST have a visible "Spin!" button that the child taps to start the spin.
- **FR-006**: The wheel MUST animate with a smooth spinning motion that gradually decelerates over 3-5 seconds before stopping.
- **FR-007**: The landing segment MUST be randomly determined with each segment having a defined probability (common prizes more likely, rare prizes less likely).
- **FR-008**: When the wheel stops, the winning segment MUST be visually highlighted and a celebratory result message MUST appear.
- **FR-009**: Coin prizes MUST be immediately added to the child's coin balance (respecting the existing maximum cap).
- **FR-013**: Kindness challenge segments MUST display an encouraging message from the pet without changing the coin balance.
- **FR-014**: Coin penalty segments MUST immediately deduct coins from the child's balance, with a floor of 0 (balance MUST NOT go negative).
- **FR-010**: After collecting the prize, the child MUST be able to dismiss the result and return to the fullscreen pet view.
- **FR-011**: The game prompt MUST only appear once per fullscreen session — if the child already played or declined, it does not re-appear until the next time they open the fullscreen view.
- **FR-012**: The "Spin!" button MUST be disabled while the wheel is spinning to prevent multiple simultaneous spins.

### Key Entities

- **Prize Wheel**: A visual wheel with 6-8 segments. Each segment has a label, color, prize value, and probability weight. No persistence needed — the wheel configuration is static.
- **Prize Segment**: Represents one slice of the wheel. Attributes: display label (e.g., "+10 coins"), outcome type (coin-prize, kindness-challenge, or coin-penalty), coin amount (positive for prizes, negative for penalties, zero for challenges), display message (shown by the pet after landing), probability weight (relative likelihood of landing).
- **Spin Result**: The outcome of a single spin. Attributes: winning segment, prize awarded. Transient — not stored beyond the current session.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: The game invitation appears within 5 seconds of the fullscreen view opening (after greeting).
- **SC-002**: The wheel spin animation completes in 3-5 seconds with visually smooth deceleration.
- **SC-003**: Prize is awarded and reflected in the child's coin balance within 1 second of the wheel stopping.
- **SC-004**: 100% of spins result in a valid prize — no blank or error outcomes.
- **SC-005**: The wheel renders and is interactive on screens from 320px to 430px wide without overflow.

## Assumptions

- The fullscreen pet view (feature 031) is already implemented and provides the context for this mini game.
- Coin prize values are small amounts (1-20 coins) and coin penalty values are small deductions (5-10 coins) to maintain game economy balance — parents do not need to configure segments.
- The prize wheel configuration (segments, colors, probabilities, messages) is hardcoded and does not need to be configurable by parents.
- There is no daily limit on how many times a child can play — they can play once each time they open the fullscreen view.
- Kindness challenges are aspirational prompts — there is no mechanism to verify whether the child completed the action. They serve as positive reinforcement.
- Coin penalties are framed playfully (not punitively) to keep the experience fun and age-appropriate.
- Sound effects are out of scope for v1 — visual feedback only.
- The wheel's random outcome is determined client-side; no server-side fairness verification is needed for a kids' game.

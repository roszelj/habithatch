# Feature Specification: Trivia Time Mini Game

**Feature Branch**: `036-trivia-minigame`
**Created**: 2026-04-11
**Status**: Draft
**Input**: User description: "Create another new mini game to be played called 'Trivia Time' — 30 fun trivia questions, 3 randomized out of the 30 question total to be asked to the kid"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Kid Plays Trivia Time (Priority: P1)

A kid taps on their pet to open the fullscreen view. When a mini game is selected, "Trivia Time" may be randomly chosen. The kid sees a fun trivia quiz with 3 multiple-choice questions drawn randomly from a pool of 30. For each question, the kid picks one of 4 answer options. After answering all 3 questions, the kid sees their score and earns coins based on how many they got right.

**Why this priority**: This is the core gameplay experience — without the trivia quiz itself, there is no feature.

**Independent Test**: Open pet fullscreen, trigger Trivia Time, answer 3 questions, see score and coin reward.

**Acceptance Scenarios**:

1. **Given** Trivia Time is selected as the mini game, **When** the game starts, **Then** 3 questions are randomly chosen from the pool of 30 with no duplicates in a single session.
2. **Given** a trivia question is displayed, **When** the kid taps an answer, **Then** the selected answer is visually highlighted and the correct answer is revealed (green for correct, red for wrong).
3. **Given** the kid answers a question, **When** they see the result, **Then** after a brief delay a "Next" button appears to advance to the next question (or see final results if it was the last question).
4. **Given** the kid has answered all 3 questions, **When** the results screen appears, **Then** they see their score (e.g., "2 out of 3") and the coin reward earned.
5. **Given** the kid gets 0 correct, **When** results are shown, **Then** they earn 0 coins but see an encouraging message.
6. **Given** the kid gets all 3 correct, **When** results are shown, **Then** they earn the maximum coin reward and see a celebratory message.

---

### User Story 2 - Trivia Integrated into Mini Game Rotation (Priority: P2)

Trivia Time is added to the existing mini game selection pool alongside Spin Wheel and Tic-Tac-Toe. When the kid opens the fullscreen pet view and a mini game is chosen, Trivia Time has an equal chance of being selected.

**Why this priority**: Without integration, the game exists in isolation. This connects it to the existing game flow.

**Independent Test**: Open pet fullscreen multiple times and verify Trivia Time appears as one of the possible mini games alongside Spin Wheel and Tic-Tac-Toe.

**Acceptance Scenarios**:

1. **Given** the kid opens the pet fullscreen view, **When** a mini game is randomly selected, **Then** Trivia Time has roughly equal probability of being chosen as the other mini games.
2. **Given** Trivia Time is selected, **When** the game finishes with a coin reward, **Then** the coins are awarded to the kid's profile using the existing coin award mechanism.

---

### Edge Cases

- What happens if the kid closes the trivia game mid-question? The game ends with no reward — no partial credit.
- What happens if the same kid plays Trivia Time multiple times in a row? Each session draws a fresh random set of 3 from the 30-question pool. They may see repeat questions across sessions, but never within the same session.
- What happens if a question's text is very long? Questions are kept concise and appropriate for kids aged 5-12. The UI handles text wrapping gracefully.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST provide a pool of 30 fun, kid-friendly trivia questions covering a variety of topics (animals, science, geography, history, food, pop culture, etc.).
- **FR-002**: Each trivia question MUST have exactly 4 answer options with exactly 1 correct answer.
- **FR-003**: System MUST randomly select 3 questions from the pool per game session with no duplicates within the session.
- **FR-004**: System MUST display questions one at a time with 4 tappable answer buttons.
- **FR-005**: System MUST reveal the correct answer after the kid selects an option — correct answers highlighted in green, incorrect selections highlighted in red.
- **FR-006**: System MUST show a "Next" button after each answer is revealed to advance to the next question.
- **FR-007**: System MUST display a results screen after all 3 questions showing the score (X out of 3) and coins earned.
- **FR-008**: System MUST award coins based on correct answers: 1 coin per correct answer (0-3 coins total per game).
- **FR-009**: System MUST display an encouraging message regardless of score (e.g., "Great try!" for 0, "Nice job!" for 1-2, "Perfect score!" for 3).
- **FR-010**: System MUST integrate Trivia Time into the existing mini game random selection alongside Spin Wheel and Tic-Tac-Toe.
- **FR-011**: System MUST shuffle the order of the 4 answer options for each question each time it is displayed so the correct answer is not always in the same position.

### Key Entities

- **TriviaQuestion**: A question with display text, 4 answer options, and an indicator of which option is correct. Covers kid-friendly topics.
- **TriviaResult**: The outcome of a trivia session — number of correct answers out of 3, used to determine coin reward.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Kids can complete a full 3-question trivia game in under 90 seconds.
- **SC-002**: Each trivia session presents exactly 3 unique questions from the 30-question pool.
- **SC-003**: Trivia Time appears as a selectable mini game with roughly equal probability to existing games.
- **SC-004**: 100% of trivia questions are appropriate for kids aged 5-12 (no violence, no mature themes, no trick questions).
- **SC-005**: Coins are correctly awarded based on the number of correct answers (0-3 coins).

## Assumptions

- Questions are static and hard-coded in the app — no external API or dynamic question loading needed.
- Questions are written in English and targeted at kids aged 5-12 (elementary school level).
- The existing mini game selection mechanism (`pickMiniGame()`) will be extended to include Trivia Time.
- Coin rewards follow the same pattern as other mini games — awarded via the existing `onAwardCoins` callback.
- The trivia game UI follows the same visual style as existing mini games (dark overlay, centered content, consistent button styling).
- No timer pressure — kids can take as long as they want per question.

export interface TriviaQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  category: string;
}

export interface TriviaResult {
  score: number;
  total: number;
}

export const TRIVIA_QUESTIONS: TriviaQuestion[] = [
  { id: 1, question: 'What is the largest animal on Earth?', options: ['Elephant', 'Blue Whale', 'Giraffe', 'Great White Shark'], correctIndex: 1, category: 'Animals' },
  { id: 2, question: 'How many legs does a spider have?', options: ['6', '8', '10', '4'], correctIndex: 1, category: 'Animals' },
  { id: 3, question: 'What planet is known as the Red Planet?', options: ['Venus', 'Jupiter', 'Mars', 'Saturn'], correctIndex: 2, category: 'Science' },
  { id: 4, question: 'What is the hardest natural substance on Earth?', options: ['Gold', 'Iron', 'Diamond', 'Quartz'], correctIndex: 2, category: 'Science' },
  { id: 5, question: 'How many continents are there?', options: ['5', '6', '7', '8'], correctIndex: 2, category: 'Geography' },
  { id: 6, question: 'What ocean is the largest?', options: ['Atlantic', 'Indian', 'Arctic', 'Pacific'], correctIndex: 3, category: 'Geography' },
  { id: 7, question: 'What gas do plants breathe in?', options: ['Oxygen', 'Nitrogen', 'Carbon Dioxide', 'Helium'], correctIndex: 2, category: 'Science' },
  { id: 8, question: 'What is a baby frog called?', options: ['Cub', 'Tadpole', 'Froglet', 'Pup'], correctIndex: 1, category: 'Animals' },
  { id: 9, question: 'Which country is shaped like a boot?', options: ['France', 'Spain', 'Italy', 'Greece'], correctIndex: 2, category: 'Geography' },
  { id: 10, question: 'How many colors are in a rainbow?', options: ['5', '6', '7', '8'], correctIndex: 2, category: 'Science' },
  { id: 11, question: 'What is the fastest land animal?', options: ['Lion', 'Cheetah', 'Horse', 'Gazelle'], correctIndex: 1, category: 'Animals' },
  { id: 12, question: 'What fruit do raisins come from?', options: ['Plums', 'Dates', 'Grapes', 'Figs'], correctIndex: 2, category: 'Food' },
  { id: 13, question: 'How many bones does an adult human have?', options: ['106', '156', '206', '256'], correctIndex: 2, category: 'Science' },
  { id: 14, question: 'What is the tallest animal in the world?', options: ['Elephant', 'Giraffe', 'Camel', 'Ostrich'], correctIndex: 1, category: 'Animals' },
  { id: 15, question: 'Which planet has the most moons?', options: ['Jupiter', 'Saturn', 'Uranus', 'Neptune'], correctIndex: 1, category: 'Science' },
  { id: 16, question: 'What vegetable makes you cry when you cut it?', options: ['Pepper', 'Garlic', 'Onion', 'Potato'], correctIndex: 2, category: 'Food' },
  { id: 17, question: 'What is the largest desert in the world?', options: ['Sahara', 'Gobi', 'Antarctic', 'Arabian'], correctIndex: 0, category: 'Geography' },
  { id: 18, question: 'How many teeth does an adult human usually have?', options: ['28', '30', '32', '34'], correctIndex: 2, category: 'Science' },
  { id: 19, question: 'What animal is known as the King of the Jungle?', options: ['Tiger', 'Lion', 'Gorilla', 'Bear'], correctIndex: 1, category: 'Animals' },
  { id: 20, question: 'What language has the most speakers in the world?', options: ['English', 'Spanish', 'Hindi', 'Mandarin Chinese'], correctIndex: 3, category: 'History' },
  { id: 21, question: 'What is the smallest planet in our solar system?', options: ['Mars', 'Venus', 'Mercury', 'Pluto'], correctIndex: 2, category: 'Science' },
  { id: 22, question: 'What do bees make?', options: ['Milk', 'Honey', 'Sugar', 'Wax'], correctIndex: 1, category: 'Animals' },
  { id: 23, question: 'Which bird is the fastest?', options: ['Eagle', 'Falcon', 'Hawk', 'Peregrine Falcon'], correctIndex: 3, category: 'Animals' },
  { id: 24, question: 'What is the main ingredient in guacamole?', options: ['Tomato', 'Avocado', 'Lime', 'Pepper'], correctIndex: 1, category: 'Food' },
  { id: 25, question: 'How many sides does a hexagon have?', options: ['5', '6', '7', '8'], correctIndex: 1, category: 'Science' },
  { id: 26, question: 'What country gave us pizza?', options: ['France', 'Italy', 'Spain', 'Greece'], correctIndex: 1, category: 'Food' },
  { id: 27, question: 'What is the longest river in the world?', options: ['Amazon', 'Nile', 'Mississippi', 'Yangtze'], correctIndex: 1, category: 'Geography' },
  { id: 28, question: 'What is the largest organ in the human body?', options: ['Heart', 'Brain', 'Liver', 'Skin'], correctIndex: 3, category: 'Science' },
  { id: 29, question: 'Which animal can sleep for up to 3 years?', options: ['Bear', 'Snail', 'Sloth', 'Turtle'], correctIndex: 1, category: 'Animals' },
  { id: 30, question: 'What is the closest star to Earth?', options: ['Polaris', 'Sirius', 'The Sun', 'Alpha Centauri'], correctIndex: 2, category: 'Science' },
];

/** Pick `count` random questions from the pool with shuffled answer options. */
export function pickTriviaQuestions(count: number): { question: TriviaQuestion; shuffledOptions: string[]; correctShuffledIndex: number }[] {
  const indices = TRIVIA_QUESTIONS.map((_, i) => i);
  // Fisher-Yates shuffle
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }

  return indices.slice(0, count).map(idx => {
    const q = TRIVIA_QUESTIONS[idx];
    // Shuffle answer options
    const optionIndices = [0, 1, 2, 3];
    for (let i = optionIndices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [optionIndices[i], optionIndices[j]] = [optionIndices[j], optionIndices[i]];
    }
    const shuffledOptions = optionIndices.map(i => q.options[i]);
    const correctShuffledIndex = optionIndices.indexOf(q.correctIndex);
    return { question: q, shuffledOptions, correctShuffledIndex };
  });
}

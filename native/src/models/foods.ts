export interface FoodItem {
  id: string;
  name: string;
  emoji: string;
  messages: string[];
}

export const FOOD_ITEMS: FoodItem[] = [
  {
    id: 'eggs',
    name: 'Eggs',
    emoji: '\u{1F373}',
    messages: ['Eggs-cellent breakfast!', 'Sunny side up, yum!', 'Scrambled perfection!'],
  },
  {
    id: 'pancakes',
    name: 'Pancakes',
    emoji: '\u{1F95E}',
    messages: ['I love pancakes!', 'So fluffy and delicious!', 'Stack em up!'],
  },
  {
    id: 'donuts',
    name: 'Donuts',
    emoji: '\u{1F369}',
    messages: ['Donut mind if I do!', 'Sprinkles make everything better!', 'So sweet!'],
  },
  {
    id: 'sandwich',
    name: 'Sandwich',
    emoji: '\u{1F96A}',
    messages: ['What a tasty sandwich!', 'Best sandwich ever!', 'Nom nom nom!'],
  },
  {
    id: 'pizza',
    name: 'Pizza',
    emoji: '\u{1F355}',
    messages: ['Pizza party!', 'Mmm, cheesy!', 'My favorite topping!'],
  },
  {
    id: 'tacos',
    name: 'Tacos',
    emoji: '\u{1F32E}',
    messages: ['Taco bout delicious!', 'Crunchy and yummy!', 'Every day is taco day!'],
  },
  {
    id: 'salad',
    name: 'Salad',
    emoji: '\u{1F957}',
    messages: ['Healthy and tasty!', 'Crunch crunch crunch!', 'Green power!'],
  },
  {
    id: 'icecream',
    name: 'Ice Cream Sundae',
    emoji: '\u{1F368}',
    messages: ['Brain freeze! Worth it!', 'I scream for ice cream!', 'Cherry on top!'],
  },
];

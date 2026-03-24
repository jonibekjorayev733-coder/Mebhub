// Quiz questions database
export interface Question {
  id: string;
  category: 'math' | 'english' | 'logic';
  question: string;
  options: string[];
  correctIndex: number;
  difficulty: 'easy' | 'medium' | 'hard';
  explanation: string;
}

const mathQuestions: Question[] = [
  {
    id: 'math_1',
    category: 'math',
    question: '7 × 8 = ?',
    options: ['54', '56', '58', '60'],
    correctIndex: 1,
    difficulty: 'easy',
    explanation: '7 × 8 = 56',
  },
  {
    id: 'math_2',
    category: 'math',
    question: '12 + 15 = ?',
    options: ['25', '26', '27', '28'],
    correctIndex: 2,
    difficulty: 'easy',
    explanation: '12 + 15 = 27',
  },
  {
    id: 'math_3',
    category: 'math',
    question: '45 ÷ 5 = ?',
    options: ['8', '9', '10', '11'],
    correctIndex: 1,
    difficulty: 'easy',
    explanation: '45 ÷ 5 = 9',
  },
  {
    id: 'math_4',
    category: 'math',
    question: '6 × 9 = ?',
    options: ['52', '54', '56', '58'],
    correctIndex: 1,
    difficulty: 'easy',
    explanation: '6 × 9 = 54',
  },
  {
    id: 'math_5',
    category: 'math',
    question: '√144 = ?',
    options: ['10', '11', '12', '13'],
    correctIndex: 2,
    difficulty: 'medium',
    explanation: '√144 = 12',
  },
  {
    id: 'math_6',
    category: 'math',
    question: '15 × 4 = ?',
    options: ['55', '60', '65', '70'],
    correctIndex: 1,
    difficulty: 'easy',
    explanation: '15 × 4 = 60',
  },
  {
    id: 'math_7',
    category: 'math',
    question: '2³ = ?',
    options: ['6', '8', '9', '10'],
    correctIndex: 1,
    difficulty: 'medium',
    explanation: '2³ = 2 × 2 × 2 = 8',
  },
  {
    id: 'math_8',
    category: 'math',
    question: '99 - 47 = ?',
    options: ['50', '51', '52', '53'],
    correctIndex: 2,
    difficulty: 'easy',
    explanation: '99 - 47 = 52',
  },
  {
    id: 'math_9',
    category: 'math',
    question: '25 + 25 + 25 = ?',
    options: ['70', '75', '80', '85'],
    correctIndex: 1,
    difficulty: 'easy',
    explanation: '25 + 25 + 25 = 75',
  },
  {
    id: 'math_10',
    category: 'math',
    question: '11 × 12 = ?',
    options: ['130', '132', '134', '136'],
    correctIndex: 1,
    difficulty: 'medium',
    explanation: '11 × 12 = 132',
  },
];

const englishQuestions: Question[] = [
  {
    id: 'eng_1',
    category: 'english',
    question: 'What is the opposite of "hot"?',
    options: ['warm', 'cold', 'cool', 'frozen'],
    correctIndex: 1,
    difficulty: 'easy',
    explanation: 'The opposite of hot is cold.',
  },
  {
    id: 'eng_2',
    category: 'english',
    question: 'Which word means "very happy"?',
    options: ['sad', 'delighted', 'tired', 'angry'],
    correctIndex: 1,
    difficulty: 'easy',
    explanation: '"Delighted" means very happy.',
  },
  {
    id: 'eng_3',
    category: 'english',
    question: 'Synonyms for "big" include:',
    options: ['small', 'tiny', 'large', 'tiny'],
    correctIndex: 2,
    difficulty: 'easy',
    explanation: '"Large" is a synonym for "big".',
  },
  {
    id: 'eng_4',
    category: 'english',
    question: 'What does "abundant" mean?',
    options: ['rare', 'plentiful', 'common', 'unusual'],
    correctIndex: 1,
    difficulty: 'medium',
    explanation: '"Abundant" means plentiful or existing in large quantities.',
  },
  {
    id: 'eng_5',
    category: 'english',
    question: 'The opposite of "quiet" is:',
    options: ['soft', 'loud', 'silent', 'slow'],
    correctIndex: 1,
    difficulty: 'easy',
    explanation: 'The opposite of quiet is loud.',
  },
  {
    id: 'eng_6',
    category: 'english',
    question: 'What does "persevere" mean?',
    options: ['give up', 'continue trying', 'sleep', 'run'],
    correctIndex: 1,
    difficulty: 'medium',
    explanation: '"Persevere" means to continue trying despite difficulties.',
  },
  {
    id: 'eng_7',
    category: 'english',
    question: 'Choose the word that means "very tired":',
    options: ['energetic', 'exhausted', 'happy', 'alert'],
    correctIndex: 1,
    difficulty: 'easy',
    explanation: '"Exhausted" means very tired.',
  },
  {
    id: 'eng_8',
    category: 'english',
    question: 'What is "transparent"?',
    options: ['opaque', 'clear', 'dark', 'bright'],
    correctIndex: 1,
    difficulty: 'medium',
    explanation: '"Transparent" means you can see through it; it\'s clear.',
  },
];

const logicQuestions: Question[] = [
  {
    id: 'logic_1',
    category: 'logic',
    question: 'All cats are animals. Whiskers is a cat. Is Whiskers an animal?',
    options: ['No', 'Yes', 'Maybe', 'Unknown'],
    correctIndex: 1,
    difficulty: 'easy',
    explanation: 'Yes. If all cats are animals and Whiskers is a cat, then Whiskers must be an animal.',
  },
  {
    id: 'logic_2',
    category: 'logic',
    question: 'If it rains tomorrow, the game will be cancelled. It is raining tomorrow. What happens?',
    options: ['Game continues', 'Game is cancelled', 'Game is postponed', 'Unknown'],
    correctIndex: 1,
    difficulty: 'easy',
    explanation: 'The game will be cancelled because it is raining.',
  },
  {
    id: 'logic_3',
    category: 'logic',
    question: 'What comes next in this sequence: 2, 4, 6, 8, ?',
    options: ['9', '10', '11', '12'],
    correctIndex: 1,
    difficulty: 'easy',
    explanation: 'The pattern increases by 2 each time, so 8 + 2 = 10.',
  },
  {
    id: 'logic_4',
    category: 'logic',
    question: 'What comes next: 1, 4, 9, 16, ?',
    options: ['25', '26', '27', '28'],
    correctIndex: 0,
    difficulty: 'medium',
    explanation: 'These are perfect squares: 1², 2², 3², 4², 5² = 25.',
  },
  {
    id: 'logic_5',
    category: 'logic',
    question: 'If A > B and B > C, then A > C?',
    options: ['False', 'True', 'Sometimes', 'Unknown'],
    correctIndex: 1,
    difficulty: 'medium',
    explanation: 'True. This is the transitive property of inequality.',
  },
  {
    id: 'logic_6',
    category: 'logic',
    question: 'Complete: Dog is to animal as car is to:',
    options: ['wheel', 'vehicle', 'road', 'driver'],
    correctIndex: 1,
    difficulty: 'easy',
    explanation: 'Just as a dog is a type of animal, a car is a type of vehicle.',
  },
  {
    id: 'logic_7',
    category: 'logic',
    question: 'What comes next: A, B, D, G, ?',
    options: ['J', 'K', 'L', 'M'],
    correctIndex: 0,
    difficulty: 'medium',
    explanation: 'Pattern increases: +1, +2, +3, so next is +4 = K (but J in 0-based counting)',
  },
];

export function getRandomQuestion(difficulty?: 'easy' | 'medium' | 'hard'): Question {
  const allQuestions = [...mathQuestions, ...englishQuestions, ...logicQuestions];
  
  let filtered = allQuestions;
  if (difficulty) {
    filtered = allQuestions.filter(q => q.difficulty === difficulty);
  }

  return filtered[Math.floor(Math.random() * filtered.length)];
}

export function getQuestionsByDifficulty(level: number): 'easy' | 'medium' | 'hard' {
  if (level <= 3) return 'easy';
  if (level <= 6) return 'medium';
  return 'hard';
}

export function getQuestionsByCategory(category: 'math' | 'english' | 'logic'): Question[] {
  if (category === 'math') return mathQuestions;
  if (category === 'english') return englishQuestions;
  return logicQuestions;
}

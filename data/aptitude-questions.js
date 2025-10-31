export const aptitudeCategories = {
  quantitative: {
    name: "Quantitative Aptitude",
    description: "Mathematical reasoning and problem-solving",
    icon: "🧮",
    topics: ["Arithmetic", "Algebra", "Geometry", "Statistics", "Probability", "Number Theory"]
  },
  logical: {
    name: "Logical Reasoning",
    description: "Analytical thinking and pattern recognition",
    icon: "🧩",
    topics: ["Pattern Recognition", "Sequences", "Analogies", "Deductive Reasoning", "Inductive Reasoning", "Critical Thinking"]
  },
  verbal: {
    name: "Verbal Reasoning",
    description: "Language comprehension and communication",
    icon: "📝",
    topics: ["Reading Comprehension", "Grammar", "Vocabulary", "Sentence Completion", "Synonyms", "Antonyms"]
  },
  technical: {
    name: "Technical Aptitude",
    description: "Technical problem-solving and analysis",
    icon: "⚙️",
    topics: ["Data Structures", "Algorithms", "System Design", "Database Concepts", "Networking", "Security"]
  }
};

export const sampleAptitudeQuestions = {
  quantitative: [
    {
      id: 1,
      question: "If a train travels 300 km in 4 hours, what is its average speed?",
      options: [
        "60 km/h",
        "75 km/h",
        "80 km/h",
        "90 km/h"
      ],
      correctAnswer: 1,
      difficulty: "easy",
      category: "Speed and Distance",
      explanation: "Average speed = Total distance / Total time = 300 km / 4 hours = 75 km/h"
    },
    {
      id: 2,
      question: "What is 25% of 200?",
      options: [
        "40",
        "50",
        "60",
        "80"
      ],
      correctAnswer: 1,
      difficulty: "easy",
      category: "Percentage",
      explanation: "25% of 200 = (25/100) × 200 = 0.25 × 200 = 50"
    },
    {
      id: 3,
      question: "If the ratio of boys to girls in a class is 3:2 and there are 30 students, how many boys are there?",
      options: [
        "12",
        "15",
        "18",
        "20"
      ],
      correctAnswer: 2,
      difficulty: "medium",
      category: "Ratio and Proportion",
      explanation: "Total ratio = 3 + 2 = 5. Boys = (3/5) × 30 = 18"
    },
    {
      id: 4,
      question: "What is the probability of getting a head when tossing a fair coin?",
      options: [
        "0.25",
        "0.5",
        "0.75",
        "1.0"
      ],
      correctAnswer: 1,
      difficulty: "easy",
      category: "Probability",
      explanation: "A fair coin has two equally likely outcomes: head or tail. Probability of head = 1/2 = 0.5"
    },
    {
      id: 5,
      question: "If x + y = 10 and x - y = 4, what is the value of x?",
      options: [
        "3",
        "5",
        "7",
        "9"
      ],
      correctAnswer: 2,
      difficulty: "medium",
      category: "Algebra",
      explanation: "Adding the equations: (x + y) + (x - y) = 10 + 4, so 2x = 14, therefore x = 7"
    }
  ],
  logical: [
    {
      id: 1,
      question: "What comes next in the sequence: 2, 4, 8, 16, ?",
      options: [
        "24",
        "32",
        "28",
        "20"
      ],
      correctAnswer: 1,
      difficulty: "easy",
      category: "Number Sequences",
      explanation: "Each number is multiplied by 2: 2×2=4, 4×2=8, 8×2=16, 16×2=32"
    },
    {
      id: 2,
      question: "If all roses are flowers and some flowers are red, which statement is definitely true?",
      options: [
        "All roses are red",
        "Some roses are red",
        "All red things are roses",
        "Some roses might be red"
      ],
      correctAnswer: 3,
      difficulty: "medium",
      category: "Logical Deduction",
      explanation: "Since all roses are flowers and some flowers are red, it's possible that some roses are red, but not guaranteed."
    },
    {
      id: 3,
      question: "Complete the analogy: Book is to Library as Car is to ?",
      options: [
        "Road",
        "Garage",
        "Driver",
        "Engine"
      ],
      correctAnswer: 1,
      difficulty: "easy",
      category: "Analogies",
      explanation: "A book is stored in a library, just as a car is stored in a garage."
    },
    {
      id: 4,
      question: "What is the next number in the series: 1, 1, 2, 3, 5, 8, ?",
      options: [
        "11",
        "12",
        "13",
        "14"
      ],
      correctAnswer: 2,
      difficulty: "medium",
      category: "Fibonacci Sequence",
      explanation: "This is the Fibonacci sequence where each number is the sum of the two preceding ones: 5 + 8 = 13"
    },
    {
      id: 5,
      question: "If A = 1, B = 2, C = 3, what is the value of CAT?",
      options: [
        "24",
        "25",
        "26",
        "27"
      ],
      correctAnswer: 0,
      difficulty: "easy",
      category: "Letter Values",
      explanation: "CAT = C(3) + A(1) + T(20) = 3 + 1 + 20 = 24"
    }
  ],
  verbal: [
    {
      id: 1,
      question: "Choose the word that is most similar in meaning to 'ABUNDANT':",
      options: [
        "Scarce",
        "Plentiful",
        "Rare",
        "Limited"
      ],
      correctAnswer: 1,
      difficulty: "easy",
      category: "Synonyms",
      explanation: "Abundant means existing in large quantities, which is similar to plentiful."
    },
    {
      id: 2,
      question: "What is the opposite of 'TRANSPARENT'?",
      options: [
        "Clear",
        "Opaque",
        "Visible",
        "Bright"
      ],
      correctAnswer: 1,
      difficulty: "easy",
      category: "Antonyms",
      explanation: "Transparent means see-through, so its opposite is opaque (not see-through)."
    },
    {
      id: 3,
      question: "Complete the sentence: 'The manager was _____ with the team's performance.'",
      options: [
        "Satisfied",
        "Disappointed",
        "Pleased",
        "Content"
      ],
      correctAnswer: 2,
      difficulty: "medium",
      category: "Sentence Completion",
      explanation: "The context suggests a positive outcome, and 'pleased' fits best grammatically and contextually."
    },
    {
      id: 4,
      question: "Which word is spelled correctly?",
      options: [
        "Accomodate",
        "Accommodate",
        "Acommodate",
        "Accomadate"
      ],
      correctAnswer: 1,
      difficulty: "easy",
      category: "Spelling",
      explanation: "Accommodate has double 'c' and double 'm'."
    },
    {
      id: 5,
      question: "What is the meaning of 'EPHEMERAL'?",
      options: [
        "Lasting forever",
        "Lasting for a very short time",
        "Very expensive",
        "Very large"
      ],
      correctAnswer: 1,
      difficulty: "hard",
      category: "Vocabulary",
      explanation: "Ephemeral means lasting for a very short time or transient."
    }
  ],
  technical: [
    {
      id: 1,
      question: "What is the time complexity of binary search?",
      options: [
        "O(n)",
        "O(log n)",
        "O(n²)",
        "O(1)"
      ],
      correctAnswer: 1,
      difficulty: "medium",
      category: "Algorithms",
      explanation: "Binary search has O(log n) time complexity because it eliminates half of the search space in each iteration."
    },
    {
      id: 2,
      question: "Which data structure follows LIFO (Last In, First Out) principle?",
      options: [
        "Queue",
        "Stack",
        "Array",
        "Linked List"
      ],
      correctAnswer: 1,
      difficulty: "easy",
      category: "Data Structures",
      explanation: "Stack follows LIFO principle where the last element added is the first one to be removed."
    },
    {
      id: 3,
      question: "What is the primary key in a database?",
      options: [
        "A key that can be null",
        "A unique identifier for each record",
        "A foreign key",
        "A composite key"
      ],
      correctAnswer: 1,
      difficulty: "easy",
      category: "Database",
      explanation: "A primary key is a unique identifier that uniquely identifies each record in a table."
    },
    {
      id: 4,
      question: "What does HTTP stand for?",
      options: [
        "HyperText Transfer Protocol",
        "High Transfer Text Protocol",
        "HyperText Transport Protocol",
        "HyperText Transmission Protocol"
      ],
      correctAnswer: 0,
      difficulty: "easy",
      category: "Networking",
      explanation: "HTTP stands for HyperText Transfer Protocol, the protocol used for web communication."
    },
    {
      id: 5,
      question: "Which sorting algorithm has the best average-case time complexity?",
      options: [
        "Bubble Sort",
        "Selection Sort",
        "Quick Sort",
        "Insertion Sort"
      ],
      correctAnswer: 2,
      difficulty: "medium",
      category: "Algorithms",
      explanation: "Quick Sort has O(n log n) average-case time complexity, which is better than the O(n²) of other options."
    }
  ]
};

// Utility functions for aptitude questions
export const getAptitudeQuestionsByCategory = (category, count = 10) => {
  const questions = sampleAptitudeQuestions[category] || [];
  return getRandomQuestions(questions, count);
};

export const getRandomQuestions = (questions, count = 10) => {
  const shuffled = [...questions].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

export const getQuestionsByDifficulty = (questions, difficulty) => {
  return questions.filter(q => q.difficulty === difficulty);
};

export const getMixedAptitudeQuestions = (categories = ['quantitative', 'logical', 'verbal'], count = 15) => {
  const allQuestions = [];
  
  categories.forEach(category => {
    if (sampleAptitudeQuestions[category]) {
      allQuestions.push(...sampleAptitudeQuestions[category]);
    }
  });
  
  return getRandomQuestions(allQuestions, count);
};

export const getAptitudeStats = (questions, answers) => {
  const stats = {
    total: questions.length,
    correct: 0,
    categoryStats: {},
    difficultyStats: { easy: 0, medium: 0, hard: 0 },
    difficultyCorrect: { easy: 0, medium: 0, hard: 0 }
  };

  questions.forEach((question, index) => {
    const isCorrect = answers[index] === question.correctAnswer;
    if (isCorrect) stats.correct++;

    // Category stats
    if (!stats.categoryStats[question.category]) {
      stats.categoryStats[question.category] = { total: 0, correct: 0 };
    }
    stats.categoryStats[question.category].total++;
    if (isCorrect) {
      stats.categoryStats[question.category].correct++;
    }

    // Difficulty stats
    stats.difficultyStats[question.difficulty]++;
    if (isCorrect) {
      stats.difficultyCorrect[question.difficulty]++;
    }
  });

  return stats;
};

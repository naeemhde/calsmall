export type QuizChoice = {
  id: string;
  text: string;
};

export type QuizQuestion = {
  id: string;
  prompt: string;
  choices: QuizChoice[];
  correctChoiceId: string;
  explanation?: string;
};

export type QuizCategory = {
  slug: string; // URL-safe identifier
  title: string;
  description: string;
  accentHue: number; // for modern themed gradients
};

export const quizCategories: QuizCategory[] = [
  {
    slug: "general",
    title: "General Knowledge",
    description: "A little bit of everything to warm up.",
    accentHue: 260,
  },
  {
    slug: "science",
    title: "Science",
    description: "From physics to biology—fundamentals that shape our world.",
    accentHue: 190,
  },
  {
    slug: "history",
    title: "History",
    description: "Moments, movements, and milestones through time.",
    accentHue: 25,
  },
  {
    slug: "technology",
    title: "Technology",
    description: "Computing, the web, and innovations that power today.",
    accentHue: 140,
  },
];

const q = (id: string, prompt: string, choices: string[], correctIndex: number, explanation?: string): QuizQuestion => {
  const choiceObjs = choices.map((text, idx) => ({ id: `${id}-c${idx + 1}` , text }));
  return {
    id,
    prompt,
    choices: choiceObjs,
    correctChoiceId: choiceObjs[correctIndex].id,
    explanation,
  };
};

export const quizByCategory: Record<string, QuizQuestion[]> = {
  general: [
    q(
      "gen-1",
      "Which planet is known as the Red Planet?",
      ["Earth", "Mars", "Jupiter", "Venus"],
      1,
      "Iron oxide (rust) on Mars gives it a reddish appearance."
    ),
    q(
      "gen-2",
      "How many continents are there on Earth?",
      ["5", "6", "7", "8"],
      2
    ),
    q(
      "gen-3",
      "What is the largest mammal?",
      ["African elephant", "Blue whale", "Giraffe", "Sperm whale"],
      1
    ),
    q(
      "gen-4",
      "Which language has the most native speakers?",
      ["English", "Spanish", "Mandarin Chinese", "Hindi"],
      2
    ),
    q(
      "gen-5",
      "What gas do plants primarily absorb for photosynthesis?",
      ["Oxygen", "Nitrogen", "Carbon dioxide", "Hydrogen"],
      2
    ),
  ],
  science: [
    q(
      "sci-1",
      "What is the chemical symbol for gold?",
      ["G", "Go", "Au", "Ag"],
      2
    ),
    q(
      "sci-2",
      "What particle carries a negative charge?",
      ["Proton", "Neutron", "Electron", "Positron"],
      2
    ),
    q(
      "sci-3",
      "Water boils at what temperature at sea level?",
      ["90°C", "100°C", "110°C", "212°C"],
      1,
      "100°C equals 212°F."
    ),
    q(
      "sci-4",
      "DNA stands for deoxyribonucleic acid. What does RNA stand for?",
      ["Ribonucleic acid", "Ribosomal nucleic acid", "Retro nucleic acid", "Ribo-nucleotide acid"],
      0
    ),
    q(
      "sci-5",
      "Which organelle is known as the powerhouse of the cell?",
      ["Nucleus", "Mitochondrion", "Ribosome", "Chloroplast"],
      1
    ),
  ],
  history: [
    q(
      "his-1",
      "Who was the first President of the United States?",
      ["Thomas Jefferson", "Abraham Lincoln", "George Washington", "John Adams"],
      2
    ),
    q(
      "his-2",
      "In which year did World War II end?",
      ["1943", "1944", "1945", "1946"],
      2
    ),
    q(
      "his-3",
      "The Great Wall is primarily located in which country?",
      ["India", "Mongolia", "China", "Korea"],
      2
    ),
    q(
      "his-4",
      "The Renaissance began in which European country?",
      ["France", "Italy", "Spain", "England"],
      1
    ),
    q(
      "his-5",
      "Who wrote the 'I Have a Dream' speech?",
      ["Malcolm X", "Martin Luther King Jr.", "Nelson Mandela", "Rosa Parks"],
      1
    ),
  ],
  technology: [
    q(
      "tech-1",
      "What does HTTP stand for?",
      [
        "HyperText Transmission Protocol",
        "HyperText Transfer Protocol",
        "HyperTerminal Transfer Program",
        "High Throughput Transfer Protocol",
      ],
      1
    ),
    q(
      "tech-2",
      "Which company developed the React library?",
      ["Google", "Facebook (Meta)", "Microsoft", "Twitter"],
      1
    ),
    q(
      "tech-3",
      "What is the primary language of the web for structure?",
      ["CSS", "JavaScript", "HTML", "SQL"],
      2
    ),
    q(
      "tech-4",
      "Which data structure works on FIFO principle?",
      ["Stack", "Queue", "Tree", "Graph"],
      1
    ),
    q(
      "tech-5",
      "Which version control system is distributed?",
      ["SVN", "Mercurial", "CVS", "Perforce"],
      1
    ),
  ],
};

export function getCategories(): QuizCategory[] {
  return quizCategories;
}

export function getQuestionsForCategory(slug: string): QuizQuestion[] {
  return quizByCategory[slug] ?? [];
}

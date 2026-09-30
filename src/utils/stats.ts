export interface Mistake {
  title: string;
  concept: string;
  time: string;
}

export interface UserStats {
  bugsFixed: number;
  conceptsLearned: number;
  problemsSolved: number;
  streak: number;
  recentMistakes: Mistake[];
  weakConcepts: string[];
}

export const getStats = (): UserStats => {
  const saved = localStorage.getItem('misos_stats');
  if (saved) return JSON.parse(saved);
  return {
    bugsFixed: 24,
    conceptsLearned: 12,
    problemsSolved: 38,
    streak: 5,
    recentMistakes: [
      { title: 'Off-by-one Error', concept: 'List Iteration', time: '2 hours ago' },
      { title: 'Mutable Default Arguments', concept: 'Functions', time: 'Yesterday' },
      { title: 'Variable Shadowing', concept: 'Scope', time: '2 days ago' },
    ],
    weakConcepts: ['List Comprehensions', 'Dictionary Methods']
  };
};

export const addSolvedProblem = (title: string, concept: string, struggled: boolean = false) => {
  const stats = getStats();
  stats.bugsFixed++;
  stats.problemsSolved++;
  
  if (!stats.recentMistakes.find(m => m.title === title)) {
     stats.conceptsLearned++;
  }

  stats.recentMistakes.unshift({ title, concept, time: 'Just now' });
  if (stats.recentMistakes.length > 5) stats.recentMistakes.pop();
  
  if (struggled) {
      if (!stats.weakConcepts.includes(concept)) {
          stats.weakConcepts.push(concept);
          if (stats.weakConcepts.length > 3) stats.weakConcepts.shift();
      }
  } else {
      if (stats.weakConcepts.includes(concept)) {
          stats.weakConcepts = stats.weakConcepts.filter(c => c !== concept);
      }
  }
  
  localStorage.setItem('misos_stats', JSON.stringify(stats));
};

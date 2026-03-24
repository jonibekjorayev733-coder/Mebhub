import { create } from 'zustand';

// Game state management using Zustand
export const useGameStore = create((set) => ({
  // Game state
  gamePhase: 'menu', // menu, playing, quiz, gameover
  health: 100,
  score: 0,
  combo: 0,
  maxCombo: 0,
  level: 1,
  speed: 15,
  maxHealth: 100,

  // Current quiz
  currentQuiz: null,
  quizVisible: false,
  quizTimer: 10,
  selectedAnswer: null,

  // Player position and movement
  playerPosition: { x: 0, y: 2, z: 0 },
  playerRotation: 0,

  // Environmental settings
  currentEnvironment: 'forest', // forest, desert, futuristic
  obstacleCount: 0,

  // Actions
  setGamePhase: (phase) => set({ gamePhase: phase }),
  setHealth: (health) => set({ health: Math.max(0, Math.min(100, health)) }),
  addScore: (points) => set((state) => ({ score: state.score + points })),
  setCombo: (combo) => set({ combo }),
  setMaxCombo: (combo) => set((state) => ({ maxCombo: Math.max(state.maxCombo, combo) })),
  incrementLevel: () => set((state) => ({ level: state.level + 1 })),
  setSpeed: (speed) => set({ speed: Math.min(25, speed) }),
  
  // Quiz actions
  setCurrentQuiz: (quiz) => set({ currentQuiz: quiz }),
  setQuizVisible: (visible) => set({ quizVisible: visible }),
  setQuizTimer: (time) => set({ quizTimer: Math.max(0, time) }),
  setSelectedAnswer: (answer) => set({ selectedAnswer: answer }),
  resetQuizState: () => set({
    quizVisible: false,
    quizTimer: 10,
    selectedAnswer: null,
    currentQuiz: null,
  }),

  // Player actions
  setPlayerPosition: (position) => set({ playerPosition: position }),
  setPlayerRotation: (rotation) => set({ playerRotation: rotation }),

  // Environment actions
  setEnvironment: (env) => set({ currentEnvironment: env }),
  setObstacleCount: (count) => set({ obstacleCount: count }),

  // Reset game
  resetGame: () => set({
    gamePhase: 'menu',
    health: 100,
    score: 0,
    combo: 0,
    maxCombo: 0,
    level: 1,
    speed: 15,
    playerPosition: { x: 0, y: 2, z: 0 },
    playerRotation: 0,
    currentEnvironment: 'forest',
    obstacleCount: 0,
    quizVisible: false,
    selectedAnswer: null,
    currentQuiz: null,
  }),

  // Add damage
  takeDamage: (amount) => set((state) => ({
    health: Math.max(0, state.health - amount),
  })),

  // Heal
  heal: (amount) => set((state) => ({
    health: Math.min(state.maxHealth, state.health + amount),
  })),

  // Correct answer handler
  correctAnswer: () => set((state) => {
    const newCombo = state.combo + 1;
    const scoreBonus = 100 + (newCombo * 10);
    return {
      score: state.score + scoreBonus,
      combo: newCombo,
      maxCombo: Math.max(state.maxCombo, newCombo),
      speed: Math.min(25, state.speed + 0.5),
      quizVisible: false,
      selectedAnswer: null,
    };
  }),

  // Wrong answer handler
  wrongAnswer: () => set((state) => ({
    health: Math.max(0, state.health - 15),
    combo: 0,
    quizVisible: false,
    selectedAnswer: null,
  })),
}));

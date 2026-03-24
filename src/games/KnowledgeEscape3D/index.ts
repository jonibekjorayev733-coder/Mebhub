/**
 * Knowledge Escape 3D Game - Complete Game System
 *
 * This is a fully-featured 3D educational browser game built with React, Three.js, and TypeScript.
 * Players navigate through a 3D world filled with obstacles and must answer quiz questions to progress.
 *
 * Core Systems:
 * 1. Game State Management (Zustand)
 * 2. 3D Rendering (Three.js + React Three Fiber)
 * 3. Player Control & Camera System
 * 4. Obstacle Generation & Collision Detection
 * 5. Quiz Question System
 * 6. Audio & Particle Effects
 * 7. UI & HUD Components
 * 8. Level Generation & Difficulty Scaling
 */

export { KnowledgeEscape3D, default } from './KnowledgeEscape3D';

// Game Core
export { useGameStore } from './gameStore';

// 3D Components
export {
  Environment,
  Ground,
  Tree,
  Rock,
  PalmTree,
  Building,
  Door,
  BrokenBridge,
  LaserBarrier,
  EnemyRobot,
} from './WorldComponents';

// Player & Controls
export { Player, PlayerController, CollisionDetector } from './PlayerController';

// UI Components
export {
  MainMenu,
  HUD,
  QuizModal,
  GameOverScreen,
  FloatingNotification,
  Crosshair,
  LoadingScreen,
  MiniMap,
} from './UI';

// Audio & Effects
export {
  AudioManager,
  ParticleSystem,
  CorrectAnswerEffect,
  WrongAnswerEffect,
  GateOpeningEffect,
} from './AudioParticles';

// Level & Obstacles
export { ObstacleManager, LevelGenerator, useDifficultyScaling } from './LevelGenerator';

// Quiz Data
export {
  getRandomQuestion,
  getQuestionsByDifficulty,
  getQuestionsByCategory,
} from './quizData';

# 🎮 Knowledge Escape 3D - Game Documentation

A high-quality 3D educational browser game where players navigate through a dynamic world filled with obstacles and must answer quiz questions to progress. Built with React, Three.js, and TypeScript.

## 📋 Table of Contents

- [Features](#features)
- [Game Mechanics](#game-mechanics)
- [File Structure](#file-structure)
- [Components Overview](#components-overview)
- [Game Systems](#game-systems)
- [Setup & Installation](#setup--installation)
- [Usage](#usage)
- [Customization](#customization)

## 🌟 Features

### Gameplay
- **3D Environment**: Fully rendered 3D worlds using Three.js
- **Dynamic Obstacles**: Procedurally generated gates, bridges, lasers, and robots
- **Quiz Integration**: Real-time quiz questions triggered by obstacles
- **Multiple Environments**: Forest 🌲, Desert 🏜️, and Futuristic City 🌆 themes
- **Progressive Difficulty**: Game difficulty scales with player level

### Technical
- **State Management**: Zustand for centralized game state
- **Performance Optimized**: Efficient rendering with Three.js and React Three Fiber
- **Responsive UI**: Dynamic HUD with health, score, combo, and level displays
- **Audio System**: Web Audio API for sound effects and background music
- **Particle Effects**: Visual feedback for correct/wrong answers
- **Collision Detection**: Real-time obstacle detection and interaction

## 🎮 Game Mechanics

### Core Loop
1. **Navigation**: Player moves through 3D world using WASD/Arrow keys
2. **Obstacle Encounter**: Walk into obstacles to trigger quiz events
3. **Quiz**: Answer multiple-choice questions correctly to progress
4. **Progression**: Correct answers open gates, increase score, and boost speed
5. **Difficulty Scaling**: Game gets harder as player advances levels

### Player Stats
- **Health**: 0-100 (decreases on wrong answers: -15)
- **Score**: Increased on correct answers (+100 base + combo bonus)
- **Combo**: Consecutive correct answers (max 10, resets on wrong)
- **Speed**: Movement speed multiplier (increases with correct answers)
- **Level**: Current game level (increases every 5 correct answers)

### Obstacles
1. **Locked Door** 🚪: Red door blocking path, requires quiz to open
2. **Broken Bridge** 🌉: Gap in path, must jump or die falling
3. **Laser Barrier** ⚡: Active green lasers, avoid or answer quiz
4. **Enemy Robot** 🤖: Moving obstacle, approach triggers quiz

### Environments
- **Forest**: Trees, rocks, natural lighting
- **Desert**: Palm trees, sand color, bright sunlight
- **Futuristic**: Buildings with lit windows, cyberpunk colors

## 📁 File Structure

```
src/games/KnowledgeEscape3D/
├── KnowledgeEscape3D.tsx          # Main game component
├── index.ts                        # Exports and entry point
├── gameStore.ts                    # Zustand state management
├── quizData.ts                     # Quiz questions database
├── WorldComponents.tsx             # 3D world elements (trees, buildings, obstacles)
├── PlayerController.tsx            # Player character and controls
├── UI.tsx                          # UI components (menus, HUD, modals)
├── UIStyles.css                    # Styling for all UI elements
├── AudioParticles.tsx              # Audio and particle effects
├── LevelGenerator.tsx              # Obstacle and level generation
└── README.md                       # This file
```

## 🏗️ Components Overview

### 1. **gameStore.ts**
Zustand state management store with:
- Game phase tracking (menu, playing, quiz, gameover)
- Player stats (health, score, combo, speed, level)
- Quiz state management
- Game actions (damage, heal, scoring, phase changes)

**Key Methods**:
```typescript
setHealth(value: number)              // Set player health
takeDamage(amount: number)            // Reduce health
addScore(points: number)              // Increase score
correctAnswer()                       // Handle correct quiz answer
wrongAnswer()                         // Handle wrong quiz answer
resetGame()                           // Reset all game state
```

### 2. **quizData.ts**
Quiz question database with:
- 28 questions across 3 categories (Math, English, Logic)
- Difficulty levels: Easy, Medium, Hard
- Adaptive question selection based on player level

**Key Functions**:
```typescript
getRandomQuestion(difficulty?: string)      // Get random question
getQuestionsByDifficulty(level: number)     // Get difficulty for level
getQuestionsByCategory(category: string)    // Get questions by category
```

### 3. **WorldComponents.tsx**
3D world elements:
- `Environment`: Lighting, sky, fog, ground
- `Tree`, `Rock`, `PalmTree`, `Building`: Environment decorations
- `Door`, `BrokenBridge`, `LaserBarrier`, `EnemyRobot`: Obstacles

### 4. **PlayerController.tsx**
Player mechanics:
- `Player`: 3D character model with simple geometry
- `PlayerController`: Input handling (WASD + Space), physics
- `CollisionDetector`: Detects player-obstacle collisions

**Controls**:
- `W / ↑`: Move forward
- `A / ←`: Move left
- `S / ↓`: Move backward
- `D / →`: Move right
- `Space`: Jump

### 5. **UI.tsx**
User interface components:
- `MainMenu`: Start screen
- `HUD`: In-game stats display
- `QuizModal`: Quiz question interface
- `GameOverScreen`: End game results
- `FloatingNotification`: Temporary messages
- `Crosshair`: Center screen indicator
- `MiniMap`: Position indicator

### 6. **UIStyles.css**
Complete styling with:
- Modern gradient designs
- Smooth animations
- Responsive layout
- Glass-morphism effects

### 7. **AudioParticles.tsx**
Audio and visual effects:
- `AudioManager`: Web Audio API integration
- `ParticleSystem`: GPU particle effects
- `CorrectAnswerEffect`: Green success feedback
- `WrongAnswerEffect`: Red failure feedback
- `GateOpeningEffect`: Golden opening animation

### 8. **LevelGenerator.tsx**
Level generation and procedural content:
- `ObstacleManager`: Generates obstacles ahead of player
- `LevelGenerator`: Creates environment elements based on seed
- `useDifficultyScaling`: Dynamic difficulty adjustment

## 🎯 Game Systems

### State Management Flow
```
Game Start
    ↓
Player Movement → Collision Detection
    ↓
Obstacle Encounter → Quiz Display
    ↓
Answer Selection → Feedback & Effects
    ↓
Score Update → Level Check → Environment Change
    ↓
Continue/Game Over
```

### Scoring System
```
Base Points: 100 per correct answer
Combo Bonus: (Combo Count × 10)
Total = Base + Combo Bonus

Examples:
- 1st correct: 100 + 10 = 110 points
- 5th consecutive: 100 + 50 = 150 points
- 10th consecutive: 100 + 100 = 200 points
```

### Difficulty Progression
```
Level 1-3 (Easy)
  └─ Easy questions, slower speed, forgiving health

Level 4-6 (Medium)
  └─ Medium questions, moderate speed, balanced difficulty

Level 7+ (Hard)
  └─ Hard questions, faster speed, challenging gameplay
```

## 🚀 Setup & Installation

### Prerequisites
- Node.js 18+
- npm or yarn
- React 18+

### Installation Steps

1. **Install Dependencies** (if not already done):
```bash
npm install --legacy-peer-deps three @react-three/fiber @react-three/drei @react-three/postprocessing zustand
```

2. **Import Game Component**:
```typescript
import KnowledgeEscape3D from './games/KnowledgeEscape3D';
```

3. **Add to App**:
```typescript
<KnowledgeEscape3D />
```

## 📖 Usage

### Basic Implementation
```typescript
import { KnowledgeEscape3D } from './games/KnowledgeEscape3D';

export default function App() {
  return (
    <div style={{ width: '100%', height: '100vh' }}>
      <KnowledgeEscape3D />
    </div>
  );
}
```

### Accessing Game State
```typescript
import { useGameStore } from './games/KnowledgeEscape3D';

function GameInfo() {
  const { score, health, level } = useGameStore();
  return <div>Score: {score}, Health: {health}, Level: {level}</div>;
}
```

### Custom Quiz Questions
Edit `quizData.ts` to add your own questions:
```typescript
{
  id: 'custom-1',
  category: 'Science',
  question: 'What is the chemical formula for water?',
  options: ['H2O', 'CO2', 'O2', 'H2O2'],
  correctIndex: 0,
  difficulty: 'easy',
  explanation: 'Water is H2O - two hydrogen atoms and one oxygen atom.'
}
```

## 🎨 Customization

### Modify Obstacle Probability
In `LevelGenerator.tsx`, adjust the ranges:
```typescript
if (random < 0.3) {
  // 30% doors
} else if (random < 0.5) {
  // 20% bridges
} else if (random < 0.75) {
  // 25% lasers
} else {
  // 25% robots
}
```

### Change Colors
Update `WorldComponents.tsx`:
```typescript
<meshPhongMaterial color="#your-color-here" />
```

### Adjust Difficulty Scaling
In `gameStore.ts`, modify the multipliers:
```typescript
setSpeed: (value: number) => set({ speed: Math.min(25, value) })
takeDamage: (amount: number) => set(state => ({
  health: Math.max(0, state.health - amount) // Change damage amount
}))
```

### Add New Obstacles
1. Create component in `WorldComponents.tsx`
2. Add to obstacle type enum in `LevelGenerator.tsx`
3. Add rendering case in `ObstacleManager.tsx`

## 🔧 Performance Tips

1. **Optimize Particle Count**: Reduce particle emission in `AudioParticles.tsx`
2. **LOD System**: Use distance-based rendering for far objects
3. **Shadow Optimization**: Adjust `shadow-mapSize` in `WorldComponents.tsx`
4. **Obstacle Pooling**: Reuse obstacle meshes instead of creating new ones

## 📊 Game Balance

### Recommended Tweaks
- **Too Easy**: Increase damage amount or reduce score bonuses
- **Too Hard**: Reduce combo scaling or increase health recovery
- **Slow Progression**: Reduce points needed per level
- **Too Many Obstacles**: Reduce obstacle spacing in `LevelGenerator.tsx`

## 🐛 Debugging

Enable debug mode to see collision boxes:
```typescript
// In PlayerController.tsx, uncomment helper rendering
// <boxHelper args={[playerBox, 0xff0000]} />
```

Check console for:
- Collision detection events
- Quiz triggered events
- State changes
- Performance metrics

## 📝 License

This game is part of the Uz Game educational platform.

## 🤝 Contributing

To extend the game:
1. Add new question types in `quizData.ts`
2. Create new obstacle types in `WorldComponents.tsx`
3. Add new environments in `LevelGenerator.tsx`
4. Enhance particle effects in `AudioParticles.tsx`

---

**Enjoy the game! 🎮✨**

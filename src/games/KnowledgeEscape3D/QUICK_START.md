# 🚀 Quick Start Guide - Knowledge Escape 3D

## 5-Minute Integration

### Option 1: Use Directly in Your App

1. **Create a new page** (e.g., `src/pages/GamePage.tsx`):
```typescript
import KnowledgeEscape3D from '../games/KnowledgeEscape3D';

export default function GamePage() {
  return (
    <div style={{ width: '100%', height: '100vh' }}>
      <KnowledgeEscape3D />
    </div>
  );
}
```

2. **Add route** in your router:
```typescript
import GamePage from './pages/GamePage';

// In your Routes/Router config:
<Route path="/game" element={<GamePage />} />
```

3. **Navigate to the game**:
```
http://localhost:5173/game
```

---

### Option 2: Use as Modal/Popup

1. **Create modal wrapper** (e.g., `src/components/GameModal.tsx`):
```typescript
import React, { useState } from 'react';
import KnowledgeEscape3D from '../games/KnowledgeEscape3D';

export function GameModal() {
  const [isOpen, setIsOpen] = useState(false);

  if (!isOpen) {
    return (
      <button onClick={() => setIsOpen(true)}>
        🎮 Play Knowledge Escape 3D
      </button>
    );
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 1000,
    }}>
      <button
        onClick={() => setIsOpen(false)}
        style={{
          position: 'absolute',
          top: 10,
          right: 10,
          zIndex: 1001,
          padding: '10px 20px',
          background: 'rgba(0,0,0,0.7)',
          color: 'white',
          border: 'none',
          cursor: 'pointer',
          borderRadius: '5px',
        }}
      >
        ✕ Close
      </button>
      <KnowledgeEscape3D />
    </div>
  );
}
```

2. **Use in your main app**:
```typescript
import { GameModal } from './components/GameModal';

export function App() {
  return (
    <div>
      <h1>My Educational Platform</h1>
      <GameModal />
    </div>
  );
}
```

---

### Option 3: Programmatic Control

Access game state anywhere:

```typescript
import { useGameStore } from '../games/KnowledgeEscape3D';

function GameStats() {
  const { score, health, level, gamePhase } = useGameStore();

  return (
    <div>
      <p>Score: {score}</p>
      <p>Health: {health}</p>
      <p>Level: {level}</p>
      <p>Phase: {gamePhase}</p>
    </div>
  );
}
```

---

## Configuration & Customization

### Change Starting Environment
In `gameStore.ts`, modify initialization:
```typescript
environmentType: 'desert' // or 'futuristic'
```

### Adjust Game Difficulty
In `gameStore.ts`:
```typescript
// Make easier
health: 200, // was 100

// Make harder
speed: 10, // was 5
```

### Custom Quiz Questions
In `quizData.ts`, replace the questions array:
```typescript
export const questions: Question[] = [
  {
    id: 'your-id',
    category: 'Your Category',
    question: 'Your question here?',
    options: ['Option A', 'Option B', 'Option C', 'Option D'],
    correctIndex: 0, // Index of correct option
    difficulty: 'easy',
    explanation: 'Explanation of correct answer'
  },
  // Add more questions...
];
```

---

## Keyboard Controls

| Key | Action |
|-----|--------|
| W or ↑ | Move Forward |
| A or ← | Move Left |
| S or ↓ | Move Backward |
| D or → | Move Right |
| Space | Jump |
| A-D (in quiz) | Select answer |

---

## Game States

### Menu
- Welcome screen
- Game description
- Tutorial button
- Play button

### Playing
- 3D game world
- HUD with stats
- Crosshair in center
- Mini-map in corner

### Quiz
- Modal popup with question
- 4 answer options
- 10-second timer
- A/B/C/D shortcuts

### Game Over
- Final score
- Level reached
- Max combo
- Play again button

---

## Debugging & Development

### Enable Debug Logging
Add to `KnowledgeEscape3D.tsx`:
```typescript
useEffect(() => {
  console.log('Game State:', {
    score: useGameStore.getState().score,
    health: useGameStore.getState().health,
    level: useGameStore.getState().level,
  });
}, [gamePhase, health, score]);
```

### Check Performance
Open DevTools → Performance tab:
1. Start recording
2. Play game for 10 seconds
3. Stop recording
4. Check FPS graph (should be 60)

### Test Quiz System
In browser console:
```javascript
// Trigger a quiz manually
KnowledgeEscape3D.getState().setQuizVisible(true);
```

---

## Troubleshooting

### Black Screen
- Check browser console for errors
- Verify canvas element exists
- Ensure GPU acceleration enabled

### No Sound
- Check browser autoplay policy (may require user interaction)
- Look for Web Audio API errors in console
- Try in different browser

### Slow/Choppy
- Close other browser tabs
- Reduce particle count in `AudioParticles.tsx`
- Check GPU usage in DevTools

### Quiz Won't Show
- Verify collision distance (should be ~3 units)
- Check `quizData.ts` has questions
- Look for console errors

---

## File Locations

```
src/games/KnowledgeEscape3D/
├── KnowledgeEscape3D.tsx      ← Main game file
├── gameStore.ts               ← Game state
├── quizData.ts                ← Quiz questions
├── WorldComponents.tsx        ← 3D objects
├── PlayerController.tsx       ← Player control
├── UI.tsx                     ← UI components
├── UIStyles.css               ← Styling
├── AudioParticles.tsx         ← Audio & effects
├── LevelGenerator.tsx         ← Obstacles
├── index.ts                   ← Exports
└── README.md                  ← Full documentation
```

---

## Next Steps

1. ✅ Verify game loads without errors
2. ✅ Test all keyboard controls
3. ✅ Verify quiz appears on collision
4. ✅ Test answer selection
5. ✅ Check score increases
6. ✅ Verify level progression
7. ✅ Test game over condition
8. ✅ Customize quiz questions
9. ✅ Adjust difficulty settings
10. ✅ Deploy to production

---

## Support Resources

- **Full Documentation**: `README.md` in game folder
- **Game Design**: `DELIVERY.md` in game folder
- **State Management**: `gameStore.ts` code comments
- **Component API**: `index.ts` exports

---

## Quick Links

- 🎮 **Play Game**: Navigate to game route
- 📖 **Full Docs**: See `README.md`
- 🎨 **Customize**: Edit `UIStyles.css`
- ❓ **Quiz Data**: Edit `quizData.ts`
- ⚙️ **Settings**: Edit `gameStore.ts`

---

**You're ready to go! 🚀**

Start your app with `npm run dev` and navigate to the game page to begin!

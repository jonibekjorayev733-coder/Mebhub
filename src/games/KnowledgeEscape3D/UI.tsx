import React from 'react';
import { useGameStore } from './gameStore';
import './UIStyles.css';

/**
 * Main menu screen
 */
export const MainMenu: React.FC<{ onStart: () => void }> = ({ onStart }) => {
  return (
    <div className="menu-screen">
      <div className="menu-content">
        <h1 className="game-title">🎮 Knowledge Escape 3D</h1>
        <p className="game-description">An educational 3D adventure game where you must answer quiz questions to progress</p>

        <div className="menu-buttons">
          <button className="menu-button play-button" onClick={onStart}>
            <span>▶ PLAY</span>
          </button>
          <button className="menu-button tutorial-button" onClick={() => alert('Tutorial: Use WASD to move, Space to jump, and answer quiz questions to unlock doors!')}>
            <span>❓ TUTORIAL</span>
          </button>
        </div>

        <div className="menu-footer">
          <p>🌲 Forest | 🏜️ Desert | 🌆 Futuristic City</p>
        </div>
      </div>
    </div>
  );
};

/**
 * In-game HUD
 */
export const HUD: React.FC = () => {
  const { health, maxHealth, score, combo, maxCombo, level, speed } = useGameStore();

  return (
    <div className="hud">
      {/* Top left - Health */}
      <div className="hud-section health-section">
        <div className="stat-label">❤️ HEALTH</div>
        <div className="health-bar">
          <div className="health-fill" style={{ width: `${(health / maxHealth) * 100}%` }}></div>
        </div>
        <div className="stat-value">{Math.floor(health)} / {maxHealth}</div>
      </div>

      {/* Top center - Score */}
      <div className="hud-section score-section">
        <div className="stat-label">⭐ SCORE</div>
        <div className="stat-value score-display">{score}</div>
      </div>

      {/* Top right - Level & Speed */}
      <div className="hud-section level-section">
        <div className="stat-label">📊 LEVEL {level}</div>
        <div className="stat-value">Speed: {speed.toFixed(1)}x</div>
      </div>

      {/* Bottom - Combo */}
      {combo > 0 && (
        <div className="hud-section combo-section">
          <div className="combo-display">
            <span className="combo-label">🔥 COMBO</span>
            <span className="combo-value">{combo} / {maxCombo}</span>
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="instructions">
        <p>WASD/↑↓←→ to move • Space to jump • Answer correctly to progress!</p>
      </div>
    </div>
  );
};

/**
 * Quiz modal screen
 */
export const QuizModal: React.FC<{
  visible: boolean;
  onAnswerSelect: (index: number) => void;
  onClose: () => void;
}> = ({ visible, onAnswerSelect, onClose }) => {
  const { currentQuiz, quizTimer } = useGameStore();

  if (!visible || !currentQuiz) return null;

  return (
    <div className="quiz-overlay">
      <div className="quiz-modal">
        <div className="quiz-header">
          <h2>📝 Knowledge Gate</h2>
          <div className="timer" style={{ color: quizTimer < 3 ? '#ff4444' : '#ffffff' }}>
            ⏱️ {quizTimer}s
          </div>
        </div>

        <div className="quiz-question">
          <p>{currentQuiz.question}</p>
          <div className="difficulty-badge">{currentQuiz.difficulty}</div>
        </div>

        <div className="quiz-options">
          {currentQuiz.options.map((option, index) => (
            <button
              key={index}
              className="quiz-option"
              onClick={() => {
                onAnswerSelect(index);
              }}
            >
              <span className="option-letter">{String.fromCharCode(65 + index)}</span>
              <span className="option-text">{option}</span>
            </button>
          ))}
        </div>

        <div className="quiz-hint">
          💡 Select the correct answer to open the gate and continue your journey
        </div>
      </div>
    </div>
  );
};

/**
 * Game Over screen
 */
export const GameOverScreen: React.FC<{ onRestart: () => void }> = ({ onRestart }) => {
  const { score, level, maxCombo } = useGameStore();

  return (
    <div className="gameover-screen">
      <div className="gameover-content">
        <h1 className="gameover-title">GAME OVER</h1>

        <div className="gameover-stats">
          <div className="stat-row">
            <span className="stat-name">Final Score:</span>
            <span className="stat-val">{score}</span>
          </div>
          <div className="stat-row">
            <span className="stat-name">Level Reached:</span>
            <span className="stat-val">{level}</span>
          </div>
          <div className="stat-row">
            <span className="stat-name">Max Combo:</span>
            <span className="stat-val">{maxCombo}</span>
          </div>
        </div>

        <button className="restart-button" onClick={onRestart}>
          🔄 PLAY AGAIN
        </button>

        <p className="gameover-message">
          {score > 5000 ? '🌟 Excellent performance!' : score > 2000 ? '👍 Great job!' : '💪 Keep practicing!'}
        </p>
      </div>
    </div>
  );
};

/**
 * Floating notification for correct/wrong answers
 */
export const FloatingNotification: React.FC<{ message: string; type: 'success' | 'error'; duration?: number }> = ({
  message,
  type,
  duration = 2000,
}) => {
  const [visible, setVisible] = React.useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => setVisible(false), duration);
    return () => clearTimeout(timer);
  }, [duration]);

  if (!visible) return null;

  return (
    <div className={`floating-notification notification-${type}`}>
      {type === 'success' ? '✅' : '❌'} {message}
    </div>
  );
};

/**
 * Crosshair for aiming
 */
export const Crosshair: React.FC = () => {
  return (
    <div className="crosshair">
      <div className="crosshair-horizontal"></div>
      <div className="crosshair-vertical"></div>
      <div className="crosshair-center"></div>
    </div>
  );
};

/**
 * Loading screen
 */
export const LoadingScreen: React.FC<{ progress?: number }> = ({ progress = 0 }) => {
  return (
    <div className="loading-screen">
      <div className="loading-content">
        <h2>Knowledge Escape 3D</h2>
        <div className="loading-spinner"></div>
        <p>Loading adventure...</p>
        {progress > 0 && <div className="loading-bar" style={{ width: `${progress}%` }}></div>}
      </div>
    </div>
  );
};

/**
 * Mini map
 */
export const MiniMap: React.FC<{ playerPosition: [number, number, number] }> = ({ playerPosition }) => {
  return (
    <div className="minimap">
      <div className="minimap-content">
        <div className="minimap-background">
          <div
            className="minimap-player"
            style={{
              left: `${50 + (playerPosition[0] / 100) * 50}%`,
              top: `${50 + (playerPosition[2] / 100) * 50}%`,
            }}
          />
        </div>
        <div className="minimap-label">MAP</div>
      </div>
    </div>
  );
};

import React, { useState, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { useGameStore } from './gameStore';
import { Environment } from './WorldComponents';
import { PlayerController, CollisionDetector } from './PlayerController';
import { MainMenu, HUD, QuizModal, GameOverScreen, FloatingNotification, Crosshair, LoadingScreen, MiniMap } from './UI';
import { AudioManager, ParticleSystem, CorrectAnswerEffect, WrongAnswerEffect, GateOpeningEffect } from './AudioParticles';
import { ObstacleManager, LevelGenerator } from './LevelGenerator';
import { getRandomQuestion } from './quizData';
import './UIStyles.css';

/**
 * Main Knowledge Escape 3D Game Component
 */
export const KnowledgeEscape3D: React.FC = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [lastAnswerCorrect, setLastAnswerCorrect] = useState(false);
  const [showEffects, setShowEffects] = useState(false);
  const playerPosRef = useRef<[number, number, number]>([0, 1, 0]);

  const {
    gamePhase,
    health,
    currentQuiz,
    quizVisible,
    quizTimer,
    setGamePhase,
    correctAnswer,
    wrongAnswer,
    resetGame,
    setQuizVisible,
    setQuizTimer,
    setCurrentQuiz,
    environmentType,
    setEnvironmentType,
  } = useGameStore();

  // Handle game start
  const handleGameStart = () => {
    setGameStarted(true);
    resetGame();
    setGamePhase('playing');
    setEnvironmentType('forest'); // Change environment based on level
  };

  // Handle quiz timer
  useEffect(() => {
    if (!quizVisible || !quizTimer) return;

    const timer = setInterval(() => {
      setQuizTimer(quizTimer - 1);

      if (quizTimer <= 1) {
        // Time's up - wrong answer
        setQuizVisible(false);
        wrongAnswer();
        setNotification({ message: 'Time\'s up! ❌', type: 'error' });
        setShowEffects(true);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [quizVisible, quizTimer]);

  // Handle answer selection
  const handleAnswerSelect = (optionIndex: number) => {
    if (!currentQuiz) return;

    setQuizVisible(false);

    if (optionIndex === currentQuiz.correctIndex) {
      // Correct answer
      correctAnswer();
      setNotification({ message: `✅ Correct! +100 Points` , type: 'success' });
      setLastAnswerCorrect(true);

      // Play sound effect
      if ((window as any).gameAudio) {
        (window as any).gameAudio.correctAnswer();
      }
    } else {
      // Wrong answer
      wrongAnswer();
      setNotification({ message: `❌ Wrong! The answer was: ${currentQuiz.options[currentQuiz.correctIndex]}`, type: 'error' });
      setLastAnswerCorrect(false);

      // Play sound effect
      if ((window as any).gameAudio) {
        (window as any).gameAudio.wrongAnswer();
      }
    }

    setShowEffects(true);
    setTimeout(() => setShowEffects(false), 500);
  };

  // Handle game over
  useEffect(() => {
    if (health <= 0) {
      setGamePhase('gameover');
    }
  }, [health]);

  // Handle environment change based on level
  useEffect(() => {
    const { level } = useGameStore.getState();
    if (level <= 3) {
      setEnvironmentType('forest');
    } else if (level <= 6) {
      setEnvironmentType('desert');
    } else {
      setEnvironmentType('futuristic');
    }
  }, [useGameStore((state) => state.level)]);

  // Notification auto-hide
  useEffect(() => {
    if (!notification) return;
    const timer = setTimeout(() => setNotification(null), 2000);
    return () => clearTimeout(timer);
  }, [notification]);

  if (!gameStarted) {
    return <MainMenu onStart={handleGameStart} />;
  }

  if (gamePhase === 'gameover') {
    return (
      <GameOverScreen
        onRestart={() => {
          handleGameStart();
        }}
      />
    );
  }

  return (
    <div style={{ width: '100%', height: '100vh' }}>
      {/* 3D Canvas */}
      <Canvas
        camera={{
          position: [0, 2, -5],
          fov: 75,
          near: 0.1,
          far: 1000,
        }}
        shadows
        gl={{
          antialias: true,
          shadowMap: { enabled: true, type: 0 }, // BasicShadowMap
        }}
      >
        {/* Audio and Particles */}
        <AudioManager />
        <ParticleSystem />

        {/* Environment */}
        <Environment type={environmentType} />

        {/* Player */}
        <PlayerController />

        {/* Level Generation */}
        <LevelGenerator playerPosition={playerPosRef.current} />

        {/* Obstacles */}
        <ObstacleManager
          playerPosition={playerPosRef.current}
          onObstacleEncounter={(obstacle) => {
            // Obstacle encounter logic handled in ObstacleManager
          }}
        />

        {/* Visual Effects */}
        {showEffects && lastAnswerCorrect && (
          <CorrectAnswerEffect position={[0, 2, 0]} trigger={showEffects} />
        )}
        {showEffects && !lastAnswerCorrect && (
          <WrongAnswerEffect position={[0, 2, 0]} trigger={showEffects} />
        )}
        {quizVisible && currentQuiz && (
          <GateOpeningEffect position={[0, 2, 0]} isOpening={true} />
        )}
      </Canvas>

      {/* UI Overlay */}
      {gamePhase === 'playing' && (
        <>
          <HUD />
          <Crosshair />
          <MiniMap playerPosition={playerPosRef.current} />
        </>
      )}

      {/* Quiz Modal */}
      <QuizModal
        visible={quizVisible && gamePhase === 'playing'}
        onAnswerSelect={handleAnswerSelect}
        onClose={() => setQuizVisible(false)}
      />

      {/* Notifications */}
      {notification && <FloatingNotification message={notification.message} type={notification.type} duration={2000} />}

      {/* Loading indicator */}
      {gamePhase === 'loading' && <LoadingScreen progress={100} />}
    </div>
  );
};

export default KnowledgeEscape3D;

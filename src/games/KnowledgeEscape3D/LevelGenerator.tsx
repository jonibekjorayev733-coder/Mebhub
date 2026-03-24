import React, { useRef, useMemo } from 'react';
import { useGameStore } from './gameStore';
import { Door, BrokenBridge, LaserBarrier, EnemyRobot } from './WorldComponents';
import { getRandomQuestion, getQuestionsByDifficulty } from './quizData';

interface Obstacle {
  id: string;
  position: [number, number, number];
  type: 'door' | 'bridge' | 'laser' | 'robot';
  size: [number, number, number];
  isActive: boolean;
  triggered: boolean;
}

/**
 * Obstacle Manager - handles creation and management of game obstacles
 */
export const ObstacleManager: React.FC<{
  playerPosition: [number, number, number];
  onObstacleEncounter: (obstacle: Obstacle) => void;
}> = ({ playerPosition, onObstacleEncounter }) => {
  const obstaclesRef = useRef<Obstacle[]>([]);
  const { level, setCurrentQuiz, setQuizVisible } = useGameStore();
  const lastGeneratedZ = useRef<number>(0);
  const spawnDistance = 20; // Distance ahead to spawn obstacles

  // Generate obstacles based on level
  const generateObstacles = (fromZ: number, toZ: number) => {
    const obstacles: Obstacle[] = [];
    const spacing = 8;
    const difficulty = getQuestionsByDifficulty(level);

    for (let z = fromZ; z < toZ; z += spacing) {
      const random = Math.random();
      let obstacle: Obstacle | null = null;

      // Obstacle type distribution
      if (random < 0.3) {
        // Door
        obstacle = {
          id: `door-${z}`,
          position: [0, 0, z],
          type: 'door',
          size: [3, 6, 0.2],
          isActive: true,
          triggered: false,
        };
      } else if (random < 0.5) {
        // Broken bridge
        obstacle = {
          id: `bridge-${z}`,
          position: [0, 0, z],
          type: 'bridge',
          size: [10, 0.5, 6],
          isActive: true,
          triggered: false,
        };
      } else if (random < 0.75) {
        // Laser barrier
        obstacle = {
          id: `laser-${z}`,
          position: [0, 2, z],
          type: 'laser',
          size: [8, 5, 0.3],
          isActive: true,
          triggered: false,
        };
      } else {
        // Enemy robot
        obstacle = {
          id: `robot-${z}`,
          position: [(Math.random() - 0.5) * 4, 1, z],
          type: 'robot',
          size: [1.5, 2, 1.5],
          isActive: true,
          triggered: false,
        };
      }

      if (obstacle) {
        obstacles.push(obstacle);
      }
    }

    return obstacles;
  };

  // Generate new obstacles as player moves forward
  React.useEffect(() => {
    const nextZ = playerPosition[2] + spawnDistance;
    if (nextZ > lastGeneratedZ.current) {
      const newObstacles = generateObstacles(lastGeneratedZ.current, nextZ);
      obstaclesRef.current.push(...newObstacles);
      lastGeneratedZ.current = nextZ;
    }

    // Remove obstacles that are far behind
    obstaclesRef.current = obstaclesRef.current.filter((obs) => obs.position[2] > playerPosition[2] - 20);
  }, [playerPosition[2]]);

  // Check for collisions
  React.useEffect(() => {
    obstaclesRef.current.forEach((obstacle) => {
      if (!obstacle.triggered) {
        const dist = Math.sqrt(
          Math.pow(playerPosition[0] - obstacle.position[0], 2) +
            Math.pow(playerPosition[1] - obstacle.position[1], 2) +
            Math.pow(playerPosition[2] - obstacle.position[2], 2)
        );

        if (dist < 3) {
          obstacle.triggered = true;
          onObstacleEncounter(obstacle);

          // Generate quiz question
          const question = getRandomQuestion(level);
          setCurrentQuiz(question);
          setQuizVisible(true);
        }
      }
    });
  }, [playerPosition]);

  return (
    <>
      {obstaclesRef.current.map((obstacle) => {
        switch (obstacle.type) {
          case 'door':
            return <Door key={obstacle.id} position={obstacle.position} isOpen={!obstacle.isActive} />;
          case 'bridge':
            return <BrokenBridge key={obstacle.id} position={obstacle.position} gap={4} />;
          case 'laser':
            return <LaserBarrier key={obstacle.id} position={obstacle.position} active={obstacle.isActive} />;
          case 'robot':
            return <EnemyRobot key={obstacle.id} position={obstacle.position} active={obstacle.isActive} />;
          default:
            return null;
        }
      })}
    </>
  );
};

/**
 * Level Generator - creates level-specific content
 */
export const LevelGenerator: React.FC<{ playerPosition: [number, number, number] }> = ({ playerPosition }) => {
  const { level, environmentType } = useGameStore();
  const { Tree, PalmTree, Building, Rock } = useWorldComponents();

  // Generate environment elements
  const environmentElements = useMemo(() => {
    const elements: any[] = [];
    const gridSize = 20;
    const range = 50;

    for (let x = -range; x < range; x += gridSize) {
      for (let z = Math.floor(playerPosition[2] / gridSize) * gridSize - range; z < playerPosition[2] + range; z += gridSize) {
        const seed = Math.sin(x * 73 + z * 149) * 43758.5453;
        const random = seed - Math.floor(seed);

        if (environmentType === 'forest') {
          if (random < 0.4) {
            elements.push({
              type: 'tree',
              position: [x + (random - 0.2) * gridSize, 0, z + (seed % 1 - 0.5) * gridSize],
            });
          } else if (random < 0.6) {
            elements.push({
              type: 'rock',
              position: [x + (random - 0.3) * gridSize, 0, z + (seed % 1 - 0.5) * gridSize],
              scale: random * 2,
            });
          }
        } else if (environmentType === 'desert') {
          if (random < 0.2) {
            elements.push({
              type: 'palm',
              position: [x + (random - 0.1) * gridSize, 0, z + (seed % 1 - 0.5) * gridSize],
            });
          }
        } else if (environmentType === 'futuristic') {
          if (random < 0.3) {
            elements.push({
              type: 'building',
              position: [x + (random - 0.15) * gridSize, 0, z + (seed % 1 - 0.5) * gridSize],
              height: 3 + random * 4,
              color: `hsl(${random * 360}, 100%, ${40 + random * 20}%)`,
            });
          }
        }
      }
    }

    return elements;
  }, [playerPosition[2], environmentType]);

  return (
    <>
      {environmentElements.map((element, idx) => {
        if (element.type === 'tree') {
          return <Tree key={`tree-${idx}`} position={element.position} />;
        } else if (element.type === 'palm') {
          return <PalmTree key={`palm-${idx}`} position={element.position} />;
        } else if (element.type === 'rock') {
          return <Rock key={`rock-${idx}`} position={element.position} scale={element.scale} />;
        } else if (element.type === 'building') {
          return (
            <Building key={`building-${idx}`} position={element.position} height={element.height} color={element.color} />
          );
        }
        return null;
      })}
    </>
  );
};

/**
 * Dynamic difficulty system based on level and score
 */
export const useDifficultyScaling = () => {
  const { level, score } = useGameStore();

  return {
    currentDifficulty: level <= 3 ? 'easy' : level <= 6 ? 'medium' : 'hard',
    speedMultiplier: 1 + level * 0.1,
    healthScaling: 100 + level * 10,
    scoreMultiplier: 1 + Math.floor(score / 5000) * 0.1,
  };
};

// Helper to import world components
const useWorldComponents = () => {
  const { Tree, PalmTree, Building, Rock } = require('./WorldComponents');
  return { Tree, PalmTree, Building, Rock };
};

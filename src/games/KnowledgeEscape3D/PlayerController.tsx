import React, { useRef, useEffect, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useGameStore } from './gameStore';
import * as THREE from 'three';

/**
 * Player character with animations
 */
export const Player: React.FC<{ position: [number, number, number] }> = ({ position }) => {
  const groupRef = useRef<THREE.Group>(null);
  const bodyRef = useRef<THREE.Mesh>(null);
  const [isMoving, setIsMoving] = useState(false);
  const speed = useGameStore((state) => state.speed);

  useFrame((state) => {
    if (groupRef.current) {
      // Bob animation while moving
      groupRef.current.position.y = position[1] + (isMoving ? Math.sin(state.clock.elapsedTime * 8) * 0.1 : 0);
    }
  });

  return (
    <group ref={groupRef} position={position} castShadow receiveShadow>
      {/* Head */}
      <mesh castShadow position={[0, 1.8, 0]}>
        <sphereGeometry args={[0.4, 32, 32]} />
        <meshPhongMaterial color="#fdbcb4" />
      </mesh>

      {/* Body */}
      <mesh castShadow ref={bodyRef} position={[0, 0.8, 0]}>
        <boxGeometry args={[0.6, 1.2, 0.4]} />
        <meshPhongMaterial color="#4a90e2" />
      </mesh>

      {/* Arms */}
      <mesh castShadow position={[0.5, 1, 0]}>
        <boxGeometry args={[0.25, 0.8, 0.25]} />
        <meshPhongMaterial color="#fdbcb4" />
      </mesh>

      <mesh castShadow position={[-0.5, 1, 0]}>
        <boxGeometry args={[0.25, 0.8, 0.25]} />
        <meshPhongMaterial color="#fdbcb4" />
      </mesh>

      {/* Legs */}
      <mesh castShadow position={[0.25, 0.2, 0]}>
        <boxGeometry args={[0.25, 0.6, 0.25]} />
        <meshPhongMaterial color="#333333" />
      </mesh>

      <mesh castShadow position={[-0.25, 0.2, 0]}>
        <boxGeometry args={[0.25, 0.6, 0.25]} />
        <meshPhongMaterial color="#333333" />
      </mesh>

      {/* Eyes */}
      <mesh position={[0.15, 2, 0.35]}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshPhongMaterial color="#000000" />
      </mesh>

      <mesh position={[-0.15, 2, 0.35]}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshPhongMaterial color="#000000" />
      </mesh>
    </group>
  );
};

/**
 * Camera controller for third-person view
 */
export const PlayerController: React.FC = () => {
  const { camera } = useThree();
  const groupRef = useRef<THREE.Group>(null);
  const keysPressed = useRef<Record<string, boolean>>({});
  const playerPos = useRef<[number, number, number]>([0, 1, 0]);
  const playerVelocity = useRef<THREE.Vector3>(new THREE.Vector3(0, 0, 0));
  const playerSpeed = useGameStore((state) => state.speed);
  const { takeDamage, addScore } = useGameStore();
  const gravity = 0.3;
  const maxFallSpeed = 10;
  const jumpForce = 15;
  let isGrounded = true;

  // Input handling
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (['w', 'a', 's', 'd', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright', ' '].includes(key)) {
        keysPressed.current[key] = true;
        e.preventDefault();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (['w', 'a', 's', 'd', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright', ' '].includes(key)) {
        keysPressed.current[key] = false;
        e.preventDefault();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  useFrame(() => {
    // Movement
    const moveDirection = new THREE.Vector3(0, 0, 0);
    const baseSpeed = (playerSpeed * 0.1) / 60; // Normalize to frame-independent

    if (keysPressed.current['w'] || keysPressed.current['arrowup']) {
      moveDirection.z -= baseSpeed;
    }
    if (keysPressed.current['s'] || keysPressed.current['arrowdown']) {
      moveDirection.z += baseSpeed;
    }
    if (keysPressed.current['a'] || keysPressed.current['arrowleft']) {
      moveDirection.x -= baseSpeed;
    }
    if (keysPressed.current['d'] || keysPressed.current['arrowright']) {
      moveDirection.x += baseSpeed;
    }

    // Update player position
    playerPos.current[0] += moveDirection.x;
    playerPos.current[2] += moveDirection.z;

    // Gravity and jumping
    if (playerPos.current[1] > 0) {
      playerVelocity.current.y -= gravity;
      playerVelocity.current.y = Math.max(playerVelocity.current.y, -maxFallSpeed);
      isGrounded = false;
    } else {
      playerPos.current[1] = 0;
      playerVelocity.current.y = 0;
      isGrounded = true;

      if (keysPressed.current[' ']) {
        playerVelocity.current.y = jumpForce;
        isGrounded = false;
      }
    }

    playerPos.current[1] += playerVelocity.current.y / 60; // Frame-independent

    // Update camera position (third-person behind player)
    const cameraDistance = 5;
    const cameraHeight = 2;
    camera.position.x = playerPos.current[0] + Math.sin(camera.rotation.order === 'YXZ' ? 0 : 0) * cameraDistance;
    camera.position.y = playerPos.current[1] + cameraHeight;
    camera.position.z = playerPos.current[2] - cameraDistance;

    // Camera looks at player
    camera.lookAt(playerPos.current[0], playerPos.current[1] + 1, playerPos.current[2]);
  });

  return <Player position={playerPos.current} />;
};

/**
 * Collision detector
 */
export const CollisionDetector: React.FC<{
  playerPosition: [number, number, number];
  obstacles: Array<{ id: string; position: [number, number, number]; type: string; size: [number, number, number] }>;
  onObstacleHit: (obstacleId: string, obstacleType: string) => void;
}> = ({ playerPosition, obstacles, onObstacleHit }) => {
  const lastCollisionTime = useRef<number>(0);
  const collisionCooldown = 500; // ms

  useFrame(() => {
    const now = Date.now();
    if (now - lastCollisionTime.current < collisionCooldown) return;

    obstacles.forEach((obstacle) => {
      const dist = Math.sqrt(
        Math.pow(playerPosition[0] - obstacle.position[0], 2) +
          Math.pow(playerPosition[1] - obstacle.position[1], 2) +
          Math.pow(playerPosition[2] - obstacle.position[2], 2)
      );

      // Simple sphere collision
      if (dist < 2 + Math.max(...obstacle.size) / 2) {
        lastCollisionTime.current = now;
        onObstacleHit(obstacle.id, obstacle.type);
      }
    });
  });

  return null;
};

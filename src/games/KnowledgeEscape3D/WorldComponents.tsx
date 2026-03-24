import React from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { OrbitControls, Sky, Forest, useGLTF, Html } from '@react-three/drei';
import * as THREE from 'three';
import { useGameStore } from './gameStore';

/**
 * Skybox and environmental lighting
 */
export const Environment: React.FC<{ type: 'forest' | 'desert' | 'futuristic' }> = ({ type }) => {
  const ambientLight = React.useRef<THREE.Light>(null);

  React.useEffect(() => {
    if (ambientLight.current) {
      if (type === 'forest') {
        ambientLight.current.intensity = 0.7;
      } else if (type === 'desert') {
        ambientLight.current.intensity = 1.2;
      } else {
        ambientLight.current.intensity = 0.9;
      }
    }
  }, [type]);

  return (
    <>
      {/* Ambient Light */}
      <ambientLight ref={ambientLight} intensity={0.7} color="#ffffff" />

      {/* Directional Light (Sun) */}
      <directionalLight
        position={type === 'desert' ? [10, 15, 10] : type === 'futuristic' ? [0, 20, 0] : [10, 20, 10]}
        intensity={type === 'desert' ? 1.5 : 1}
        color={type === 'desert' ? '#ffdd99' : '#ffffff'}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-left={-100}
        shadow-camera-right={100}
        shadow-camera-top={100}
        shadow-camera-bottom={-100}
        shadow-camera-near={0.1}
        shadow-camera-far={1000}
      />

      {/* Point Light for atmosphere */}
      <pointLight position={[0, 30, 0]} intensity={0.3} color="#ffffff" />

      {/* Sky */}
      {type === 'forest' && (
        <Sky sunPosition={[100, 20, 100]} turbidity={8} rayleigh={6} inclination={0.6} azimuth={0.25} />
      )}
      {type === 'desert' && (
        <Sky sunPosition={[100, 30, 100]} turbidity={15} rayleigh={3} inclination={0.9} azimuth={0.25} />
      )}
      {type === 'futuristic' && (
        <mesh position={[0, 0, -100]}>
          <sphereGeometry args={[500, 32, 32]} />
          <meshBasicMaterial color="#001a4d" side={THREE.BackSide} />
        </mesh>
      )}

      {/* Ground */}
      <mesh receiveShadow position={[0, -2, 0]}>
        <planeGeometry args={[1000, 1000]} />
        <meshPhongMaterial
          color={type === 'forest' ? '#2d5016' : type === 'desert' ? '#d4a574' : '#1a1a2e'}
          shininess={0}
        />
      </mesh>

      {/* Fog */}
      <fog attach="fog" args={[type === 'desert' ? '#ffdd99' : '#87ceeb', 50, 300]} />
    </>
  );
};

/**
 * Ground plane with material variation
 */
export const Ground: React.FC = () => {
  return (
    <mesh receiveShadow position={[0, 0, 0]}>
      <planeGeometry args={[500, 500]} />
      <meshPhongMaterial color="#2d5016" />
    </mesh>
  );
};

/**
 * Simple tree model for forest
 */
export const Tree: React.FC<{ position: [number, number, number] }> = ({ position }) => {
  return (
    <group position={position} castShadow receiveShadow>
      {/* Trunk */}
      <mesh castShadow position={[0, 2, 0]}>
        <cylinderGeometry args={[0.3, 0.4, 4, 8]} />
        <meshPhongMaterial color="#8b6f47" />
      </mesh>

      {/* Foliage */}
      <mesh castShadow position={[0, 5.5, 0]}>
        <sphereGeometry args={[2.5, 8, 8]} />
        <meshPhongMaterial color="#228b22" />
      </mesh>

      <mesh castShadow position={[0.8, 5, 0]}>
        <sphereGeometry args={[1.8, 8, 8]} />
        <meshPhongMaterial color="#2d5016" />
      </mesh>

      <mesh castShadow position={[-0.8, 5, 0]}>
        <sphereGeometry args={[1.8, 8, 8]} />
        <meshPhongMaterial color="#2d5016" />
      </mesh>
    </group>
  );
};

/**
 * Simple rock model
 */
export const Rock: React.FC<{ position: [number, number, number]; scale?: number }> = ({ position, scale = 1 }) => {
  return (
    <mesh castShadow receiveShadow position={position} scale={scale}>
      <dodecahedronGeometry args={[0.8, 0]} />
      <meshPhongMaterial color="#888888" />
    </mesh>
  );
};

/**
 * Palm tree for desert
 */
export const PalmTree: React.FC<{ position: [number, number, number] }> = ({ position }) => {
  return (
    <group position={position} castShadow receiveShadow>
      {/* Trunk */}
      <mesh castShadow position={[0, 1.5, 0]}>
        <cylinderGeometry args={[0.2, 0.3, 3, 8]} />
        <meshPhongMaterial color="#8b7355" />
      </mesh>

      {/* Leaves */}
      <mesh castShadow position={[0, 3, 0]}>
        <sphereGeometry args={[2, 8, 8]} />
        <meshPhongMaterial color="#7cb342" />
      </mesh>

      <mesh castShadow position={[1.5, 2.8, 0]}>
        <sphereGeometry args={[1.5, 8, 8]} />
        <meshPhongMaterial color="#9ccc65" />
      </mesh>

      <mesh castShadow position={[-1.5, 2.8, 0]}>
        <sphereGeometry args={[1.5, 8, 8]} />
        <meshPhongMaterial color="#9ccc65" />
      </mesh>
    </group>
  );
};

/**
 * Futuristic city building
 */
export const Building: React.FC<{ position: [number, number, number]; height: number; color: string }> = ({
  position,
  height,
  color,
}) => {
  const meshRef = React.useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.3) * 0.02;
    }
  });

  return (
    <mesh castShadow receiveShadow ref={meshRef} position={position}>
      <boxGeometry args={[3, height, 3]} />
      <meshPhongMaterial color={color} emissive={color} emissiveIntensity={0.2} />

      {/* Windows */}
      {Array.from({ length: Math.floor(height / 1.5) }).map((_, i) => (
        <mesh key={i} position={[1.4, i * 1.5 - height / 2 + 1, 1.4]}>
          <boxGeometry args={[0.4, 0.4, 0.1]} />
          <meshPhongMaterial color="#ffff00" emissive="#ffff00" emissiveIntensity={0.8} />
        </mesh>
      ))}
    </mesh>
  );
};

/**
 * Obstacle door
 */
export const Door: React.FC<{ position: [number, number, number]; isOpen: boolean }> = ({ position, isOpen }) => {
  const meshRef = React.useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y = isOpen ? Math.PI / 2 : 0;
    }
  });

  return (
    <group position={position}>
      {/* Frame */}
      <mesh castShadow>
        <boxGeometry args={[3, 6, 0.2]} />
        <meshPhongMaterial color="#333333" />
      </mesh>

      {/* Door */}
      <mesh castShadow ref={meshRef}>
        <boxGeometry args={[2.8, 5.8, 0.15]} />
        <meshPhongMaterial color="#ff4444" emissive="#ff0000" emissiveIntensity={0.3} />
      </mesh>

      {/* Handle */}
      <mesh position={[1.2, 0, 0.2]} castShadow>
        <sphereGeometry args={[0.15, 8, 8]} />
        <meshPhongMaterial color="#ffaa00" />
      </mesh>
    </group>
  );
};

/**
 * Broken bridge obstacle
 */
export const BrokenBridge: React.FC<{ position: [number, number, number]; gap: number }> = ({
  position,
  gap = 4,
}) => {
  return (
    <group position={position}>
      {/* Left part */}
      <mesh castShadow receiveShadow position={[-gap / 2 - 2, 0, 0]}>
        <boxGeometry args={[4, 0.5, 6]} />
        <meshPhongMaterial color="#8b6f47" />
      </mesh>

      {/* Right part */}
      <mesh castShadow receiveShadow position={[gap / 2 + 2, 0, 0]}>
        <boxGeometry args={[4, 0.5, 6]} />
        <meshPhongMaterial color="#8b6f47" />
      </mesh>

      {/* Gap indicator */}
      <mesh position={[0, -5, 0]}>
        <planeGeometry args={[gap + 1, 20]} />
        <meshBasicMaterial color="#ff0000" transparent opacity={0.1} />
      </mesh>
    </group>
  );
};

/**
 * Laser barrier obstacle
 */
export const LaserBarrier: React.FC<{ position: [number, number, number]; active: boolean }> = ({
  position,
  active,
}) => {
  const laserRef = React.useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (laserRef.current && active) {
      laserRef.current.material.emissiveIntensity = 0.5 + Math.sin(state.clock.elapsedTime * 5) * 0.5;
    }
  });

  return (
    <group position={position}>
      {/* Barrier frame */}
      <mesh castShadow position={[0, 0, 0]}>
        <boxGeometry args={[8, 5, 0.3]} />
        <meshPhongMaterial color="#1a1a1a" />
      </mesh>

      {/* Laser beams */}
      {active && (
        <>
          {Array.from({ length: 5 }).map((_, i) => (
            <mesh key={i} ref={i === 2 ? laserRef : null} position={[0, i - 2, 0.2]}>
              <boxGeometry args={[8, 0.1, 0.05]} />
              <meshPhongMaterial
                color="#00ff00"
                emissive="#00ff00"
                emissiveIntensity={0.8}
                transparent
                opacity={0.8}
              />
            </mesh>
          ))}
        </>
      )}
    </group>
  );
};

/**
 * Enemy robot obstacle
 */
export const EnemyRobot: React.FC<{ position: [number, number, number]; active: boolean }> = ({
  position,
  active,
}) => {
  const bodyRef = React.useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (bodyRef.current && active) {
      bodyRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.3;
    }
  });

  return (
    <group position={position}>
      {/* Body */}
      <mesh castShadow ref={bodyRef}>
        <boxGeometry args={[1.5, 2, 1.5]} />
        <meshPhongMaterial color={active ? '#ff3333' : '#333333'} emissive={active ? '#ff0000' : '#000000'} />
      </mesh>

      {/* Head */}
      <mesh castShadow position={[0, 1.5, 0]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshPhongMaterial color={active ? '#ff3333' : '#333333'} />
      </mesh>

      {/* Eyes */}
      <mesh position={[0.3, 1.7, 0.4]}>
        <sphereGeometry args={[0.15, 8, 8]} />
        <meshPhongMaterial color="#00ff00" emissive="#00ff00" emissiveIntensity={0.8} />
      </mesh>

      <mesh position={[-0.3, 1.7, 0.4]}>
        <sphereGeometry args={[0.15, 8, 8]} />
        <meshPhongMaterial color="#00ff00" emissive="#00ff00" emissiveIntensity={0.8} />
      </mesh>

      {/* Arms */}
      <mesh castShadow position={[0.9, 0.5, 0]}>
        <boxGeometry args={[0.3, 1, 0.3]} />
        <meshPhongMaterial color="#333333" />
      </mesh>

      <mesh castShadow position={[-0.9, 0.5, 0]}>
        <boxGeometry args={[0.3, 1, 0.3]} />
        <meshPhongMaterial color="#333333" />
      </mesh>
    </group>
  );
};

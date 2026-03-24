import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGameStore } from './gameStore';
import * as THREE from 'three';

/**
 * Audio system for game sounds and music
 */
export const AudioManager: React.FC = () => {
  const audioContextRef = useRef<AudioContext | null>(null);
  const bgMusicRef = useRef<AudioBufferSourceNode | null>(null);
  const soundsRef = useRef<Record<string, AudioBufferSourceNode>>({});
  const { gamePhase } = useGameStore();

  // Initialize Web Audio API
  useEffect(() => {
    const initAudio = async () => {
      if (!audioContextRef.current) {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        audioContextRef.current = audioContext;

        // Create background music oscillator (since we don't have audio files)
        if (gamePhase === 'playing') {
          playBackgroundMusic();
        }
      }
    };

    initAudio();

    return () => {
      if (bgMusicRef.current) {
        bgMusicRef.current.stop();
      }
    };
  }, [gamePhase]);

  const playBackgroundMusic = () => {
    if (!audioContextRef.current) return;

    const ctx = audioContextRef.current;
    const now = ctx.currentTime;

    // Create a simple oscillator for background music
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(220, now); // A3 note
    gain.gain.setValueAtTime(0.05, now);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);

    // Simple melody pattern
    const notes = [220, 246.94, 293.66, 246.94]; // A, B, D, B
    let noteIndex = 0;
    const noteLength = 0.5;

    const scheduleNotes = () => {
      let currentTime = now;
      for (let i = 0; i < notes.length * 4; i++) {
        const note = notes[i % notes.length];
        osc.frequency.setTargetAtTime(note, currentTime, 0.05);
        currentTime += noteLength;
      }
    };

    scheduleNotes();

    bgMusicRef.current = osc;
  };

  const playSound = (soundName: string, frequency: number = 440, duration: number = 0.2) => {
    if (!audioContextRef.current) return;

    const ctx = audioContextRef.current;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.frequency.setValueAtTime(frequency, now);
    gain.gain.setValueAtTime(0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + duration);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + duration);
  };

  // Expose sound playing methods
  useEffect(() => {
    (window as any).gameAudio = {
      correctAnswer: () => playSound('correct', 800, 0.3),
      wrongAnswer: () => playSound('wrong', 300, 0.2),
      jump: () => playSound('jump', 600, 0.1),
      gateOpen: () => playSound('gate', 1000, 0.5),
    };
  }, []);

  return null;
};

/**
 * Particle system for visual effects
 */
export const ParticleSystem: React.FC = () => {
  const particlesRef = useRef<THREE.Points | null>(null);
  const particlesData = useRef<{
    positions: Float32Array;
    velocities: Float32Array;
    lives: Float32Array;
    active: number;
  }>({
    positions: new Float32Array(3000),
    velocities: new Float32Array(3000),
    lives: new Float32Array(1000),
    active: 0,
  });

  useFrame(() => {
    if (!particlesRef.current) return;

    const { positions, velocities, lives, active } = particlesData.current;
    const geometry = particlesRef.current.geometry as THREE.BufferGeometry;

    // Update particles
    for (let i = 0; i < active; i++) {
      // Position
      positions[i * 3] += velocities[i * 3];
      positions[i * 3 + 1] += velocities[i * 3 + 1];
      positions[i * 3 + 2] += velocities[i * 3 + 2];

      // Velocity (gravity)
      velocities[i * 3 + 1] -= 0.01;

      // Life
      lives[i] -= 0.02;

      if (lives[i] < 0) {
        lives[i] = 0;
      }
    }

    geometry.attributes.position.needsUpdate = true;
  });

  const emitParticles = (position: [number, number, number], count: number = 10, color: string = '#4a90e2') => {
    const { positions, velocities, lives, active } = particlesData.current;

    for (let i = 0; i < count && active < 1000; i++) {
      const idx = active * 3;
      const angle = Math.random() * Math.PI * 2;
      const speed = 0.1 + Math.random() * 0.2;

      positions[idx] = position[0] + (Math.random() - 0.5) * 0.5;
      positions[idx + 1] = position[1] + (Math.random() - 0.5) * 0.5;
      positions[idx + 2] = position[2] + (Math.random() - 0.5) * 0.5;

      velocities[idx] = Math.cos(angle) * speed;
      velocities[idx + 1] = Math.sin(angle) * speed;
      velocities[idx + 2] = (Math.random() - 0.5) * 0.1;

      lives[active] = 1;

      particlesData.current.active++;
    }
  };

  // Expose particle emission
  useEffect(() => {
    (window as any).gameParticles = {
      emit: emitParticles,
    };
  }, []);

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={1000} array={particlesData.current.positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.2} color="#4a90e2" sizeAttenuation transparent opacity={0.8} />
    </points>
  );
};

/**
 * Visual effect for correct answer
 */
export const CorrectAnswerEffect: React.FC<{ position: [number, number, number]; trigger: boolean }> = ({
  position,
  trigger,
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshPhongMaterial>(null);

  React.useEffect(() => {
    if (trigger && (window as any).gameAudio) {
      (window as any).gameAudio.correctAnswer();
    }
    if (trigger && (window as any).gameParticles) {
      (window as any).gameParticles.emit(position, 20, '#4ade80');
    }
  }, [trigger, position]);

  useFrame((state) => {
    if (meshRef.current && trigger) {
      meshRef.current.scale.x += 0.02;
      meshRef.current.scale.y += 0.02;
      meshRef.current.scale.z += 0.02;

      if (materialRef.current) {
        materialRef.current.opacity = Math.max(0, materialRef.current.opacity - 0.05);
      }

      if (meshRef.current.scale.x > 2) {
        meshRef.current.scale.set(0.2, 0.2, 0.2);
        if (materialRef.current) {
          materialRef.current.opacity = 1;
        }
      }
    }
  });

  if (!trigger) return null;

  return (
    <mesh ref={meshRef} position={position} scale={[0.2, 0.2, 0.2]}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshPhongMaterial ref={materialRef} color="#4ade80" emissive="#22c55e" emissiveIntensity={0.8} />
    </mesh>
  );
};

/**
 * Visual effect for wrong answer
 */
export const WrongAnswerEffect: React.FC<{ position: [number, number, number]; trigger: boolean }> = ({
  position,
  trigger,
}) => {
  const meshRef = useRef<THREE.Group>(null);

  React.useEffect(() => {
    if (trigger && (window as any).gameAudio) {
      (window as any).gameAudio.wrongAnswer();
    }
    if (trigger && (window as any).gameParticles) {
      (window as any).gameParticles.emit(position, 15, '#ef4444');
    }
  }, [trigger, position]);

  useFrame((state) => {
    if (meshRef.current && trigger) {
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 10) * 0.2;
      meshRef.current.rotation.z = Math.cos(state.clock.elapsedTime * 10) * 0.2;

      meshRef.current.position.y += 0.05;

      // Fade out
      const elements = meshRef.current.children;
      elements.forEach((el) => {
        if (el instanceof THREE.Mesh && el.material instanceof THREE.Material) {
          (el.material as any).opacity = Math.max(0, (el.material as any).opacity - 0.05);
        }
      });
    }
  });

  if (!trigger) return null;

  return (
    <group ref={meshRef} position={position}>
      <mesh>
        <boxGeometry args={[0.4, 0.4, 0.4]} />
        <meshPhongMaterial color="#ef4444" emissive="#dc2626" emissiveIntensity={0.8} transparent opacity={1} />
      </mesh>
      <mesh position={[0.3, 0.3, 0]}>
        <boxGeometry args={[0.2, 0.2, 0.2]} />
        <meshPhongMaterial color="#fca5a5" emissive="#ef4444" emissiveIntensity={0.6} transparent opacity={1} />
      </mesh>
    </group>
  );
};

/**
 * Gate opening effect
 */
export const GateOpeningEffect: React.FC<{ position: [number, number, number]; isOpening: boolean }> = ({
  position,
  isOpening,
}) => {
  const particlesGroupRef = useRef<THREE.Group>(null);

  React.useEffect(() => {
    if (isOpening && (window as any).gameAudio) {
      (window as any).gameAudio.gateOpen();
    }
    if (isOpening && (window as any).gameParticles) {
      for (let i = 0; i < 3; i++) {
        setTimeout(() => {
          (window as any).gameParticles.emit(position, 25, '#fbbf24');
        }, i * 100);
      }
    }
  }, [isOpening, position]);

  useFrame((state) => {
    if (particlesGroupRef.current && isOpening) {
      particlesGroupRef.current.rotation.z = state.clock.elapsedTime * 2;
    }
  });

  if (!isOpening) return null;

  return (
    <group ref={particlesGroupRef} position={position}>
      {Array.from({ length: 8 }).map((_, i) => (
        <mesh key={i} position={[Math.cos((i / 8) * Math.PI * 2) * 1, 0, Math.sin((i / 8) * Math.PI * 2) * 1]}>
          <sphereGeometry args={[0.2, 16, 16]} />
          <meshPhongMaterial color="#fbbf24" emissive="#f59e0b" emissiveIntensity={0.8} />
        </mesh>
      ))}
    </group>
  );
};

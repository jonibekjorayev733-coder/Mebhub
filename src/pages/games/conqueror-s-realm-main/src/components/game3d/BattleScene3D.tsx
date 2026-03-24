import { useRef, useMemo } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { Text, Billboard } from "@react-three/drei";

interface BattleScene3DProps {
  position: [number, number, number];
  phase: "approaching" | "fighting" | "resolved";
}

const BattleScene3D = ({ position, phase }: BattleScene3DProps) => {
  const groupRef = useRef<THREE.Group>(null);

  // Generate battle particles
  const particles = useMemo(() => {
    return Array.from({ length: 30 }).map(() => ({
      offset: [
        (Math.random() - 0.5) * 6,
        Math.random() * 3,
        (Math.random() - 0.5) * 6,
      ] as [number, number, number],
      speed: 0.5 + Math.random() * 2,
      size: 0.05 + Math.random() * 0.1,
      type: Math.random() > 0.5 ? "fire" : "smoke",
    }));
  }, []);

  // Arrow projectiles
  const arrows = useMemo(() => {
    return Array.from({ length: 15 }).map(() => ({
      start: [(Math.random() - 0.5) * 4 - 3, 1 + Math.random() * 2, (Math.random() - 0.5) * 2] as [number, number, number],
      end: [(Math.random() - 0.5) * 4 + 3, Math.random() * 0.5, (Math.random() - 0.5) * 2] as [number, number, number],
      delay: Math.random() * 2,
    }));
  }, []);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    // Shake effect during fighting
    if (phase === "fighting") {
      groupRef.current.position.x = position[0] + Math.sin(clock.elapsedTime * 20) * 0.05;
      groupRef.current.position.z = position[2] + Math.cos(clock.elapsedTime * 15) * 0.05;
    }
  });

  return (
    <group ref={groupRef} position={position}>
      {/* Battle smoke/fire particles */}
      {phase === "fighting" && particles.map((p, i) => (
        <FireParticle key={i} {...p} />
      ))}

      {/* Flying arrows */}
      {phase === "fighting" && arrows.map((a, i) => (
        <Arrow key={i} {...a} />
      ))}

      {/* Clash indicator */}
      <Billboard position={[0, 4, 0]}>
        <Text
          fontSize={1.2}
          color="#ff4400"
          anchorX="center"
          outlineWidth={0.05}
          outlineColor="#000"
          font={undefined}
        >
          ⚔ JANG! ⚔
        </Text>
      </Billboard>

      {/* Ground impact circle */}
      <mesh rotation-x={-Math.PI / 2} position={[0, 0.1, 0]}>
        <ringGeometry args={[3, 5, 32]} />
        <meshBasicMaterial color="#ff2200" transparent opacity={0.3} />
      </mesh>

      {/* Dust cloud */}
      <mesh position={[0, 1, 0]}>
        <sphereGeometry args={[3, 8, 8]} />
        <meshStandardMaterial color="#8b7355" transparent opacity={0.15} />
      </mesh>
    </group>
  );
};

const FireParticle = ({ offset, speed, size, type }: {
  offset: [number, number, number];
  speed: number;
  size: number;
  type: string;
}) => {
  const ref = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = (clock.elapsedTime * speed) % 3;
    ref.current.position.y = offset[1] + t;
    ref.current.scale.setScalar(size * (1 - t / 3));
    (ref.current.material as THREE.MeshBasicMaterial).opacity = 0.6 * (1 - t / 3);
  });

  return (
    <mesh ref={ref} position={offset}>
      <sphereGeometry args={[size, 4, 4]} />
      <meshBasicMaterial
        color={type === "fire" ? "#ff6600" : "#555555"}
        transparent
        opacity={0.6}
      />
    </mesh>
  );
};

const Arrow = ({ start, end, delay }: {
  start: [number, number, number];
  end: [number, number, number];
  delay: number;
}) => {
  const ref = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = ((clock.elapsedTime - delay) % 2) / 2;
    if (t < 0 || t > 1) {
      ref.current.visible = false;
      return;
    }
    ref.current.visible = true;
    // Parabolic trajectory
    ref.current.position.x = THREE.MathUtils.lerp(start[0], end[0], t);
    ref.current.position.z = THREE.MathUtils.lerp(start[2], end[2], t);
    ref.current.position.y = THREE.MathUtils.lerp(start[1], end[1], t) + Math.sin(t * Math.PI) * 2;
    // Point in direction of travel
    const nextT = Math.min(1, t + 0.05);
    const dx = THREE.MathUtils.lerp(start[0], end[0], nextT) - ref.current.position.x;
    const dy = THREE.MathUtils.lerp(start[1], end[1], nextT) + Math.sin(nextT * Math.PI) * 2 - ref.current.position.y;
    ref.current.rotation.z = Math.atan2(dy, dx);
  });

  return (
    <mesh ref={ref}>
      <cylinderGeometry args={[0.01, 0.01, 0.4, 3]} />
      <meshBasicMaterial color="#8b7355" />
    </mesh>
  );
};

export default BattleScene3D;

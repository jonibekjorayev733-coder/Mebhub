import { useRef, useMemo } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { Text, Billboard } from "@react-three/drei";
import type { Army } from "./types";

interface ArmyUnitProps {
  army: Army;
  onClick: (army: Army) => void;
}

// Individual soldier mesh
const Soldier = ({ offset, type, color, time }: {
  offset: [number, number, number];
  type: string;
  color: string;
  time: number;
}) => {
  const ref = useRef<THREE.Group>(null);

  useFrame(() => {
    if (ref.current) {
      // Idle bob
      ref.current.position.y = offset[1] + Math.sin(time + offset[0] * 2) * 0.03;
    }
  });

  return (
    <group ref={ref} position={offset}>
      {/* Body */}
      <mesh position={[0, 0.4, 0]} castShadow>
        <capsuleGeometry args={[0.12, 0.3, 4, 8]} />
        <meshStandardMaterial color={color} roughness={0.7} />
      </mesh>
      {/* Head */}
      <mesh position={[0, 0.75, 0]}>
        <sphereGeometry args={[0.1, 8, 8]} />
        <meshStandardMaterial color="#d4a574" roughness={0.8} />
      </mesh>
      {/* Weapon */}
      {type === "cavalry" && (
        <mesh position={[0, 0.3, 0]} rotation={[0, 0, 0.3]}>
          <cylinderGeometry args={[0.02, 0.02, 0.8, 4]} />
          <meshStandardMaterial color="#888" metalness={0.8} roughness={0.3} />
        </mesh>
      )}
      {type === "infantry" && (
        <mesh position={[0.15, 0.5, 0]} rotation={[0, 0, -0.5]}>
          <boxGeometry args={[0.04, 0.5, 0.04]} />
          <meshStandardMaterial color="#666" metalness={0.6} />
        </mesh>
      )}
      {/* Horse for cavalry */}
      {type === "cavalry" && (
        <mesh position={[0, 0.15, 0]} castShadow>
          <boxGeometry args={[0.2, 0.25, 0.5]} />
          <meshStandardMaterial color="#5c3a1e" roughness={0.8} />
        </mesh>
      )}
    </group>
  );
};

const ArmyUnit = ({ army, onClick }: ArmyUnitProps) => {
  const groupRef = useRef<THREE.Group>(null);
  const timeRef = useRef(Math.random() * 100);
  const currentPos = useRef(new THREE.Vector3(...army.position));
  const targetDir = useRef(0);

  // Generate formation positions
  const formation = useMemo(() => {
    const soldiers: [number, number, number][] = [];
    const count = Math.min(20, Math.ceil(army.troops / 3000));
    const cols = Math.ceil(Math.sqrt(count));
    const spacing = 0.4;
    for (let i = 0; i < count; i++) {
      const row = Math.floor(i / cols);
      const col = i % cols;
      soldiers.push([
        (col - cols / 2) * spacing,
        0,
        (row - Math.ceil(count / cols) / 2) * spacing,
      ]);
    }
    return soldiers;
  }, [army.troops]);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    timeRef.current = clock.elapsedTime;

    const target = army.targetPosition
      ? new THREE.Vector3(...army.targetPosition)
      : new THREE.Vector3(...army.position);

    // Smooth movement
    currentPos.current.lerp(target, army.speed * 0.5);
    groupRef.current.position.copy(currentPos.current);
    groupRef.current.position.y = 0.1;

    // Face direction of movement
    const dir = target.clone().sub(currentPos.current);
    if (dir.length() > 0.1) {
      targetDir.current = Math.atan2(dir.x, dir.z);
    }
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      targetDir.current,
      0.05
    );
  });

  const color = army.faction === "timurid" ? "#00a0b0" : "#8b2500";
  const soldierType = army.type === "cavalry" ? "cavalry" : "infantry";

  return (
    <group
      ref={groupRef}
      onClick={(e) => { e.stopPropagation(); onClick(army); }}
    >
      {/* Formation soldiers */}
      {formation.map((pos, i) => (
        <Soldier
          key={i}
          offset={pos}
          type={soldierType}
          color={color}
          time={timeRef.current + i * 0.3}
        />
      ))}

      {/* Selection ring */}
      {army.selected && (
        <mesh rotation-x={-Math.PI / 2} position={[0, 0.05, 0]}>
          <ringGeometry args={[1.5, 1.8, 32]} />
          <meshBasicMaterial color="#00ff88" transparent opacity={0.6} />
        </mesh>
      )}

      {/* Dust particles when moving */}
      {army.targetPosition && (
        <group position={[0, 0.1, 0]}>
          {Array.from({ length: 5 }).map((_, i) => (
            <mesh key={i} position={[
              (Math.random() - 0.5) * 2,
              Math.random() * 0.3,
              (Math.random() - 0.5) * 2,
            ]}>
              <sphereGeometry args={[0.1 + Math.random() * 0.1, 4, 4]} />
              <meshStandardMaterial color="#8b7355" transparent opacity={0.3} />
            </mesh>
          ))}
        </group>
      )}

      {/* Army label */}
      <Billboard position={[0, 2, 0]}>
        <Text
          fontSize={0.5}
          color={army.faction === "timurid" ? "#00e5ff" : "#ff4444"}
          anchorX="center"
          anchorY="bottom"
          outlineWidth={0.03}
          outlineColor="#000"
          font={undefined}
        >
          {army.faction === "timurid" ? "⚔" : "🛡"} {(army.troops / 1000).toFixed(0)}K
        </Text>
        {/* Health bar */}
        <group position={[0, -0.2, 0]}>
          <mesh position={[0, 0, 0]}>
            <planeGeometry args={[1.2, 0.12]} />
            <meshBasicMaterial color="#333" />
          </mesh>
          <mesh position={[-(1.2 - 1.2 * army.health / army.maxHealth) / 2, 0, 0.01]}>
            <planeGeometry args={[1.2 * army.health / army.maxHealth, 0.08]} />
            <meshBasicMaterial color={army.health > 50 ? "#00cc44" : army.health > 25 ? "#ffaa00" : "#ff3300"} />
          </mesh>
        </group>
      </Billboard>

      {/* Battle indicator */}
      {army.inBattle && (
        <Billboard position={[0, 2.8, 0]}>
          <Text fontSize={0.6} color="#ff4400" font={undefined}>⚔</Text>
        </Billboard>
      )}
    </group>
  );
};

export default ArmyUnit;

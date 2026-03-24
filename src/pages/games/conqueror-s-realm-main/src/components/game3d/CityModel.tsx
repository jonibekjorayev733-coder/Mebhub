import { useRef, useState } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { Text, Billboard } from "@react-three/drei";
import type { City } from "./types";

interface CityModelProps {
  city: City;
  onClick: (city: City) => void;
  isTarget: boolean;
}

const CityModel = ({ city, onClick, isTarget }: CityModelProps) => {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const glowRef = useRef<THREE.Mesh>(null);
  const flagRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (glowRef.current) {
      glowRef.current.scale.setScalar(1 + Math.sin(clock.elapsedTime * 2) * 0.15);
    }
    if (flagRef.current && city.conquered) {
      flagRef.current.rotation.y = Math.sin(clock.elapsedTime * 3) * 0.2;
    }
  });

  const baseColor = city.conquered
    ? "#00c8d4"
    : city.faction === "enemy"
    ? "#8b4513"
    : "#a0a060";

  const wallColor = city.conquered ? "#0a6060" : "#6b4423";

  return (
    <group
      ref={groupRef}
      position={city.position}
      onClick={(e) => { e.stopPropagation(); onClick(city); }}
      onPointerOver={() => { setHovered(true); document.body.style.cursor = "pointer"; }}
      onPointerOut={() => { setHovered(false); document.body.style.cursor = "auto"; }}
    >
      {/* Ground circle */}
      <mesh rotation-x={-Math.PI / 2} position={[0, 0.05, 0]}>
        <circleGeometry args={[3, 32]} />
        <meshStandardMaterial
          color={city.conquered ? "#0a8888" : "#554422"}
          transparent
          opacity={0.5}
        />
      </mesh>

      {/* City walls - octagonal */}
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        const r = 2;
        return (
          <mesh
            key={i}
            position={[Math.cos(angle) * r, 0.8, Math.sin(angle) * r]}
            castShadow
          >
            <boxGeometry args={[0.8, 1.6, 0.3]} />
            <meshStandardMaterial color={wallColor} roughness={0.8} />
          </mesh>
        );
      })}

      {/* Towers at corners */}
      {[0, Math.PI / 2, Math.PI, Math.PI * 1.5].map((angle, i) => {
        const r = 2.2;
        return (
          <mesh
            key={`tower-${i}`}
            position={[Math.cos(angle) * r, 1.2, Math.sin(angle) * r]}
            castShadow
          >
            <cylinderGeometry args={[0.3, 0.4, 2.4, 6]} />
            <meshStandardMaterial color={wallColor} roughness={0.7} />
          </mesh>
        );
      })}

      {/* Central building / palace */}
      <mesh position={[0, 1.2, 0]} castShadow>
        <boxGeometry args={[1.5, 2.4, 1.5]} />
        <meshStandardMaterial color={baseColor} roughness={0.6} metalness={0.2} />
      </mesh>

      {/* Dome */}
      <mesh position={[0, 2.6, 0]}>
        <sphereGeometry args={[0.7, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial
          color={city.conquered ? "#00e5ff" : "#c8a55a"}
          roughness={0.3}
          metalness={0.5}
        />
      </mesh>

      {/* Conquered flag */}
      {city.conquered && (
        <group position={[0, 3.5, 0]} ref={flagRef}>
          <mesh position={[0, 0.5, 0]}>
            <cylinderGeometry args={[0.03, 0.03, 1.5, 4]} />
            <meshStandardMaterial color="#666" />
          </mesh>
          <mesh position={[0.35, 1, 0]}>
            <planeGeometry args={[0.7, 0.4]} />
            <meshStandardMaterial color="#00c8d4" side={THREE.DoubleSide} />
          </mesh>
        </group>
      )}

      {/* Glow for hovered or target */}
      {(hovered || isTarget) && (
        <mesh ref={glowRef} rotation-x={-Math.PI / 2} position={[0, 0.1, 0]}>
          <ringGeometry args={[2.5, 3.5, 32]} />
          <meshBasicMaterial
            color={isTarget ? "#ffcc00" : city.conquered ? "#00e5ff" : "#ff8800"}
            transparent
            opacity={0.5}
          />
        </mesh>
      )}

      {/* Fire effect for recently conquered */}
      {city.conquered && (
        <>
          {[[-0.5, 0], [0.5, 0], [0, 0.5]].map(([fx, fz], i) => (
            <pointLight
              key={`fire-${i}`}
              position={[fx, 1.5, fz]}
              color="#ff6600"
              intensity={0.5}
              distance={5}
            />
          ))}
        </>
      )}

      {/* City name label */}
      <Billboard position={[0, 4.5, 0]}>
        <Text
          fontSize={0.8}
          color={city.conquered ? "#00e5ff" : "#e8d5a0"}
          anchorX="center"
          anchorY="bottom"
          outlineWidth={0.05}
          outlineColor="#000000"
          font={undefined}
        >
          {city.name}
        </Text>
        <Text
          fontSize={0.4}
          color="#888"
          anchorX="center"
          anchorY="top"
          position={[0, -0.1, 0]}
          font={undefined}
        >
          {city.conquered ? "⚔ Zabt etilgan" : `🛡 ${city.defenseLevel}/10`}
        </Text>
      </Billboard>
    </group>
  );
};

export default CityModel;

import { useRef, useCallback, useState, useEffect } from "react";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { OrbitControls, Sky, Stars } from "@react-three/drei";
import * as THREE from "three";
import Terrain, { Water } from "./Terrain";
import CityModel from "./CityModel";
import ArmyUnit from "./ArmyUnit";
import BattleScene3D from "./BattleScene3D";
import SiegeEffect from "./SiegeEffect";
import type { City, Army, BattleEvent } from "./types";

interface GameSceneProps {
  cities: City[];
  armies: Army[];
  selectedArmyId: string | null;
  activeBattle: BattleEvent | null;
  siegeCity: string | null;
  onCityClick: (city: City) => void;
  onArmyClick: (army: Army) => void;
  onGroundClick: (point: [number, number, number]) => void;
  cameraTarget: [number, number, number] | null;
}

const CameraController = ({ target }: { target: [number, number, number] | null }) => {
  const { camera } = useThree();
  const targetVec = useRef(new THREE.Vector3(0, 0, 0));

  useFrame(() => {
    if (target) {
      targetVec.current.lerp(new THREE.Vector3(...target), 0.02);
    }
  });

  return null;
};

const GroundPlane = ({ onClick }: { onClick: (point: [number, number, number]) => void }) => {
  return (
    <mesh
      rotation-x={-Math.PI / 2}
      position={[0, -0.01, 0]}
      onClick={(e) => {
        e.stopPropagation();
        const p = e.point;
        onClick([p.x, 0, p.z]);
      }}
      visible={false}
    >
      <planeGeometry args={[200, 200]} />
      <meshBasicMaterial />
    </mesh>
  );
};

// Road paths between cities
const Roads = ({ cities }: { cities: City[] }) => {
  const roads = [
    ["samarkand", "herat"],
    ["samarkand", "kondurcha"],
    ["samarkand", "tabriz"],
    ["tabriz", "baghdad"],
    ["tabriz", "ankara"],
    ["kondurcha", "terek"],
    ["herat", "delhi"],
    ["baghdad", "ankara"],
  ];

  return (
    <group>
      {roads.map(([from, to], i) => {
        const c1 = cities.find((c) => c.id === from);
        const c2 = cities.find((c) => c.id === to);
        if (!c1 || !c2) return null;

        const points = [
          new THREE.Vector3(...c1.position),
          new THREE.Vector3(
            (c1.position[0] + c2.position[0]) / 2,
            0.15,
            (c1.position[2] + c2.position[2]) / 2
          ),
          new THREE.Vector3(...c2.position),
        ];
        const curve = new THREE.QuadraticBezierCurve3(points[0], points[1], points[2]);
        const linePoints = curve.getPoints(30);

        return (
          <line key={i}>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                count={linePoints.length}
                array={new Float32Array(linePoints.flatMap((p) => [p.x, 0.12, p.z]))}
                itemSize={3}
              />
            </bufferGeometry>
            <lineBasicMaterial color="#5a4a30" transparent opacity={0.4} />
          </line>
        );
      })}
    </group>
  );
};

// Movement path indicator
const MovementPath = ({ from, to }: { from: [number, number, number]; to: [number, number, number] }) => {
  const points = [];
  const segments = 20;
  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    points.push(
      THREE.MathUtils.lerp(from[0], to[0], t),
      0.15,
      THREE.MathUtils.lerp(from[2], to[2], t)
    );
  }

  return (
    <line>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={segments + 1}
          array={new Float32Array(points)}
          itemSize={3}
        />
      </bufferGeometry>
      <lineBasicMaterial color="#00ff88" transparent opacity={0.5} />
    </line>
  );
};

const GameScene = ({
  cities,
  armies,
  selectedArmyId,
  activeBattle,
  siegeCity,
  onCityClick,
  onArmyClick,
  onGroundClick,
  cameraTarget,
}: GameSceneProps) => {
  const selectedArmy = armies.find((a) => a.id === selectedArmyId);

  return (
    <Canvas
      shadows
      camera={{ position: [30, 40, 30], fov: 45, near: 0.1, far: 500 }}
      style={{ width: "100%", height: "100%" }}
      gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.2 }}
    >
      {/* Lighting */}
      <ambientLight intensity={0.3} color="#c8b080" />
      <directionalLight
        position={[30, 50, 20]}
        intensity={1.5}
        color="#ffe8c0"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-far={150}
        shadow-camera-left={-60}
        shadow-camera-right={60}
        shadow-camera-top={60}
        shadow-camera-bottom={-60}
      />
      <directionalLight position={[-20, 30, -10]} intensity={0.3} color="#8080ff" />

      {/* Atmosphere */}
      <Sky sunPosition={[100, 20, 50]} turbidity={8} rayleigh={1.5} />
      <Stars radius={100} depth={50} count={1000} factor={4} />
      <fog attach="fog" args={["#1a1510", 60, 150]} />

      {/* Camera controls */}
      <OrbitControls
        enableDamping
        dampingFactor={0.08}
        maxPolarAngle={Math.PI / 2.3}
        minPolarAngle={Math.PI / 8}
        minDistance={10}
        maxDistance={80}
        target={cameraTarget ? new THREE.Vector3(...cameraTarget) : undefined}
      />

      <CameraController target={cameraTarget} />

      {/* Terrain */}
      <Terrain />
      <Water />

      {/* Roads */}
      <Roads cities={cities} />

      {/* Ground click plane */}
      <GroundPlane onClick={onGroundClick} />

      {/* Cities */}
      {cities.map((city) => (
        <CityModel
          key={city.id}
          city={city}
          onClick={onCityClick}
          isTarget={
            selectedArmy?.targetPosition != null &&
            Math.abs(selectedArmy.targetPosition[0] - city.position[0]) < 3 &&
            Math.abs(selectedArmy.targetPosition[2] - city.position[2]) < 3
          }
        />
      ))}

      {/* Siege effects */}
      {cities
        .filter((c) => c.id === siegeCity)
        .map((c) => (
          <SiegeEffect key={c.id} position={c.position} active />
        ))}

      {/* Armies */}
      {armies.map((army) => (
        <ArmyUnit key={army.id} army={army} onClick={onArmyClick} />
      ))}

      {/* Active battle */}
      {activeBattle && (
        <BattleScene3D position={activeBattle.position} phase={activeBattle.phase} />
      )}

      {/* Movement path for selected army */}
      {selectedArmy?.targetPosition && (
        <MovementPath from={selectedArmy.position} to={selectedArmy.targetPosition} />
      )}
    </Canvas>
  );
};

export default GameScene;

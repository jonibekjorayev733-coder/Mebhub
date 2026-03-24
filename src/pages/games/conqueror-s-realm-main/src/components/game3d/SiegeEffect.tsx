import { useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

interface SiegeEffectProps {
  position: [number, number, number];
  active: boolean;
}

const SiegeEffect = ({ position, active }: SiegeEffectProps) => {
  const fireRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!fireRef.current || !active) return;
    fireRef.current.children.forEach((child, i) => {
      const mesh = child as THREE.Mesh;
      const t = (clock.elapsedTime * 2 + i * 0.5) % 2;
      mesh.position.y = t * 1.5;
      mesh.scale.setScalar(0.3 * (1 - t / 2));
      (mesh.material as THREE.MeshBasicMaterial).opacity = 0.8 * (1 - t / 2);
    });
  });

  if (!active) return null;

  return (
    <group position={position}>
      {/* Fire columns */}
      <group ref={fireRef}>
        {Array.from({ length: 8 }).map((_, i) => {
          const angle = (i / 8) * Math.PI * 2;
          return (
            <mesh key={i} position={[Math.cos(angle) * 2, 0, Math.sin(angle) * 2]}>
              <sphereGeometry args={[0.3, 4, 4]} />
              <meshBasicMaterial color="#ff4400" transparent opacity={0.8} />
            </mesh>
          );
        })}
      </group>

      {/* Smoke cloud */}
      <mesh position={[0, 3, 0]}>
        <sphereGeometry args={[2, 8, 8]} />
        <meshStandardMaterial color="#444" transparent opacity={0.2} />
      </mesh>

      {/* Ground fire glow */}
      <pointLight position={[0, 2, 0]} color="#ff4400" intensity={3} distance={10} />
    </group>
  );
};

export default SiegeEffect;

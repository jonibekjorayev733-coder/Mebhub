import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { TERRAIN_SIZE } from "./types";

// Generate terrain height map with mountains, valleys, roads
const generateHeightMap = (size: number, resolution: number) => {
  const data = new Float32Array(resolution * resolution);
  for (let i = 0; i < resolution; i++) {
    for (let j = 0; j < resolution; j++) {
      const x = (i / resolution - 0.5) * size;
      const z = (j / resolution - 0.5) * size;
      // Multiple octaves of noise-like terrain
      let h = 0;
      h += Math.sin(x * 0.05) * Math.cos(z * 0.07) * 2;
      h += Math.sin(x * 0.12 + 1) * Math.cos(z * 0.09 + 2) * 1.2;
      h += Math.sin(x * 0.03 + z * 0.04) * 3;
      // Mountain ranges
      const distFromCenter = Math.sqrt(x * x + z * z);
      if (distFromCenter > 35) h += (distFromCenter - 35) * 0.3;
      // Flatten near cities
      const cityPositions = [[0, 0], [-25, 15], [20, 25], [-35, -10], [-15, -25], [-5, -20], [12, 8], [-20, -5]];
      for (const [cx, cz] of cityPositions) {
        const d = Math.sqrt((x - cx) ** 2 + (z - cz) ** 2);
        if (d < 5) h *= d / 5;
      }
      data[i * resolution + j] = Math.max(0, h);
    }
  }
  return data;
};

const Terrain = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const resolution = 128;

  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(TERRAIN_SIZE * 2, TERRAIN_SIZE * 2, resolution - 1, resolution - 1);
    geo.rotateX(-Math.PI / 2);
    const heightMap = generateHeightMap(TERRAIN_SIZE * 2, resolution);
    const positions = geo.attributes.position;
    const colors = new Float32Array(positions.count * 3);

    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i);
      const z = positions.getZ(i);
      const ix = Math.floor(((x / (TERRAIN_SIZE * 2)) + 0.5) * (resolution - 1));
      const iz = Math.floor(((z / (TERRAIN_SIZE * 2)) + 0.5) * (resolution - 1));
      const idx = Math.min(ix, resolution - 1) * resolution + Math.min(iz, resolution - 1);
      const h = heightMap[idx] || 0;
      positions.setY(i, h);

      // Color based on height
      if (h < 0.5) {
        // Desert / plains - sandy
        colors[i * 3] = 0.55 + Math.random() * 0.05;
        colors[i * 3 + 1] = 0.42 + Math.random() * 0.05;
        colors[i * 3 + 2] = 0.25;
      } else if (h < 2) {
        // Grasslands
        colors[i * 3] = 0.2 + Math.random() * 0.05;
        colors[i * 3 + 1] = 0.35 + Math.random() * 0.08;
        colors[i * 3 + 2] = 0.15;
      } else if (h < 4) {
        // Hills - brown/olive
        colors[i * 3] = 0.35;
        colors[i * 3 + 1] = 0.28 + Math.random() * 0.05;
        colors[i * 3 + 2] = 0.18;
      } else {
        // Mountains - grey/snow
        const snowFactor = Math.min(1, (h - 4) / 4);
        colors[i * 3] = 0.4 + snowFactor * 0.5;
        colors[i * 3 + 1] = 0.38 + snowFactor * 0.5;
        colors[i * 3 + 2] = 0.35 + snowFactor * 0.55;
      }
    }

    geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    geo.computeVertexNormals();
    return geo;
  }, []);

  return (
    <mesh ref={meshRef} geometry={geometry} receiveShadow>
      <meshStandardMaterial vertexColors side={THREE.DoubleSide} roughness={0.9} metalness={0.05} />
    </mesh>
  );
};

// Water plane
export const Water = () => {
  const ref = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.position.y = -0.3 + Math.sin(clock.elapsedTime * 0.5) * 0.05;
    }
  });

  return (
    <mesh ref={ref} rotation-x={-Math.PI / 2} position={[0, -0.3, 0]}>
      <planeGeometry args={[TERRAIN_SIZE * 3, TERRAIN_SIZE * 3]} />
      <meshStandardMaterial color="#1a4a5a" transparent opacity={0.7} roughness={0.3} metalness={0.6} />
    </mesh>
  );
};

export default Terrain;

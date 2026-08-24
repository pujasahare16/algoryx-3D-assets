'use client';

import { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, Grid, Center, Float } from '@react-three/drei';
import * as THREE from 'three';

// Procedural 3D geometric shape for the hero section
function HeroGeometry() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.15;
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.05;
    }
  });

  return (
    <group ref={groupRef}>
      <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.3}>
        <Center>
          {/* Main torus knot */}
          <mesh position={[0, 0, 0]} castShadow>
            <torusKnotGeometry args={[1, 0.35, 128, 32]} />
            <meshPhysicalMaterial
              color="#0d9488"
              roughness={0.15}
              metalness={0.9}
              clearcoat={0.5}
              clearcoatRoughness={0.1}
              envMapIntensity={1.5}
            />
          </mesh>

          {/* Accent ring */}
          <mesh position={[0, 0, 0]} rotation={[Math.PI / 4, 0, Math.PI / 6]}>
            <torusGeometry args={[1.8, 0.02, 16, 100]} />
            <meshPhysicalMaterial
              color="#525252"
              roughness={0.3}
              metalness={0.8}
            />
          </mesh>

          {/* Small spheres */}
          {[0, 1, 2, 3, 4, 5].map((i) => {
            const angle = (i / 6) * Math.PI * 2;
            const x = Math.cos(angle) * 2;
            const z = Math.sin(angle) * 2;
            return (
              <mesh key={i} position={[x, 0, z]}>
                <sphereGeometry args={[0.06, 16, 16]} />
                <meshPhysicalMaterial
                  color="#737373"
                  roughness={0.2}
                  metalness={0.9}
                />
              </mesh>
            );
          })}
        </Center>
      </Float>
    </group>
  );
}

export default function HeroScene() {
  return (
    <div className="w-full h-full min-h-[400px]">
      <Canvas
        camera={{ position: [4, 2, 5], fov: 40 }}
        gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.2 }}
      >
        <Suspense fallback={null}>
          <HeroGeometry />
          <Environment preset="studio" />
          <Grid
            args={[20, 20]}
            position={[0, -1.5, 0]}
            cellSize={0.5}
            cellThickness={0.5}
            cellColor="#1a1a1a"
            sectionSize={2}
            sectionThickness={1}
            sectionColor="#2a2a2a"
            fadeDistance={12}
            fadeStrength={1.5}
            infiniteGrid
          />
        </Suspense>
        <OrbitControls
          enableZoom
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.8}
          minDistance={4}
          maxDistance={12}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 2.2}
        />
      </Canvas>
    </div>
  );
}

"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Stars } from "@react-three/drei";
import { useRef, useMemo, Suspense } from "react";
import * as THREE from "three";

function FlameParticles() {
  const count = 200;
  const mesh = useRef<THREE.Points>(null);

  const [positions, colors, sizes] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const siz = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 10;
      pos[i * 3 + 1] = Math.random() * 8 - 2;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10;

      const colorChoice = Math.random();
      if (colorChoice < 0.33) {
        col[i * 3] = 1; col[i * 3 + 1] = 0.42; col[i * 3 + 2] = 0;
      } else if (colorChoice < 0.66) {
        col[i * 3] = 1; col[i * 3 + 1] = 0.18; col[i * 3 + 2] = 0.47;
      } else {
        col[i * 3] = 0; col[i * 3 + 1] = 0.94; col[i * 3 + 2] = 1;
      }
      siz[i] = Math.random() * 3 + 1;
    }
    return [pos, col, siz];
  }, []);

  useFrame((state) => {
    if (!mesh.current) return;
    const positions = mesh.current.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < count; i++) {
      positions[i * 3 + 1] += 0.02 + Math.random() * 0.01;
      if (positions[i * 3 + 1] > 6) {
        positions[i * 3 + 1] = -2;
        positions[i * 3] = (Math.random() - 0.5) * 10;
      }
    }
    mesh.current.geometry.attributes.position.needsUpdate = true;
    mesh.current.rotation.y = state.clock.elapsedTime * 0.05;
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
        <bufferAttribute attach="attributes-size" args={[sizes, 1]} />
      </bufferGeometry>
      <pointsMaterial size={0.08} vertexColors transparent opacity={0.8} sizeAttenuation />
    </points>
  );
}

function CyberClaw() {
  const group = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!group.current) return;
    group.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.3;
    group.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <group ref={group}>
        {/* Central Core */}
        <mesh>
          <icosahedronGeometry args={[1.2, 2]} />
          <meshStandardMaterial
            color="#ff2d78"
            emissive="#ff2d78"
            emissiveIntensity={0.5}
            wireframe
          />
        </mesh>

        {/* Inner glow sphere */}
        <mesh>
          <sphereGeometry args={[0.8, 32, 32]} />
          <meshStandardMaterial
            color="#00f0ff"
            emissive="#00f0ff"
            emissiveIntensity={1}
            transparent
            opacity={0.3}
          />
        </mesh>

        {/* Claw arms */}
        {[0, 1, 2, 3, 4].map((i) => (
          <group key={i} rotation={[0, (i * Math.PI * 2) / 5, Math.PI * 0.15]}>
            <mesh position={[0, 1.8, 0]}>
              <coneGeometry args={[0.15, 1.5, 4]} />
              <meshStandardMaterial
                color="#ff6b00"
                emissive="#ff6b00"
                emissiveIntensity={0.6}
                metalness={0.9}
                roughness={0.1}
              />
            </mesh>
          </group>
        ))}

        {/* Orbital rings */}
        <mesh rotation={[Math.PI / 3, 0, 0]}>
          <torusGeometry args={[2, 0.02, 16, 100]} />
          <meshStandardMaterial color="#00f0ff" emissive="#00f0ff" emissiveIntensity={2} />
        </mesh>
        <mesh rotation={[-Math.PI / 4, Math.PI / 4, 0]}>
          <torusGeometry args={[2.3, 0.015, 16, 100]} />
          <meshStandardMaterial color="#ff00ff" emissive="#ff00ff" emissiveIntensity={2} />
        </mesh>
      </group>
    </Float>
  );
}

function FlyingCar({ position, speed }: { position: [number, number, number]; speed: number }) {
  const mesh = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!mesh.current) return;
    mesh.current.position.x = Math.sin(state.clock.elapsedTime * speed + position[0]) * 8;
    mesh.current.position.z = Math.cos(state.clock.elapsedTime * speed + position[2]) * 5;
  });

  return (
    <mesh ref={mesh} position={position}>
      <boxGeometry args={[0.3, 0.1, 0.6]} />
      <meshStandardMaterial
        color="#ff2d78"
        emissive="#ff2d78"
        emissiveIntensity={1}
        transparent
        opacity={0.7}
      />
    </mesh>
  );
}

export default function HeroScene() {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 60 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.2} />
          <pointLight position={[5, 5, 5]} intensity={1} color="#00f0ff" />
          <pointLight position={[-5, -5, 5]} intensity={0.8} color="#ff2d78" />
          <pointLight position={[0, 3, 0]} intensity={0.5} color="#ff6b00" />

          <CyberClaw />
          <FlameParticles />

          <FlyingCar position={[3, 3, -2]} speed={0.2} />
          <FlyingCar position={[-4, 4, 1]} speed={0.15} />
          <FlyingCar position={[2, 5, -3]} speed={0.25} />

          <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade speed={1} />
        </Suspense>
      </Canvas>
    </div>
  );
}

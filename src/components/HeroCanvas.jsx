import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial, Stars, Float, Text3D } from '@react-three/drei';
import * as THREE from 'three';

function GoldenStar({ position, scale = 1 }) {
  const meshRef = useRef();
  const speed = useMemo(() => 0.3 + Math.random() * 0.4, []);
  const offset = useMemo(() => Math.random() * Math.PI * 2, []);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * speed + offset;
      meshRef.current.rotation.y = state.clock.elapsedTime * speed * 0.7;
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.5 + offset) * 0.5;
    }
  });

  return (
    <mesh ref={meshRef} position={position} scale={scale}>
      <octahedronGeometry args={[0.3, 0]} />
      <meshStandardMaterial
        color="#c8a951"
        emissive="#8a6e2a"
        emissiveIntensity={0.5}
        metalness={0.9}
        roughness={0.1}
      />
    </mesh>
  );
}

function GlowingSphere({ position, color, size = 1 }) {
  const meshRef = useRef();
  const offset = useMemo(() => Math.random() * Math.PI * 2, []);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.3 + offset) * 0.8;
      meshRef.current.material.distort = 0.3 + Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
    }
  });

  return (
    <Sphere ref={meshRef} args={[size, 64, 64]} position={position}>
      <MeshDistortMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.2}
        transparent
        opacity={0.15}
        distort={0.3}
        speed={2}
        roughness={0.1}
        metalness={0.5}
      />
    </Sphere>
  );
}

function Ring({ radius, color, speed = 0.2, tilt = 0 }) {
  const meshRef = useRef();

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.z = state.clock.elapsedTime * speed;
    }
  });

  return (
    <mesh ref={meshRef} rotation={[tilt, 0, 0]}>
      <torusGeometry args={[radius, 0.01, 16, 200]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.8}
        transparent
        opacity={0.4}
      />
    </mesh>
  );
}

function ParticleField() {
  const count = 150;
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 30;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 15;
    }
    return pos;
  }, []);

  const particlesRef = useRef();

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.03;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.06}
        color="#c8a951"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
}

function CentralOrb() {
  const groupRef = useRef();

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      <GlowingSphere position={[0, 0, -5]} color="#c8a951" size={2} />
      <Ring radius={3.5} color="#c8a951" speed={0.15} tilt={Math.PI / 6} />
      <Ring radius={4.5} color="#8a6e2a" speed={-0.1} tilt={-Math.PI / 4} />
      <Ring radius={5.5} color="#c8a951" speed={0.08} tilt={Math.PI / 3} />
    </group>
  );
}

export default function HeroCanvas() {
  const stars = useMemo(() =>
    Array.from({ length: 5 }, (_, i) => ({
      id: i,
      position: [
        (Math.random() - 0.5) * 14,
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 5,
      ],
      scale: 0.5 + Math.random() * 1,
    })), []
  );

  return (
    <Canvas
      camera={{ position: [0, 0, 10], fov: 60 }}
      style={{ background: 'transparent' }}
      gl={{ alpha: true, antialias: true }}
    >
      <ambientLight intensity={0.4} color="#c8a951" />
      <pointLight position={[5, 5, 5]} intensity={2} color="#f5d76e" />
      <pointLight position={[-5, -5, 5]} intensity={1} color="#c0392b" />
      <pointLight position={[0, 0, 8]} intensity={1.5} color="#c8a951" />

      <Stars radius={80} depth={50} count={3000} factor={3} saturation={0} fade speed={0.5} />
      <ParticleField />
      <CentralOrb />

      {stars.map((star) => (
        <Float key={star.id} speed={1.5} rotationIntensity={1} floatIntensity={2}>
          <GoldenStar position={star.position} scale={star.scale} />
        </Float>
      ))}

      <GlowingSphere position={[-6, 3, -8]} color="#c0392b" size={1.5} />
      <GlowingSphere position={[7, -2, -10]} color="#c8a951" size={1} />
    </Canvas>
  );
}

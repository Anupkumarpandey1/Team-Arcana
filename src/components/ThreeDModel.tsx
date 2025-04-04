import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, Float, PresentationControls } from '@react-three/drei';
import * as THREE from 'three';

// 3D Pen Model Component
const PenModel = () => {
  const penBodyRef = useRef<THREE.Group>(null);
  const capRef = useRef<THREE.Mesh>(null);
  const [capRemoved, setCapRemoved] = React.useState(false);
  
  useFrame((state, delta) => {
    if (penBodyRef.current) {
      // Smoother floating rotation
      penBodyRef.current.rotation.y += delta * 0.15;
    }
    
    if (capRef.current && capRemoved) {
      // Enhanced cap animation
      capRef.current.position.y += delta * 0.3;
      capRef.current.rotation.z += delta * 0.8;
      capRef.current.position.x = Math.sin(state.clock.elapsedTime) * 0.2;
      
      if (capRef.current.position.y > 3) {
        setCapRemoved(false);
        capRef.current.position.set(0, 1.6, 0);
        capRef.current.rotation.z = 0;
      }
    }
  });

  const handleCapClick = () => {
    setCapRemoved(true);
  };
  
  return (
    <group position={[0, 0, 0]} scale={2}>
      {/* Pen Body */}
      <group ref={penBodyRef}>
        {/* Main Pen Body */}
        <mesh castShadow receiveShadow position={[0, 0, 0]}>
          <cylinderGeometry args={[0.15, 0.15, 2, 32]} />
          <meshStandardMaterial 
            color="#6366F1"
            metalness={0.7}
            roughness={0.2}
          />
        </mesh>
        
        {/* Pen Clip */}
        <mesh castShadow position={[0, 0.6, 0.14]}>
          <boxGeometry args={[0.08, 0.7, 0.03]} />
          <meshStandardMaterial 
            color="#1E40AF"
            metalness={0.9}
            roughness={0.1}
          />
        </mesh>
        
        {/* Pen Tip */}
        <mesh castShadow position={[0, -1.2, 0]} rotation={[Math.PI, 0, 0]}>
  <coneGeometry args={[0.15, 0.3, 32]} />
  <meshStandardMaterial 
    color="#C084FC"
    metalness={0.7}
    roughness={0.1}
  />
</mesh>

        
        {/* Pen Middle Ring */}
        <mesh castShadow position={[0, 0.3, 0]}>
          <torusGeometry args={[0.17, 0.04, 16, 32]} />
          <meshStandardMaterial 
            color="#F59E0B"
            metalness={0.9}
            roughness={0.1}
          />
        </mesh>
      </group>
      
      {/* Pen Cap - Interactive */}
      <mesh 
        ref={capRef}
        castShadow 
        position={[0, 1.6, 0]}
        onClick={handleCapClick}
      >
        <cylinderGeometry args={[0.17, 0.17, 0.4, 32]} />
        <meshStandardMaterial 
          color="#1E40AF"
          metalness={0.8}
          roughness={0.2}
          emissive={capRemoved ? "#4F46E5" : "#000000"}
          emissiveIntensity={capRemoved ? 0.5 : 0}
        />
      </mesh>
    </group>
  );
};

interface ThreeDModelProps {
  className?: string;
}

const ThreeDModel = ({ className }: ThreeDModelProps) => {
  return (
    <div className={`w-full h-[700px] ${className}`}>
      <Canvas 
        camera={{ position: [0, 0, 8], fov: 60 }}
        dpr={[1, 2]}
        shadows
      >
        <color attach="background" args={['#F8FAFC']} />
        <ambientLight intensity={0.8} />
        <directionalLight 
          position={[10, 10, 5]} 
          intensity={1.4} 
          castShadow 
          shadow-mapSize={[2048, 2048]}
        />
        <spotLight
          position={[-10, -10, -5]}
          intensity={0.4}
          color="#8B5CF6"
        />
        <PresentationControls
          global
          rotation={[0, -0.3, 0]}
          polar={[-Math.PI / 3, Math.PI / 3]}
          azimuth={[-Math.PI / 3, Math.PI / 3]}
          config={{ mass: 2, tension: 400 }}
          snap={{ mass: 4, tension: 300 }}
        >
          <Float
            speed={2}
            rotationIntensity={0.5}
            floatIntensity={0.5}
          >
            <PenModel />
          </Float>
        </PresentationControls>
        <Environment preset="city" />
      </Canvas>
      <div className="text-center text-sm text-gray-500 mt-4">
        Click on the pen cap to see it animate • Drag to rotate the view
      </div>
    </div>
  );
};

export default ThreeDModel;

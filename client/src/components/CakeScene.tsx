import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Float, PerformanceMonitor, Sparkles, Environment } from "@react-three/drei";
import { EffectComposer, Bloom, DepthOfField, Vignette, Noise } from "@react-three/postprocessing";
import { useRef, useMemo, useState } from "react";
import * as THREE from "three";
import { useIsMobile } from "@/hooks/useMobile";

function CakeSlice({ 
  startAngle, 
  endAngle, 
  color, 
  jamColor, 
  isActive, 
  isFinale,
  index,
  lit,
  extinguished,
  intensity,
  onFlameClick
}: { 
  startAngle: number; 
  endAngle: number; 
  color: string; 
  jamColor: string;
  isActive: boolean;
  isFinale: boolean;
  index: number;
  lit: boolean;
  extinguished: boolean;
  intensity: number;
  onFlameClick?: () => void;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const midA = (startAngle + endAngle) / 2;

  useFrame(() => {
    if (!groupRef.current) return;
    const g = groupRef.current;
    
    let targetX = 0; let targetY = 0; let targetZ = 0;
    
    if (isFinale) {
      targetX = Math.cos(midA) * 0.15;
      targetZ = -Math.sin(midA) * 0.15;
      targetY = 0;
    } else if (isActive) {
      targetX = Math.cos(midA) * 0.7;
      targetZ = -Math.sin(midA) * 0.7;
      targetY = 0.2;
    }

    g.position.x += (targetX - g.position.x) * 0.05;
    g.position.y += (targetY - g.position.y) * 0.05;
    g.position.z += (targetZ - g.position.z) * 0.05;
  });

  const geometry = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(0, 0);
    shape.arc(0, 0, 1.2, startAngle, endAngle, false);
    shape.lineTo(0, 0);
    return new THREE.ExtrudeGeometry(shape, { depth: 0.6, bevelEnabled: true, bevelSegments: 4, steps: 2, bevelSize: 0.02, bevelThickness: 0.02 });
  }, [startAngle, endAngle]);

  const jamGeo = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(0, 0);
    shape.arc(0, 0, 1.15, startAngle, endAngle, false);
    shape.lineTo(0, 0);
    return new THREE.ExtrudeGeometry(shape, { depth: 0.1, bevelEnabled: false });
  }, [startAngle, endAngle]);

  return (
    <group ref={groupRef}>
      <mesh geometry={geometry} position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} castShadow receiveShadow>
        <meshPhysicalMaterial color={color} roughness={0.9} clearcoat={0} bumpScale={0.05} />
      </mesh>
      
      <mesh geometry={jamGeo} position={[0, 0.25, 0]} rotation={[-Math.PI / 2, 0, 0]} castShadow receiveShadow>
        <meshPhysicalMaterial color={jamColor} roughness={0.1} transmission={0.95} thickness={0.5} ior={1.5} />
      </mesh>

      <mesh position={[Math.cos(midA) * 0.8, 0.7, -Math.sin(midA) * 0.8]} castShadow>
        <sphereGeometry args={[0.15, 32, 32]} />
        <meshPhysicalMaterial color="#990000" roughness={0.1} clearcoat={1} clearcoatRoughness={0.1} transmission={0.2} />
      </mesh>
      <mesh position={[Math.cos(midA) * 0.8, 0.85, -Math.sin(midA) * 0.8]} rotation={[0, 0, 0.5]}>
        <cylinderGeometry args={[0.01, 0.01, 0.3]} />
        <meshStandardMaterial color="#4A5D23" />
      </mesh>

      <group position={[Math.cos(midA) * 0.3, 0.6, -Math.sin(midA) * 0.3]}>
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[0.04, 0.04, 0.4]} />
          <meshPhysicalMaterial color="#F4F1EA" roughness={0.3} clearcoat={0.5} />
        </mesh>
        
        <mesh position={[0, 0.22, 0]}>
          <cylinderGeometry args={[0.005, 0.005, 0.06]} />
          <meshStandardMaterial color="#222" />
        </mesh>
        
        {lit && !extinguished && (
          <mesh position={[0, 0.35 + intensity * 0.05, 0]} scale={1 + intensity * 0.5} onClick={(e) => { e.stopPropagation(); onFlameClick?.(); }}>
            <sphereGeometry args={[0.05, 16, 16]} />
            <meshBasicMaterial color="#FFB84D" toneMapped={false} />
            <pointLight color="#FFB84D" intensity={2 + intensity * 2} distance={3} decay={2} castShadow />
          </mesh>
        )}
      </group>
    </group>
  );
}

function CakeAssembly({ 
  lit, 
  extinguished, 
  intensity,
  scrollProgress,
  onFlameClick,
  holdFinalSlice = false,
  mobile = false
}: { 
  lit: boolean; 
  extinguished: boolean; 
  intensity: number;
  scrollProgress: any;
  onFlameClick?: () => void;
  holdFinalSlice?: boolean;
  mobile?: boolean;
}) {
  const assemblyRef = useRef<THREE.Group>(null);
  const slices = [
    { id: 1, color: "#EEDBB5", jamColor: "#D4A017" },
    { id: 2, color: "#EEDBB5", jamColor: "#3D8B7A" },
    { id: 3, color: "#EEDBB5", jamColor: "#E09F3E" },
    { id: 4, color: "#EEDBB5", jamColor: "#E04848" },
  ];
  
  const anglePerSlice = (Math.PI * 2) / slices.length;

  useFrame(() => {
    if (!assemblyRef.current) return;
    const p = scrollProgress.get();
    
    let targetX = 0; let targetY = -0.5; let targetRotX = 0; let targetRotY = 0;
    
    if (holdFinalSlice) {
      const activeMid = (3 * anglePerSlice) + (anglePerSlice / 2);
      targetX = mobile ? -1.1 : -2.0;
      targetRotX = 0.4;
      targetRotY = -Math.PI / 2 - activeMid;
    } else if (p < 0.10) {
      targetX = 0.5; targetY = -0.9; targetRotX = 0.2; targetRotY = p * Math.PI;
    } else if (p < 0.26) {
      targetX = 0; targetRotX = 0.4; targetRotY = p * Math.PI;
    } else if (p < 0.88) {
      // Keep the 3D cake in sync with Home.tsx: slices start at 0.26 and end at 0.88.
      const sliceP = (p - 0.26) / 0.62;
      const idx = Math.min(3, Math.max(0, Math.floor(sliceP * 4)));
      const activeMid = (idx * anglePerSlice) + (anglePerSlice / 2);
      targetX = mobile ? -1.1 : -2.0; // Leave room for the narrative on small screens
      targetRotX = 0.4;
      targetRotY = -Math.PI / 2 - activeMid;
    } else {
      targetX = 0; targetY = -0.6; targetRotX = 0.5; targetRotY = 0;
    }
    
    const lerpRate = 0.05;
    assemblyRef.current.position.x += (targetX - assemblyRef.current.position.x) * lerpRate;
    assemblyRef.current.position.y += (targetY - assemblyRef.current.position.y) * lerpRate;
    assemblyRef.current.rotation.x += (targetRotX - assemblyRef.current.rotation.x) * lerpRate;
    
    let diff = targetRotY - assemblyRef.current.rotation.y;
    while (diff > Math.PI) diff -= Math.PI * 2;
    while (diff < -Math.PI) diff += Math.PI * 2;
    assemblyRef.current.rotation.y += diff * lerpRate;
  });

  const [localActive, setLocalActive] = useState(-1);
  const [localFinale, setLocalFinale] = useState(false);
  
  useFrame(() => {
    const p = scrollProgress.get();
    if (holdFinalSlice) { setLocalFinale(false); setLocalActive(3); }
    else if (p >= 0.88) { setLocalFinale(true); setLocalActive(-1); }
    else if (p >= 0.26) {
      setLocalFinale(false);
      setLocalActive(Math.min(3, Math.max(0, Math.floor(((p - 0.26) / 0.62) * 4))));
    } else {
      setLocalFinale(false); setLocalActive(-1);
    }
  });

  return (
    <group ref={assemblyRef}>
      <mesh position={[0, -0.05, 0]} receiveShadow>
        <cylinderGeometry args={[1.8, 1.8, 0.1, 64]} />
        <meshPhysicalMaterial color="#F7F5F0" roughness={0.1} clearcoat={1} transparent opacity={0.6} />
      </mesh>
      
      {slices.map((slice, i) => (
        <CakeSlice 
          key={slice.id} 
          index={i}
          startAngle={i * anglePerSlice} 
          endAngle={(i + 1) * anglePerSlice} 
          color={slice.color} 
          jamColor={slice.jamColor}
          isActive={localActive === i}
          isFinale={localFinale}
          lit={lit}
          extinguished={extinguished}
          intensity={intensity}
          onFlameClick={onFlameClick}
        />
      ))}
    </group>
  );
}

export default function CakeScene(props: any) {
  const [dpr, setDpr] = useState(1.5);
  const mobile = useIsMobile();
  return (
    <Canvas
      dpr={mobile ? 1 : dpr}
      shadows={!mobile}
      gl={{ alpha: true, antialias: !mobile, toneMapping: THREE.ACESFilmicToneMapping }}
      onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
      camera={{ position: [0, 2, 6], fov: 45 }}
    >
        <PerformanceMonitor onDecline={() => setDpr(1)} onIncline={() => setDpr(2)} />

      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 10, 5]} intensity={1.0} castShadow={!mobile} shadow-mapSize={[1024, 1024]} />
      <spotLight position={[-5, 2, -5]} intensity={2} color="#FFD700" distance={20} angle={0.8} />
      
      <Environment preset="city" />

      <Sparkles count={mobile ? 24 : 80} scale={12} size={3} speed={0.2} opacity={0.15} color="#FFD700" />

      <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.5}>
        <CakeAssembly {...props} mobile={mobile} />
      </Float>

      {/* Keep the transparent WebGL canvas as the source of truth for the
          paper background. The post-processing composer uses an opaque
          intermediate render target in this setup and paints it black. */}
      {!mobile && (
        <EffectComposer enabled={false} multisampling={4}>
          <DepthOfField focusDistance={0.0} focalLength={0.02} bokehScale={3} height={480} />
          <Bloom luminanceThreshold={2.0} mipmapBlur intensity={1.5} />
          <Noise opacity={0.05} />
          <Vignette eskil={false} offset={0.18} darkness={0.38} />
        </EffectComposer>
      )}

      <OrbitControls enableZoom={false} enablePan={false} maxPolarAngle={Math.PI / 2 + 0.1} minPolarAngle={Math.PI / 4} enableDamping />
    </Canvas>
  );
}

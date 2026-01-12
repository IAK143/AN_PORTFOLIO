import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, MeshTransmissionMaterial, Float, Sparkles, PerspectiveCamera, Stars, Instance, Instances } from '@react-three/drei';
import { EffectComposer, Bloom, Noise, Vignette, TiltShift, N8AO } from '@react-three/postprocessing';
import * as THREE from 'three';
import { MotionValue } from 'framer-motion';

// --- Configuration Types ---
type ArtifactConfig = {
    color: string;
    distortion: number;
    ringSpeed: number;
    emissiveIntensity: number;
    scale: number;
};

const DEFAULT_CONFIG: ArtifactConfig = {
    color: '#ffffff',
    distortion: 0.2,
    ringSpeed: 1,
    emissiveIntensity: 0.5,
    scale: 1
};

// --- Complex 3D Object: The CyberCore ---

const CoreGeometry = ({ config }: { config: React.MutableRefObject<ArtifactConfig> }) => {
    const meshRef = useRef<THREE.Mesh>(null);
    const materialRef = useRef<any>(null);

    useFrame((state, delta) => {
        if (meshRef.current && materialRef.current) {
            const target = config.current;
            materialRef.current.color.lerp(new THREE.Color(target.color), delta * 2);
            materialRef.current.distortion = THREE.MathUtils.lerp(materialRef.current.distortion, target.distortion, delta * 2);
            
            meshRef.current.rotation.x += delta * 0.2;
            meshRef.current.rotation.y += delta * 0.3;
        }
    });

    return (
        <mesh ref={meshRef}>
            <octahedronGeometry args={[1, 0]} />
            <MeshTransmissionMaterial 
                ref={materialRef}
                backside
                samples={16}
                resolution={512}
                transmission={0.95}
                roughness={0.1}
                clearcoat={1}
                thickness={2}
                chromaticAberration={0.3}
                anisotropy={0.3}
                ior={1.5}
                color="#ffffff"
            />
        </mesh>
    );
};

const DataRibbon = ({ radius, speed, axis, width, config }: { radius: number, speed: number, axis: 'x' | 'y' | 'z', width: number, config: React.MutableRefObject<ArtifactConfig> }) => {
    const ref = useRef<THREE.Mesh>(null);
    const matRef = useRef<THREE.MeshStandardMaterial>(null);

    useFrame((state, delta) => {
        if (ref.current) {
            const target = config.current;
            const currentSpeed = speed * target.ringSpeed;
            if (axis === 'x') ref.current.rotation.x += delta * currentSpeed;
            if (axis === 'y') ref.current.rotation.y += delta * currentSpeed;
            if (axis === 'z') ref.current.rotation.z += delta * currentSpeed;

            if (matRef.current) {
                 matRef.current.emissive.lerp(new THREE.Color(target.color), delta);
                 matRef.current.emissiveIntensity = THREE.MathUtils.lerp(matRef.current.emissiveIntensity, target.emissiveIntensity, delta);
            }
        }
    });

    return (
        <mesh ref={ref}>
            <torusGeometry args={[radius, width, 4, 64]} />
            <meshStandardMaterial 
                ref={matRef}
                color="#111" 
                metalness={0.9} 
                roughness={0.1} 
                emissive="#ffffff"
            />
        </mesh>
    );
};

const SatelliteCluster = () => {
    const groupRef = useRef<THREE.Group>(null);
    useFrame(({ clock }) => {
        if (groupRef.current) {
            groupRef.current.rotation.y = clock.elapsedTime * 0.1;
        }
    });

    return (
        <group ref={groupRef}>
             <Instances range={12}>
                <boxGeometry args={[0.2, 0.2, 0.2]} />
                <meshStandardMaterial color="#888" metalness={0.8} roughness={0.2} />
                {Array.from({ length: 12 }).map((_, i) => {
                    const angle = (i / 12) * Math.PI * 2;
                    const radius = 2.5;
                    return (
                        <Instance
                            key={i}
                            position={[Math.cos(angle) * radius, Math.sin(angle * 2) * 0.5, Math.sin(angle) * radius]}
                            rotation={[Math.random(), Math.random(), Math.random()]}
                        />
                    );
                })}
             </Instances>
        </group>
    );
}

const CyberCore = ({ scrollYProgress, activeProject }: { scrollYProgress: MotionValue<number>, activeProject: string | null }) => {
    const groupRef = useRef<THREE.Group>(null);
    const config = useRef<ArtifactConfig>(DEFAULT_CONFIG);

    useFrame((state) => {
        // --- 1. Evolution Logic ---
        let target = DEFAULT_CONFIG;
        switch (activeProject) {
            case 'airable':
                target = { ...DEFAULT_CONFIG, color: '#00ffee', distortion: 0.8, ringSpeed: 2, scale: 1.2 };
                break;
            case 'i12':
                target = { ...DEFAULT_CONFIG, color: '#0055ff', distortion: 0.1, ringSpeed: 0.5, scale: 1.1 };
                break;
            case 'qs':
                target = { ...DEFAULT_CONFIG, color: '#ff00aa', distortion: 1.2, ringSpeed: 1.5, emissiveIntensity: 1.5, scale: 1.3 };
                break;
            default:
                target = DEFAULT_CONFIG;
                break;
        }
        config.current = target;

        // --- 2. Choreography Logic (Object itself) ---
        if (groupRef.current) {
            const scroll = scrollYProgress.get();
            
            // Rotation based on scroll (Turntable effect)
            groupRef.current.rotation.y = scroll * Math.PI * 2; 
            groupRef.current.rotation.z = Math.sin(scroll * Math.PI) * 0.5;

            // Expansion/Breathing
            let expansion = 1 + Math.sin(state.clock.elapsedTime) * 0.05; // Idle breath
            
            // "Explosion" on projects section (0.4 - 0.6)
            if (scroll > 0.3 && scroll < 0.7) {
                const projectIntensity = Math.sin((scroll - 0.3) / 0.4 * Math.PI);
                expansion += projectIntensity * 0.5;
            }

            // Apply target scale from hover
            const targetScale = target.scale * expansion;
            groupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
        }
    });

    return (
        <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.5}>
            <group ref={groupRef}>
                <CoreGeometry config={config} />
                <group rotation={[Math.PI / 4, 0, 0]}>
                    <DataRibbon radius={1.4} width={0.05} speed={0.5} axis="z" config={config} />
                </group>
                <group rotation={[0, Math.PI / 4, 0]}>
                    <DataRibbon radius={1.8} width={0.02} speed={-0.3} axis="y" config={config} />
                </group>
                <group rotation={[0, 0, Math.PI / 4]}>
                    <DataRibbon radius={2.2} width={0.08} speed={0.2} axis="x" config={config} />
                </group>
                <SatelliteCluster />
            </group>
        </Float>
    );
};

// --- Camera System ---

const interpolate = (val: number, keyframes: { t: number, v: THREE.Vector3 }[]) => {
    for (let i = 0; i < keyframes.length - 1; i++) {
        const start = keyframes[i];
        const end = keyframes[i + 1];
        if (val >= start.t && val <= end.t) {
            const progress = (val - start.t) / (end.t - start.t);
            // Smoothstep ease
            const ease = progress * progress * (3 - 2 * progress);
            return new THREE.Vector3().lerpVectors(start.v, end.v, ease);
        }
    }
    return keyframes[keyframes.length - 1].v;
};

const CameraRig = ({ scrollYProgress }: { scrollYProgress: MotionValue<number> }) => {
    const { camera, pointer } = useThree();

    // Define cinematic waypoints for the camera
    const posKeyframes = useMemo(() => [
        { t: 0.0, v: new THREE.Vector3(-3, 0, 6) },         // Hero: Angled Left (Object on Right)
        { t: 0.25, v: new THREE.Vector3(-4, 2, 5) },       // About: Angled Top-Left
        { t: 0.5, v: new THREE.Vector3(0, 0, 9) },         // Projects: Wide Shot (Center)
        { t: 0.75, v: new THREE.Vector3(4, -2, 5) },       // Skills: Angled Bottom-Right
        { t: 1.0, v: new THREE.Vector3(0, 0, 3) }          // Contact: Macro Close-up
    ], []);

    useFrame((state, delta) => {
        const scroll = scrollYProgress.get();
        const targetPos = interpolate(scroll, posKeyframes);

        // Mouse Parallax (subtle)
        targetPos.x += (pointer.x * 0.2);
        targetPos.y += (pointer.y * 0.2);

        // Smooth camera movement
        camera.position.lerp(targetPos, delta * 2);
        
        // Always look at center
        camera.lookAt(0, 0, 0);
    });

    return null;
};

// --- Main Scene ---

export const ThreeScene: React.FC<{ scrollYProgress: MotionValue<number>, activeProject: string | null }> = ({ scrollYProgress, activeProject }) => {
  return (
    <div className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none">
      <Canvas dpr={[1, 2]} gl={{ antialias: false, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.1 }}>
        <PerspectiveCamera makeDefault position={[0, 0, 6]} fov={45} />
        <color attach="background" args={['#030303']} />
        
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        <Sparkles count={200} scale={10} size={1} speed={0.4} opacity={0.2} color="#ffffff" />
        
        <ambientLight intensity={0.1} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} color="#4a9eff" />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#ff00aa" />
        
        <CyberCore scrollYProgress={scrollYProgress} activeProject={activeProject} />
        <CameraRig scrollYProgress={scrollYProgress} />

        <EffectComposer>
            <N8AO 
                halfRes 
                color="black" 
                aoRadius={2} 
                intensity={1} 
                distanceFalloff={2} 
            />
            <Bloom 
                luminanceThreshold={0.5}
                mipmapBlur 
                intensity={1.2} 
                radius={0.4} 
            />
            <Noise opacity={0.05} />
            <Vignette eskil={false} offset={0.1} darkness={0.7} />
        </EffectComposer>
      </Canvas>
    </div>
  );
};
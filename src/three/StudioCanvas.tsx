import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, Environment, Lightformer, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { ReactNode } from "react";

/**
 * Rotates the environment map to follow the camera azimuth each frame —
 * the "softbox mounted on the camera" studio trick. Whatever face the
 * viewer looks at always catches the key light, so no orientation of the
 * model can present a dark, unlit face.
 */
function EnvFollow({ offset = 0.62 }: { offset?: number }) {
  const camera = useThree((s) => s.camera);
  const scene = useThree((s) => s.scene);
  useFrame(() => {
    const dir = camera.position.clone().normalize();
    const az = Math.atan2(dir.x, dir.z);
    if (scene.environmentRotation) {
      scene.environmentRotation.y = az + offset;
      scene.environmentRotation.x = 0;
    }
  });
  return null;
}

/** Shared dark-studio canvas (validated look from the test rig). */
export function StudioCanvas({
  children,
  cameraPosition = [2.6, 1.4, 3.2],
  fov = 38,
  controls = true,
  autoRotate = false,
  enableZoom = true,
  frameloop = "always",
}: {
  children: ReactNode;
  cameraPosition?: [number, number, number];
  fov?: number;
  controls?: boolean;
  autoRotate?: boolean;
  enableZoom?: boolean;
  frameloop?: "always" | "demand" | "never";
}) {
  return (
    <Canvas
      dpr={[1, 2]}
      frameloop={frameloop}
      camera={{ position: cameraPosition, fov }}
      gl={{ antialias: true, logarithmicDepthBuffer: true, preserveDrawingBuffer: true }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.05;
        // Self-shadowing is deliberately DISABLED (no shadow maps at all).
        // Shadow-mapped self-shadowing on thin curved metal causes shadow acne:
        // black bands/circles that appear and move during camera interaction.
        // Grounding is provided by <ContactShadows> instead, which uses its own
        // depth render and cannot exhibit acne on the model itself.
      }}
    >
      <color attach="background" args={["#17191c"]} />
      {/* 100% camera-locked lighting: ALL illumination comes from the
          environment rig below (which EnvFollow keeps aligned to the camera).
          Fixed directional lights are deliberately absent — a fixed light goes
          dark on steep features (seat cones, thread grooves) when the user
          orbits past it, which read as black rings/circles on the nut. */}
      <ambientLight intensity={0.12} />
      <Environment resolution={256}>
        {/* RAKING KEY — small panel, ~35° off the camera axis (the rig rotates
            with the camera via EnvFollow). Small size = sharp angular falloff,
            so adjacent hex flats shade differently and the nut reads as a
            hexagon from every angle, end-on included. */}
        <Lightformer intensity={7} position={[4.3, 3.4, 6.1]} scale={[2.3, 2.3, 1]} color="#ffffff" />
        {/* broad dim fill behind camera: keeps faces visible, never competes */}
        <Lightformer intensity={1.25} position={[0, 1.2, 7]} scale={[7, 5, 1]} color="#eef4f8" />
        {/* top soft light */}
        <Lightformer intensity={3} position={[0, 6, 0]} rotation-x={Math.PI / 2} scale={[7, 7, 1]} color="#ffffff" />
        {/* side accents */}
        <Lightformer intensity={1.5} position={[-6, 0.5, 2]} rotation-y={Math.PI / 2.4} scale={[5, 2, 1]} color="#dce8f2" />
        <Lightformer intensity={1.0} position={[0, 0.5, -6]} scale={[6, 2, 1]} color="#9db4c8" />
        {/* low front fill so the lower half of faces never goes black */}
        <Lightformer intensity={0.9} position={[0, -3, 5]} rotation-x={Math.PI / 3} scale={[8, 4, 1]} color="#b8c6d2" />
      </Environment>
      <EnvFollow />
      <EnvFollow />
      {children}
      <ContactShadows position={[0, -1.05, 0]} opacity={0.55} scale={8} blur={2.4} far={2} />
      {controls && (
        <OrbitControls
          enableDamping
          enablePan={false}
          enableZoom={enableZoom}
          minDistance={1.2}
          maxDistance={8}
          autoRotate={autoRotate}
          autoRotateSpeed={0.6}
        />
      )}
    </Canvas>
  );
}

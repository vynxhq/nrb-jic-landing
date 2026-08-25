import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import {
  dashDims,
  ferruleGeometry,
  insertGeometry,
  nutBodyGeometry,
  nutSpec,
  nutThreadRing,
  tubeGeometry,
} from "./jicGeometry";
import { MaterialKey, makeMaterial } from "./materials";

export interface JicSelection {
  dash: number;
  material: MaterialKey;
}

const EASE = (t: number) => 1 - Math.pow(1 - t, 3);

export type JicPart = "assembly" | "nut" | "insert" | "ferrule" | "tube";

/**
 * Full Female JIC connection laid out along the X axis (matches the reference
 * photography orientation). `explode` in [0,1] spreads the parts apart.
 * Assembly animates from exploded (1) to closed (0) on first load.
 * `part` renders a single component solo (used by catalog cards & configurator).
 */
export function JicAssembly({
  dash,
  material,
  explode,
  spin = true,
  part = "assembly",
  mouthDir,
}: JicSelection & {
  explode: number;
  spin?: boolean;
  part?: JicPart;
  mouthDir?: [number, number, number];
}) {
  const dims = useMemo(() => dashDims(dash), [dash]);
  const nutH = dims.tubeOD * 1.15; // nut height (matches jicGeometry)
  const mat = useMemo(() => makeMaterial(material), [material]);
  // The nut's hex must read as MACHINED FLATS, not a rounded cylinder.
  // LatheGeometry emits smooth averaged normals, which on a 6-segment prism
  // shades the hex like a cylinder (reads as a circle). Flat shading gives
  // each facet its own crisp normal. Applied to both nut solids.
  const matFlat = useMemo(() => {
    const m = mat.clone();
    m.flatShading = true;
    return m;
  }, [mat]);
  const matDark = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        // Matte, non-metallic near-black: bore depth must ABSORB light,
        // not mirror the studio rig (a metallic disc renders bright).
        color: new THREE.Color("#141618"),
        roughness: 0.95,
        metalness: 0.1,
      }),
    [],
  );

  const geos = useMemo(() => {
    const nutBody = nutBodyGeometry(dims);
    return {
      nutBody,
      insert: insertGeometry(dims),
      ferrule: ferruleGeometry(dims),
      tube: tubeGeometry(dims, dims.tubeOD * 2.2),
    };
  }, [dims]);

  // Internal thread teeth: instanced boxes ringed inside the bore
  // (documented LOD from showcase nut demos — one draw call).
  const nutTeeth = useMemo(() => {
    const ring = nutThreadRing(dims);
    const tooth = new THREE.BoxGeometry(dims.tubeOD * 0.2, dims.tubeOD * 0.11, dims.tubeOD * 0.05);
    const mesh = new THREE.InstancedMesh(tooth, matFlat, ring.count * ring.rows);
    const dummy = new THREE.Object3D();
    let i = 0;
    for (let r = 0; r < ring.rows; r++) {
      const y = -nutH * 0.28 + (r / (ring.rows - 1)) * nutH * 0.42;
      for (let c = 0; c < ring.count; c++) {
        const theta = (c / ring.count) * Math.PI * 2 + (r % 2) * (Math.PI / ring.count);
        dummy.position.set(ring.radius * Math.sin(theta), y, ring.radius * Math.cos(theta));
        dummy.rotation.set(0, theta, 0);
        dummy.updateMatrix();
        mesh.setMatrixAt(i++, dummy.matrix);
      }
    }
    mesh.instanceMatrix.needsUpdate = true;
    return mesh;
  }, [dims, matFlat, nutH]);

  const group = useRef<THREE.Group>(null);
  const nutRef = useRef<THREE.Group>(null);
  const ferruleRef = useRef<THREE.Group>(null);
  const insertRef = useRef<THREE.Group>(null);
  const tubeRef = useRef<THREE.Group>(null);
  const t = useRef(0);

  // Assembled X positions (inches) — overlapping machined layout.
  // Insert is fixed; its 37° flare nose points left (-X); the nut screws over
  // the external thread (+X half); the ferrule overlaps the body behind the
  // nose; the tube slides in from the left. Closed solids interpenetrate, so
  // no seam can ever open or z-fight.
  const closed = useMemo(() => {
    const d = dims.tubeOD;
    const insertL = 2.6 * d;
    return {
      nut: 0.78 * d,
      ferrule: -1.02 * d,
      insert: 0,
      tube: -2.38 * d,
      span: insertL, // informational
    };
  }, [dims]);

  const exploded = useMemo(
    () => ({
      nut: closed.nut + dims.tubeOD * 0.9,
      ferrule: closed.ferrule - dims.tubeOD * 0.7,
      insert: 0,
      tube: closed.tube - dims.tubeOD * 1.4,
    }),
    [closed, dims],
  );

  useFrame((state, delta) => {
    t.current = Math.min(1, t.current + delta / 3.2); // 3.2s assembly on load
    const k = EASE(t.current);
    const e = explode ?? 0;
    const mix = (a: number, b: number) => a * (1 - k) + b * k; // exploded -> closed
    const spread = dims.tubeOD * 1.4 * e;
    if (nutRef.current) nutRef.current.position.x = mix(exploded.nut - spread, closed.nut);
    if (ferruleRef.current) ferruleRef.current.position.x = mix(exploded.ferrule - spread * 0.6, closed.ferrule);
    if (insertRef.current) insertRef.current.position.x = mix(0, closed.insert);
    if (tubeRef.current) tubeRef.current.position.x = mix(exploded.tube + spread, closed.tube);
    if (spin && group.current) group.current.rotation.y += delta * 0.18;
  });

  const rot: [number, number, number] = [0, 0, -Math.PI / 2]; // lathe Y axis -> X axis
  // Solo-nut presentation: aim the bore mouth toward the viewer (quaternion
  // from the geometry's mouth direction -Y to the requested direction), so
  // the internal thread ring and 37° counterseat are actually visible.
  const nutQuat = useMemo(() => {
    const q = new THREE.Quaternion();
    const mouth = new THREE.Vector3(...(mouthDir ?? [0.3, 0.45, 0.9])).normalize();
    q.setFromUnitVectors(new THREE.Vector3(0, -1, 0), mouth);
    return q;
  }, [mouthDir]);

  // Solo-part rendering (catalog cards / configurator single-component view)
  if (part !== "assembly") {
    const solo =
      part === "nut" ? (
        <group quaternion={nutQuat}>
          {/* flat-shaded steel: hex facets AND the visible seat/thread faces */}
          <mesh geometry={geos.nutBody} material={matFlat} castShadow receiveShadow />
          <primitive object={nutTeeth} />
          {/* mouth light: illuminates the internal thread grooves and seat */}
          <pointLight position={[0, -nutH * 1.7, 0]} intensity={1.6} distance={2.2} decay={2} color="#fff2dd" />
        </group>
      ) : part === "insert" ? (
        <mesh geometry={geos.insert} material={mat} rotation={rot} castShadow receiveShadow />
      ) : part === "ferrule" ? (
        <mesh geometry={geos.ferrule} material={mat} rotation={rot} castShadow receiveShadow />
      ) : (
        <mesh geometry={geos.tube} material={mat} rotation={rot} castShadow receiveShadow />
      );
    // nut: no extra outer rotation (quaternion already aims the mouth);
    // others: keep the three-quarter presentation angle
    const outerRot: [number, number, number] = part === "nut" ? [0, 0, 0] : [0, 0.5, 0];
    return (
      <group ref={group} rotation={outerRot}>
        {solo}
      </group>
    );
  }

  return (
    <group ref={group} rotation={[0, 0.42, 0]}>
      {/* JIC nut — flat-shaded steel on BOTH solids; never dark filler */}
      <group ref={nutRef} position={[closed.nut, 0, 0]}>
        <group rotation={rot}>
          <mesh geometry={geos.nutBody} material={matFlat} castShadow receiveShadow />
          <primitive object={nutTeeth} />
        </group>
      </group>
      {/* ferrule */}
      <group ref={ferruleRef} position={[closed.ferrule, 0, 0]}>
        <mesh geometry={geos.ferrule} material={mat} rotation={rot} castShadow receiveShadow />
      </group>
      {/* insert */}
      <group ref={insertRef} position={[0, 0, 0]}>
        <mesh geometry={geos.insert} material={mat} rotation={rot} castShadow receiveShadow />
      </group>
      {/* steel tube end */}
      <group ref={tubeRef} position={[closed.tube, 0, 0]}>
        <mesh geometry={geos.tube} material={mat} rotation={rot} castShadow receiveShadow />
      </group>
    </group>
  );
}

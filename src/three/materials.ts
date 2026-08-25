import * as THREE from "three";

export type MaterialKey = "ss304" | "ss316" | "carbon" | "brass";

export const MATERIAL_LABELS: Record<MaterialKey, string> = {
  ss304: "Stainless Steel 304",
  ss316: "Stainless Steel 316",
  carbon: "Carbon Steel",
  brass: "Brass",
};

/** PBR presets per workbook material option. Dark-studio tuned (validated in the test rig). */
export function makeMaterial(key: MaterialKey): THREE.MeshStandardMaterial {
  const common = {
    metalness: 0.9,
    // Winding-proof safety net: these are small closed solids, so DoubleSide
    // costs nothing perceptible and makes every surface render regardless of
    // profile traversal direction (defect class: "black circles").
    side: THREE.DoubleSide,
  } as const;
  switch (key) {
    case "ss304":
      return new THREE.MeshStandardMaterial({
        ...common,
        color: new THREE.Color("#c6cbcf"),
        roughness: 0.33, // broadened highlight — avoids the flat "coin glare" end-on
      });
    case "ss316":
      return new THREE.MeshStandardMaterial({
        ...common,
        color: new THREE.Color("#bcc3c9"),
        roughness: 0.33,
      });
    case "carbon":
      return new THREE.MeshStandardMaterial({
        ...common,
        color: new THREE.Color("#8d9297"),
        roughness: 0.45,
      });
    case "brass":
      return new THREE.MeshStandardMaterial({
        color: new THREE.Color("#c9a24b"),
        roughness: 0.32,
        metalness: 0.85,
      });
  }
}

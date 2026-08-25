import * as THREE from "three";

/**
 * Engineering dimension annotations for the 3D models.
 * Hairline extension + dimension lines, arrowheads, and crisp canvas-sprite
 * labels (decimal inches + millimetres). Groups are added INSIDE a model
 * group so they rotate with it. Purely additive: toggle the group to show/hide.
 */

export interface DimSpec {
  a: THREE.Vector3;
  b: THREE.Vector3;
  offset: THREE.Vector3; // perpendicular offset of the dimension line
  label: string;
}

const DIM_COLOR = 0x9fd8ff;

export function makeLabelSprite(text: string, worldHeight = 0.14): THREE.Sprite {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 128;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "rgba(14,16,18,0.92)";
  ctx.beginPath();
  const r = 18;
  ctx.roundRect(6, 6, 500, 116, r);
  ctx.fill();
  ctx.strokeStyle = "#1070a0";
  ctx.lineWidth = 3;
  ctx.stroke();
  ctx.font = "600 46px ui-monospace, Consolas, monospace";
  ctx.fillStyle = "#e8eaed";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, 256, 66);
  const tex = new THREE.CanvasTexture(canvas);
  tex.anisotropy = 4;
  const spr = new THREE.Sprite(
    new THREE.SpriteMaterial({ map: tex, transparent: true, depthTest: false }),
  );
  spr.scale.set(worldHeight * 4, worldHeight, 1);
  spr.renderOrder = 10;
  return spr;
}

export function makeDimension(spec: DimSpec): THREE.Group {
  const g = new THREE.Group();
  const A = spec.a.clone().add(spec.offset);
  const B = spec.b.clone().add(spec.offset);
  const mat = new THREE.LineBasicMaterial({ color: DIM_COLOR, transparent: true, opacity: 0.95 });
  const seg = (p: THREE.Vector3, q: THREE.Vector3) =>
    new THREE.Line(new THREE.BufferGeometry().setFromPoints([p, q]), mat);
  g.add(seg(spec.a, A)); // extension line
  g.add(seg(spec.b, B)); // extension line
  g.add(seg(A, B)); // dimension line
  const dir = B.clone().sub(A).normalize();
  const arrowGeo = new THREE.ConeGeometry(0.016, 0.05, 10);
  const arrowMat = new THREE.MeshBasicMaterial({ color: DIM_COLOR });
  const a1 = new THREE.Mesh(arrowGeo, arrowMat);
  a1.position.copy(A).addScaledVector(dir, 0.025);
  a1.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.clone().negate());
  const a2 = new THREE.Mesh(arrowGeo, arrowMat);
  a2.position.copy(B).addScaledVector(dir, -0.025);
  a2.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);
  g.add(a1, a2);
  const label = makeLabelSprite(spec.label, 0.15);
  label.position.copy(A).add(B).multiplyScalar(0.5);
  g.add(label);
  return g;
}

export function makeNote(text: string, position: THREE.Vector3): THREE.Sprite {
  const spr = makeLabelSprite(text, 0.13);
  spr.position.copy(position);
  return spr;
}

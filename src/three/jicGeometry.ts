import * as THREE from "three";
import { Brush, Evaluator, SUBTRACTION } from "three-bvh-csg";

/**
 * Parametric Female-JIC component geometry — v2, watertight.
 *
 * Every part is ONE closed revolve cross-section (or interpenetrating closed
 * solids), so there are no open shells, no hairline butt-joints and no
 * coplanar surfaces: edges cannot vanish (z-fight) and gaps cannot show.
 * Where parts meet in the assembly they overlap like real machined hardware.
 *
 * Units: inches. Axis: local Y. All profiles are [radius, y] polylines.
 */

export type Vec2 = [number, number];

export interface DashDims {
  dash: number;
  tubeOD: number; // inches = dash/16
  hexAF: number; // across flats, typical
}

export function dashDims(dash: number): DashDims {
  const tubeOD = dash / 16;
  const hexAF = Math.max(0.3125, tubeOD * 1.55);
  return { dash, tubeOD, hexAF };
}

function lathe(pts: Vec2[], segments: number): THREE.BufferGeometry {
  return new THREE.LatheGeometry(
    pts.map(([r, y]) => new THREE.Vector2(Math.max(0.002, r), y)),
    segments,
  );
}

/* ------------------------------------------------------------------ */
/* JIC NUT — CSG construction (the conclusive fix).                    */
/*   The two-mesh lathe approach inherently produced visible rings:    */
/*   the bore liner had to overlap the hex faces, and wherever it      */
/*   did, a thin circular ring showed. The professional approach       */
/*   (per research: three-bvh-csg, as used in showcase nut demos):     */
/*     hex prism − through-bore cylinder − counterseat cone            */
/*   = ONE watertight mesh. No seams, no rings, no z-fighting.         */
/* Internal threads: instanced teeth ring inside the bore (the         */
/*   documented LOD — real helices are imperceptible at this scale).   */
/* ------------------------------------------------------------------ */

export interface NutSpec {
  h: number;
  hexR: number;
  boreR: number;
  seatR: number;
}

export function nutSpec(dims: DashDims): NutSpec {
  const h = dims.tubeOD * 1.15;
  const hexR = (dims.hexAF * 1.1547) / 2; // across corners
  const boreR = Math.min(hexR * 0.72, dims.tubeOD * 0.62); // interference fit vs insert crest (0.685d)
  // counterseat stays inside the hex flats: across-flats radius = hexR * cos30
  const seatR = Math.min(hexR * 0.84, dims.tubeOD * 0.86);
  return { h, hexR, boreR, seatR };
}

/** CSG-built nut body: hex prism − through-bore − counterseat cone. One mesh. */
export function nutBodyGeometry(dims: DashDims): THREE.BufferGeometry {
  const { h, hexR, boreR, seatR } = nutSpec(dims);
  const evaluator = new Evaluator();
  evaluator.attributes = ["position", "normal", "uv"];

  // hex prism
  const hexBrush = new Brush(new THREE.CylinderGeometry(hexR, hexR, h, 6));
  hexBrush.updateMatrixWorld();

  // through-bore (closed cylinder, oversized so it cuts clean through)
  const boreBrush = new Brush(new THREE.CylinderGeometry(boreR, boreR, h * 1.3, 48));
  boreBrush.updateMatrixWorld();

  let result = evaluator.evaluate(hexBrush, boreBrush, SUBTRACTION);

  // counterseat: conical recess cut into the top face (opens toward the bore)
  const coneH = h * 0.22;
  const seatBrush = new Brush(
    new THREE.CylinderGeometry(seatR, boreR + h * 0.06, coneH, 48),
  );
  seatBrush.position.y = h / 2 + 0.002 - coneH / 2;
  seatBrush.updateMatrixWorld();

  result = evaluator.evaluate(result, seatBrush, SUBTRACTION);

  const geo = result.geometry;
  geo.computeVertexNormals();
  return geo;
}

/** Thread-tooth ring placement data for the nut's instanced teeth. */
export function nutThreadRing(dims: DashDims): { radius: number; count: number; rows: number } {
  const { boreR } = nutSpec(dims);
  return { radius: boreR - dims.tubeOD * 0.024, count: 14, rows: 5 };
}

/* ------------------------------------------------------------------ */
/* JIC INSERT — one watertight solid: flare nose (-Y), external thread |
/* (+Y half), through-bore traced back inside. No open shells.         */
/* ------------------------------------------------------------------ */
export function insertGeometry(dims: DashDims): THREE.BufferGeometry {
  const L = dims.tubeOD * 2.6;
  const d = dims.tubeOD;
  const bodyR = d * 0.64;
  const crestR = bodyR * 1.07;
  const boreR = d * 0.42;
  const flareR = d * 0.86;

  const nose = -L / 2; // flare end
  const tip = L / 2; // threaded end

  const pts: Vec2[] = [];
  // outer path: nose -> tip
  pts.push([flareR * 0.62, nose]);
  pts.push([flareR, nose + 0.05 * d]); // flare face cone
  pts.push([bodyR * 0.96, nose + 0.18 * d]);
  pts.push([bodyR, nose + 0.24 * d]);
  // external thread along the +half
  const t0 = nose + 0.55 * L;
  const t1 = tip - 0.06 * d;
  const nT = Math.max(4, Math.round((t1 - t0) / (0.055 * d)));
  const seg = (t1 - t0) / nT;
  for (let i = 0; i < nT; i++) {
    const y = t0 + i * seg;
    pts.push([crestR, y + seg * 0.5]);
    pts.push([bodyR, y + seg]);
  }
  pts.push([bodyR * 0.9, tip]);
  // inner return path: tip -> nose (through-bore)
  pts.push([boreR, tip]);
  pts.push([boreR, nose + 0.09 * d]);
  pts.push([boreR * 0.8, nose + 0.04 * d]); // bore chamfer
  pts.push([flareR * 0.34, nose + 0.008 * d]); // underside of flare face
  pts.push([0.0001, nose + 0.004 * d]); // close at bore axis
  return lathe(pts, 48);
}

/* ------------------------------------------------------------------ */
/* FERRULE — closed annulus ring (both walls + both faces traced).     */
/* ------------------------------------------------------------------ */
export function ferruleGeometry(dims: DashDims): THREE.BufferGeometry {
  const d = dims.tubeOD;
  const h = d * 0.55;
  const outerR = d * 0.88;
  const innerR = d * 0.60;
  const pts: Vec2[] = [
    [outerR * 0.90, -h / 2],
    [outerR, -h / 2 + h * 0.28],
    [outerR, h / 2 - h * 0.20],
    [outerR * 0.92, h / 2],
    [innerR, h / 2],
    [innerR, -h / 2],
    [outerR * 0.90, -h / 2], // close the loop — watertight ring
  ];
  return lathe(pts, 48);
}

/* ------------------------------------------------------------------ */
/* STEEL TUBE END — closed annulus tube.                               */
/* ------------------------------------------------------------------ */
export function tubeGeometry(dims: DashDims, length: number): THREE.BufferGeometry {
  const outerR = dims.tubeOD / 2;
  const innerR = outerR * 0.70;
  const pts: Vec2[] = [
    [outerR, -length / 2],
    [outerR, length / 2],
    [innerR, length / 2],
    [innerR, -length / 2],
    [outerR, -length / 2], // close
  ];
  return lathe(pts, 48);
}

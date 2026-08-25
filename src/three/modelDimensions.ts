import * as THREE from "three";
import { DimSpec, makeDimension, makeNote } from "./dimensions";
import { dashDims } from "./jicGeometry";

/**
 * Engineering dimension sets per component.
 *
 * Coordinate convention (matches the geometry builders): local Y is the part
 * AXIS, local X/Z are radial. So:
 *   - LENGTH dimensions run along Y, offset radially clear of the body.
 *   - DIAMETER dimensions run across the part (radial), anchored at one fixed
 *     axial position, offset along the axis so the line sits beside the part.
 * Every anchor sits on the model surface; extension lines connect anchors to
 * the dimension line.
 */

const IN = (v: number) => `${v.toFixed(2)}"`;
const MM = (v: number) => `${(v * 25.4).toFixed(1)} mm`;
const dim = (a: number[], b: number[], offset: number[], text: string): DimSpec => ({
  a: new THREE.Vector3(...a),
  b: new THREE.Vector3(...b),
  offset: new THREE.Vector3(...offset),
  label: text,
});

export function dimensionsFor(kind: string): THREE.Group {
  const d = dashDims(8); // prototype presented at dash-08
  const d2 = d.tubeOD; // shorthand: tube OD (in)
  const g = new THREE.Group();
  g.name = "engineeringDimensions";

  if (kind === "nut") {
    const h = d2 * 1.15;
    const af = d.hexAF;
    // across flats: flat-to-flat runs perpendicular to the corner vertices
    g.add(makeDimension(
      dim([-af / 2, h / 2, 0], [af / 2, h / 2, 0], [0, 0.16, 0],
        `AF ${IN(af)} · ${MM(af)}`),
    ));
    // height: along the bore axis, offset radially clear of the hex
    g.add(makeDimension(
      dim([0, -h / 2, 0], [0, h / 2, 0], [af / 2 + 0.18, 0, 0],
        `H ${IN(h)} · ${MM(h)}`),
    ));
    g.add(makeNote(`3/4"-16 UNF · 37° counterseat`, new THREE.Vector3(0, h / 2 + 0.3, 0)));
  }

  if (kind === "insert") {
    const L = d2 * 2.6;
    const flareD = d2 * 0.86 * 2;
    // overall length: along the axis
    g.add(makeDimension(
      dim([0, -L / 2, 0], [0, L / 2, 0], [0.34, 0, 0],
        `L ${IN(L)} · ${MM(L)}`),
    ));
    // flare diameter: across the nose, at the flare face
    g.add(makeDimension(
      dim([0, -L / 2 + d2 * 0.05, -flareD / 2], [0, -L / 2 + d2 * 0.05, flareD / 2], [0, 0.18, 0],
        `Ø ${IN(flareD)} · ${MM(flareD)}`),
    ));
    g.add(makeNote(`3/4"-16 UNF · 37° flare`, new THREE.Vector3(0, L / 2 + 0.28, 0)));
  }

  if (kind === "ferrule") {
    const h = d2 * 0.55;
    const od = d2 * 0.88 * 2;
    // outside diameter: across the collar at the top face
    g.add(makeDimension(
      dim([0, h / 2, -od / 2], [0, h / 2, od / 2], [0.2, 0, 0],
        `OD ${IN(od)} · ${MM(od)}`),
    ));
    // length: along the axis, offset radially
    g.add(makeDimension(
      dim([0, -h / 2, 0], [0, h / 2, 0], [od / 2 + 0.14, 0, 0],
        `L ${IN(h)} · ${MM(h)}`),
    ));
    g.add(makeNote(`Crimp collar · smooth bore`, new THREE.Vector3(0, h / 2 + 0.26, 0)));
  }

  if (kind === "tube") {
    const L = d2 * 2.2;
    const od = d2;
    // outside diameter: across the tube at mid-length
    g.add(makeDimension(
      dim([0, 0, -od / 2], [0, 0, od / 2], [od / 2 + 0.22, 0, 0],
        `Ø ${IN(od)} · ${MM(od)}`),
    ));
    // length: along the axis, dimension line placed beyond the tube end
    g.add(makeDimension(
      dim([0, -L / 2, 0], [0, L / 2, 0], [0, -(L / 2 + 0.15), 0],
        `L ${IN(L)} · ${MM(L)}`),
    ));
    g.add(makeNote(`Seamless · Sch80 equivalent wall`, new THREE.Vector3(0, L / 2 + 0.24, 0)));
  }

  return g;
}

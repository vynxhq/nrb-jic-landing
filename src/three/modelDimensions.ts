import * as THREE from "three";
import { DimSpec, makeDimension, makeNote } from "./dimensions";
import { dashDims, nutSpec } from "./jicGeometry";

/**
 * Engineering dimension sets per component (local model space, axis = Y).
 * Values are computed from the same parametric dimensions that build the
 * geometry — so they always match the model. Displayed in inches + mm.
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
  const g = new THREE.Group();
  g.name = "engineeringDimensions";

  if (kind === "nut") {
    const { h, boreR, seatR } = nutSpec(d);
    const af = d.hexAF;
    g.add(makeDimension(
      dim([0, h / 2, -af / 2], [0, h / 2, af / 2], [0, 0.16, 0],
        `AF ${IN(af)} · ${MM(af)}`),
    ));
    g.add(makeDimension(
      dim([-h / 2, 0, 0], [h / 2, 0, 0], [0, -(af / 2 + 0.16), 0],
        `H ${IN(h)} · ${MM(h)}`),
    ));
    g.add(makeNote(`3/4"-16 UNF · 37° counterseat`, new THREE.Vector3(0, h / 2 + 0.3, 0)));
    void boreR; void seatR;
  }

  if (kind === "insert") {
    const L = d.tubeOD * 2.6;
    const flareD = d.tubeOD * 0.86 * 2;
    g.add(makeDimension(
      dim([0, -L / 2, 0], [0, L / 2, 0], [0.34, 0, 0],
        `L ${IN(L)} · ${MM(L)}`),
    ));
    g.add(makeDimension(
      dim([0, L / 2 - d.tubeOD * 0.1, -flareD / 2], [0, L / 2 - d.tubeOD * 0.1, flareD / 2], [0, 0.18, 0],
        `Ø ${IN(flareD)} · ${MM(flareD)}`),
    ));
    g.add(makeNote(`3/4"-16 UNF · 37° flare`, new THREE.Vector3(0, -L / 2 - 0.28, 0)));
  }

  if (kind === "ferrule") {
    const h = d.tubeOD * 0.55;
    const od = d.tubeOD * 0.88 * 2;
    g.add(makeDimension(
      dim([0, h / 2, od / 2], [0, -h / 2, od / 2], [0.2, 0, 0],
        `OD ${IN(od)} · ${MM(od)}`),
    ));
    g.add(makeDimension(
      dim([-h / 2, 0, 0], [h / 2, 0, 0], [0, -(od / 2 + 0.14), 0],
        `L ${IN(h)} · ${MM(h)}`),
    ));
    g.add(makeNote(`Crimp collar · smooth bore`, new THREE.Vector3(0, h / 2 + 0.26, 0)));
  }

  if (kind === "tube") {
    const L = d.tubeOD * 2.2;
    const od = d.tubeOD;
    g.add(makeDimension(
      dim([0, L / 2, od / 2], [0, -L / 2, od / 2], [0.22, 0, 0],
        `Ø ${IN(od)} · ${MM(od)}`),
    ));
    g.add(makeDimension(
      dim([-L / 2, 0, 0], [L / 2, 0, 0], [0, -(od / 2 + 0.16), 0],
        `L ${IN(L)} · ${MM(L)}`),
    ));
    g.add(makeNote(`Seamless · Sch80 equivalent wall`, new THREE.Vector3(0, L / 2 + 0.24, 0)));
  }

  return g;
}

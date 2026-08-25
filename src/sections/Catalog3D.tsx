import jic from "../data/jic.json";
import { JicAssembly, JicPart } from "../three/JicAssembly";
import { StudioCanvas } from "../three/StudioCanvas";
import { MaterialKey } from "../three/materials";
import { Reveal } from "./HowItSeals";

interface CatalogEntry {
  family: keyof typeof jic.families;
  part: JicPart;
  label: string;
  blurb: string;
  camera: [number, number, number];
}

const CATALOG: CatalogEntry[] = [
  {
    family: "JIC NUT",
    part: "nut",
    label: "JIC Nut",
    blurb: "Hex body, threaded bore, 37° counterseat. The torque element of the connection.",
    camera: [0.9, 0.55, 1.35],
  },
  {
    family: "JIC INSERT",
    part: "insert",
    label: "JIC Insert",
    blurb: "External thread and machined 37° flare nose — the sealing element.",
    camera: [0.9, 0.55, 1.5],
  },
  {
    family: "FERRULE",
    part: "ferrule",
    label: "Ferrule (Collar)",
    blurb: "Crimped onto the hose or tube to lock the assembly under pressure.",
    camera: [0.9, 0.55, 1.3],
  },
  {
    family: "STEEL TUBE END",
    part: "tube",
    label: "Steel Tube End",
    blurb: "Seamless tube ends in SS316 / brass, dash –04 to –16.",
    camera: [0.9, 0.55, 1.5],
  },
];

export function configCount(family: keyof typeof jic.families) {
  return jic.families[family]?.configs.length ?? 0;
}

export function jumpToConfigurator(detail: {
  family?: string;
  dash?: number;
  series?: "unf" | "bspp";
  material?: MaterialKey;
}) {
  window.dispatchEvent(new CustomEvent("nrb-view-3d", { detail }));
  document.getElementById("configurator")?.scrollIntoView({ behavior: "smooth" });
}

export function Catalog3D() {
  return (
    <section className="section section-alt" id="catalog-3d">
      <div className="container">
        <Reveal>
          <div className="kicker">The family in 3D</div>
          <h2 className="title">Four components. 58 configurations. One connection.</h2>
          <p className="lead">
            Every part below is rendered live from NRB's parametric product data — pick any
            configuration in the configurator and the model regenerates to match.
          </p>
        </Reveal>
        <div className="catalog-grid">
          {CATALOG.map((c) => (
            <Reveal key={c.family}>
              <div className="catalog-card">
                <div className="cat-canvas">
                  <StudioCanvas
                    cameraPosition={c.camera}
                    fov={38}
                    frameloop="demand"
                    enableZoom={false}
                  >
                    <JicAssembly
                      dash={8}
                      material="ss304"
                      explode={0}
                      spin={false}
                      part={c.part}
                      mouthDir={c.family === "JIC NUT" ? [0.42, 0.35, 0.83] : undefined}
                    />
                  </StudioCanvas>
                </div>
                <div className="cat-body">
                  <h3>{c.label}</h3>
                  <p>{c.blurb}</p>
                  <span className="cat-meta mono">
                    {configCount(c.family)} configurations · dash –02 to –36
                  </span>
                  <button
                    className="cat-link"
                    onClick={() => jumpToConfigurator({ family: c.family })}
                  >
                    Configure in 3D →
                  </button>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

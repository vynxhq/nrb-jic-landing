import { useEffect, useMemo, useState } from "react";
import jic from "../data/jic.json";
import { JIC_THREAD_STANDARDS, THREAD_DATA_NOTE, threadFor } from "../data/threadStandards";
import { JicAssembly, JicPart } from "../three/JicAssembly";
import { StudioCanvas } from "../three/StudioCanvas";
import { MaterialKey, MATERIAL_LABELS } from "../three/materials";

type FamilyKey = "JIC NUT" | "JIC INSERT" | "FERRULE" | "STEEL TUBE END";

const COMPONENTS: { key: FamilyKey; label: string; blurb: string; part: JicPart; camera: [number, number, number] }[] = [
  { key: "JIC NUT", label: "JIC Nut", blurb: "Hex nut with threaded bore and 37° counterseat.", part: "nut", camera: [0.95, 0.6, 1.45] },
  { key: "JIC INSERT", label: "JIC Insert", blurb: "Male insert with 37° flare nose and external thread.", part: "insert", camera: [0.95, 0.6, 1.55] },
  { key: "FERRULE", label: "Ferrule (Collar)", blurb: "Crimp collar securing the hose end or tube.", part: "ferrule", camera: [0.9, 0.55, 1.3] },
  { key: "STEEL TUBE END", label: "Steel Tube End", blurb: "Seamless tube end, SS316 / brass.", part: "tube", camera: [0.9, 0.55, 1.5] },
];

const DASHES = JIC_THREAD_STANDARDS.map((r) => r.dash); // all 13 industry dash sizes
const MATERIALS: MaterialKey[] = ["ss304", "ss316", "carbon", "brass"];

function findConfig(family: FamilyKey, dash: number) {
  const configs = jic.families[family]?.configs ?? [];
  return (
    configs.find((c) => c.partNumber === `DASH-${String(dash).padStart(2, "0")}`) ??
    configs.find((c) => c.sizeIn === dash / 16) ??
    configs.find((c) => Math.abs(c.sizeIn - dash / 16) < 0.13) ??
    configs[0]
  );
}

export function Configurator() {
  const [family, setFamily] = useState<FamilyKey>("JIC NUT");
  const [dash, setDash] = useState(8);
  const [material, setMaterial] = useState<MaterialKey>("ss304");
  const [series, setSeries] = useState<"unf" | "bspp">("unf");

  // Deep-link: catalog cards & table rows dispatch "nrb-view-3d" to load a config.
  useEffect(() => {
    const handler = (e: Event) => {
      const d = (e as CustomEvent).detail as {
        family?: string;
        dash?: number;
        series?: "unf" | "bspp";
        material?: MaterialKey;
      };
      if (d.family && COMPONENTS.some((c) => c.key === d.family)) setFamily(d.family as FamilyKey);
      if (d.dash && DASHES.includes(d.dash)) setDash(d.dash);
      if (d.series) setSeries(d.series);
      if (d.material && MATERIALS.includes(d.material)) setMaterial(d.material);
    };
    window.addEventListener("nrb-view-3d", handler);
    return () => window.removeEventListener("nrb-view-3d", handler);
  }, []);

  const config = useMemo(() => findConfig(family, dash), [family, dash]);
  const comp = COMPONENTS.find((c) => c.key === family)!;
  const thread = threadFor(dash, series);

  return (
    <section className="section" id="configurator">
      <div className="container">
        <div className="kicker">Interactive 3D Configurator</div>
        <h2 className="title">See your exact fitting before you request it.</h2>
        <p className="lead">
          Every configuration below comes straight from NRB's product database. Pick a component,
          size and material — the model and spec card update live.
        </p>

        <div className="config-grid">
          <div>
            <div className="config-canvas">
              <StudioCanvas cameraPosition={comp.camera} fov={40} key={`${family}-${dash}`}>
                <JicAssembly
                  dash={dash}
                  material={material}
                  explode={0}
                  spin={false}
                  part={comp.part}
                  mouthDir={family === "JIC NUT" ? [0.9, 0.42, 0.05] : undefined}
                />
              </StudioCanvas>
            </div>

            <div className="control-label">Component</div>
            <div className="config-controls">
              {COMPONENTS.map((c) => (
                <button
                  key={c.key}
                  className={`chip ${family === c.key ? "active" : ""}`}
                  onClick={() => setFamily(c.key)}
                >
                  {c.label}
                </button>
              ))}
            </div>

            <div className="control-label">Dash size</div>
            <div className="config-controls">
              {DASHES.map((d) => (
                <button
                  key={d}
                  className={`chip ${dash === d ? "active" : ""}`}
                  onClick={() => setDash(d)}
                >
                  –{String(d).padStart(2, "0")}
                </button>
              ))}
            </div>

            <div className="control-label">Material</div>
            <div className="config-controls">
              {MATERIALS.map((m) => (
                <button
                  key={m}
                  className={`chip ${material === m ? "active" : ""}`}
                  onClick={() => setMaterial(m)}
                >
                  {MATERIAL_LABELS[m]}
                </button>
              ))}
            </div>

            <div className="control-label">Thread series</div>
            <div className="config-controls">
              <button className={`chip ${series === "unf" ? "active" : ""}`} onClick={() => setSeries("unf")}>
                UNF (JIC · SAE J514)
              </button>
              <button className={`chip ${series === "bspp" ? "active" : ""}`} onClick={() => setSeries("bspp")}>
                BSP parallel
              </button>
            </div>
          </div>

          <aside className="spec-panel">
            <div className="spec-title">Specification</div>
            <div className="spec-name">{comp.label}</div>
            <div className="spec-code mono">{comp.blurb}</div>
            <dl className="spec-rows">
              <div className="spec-row">
                <dt>Part code</dt>
                <dd className="mono">{config?.partNumber ?? "—"}</dd>
              </div>
              <div className="spec-row">
                <dt>Tube size</dt>
                <dd>{config?.size ?? "—"}</dd>
              </div>
              <div className="spec-row">
                <dt>Thread / type</dt>
                <dd className="mono">{family === "FERRULE" ? config?.thread ?? "—" : thread}</dd>
              </div>
              <div className="spec-row">
                <dt>Working pressure</dt>
                <dd>{config?.pressure ?? "—"}</dd>
              </div>
              <div className="spec-row">
                <dt>Material</dt>
                <dd>{MATERIAL_LABELS[material]}</dd>
              </div>
              <div className="spec-row">
                <dt>Media</dt>
                <dd style={{ maxWidth: 190, textAlign: "right" }}>{jic.media}</dd>
              </div>
            </dl>
            <p className="spec-note">
              {THREAD_DATA_NOTE} Data source: NRB Product Database v3 (2019 catalogue lineage).
              NRB manufactures to drawing — other materials and threads on request.
            </p>
            <a
              className="btn btn-primary"
              style={{ marginTop: 16, width: "100%" }}
              href={`mailto:noshir@nrbhydro.com?subject=${encodeURIComponent(
                `RFQ: ${comp.label} DASH-${String(dash).padStart(2, "0")} (${MATERIAL_LABELS[material]})`,
              )}&body=${encodeURIComponent(
                `Hello NRB team,\n\nPlease quote:\n\nProduct: ${comp.label}\nPart code: ${
                  config?.partNumber ?? ""
                }\nSize: ${config?.size ?? ""}\nThread/Type: ${config?.thread ?? ""}\nMaterial: ${
                  MATERIAL_LABELS[material]
                }\nQuantity:\n\nThanks,`,
              )}`}
            >
              Request quote for this configuration
            </a>
          </aside>
        </div>
      </div>
    </section>
  );
}

import { Reveal } from "./HowItSeals";

export function Precision() {
  return (
    <section className="section" id="precision">
      <div className="container">
        <Reveal>
          <div className="kicker">Engineering &amp; Manufacturing</div>
          <h2 className="title">Top-of-the-line equipment, verified processes.</h2>
          <p className="lead">
            NRB invests in the same machine brands the global majors use, and inspects every
            single piece, not samples.
          </p>
        </Reveal>
        <Reveal>
          <div className="cred-grid">
            <div className="cred" style={{ gridColumn: "1 / -1", padding: 0, overflow: "hidden" }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 2 }}>
                {[
                  { src: "./products/product-male-connector.jpg", label: "Male connector · 37° JIC" },
                  { src: "./products/product-elbow-90.jpg", label: "90° elbow" },
                  { src: "./products/product-tee.jpg", label: "Run tee" },
                  { src: "./products/product-insert.jpg", label: "Tube insert" },
                ].map((p) => (
                  <figure key={p.src} style={{ margin: 0, position: "relative" }}>
                    <img
                      src={p.src}
                      alt={p.label}
                      loading="lazy"
                      style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                    />
                    <figcaption
                      className="mono"
                      style={{
                        position: "absolute", left: 10, bottom: 10,
                        background: "rgba(23,25,28,0.82)", color: "var(--text)",
                        fontSize: "0.68rem", padding: "4px 8px", borderRadius: 5, letterSpacing: "0.08em",
                      }}
                    >
                      {p.label}
                    </figcaption>
                  </figure>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
        <Reveal>
          <div className="kicker" style={{ marginTop: 34 }}>On the shop floor</div>
          <div className="catalog-grid" style={{ gridTemplateColumns: "repeat(3, minmax(0, 1fr))", marginTop: 18 }}>
            {[
              {
                src: "./machines/machine-mazak-cnc.jpg",
                label: "Yamazaki Mazak, CNC turning centres",
                note: "All fittings machined 100% from bar stock",
              },
              {
                src: "./machines/machine-amada-bandsaw.jpg",
                label: "AMADA, automatic band saws",
                note: "Square, burr-free, length-consistent cut-off",
              },
              {
                src: "./machines/machine-maximator-pump.jpg",
                label: "Maximator, hydrostatic test pumps",
                note: "Proof & burst testing up to 50,000 psi",
              },
            ].map((m) => (
              <div className="catalog-card" key={m.src}>
                <div className="cat-canvas" style={{ height: 200 }}>
                  <img
                    src={m.src}
                    alt={m.label}
                    loading="lazy"
                    style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                  />
                </div>
                <div className="cat-body">
                  <h3 className="mono" style={{ fontSize: "0.82rem", letterSpacing: "0.04em" }}>{m.label}</h3>
                  <p>{m.note}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="spec-note">
            Equipment class shown; NRB shop-floor photography to be substituted at next content
            cycle.
          </p>
        </Reveal>
        <div className="cred-grid">
          <Reveal>
            <div className="cred">
              <h3><span>100%</span> machined from bar stock</h3>
              <p>
                Yamazaki Mazak CNC turning centres and Amada automatic band saws. Every rod is
                UV-tested; hex, length and weight checked before cutting.
              </p>
              <span className="mono">Mazak QT-class · Amada HFA/HA band saws</span>
            </div>
          </Reveal>
          <Reveal>
            <div className="cred">
              <h3><span>&lt;5 µm</span> optical metrology</h3>
              <p>
                A high-resolution camera measuring system captures up to 25 outside values , 
                including insert angle, and the inspection soft copy ships to you.
              </p>
              <span className="mono">vision measuring system · 25 values · &lt;5 micron</span>
            </div>
          </Reveal>
          <Reveal>
            <div className="cred">
              <h3><span>50,000 psi</span> proof testing</h3>
              <p>
                German air-driven Maximator hydrostatic test pumps, plus a nitrogen bench for
                dry leak testing. Hardness checked on every incoming batch.
              </p>
              <span className="mono">Maximator 0–50K psi · N₂ leak bench</span>
            </div>
          </Reveal>
          <Reveal>
            <div className="cred">
              <h3><span>100%</span> thread gauging</h3>
              <p>
                Every nut checked with GO/NO-GO ring &amp; plug gauges; L1/L2 taper verification
                on pipe threads. Master gauges imported from the USA.
              </p>
              <span className="mono">ASME B1.20.1 / B1.1 class gauging</span>
            </div>
          </Reveal>
          <Reveal>
            <div className="cred">
              <h3><span>Ultra-clean</span> stainless</h3>
              <p>
                Every SS product is UV ultra-cleaned after machining; ferrules are drilled,
                stress-relief annealed, then finished. Oven-dried before packing in monsoon.
              </p>
              <span className="mono">UV cleaning · stress relief · dry packing</span>
            </div>
          </Reveal>
          <Reveal>
            <div className="cred">
              <h3><span>Lean</span> production discipline</h3>
              <p>
                Leadership trained in Lean Production and Theory of Constraints at Parker-Markwel
                (India). Priority orders manufactured first; ETD/ETA updates after shipment.
              </p>
              <span className="mono">Lean · TOC · OTIF culture</span>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

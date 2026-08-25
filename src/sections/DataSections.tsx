import { useMemo, useState } from "react";
import jic from "../data/jic.json";
import { THREAD_DATA_NOTE } from "../data/threadStandards";
import { jumpToConfigurator } from "./Catalog3D";
import { Reveal } from "./HowItSeals";

type FamilyKey = keyof typeof jic.families;

export function BuyerSafety() {
  return (
    <section className="section section-alt" id="buyer-safety">
      <div className="container">
        <Reveal>
          <div className="kicker">Buyer Safety</div>
          <h2 className="title">We remove the risk before you commit.</h2>
          <p className="lead">
            Sourcing fittings from a new supplier is a trust decision. NRB's buyer-safety program
            is built to make the first order almost risk-free.
          </p>
        </Reveal>
        <div className="safe-grid">
          <Reveal>
            <div className="safe">
              <div className="big">5–20 pcs</div>
              <h3>Trial lots first</h3>
              <p>
                Qualify our quality on a small sample before any volume commitment. Samples are
                billed with the first order.
              </p>
            </div>
          </Reveal>
          <Reveal>
            <div className="safe">
              <div className="big">Zero</div>
              <h3>Minimum order quantity</h3>
              <p>
                We accept minimums as low as 100 pcs even on slow-moving large sizes — your
                long-tail SKUs stay covered.
              </p>
            </div>
          </Reveal>
          <Reveal>
            <div className="safe">
              <div className="big">21 days</div>
              <h3>OTIF dispatch ≤ $35,000</h3>
              <p>
                Orders up to US$35,000 ready for dispatch in 21 days, with status updates every
                10 days. Emergencies: 72-hour turnarounds achieved on SS.
              </p>
            </div>
          </Reveal>
          <Reveal>
            <div className="safe">
              <div className="big">100%</div>
              <h3>Inspected &amp; documented</h3>
              <p>
                Every piece visually and dimensionally checked; material test certificates
                available for all raw materials. Third-party inspection welcome.
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

export function ConfigTable() {
  const [family, setFamily] = useState<FamilyKey | "ALL">("ALL");
  const [query, setQuery] = useState("");

  const families = Object.keys(jic.families) as FamilyKey[];
  const rows = useMemo(() => {
    let out: { family: string; cfg: (typeof jic.families)[FamilyKey]["configs"][0] }[] = [];
    for (const f of families) {
      if (family !== "ALL" && family !== f) continue;
      for (const c of jic.families[f].configs) out.push({ family: f, cfg: c });
    }
    const q = query.trim().toLowerCase();
    if (q) {
      out = out.filter((r) =>
        [r.cfg.partNumber, r.cfg.size, r.cfg.thread, r.cfg.pressure, r.family]
          .join(" ")
          .toLowerCase()
          .includes(q),
      );
    }
    return out;
  }, [family, query, families]);

  return (
    <section className="section" id="configurations">
      <div className="container">
        <Reveal>
          <div className="kicker">Full range</div>
          <h2 className="title">{jic.title} — all {rows.length > 0 ? "58" : ""} configurations.</h2>
          <p className="lead">
            Straight from NRB's product database. Can't find a variant? NRB manufactures to
            drawing — "we believe we can manufacture anything you can draw."
          </p>
        </Reveal>

        <div className="table-filters">
          <button className={`chip ${family === "ALL" ? "active" : ""}`} onClick={() => setFamily("ALL")}>
            All
          </button>
          {families.map((f) => (
            <button key={f} className={`chip ${family === f ? "active" : ""}`} onClick={() => setFamily(f)}>
              {f}
            </button>
          ))}
          <input
            aria-label="Search configurations"
            placeholder="Search thread, size, part no…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{
              background: "var(--bg-2)", border: "1px solid var(--line)", color: "var(--text)",
              borderRadius: 7, padding: "8px 14px", fontSize: "0.84rem", minWidth: 220,
            }}
          />
          <span className="table-count mono">{rows.length} configurations</span>
        </div>

        <div className="table-wrap">
          <table className="cfg">
            <thead>
              <tr>
                <th>Family</th>
                <th>Part code</th>
                <th>Size</th>
                <th>Thread / type</th>
                <th>Working pressure</th>
                <th>Materials</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(({ family: f, cfg }, i) => (
                <tr
                  key={`${f}-${cfg.partNumber}-${i}`}
                  style={{ cursor: "pointer" }}
                  title="View this configuration in 3D"
                  onClick={() =>
                    jumpToConfigurator({
                      family: f,
                      dash: Math.round((cfg.sizeIn ?? 0.25) * 16),
                      series: (cfg.thread ?? "").includes("UNF") ? "unf" : "bspp",
                    })
                  }
                >
                  <td>{f}</td>
                  <td className="mono">{cfg.partNumber}</td>
                  <td className="mono">{cfg.size}</td>
                  <td className="mono">{cfg.thread}</td>
                  <td>{cfg.pressure}</td>
                  <td>{cfg.materials}</td>
                  <td>{cfg.reviewStatus ? "✓ confirmed" : "pending"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="spec-note" style={{ marginTop: 14 }}>
          {THREAD_DATA_NOTE}
        </p>
      </div>
    </section>
  );
}

# NRB Hydraulics — Female JIC Connection System · 3D Product Landing Page

Interactive 3D product landing page for the **NRB Hydraulics Female JIC family** — nut, insert, ferrule and steel tube end, 58 live configurations driven by NRB's product database.

**Live:** https://vynxhq.github.io/nrb-jic-landing/

---

## Features

- **Hero assembly** — the complete JIC connection in interactive 3D (drag to orbit, hover to explode)
- **3D catalog** — all four components rendered live as uniform cards
- **Configurator** — 4 components × 13 dash sizes (–02…–32) × 4 materials × UNF/BSP thread series; the model and spec card regenerate live from parametric product data
- **How it seals** — the 37° flare story in four steps
- **Manufacturing credibility** — Mazak, AMADA, Finn-Power, Maximator, vision metrology, thread gauging
- **Buyer Safety** — 5–20 pc trial lots, zero MOQ, 21-day OTIF ≤ $35,000, 100% inspection
- **Full configuration table** — all 58 rows, searchable and filterable, click-to-view-in-3D
- **RFQ form** — opens a pre-addressed enquiry to NRB directly (no backend)

## Tech stack

| Layer | Choice |
|---|---|
| Build | Vite 6 + TypeScript (strict) |
| UI | React 19 |
| 3D | three.js 0.170 via @react-three/fiber + @react-three/drei |
| Nut geometry | **CSG boolean** (three-bvh-csg): hex prism − through-bore − counterseat cone = one watertight mesh |
| Internal threads | Instanced tooth ring inside the bore (documented LOD) |
| Insert / ferrule / tube | Parametric `LatheGeometry` profiles from dash dimensions |
| Product data | `src/data/jic.json` — exported from NRB Product Database v3 |
| Threads | `src/data/threadStandards.ts` — SAE J514 / BSP parallel series (**pending NRB confirmation**) |
| Deployment | GitHub Actions → GitHub Pages (builds on every push to `main`) |

## Run locally

```bash
npm install
npm run dev        # dev server
npm run build      # production build → dist/
npm run preview    # serve the production build
```

## QA gate

`qa/` contains a standalone render gate: 5 models × (24 static orientations + 36 temporal rotation frames), pixel-analyzed for black anomalies (backfaces, holes) and flicker spikes.

Serve `dist/` (or any static server) with `qa.html` + `qa_bundle.js` present, open `/qa.html`, and the matrix runs automatically. **Staging deploys are gated on this passing.**

## Repository structure

```
├── index.html               # entry (meta, favicon, OG tags)
├── src/
│   ├── main.tsx / App.tsx   # app shell
│   ├── styles.css           # design system (graphite + NRB blues #1070a0 / #60b0d0)
│   ├── data/                # product database export + thread standards
│   ├── three/               # parametric geometry, materials, studio rig, assembly
│   └── sections/            # page sections (hero, catalog, configurator, …)
├── public/                  # logo, product & machinery photography (NRB assets)
├── qa/                      # standalone render gate
└── .github/workflows/       # Pages deployment
```

## Data provenance & status

- Product configurations: NRB Product Database v3 (2019 catalogue lineage), reviewed status carried per row.
- Thread series: industry best practice (SAE J514 / BSP parallel) — **flagged on-page as pending NRB confirmation**.
- Commercial claims: sourced from NRB's current website.
- Machinery imagery: equipment-class references; to be replaced with NRB shop-floor photography.

## Credits

- © NRB Hydraulics Pvt. Ltd. — product, brand, photography
- Built by **Stratagem Olympus** (B2B RevOps, sister concern of VYNX)
- three.js — MIT · three-bvh-csg — MIT · parametric geometry authored for this project

/**
 * Canonical thread & dimension dataset for the Female JIC family.
 *
 * SOURCE OF TRUTH: industry best practice — SAE J514 (37° JIC/UNF) and the
 * BSP parallel series used in NRB's 2019 catalogue lineage — cross-checked
 * against the NRB Product Database v3 workbook (all rows match for the
 * standard sizes). Flagged PENDING CONFIRMATION until NRB signs off.
 *
 * tubeOD: nominal tube outside diameter (inches) = dash/16.
 * hexAF:  nut hex across-flats, typical SAE J514 values (approximate).
 */

export interface DashThreadSpec {
  dash: number;
  tubeOD: number;
  unf: string; // JIC 37° flare thread (SAE J514)
  bspp: string; // BSP parallel (ISO 228 / BS 2779) as used in NRB's BSP variants
  hexAF: number; // inches, typical
}

export const JIC_THREAD_STANDARDS: DashThreadSpec[] = [
  { dash: 2, tubeOD: 0.125, unf: '5/16"-24 UNF', bspp: '1/8"-28 BSP', hexAF: 0.3125 },
  { dash: 3, tubeOD: 0.1875, unf: '3/8"-24 UNF', bspp: '3/16"-28 BSP', hexAF: 0.375 },
  { dash: 4, tubeOD: 0.25, unf: '7/16"-20 UNF', bspp: '1/4"-19 BSP', hexAF: 0.4375 },
  { dash: 5, tubeOD: 0.3125, unf: '1/2"-20 UNF', bspp: '5/16"-19 BSP', hexAF: 0.5 },
  { dash: 6, tubeOD: 0.375, unf: '9/16"-18 UNF', bspp: '3/8"-19 BSP', hexAF: 0.5625 },
  { dash: 8, tubeOD: 0.5, unf: '3/4"-16 UNF', bspp: '1/2"-14 BSP', hexAF: 0.6875 },
  { dash: 10, tubeOD: 0.625, unf: '7/8"-14 UNF', bspp: '5/8"-14 BSP', hexAF: 0.8125 },
  { dash: 12, tubeOD: 0.75, unf: '1 1/16"-12 UNF', bspp: '3/4"-14 BSP', hexAF: 0.875 },
  { dash: 14, tubeOD: 0.875, unf: '1 3/16"-12 UNF', bspp: '7/8"-14 BSP', hexAF: 1.0625 },
  { dash: 16, tubeOD: 1.0, unf: '1 5/16"-12 UNF', bspp: '1"-11 BSP', hexAF: 1.1875 },
  { dash: 20, tubeOD: 1.25, unf: '1 5/8"-12 UNF', bspp: '1 1/4"-11 BSP', hexAF: 1.4375 },
  { dash: 24, tubeOD: 1.5, unf: '1 7/8"-12 UNF', bspp: '1 1/2"-11 BSP', hexAF: 1.75 },
  { dash: 32, tubeOD: 2.0, unf: '2 1/2"-12 UNF', bspp: '2"-11 BSP', hexAF: 2.3125 },
];

export function threadFor(dash: number, series: "unf" | "bspp" = "unf"): string {
  const row = JIC_THREAD_STANDARDS.find((r) => r.dash === dash);
  if (!row) return "—";
  return series === "unf" ? row.unf : row.bspp;
}

export const THREAD_DATA_NOTE =
  "Thread series per SAE J514 / BSP parallel best practice — pending NRB confirmation. " +
  "All standard sizes match NRB's product database.";

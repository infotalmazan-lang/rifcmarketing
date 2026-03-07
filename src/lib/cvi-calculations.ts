// ═══════════════════════════════════════════════════════════
// CVI Calculation Helpers — Content Validity Index
// RIFC Marketing Protocol · Dumitru Talmazan, 2026
// ═══════════════════════════════════════════════════════════

// All 35 items in order
export const CVI_ITEMS = [
  "R1","R2","R3","R4","R5","R6","R7",
  "I1","I2","I3","I4","I5","I6","I7","I8","I9","I10",
  "F1","F2","F3","F4","F5","F6","F7","F8","F9","F10","F11",
  "C1","C2","C3","C4","C5","C6","C7",
] as const;

export type CviItemId = typeof CVI_ITEMS[number];

// Dimension groupings
export const CVI_DIMENSIONS: Record<string, { items: string[]; label: string; color: string }> = {
  R: { items: ["R1","R2","R3","R4","R5","R6","R7"], label: "Relevanță", color: "#DC2626" },
  I: { items: ["I1","I2","I3","I4","I5","I6","I7","I8","I9","I10"], label: "Interes", color: "#2563EB" },
  F: { items: ["F1","F2","F3","F4","F5","F6","F7","F8","F9","F10","F11"], label: "Formă", color: "#059669" },
  C: { items: ["C1","C2","C3","C4","C5","C6","C7"], label: "Claritate", color: "#D97706" },
};

// Item labels (sub-factor names)
export const CVI_ITEM_LABELS: Record<string, string> = {
  R1: "Audiență / ICP", R2: "Timing", R3: "Etapa Journey", R4: "Context Situațional",
  R5: "Geografie / Cultură", R6: "Potrivire Canal", R7: "Segmentare Comportamentală",
  I1: "Promisiune Centrală", I2: "Beneficiu Imediat", I3: "Trigger Emoțional",
  I4: "Gap de Curiozitate", I5: "Urgență / Scarcity", I6: "Noutate / Surpriză",
  I7: "Relevanță Personală Percepută", I8: "Credibilitate / Dovadă Socială",
  I9: "Valoare Percepută", I10: "Hook / Primul Impact",
  F1: "Claritate Vizuală", F2: "Puterea Titlului", F3: "CTA — Call to Action",
  F4: "Structură și Flow", F5: "Densitate Optimă", F6: "Ton și Voce",
  F7: "Consistență Brand", F8: "Lizibilitate", F9: "Ierarhie Vizuală",
  F10: "Optimizare Format-Canal", F11: "Corectitudine Lingvistică",
  C1: "Înțelegere Imediată", C2: "Memorabilitate", C3: "Intenție de Acțiune",
  C4: "Diferențiere Percepută", C5: "Reducerea Obiecțiilor",
  C6: "Coerență Mesaj-Așteptare", C7: "Impact General Perceput",
};

// Full item text (questionnaire wording)
export const CVI_ITEM_TEXTS: Record<string, string> = {
  R1: "Mesajul se adresează unui segment specific de audiență cu o nevoie identificabilă pe care produsul sau serviciul o rezolvă.",
  R2: "Mesajul este difuzat la momentul potrivit din perspectiva ciclului de cumpărare al audienței.",
  R3: "Conținutul mesajului corespunde etapei corecte din buyer journey a destinatarului (conștientizare, evaluare sau decizie).",
  R4: "Mesajul ia în considerare contextul fizic sau digital în care este consumat de audiență.",
  R5: "Mesajul este adaptat cultural și lingvistic specificului geografic al audienței țintă.",
  R6: "Formatul și conținutul mesajului sunt optimizate nativ pentru canalul specific de distribuție.",
  R7: "Mesajul utilizează date comportamentale pentru a personaliza comunicarea pentru segmente specifice.",
  I1: "Mesajul articulează o promisiune centrală clară și atractivă, specifică pentru audiența vizată.",
  I2: "Beneficiul principal al ofertei este comunicat în primele 5 secunde de expunere la mesaj.",
  I3: "Mesajul activează o emoție specifică și autentică, aliniată cu dorința sau durerea principală a audienței.",
  I4: "Mesajul creează un gol informațional care motivează audiența să continue să consume conținutul.",
  I5: "Mesajul conține un element de urgență sau raritate legitimă care motivează acțiunea imediată.",
  I6: "Mesajul conține cel puțin un element neașteptat sau surprinzător față de norma din industrie.",
  I7: "Destinatarul simte că mesajul a fost creat specific pentru situația sau nevoile sale personale.",
  I8: "Mesajul include dovezi specifice și verificabile de credibilitate (statistici cu sursă, testimoniale cu identitate reală, studii de caz cu cifre).",
  I9: "Valoarea ofertei este construită strategic înainte de prezentarea prețului, făcând costul să pară mic față de beneficii.",
  I10: "Primele cuvinte sau secunde ale mesajului capturează imediat atenția prin originalitate, specificitate sau shock pozitiv.",
  F1: "Elementele vizuale ale mesajului clarifică și amplifică conținutul, fără a crea confuzie sau distracție.",
  F2: "Titlul sau headline-ul este clar, specific și comunică un beneficiu diferențiat în mai puțin de 5 secunde.",
  F3: "Există un singur CTA principal, orientat pe beneficiu, vizibil și cu fricțiune minimă pentru utilizator.",
  F4: "Mesajul urmează o structură logică deliberată care ghidează natural audiența de la problemă la soluție și la acțiune.",
  F5: "Lungimea mesajului este perfect calibrată pentru canalul de distribuție și obiectivul de comunicare.",
  F6: "Tonul mesajului este consistent, autentic și perfect calibrat pentru audiența și contextul specific.",
  F7: "Mesajul este consistent cu identitatea vizuală și valorile brandului, recognoscibil fără a vedea logo-ul.",
  F8: "Textul mesajului este ușor de citit la prima vedere, cu font adecvat, contrast și propoziții directe.",
  F9: "Elementele vizuale sunt organizate ierarhic, ghidând ochiul natural de la cel mai important spre CTA.",
  F10: "Specificațiile tehnice ale mesajului (dimensiuni, format, durate) sunt perfect adaptate platformei de distribuție.",
  F11: "Mesajul este liber de erori gramaticale, ortografice și de punctuație, cu diacritice complete.",
  C1: "Mesajul este înțeles corect și complet la prima expunere de cel puțin 90% din audiența țintă.",
  C2: "Mesajul lasă o amprentă mentală specifică pe care audiența o poate reproduce după 72 de ore fără re-expunere.",
  C3: "Mesajul generează o intenție puternică și imediată de a efectua acțiunea propusă.",
  C4: "Audiența poate articula clar de ce această ofertă este diferită și superioară alternativelor disponibile.",
  C5: "Mesajul anticipează și neutralizează proactiv principalele obiecții ale audienței țintă.",
  C6: "Experiența post-click sau post-conversie corespunde perfect cu promisiunea comunicată în mesaj.",
  C7: "Mesajul lasă o impresie generală puternic pozitivă, generând dorința de a împărtăși sau de a acționa imediat.",
};

// Calculate CVI for a single item across multiple experts
// CVI = proportion of scores ≥ 3 (relevant or highly relevant)
export function calcItemCvi(scores: number[]): number {
  if (scores.length === 0) return 0;
  const relevant = scores.filter(s => s >= 3).length;
  return relevant / scores.length;
}

// Calculate CVI per dimension from a single response
export function calcDimensionCvi(ratings: Record<string, number>, dimension: string): number {
  const items = CVI_DIMENSIONS[dimension]?.items || [];
  if (items.length === 0) return 0;
  const relevant = items.filter(item => (ratings[item] || 0) >= 3).length;
  return relevant / items.length;
}

// Calculate total CVI from dimension CVIs
export function calcTotalCvi(cviR: number, cviI: number, cviF: number, cviC: number): number {
  return (cviR + cviI + cviF + cviC) / 4;
}

// Determine item status based on CVI score
export function cviStatus(score: number): "PASS" | "REVISE" | "REJECT" | "pending" {
  if (score === 0) return "pending";
  if (score >= 0.80) return "PASS";
  if (score >= 0.70) return "REVISE";
  return "REJECT";
}

// ── Fleiss Kappa calculation ──────────────────────────────
// Measures inter-rater reliability for multiple raters
export function calcFleissKappa(
  data: number[][] // data[item][rater] = score (1-4)
): number {
  const n = data.length;         // number of items (subjects)
  if (n === 0) return 0;
  const N = data[0]?.length || 0; // number of raters
  if (N < 2) return 0;
  const k = 4; // number of categories (1, 2, 3, 4)

  // Count how many raters assigned each category for each item
  const counts: number[][] = []; // counts[item][category]
  for (let i = 0; i < n; i++) {
    const row = new Array(k).fill(0);
    for (let j = 0; j < N; j++) {
      const val = data[i][j];
      if (val >= 1 && val <= 4) {
        row[val - 1]++;
      }
    }
    counts.push(row);
  }

  // P_i: proportion of agreement for each item
  let sumPi = 0;
  for (let i = 0; i < n; i++) {
    let pairSum = 0;
    for (let j = 0; j < k; j++) {
      pairSum += counts[i][j] * counts[i][j];
    }
    const Pi = (pairSum - N) / (N * (N - 1));
    sumPi += Pi;
  }
  const Pbar = sumPi / n;

  // P_e: expected proportion of agreement by chance
  let Pebar = 0;
  for (let j = 0; j < k; j++) {
    let colSum = 0;
    for (let i = 0; i < n; i++) {
      colSum += counts[i][j];
    }
    const pj = colSum / (n * N);
    Pebar += pj * pj;
  }

  // Kappa
  if (Pebar >= 1) return 1; // perfect agreement by chance
  return (Pbar - Pebar) / (1 - Pebar);
}

// Build summary for all items across all responses
export interface CviItemSummary {
  item_id: string;
  item_label: string;
  construct: string;
  n_total: number;
  n_relevant: number;
  cvi_score: number;
  status: "PASS" | "REVISE" | "REJECT" | "pending";
}

export function buildCviSummary(
  responses: Record<string, number>[] // array of { R1: 3, R2: 4, ... } per expert
): CviItemSummary[] {
  return CVI_ITEMS.map(itemId => {
    const construct = itemId.replace(/\d+/, "");
    const scores = responses.map(r => r[itemId]).filter(s => s >= 1 && s <= 4);
    const cvi = calcItemCvi(scores);
    return {
      item_id: itemId,
      item_label: CVI_ITEM_LABELS[itemId] || itemId,
      construct,
      n_total: scores.length,
      n_relevant: scores.filter(s => s >= 3).length,
      cvi_score: Number(cvi.toFixed(2)),
      status: cviStatus(cvi),
    };
  });
}

/* ─── WhitePaperDocument — Master assembly for the RIFC White Paper PDF ─── */
/*
 * This is the root Document component that assembles all chapters.
 * It imports the font registrations as a side-effect and composes
 * every section from CoverPage through AuthorBackCover.
 *
 * Usage:
 *   import { WhitePaperDocument } from "./WhitePaperDocument";
 *   const stream = await ReactPDF.renderToStream(<WhitePaperDocument />);
 */

import React from "react";
import { Document } from "@react-pdf/renderer";

// Side-effect: registers Cormorant Garamond, DM Sans, JetBrains Mono
import "./fonts";

// Components
import { CoverPage } from "./components/CoverPage";
import { TableOfContents } from "./components/TableOfContents";

// Chapters 01–06
import { Ch01Philosophy } from "./chapters/Ch01Philosophy";
import { Ch02Equation } from "./chapters/Ch02Equation";
import { Ch03Anatomy } from "./chapters/Ch03Anatomy";
import { Ch04Methodology } from "./chapters/Ch04Methodology";
import { Ch05RelevanceGate } from "./chapters/Ch05RelevanceGate";
import { Ch06Omnichannel } from "./chapters/Ch06Omnichannel";

// Chapters 07–11
import { Ch07Archetypes } from "./chapters/Ch07Archetypes";
import { Ch08Comparison } from "./chapters/Ch08Comparison";
import { Ch09Implementation } from "./chapters/Ch09Implementation";
import { Ch10CaseStudies } from "./chapters/Ch10CaseStudies";
import { Ch11AIPrompts } from "./chapters/Ch11AIPrompts";

// Author + Back Cover
import { AuthorBackCover } from "./chapters/AuthorBackCover";

/*
 * Table of Contents — placeholder page numbers.
 * After a first render, update these with actual page numbers.
 */
const TOC_CHAPTERS = [
  { number: "01", title: "Filozofia", page: 4 },
  { number: "02", title: "Ecua\u021bia Universal\u0103", page: 11 },
  { number: "03", title: "Anatomia Variabilelor", page: 19 },
  { number: "04", title: "Metodologia de Scoring", page: 25 },
  { number: "05", title: "Poarta Relevan\u021bei", page: 32 },
  { number: "06", title: "Diagnostic Omnichannel", page: 39 },
  { number: "07", title: "Arhetipuri de E\u0219ec", page: 46 },
  { number: "08", title: "R IF C vs Altele", page: 53 },
  { number: "09", title: "Implementare", page: 60 },
  { number: "10", title: "Studii de Caz", page: 67 },
  { number: "11", title: "Integrare AI", page: 75 },
  { number: "--", title: "Despre Autor", page: 81 },
  { number: "--", title: "Resurse", page: 83 },
];

export function WhitePaperDocument() {
  return (
    <Document
      title="R IF C - Matematica Emo\u021bional\u0103 a Marketingului"
      author="Dumitru Talmazan"
      subject="Protocol de Marketing R IF C"
      keywords="RIFC, marketing, clarity, protocol, Talmazan"
      creator="rifcmarketing.com"
      producer="@react-pdf/renderer"
    >
      {/* Cover */}
      <CoverPage />

      {/* Table of Contents */}
      <TableOfContents chapters={TOC_CHAPTERS} />

      {/* Part I — Foundation */}
      <Ch01Philosophy />
      <Ch02Equation />
      <Ch03Anatomy />

      {/* Part II — Methodology */}
      <Ch04Methodology />
      <Ch05RelevanceGate />
      <Ch06Omnichannel />

      {/* Part III — Application */}
      <Ch07Archetypes />
      <Ch08Comparison />
      <Ch09Implementation />

      {/* Part IV — Proof & Tools */}
      <Ch10CaseStudies />
      <Ch11AIPrompts />

      {/* Closing */}
      <AuthorBackCover />
    </Document>
  );
}

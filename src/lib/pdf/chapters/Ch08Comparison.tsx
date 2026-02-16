/* ─── Chapter 08 — R IF C vs Altele ─── */

import React from "react";
import { View, Text, StyleSheet, Svg, Rect, Circle, Line } from "@react-pdf/renderer";
import { COLORS, FONTS, SPACING, PAGE_SIZE } from "../theme";
import { PageShell } from "../components/PageShell";
import { ChapterHeader } from "../components/ChapterHeader";
import { SectionText } from "../components/SectionText";
import { QuoteBlock } from "../components/QuoteBlock";

const CHAPTER_LABEL = "Capitolul 08";

/* ─── Data ─── */

const TIMELINE_NODES = [
  { year: "1898", name: "AIDA", type: "Atentie" },
  { year: "1960", name: "4Ps", type: "Strategie" },
  { year: "2010", name: "RACE", type: "Proces" },
  { year: "2017", name: "StoryBrand", type: "Narativ" },
  { year: "2024", name: "R IF C", type: "Diagnostic" },
];

const FRAMEWORKS = [
  {
    id: "aida",
    name: "AIDA",
    year: "1898",
    promise:
      "Model clar in 4 pasi: Atentie \u2192 Interes \u2192 Dorinta \u2192 Actiune. Simplu, memorabil, functional de 126 de ani.",
    limit:
      "Model liniar intr-o lume non-liniara. Nu masoara calitatea fiecarui pas. Poti avea Atentie dar zero Interes \u2014 si nu ai cum sa stii UNDE pierzi.",
    upgrade:
      "Scoreaza fiecare etapa numeric. Atentia devine R (Relevanta), Interesul devine I, Forma devine F. Iti spune exact DE CE clientul s-a oprit la \"Interes\" si cat te costa.",
  },
  {
    id: "race",
    name: "RACE",
    year: "2010",
    promise:
      "Framework digital complet: Reach \u2192 Act \u2192 Convert \u2192 Engage. Gestioneaza procesele cu checklist-uri clare.",
    limit:
      "Orientat pe volum, nu pe claritate. Masoara PROCESUL, nu CALITATEA mesajului. Poti bifa toate etapele si tot sa ai CPL de 10x peste benchmark.",
    upgrade:
      "Previne \"bugetul ars\" prin Poarta Relevantei. Diagnosticheaza CALITATEA la fiecare etapa cu un scor numeric.",
  },
  {
    id: "storybrand",
    name: "StoryBrand",
    year: "2017",
    promise:
      "Cel mai puternic framework narativ. Clientul e Eroul, Brandul e Ghidul. Transforma mesaje generice in povesti clare.",
    limit:
      "100% calitativ. \"Povestea noastra e suficient de buna?\" ramane fara raspuns masurabil. Fara scor de validare, nu stii daca narativul converteste sau doar suna bine.",
    upgrade:
      "Transforma povestea in cifre auditate. Cuantifica exact ce StoryBrand descrie calitativ. Coexista perfect: StoryBrand construieste narativul, R IF C il scoreaza.",
  },
  {
    id: "4ps",
    name: "4Ps",
    year: "1960",
    promise:
      "Cadru strategic complet: Product, Price, Place, Promotion. Defineste toata structura de go-to-market.",
    limit:
      "Framework de strategie, nu de comunicare. Nu rezolva comunicarea defectuoasa. Poti avea Product si Price perfecte \u2014 dar daca mesajul e confuz, conversia e zero.",
    upgrade:
      "Opereaza DEASUPRA strategiei, la nivelul comunicarii. Optimizeaza mesajul care vinde cei 4P.",
  },
];

const MATRIX_HEADERS = [
  "",
  "Construie\u0219te\ncampanie",
  "Diagnostic\ncalitate",
  "Scor\nnumeric",
  "Identific\u0103\nvariabila",
  "Cross-\nchannel",
  "Multiplicator\nI\u00d7F",
];

const MATRIX_ROWS = [
  { name: "AIDA", cells: [true, false, false, false, false, false] },
  { name: "RACE", cells: [true, false, false, false, true, false] },
  { name: "StoryBrand", cells: [true, false, false, false, false, false] },
  { name: "4Ps", cells: [true, false, false, false, true, false] },
  { name: "R IF C", cells: [false, true, true, true, true, true] },
];

/* ─── Styles ─── */

const s = StyleSheet.create({
  introBlock: { marginBottom: SPACING.sectionGap },
  introText: {
    fontFamily: FONTS.body,
    fontSize: 11,
    color: COLORS.textSecondary,
    lineHeight: 1.7,
    marginBottom: SPACING.paragraphGap,
  },
  introAccent: {
    fontFamily: FONTS.body,
    fontSize: 11,
    color: COLORS.textPrimary,
    lineHeight: 1.7,
    fontWeight: 700,
    marginBottom: SPACING.paragraphGap,
  },

  /* Timeline */
  timelineContainer: {
    marginBottom: SPACING.sectionGap,
  },
  timelineRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  timelineNode: {
    alignItems: "center",
    width: "18%",
  },
  timelineYear: {
    fontFamily: FONTS.mono,
    fontSize: 10,
    fontWeight: 700,
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  timelineDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginBottom: 4,
  },
  timelineName: {
    fontFamily: FONTS.mono,
    fontSize: 9,
    fontWeight: 700,
    color: COLORS.textPrimary,
    textAlign: "center",
    marginBottom: 2,
  },
  timelineType: {
    fontFamily: FONTS.body,
    fontSize: 8,
    color: COLORS.textMuted,
    textAlign: "center",
  },
  timelineLine: {
    marginTop: 4,
    marginBottom: 12,
    height: 1,
    backgroundColor: COLORS.borderLight,
  },

  /* Framework comparison card */
  fwCard: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    padding: SPACING.cardPadding,
    marginBottom: 14,
  },
  fwHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  fwName: {
    fontFamily: FONTS.mono,
    fontSize: 14,
    fontWeight: 700,
    color: COLORS.textPrimary,
  },
  fwYear: {
    fontFamily: FONTS.mono,
    fontSize: 10,
    color: COLORS.textMuted,
  },
  fwSectionLabel: {
    fontFamily: FONTS.mono,
    fontSize: 9,
    letterSpacing: 1,
    textTransform: "uppercase",
    marginBottom: 4,
  },
  fwSectionBody: {
    fontFamily: FONTS.body,
    fontSize: 10,
    color: COLORS.textSecondary,
    lineHeight: 1.6,
    marginBottom: 10,
  },

  /* Matrix */
  matrixContainer: {
    borderRadius: 4,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    overflow: "hidden",
    marginBottom: SPACING.sectionGap,
  },
  matrixHeaderRow: {
    flexDirection: "row",
    backgroundColor: COLORS.darkBg,
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  matrixHeaderCell: {
    fontFamily: FONTS.mono,
    fontSize: 7.5,
    color: COLORS.textOnDark,
    fontWeight: 700,
    textTransform: "uppercase",
    textAlign: "center",
  },
  matrixRow: {
    flexDirection: "row",
    paddingVertical: 7,
    paddingHorizontal: 4,
    borderTopWidth: 0.5,
    borderTopColor: COLORS.borderLight,
  },
  matrixRowEven: { backgroundColor: COLORS.pageBg },
  matrixRowOdd: { backgroundColor: COLORS.cardBg },
  matrixRowHighlight: {
    backgroundColor: COLORS.C + "12",
  },
  matrixCell: {
    fontFamily: FONTS.body,
    fontSize: 9,
    color: COLORS.textSecondary,
    textAlign: "center",
  },
  matrixNameCell: {
    fontFamily: FONTS.mono,
    fontSize: 9,
    fontWeight: 700,
    color: COLORS.textPrimary,
    textAlign: "left",
  },
  matrixCheck: {
    fontFamily: FONTS.mono,
    fontSize: 11,
    textAlign: "center",
  },
  matrixNote: {
    fontFamily: FONTS.body,
    fontSize: 10,
    color: COLORS.textSecondary,
    lineHeight: 1.6,
    marginBottom: SPACING.paragraphGap,
  },

  /* OS Visualization */
  osCard: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    padding: SPACING.cardPadding,
    marginBottom: SPACING.sectionGap,
  },
  osTitle: {
    fontFamily: FONTS.mono,
    fontSize: 12,
    fontWeight: 700,
    letterSpacing: 2,
    color: COLORS.C,
    marginBottom: 4,
  },
  osSub: {
    fontFamily: FONTS.body,
    fontSize: 10,
    color: COLORS.textMuted,
    marginBottom: 14,
  },
  osFlowRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  osFlowBox: {
    width: "30%",
    backgroundColor: COLORS.pageBg,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    padding: 10,
    alignItems: "center",
  },
  osFlowLabel: {
    fontFamily: FONTS.mono,
    fontSize: 9,
    fontWeight: 700,
    color: COLORS.textMuted,
    letterSpacing: 1,
    marginBottom: 4,
  },
  osFlowDesc: {
    fontFamily: FONTS.body,
    fontSize: 9,
    color: COLORS.textSecondary,
    textAlign: "center",
    lineHeight: 1.5,
  },
  osArrow: {
    fontFamily: FONTS.mono,
    fontSize: 16,
    color: COLORS.C,
  },

  /* Example */
  exTitle: {
    fontFamily: FONTS.heading,
    fontSize: 16,
    color: COLORS.textPrimary,
    marginBottom: 10,
  },
  exStep: {
    flexDirection: "row",
    marginBottom: 8,
  },
  exStepNum: {
    fontFamily: FONTS.mono,
    fontSize: 10,
    fontWeight: 700,
    color: COLORS.C,
    marginRight: 8,
    width: 18,
  },
  exStepContent: {
    flex: 1,
  },
  exStepTitle: {
    fontFamily: FONTS.body,
    fontSize: 10,
    fontWeight: 700,
    color: COLORS.textPrimary,
    marginBottom: 3,
  },
  exStepBody: {
    fontFamily: FONTS.body,
    fontSize: 10,
    color: COLORS.textSecondary,
    lineHeight: 1.6,
  },
  exCalcBox: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 4,
    padding: 10,
    marginBottom: 8,
    borderLeftWidth: 3,
  },
  exCalcText: {
    fontFamily: FONTS.mono,
    fontSize: 10,
    lineHeight: 1.6,
  },
  exLift: {
    fontFamily: FONTS.mono,
    fontSize: 11,
    fontWeight: 700,
    color: COLORS.C,
    marginTop: 4,
    marginBottom: 8,
  },

  /* Uniqueness */
  uniqueTitle: {
    fontFamily: FONTS.heading,
    fontSize: 18,
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  uniqueBody: {
    fontFamily: FONTS.body,
    fontSize: 10.5,
    color: COLORS.textSecondary,
    lineHeight: 1.65,
    marginBottom: 10,
  },
  formulaCompare: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 10,
  },
  formulaBox: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 4,
    padding: 10,
    alignItems: "center",
    width: "45%",
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  formulaText: {
    fontFamily: FONTS.mono,
    fontSize: 12,
    fontWeight: 700,
    marginBottom: 4,
  },
  formulaResult: {
    fontFamily: FONTS.mono,
    fontSize: 10,
    color: COLORS.textMuted,
  },
});

/* ─── Component ─── */

export function Ch08Comparison() {
  return (
    <>
      {/* Page 1: Chapter Header */}
      <ChapterHeader
        chapterNumber="08"
        title="R IF C vs Altele"
        subtitle="Piesa Lips\u0103 din Puzzle-ul Marketingului Mondial."
        color={COLORS.I}
      />

      {/* Page 2: Intro + Timeline */}
      <PageShell chapterLabel={CHAPTER_LABEL}>
        <View style={s.introBlock}>
          <Text style={s.introText}>
            AIDA are 126 de ani. 4Ps are 64. StoryBrand are 7. Niciunul nu \u00ee\u021bi spune DE CE campania ta nu func\u021bioneaz\u0103.
          </Text>
          <Text style={s.introAccent}>
            Toate framework-urile din lume te ajut\u0103 s\u0103 CONSTRUIE\u0218TI campanii. Niciunul nu te ajut\u0103 s\u0103 le DIAGNOSTICHEZI.
          </Text>
          <Text style={s.introText}>
            R IF C este Sistemul de Operare al marketingului \u2014 stratul de diagnostic care face ca toate \u201eaplica\u021biile\u201d (AIDA, RACE, StoryBrand, 4Ps) s\u0103 func\u021bioneze corect.
          </Text>
        </View>

        {/* Timeline 1898 → 2024 */}
        <View style={s.timelineContainer}>
          <View style={s.timelineLine} />
          <View style={s.timelineRow}>
            {TIMELINE_NODES.map((node, idx) => (
              <View key={idx} style={s.timelineNode}>
                <Text style={s.timelineYear}>{node.year}</Text>
                <View
                  style={[
                    s.timelineDot,
                    {
                      backgroundColor:
                        node.name === "R IF C" ? COLORS.C : COLORS.textMuted,
                    },
                  ]}
                />
                <Text style={s.timelineName}>{node.name}</Text>
                <Text style={s.timelineType}>{node.type}</Text>
              </View>
            ))}
          </View>
        </View>

        <SectionText
          heading="De ce marile framework-uri e\u0219ueaz\u0103 f\u0103r\u0103 un diagnostic numeric."
          body="Fiecare framework a fost revolu\u021bionar \u00een epoca sa. Dar niciunul nu ofer\u0103 un scor numeric care s\u0103 spun\u0103 exact unde pierzi bani \u0219i de ce."
          headingColor={COLORS.I}
        />
      </PageShell>

      {/* Pages 3-4: Framework comparisons */}
      <PageShell chapterLabel={CHAPTER_LABEL}>
        {FRAMEWORKS.slice(0, 2).map((fw) => (
          <View key={fw.id} style={s.fwCard}>
            <View style={s.fwHeader}>
              <Text style={s.fwName}>{fw.name}</Text>
              <Text style={s.fwYear}>{fw.year}</Text>
            </View>
            <Text style={[s.fwSectionLabel, { color: COLORS.C }]}>
              CE FACE BINE (PROMISIUNEA)
            </Text>
            <Text style={s.fwSectionBody}>{fw.promise}</Text>
            <Text style={[s.fwSectionLabel, { color: COLORS.R }]}>
              UNDE SE OPRE\u0218TE (LIMITA)
            </Text>
            <Text style={s.fwSectionBody}>{fw.limit}</Text>
            <Text style={[s.fwSectionLabel, { color: COLORS.I }]}>
              UPGRADE-UL R IF C
            </Text>
            <Text style={s.fwSectionBody}>{fw.upgrade}</Text>
          </View>
        ))}
      </PageShell>

      <PageShell chapterLabel={CHAPTER_LABEL}>
        {FRAMEWORKS.slice(2, 4).map((fw) => (
          <View key={fw.id} style={s.fwCard}>
            <View style={s.fwHeader}>
              <Text style={s.fwName}>{fw.name}</Text>
              <Text style={s.fwYear}>{fw.year}</Text>
            </View>
            <Text style={[s.fwSectionLabel, { color: COLORS.C }]}>
              CE FACE BINE (PROMISIUNEA)
            </Text>
            <Text style={s.fwSectionBody}>{fw.promise}</Text>
            <Text style={[s.fwSectionLabel, { color: COLORS.R }]}>
              UNDE SE OPRE\u0218TE (LIMITA)
            </Text>
            <Text style={s.fwSectionBody}>{fw.limit}</Text>
            <Text style={[s.fwSectionLabel, { color: COLORS.I }]}>
              UPGRADE-UL R IF C
            </Text>
            <Text style={s.fwSectionBody}>{fw.upgrade}</Text>
          </View>
        ))}
      </PageShell>

      {/* Page 5: Capability Matrix */}
      <PageShell chapterLabel={CHAPTER_LABEL}>
        <SectionText
          heading="Matricea de Capabilit\u0103\u021bi"
          body="Compara\u021bie direct\u0103 \u00eentre framework-uri pe 6 dimensiuni critice."
          headingColor={COLORS.I}
        />

        <View style={s.matrixContainer}>
          <View style={s.matrixHeaderRow}>
            {MATRIX_HEADERS.map((h, idx) => (
              <Text
                key={idx}
                style={[
                  s.matrixHeaderCell,
                  { width: idx === 0 ? "14%" : "14.3%" },
                ]}
              >
                {h}
              </Text>
            ))}
          </View>

          {MATRIX_ROWS.map((row, ridx) => (
            <View
              key={ridx}
              style={[
                s.matrixRow,
                ridx % 2 === 0 ? s.matrixRowEven : s.matrixRowOdd,
                ...(row.name === "R IF C" ? [s.matrixRowHighlight] : []),
              ]}
            >
              <Text style={[s.matrixNameCell, { width: "14%" }]}>
                {row.name}
              </Text>
              {row.cells.map((cell, cidx) => (
                <Text
                  key={cidx}
                  style={[
                    s.matrixCheck,
                    { width: "14.3%", color: cell ? COLORS.C : COLORS.textGhost },
                  ]}
                >
                  {cell ? "\u2713" : "\u2212"}
                </Text>
              ))}
            </View>
          ))}
        </View>

        <Text style={s.matrixNote}>
          Observi coloana \u201eMultiplicator I\u00d7F\u201d? R IF C este singurul framework care demonstreaz\u0103 matematic de ce un con\u021binut genial (I=10) livrat \u00eentr-un format gre\u0219it (F=1) produce un rezultat de 10\u00d7 mai mic dec\u00e2t ar putea fi.
        </Text>
        <Text style={s.matrixNote}>
          Interac\u021biunea Multiplicativ\u0103 \u2014 nimeni altcineva nu o m\u0103soar\u0103.
        </Text>
      </PageShell>

      {/* Page 6: OS Visualization + Uniqueness */}
      <PageShell chapterLabel={CHAPTER_LABEL}>
        <View style={s.osCard}>
          <Text style={s.osTitle}>R IF C = SISTEMUL DE OPERARE</Text>
          <Text style={s.osSub}>
            Framework-urile tale sunt aplica\u021biile. R IF C le face s\u0103 func\u021bioneze corect.
          </Text>

          <View style={s.osFlowRow}>
            <View style={s.osFlowBox}>
              <Text style={s.osFlowLabel}>INPUT</Text>
              <Text style={s.osFlowDesc}>
                Campania ta (construit\u0103 cu AIDA / StoryBrand / RACE / 4P)
              </Text>
            </View>
            <Text style={s.osArrow}>{"\u2192"}</Text>
            <View style={s.osFlowBox}>
              <Text style={s.osFlowLabel}>SCAN</Text>
              <Text style={s.osFlowDesc}>R IF C scoreaz\u0103 R, I, F</Text>
            </View>
            <Text style={s.osArrow}>{"\u2192"}</Text>
            <View style={s.osFlowBox}>
              <Text style={s.osFlowLabel}>OUTPUT</Text>
              <Text style={s.osFlowDesc}>
                Scor C + diagnostic + ac\u021biune
              </Text>
            </View>
          </View>
        </View>

        {/* Uniqueness */}
        <Text style={s.uniqueTitle}>Ce face R IF C cu adev\u0103rat diferit?</Text>
        <Text style={s.uniqueBody}>
          Majoritatea framework-urilor trateaz\u0103 variabilele separat. R IF C introduce Multiplicatorul de Form\u0103: I \u00d7 F. Este singurul framework care demonstreaz\u0103 matematic de ce un con\u021binut genial (I = 10) livrat \u00eentr-un format gre\u0219it (F = 1) produce un rezultat de 10\u00d7 mai mic dec\u00e2t ar putea fi.
        </Text>

        <View style={s.formulaCompare}>
          <View style={s.formulaBox}>
            <Text style={[s.formulaText, { color: COLORS.R }]}>
              I \u00d7 F = 10 \u00d7 1 = 10
            </Text>
            <Text style={s.formulaResult}>Format gre\u0219it</Text>
          </View>
          <View style={s.formulaBox}>
            <Text style={[s.formulaText, { color: COLORS.C }]}>
              I \u00d7 F = 10 \u00d7 10 = 100
            </Text>
            <Text style={s.formulaResult}>Format optim</Text>
          </View>
        </View>

        <QuoteBlock
          text="Aceea\u0219i substan\u021b\u0103. Format diferit. Impact de 10\u00d7 mai mare. Niciun alt framework nu cuantific\u0103 aceast\u0103 interac\u021biune."
          color={COLORS.I}
        />
      </PageShell>

      {/* Page 7: Worked Example + CTA */}
      <PageShell chapterLabel={CHAPTER_LABEL}>
        <Text style={s.exTitle}>EXEMPLU: StoryBrand + R IF C \u00een sinergie</Text>

        {/* Step 1 */}
        <View style={s.exStep}>
          <Text style={s.exStepNum}>01</Text>
          <View style={s.exStepContent}>
            <Text style={s.exStepTitle}>Construie\u0219ti narativul cu StoryBrand</Text>
            <Text style={s.exStepBody}>
              Clientul = Erou, Brandul = Ghid, Planul clar.
            </Text>
          </View>
        </View>

        {/* Step 2 */}
        <View style={s.exStep}>
          <Text style={s.exStepNum}>02</Text>
          <View style={s.exStepContent}>
            <Text style={s.exStepTitle}>Scorezi cu R IF C</Text>
            <Text style={s.exStepBody}>
              R = 8 (audien\u021ba e precis\u0103) | I = 4 (povestea e frumoas\u0103 dar beneficiul concret nu e clar \u00een primele 5 sec) | F = 7 (format bun, dar landing page lent)
            </Text>
          </View>
        </View>

        {/* Step 3 — Diagnostic */}
        <View style={[s.exCalcBox, { borderLeftColor: COLORS.R }]}>
          <Text style={[s.exCalcText, { color: COLORS.textPrimary }]}>
            C = 8 + (4 \u00d7 7) = 36 \u2192 ZGOMOT DE FOND
          </Text>
          <Text style={[s.exCalcText, { color: COLORS.textMuted }]}>
            Problema: I = 4 trage tot. Narativul sun\u0103 bine dar nu articuleaz\u0103 UVP-ul \u00een primele secunde.
          </Text>
        </View>

        {/* Step 4 — Fix */}
        <View style={s.exStep}>
          <Text style={s.exStepNum}>04</Text>
          <View style={s.exStepContent}>
            <Text style={s.exStepTitle}>Ajustezi povestea StoryBrand</Text>
            <Text style={s.exStepBody}>
              Adaugi beneficiul concret \u00een headline (I \u2192 8)
            </Text>
          </View>
        </View>

        <View style={[s.exCalcBox, { borderLeftColor: COLORS.C }]}>
          <Text style={[s.exCalcText, { color: COLORS.C }]}>
            C = 8 + (8 \u00d7 7) = 64 \u2192 CLARITATE MEDIE
          </Text>
        </View>

        <Text style={s.exLift}>+78% Claritate. Aceea\u0219i poveste. Un num\u0103r fixat.</Text>

        {/* Without vs With */}
        <View style={s.formulaCompare}>
          <View style={s.formulaBox}>
            <Text style={[s.formulaText, { color: COLORS.R, fontSize: 10 }]}>
              F\u0103r\u0103 R IF C
            </Text>
            <Text style={s.formulaResult}>
              \u201ePovestea e bun\u0103\u201d (subiectiv)
            </Text>
          </View>
          <View style={s.formulaBox}>
            <Text style={[s.formulaText, { color: COLORS.C, fontSize: 10 }]}>
              Cu R IF C
            </Text>
            <Text style={s.formulaResult}>
              \u201eI = 4, trebuie crescut\u201d (obiectiv)
            </Text>
          </View>
        </View>

        <QuoteBlock
          text="R IF C nu \u00eenlocuie\u0219te ce folose\u0219ti deja. \u00cel face m\u0103surabil."
          attribution="CAPITOLUL 09 \u2192 IMPLEMENTARE"
          color={COLORS.C}
        />
      </PageShell>
    </>
  );
}

/* ─── Chapter 07 — Arhetipuri de Eșec ─── */

import React from "react";
import { View, Text, StyleSheet, Svg, Rect } from "@react-pdf/renderer";
import { COLORS, FONTS, SPACING, PAGE_SIZE } from "../theme";
import { PageShell } from "../components/PageShell";
import { ChapterHeader } from "../components/ChapterHeader";
import { SectionText } from "../components/SectionText";
import { QuoteBlock } from "../components/QuoteBlock";

const CHAPTER_LABEL = "Capitolul 07";

/* ─── Archetype data ─── */

const ARCHETYPES = [
  {
    id: "ghost",
    name: "FANTOMA INVIZIBILA",
    color: "#DC2626",
    equation: { r: "0", i: "10", f: "10", result: "IRELEVANT", resultColor: "#DC2626" },
    rDim: false,
    iDim: true,
    fDim: true,
    headline: "Strigi intr-o camera goala.",
    symptom:
      "Simptom: CTR (rata de click) sub media pietei, desi vizualul e \"wow\". Buget consumat integral, zero lead-uri calificate.",
    body: "Ai un produs de 5 stele si un design impecabil, dar\u2026 esti invizibil. Mesajul tau e un monolog. Vorbesti despre tine unui public care are alte prioritati. Nu e o problema de creatie. E o problema de ego: ai presupus ca audienta ta esti tu.\n\nIgnori Poarta Relevantei. Daca audienta nu simte \"asta e despre mine ACUM\", restul efortului tau este filtrat automat.",
    verdict:
      "Esti un restaurant de lux in mijlocul desertului. Mancarea e perfecta, dar nu e nimeni sa manance. Buget ars pe audiente fara nicio intentie de cumparare.",
    caseStudy:
      "Un startup fintech a cheltuit $50K pe LinkedIn Ads pentru API-ul lor enterprise. Creative impecabil, copywriting de manual. Dar 87% din impressions au ajuns la freelanceri care nu aveau buget de enterprise. CPA: infinit. ROI: -100%.",
    questions: [
      "Poti descrie clientul tau ideal in 3 propozitii \u2014 fara sa folosesti cuvantul \"toata lumea\"?",
      "Daca ai arata reclama ta unor 100 de oameni random de pe strada, cati ar spune \"Asta e pentru mine\"?",
      "Cand ai verificat ultima data daca traficul real din Analytics se potriveste cu ICP-ul tau?",
    ],
  },
  {
    id: "noise",
    name: "ZGOMOTUL ESTETIC",
    color: "#D97706",
    equation: { r: "10", i: "1", f: "10", result: "SLAB", resultColor: "#D97706" },
    rDim: true,
    iDim: false,
    fDim: true,
    headline: "Toata lumea da like. Nimeni nu da bani.",
    symptom:
      "Simptom: Engagement mare pe social media (like-uri, share-uri, comentarii), dar rata de conversie zero. Agentia raporteaza \"succes\", contul bancar spune altceva.",
    body: "Agentia de creatie e fericita, dar contul bancar e la fel. Ai facut arta, nu marketing. Arati bine, dar nu spui nimic. Oamenii dau like la video, dar uita numele brandului in secunda doi. Confunzi Atentia cu Interesul \u2014 si platesti premium pentru o iluzie.\n\nAi pus tot bugetul in \"ambalaj\" (F) si ai uitat sa pui \"substanta\" (I).",
    verdict:
      "Un spectacol de artificii: stralucitor, scump si uitat in 2 secunde. Premii de design, zero conversii. Like-urile nu platesc facturile.",
    caseStudy:
      "Un brand de cosmetice luxury a produs un video ad premiat la Cannes. 2M vizualizari, mii de share-uri. In focus group, nimeni nu putea spune ce produs promoveaza. Brand awareness: mare. Purchase intent: zero.",
    questions: [
      "Daca elimini logo-ul si culorile brandului din reclama ta, mai ramane vreun motiv concret sa cumperi?",
      "Poti articula beneficiul principal al ofertei tale in maximum 7 cuvinte?",
      "Ultimul tau creative \u2014 cate like-uri a primit vs. cate vanzari a generat?",
    ],
  },
  {
    id: "diamond",
    name: "DIAMANTUL INGROPAT",
    color: "#2563EB",
    equation: { r: "10", i: "10", f: "1", result: "IROSIT", resultColor: "#D97706" },
    rDim: true,
    iDim: true,
    fDim: false,
    headline: "Esti cel mai bine pastrat secret din piata.",
    symptom:
      "Simptom: Vinzi doar prin recomandari, niciodata \"la rece\". Clientii existenti te adora, dar nu poti scala. Site-ul are trafic dar conversion rate sub 1%.",
    body: "Produsul tau este revolutionar, dar site-ul tau arata ca in 2005. Clientii te descopera greu si pleaca repede. Ai valoare imensa, dar efortul cognitiv pe care il ceri de la client \u2014 sa citeasca blocuri de text, sa navigheze un site vechi, sa descifreze un pitch de 47 de slide-uri \u2014 ii face sa plece la concurenta care arata mai bine, desi e mai slaba.\n\nBlestemul expertului: stii prea mult si presupui ca si clientul intelege.",
    verdict:
      "Ai leacul pentru cancer scris cu mana pe un servetel. Nimeni nu are incredere sa-l ia. Irosesti un produs genial din cauza unui ambalaj mediocru.",
    caseStudy:
      "O firma de consultanta B2B avea cea mai buna metodologie din piata. White paper-urile lor contineau insight-uri revolutionare. Dar site-ul arata ca din 2005, emailurile erau text neformatat, pitch deck-ul avea 47 de slide-uri dense. Conversion rate: 0.2%.",
    questions: [
      "Cand ai actualizat ultima data designul site-ului? Daca raspunsul e \"acum 2+ ani\", F-ul tau e sub 5.",
      "Cat de repede se incarca site-ul tau pe mobil? Daca sunt peste 3 secunde, pierzi 53% din vizitatori.",
      "Prezentarea ta de vanzare are peste 15 slide-uri? Daca da, jumatate din audienta s-a deconectat mental.",
    ],
  },
];

const DIAGNOSIS_ROWS = [
  {
    symptom: "CTR mic, dar produs bun \u2014 nimeni nu vede reclama",
    archetype: "Fantoma Invizibila (R \u2248 0)",
    solution: "Opreste Ad-urile. Re-defineste R. Targetarea e problema, nu creative-ul.",
    color: "#DC2626",
  },
  {
    symptom: "CTR mare, Bounce rate urias \u2014 lumea vine dar pleaca",
    archetype: "Zgomotul Estetic (I \u2248 1)",
    solution: "Rescrie oferta. Creste I. Ai atentie dar zero substanta.",
    color: "#D97706",
  },
  {
    symptom: "Clienti fideli, dar putini noi \u2014 secretul cel mai bine pastrat",
    archetype: "Diamantul Ingropat (F \u2248 1)",
    solution: "Investeste in Design/UX. Creste F. Valoarea exista, ambalajul nu.",
    color: "#2563EB",
  },
  {
    symptom: "CTR mic, Bounce mare, zero clienti \u2014 nimic nu functioneaza",
    archetype: "Combinat: R + I + F toate slabe",
    solution: "Auditeaza tot cu R IF C. Incepe cu R (Poarta Relevantei).",
    color: "#6B7280",
  },
];

/* ─── Styles ─── */

const s = StyleSheet.create({
  /* Intro */
  introBlock: {
    marginBottom: SPACING.sectionGap,
  },
  description: {
    fontFamily: FONTS.body,
    fontSize: 11,
    color: COLORS.textSecondary,
    lineHeight: 1.7,
    marginBottom: SPACING.paragraphGap,
  },

  /* Archetype card */
  archeCard: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    padding: SPACING.cardPadding,
    marginBottom: SPACING.sectionGap,
  },
  archeTopBorder: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
  },
  archeName: {
    fontFamily: FONTS.mono,
    fontSize: 12,
    fontWeight: 700,
    letterSpacing: 2,
    textTransform: "uppercase",
    marginBottom: 6,
  },
  archeHeadline: {
    fontFamily: FONTS.heading,
    fontSize: 18,
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  archeEquationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    gap: 6,
  },
  archeEqPart: {
    fontFamily: FONTS.mono,
    fontSize: 12,
  },
  archeEqOperator: {
    fontFamily: FONTS.mono,
    fontSize: 12,
    color: COLORS.textMuted,
  },
  archeResultBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginLeft: 6,
  },
  archeResultText: {
    fontFamily: FONTS.mono,
    fontSize: 10,
    fontWeight: 700,
    color: "#FFFFFF",
  },
  archeSymptom: {
    fontFamily: FONTS.heading,
    fontSize: 10,
    color: COLORS.textMuted,
    lineHeight: 1.6,
    marginBottom: 10,
    fontStyle: "italic",
  },
  archeBody: {
    fontFamily: FONTS.body,
    fontSize: 10.5,
    color: COLORS.textSecondary,
    lineHeight: 1.65,
    marginBottom: 10,
  },

  /* Verdict */
  verdictBox: {
    borderLeftWidth: 3,
    paddingLeft: 12,
    paddingVertical: 6,
    marginBottom: 10,
  },
  verdictLabel: {
    fontFamily: FONTS.mono,
    fontSize: 9,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    marginBottom: 4,
  },
  verdictText: {
    fontFamily: FONTS.body,
    fontSize: 10,
    color: COLORS.textPrimary,
    lineHeight: 1.6,
  },

  /* Case study */
  caseBox: {
    backgroundColor: COLORS.pageBg,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    padding: 12,
    marginBottom: 10,
  },
  caseLabel: {
    fontFamily: FONTS.mono,
    fontSize: 8,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    color: COLORS.textMuted,
    marginBottom: 4,
  },
  caseText: {
    fontFamily: FONTS.body,
    fontSize: 10,
    color: COLORS.textSecondary,
    lineHeight: 1.6,
  },

  /* Questions */
  questionRow: {
    flexDirection: "row",
    marginBottom: 4,
    paddingLeft: 4,
  },
  questionBullet: {
    fontFamily: FONTS.mono,
    fontSize: 10,
    color: COLORS.textMuted,
    marginRight: 6,
    width: 12,
  },
  questionText: {
    fontFamily: FONTS.body,
    fontSize: 10,
    color: COLORS.textSecondary,
    lineHeight: 1.6,
    flex: 1,
  },

  /* Diagnosis table */
  diagTitle: {
    fontFamily: FONTS.heading,
    fontSize: 20,
    color: COLORS.textPrimary,
    marginBottom: 6,
  },
  diagSubtitle: {
    fontFamily: FONTS.body,
    fontSize: 11,
    color: COLORS.textMuted,
    marginBottom: 16,
  },
  diagTable: {
    borderRadius: 4,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    overflow: "hidden",
    marginBottom: SPACING.sectionGap,
  },
  diagHeaderRow: {
    flexDirection: "row",
    backgroundColor: COLORS.darkBg,
    paddingVertical: 8,
    paddingHorizontal: 8,
  },
  diagHeaderCell: {
    fontFamily: FONTS.mono,
    fontSize: 9,
    color: COLORS.textOnDark,
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  diagDataRow: {
    flexDirection: "row",
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderTopWidth: 0.5,
    borderTopColor: COLORS.borderLight,
  },
  diagDataRowEven: { backgroundColor: COLORS.pageBg },
  diagDataRowOdd: { backgroundColor: COLORS.cardBg },
  diagCell: {
    fontFamily: FONTS.body,
    fontSize: 9.5,
    color: COLORS.textSecondary,
    lineHeight: 1.5,
  },
  diagCellBold: {
    fontWeight: 700,
  },

  /* Simulator concept */
  simCard: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    padding: SPACING.cardPadding,
    marginBottom: SPACING.sectionGap,
  },
  simTitle: {
    fontFamily: FONTS.mono,
    fontSize: 10,
    letterSpacing: 2,
    textTransform: "uppercase",
    color: COLORS.textMuted,
    marginBottom: 6,
  },
  simHeadline: {
    fontFamily: FONTS.heading,
    fontSize: 16,
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  simBody: {
    fontFamily: FONTS.body,
    fontSize: 10,
    color: COLORS.textSecondary,
    lineHeight: 1.6,
    marginBottom: 10,
  },
  simPresetRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  simPreset: {
    backgroundColor: COLORS.pageBg,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    padding: 8,
    width: "23%",
    alignItems: "center",
  },
  simPresetLabel: {
    fontFamily: FONTS.mono,
    fontSize: 8,
    color: COLORS.textPrimary,
    textAlign: "center",
    marginBottom: 4,
  },
  simPresetValues: {
    fontFamily: FONTS.mono,
    fontSize: 8,
    color: COLORS.textMuted,
    textAlign: "center",
  },
});

/* ─── Component ─── */

export function Ch07Archetypes() {
  return (
    <>
      {/* Page 1: Chapter Header */}
      <ChapterHeader
        chapterNumber="07"
        title="Arhetipuri de E\u0219ec"
        subtitle="Unde se scurge bugetul t\u0103u? Identific\u0103-\u021bi Arhetipul de E\u0219ec."
        color={COLORS.R}
      />

      {/* Page 2: Intro + Simulator concept */}
      <PageShell chapterLabel={CHAPTER_LABEL}>
        <View style={s.introBlock}>
          <Text style={s.description}>
            Fiecare e\u0219ec de marketing se \u00eencadreaz\u0103 \u00eentr-unul din cele trei tipare. \u00cenva\u021b\u0103 s\u0103 le diagnostichezi instantaneu \u2014 \u0219i opre\u0219te hemoragia.
          </Text>
        </View>

        {/* Failure Simulator concept */}
        <View style={s.simCard}>
          <Text style={s.simTitle}>SIMULATORUL DE E\u0218EC</Text>
          <Text style={s.simHeadline}>
            Mi\u0219c\u0103 variabilele \u0219i prive\u0219te cum se pr\u0103bu\u0219e\u0219te Claritatea.
          </Text>
          <Text style={s.simBody}>
            Ecua\u021bia live: C = R + (I \u00d7 F). Dac\u0103 R &lt; 3, Poarta Relevan\u021bei se activeaz\u0103 automat \u2014 E\u0219ec Critic indiferent de I \u00d7 F.
          </Text>

          {/* Presets */}
          <View style={s.simPresetRow}>
            {[
              { label: "Fantoma\nInvizibil\u0103", vals: "R=1, I=8, F=9" },
              { label: "Zgomot\nEstetic", vals: "R=7, I=1, F=10" },
              { label: "Diamant\n\u00cengropat", vals: "R=8, I=10, F=1" },
              { label: "Campanie\nPerfect\u0103", vals: "R=9, I=9, F=9" },
            ].map((p, idx) => (
              <View key={idx} style={s.simPreset}>
                <Text style={s.simPresetLabel}>{p.label}</Text>
                <Text style={s.simPresetValues}>{p.vals}</Text>
              </View>
            ))}
          </View>
        </View>

        <QuoteBlock
          text="Fiecare euro cheltuit pe o campanie f\u0103r\u0103 diagnostic R IF C este un pariu, nu o investi\u021bie."
          color={COLORS.R}
        />
      </PageShell>

      {/* Pages 3-4: Archetype 1 — Fantoma Invizibila */}
      <PageShell chapterLabel={CHAPTER_LABEL}>
        <View style={s.archeCard}>
          <View style={[s.archeTopBorder, { backgroundColor: ARCHETYPES[0].color }]} />
          <Text style={[s.archeName, { color: ARCHETYPES[0].color }]}>
            {ARCHETYPES[0].name}
          </Text>
          <Text style={s.archeHeadline}>{ARCHETYPES[0].headline}</Text>

          {/* Equation */}
          <View style={s.archeEquationRow}>
            <Text style={[s.archeEqPart, { color: COLORS.R, opacity: ARCHETYPES[0].rDim ? 0.4 : 1 }]}>
              R={ARCHETYPES[0].equation.r}
            </Text>
            <Text style={s.archeEqOperator}>+</Text>
            <Text style={s.archeEqOperator}>(</Text>
            <Text style={[s.archeEqPart, { color: COLORS.I, opacity: ARCHETYPES[0].iDim ? 0.4 : 1 }]}>
              I={ARCHETYPES[0].equation.i}
            </Text>
            <Text style={s.archeEqOperator}>{"\u00D7"}</Text>
            <Text style={[s.archeEqPart, { color: COLORS.F, opacity: ARCHETYPES[0].fDim ? 0.4 : 1 }]}>
              F={ARCHETYPES[0].equation.f}
            </Text>
            <Text style={s.archeEqOperator}>)</Text>
            <Text style={s.archeEqOperator}>=</Text>
            <View style={[s.archeResultBadge, { backgroundColor: ARCHETYPES[0].equation.resultColor }]}>
              <Text style={s.archeResultText}>{ARCHETYPES[0].equation.result}</Text>
            </View>
          </View>

          <Text style={s.archeSymptom}>{ARCHETYPES[0].symptom}</Text>
          <Text style={s.archeBody}>{ARCHETYPES[0].body}</Text>

          {/* Verdict */}
          <View style={[s.verdictBox, { borderLeftColor: ARCHETYPES[0].color }]}>
            <Text style={[s.verdictLabel, { color: ARCHETYPES[0].color }]}>VERDICT</Text>
            <Text style={s.verdictText}>{ARCHETYPES[0].verdict}</Text>
          </View>

          {/* Case study */}
          <View style={s.caseBox}>
            <Text style={s.caseLabel}>STUDIU DE CAZ</Text>
            <Text style={s.caseText}>{ARCHETYPES[0].caseStudy}</Text>
          </View>

          {/* Diagnostic questions */}
          {ARCHETYPES[0].questions.map((q, idx) => (
            <View key={idx} style={s.questionRow}>
              <Text style={s.questionBullet}>{idx + 1}.</Text>
              <Text style={s.questionText}>{q}</Text>
            </View>
          ))}
        </View>
      </PageShell>

      {/* Page 5: Archetype 2 — Zgomotul Estetic */}
      <PageShell chapterLabel={CHAPTER_LABEL}>
        <View style={s.archeCard}>
          <View style={[s.archeTopBorder, { backgroundColor: ARCHETYPES[1].color }]} />
          <Text style={[s.archeName, { color: ARCHETYPES[1].color }]}>
            {ARCHETYPES[1].name}
          </Text>
          <Text style={s.archeHeadline}>{ARCHETYPES[1].headline}</Text>

          <View style={s.archeEquationRow}>
            <Text style={[s.archeEqPart, { color: COLORS.R, opacity: ARCHETYPES[1].rDim ? 0.4 : 1 }]}>
              R={ARCHETYPES[1].equation.r}
            </Text>
            <Text style={s.archeEqOperator}>+</Text>
            <Text style={s.archeEqOperator}>(</Text>
            <Text style={[s.archeEqPart, { color: COLORS.I, opacity: ARCHETYPES[1].iDim ? 0.4 : 1 }]}>
              I={ARCHETYPES[1].equation.i}
            </Text>
            <Text style={s.archeEqOperator}>{"\u00D7"}</Text>
            <Text style={[s.archeEqPart, { color: COLORS.F, opacity: ARCHETYPES[1].fDim ? 0.4 : 1 }]}>
              F={ARCHETYPES[1].equation.f}
            </Text>
            <Text style={s.archeEqOperator}>)</Text>
            <Text style={s.archeEqOperator}>=</Text>
            <View style={[s.archeResultBadge, { backgroundColor: ARCHETYPES[1].equation.resultColor }]}>
              <Text style={s.archeResultText}>{ARCHETYPES[1].equation.result}</Text>
            </View>
          </View>

          <Text style={s.archeSymptom}>{ARCHETYPES[1].symptom}</Text>
          <Text style={s.archeBody}>{ARCHETYPES[1].body}</Text>

          <View style={[s.verdictBox, { borderLeftColor: ARCHETYPES[1].color }]}>
            <Text style={[s.verdictLabel, { color: ARCHETYPES[1].color }]}>VERDICT</Text>
            <Text style={s.verdictText}>{ARCHETYPES[1].verdict}</Text>
          </View>

          <View style={s.caseBox}>
            <Text style={s.caseLabel}>STUDIU DE CAZ</Text>
            <Text style={s.caseText}>{ARCHETYPES[1].caseStudy}</Text>
          </View>

          {ARCHETYPES[1].questions.map((q, idx) => (
            <View key={idx} style={s.questionRow}>
              <Text style={s.questionBullet}>{idx + 1}.</Text>
              <Text style={s.questionText}>{q}</Text>
            </View>
          ))}
        </View>
      </PageShell>

      {/* Page 6: Archetype 3 — Diamantul Ingropat */}
      <PageShell chapterLabel={CHAPTER_LABEL}>
        <View style={s.archeCard}>
          <View style={[s.archeTopBorder, { backgroundColor: ARCHETYPES[2].color }]} />
          <Text style={[s.archeName, { color: ARCHETYPES[2].color }]}>
            {ARCHETYPES[2].name}
          </Text>
          <Text style={s.archeHeadline}>{ARCHETYPES[2].headline}</Text>

          <View style={s.archeEquationRow}>
            <Text style={[s.archeEqPart, { color: COLORS.R, opacity: ARCHETYPES[2].rDim ? 0.4 : 1 }]}>
              R={ARCHETYPES[2].equation.r}
            </Text>
            <Text style={s.archeEqOperator}>+</Text>
            <Text style={s.archeEqOperator}>(</Text>
            <Text style={[s.archeEqPart, { color: COLORS.I, opacity: ARCHETYPES[2].iDim ? 0.4 : 1 }]}>
              I={ARCHETYPES[2].equation.i}
            </Text>
            <Text style={s.archeEqOperator}>{"\u00D7"}</Text>
            <Text style={[s.archeEqPart, { color: COLORS.F, opacity: ARCHETYPES[2].fDim ? 0.4 : 1 }]}>
              F={ARCHETYPES[2].equation.f}
            </Text>
            <Text style={s.archeEqOperator}>)</Text>
            <Text style={s.archeEqOperator}>=</Text>
            <View style={[s.archeResultBadge, { backgroundColor: ARCHETYPES[2].equation.resultColor }]}>
              <Text style={s.archeResultText}>{ARCHETYPES[2].equation.result}</Text>
            </View>
          </View>

          <Text style={s.archeSymptom}>{ARCHETYPES[2].symptom}</Text>
          <Text style={s.archeBody}>{ARCHETYPES[2].body}</Text>

          <View style={[s.verdictBox, { borderLeftColor: ARCHETYPES[2].color }]}>
            <Text style={[s.verdictLabel, { color: ARCHETYPES[2].color }]}>VERDICT</Text>
            <Text style={s.verdictText}>{ARCHETYPES[2].verdict}</Text>
          </View>

          <View style={s.caseBox}>
            <Text style={s.caseLabel}>STUDIU DE CAZ</Text>
            <Text style={s.caseText}>{ARCHETYPES[2].caseStudy}</Text>
          </View>

          {ARCHETYPES[2].questions.map((q, idx) => (
            <View key={idx} style={s.questionRow}>
              <Text style={s.questionBullet}>{idx + 1}.</Text>
              <Text style={s.questionText}>{q}</Text>
            </View>
          ))}
        </View>
      </PageShell>

      {/* Page 7: Diagnosis table + CTA */}
      <PageShell chapterLabel={CHAPTER_LABEL}>
        <Text style={s.diagTitle}>\u00cen care arhetip te \u00eencadrezi?</Text>
        <Text style={s.diagSubtitle}>Diagnosticheaz\u0103-te \u00een 10 secunde.</Text>

        <View style={s.diagTable}>
          {/* Header */}
          <View style={s.diagHeaderRow}>
            <Text style={[s.diagHeaderCell, { width: "35%" }]}>Dac\u0103 ai\u2026</Text>
            <Text style={[s.diagHeaderCell, { width: "30%" }]}>Atunci e\u0219ti:</Text>
            <Text style={[s.diagHeaderCell, { width: "35%" }]}>Solu\u021bia R IF C:</Text>
          </View>

          {/* Rows */}
          {DIAGNOSIS_ROWS.map((row, idx) => (
            <View
              key={idx}
              style={[
                s.diagDataRow,
                idx % 2 === 0 ? s.diagDataRowEven : s.diagDataRowOdd,
              ]}
            >
              <Text style={[s.diagCell, { width: "35%" }]}>{row.symptom}</Text>
              <Text style={[s.diagCell, s.diagCellBold, { width: "30%", color: row.color }]}>
                {row.archetype}
              </Text>
              <Text style={[s.diagCell, { width: "35%" }]}>{row.solution}</Text>
            </View>
          ))}
        </View>

        <QuoteBlock
          text="Nu mai l\u0103sa matematica s\u0103 lucreze \u00eempotriva ta. Las\u0103 AI-ul s\u0103 diagnosticheze campania ta \u00een 30 de secunde."
          attribution="rifcmarketing.com/audit"
          color={COLORS.C}
        />
      </PageShell>
    </>
  );
}

/* ─── Chapter 02 — Ecua\u021bia Universal\u0103: Codul Surs\u0103 al Profitului ─── */

import React from "react";
import { Page, View, Text, StyleSheet, Svg, Rect, Circle, Line } from "@react-pdf/renderer";
import { COLORS, FONTS, SPACING, PAGE_SIZE } from "../theme";
import { PageShell } from "../components/PageShell";

const CHAPTER = "Capitolul 02";

const s = StyleSheet.create({
  /* ── Chapter opener (dark page) ── */
  openerPage: {
    backgroundColor: COLORS.darkBg,
    paddingHorizontal: SPACING.pageMarginH,
    paddingVertical: SPACING.pageMarginV,
    justifyContent: "center",
  },
  chapterNum: {
    fontFamily: FONTS.mono,
    fontSize: 11,
    letterSpacing: 4,
    color: COLORS.I,
    textTransform: "uppercase",
    marginBottom: 14,
  },
  chapterTitle: {
    fontFamily: FONTS.heading,
    fontSize: 36,
    fontWeight: 700,
    color: COLORS.textOnDark,
    lineHeight: 1.25,
    marginBottom: 6,
  },
  chapterSubtitle: {
    fontFamily: FONTS.heading,
    fontSize: 22,
    fontWeight: 300,
    color: COLORS.textOnDarkSecondary,
    lineHeight: 1.35,
    marginBottom: 20,
  },
  chapterSub2: {
    fontFamily: FONTS.body,
    fontSize: 12,
    color: COLORS.textOnDarkMuted,
    lineHeight: 1.5,
  },

  /* ── Common content styles ── */
  h2: {
    fontFamily: FONTS.heading,
    fontSize: 22,
    fontWeight: 700,
    color: COLORS.textPrimary,
    marginBottom: 14,
    lineHeight: 1.3,
  },
  h3: {
    fontFamily: FONTS.heading,
    fontSize: 16,
    fontWeight: 700,
    color: COLORS.textPrimary,
    marginBottom: 8,
    lineHeight: 1.3,
  },
  body: {
    fontFamily: FONTS.body,
    fontSize: 10.5,
    color: COLORS.textSecondary,
    lineHeight: 1.65,
    marginBottom: SPACING.paragraphGap,
  },
  bodyBold: {
    fontFamily: FONTS.body,
    fontSize: 10.5,
    fontWeight: 700,
    color: COLORS.textPrimary,
    lineHeight: 1.65,
  },

  /* ── Formula hero ── */
  formulaHero: {
    backgroundColor: COLORS.darkBg,
    borderRadius: 6,
    padding: 32,
    alignItems: "center",
    marginBottom: SPACING.sectionGap,
  },
  formulaLabel: {
    fontFamily: FONTS.mono,
    fontSize: 8,
    letterSpacing: 3,
    color: COLORS.textOnDarkMuted,
    textTransform: "uppercase",
    marginBottom: 16,
  },
  formulaRow: {
    flexDirection: "row",
    alignItems: "baseline",
    marginBottom: 12,
  },
  formulaLetter: {
    fontFamily: FONTS.mono,
    fontSize: 42,
    fontWeight: 700,
  },
  formulaOp: {
    fontFamily: FONTS.mono,
    fontSize: 28,
    color: COLORS.textOnDarkMuted,
    marginHorizontal: 6,
  },
  formulaNote: {
    fontFamily: FONTS.body,
    fontSize: 9,
    color: COLORS.textOnDarkMuted,
    textAlign: "center",
    marginTop: 8,
  },

  /* ── I\u00d7F Illumination ── */
  illuminationTitle: {
    fontFamily: FONTS.heading,
    fontSize: 18,
    fontWeight: 700,
    color: COLORS.textPrimary,
    marginBottom: 12,
  },
  calcCard: {
    borderWidth: 1,
    borderRadius: 6,
    padding: 14,
    marginBottom: 10,
  },
  calcLabel: {
    fontFamily: FONTS.body,
    fontSize: 9,
    fontWeight: 700,
    letterSpacing: 1,
    textTransform: "uppercase",
    marginBottom: 6,
  },
  calcFormula: {
    fontFamily: FONTS.mono,
    fontSize: 20,
    fontWeight: 700,
    marginBottom: 4,
  },
  calcResult: {
    fontFamily: FONTS.body,
    fontSize: 10,
    color: COLORS.textSecondary,
    lineHeight: 1.5,
  },
  highlightBox: {
    backgroundColor: COLORS.darkBg,
    padding: 14,
    borderRadius: 4,
    marginTop: 10,
    marginBottom: SPACING.paragraphGap,
  },
  highlightText: {
    fontFamily: FONTS.body,
    fontSize: 11,
    fontWeight: 700,
    color: COLORS.textOnDark,
    textAlign: "center",
  },

  /* ── Architectural variables ── */
  archCard: {
    borderWidth: 1,
    borderRadius: 6,
    padding: 16,
    marginBottom: 14,
    flexDirection: "row",
    gap: 14,
  },
  archLetterBox: {
    width: 44,
    height: 44,
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
  },
  archLetter: {
    fontFamily: FONTS.mono,
    fontSize: 22,
    fontWeight: 700,
    color: "#FFFFFF",
  },
  archContent: {
    flex: 1,
  },
  archTitle: {
    fontFamily: FONTS.body,
    fontSize: 10.5,
    fontWeight: 700,
    color: COLORS.textPrimary,
    marginBottom: 4,
    lineHeight: 1.4,
  },
  archMetaphor: {
    fontFamily: FONTS.body,
    fontSize: 9.5,
    color: COLORS.textSecondary,
    lineHeight: 1.55,
    marginBottom: 4,
  },
  archThreshold: {
    fontFamily: FONTS.mono,
    fontSize: 8.5,
    color: COLORS.R,
    marginTop: 4,
  },

  /* ── Scenarios ── */
  scenarioRow: {
    flexDirection: "row",
    gap: 14,
    marginBottom: 14,
  },
  scenarioCard: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 6,
    padding: 14,
  },
  scenarioLabel: {
    fontFamily: FONTS.mono,
    fontSize: 9,
    letterSpacing: 2,
    textTransform: "uppercase",
    marginBottom: 8,
  },
  scenarioScores: {
    fontFamily: FONTS.body,
    fontSize: 9,
    color: COLORS.textSecondary,
    lineHeight: 1.5,
    marginBottom: 6,
  },
  scenarioCalc: {
    fontFamily: FONTS.mono,
    fontSize: 16,
    fontWeight: 700,
    marginBottom: 6,
  },
  scenarioZone: {
    fontFamily: FONTS.mono,
    fontSize: 8,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    marginBottom: 6,
  },
  scenarioDesc: {
    fontFamily: FONTS.body,
    fontSize: 9.5,
    color: COLORS.textSecondary,
    lineHeight: 1.5,
  },
  diffBox: {
    backgroundColor: COLORS.cardBg,
    padding: 12,
    borderRadius: 4,
    marginBottom: SPACING.paragraphGap,
  },
  diffText: {
    fontFamily: FONTS.body,
    fontSize: 10,
    fontWeight: 700,
    color: COLORS.textPrimary,
    textAlign: "center",
    lineHeight: 1.5,
  },

  /* ── R additive ── */
  rAdditiveCard: {
    borderWidth: 1,
    borderColor: COLORS.R,
    borderRadius: 6,
    padding: 18,
    marginBottom: SPACING.sectionGap,
  },
  rAdditiveCalc: {
    fontFamily: FONTS.mono,
    fontSize: 14,
    color: COLORS.textPrimary,
    marginBottom: 6,
  },
  rAdditiveRow: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 8,
  },
  rAdditiveItem: {
    flex: 1,
    padding: 8,
    borderRadius: 4,
  },
  rAdditiveLabel: {
    fontFamily: FONTS.body,
    fontSize: 9,
    fontWeight: 700,
    marginBottom: 2,
  },
  rAdditiveValue: {
    fontFamily: FONTS.body,
    fontSize: 9.5,
    color: COLORS.textSecondary,
    lineHeight: 1.5,
  },

  /* ── Transition ── */
  transitionBox: {
    alignItems: "center",
    marginTop: SPACING.sectionGap,
    paddingTop: SPACING.sectionGap,
    borderTopWidth: 0.5,
    borderTopColor: COLORS.borderLight,
  },
  transitionText: {
    fontFamily: FONTS.body,
    fontSize: 11,
    color: COLORS.textSecondary,
    textAlign: "center",
    lineHeight: 1.55,
    marginBottom: 4,
  },
  transitionCta: {
    fontFamily: FONTS.mono,
    fontSize: 10,
    color: COLORS.I,
    letterSpacing: 1,
    marginTop: 10,
  },
});

export function Ch02Equation() {
  return (
    <>
      {/* ═══════ PAGE 1 — Chapter opener (dark) ═══════ */}
      <Page size={PAGE_SIZE} style={s.openerPage}>
        <View>
          <Text style={s.chapterNum}>{CHAPTER}</Text>
          <Text style={s.chapterTitle}>{"Ecua\u021bia Universal\u0103"}</Text>
          <Text style={s.chapterSubtitle}>
            {"Codul Surs\u0103 al Profitului.\nEcua\u021bia Universal\u0103."}
          </Text>
          <View style={{ width: 40, height: 1, backgroundColor: COLORS.I, marginBottom: 16 }} />
          <Text style={s.chapterSub2}>
            {"De ce marketingul nu este un pariu, ci o structur\u0103 de calcul."}
          </Text>
        </View>
      </Page>

      {/* ═══════ PAGE 2 — Formula Hero ═══════ */}
      <PageShell chapterLabel={CHAPTER}>
        <View style={s.formulaHero}>
          <Text style={s.formulaLabel}>ECUA\u021aIA UNIVERSAL\u0102 R IF C</Text>
          <View style={s.formulaRow}>
            <Text style={[s.formulaLetter, { color: COLORS.C }]}>C</Text>
            <Text style={s.formulaOp}>=</Text>
            <Text style={[s.formulaLetter, { color: COLORS.R }]}>R</Text>
            <Text style={s.formulaOp}>+</Text>
            <Text style={s.formulaOp}>(</Text>
            <Text style={[s.formulaLetter, { color: COLORS.I }]}>I</Text>
            <Text style={s.formulaOp}>{"\u00d7"}</Text>
            <Text style={[s.formulaLetter, { color: COLORS.F }]}>F</Text>
            <Text style={s.formulaOp}>)</Text>
          </View>
          <Text style={s.formulaNote}>
            {"SCOR MAXIM: 110  |  Cele 10 puncte bonus apar la Relevan\u021b\u0103 absolut\u0103 (R=10) \u2014 Zona Brand Cult."}
          </Text>
        </View>
      </PageShell>

      {/* ═══════ PAGE 3 — I\u00d7F Illumination ═══════ */}
      <PageShell chapterLabel={CHAPTER}>
        <Text style={s.illuminationTitle}>{"De ce I \u00d7 F, nu I + F?"}</Text>

        <Text style={s.body}>
          {"\u00cen modelele vechi, designul era doar un cost. \u00cen R IF C, Forma (F) este un amplificator."}
        </Text>

        {/* Low scenario */}
        <View style={[s.calcCard, { borderColor: COLORS.R, backgroundColor: "#FEF2F2" }]}>
          <Text style={[s.calcLabel, { color: COLORS.R }]}>
            {"Interes de nota 10 livrat \u00eentr-o Form\u0103 de nota 2"}
          </Text>
          <Text style={[s.calcFormula, { color: COLORS.R }]}>{"10 \u00d7 2 = 20"}</Text>
          <Text style={s.calcResult}>{"Rezultat: 20 \u2014 mesaj genial, nimeni nu-l vede."}</Text>
        </View>

        {/* High scenario */}
        <View style={[s.calcCard, { borderColor: COLORS.C, backgroundColor: "#F0FDF4" }]}>
          <Text style={[s.calcLabel, { color: COLORS.C }]}>
            {"Acela\u0219i Interes livrat \u00eentr-o Form\u0103 de nota 9"}
          </Text>
          <Text style={[s.calcFormula, { color: COLORS.C }]}>{"10 \u00d7 9 = 90"}</Text>
          <Text style={s.calcResult}>{"Rezultat: 90 \u2014 acela\u0219i mesaj, explozie de impact."}</Text>
        </View>

        <View style={s.highlightBox}>
          <Text style={s.highlightText}>
            {"Forma nu adaug\u0103 valoare \u2014 ea o multiplic\u0103."}
          </Text>
        </View>

        <Text style={s.body}>
          {"De aceea un mesaj genial \u00eentr-un format gre\u0219it pierde 80% din impact."}
        </Text>
        <Text style={s.bodyBold}>
          {"Nu pentru c\u0103 mesajul e slab. Pentru c\u0103 Forma l-a sufocat."}
        </Text>
      </PageShell>

      {/* ═══════ PAGE 4 — Architectural Variables (R, I) ═══════ */}
      <PageShell chapterLabel={CHAPTER}>
        <Text style={s.h2}>{"Planul Arhitectural \u2014 4 Variabile"}</Text>

        {/* R */}
        <View style={[s.archCard, { borderColor: COLORS.R }]}>
          <View style={[s.archLetterBox, { backgroundColor: COLORS.R }]}>
            <Text style={s.archLetter}>R</Text>
          </View>
          <View style={s.archContent}>
            <Text style={s.archTitle}>{"RELEVAN\u021aA = Funda\u021bia (Solul)"}</Text>
            <Text style={s.archMetaphor}>
              {"Dac\u0103 solul e nisipos (audien\u021ba gre\u0219it\u0103), cl\u0103direa se scufund\u0103 indiferent c\u00e2t de frumoas\u0103 e. Relevan\u021ba \u00ee\u021bi d\u0103 permisiunea s\u0103 construie\u0219ti. F\u0103r\u0103 ea, orice construie\u0219ti se pr\u0103bu\u0219e\u0219te."}
            </Text>
            <Text style={s.archMetaphor}>
              {"R deschide poarta. F\u0103r\u0103 relevan\u021b\u0103, fiecare euro investit \u00een I \u0219i F e irosit."}
            </Text>
            <Text style={s.archThreshold}>{"R < 3? Solul e nisipos. Nu pune prima c\u0103r\u0103mid\u0103."}</Text>
          </View>
        </View>

        {/* I */}
        <View style={[s.archCard, { borderColor: COLORS.I }]}>
          <View style={[s.archLetterBox, { backgroundColor: COLORS.I }]}>
            <Text style={s.archLetter}>I</Text>
          </View>
          <View style={s.archContent}>
            <Text style={s.archTitle}>{"INTERESUL = Structura de Rezisten\u021b\u0103 (O\u021belul)"}</Text>
            <Text style={s.archMetaphor}>
              {"Substan\u021ba mesajului \u2014 ceea ce spui. O\u021belul care sus\u021bine totul. F\u0103r\u0103 o\u021bel, cl\u0103direa nu are ce s\u0103 sus\u021bin\u0103."}
            </Text>
            <Text style={s.archMetaphor}>
              {"O fa\u021bad\u0103 frumoas\u0103 f\u0103r\u0103 structur\u0103 = Zgomot Estetic. Premii de design, zero conversii."}
            </Text>
            <Text style={s.archThreshold}>{"I < 5? Cl\u0103direa nu are coloan\u0103 vertebral\u0103."}</Text>
          </View>
        </View>
      </PageShell>

      {/* ═══════ PAGE 5 — Architectural Variables (F, C) ═══════ */}
      <PageShell chapterLabel={CHAPTER}>
        {/* F */}
        <View style={[s.archCard, { borderColor: COLORS.F }]}>
          <View style={[s.archLetterBox, { backgroundColor: COLORS.F }]}>
            <Text style={s.archLetter}>F</Text>
          </View>
          <View style={s.archContent}>
            <Text style={s.archTitle}>{"FORMA = Arhitectura & Designul (Multiplicatorul)"}</Text>
            <Text style={s.archMetaphor}>
              {"Nu e vopseaua de pe pere\u021bi. E modul \u00een care arhitectura face spa\u021biul locuibil."}
            </Text>
            <Text style={s.archMetaphor}>
              {"Form\u0103 proast\u0103 (F=1): o\u021belul expus, rece \u2014 nimeni nu vrea s\u0103 intre. Form\u0103 genial\u0103 (F=10): valoarea explodeaz\u0103 \u2014 toat\u0103 lumea vrea s\u0103 se mute."}
            </Text>
            <Text style={[s.archThreshold, { color: COLORS.F }]}>
              {"F este Multiplicatorul. Transform\u0103 o\u021belul \u00een experien\u021b\u0103."}
            </Text>
          </View>
        </View>

        {/* C */}
        <View style={[s.archCard, { borderColor: COLORS.C }]}>
          <View style={[s.archLetterBox, { backgroundColor: COLORS.C }]}>
            <Text style={s.archLetter}>C</Text>
          </View>
          <View style={s.archContent}>
            <Text style={s.archTitle}>{"CLARITATEA = Valoarea de Pia\u021b\u0103"}</Text>
            <Text style={s.archMetaphor}>
              {"Rezultatul. Singurul motiv pentru care un client \u201ese mut\u0103\u201d (cump\u0103r\u0103): totul e clar, sigur \u0219i solid."}
            </Text>
            <Text style={s.archMetaphor}>
              {"Funda\u021bie stabil\u0103 + Structur\u0103 solid\u0103 \u00d7 Design inspirat = Proprietate \u00een care clien\u021bii vor s\u0103 locuiasc\u0103."}
            </Text>
            <Text style={[s.archThreshold, { color: COLORS.C }]}>
              {"C \u2265 80: Proprietate premium. C < 30: Cl\u0103dire abandonat\u0103."}
            </Text>
          </View>
        </View>
      </PageShell>

      {/* ═══════ PAGE 6 — Gateway Blueprint (simplified) ═══════ */}
      <PageShell chapterLabel={CHAPTER}>
        <Text style={s.h2}>{"Planul Gateway \u2014 Vedere de Sus"}</Text>
        <Text style={s.body}>
          {"Mesajul intr\u0103 pe poart\u0103 \u2192 trece verificarea relevan\u021bei \u2192 amplificat \u00een camera I\u00d7F \u2192 iese ca \u0219i claritate."}
        </Text>

        {/* Simplified architectural diagram using boxes */}
        <View style={{ flexDirection: "row", gap: 6, marginBottom: SPACING.sectionGap, alignItems: "center" }}>
          {/* Entry */}
          <View style={{ flex: 1, backgroundColor: "#F3F4F6", borderRadius: 4, padding: 10, alignItems: "center" }}>
            <Text style={{ fontFamily: FONTS.mono, fontSize: 7, color: COLORS.textMuted, letterSpacing: 1, marginBottom: 4 }}>INTRARE</Text>
            <Text style={{ fontFamily: FONTS.body, fontSize: 8, color: COLORS.textSecondary, textAlign: "center" }}>Mesajul</Text>
          </View>
          {/* Arrow */}
          <Text style={{ fontFamily: FONTS.mono, fontSize: 12, color: COLORS.textMuted }}>{"\u2192"}</Text>
          {/* Gate */}
          <View style={{ flex: 1.2, backgroundColor: "#FEF2F2", borderWidth: 1, borderColor: COLORS.R, borderRadius: 4, padding: 10, alignItems: "center" }}>
            <Text style={{ fontFamily: FONTS.mono, fontSize: 7, color: COLORS.R, letterSpacing: 1, marginBottom: 4 }}>POARTA</Text>
            <Text style={{ fontFamily: FONTS.body, fontSize: 8, color: COLORS.textSecondary, textAlign: "center" }}>{"R \u2265 3?"}</Text>
          </View>
          {/* Arrow */}
          <Text style={{ fontFamily: FONTS.mono, fontSize: 12, color: COLORS.textMuted }}>{"\u2192"}</Text>
          {/* Chamber */}
          <View style={{ flex: 1.5, backgroundColor: "#EFF6FF", borderWidth: 1, borderColor: COLORS.I, borderRadius: 4, padding: 10, alignItems: "center" }}>
            <Text style={{ fontFamily: FONTS.mono, fontSize: 7, color: COLORS.I, letterSpacing: 1, marginBottom: 4 }}>AMPLIFICARE</Text>
            <Text style={{ fontFamily: FONTS.body, fontSize: 8, color: COLORS.textSecondary, textAlign: "center" }}>{"I \u00d7 F"}</Text>
          </View>
          {/* Arrow */}
          <Text style={{ fontFamily: FONTS.mono, fontSize: 12, color: COLORS.textMuted }}>{"\u2192"}</Text>
          {/* Output */}
          <View style={{ flex: 1.2, backgroundColor: "#F0FDF4", borderWidth: 1, borderColor: COLORS.C, borderRadius: 4, padding: 10, alignItems: "center" }}>
            <Text style={{ fontFamily: FONTS.mono, fontSize: 7, color: COLORS.C, letterSpacing: 1, marginBottom: 4 }}>CLARITATE</Text>
            <Text style={{ fontFamily: FONTS.body, fontSize: 8, color: COLORS.textSecondary, textAlign: "center" }}>C: 0\u2014110</Text>
          </View>
        </View>

        {/* Formula recap */}
        <View style={{ backgroundColor: COLORS.cardBg, padding: 14, borderRadius: 4, alignItems: "center", marginBottom: SPACING.sectionGap }}>
          <Text style={{ fontFamily: FONTS.mono, fontSize: 14, fontWeight: 700, color: COLORS.textPrimary }}>
            {"R + (I \u00d7 F) = C"}
          </Text>
        </View>

        {/* Zone labels */}
        <View style={{ flexDirection: "row", gap: 10 }}>
          <View style={{ flex: 1, backgroundColor: "#FEF2F2", borderRadius: 4, padding: 8, alignItems: "center" }}>
            <Text style={{ fontFamily: FONTS.mono, fontSize: 8, color: COLORS.R, letterSpacing: 1 }}>ZONA R</Text>
            <Text style={{ fontFamily: FONTS.body, fontSize: 8, color: COLORS.textSecondary, marginTop: 2 }}>{"Funda\u021bie + Poart\u0103"}</Text>
          </View>
          <View style={{ flex: 1, backgroundColor: "#EFF6FF", borderRadius: 4, padding: 8, alignItems: "center" }}>
            <Text style={{ fontFamily: FONTS.mono, fontSize: 8, color: COLORS.I, letterSpacing: 1 }}>{"ZONA I \u00d7 F"}</Text>
            <Text style={{ fontFamily: FONTS.body, fontSize: 8, color: COLORS.textSecondary, marginTop: 2 }}>Camera de Amplificare</Text>
          </View>
          <View style={{ flex: 1, backgroundColor: "#F0FDF4", borderRadius: 4, padding: 8, alignItems: "center" }}>
            <Text style={{ fontFamily: FONTS.mono, fontSize: 8, color: COLORS.C, letterSpacing: 1 }}>ZONA C</Text>
            <Text style={{ fontFamily: FONTS.body, fontSize: 8, color: COLORS.textSecondary, marginTop: 2 }}>{"Ie\u0219ire Claritate"}</Text>
          </View>
        </View>
      </PageShell>

      {/* ═══════ PAGE 7 — R Additive explanation ═══════ */}
      <PageShell chapterLabel={CHAPTER}>
        <Text style={s.h2}>{"De ce R e ADITIV \u0219i nu multiplicativ?"}</Text>

        <Text style={s.body}>
          {"R e permisiunea de a construi \u2014 solul pe care st\u0103 funda\u021bia. Nu amplific\u0103 mesajul. \u00cel valideaz\u0103."}
        </Text>

        <View style={s.rAdditiveCard}>
          <Text style={s.rAdditiveCalc}>{"R = 0: C = 0 + (10 \u00d7 10) = 100"}</Text>

          <View style={s.rAdditiveRow}>
            <View style={[s.rAdditiveItem, { backgroundColor: "#F0FDF4" }]}>
              <Text style={[s.rAdditiveLabel, { color: COLORS.C }]}>{"Pe h\u00e2rtie:"}</Text>
              <Text style={s.rAdditiveValue}>Suprem.</Text>
            </View>
            <View style={[s.rAdditiveItem, { backgroundColor: "#FEF2F2" }]}>
              <Text style={[s.rAdditiveLabel, { color: COLORS.R }]}>{"\u00cen realitate:"}</Text>
              <Text style={s.rAdditiveValue}>{"mesaj perfect livrat nim\u0103nui."}</Text>
            </View>
          </View>

          <Text style={[s.bodyBold, { color: COLORS.R, marginTop: 6 }]}>
            {"De aceea R are Poarta Relevan\u021bei: R < 3 = STOP."}
          </Text>
          <Text style={{ fontFamily: FONTS.body, fontSize: 9.5, color: COLORS.I, marginTop: 6 }}>
            {"Detalii \u00een Capitolul 05: Poarta Relevan\u021bei"}
          </Text>
        </View>
      </PageShell>

      {/* ═══════ PAGE 8 — Two contrasting scenarios ═══════ */}
      <PageShell chapterLabel={CHAPTER}>
        <Text style={s.h2}>{"ACEEA\u0218I CAMPANIE. DOU\u0102 FORME. REZULTATE OPUSE."}</Text>

        <View style={s.scenarioRow}>
          {/* Scenario 1 — Buried Diamond */}
          <View style={[s.scenarioCard, { borderColor: COLORS.R, backgroundColor: "#FEF2F2" }]}>
            <Text style={[s.scenarioLabel, { color: COLORS.R }]}>{"Diamantul \u00cengropat"}</Text>
            <Text style={s.scenarioScores}>{"R = 8, I = 9, F = 2\n(PDF static pe Instagram)"}</Text>
            <Text style={[s.scenarioCalc, { color: COLORS.R }]}>{"C = 8 + (9 \u00d7 2) = 26"}</Text>
            <Text style={[s.scenarioZone, { color: COLORS.R }]}>ZGOMOT DE FOND</Text>
            <Text style={s.scenarioDesc}>{"Mesaj genial. Nimeni nu-l vede."}</Text>
          </View>

          {/* Scenario 2 — Supreme Clarity */}
          <View style={[s.scenarioCard, { borderColor: COLORS.C, backgroundColor: "#F0FDF4" }]}>
            <Text style={[s.scenarioLabel, { color: COLORS.C }]}>{"Claritate Suprem\u0103"}</Text>
            <Text style={s.scenarioScores}>{"R = 8, I = 9, F = 9\n(Reel optimizat, hook 2 sec, CTA clar)"}</Text>
            <Text style={[s.scenarioCalc, { color: COLORS.C }]}>{"C = 8 + (9 \u00d7 9) = 89"}</Text>
            <Text style={[s.scenarioZone, { color: COLORS.C }]}>{"CLARITATE SUPREM\u0102"}</Text>
            <Text style={s.scenarioDesc}>{"Acela\u0219i mesaj. Format corect. Impact 3.4\u00d7 mai mare."}</Text>
          </View>
        </View>

        <View style={s.diffBox}>
          <Text style={s.diffText}>
            {"Diferen\u021ba: DOAR F. De la 2 la 9. C de la 26 la 89. (+242%)"}
          </Text>
          <Text style={[s.diffText, { marginTop: 4 }]}>
            {"Forma nu e op\u021bional\u0103 \u2014 e multiplicatorul profitului."}
          </Text>
        </View>
      </PageShell>

      {/* ═══════ PAGE 9 — Transition ═══════ */}
      <PageShell chapterLabel={CHAPTER}>
        <View style={s.transitionBox}>
          <Text style={s.transitionText}>
            {"Cl\u0103direa ta de marketing este solid\u0103"}
          </Text>
          <Text style={s.transitionText}>
            {"sau se pr\u0103bu\u0219e\u0219te la primul v\u00e2nt de criz\u0103?"}
          </Text>
          <Text style={[s.transitionText, { marginTop: 6 }]}>
            {"Hai s\u0103 deconstruim fiecare pies\u0103."}
          </Text>
          <Text style={s.transitionCta}>
            {"Capitolul 03: Anatomia Variabilelor \u2192"}
          </Text>
        </View>
      </PageShell>
    </>
  );
}

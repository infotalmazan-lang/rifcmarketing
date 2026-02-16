/* ─── Chapter 05 — Poarta Relevan\u021bei (Filtrul de Siguran\u021b\u0103) ─── */

import React from "react";
import { Page, View, Text, StyleSheet } from "@react-pdf/renderer";
import { COLORS, FONTS, SPACING, PAGE_SIZE } from "../theme";
import { PageShell } from "../components/PageShell";

const CHAPTER = "Regul\u0103 Critic\u0103";

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
    color: COLORS.R,
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
  chapterSubLabel: {
    fontFamily: FONTS.mono,
    fontSize: 9,
    letterSpacing: 3,
    color: COLORS.R,
    textTransform: "uppercase",
    marginBottom: 14,
  },
  chapterDesc: {
    fontFamily: FONTS.body,
    fontSize: 10.5,
    color: COLORS.textOnDarkMuted,
    lineHeight: 1.65,
  },

  /* ── Common content styles ── */
  h2: {
    fontFamily: FONTS.heading,
    fontSize: 20,
    fontWeight: 700,
    color: COLORS.textPrimary,
    marginBottom: 14,
    lineHeight: 1.3,
  },
  h3: {
    fontFamily: FONTS.heading,
    fontSize: 15,
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

  /* ── Binary rule hero ── */
  binaryHero: {
    backgroundColor: COLORS.darkBg,
    padding: 24,
    borderRadius: 6,
    alignItems: "center",
    marginBottom: SPACING.sectionGap,
  },
  binaryRule: {
    fontFamily: FONTS.mono,
    fontSize: 18,
    fontWeight: 700,
    color: COLORS.R,
    textAlign: "center",
    marginBottom: 14,
  },
  binaryBullet: {
    fontFamily: FONTS.body,
    fontSize: 10,
    color: COLORS.textOnDarkSecondary,
    lineHeight: 1.6,
    marginBottom: 3,
  },

  /* ── Intro anaphora ── */
  anaphoraLine: {
    fontFamily: FONTS.heading,
    fontSize: 14,
    fontWeight: 300,
    color: COLORS.textPrimary,
    lineHeight: 1.6,
    marginBottom: 4,
  },
  anaphoraBreak: {
    fontFamily: FONTS.heading,
    fontSize: 14,
    fontWeight: 700,
    color: COLORS.R,
    lineHeight: 1.6,
    marginTop: 10,
    marginBottom: SPACING.sectionGap,
  },

  /* ── Protocol box ── */
  protocolBox: {
    backgroundColor: COLORS.cardBg,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    padding: 16,
    borderRadius: 6,
    marginBottom: SPACING.sectionGap,
  },
  protocolText: {
    fontFamily: FONTS.body,
    fontSize: 10,
    color: COLORS.textSecondary,
    lineHeight: 1.6,
  },

  /* ── Disaster simulation ── */
  disasterCard: {
    borderWidth: 1,
    borderColor: COLORS.R,
    borderRadius: 6,
    padding: 16,
    marginBottom: 14,
    backgroundColor: "#FEF2F2",
  },
  disasterScenario: {
    fontFamily: FONTS.body,
    fontSize: 10,
    fontWeight: 700,
    color: COLORS.textPrimary,
    lineHeight: 1.5,
    marginBottom: 8,
  },
  disasterRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 8,
  },
  disasterOnPaper: {
    flex: 1,
    backgroundColor: "#F0FDF4",
    padding: 8,
    borderRadius: 4,
  },
  disasterReality: {
    flex: 1,
    backgroundColor: "#FEF2F2",
    padding: 8,
    borderRadius: 4,
  },
  disasterLabel: {
    fontFamily: FONTS.mono,
    fontSize: 7,
    letterSpacing: 1,
    textTransform: "uppercase",
    marginBottom: 4,
  },
  disasterValue: {
    fontFamily: FONTS.body,
    fontSize: 9.5,
    lineHeight: 1.4,
  },
  disasterVerdict: {
    fontFamily: FONTS.body,
    fontSize: 10,
    fontWeight: 700,
    color: COLORS.R,
    lineHeight: 1.5,
    marginTop: 4,
  },

  /* ── Analogies ── */
  analogyCard: {
    flexDirection: "row",
    gap: 10,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    borderRadius: 6,
    padding: 12,
    marginBottom: 10,
  },
  analogyIcon: {
    width: 32,
    justifyContent: "center",
    alignItems: "center",
  },
  analogyIconText: {
    fontFamily: FONTS.mono,
    fontSize: 7,
    color: COLORS.textMuted,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  analogyText: {
    flex: 1,
    fontFamily: FONTS.body,
    fontSize: 9.5,
    color: COLORS.textSecondary,
    lineHeight: 1.55,
  },

  /* ── Consequences ── */
  consequenceItem: {
    flexDirection: "row",
    paddingVertical: 5,
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.borderLight,
  },
  consequenceBullet: {
    width: 16,
    fontFamily: FONTS.mono,
    fontSize: 10,
    color: COLORS.R,
  },
  consequenceText: {
    flex: 1,
    fontFamily: FONTS.body,
    fontSize: 9.5,
    color: COLORS.textSecondary,
    lineHeight: 1.5,
  },

  /* ── Math thresholds ── */
  mathRow: {
    flexDirection: "row",
    paddingVertical: 6,
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.borderLight,
    alignItems: "center",
  },
  mathR: {
    width: 30,
    fontFamily: FONTS.mono,
    fontSize: 12,
    fontWeight: 700,
    textAlign: "center",
  },
  mathEq: {
    width: 120,
    fontFamily: FONTS.mono,
    fontSize: 9,
    color: COLORS.textPrimary,
  },
  mathNote: {
    flex: 1,
    fontFamily: FONTS.body,
    fontSize: 9,
    color: COLORS.textSecondary,
    lineHeight: 1.4,
  },

  /* ── Protocol questions ── */
  questionCard: {
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    borderRadius: 6,
    padding: 14,
    marginBottom: 12,
  },
  questionNum: {
    fontFamily: FONTS.mono,
    fontSize: 16,
    color: COLORS.R,
    marginBottom: 4,
  },
  questionCategory: {
    fontFamily: FONTS.mono,
    fontSize: 8,
    letterSpacing: 2,
    color: COLORS.textMuted,
    textTransform: "uppercase",
    marginBottom: 6,
  },
  questionText: {
    fontFamily: FONTS.body,
    fontSize: 10.5,
    fontWeight: 700,
    color: COLORS.textPrimary,
    lineHeight: 1.45,
    marginBottom: 8,
  },
  answerRow: {
    flexDirection: "row",
    gap: 6,
    flexWrap: "wrap",
  },
  answerTag: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    marginBottom: 4,
  },
  answerText: {
    fontFamily: FONTS.body,
    fontSize: 8.5,
    lineHeight: 1.3,
  },

  /* ── Ghost link ── */
  ghostCard: {
    backgroundColor: COLORS.darkBg,
    padding: 16,
    borderRadius: 6,
    marginBottom: SPACING.sectionGap,
  },
  ghostTitle: {
    fontFamily: FONTS.heading,
    fontSize: 14,
    fontWeight: 700,
    color: COLORS.textOnDark,
    marginBottom: 6,
  },
  ghostBody: {
    fontFamily: FONTS.body,
    fontSize: 10,
    color: COLORS.textOnDarkSecondary,
    lineHeight: 1.55,
    marginBottom: 6,
  },
  ghostLink: {
    fontFamily: FONTS.mono,
    fontSize: 9,
    color: COLORS.I,
    letterSpacing: 0.5,
  },

  /* ── Risk framing ── */
  riskBox: {
    backgroundColor: COLORS.cardBg,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.F,
    padding: 14,
    borderRadius: 4,
    marginBottom: SPACING.sectionGap,
  },
  riskText: {
    fontFamily: FONTS.body,
    fontSize: 10,
    color: COLORS.textSecondary,
    lineHeight: 1.6,
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

export function Ch05RelevanceGate() {
  return (
    <>
      {/* ═══════ PAGE 1 — Chapter opener (dark) ═══════ */}
      <Page size={PAGE_SIZE} style={s.openerPage}>
        <View>
          <Text style={s.chapterNum}>{CHAPTER}</Text>
          <Text style={s.chapterSubLabel}>FILTRUL DE SIGURAN\u021a\u0102</Text>
          <Text style={s.chapterTitle}>{"Poarta Relevan\u021bei"}</Text>
          <View style={{ width: 40, height: 1, backgroundColor: COLORS.R, marginBottom: 16 }} />
          <Text style={s.chapterDesc}>
            {"De ce investi\u021bia ta se opre\u0219te aici dac\u0103 nu ai permisiunea de a fi ascultat."}
          </Text>
        </View>
      </Page>

      {/* ═══════ PAGE 2 — Intro anaphora + protocol ═══════ */}
      <PageShell chapterLabel={CHAPTER}>
        <Text style={s.anaphoraLine}>{"Po\u021bi avea cel mai frumos mesaj din lume."}</Text>
        <Text style={s.anaphoraLine}>{"Po\u021bi avea cel mai mare buget din industrie."}</Text>
        <Text style={s.anaphoraLine}>{"Po\u021bi avea echipa perfect\u0103, agen\u021bia perfect\u0103, momentul perfect."}</Text>
        <Text style={s.anaphoraBreak}>
          {"Nimic din asta nu conteaz\u0103 dac\u0103 vorbe\u0219ti cu oamenii gre\u0219i\u021bi."}
        </Text>

        <View style={s.protocolBox}>
          <Text style={s.protocolText}>
            {"R IF C nu este o medie aritmetic\u0103 \u2014 este un protocol secven\u021bial. Relevan\u021ba (R) este \u00eentrerup\u0103torul de circuit. Dac\u0103 mesajul t\u0103u nu trece testul relevan\u021bei, sistemul se \u00eenchide automat pentru a preveni risipa. Nicio execu\u021bie creativ\u0103 (F) \u0219i nicio ofert\u0103 imbatabil\u0103 (I) nu pot repara un mesaj trimis cui nu trebuie, c\u00e2nd nu trebuie."}
          </Text>
        </View>
      </PageShell>

      {/* ═══════ PAGE 3 — Binary rule + toggle ═══════ */}
      <PageShell chapterLabel={CHAPTER}>
        <View style={s.binaryHero}>
          <Text style={s.binaryRule}>
            {"IF  R < 3  \u2192  E\u0218EC CRITIC AUTOMAT"}
          </Text>
          <Text style={s.binaryBullet}>{"\u2022 Poarta se \u00eenchide"}</Text>
          <Text style={s.binaryBullet}>{"\u2022 Bugetul este blocat"}</Text>
          <Text style={s.binaryBullet}>{"\u2022 Comunicarea devine \u201ezgomot\u201d"}</Text>
          <Text style={s.binaryBullet}>{"\u2022 Orice I \u00d7 F este multiplicat cu ZERO \u00een percep\u021bia clientului"}</Text>
        </View>

        {/* Toggle visualization */}
        <View style={{ flexDirection: "row", gap: 14, marginBottom: SPACING.sectionGap }}>
          <View style={{ flex: 1, backgroundColor: "#F0FDF4", borderWidth: 1, borderColor: COLORS.C, borderRadius: 6, padding: 14, alignItems: "center" }}>
            <Text style={{ fontFamily: FONTS.mono, fontSize: 12, fontWeight: 700, color: COLORS.C, marginBottom: 4 }}>{"R \u2265 3"}</Text>
            <Text style={{ fontFamily: FONTS.body, fontSize: 9, color: COLORS.textSecondary, textAlign: "center" }}>
              {"Poarta DESCHIS\u0102\nEcua\u021bia func\u021bioneaz\u0103"}
            </Text>
          </View>
          <View style={{ flex: 1, backgroundColor: "#FEF2F2", borderWidth: 1, borderColor: COLORS.R, borderRadius: 6, padding: 14, alignItems: "center" }}>
            <Text style={{ fontFamily: FONTS.mono, fontSize: 12, fontWeight: 700, color: COLORS.R, marginBottom: 4 }}>{"R < 3"}</Text>
            <Text style={{ fontFamily: FONTS.body, fontSize: 9, color: COLORS.textSecondary, textAlign: "center" }}>
              {"Poarta \u00ceNCHIS\u0102\nE\u0219ec Critic Automat"}
            </Text>
          </View>
        </View>
      </PageShell>

      {/* ═══════ PAGE 4 — Disaster simulation ═══════ */}
      <PageShell chapterLabel={CHAPTER}>
        <Text style={s.h2}>SIMULAREA DEZASTRULUI</Text>

        {/* Disaster 1 */}
        <View style={s.disasterCard}>
          <Text style={s.disasterScenario}>
            {"Campanie: Video cinematic (F=9) + Ofert\u0103 unic\u0103 (I=8). Dar targetare gre\u0219it\u0103 (R=2)."}
          </Text>
          <View style={s.disasterRow}>
            <View style={s.disasterOnPaper}>
              <Text style={[s.disasterLabel, { color: COLORS.C }]}>{"PE H\u00ceRTIE"}</Text>
              <Text style={s.disasterValue}>{"74/110 \u2014 CLARITATE MEDIE"}</Text>
            </View>
            <View style={s.disasterReality}>
              <Text style={[s.disasterLabel, { color: COLORS.R }]}>REALITATE</Text>
              <Text style={s.disasterValue}>{"R = 2 \u2192 POARTA ACTIVAT\u0102"}</Text>
            </View>
          </View>
          <Text style={s.disasterVerdict}>
            {"\u00cen realitate: 0 \u2014 E\u0218EC CRITIC. BUGET ARS. Ai pl\u0103tit pentru \u201eart\u0103\u201d pe care nimeni nu o dore\u0219te."}
          </Text>
        </View>

        {/* Disaster 2 */}
        <View style={s.disasterCard}>
          <Text style={s.disasterScenario}>
            {"\u0218i mai dramatic: R=2, I=10, F=10"}
          </Text>
          <View style={s.disasterRow}>
            <View style={s.disasterOnPaper}>
              <Text style={[s.disasterLabel, { color: COLORS.C }]}>{"PE H\u00ceRTIE"}</Text>
              <Text style={s.disasterValue}>{"Claritate Suprem\u0103 (102/110)."}</Text>
            </View>
            <View style={s.disasterReality}>
              <Text style={[s.disasterLabel, { color: COLORS.R }]}>REALITATE</Text>
              <Text style={s.disasterValue}>{"Zero conversii. Zero ROI."}</Text>
            </View>
          </View>
          <Text style={s.disasterVerdict}>
            {"Scorul 102 e cea mai scump\u0103 iluzie din marketing."}
          </Text>
        </View>
      </PageShell>

      {/* ═══════ PAGE 5 — Analogies ═══════ */}
      <PageShell chapterLabel={CHAPTER}>
        <Text style={s.h2}>{"Ce \u00eenseamn\u0103 R < 3 \u00een lumea real\u0103:"}</Text>

        <View style={s.analogyCard}>
          <View style={s.analogyIcon}>
            <Text style={s.analogyIconText}>HOTEL</Text>
          </View>
          <Text style={s.analogyText}>
            {"Hotel 5 stele pe o insul\u0103 f\u0103r\u0103 aeroport. Camerele sunt perfecte. Nu ajunge nimeni."}
          </Text>
        </View>

        <View style={s.analogyCard}>
          <View style={s.analogyIcon}>
            <Text style={s.analogyIconText}>DISCURS</Text>
          </View>
          <Text style={s.analogyText}>
            {"Discurs despre veganism la o conven\u021bie de v\u00e2n\u0103toare. Mesajul e corect. Audien\u021ba e gre\u0219it\u0103."}
          </Text>
        </View>

        <View style={s.analogyCard}>
          <View style={s.analogyIcon}>
            <Text style={s.analogyIconText}>LEAC</Text>
          </View>
          <Text style={s.analogyText}>
            {"Leac pentru migrene promovat la o clinic\u0103 de ortopedie. Produsul func\u021bioneaz\u0103. Pacien\u021bii nu au nevoie."}
          </Text>
        </View>

        <View style={{ backgroundColor: COLORS.darkBg, padding: 12, borderRadius: 4, alignItems: "center", marginTop: 10 }}>
          <Text style={{ fontFamily: FONTS.body, fontSize: 10, fontWeight: 700, color: COLORS.textOnDark, textAlign: "center" }}>
            {"Toate au I = 10 \u0219i F = 10. Toate au R = 0. Toate sunt e\u0219ecuri."}
          </Text>
        </View>
      </PageShell>

      {/* ═══════ PAGE 6 — Consequences + Math thresholds ═══════ */}
      <PageShell chapterLabel={CHAPTER}>
        <Text style={s.h2}>{"Ce se \u00eent\u00e2mpl\u0103 c\u00e2nd Poarta se \u00eenchide:"}</Text>

        {[
          "CTR sub 0.1% \u2014 mesajul e filtrat de \u201escutul anti-reclam\u0103\u201d al creierului",
          "CPL infinit \u2014 buget consumat pe click-uri f\u0103r\u0103 inten\u021bie de cump\u0103rare",
          "Bounce rate 85%+ \u2014 vizitatorii realizeaz\u0103 instant \u201enu e pentru mine\u201d",
          "ROAS sub 0.5x \u2014 fiecare euro investit produce sub 50 de cen\u021bi",
          "Echipa crede c\u0103 problema e la creative. De fapt e la targeting.",
        ].map((c, i) => (
          <View key={i} style={s.consequenceItem}>
            <Text style={s.consequenceBullet}>{"\u2022"}</Text>
            <Text style={s.consequenceText}>{c}</Text>
          </View>
        ))}

        {/* Math thresholds */}
        <Text style={[s.h3, { marginTop: SPACING.sectionGap }]}>{"Praguri matematice:"}</Text>

        <View style={s.mathRow}>
          <Text style={[s.mathR, { color: COLORS.R }]}>R=1</Text>
          <Text style={s.mathEq}>{"1 + (10 \u00d7 10) = 101"}</Text>
          <Text style={s.mathNote}>{"Pe h\u00e2rtie: Suprem. Realitate: 90% audien\u021b\u0103 gre\u0219it\u0103."}</Text>
        </View>
        <View style={s.mathRow}>
          <Text style={[s.mathR, { color: COLORS.R }]}>R=2</Text>
          <Text style={s.mathEq}>{"2 + (10 \u00d7 10) = 102"}</Text>
          <Text style={s.mathNote}>{"Pe h\u00e2rtie: Suprem. Realitate: 80% audien\u021b\u0103 gre\u0219it\u0103."}</Text>
        </View>
        <View style={s.mathRow}>
          <Text style={[s.mathR, { color: COLORS.C }]}>R=3</Text>
          <Text style={s.mathEq}>{"3 + (10 \u00d7 10) = 103"}</Text>
          <Text style={s.mathNote}>{"PRAG MINIM \u2014 Poarta se deschide."}</Text>
        </View>

        <View style={{ backgroundColor: COLORS.darkBg, padding: 12, borderRadius: 4, alignItems: "center", marginTop: 12 }}>
          <Text style={{ fontFamily: FONTS.body, fontSize: 10, fontWeight: 700, color: COLORS.textOnDark }}>
            {"Sub R = 3, scorul e o fic\u021biune. Conversiile sunt zero."}
          </Text>
        </View>
      </PageShell>

      {/* ═══════ PAGE 7 — Pre-launch protocol ═══════ */}
      <PageShell chapterLabel={CHAPTER}>
        <Text style={s.h2}>{"PROTOCOL PRE-LANSARE: 3 \u00centreb\u0103ri Obligatorii"}</Text>

        {/* Question 1 */}
        <View style={s.questionCard}>
          <Text style={s.questionNum}>{"\u2776"}</Text>
          <Text style={s.questionCategory}>AUDIEN\u021aA</Text>
          <Text style={s.questionText}>
            {"\u201ePo\u021bi descrie clientul ideal \u00een 3 propozi\u021bii f\u0103r\u0103 \u2018toat\u0103 lumea\u2019 sau \u2018oricine\u2019?\u201d"}
          </Text>
          <View style={s.answerRow}>
            <View style={[s.answerTag, { backgroundColor: "#F0FDF4" }]}>
              <Text style={[s.answerText, { color: COLORS.C }]}>{"Da \u2192 Continu\u0103"}</Text>
            </View>
            <View style={[s.answerTag, { backgroundColor: "#FEF2F2" }]}>
              <Text style={[s.answerText, { color: COLORS.R }]}>{"Nu \u2192 STOP. R < 3. Nu lansa."}</Text>
            </View>
          </View>
        </View>

        {/* Question 2 */}
        <View style={s.questionCard}>
          <Text style={s.questionNum}>{"\u2777"}</Text>
          <Text style={s.questionCategory}>VALIDAREA</Text>
          <Text style={s.questionText}>
            {"\u201eDin ultimele 100 de click-uri, c\u00e2te au venit de la persoane care chiar pot cump\u0103ra?\u201d"}
          </Text>
          <View style={s.answerRow}>
            <View style={[s.answerTag, { backgroundColor: "#F0FDF4" }]}>
              <Text style={[s.answerText, { color: COLORS.C }]}>{"Peste 50% \u2192 Continu\u0103"}</Text>
            </View>
            <View style={[s.answerTag, { backgroundColor: "#FFFBEB" }]}>
              <Text style={[s.answerText, { color: COLORS.F }]}>{"Sub 50% \u2192 Revizuie\u0219te targetarea"}</Text>
            </View>
            <View style={[s.answerTag, { backgroundColor: "#FEF2F2" }]}>
              <Text style={[s.answerText, { color: COLORS.R }]}>{"Nu am verificat \u2192 STOP. Verific\u0103 \u00eent\u00e2i."}</Text>
            </View>
          </View>
        </View>

        {/* Question 3 */}
        <View style={s.questionCard}>
          <Text style={s.questionNum}>{"\u2778"}</Text>
          <Text style={s.questionCategory}>TESTUL DE 5 SECUNDE</Text>
          <Text style={s.questionText}>
            {"\u201eUn reprezentant al audien\u021bei spune \u2018Asta e exact ce c\u0103utam\u2019 \u00een 5 secunde?\u201d"}
          </Text>
          <View style={s.answerRow}>
            <View style={[s.answerTag, { backgroundColor: "#F0FDF4" }]}>
              <Text style={[s.answerText, { color: COLORS.C }]}>{"Da, sigur \u2192 Poarta e deschis\u0103. Lanseaz\u0103."}</Text>
            </View>
            <View style={[s.answerTag, { backgroundColor: "#FFFBEB" }]}>
              <Text style={[s.answerText, { color: COLORS.F }]}>{"Poate \u2192 Testeaz\u0103 cu un grup mai mare"}</Text>
            </View>
            <View style={[s.answerTag, { backgroundColor: "#FEF2F2" }]}>
              <Text style={[s.answerText, { color: COLORS.R }]}>{"Probabil nu \u2192 STOP. R < 3. Ref\u0103 mesajul."}</Text>
            </View>
          </View>
        </View>

        <View style={{ backgroundColor: COLORS.darkBg, padding: 12, borderRadius: 4, alignItems: "center", marginTop: 6 }}>
          <Text style={{ fontFamily: FONTS.body, fontSize: 10, fontWeight: 700, color: COLORS.R, textAlign: "center" }}>
            {"La ORICARE \u00eentrebare \u2192 Poarta \u00ceNCHIS\u0102. Nu investi \u00een I \u0219i F p\u00e2n\u0103 nu rezolvi R."}
          </Text>
        </View>
      </PageShell>

      {/* ═══════ PAGE 8 — Ghost archetype link + Risk framing ═══════ */}
      <PageShell chapterLabel={CHAPTER}>
        <View style={s.ghostCard}>
          <Text style={s.ghostTitle}>{"Dac\u0103 Poarta e \u00eenchis\u0103, e\u0219ti Fantoma Invizibil\u0103."}</Text>
          <Text style={s.ghostBody}>
            {"R < 3 activeaz\u0103 automat Arhetipul #1: strigi \u00eentr-o camer\u0103 goal\u0103."}
          </Text>
          <Text style={s.ghostLink}>
            {"Cite\u0219te diagnosticul complet \u00een Capitolul 06: Arhetipuri de E\u0219ec"}
          </Text>
        </View>

        <View style={s.riskBox}>
          <Text style={s.riskText}>
            {"Poarta Relevan\u021bei nu e o restric\u021bie \u2014 e un mecanism de protec\u021bie. Pozi\u021bioneaz\u0103 R IF C nu doar ca metod\u0103 de marketing, ci ca instrument de management al riscului. \u00centrerup\u0103torul care \u00ee\u021bi salveaz\u0103 bugetul \u00eenainte s\u0103 fie ars pe Zgomot Estetic."}
          </Text>
        </View>

        <View style={{ backgroundColor: COLORS.cardBg, borderWidth: 1, borderColor: COLORS.borderLight, padding: 14, borderRadius: 6, alignItems: "center" }}>
          <Text style={{ fontFamily: FONTS.heading, fontSize: 12, fontStyle: "italic", color: COLORS.textPrimary, textAlign: "center", lineHeight: 1.5 }}>
            {"\u201ePoarta Relevan\u021bei anuleaz\u0103 creativitatea. Nu trece mai departe p\u00e2n\u0103 nu e\u0219ti sigur de R.\u201d"}
          </Text>
        </View>
      </PageShell>

      {/* ═══════ PAGE 9 — CTA + Transition ═══════ */}
      <PageShell chapterLabel={CHAPTER}>
        <View style={{ backgroundColor: COLORS.cardBg, padding: 18, borderRadius: 6, alignItems: "center", marginBottom: SPACING.sectionGap }}>
          <Text style={{ fontFamily: FONTS.body, fontSize: 11, color: COLORS.textSecondary, textAlign: "center", lineHeight: 1.55, marginBottom: 14 }}>
            {"Poarta Relevan\u021bei este checkpoint-ul zero. Dac\u0103 trece, ecua\u021bia func\u021bioneaz\u0103. Dac\u0103 nu trece, nimic nu func\u021bioneaz\u0103."}
          </Text>
          <View style={{ backgroundColor: COLORS.R, paddingVertical: 10, paddingHorizontal: 24, borderRadius: 4 }}>
            <Text style={{ fontFamily: FONTS.body, fontSize: 10, fontWeight: 700, color: "#FFFFFF" }}>
              {"Testeaz\u0103 cu AI Audit"}
            </Text>
          </View>
        </View>

        {/* Transition */}
        <View style={s.transitionBox}>
          <Text style={s.transitionText}>
            {"Poarta e deschis\u0103? Atunci hai s\u0103 vedem ce se \u00eent\u00e2mpl\u0103 c\u00e2nd ecua\u021bia e\u0219ueaz\u0103."}
          </Text>
          <Text style={s.transitionCta}>
            {"Capitolul 06: Arhetipuri de E\u0219ec \u2192"}
          </Text>
        </View>
      </PageShell>
    </>
  );
}

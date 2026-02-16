/* ─── Chapter 09 — Implementare ─── */

import React from "react";
import { View, Text, StyleSheet, Svg, Rect } from "@react-pdf/renderer";
import { COLORS, FONTS, SPACING, PAGE_SIZE } from "../theme";
import { PageShell } from "../components/PageShell";
import { ChapterHeader } from "../components/ChapterHeader";
import { SectionText } from "../components/SectionText";
import { QuoteBlock } from "../components/QuoteBlock";

const CHAPTER_LABEL = "Capitolul 09";

/* ─── Data ─── */

const TIMELINE_BARS = [
  { variable: "R", color: "#DC2626", minutes: 5, label: "Relevan\u021b\u0103" },
  { variable: "I", color: "#2563EB", minutes: 4, label: "Interes" },
  { variable: "F", color: "#D97706", minutes: 4, label: "Form\u0103" },
  { variable: "C", color: "#059669", minutes: 2, label: "Claritate" },
];

const AUDITS = [
  {
    num: "1",
    variable: "R",
    label: "RELEVAN\u021aA",
    color: "#DC2626",
    time: "~5 min",
    brutalQuestion:
      "Este aceast\u0103 problem\u0103 prioritatea #1 a clientului meu CHIAR ACUM? Dac\u0103 rezolvi o durere de acum 6 luni, Relevan\u021ba ta este deja zero.",
    whatToCheck: "Traficul real se potrive\u0219te cu ICP-ul t\u0103u?",
    howToCheck: [
      "Deschide Google Analytics \u2192 Audience \u2192 Demographics",
      "Compar\u0103 cu ICP-ul documentat (v\u00e2rst\u0103, loc, interese)",
      "Verific\u0103 Facebook Audience Insights sau CRM-ul",
      "\u00centreab\u0103: \"Dac\u0103 ar\u0103t reclama la 100 persoane random din audien\u021ba actual\u0103, c\u00e2te spun 'E pentru mine'?\"",
    ],
    redFlags: [
      "Peste 40% din trafic nu se potrive\u0219te cu ICP-ul \u2192 R < 5",
      "R\u0103spunsul la \"Cui?\" e \"toat\u0103 lumea\" \u2192 R < 3 \u2192 STOP",
    ],
    indicators: [
      { condition: "R \u2265 3", icon: "green", action: "CONTINU\u0102 la Audit I" },
      { condition: "R < 3", icon: "red", action: "STOP. Rezolv\u0103 targetarea." },
    ],
  },
  {
    num: "2",
    variable: "I",
    label: "INTERESUL",
    color: "#2563EB",
    time: "~4 min",
    brutalQuestion:
      "Dac\u0103 a\u0219 \u0219terge logo-ul brandului, oferta ar mai fi irezistibil\u0103? Dac\u0103 nu po\u021bi articula valoarea \u00eentr-o singur\u0103 fraz\u0103, Interesul este sub 5.",
    whatToCheck: "Mesajul articuleaz\u0103 clar beneficiul unic?",
    howToCheck: [
      "Pune echipa de v\u00e2nz\u0103ri s\u0103 articuleze UVP-ul \u00eentr-o propozi\u021bie",
      "Dac\u0103 nu pot \u2192 I este sub 5. Punct.",
      "Testeaz\u0103: scrie beneficiul principal \u00een max 10 cuvinte",
      "Verific\u0103 dac\u0103 headline-ul con\u021bine beneficiul (nu feature-ul)",
    ],
    redFlags: [
      "Echipa d\u0103 r\u0103spunsuri diferite la \"Ce vindem?\" \u2192 I < 5",
      "Headline-ul vorbe\u0219te despre tine, nu despre client \u2192 I < 5",
    ],
    indicators: [
      { condition: "I \u2265 5", icon: "green", action: "CONTINU\u0102 la Audit F" },
      { condition: "I < 5", icon: "amber", action: "Rescrie UVP-ul. Nu compensa cu F." },
    ],
  },
  {
    num: "3",
    variable: "F",
    label: "FORMA",
    color: "#D97706",
    time: "~4 min",
    brutalQuestion:
      "Designul transport\u0103 mesajul sau \u00eel \u00eengroap\u0103? Formatul ales amplific\u0103 emo\u021bia sau creeaz\u0103 fric\u021biune?",
    whatToCheck: "Formatul amplific\u0103 mesajul sau \u00eel saboteaz\u0103?",
    howToCheck: [
      "Testeaz\u0103 page speed (PageSpeed Insights). Sub 3s pe mobil?",
      "Verific\u0103: ai UN singur CTA vizibil? (1 CTA = +266% conversii)",
      "Deschide pe telefon: e scanabil f\u0103r\u0103 zoom?",
      "Verific\u0103 ierarhia vizual\u0103: headline \u2192 beneficiu \u2192 CTA",
    ],
    redFlags: [
      "Page speed peste 4s pe mobil \u2192 F < 5 (53% abandoneaz\u0103)",
      "Mai mult de 2 CTA-uri pe aceea\u0219i pagin\u0103 \u2192 F < 5",
    ],
    indicators: [
      { condition: "F \u2265 5", icon: "green", action: "CONTINU\u0102 la Audit C" },
      { condition: "F < 5", icon: "amber", action: "Investe\u0219te \u00een design/UX." },
    ],
  },
  {
    num: "4",
    variable: "C",
    label: "CLARITATEA (Testul Suprem)",
    color: "#059669",
    time: "~2 min",
    brutalQuestion:
      "Dac\u0103 ar\u0103t acest material unui str\u0103in timp de 5 secunde, poate s\u0103-mi spun\u0103 Cine suntem, Ce oferim \u0219i Ce trebuie s\u0103 fac\u0103 mai departe?",
    whatToCheck: "Mesajul final e clar pentru un str\u0103in complet?",
    howToCheck: [
      "Calculeaz\u0103: C = R + (I \u00d7 F) = ___",
      "Ruleaz\u0103 Testul de 5 Secunde cu cineva care nu te cunoa\u0219te",
      "Dup\u0103 5 secunde: \"Ce ofer\u0103? Cui? Ce trebuie s\u0103 faci?\"",
      "Dac\u0103 70%+ nu pot r\u0103spunde \u2192 C < 50",
    ],
    redFlags: [
      "C < 30 \u2192 E\u0218EC CRITIC. Opre\u0219te tot. \u00cencepe cu R.",
      "C 30-50 \u2192 INEFICIENT. Identific\u0103 variabila cea mai mic\u0103.",
      "C 50-80 \u2192 FUNC\u021aIONAL. O variabil\u0103 te separ\u0103 de zona suprem\u0103.",
    ],
    indicators: [
      { condition: "C \u2265 80", icon: "green", action: "PUBLIC\u0102 CU \u00ceNCREDERE" },
      { condition: "C 50-79", icon: "amber", action: "Optimizeaz\u0103 + re-scoreaz\u0103." },
      { condition: "C < 50", icon: "red", action: "NU PUBLICA. Diagnostic." },
    ],
  },
];

const CHECKLIST_ITEMS = [
  "R verificat: audien\u021ba corespunde cu ICP-ul",
  "R \u2265 3 confirmat (Poarta Relevan\u021bei deschis\u0103)",
  "I verificat: UVP articulat \u00een max 10 cuvinte",
  "I \u2265 5 confirmat (mesajul are substan\u021b\u0103)",
  "F verificat: speed, CTA unic, mobile-first",
  "F \u2265 5 confirmat (formatul amplific\u0103 mesajul)",
  "Testul de 5 Secunde trecut cu 70%+ succes",
  "C calculat: ___ / 110",
  "C \u2265 80 \u2014 PREG\u0102TIT PENTRU PUBLICARE",
];

const TOOL_STACK = [
  { audit: "Audit R", tools: "Google Analytics, Facebook Audience Insights, CRM" },
  { audit: "Audit I", tools: "ChatGPT/Claude (testeaz\u0103 UVP), focus group informal" },
  { audit: "Audit F", tools: "PageSpeed Insights, GTmetrix, Hotjar (heatmaps)" },
  { audit: "Audit C", tools: "UsabilityHub (5-second test), Hotjar recordings" },
];

const ADOPTION_PAIRS = [
  { wrong: "Nu-mi place aceast\u0103 reclam\u0103.", right: "Aceast\u0103 reclam\u0103 are un F care saboteaz\u0103 R-ul." },
  { wrong: "Mesajul nu e suficient de bun.", right: "I-ul este sub 5 \u2014 UVP-ul nu e articulat clar." },
  { wrong: "Campania nu func\u021bioneaz\u0103.", right: "C-ul este 38 \u2014 trebuie s\u0103 identific\u0103m variabila cea mai slab\u0103." },
];

/* ─── Styles ─── */

const s = StyleSheet.create({
  /* Golden rule */
  goldenCard: {
    backgroundColor: COLORS.F + "0D",
    borderRadius: 6,
    borderWidth: 1,
    borderColor: COLORS.F + "40",
    padding: SPACING.cardPadding,
    marginBottom: SPACING.sectionGap,
  },
  goldenLabel: {
    fontFamily: FONTS.mono,
    fontSize: 10,
    letterSpacing: 2,
    textTransform: "uppercase",
    color: COLORS.F,
    marginBottom: 8,
  },
  goldenLine: {
    fontFamily: FONTS.heading,
    fontSize: 16,
    color: COLORS.textPrimary,
    lineHeight: 1.5,
    marginBottom: 4,
  },
  goldenFooter: {
    fontFamily: FONTS.body,
    fontSize: 10,
    color: COLORS.textMuted,
    marginTop: 8,
  },

  /* Timeline bars */
  timelineTitle: {
    fontFamily: FONTS.mono,
    fontSize: 10,
    letterSpacing: 2,
    textTransform: "uppercase",
    color: COLORS.textMuted,
    marginBottom: 10,
  },
  barRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  barLabel: {
    fontFamily: FONTS.mono,
    fontSize: 9,
    fontWeight: 700,
    width: 18,
  },
  barName: {
    fontFamily: FONTS.body,
    fontSize: 9,
    color: COLORS.textSecondary,
    width: 65,
    marginLeft: 6,
  },
  barTrack: {
    flex: 1,
    height: 14,
    backgroundColor: COLORS.cardBg,
    borderRadius: 3,
    overflow: "hidden",
  },
  barFill: {
    height: 14,
    borderRadius: 3,
  },
  barMins: {
    fontFamily: FONTS.mono,
    fontSize: 9,
    color: COLORS.textMuted,
    marginLeft: 6,
    width: 35,
  },
  barTotal: {
    fontFamily: FONTS.mono,
    fontSize: 11,
    fontWeight: 700,
    color: COLORS.C,
    textAlign: "right",
    marginTop: 4,
    marginBottom: SPACING.sectionGap,
  },

  /* Audit card */
  auditCard: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    padding: SPACING.cardPadding,
    marginBottom: 14,
  },
  auditTopBorder: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
  },
  auditHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  auditVar: {
    fontFamily: FONTS.mono,
    fontSize: 14,
    fontWeight: 700,
  },
  auditTime: {
    fontFamily: FONTS.mono,
    fontSize: 9,
    color: COLORS.textMuted,
  },
  auditLabel: {
    fontFamily: FONTS.mono,
    fontSize: 9,
    letterSpacing: 1,
    textTransform: "uppercase",
    color: COLORS.textMuted,
    marginBottom: 4,
  },
  auditQuestion: {
    fontFamily: FONTS.heading,
    fontSize: 12,
    fontStyle: "italic",
    color: COLORS.textPrimary,
    lineHeight: 1.5,
    marginBottom: 10,
  },
  auditCheckLabel: {
    fontFamily: FONTS.mono,
    fontSize: 9,
    letterSpacing: 1,
    textTransform: "uppercase",
    marginBottom: 4,
  },
  auditCheckItem: {
    flexDirection: "row",
    marginBottom: 3,
    paddingLeft: 4,
  },
  auditCheckBullet: {
    fontFamily: FONTS.mono,
    fontSize: 9,
    color: COLORS.textMuted,
    marginRight: 6,
    width: 10,
  },
  auditCheckText: {
    fontFamily: FONTS.body,
    fontSize: 9.5,
    color: COLORS.textSecondary,
    lineHeight: 1.5,
    flex: 1,
  },
  auditRedFlag: {
    fontFamily: FONTS.body,
    fontSize: 9.5,
    color: COLORS.R,
    lineHeight: 1.5,
    flex: 1,
  },
  auditIndicator: {
    flexDirection: "row",
    marginBottom: 3,
    alignItems: "center",
  },
  auditIndicatorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  auditIndicatorCond: {
    fontFamily: FONTS.mono,
    fontSize: 9,
    fontWeight: 700,
    width: 60,
  },
  auditIndicatorAction: {
    fontFamily: FONTS.body,
    fontSize: 9,
    color: COLORS.textSecondary,
    flex: 1,
  },

  /* Checklist */
  checkTitle: {
    fontFamily: FONTS.mono,
    fontSize: 11,
    letterSpacing: 2,
    textTransform: "uppercase",
    color: COLORS.C,
    marginBottom: 10,
  },
  checkItem: {
    flexDirection: "row",
    marginBottom: 5,
    alignItems: "flex-start",
  },
  checkBox: {
    width: 12,
    height: 12,
    borderRadius: 2,
    borderWidth: 1,
    borderColor: COLORS.borderMedium,
    marginRight: 8,
    marginTop: 1,
  },
  checkText: {
    fontFamily: FONTS.body,
    fontSize: 10,
    color: COLORS.textSecondary,
    flex: 1,
  },
  checkResult: {
    fontFamily: FONTS.mono,
    fontSize: 10,
    fontWeight: 700,
    marginTop: 8,
  },

  /* Tool stack */
  toolTitle: {
    fontFamily: FONTS.heading,
    fontSize: 16,
    color: COLORS.textPrimary,
    marginBottom: 10,
  },
  toolRow: {
    flexDirection: "row",
    marginBottom: 6,
    paddingBottom: 6,
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.borderLight,
  },
  toolAudit: {
    fontFamily: FONTS.mono,
    fontSize: 9,
    fontWeight: 700,
    color: COLORS.textPrimary,
    width: "25%",
  },
  toolTools: {
    fontFamily: FONTS.body,
    fontSize: 9,
    color: COLORS.textSecondary,
    lineHeight: 1.5,
    flex: 1,
  },

  /* Adoption */
  adoptionTitle: {
    fontFamily: FONTS.heading,
    fontSize: 14,
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  adoptionRow: {
    flexDirection: "row",
    marginBottom: 8,
  },
  adoptionWrong: {
    width: "45%",
    backgroundColor: COLORS.R + "0D",
    borderRadius: 4,
    padding: 8,
    marginRight: 8,
  },
  adoptionRight: {
    flex: 1,
    backgroundColor: COLORS.C + "0D",
    borderRadius: 4,
    padding: 8,
  },
  adoptionWrongLabel: {
    fontFamily: FONTS.mono,
    fontSize: 8,
    color: COLORS.R,
    letterSpacing: 1,
    marginBottom: 3,
  },
  adoptionRightLabel: {
    fontFamily: FONTS.mono,
    fontSize: 8,
    color: COLORS.C,
    letterSpacing: 1,
    marginBottom: 3,
  },
  adoptionText: {
    fontFamily: FONTS.body,
    fontSize: 9,
    color: COLORS.textSecondary,
    lineHeight: 1.5,
  },

  /* Example */
  exampleCard: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    padding: SPACING.cardPadding,
    marginBottom: SPACING.sectionGap,
  },
  exampleTitle: {
    fontFamily: FONTS.mono,
    fontSize: 10,
    letterSpacing: 1,
    textTransform: "uppercase",
    color: COLORS.textMuted,
    marginBottom: 6,
  },
  exampleText: {
    fontFamily: FONTS.mono,
    fontSize: 10,
    color: COLORS.textPrimary,
    lineHeight: 1.6,
    marginBottom: 4,
  },
  exampleResult: {
    fontFamily: FONTS.mono,
    fontSize: 10,
    fontWeight: 700,
    marginBottom: 4,
  },
});

/* ─── Component ─── */

export function Ch09Implementation() {
  return (
    <>
      {/* Page 1: Chapter Header */}
      <ChapterHeader
        chapterNumber="09"
        title="Implementare"
        subtitle={'Protocolul de Lansare. Standardul "Zero Zgomot".'}
        color={COLORS.F}
      />

      {/* Page 2: Golden Rule + Timeline */}
      <PageShell chapterLabel={CHAPTER_LABEL}>
        <SectionText
          body="Ai ecua\u021bia. Ai scorul. Ai diagnosticul. Acum ai nevoie de un singur obicei."
        />

        {/* Golden Rule */}
        <View style={s.goldenCard}>
          <Text style={s.goldenLabel}>REGULA DE AUR</Text>
          <Text style={s.goldenLine}>
            Nu ap\u0103sa \u201ePublic\u0103\u201d f\u0103r\u0103 Auditul R IF C.
          </Text>
          <Text style={s.goldenLine}>Niciodat\u0103. F\u0103r\u0103 excep\u021bii.</Text>
          <Text style={s.goldenLine}>
            F\u0103r\u0103 \u201eo dat\u0103 nu conteaz\u0103\u201d.
          </Text>
          <Text style={s.goldenLine}>
            O dat\u0103 e suficient s\u0103 arzi bugetul unei luni.
          </Text>
          <Text style={s.goldenFooter}>
            Protocolul dureaz\u0103 15 minute. \u00ce\u021bi poate salva mii de euro.
          </Text>
        </View>

        {/* Timeline bars */}
        <Text style={s.timelineTitle}>PROTOCOLUL COMPLET: 15 MINUTE</Text>
        {TIMELINE_BARS.map((bar) => (
          <View key={bar.variable} style={s.barRow}>
            <Text style={[s.barLabel, { color: bar.color }]}>
              {bar.variable}
            </Text>
            <Text style={s.barName}>{bar.label}</Text>
            <View style={s.barTrack}>
              <View
                style={[
                  s.barFill,
                  {
                    backgroundColor: bar.color,
                    width: `${(bar.minutes / 15) * 100}%`,
                    opacity: 0.7,
                  },
                ]}
              />
            </View>
            <Text style={s.barMins}>{bar.minutes} min</Text>
          </View>
        ))}
        <Text style={s.barTotal}>TOTAL: 15 min</Text>
      </PageShell>

      {/* Page 3: Audit R + Audit I */}
      <PageShell chapterLabel={CHAPTER_LABEL}>
        {AUDITS.slice(0, 2).map((audit) => (
          <View key={audit.variable} style={s.auditCard}>
            <View style={[s.auditTopBorder, { backgroundColor: audit.color }]} />
            <View style={s.auditHeader}>
              <Text style={[s.auditVar, { color: audit.color }]}>
                {audit.variable} \u2014 {audit.label}
              </Text>
              <Text style={s.auditTime}>{audit.time}</Text>
            </View>

            <Text style={s.auditLabel}>\u00ceNTREBAREA BRUTAL\u0102</Text>
            <Text style={s.auditQuestion}>{audit.brutalQuestion}</Text>

            <Text style={[s.auditCheckLabel, { color: audit.color }]}>
              CUM VERIFICI
            </Text>
            {audit.howToCheck.map((item, idx) => (
              <View key={idx} style={s.auditCheckItem}>
                <Text style={s.auditCheckBullet}>{"\u2022"}</Text>
                <Text style={s.auditCheckText}>{item}</Text>
              </View>
            ))}

            <Text style={[s.auditCheckLabel, { color: COLORS.R, marginTop: 6 }]}>
              SEMNALE DE ALARM\u0102
            </Text>
            {audit.redFlags.map((flag, idx) => (
              <View key={idx} style={s.auditCheckItem}>
                <Text style={s.auditCheckBullet}>{"\u26A0"}</Text>
                <Text style={s.auditRedFlag}>{flag}</Text>
              </View>
            ))}

            {/* Indicators */}
            <View style={{ marginTop: 6 }}>
              {audit.indicators.map((ind, idx) => (
                <View key={idx} style={s.auditIndicator}>
                  <View
                    style={[
                      s.auditIndicatorDot,
                      {
                        backgroundColor:
                          ind.icon === "green"
                            ? COLORS.C
                            : ind.icon === "amber"
                            ? COLORS.F
                            : COLORS.R,
                      },
                    ]}
                  />
                  <Text style={[s.auditIndicatorCond, { color: audit.color }]}>
                    {ind.condition}
                  </Text>
                  <Text style={s.auditIndicatorAction}>{ind.action}</Text>
                </View>
              ))}
            </View>
          </View>
        ))}
      </PageShell>

      {/* Page 4: Audit F + Audit C */}
      <PageShell chapterLabel={CHAPTER_LABEL}>
        {AUDITS.slice(2, 4).map((audit) => (
          <View key={audit.variable} style={s.auditCard}>
            <View style={[s.auditTopBorder, { backgroundColor: audit.color }]} />
            <View style={s.auditHeader}>
              <Text style={[s.auditVar, { color: audit.color }]}>
                {audit.variable} \u2014 {audit.label}
              </Text>
              <Text style={s.auditTime}>{audit.time}</Text>
            </View>

            <Text style={s.auditLabel}>\u00ceNTREBAREA BRUTAL\u0102</Text>
            <Text style={s.auditQuestion}>{audit.brutalQuestion}</Text>

            <Text style={[s.auditCheckLabel, { color: audit.color }]}>
              CUM VERIFICI
            </Text>
            {audit.howToCheck.map((item, idx) => (
              <View key={idx} style={s.auditCheckItem}>
                <Text style={s.auditCheckBullet}>{"\u2022"}</Text>
                <Text style={s.auditCheckText}>{item}</Text>
              </View>
            ))}

            <Text style={[s.auditCheckLabel, { color: COLORS.R, marginTop: 6 }]}>
              SEMNALE DE ALARM\u0102
            </Text>
            {audit.redFlags.map((flag, idx) => (
              <View key={idx} style={s.auditCheckItem}>
                <Text style={s.auditCheckBullet}>{"\u26A0"}</Text>
                <Text style={s.auditRedFlag}>{flag}</Text>
              </View>
            ))}

            <View style={{ marginTop: 6 }}>
              {audit.indicators.map((ind, idx) => (
                <View key={idx} style={s.auditIndicator}>
                  <View
                    style={[
                      s.auditIndicatorDot,
                      {
                        backgroundColor:
                          ind.icon === "green"
                            ? COLORS.C
                            : ind.icon === "amber"
                            ? COLORS.F
                            : COLORS.R,
                      },
                    ]}
                  />
                  <Text style={[s.auditIndicatorCond, { color: audit.color }]}>
                    {ind.condition}
                  </Text>
                  <Text style={s.auditIndicatorAction}>{ind.action}</Text>
                </View>
              ))}
            </View>
          </View>
        ))}
      </PageShell>

      {/* Page 5: Example + Checklist */}
      <PageShell chapterLabel={CHAPTER_LABEL}>
        <View style={s.exampleCard}>
          <Text style={s.exampleTitle}>EXEMPLU RAPID</Text>
          <Text style={s.exampleText}>R = 8, I = 7, F = 2</Text>
          <Text style={[s.exampleResult, { color: COLORS.R }]}>
            C = 8 + (7 \u00d7 2) = 22 \u2192 E\u0218EC CRITIC
          </Text>
          <Text style={[s.exampleText, { color: COLORS.R }]}>
            STOP! Nu publica. F = 2 saboteaz\u0103 tot.
          </Text>
          <Text style={[s.exampleResult, { color: COLORS.C, marginTop: 6 }]}>
            Optimizarea Formei: F de la 2 la 7 \u2192 C = 8 + (7 \u00d7 7) = 57 \u2192 FUNC\u021aIONAL (+159%)
          </Text>
        </View>

        {/* Checklist */}
        <Text style={s.checkTitle}>CHECKLIST PRE-PUBLICARE</Text>
        {CHECKLIST_ITEMS.map((item, idx) => (
          <View key={idx} style={s.checkItem}>
            <View style={s.checkBox} />
            <Text style={s.checkText}>{item}</Text>
          </View>
        ))}
        <Text style={[s.checkResult, { color: COLORS.C }]}>
          Toate bifate \u2192 PUBLIC\u0102
        </Text>
        <Text style={[s.checkResult, { color: COLORS.R }]}>
          Oricare nebifat \u2192 STOP. Optimizeaz\u0103. Re-scoreaz\u0103.
        </Text>
      </PageShell>

      {/* Page 6: Adoption + Tool Stack */}
      <PageShell chapterLabel={CHAPTER_LABEL}>
        <Text style={s.adoptionTitle}>
          Transform\u0103 R IF C \u00een limbaj intern
        </Text>
        {ADOPTION_PAIRS.map((pair, idx) => (
          <View key={idx} style={s.adoptionRow}>
            <View style={s.adoptionWrong}>
              <Text style={s.adoptionWrongLabel}>INAINTE</Text>
              <Text style={s.adoptionText}>{pair.wrong}</Text>
            </View>
            <View style={s.adoptionRight}>
              <Text style={s.adoptionRightLabel}>ACUM CU R IF C</Text>
              <Text style={s.adoptionText}>{pair.right}</Text>
            </View>
          </View>
        ))}

        <SectionText
          body="Protocolul R IF C elimin\u0103 subiectivitatea din feedback \u0219i accelereaz\u0103 aprob\u0103rile. Echipa nu mai dezbate gusturi \u2014 dezbate scoruri."
        />

        {/* Tool stack */}
        <Text style={s.toolTitle}>Tool Stack Recomandat</Text>
        {TOOL_STACK.map((t, idx) => (
          <View key={idx} style={s.toolRow}>
            <Text style={s.toolAudit}>{t.audit}</Text>
            <Text style={s.toolTools}>{t.tools}</Text>
          </View>
        ))}
      </PageShell>

      {/* Page 7: Closer */}
      <PageShell chapterLabel={CHAPTER_LABEL}>
        <SectionText
          heading="Certificarea Clarit\u0103\u021bii"
          body={[
            "Protocolul R IF C nu este o piedic\u0103 \u00een calea creativit\u0103\u021bii. Este centura de siguran\u021b\u0103 a profitului t\u0103u.",
            "Odat\u0103 ce bifezi cele 4 puncte, nu mai lansezi campanii \"la noroc\" \u2014 lansezi sisteme de achizi\u021bie predictibile.",
            "15 minute. 4 audituri. Un obicei.",
            "F\u0103-l de fiecare dat\u0103 \u0219i nu vei mai arde niciodat\u0103 buget pe Zgomot Estetic.",
          ]}
          headingColor={COLORS.C}
        />

        <QuoteBlock
          text="Protocolul e complet. Dar cum arat\u0103 \u00een practic\u0103? Studii de caz reale."
          attribution="CAPITOLUL 10 \u2192 STUDII DE CAZ"
          color={COLORS.C}
        />
      </PageShell>
    </>
  );
}

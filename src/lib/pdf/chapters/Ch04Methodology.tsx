/* ─── Chapter 04 — Metodologia de Scoring ─── */

import React from "react";
import { Page, View, Text, StyleSheet, Svg, Rect } from "@react-pdf/renderer";
import { COLORS, FONTS, SPACING, PAGE_SIZE } from "../theme";
import { PageShell } from "../components/PageShell";

const CHAPTER = "Capitolul 04";

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
    color: COLORS.C,
    textTransform: "uppercase",
    marginBottom: 14,
  },
  chapterTitle: {
    fontFamily: FONTS.heading,
    fontSize: 36,
    fontWeight: 700,
    color: COLORS.textOnDark,
    lineHeight: 1.25,
    marginBottom: 20,
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

  /* ── Intro challenge ── */
  challengeBox: {
    backgroundColor: COLORS.cardBg,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    padding: 18,
    borderRadius: 6,
    marginBottom: SPACING.sectionGap,
    alignItems: "center",
  },
  challengeText: {
    fontFamily: FONTS.heading,
    fontSize: 18,
    fontWeight: 700,
    color: COLORS.textPrimary,
    textAlign: "center",
    marginBottom: 12,
  },
  challengeRow: {
    flexDirection: "row",
    gap: 16,
    width: "100%",
  },
  challengeItem: {
    flex: 1,
    padding: 10,
    borderRadius: 4,
    alignItems: "center",
  },
  challengeItemText: {
    fontFamily: FONTS.body,
    fontSize: 9.5,
    textAlign: "center",
    lineHeight: 1.5,
  },

  /* ── Scoring guide card ── */
  guideCard: {
    borderWidth: 1,
    borderRadius: 6,
    padding: 16,
    marginBottom: 16,
  },
  guideHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 12,
  },
  guideLetterBox: {
    width: 36,
    height: 36,
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
  },
  guideLetter: {
    fontFamily: FONTS.mono,
    fontSize: 18,
    fontWeight: 700,
    color: "#FFFFFF",
  },
  guideTitle: {
    fontFamily: FONTS.body,
    fontSize: 11,
    fontWeight: 700,
    color: COLORS.textPrimary,
    flex: 1,
  },

  /* ── Level rows ── */
  levelRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.borderLight,
  },
  levelRange: {
    width: 36,
    fontFamily: FONTS.mono,
    fontSize: 10,
    fontWeight: 700,
    textAlign: "center",
  },
  levelBar: {
    width: 80,
    height: 8,
    backgroundColor: "#F3F4F6",
    borderRadius: 4,
    marginHorizontal: 8,
    overflow: "hidden",
  },
  levelDesc: {
    flex: 1,
    fontFamily: FONTS.body,
    fontSize: 9,
    color: COLORS.textSecondary,
    lineHeight: 1.45,
  },

  /* ── Warning ── */
  warningBox: {
    backgroundColor: "#FEF2F2",
    borderLeftWidth: 3,
    borderLeftColor: COLORS.R,
    padding: 8,
    borderRadius: 4,
    marginTop: 8,
  },
  warningText: {
    fontFamily: FONTS.mono,
    fontSize: 8,
    color: COLORS.R,
    letterSpacing: 1,
  },

  /* ── Example ── */
  exampleCard: {
    backgroundColor: COLORS.cardBg,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    borderRadius: 6,
    padding: 18,
    marginBottom: SPACING.sectionGap,
  },
  exampleScenario: {
    fontFamily: FONTS.heading,
    fontSize: 10,
    fontStyle: "italic",
    color: COLORS.textSecondary,
    lineHeight: 1.55,
    marginBottom: 12,
  },
  exampleRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 8,
  },
  exampleVarBox: {
    flex: 1,
    padding: 8,
    borderRadius: 4,
    borderWidth: 1,
  },
  exampleVarLabel: {
    fontFamily: FONTS.mono,
    fontSize: 8,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    marginBottom: 4,
  },
  exampleVarScore: {
    fontFamily: FONTS.mono,
    fontSize: 16,
    fontWeight: 700,
    marginBottom: 2,
  },
  exampleVarDesc: {
    fontFamily: FONTS.body,
    fontSize: 8,
    color: COLORS.textSecondary,
    lineHeight: 1.4,
  },
  exampleResult: {
    backgroundColor: COLORS.darkBg,
    padding: 12,
    borderRadius: 4,
    alignItems: "center",
    marginTop: 10,
  },
  exampleResultCalc: {
    fontFamily: FONTS.mono,
    fontSize: 14,
    fontWeight: 700,
    color: COLORS.textOnDark,
    marginBottom: 4,
  },
  exampleResultZone: {
    fontFamily: FONTS.mono,
    fontSize: 9,
    letterSpacing: 1.5,
    color: COLORS.F,
  },

  /* ── Progress bar ── */
  progressRow: {
    flexDirection: "row",
    height: 12,
    borderRadius: 6,
    overflow: "hidden",
    marginBottom: 6,
  },
  progressLabelsRow: {
    flexDirection: "row",
    marginBottom: SPACING.sectionGap,
  },
  progressLabel: {
    fontFamily: FONTS.mono,
    fontSize: 7,
    letterSpacing: 0.5,
    textAlign: "center",
  },

  /* ── Zone action cards ── */
  zoneCard: {
    borderLeftWidth: 3,
    padding: 14,
    borderRadius: 4,
    marginBottom: 10,
    backgroundColor: COLORS.cardBg,
  },
  zoneActionLabel: {
    fontFamily: FONTS.mono,
    fontSize: 8,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    marginBottom: 6,
  },
  zoneActionText: {
    fontFamily: FONTS.body,
    fontSize: 9.5,
    color: COLORS.textSecondary,
    lineHeight: 1.55,
  },

  /* ── Gate rule ── */
  gateCard: {
    borderWidth: 2,
    borderColor: COLORS.R,
    borderRadius: 6,
    padding: 18,
    marginBottom: SPACING.sectionGap,
  },
  gateTitle: {
    fontFamily: FONTS.mono,
    fontSize: 10,
    letterSpacing: 2,
    color: COLORS.R,
    textTransform: "uppercase",
    marginBottom: 10,
  },
  gateCalc: {
    fontFamily: FONTS.mono,
    fontSize: 12,
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  gateOnPaper: {
    fontFamily: FONTS.body,
    fontSize: 10,
    color: COLORS.C,
    marginBottom: 4,
  },
  gateReality: {
    fontFamily: FONTS.body,
    fontSize: 10,
    fontWeight: 700,
    color: COLORS.R,
    marginBottom: 8,
  },
  gateFinal: {
    fontFamily: FONTS.body,
    fontSize: 11,
    fontWeight: 700,
    color: COLORS.R,
    textAlign: "center",
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

/* Helper: render a scoring guide per variable */
function ScoringGuide({
  letter,
  color,
  title,
  levels,
  warning,
}: {
  letter: string;
  color: string;
  title: string;
  levels: { range: string; percent: number; desc: string }[];
  warning?: string;
}) {
  return (
    <View style={[s.guideCard, { borderColor: color }]}>
      <View style={s.guideHeader}>
        <View style={[s.guideLetterBox, { backgroundColor: color }]}>
          <Text style={s.guideLetter}>{letter}</Text>
        </View>
        <Text style={s.guideTitle}>{title}</Text>
      </View>
      {levels.map((l, i) => (
        <View key={i} style={s.levelRow}>
          <Text style={[s.levelRange, { color }]}>{l.range}</Text>
          <View style={s.levelBar}>
            <View style={{ width: `${l.percent}%`, height: "100%", backgroundColor: color, borderRadius: 4 }} />
          </View>
          <Text style={s.levelDesc}>{l.desc}</Text>
        </View>
      ))}
      {warning && (
        <View style={s.warningBox}>
          <Text style={s.warningText}>{warning}</Text>
        </View>
      )}
    </View>
  );
}

export function Ch04Methodology() {
  return (
    <>
      {/* ═══════ PAGE 1 — Chapter opener (dark) ═══════ */}
      <Page size={PAGE_SIZE} style={s.openerPage}>
        <View>
          <Text style={s.chapterNum}>{CHAPTER}</Text>
          <Text style={s.chapterTitle}>Metodologia de Scoring</Text>
          <View style={{ width: 40, height: 1, backgroundColor: COLORS.C, marginBottom: 16 }} />
          <Text style={s.chapterDesc}>
            {"Fiecare variabil\u0103 R, I, F prime\u0219te o not\u0103 de la 1 la 10. Tu e\u0219ti evaluatorul \u2014 \u0219i acurate\u021bea diagnosticului depinde de onestitatea ta."}
          </Text>
        </View>
      </Page>

      {/* ═══════ PAGE 2 — Intro challenge ═══════ */}
      <PageShell chapterLabel={CHAPTER}>
        <View style={s.challengeBox}>
          <Text style={s.challengeText}>
            {"C\u00e2t de sincer po\u021bi fi cu tine \u00eensu\u021bi?"}
          </Text>
          <Text style={s.body}>
            {"Fiecare variabil\u0103 R, I, F prime\u0219te o not\u0103 de la 1 la 10. Tu e\u0219ti evaluatorul \u2014 \u0219i acurate\u021bea diagnosticului depinde de onestitatea ta."}
          </Text>
          <View style={s.challengeRow}>
            <View style={[s.challengeItem, { backgroundColor: "#FEF2F2" }]}>
              <Text style={[s.challengeItemText, { color: COLORS.R }]}>
                {"Scoreaz\u0103 generos \u2192 te am\u0103ge\u0219ti."}
              </Text>
            </View>
            <View style={[s.challengeItem, { backgroundColor: "#F0FDF4" }]}>
              <Text style={[s.challengeItemText, { color: COLORS.C }]}>
                {"Scoreaz\u0103 dur \u2192 descoperi exact unde pierzi bani."}
              </Text>
            </View>
          </View>
        </View>

        <Text style={s.h2}>Ghid de Scoring per Variabil\u0103</Text>
      </PageShell>

      {/* ═══════ PAGE 3 — R Scoring Guide ═══════ */}
      <PageShell chapterLabel={CHAPTER}>
        <ScoringGuide
          letter="R"
          color={COLORS.R}
          title={"RELEVAN\u021aA \u2014 Cum scorezi de la 1 la 10"}
          levels={[
            { range: "1-2", percent: 10, desc: "Audien\u021b\u0103 complet gre\u0219it\u0103. Vorbe\u0219ti cu oameni care nu au nevoie de ce vinzi." },
            { range: "3-4", percent: 30, desc: "Audien\u021b\u0103 vag\u0103. \u201eTo\u021bi antreprenorii\u201d e prea larg. \u0218tii industria dar nu ICP-ul exact." },
            { range: "5-6", percent: 50, desc: "ICP definit dar timing sau canal nepotrivit." },
            { range: "7-8", percent: 70, desc: "ICP precis + timing bun + canal corect. Mesajul ajunge la cine trebuie, c\u00e2nd trebuie." },
            { range: "9-10", percent: 90, desc: "Hyper-targetare. Mesajul pare scris personal pentru fiecare recipient. Zona branduri cult." },
          ]}
          warning={"R < 3 \u2192 Poarta Relevan\u021bei: E\u0218EC CRITIC AUTOMAT"}
        />
      </PageShell>

      {/* ═══════ PAGE 4 — I Scoring Guide ═══════ */}
      <PageShell chapterLabel={CHAPTER}>
        <ScoringGuide
          letter="I"
          color={COLORS.I}
          title={"INTERESUL \u2014 Cum scorezi de la 1 la 10"}
          levels={[
            { range: "1-2", percent: 10, desc: "Zero diferen\u021biere. Mesajul t\u0103u e identic cu al concuren\u021bei." },
            { range: "3-4", percent: 30, desc: "Beneficiu generic. \u201eCalitate superioar\u0103\u201d f\u0103r\u0103 dovad\u0103." },
            { range: "5-6", percent: 50, desc: "UVP exist\u0103 dar nu e articulat clar. Prospectul trebuie s\u0103 munceasc\u0103 s\u0103-l g\u0103seasc\u0103." },
            { range: "7-8", percent: 70, desc: "UVP clar, dovad\u0103 social\u0103, open loop func\u021bional. Prospectul r\u0103m\u00e2ne pe pagin\u0103." },
            { range: "9-10", percent: 90, desc: "Irezistibil. Curiosity gap, transformare clar\u0103, urgen\u021b\u0103 autentic\u0103. Prospectul nu poate s\u0103 NU ac\u021bioneze." },
          ]}
        />
      </PageShell>

      {/* ═══════ PAGE 5 — F Scoring Guide ═══════ */}
      <PageShell chapterLabel={CHAPTER}>
        <ScoringGuide
          letter="F"
          color={COLORS.F}
          title={"FORMA \u2014 Cum scorezi de la 1 la 10"}
          levels={[
            { range: "1-2", percent: 10, desc: "Neprofesional. Design amator, text neformatat, UX inexistent." },
            { range: "3-4", percent: 30, desc: "Sub-standard. Site din 2010, email text-only, pitch prea lung." },
            { range: "5-6", percent: 50, desc: "Decent dar neoptimizat. Design OK dar f\u0103r\u0103 ierarhie vizual\u0103 clar\u0103." },
            { range: "7-8", percent: 70, desc: "Profesional. Design curat, scanabil, CTA clar, mobile-optimized." },
            { range: "9-10", percent: 90, desc: "Excep\u021bional. UX fluid, micro-anima\u021bii, speed sub 2s, 1 CTA perfect. Formatul amplific\u0103 mesajul 10\u00d7." },
          ]}
        />
      </PageShell>

      {/* ═══════ PAGE 6 — Live Example ═══════ */}
      <PageShell chapterLabel={CHAPTER}>
        <Text style={s.h2}>{"EXEMPLU: Cum func\u021bioneaz\u0103 \u00een practic\u0103"}</Text>

        <View style={s.exampleCard}>
          <Text style={s.exampleScenario}>
            {"Imagineaz\u0103-\u021bi un SaaS care vinde software de project management c\u0103tre startup-uri tech:"}
          </Text>

          <View style={s.exampleRow}>
            <View style={[s.exampleVarBox, { borderColor: COLORS.R, backgroundColor: "#FEF2F2" }]}>
              <Text style={[s.exampleVarLabel, { color: COLORS.R }]}>R = 7</Text>
              <Text style={s.exampleVarDesc}>
                {"Audien\u021ba e definit\u0103 (CTOs startup-uri), canal corect (LinkedIn), timing bun."}
              </Text>
            </View>
            <View style={[s.exampleVarBox, { borderColor: COLORS.I, backgroundColor: "#EFF6FF" }]}>
              <Text style={[s.exampleVarLabel, { color: COLORS.I }]}>I = 8</Text>
              <Text style={s.exampleVarDesc}>
                {"UVP clar (\u201eReduce meeting time by 40%\u201d), testimoniale de la YC startups, free trial."}
              </Text>
            </View>
            <View style={[s.exampleVarBox, { borderColor: COLORS.F, backgroundColor: "#FFFBEB" }]}>
              <Text style={[s.exampleVarLabel, { color: COLORS.F }]}>F = 6</Text>
              <Text style={s.exampleVarDesc}>
                {"Site decent dar lent (4.2s load), landing page cu 3 CTA-uri competitoare, f\u0103r\u0103 video."}
              </Text>
            </View>
          </View>

          <View style={s.exampleResult}>
            <Text style={s.exampleResultCalc}>{"C = 7 + (8 \u00d7 6) = 55"}</Text>
            <Text style={s.exampleResultZone}>{"CLARITATE MEDIE \u2014 Func\u021bional dar vulnerabil"}</Text>
          </View>
        </View>

        {/* Diagnostic */}
        <Text style={s.body}>
          {"F trage scorul \u00een jos. Dac\u0103 F cre\u0219te de la 6 la 9 (fix site speed + 1 CTA + video):"}
        </Text>

        <View style={{ backgroundColor: "#F0FDF4", padding: 12, borderRadius: 4, marginBottom: 10, alignItems: "center" }}>
          <Text style={{ fontFamily: FONTS.mono, fontSize: 13, fontWeight: 700, color: COLORS.C }}>
            {"7 + (8 \u00d7 9) = 79 \u2192 aproape Claritate Suprem\u0103."}
          </Text>
        </View>

        <View style={{ backgroundColor: COLORS.darkBg, padding: 12, borderRadius: 4, alignItems: "center" }}>
          <Text style={{ fontFamily: FONTS.body, fontSize: 11, fontWeight: 700, color: COLORS.textOnDark }}>
            {"O singur\u0103 variabil\u0103 \u00eembun\u0103t\u0103\u021bit\u0103 = +44% Claritate"}
          </Text>
        </View>
      </PageShell>

      {/* ═══════ PAGE 7 — Progress bars + Zone Actions ═══════ */}
      <PageShell chapterLabel={CHAPTER}>
        {/* Progress bar visualization */}
        <Text style={s.h2}>Zonele de Claritate</Text>
        <View style={s.progressRow}>
          <View style={{ flex: 20, backgroundColor: COLORS.zoneCritical, borderTopLeftRadius: 6, borderBottomLeftRadius: 6 }} />
          <View style={{ flex: 30, backgroundColor: COLORS.zoneNoise }} />
          <View style={{ flex: 30, backgroundColor: COLORS.zoneMedium }} />
          <View style={{ flex: 20, backgroundColor: COLORS.zoneSupreme, borderTopRightRadius: 6, borderBottomRightRadius: 6 }} />
        </View>
        <View style={s.progressLabelsRow}>
          <Text style={[s.progressLabel, { flex: 20, color: COLORS.zoneCritical }]}>{"E\u0219ec Critic\n0\u201420"}</Text>
          <Text style={[s.progressLabel, { flex: 30, color: COLORS.zoneNoise }]}>{"Zgomot de Fond\n21\u201450"}</Text>
          <Text style={[s.progressLabel, { flex: 30, color: COLORS.zoneMedium }]}>{"Claritate Medie\n51\u201480"}</Text>
          <Text style={[s.progressLabel, { flex: 20, color: COLORS.zoneSupreme }]}>{"Claritate Suprem\u0103\n81+"}</Text>
        </View>

        {/* Zone action cards */}
        <View style={[s.zoneCard, { borderLeftColor: COLORS.zoneCritical }]}>
          <Text style={[s.zoneActionLabel, { color: COLORS.zoneCritical }]}>{"E\u0218EC CRITIC (0\u201420)"}</Text>
          <Text style={s.zoneActionText}>
            {"STOP. Opre\u0219te toate campaniile. Nu optimiza \u2014 reconstruie\u0219te de la zero. \u00cencepe cu: R (Poarta Relevan\u021bei). Dac\u0103 R < 3, nimic altceva nu conteaz\u0103."}
          </Text>
        </View>

        <View style={[s.zoneCard, { borderLeftColor: COLORS.zoneNoise }]}>
          <Text style={[s.zoneActionLabel, { color: COLORS.zoneNoise }]}>{"ZGOMOT DE FOND (21\u201450)"}</Text>
          <Text style={s.zoneActionText}>
            {"Diagnostic urgent. Una din variabile trage dramatic scorul. Identific\u0103: Folose\u0219te Auditul AI pentru a g\u0103si variabila defect\u0103 \u2192 Cap. 06 Arhetipuri."}
          </Text>
        </View>

        <View style={[s.zoneCard, { borderLeftColor: COLORS.zoneMedium }]}>
          <Text style={[s.zoneActionLabel, { color: COLORS.zoneMedium }]}>{"CLARITATE MEDIE (51\u201480)"}</Text>
          <Text style={s.zoneActionText}>
            {"Optimizare chirurgical\u0103. Ai o baz\u0103 solid\u0103 \u2014 dar o singur\u0103 variabil\u0103 te separ\u0103 de zona Suprem\u0103. Caut\u0103: Variabila cu scorul cel mai mic. Cre\u0219terea ei cu 2-3 puncte poate urca C cu 20-30 puncte (efect multiplicator I \u00d7 F)."}
          </Text>
        </View>

        <View style={[s.zoneCard, { borderLeftColor: COLORS.zoneSupreme }]}>
          <Text style={[s.zoneActionLabel, { color: COLORS.zoneSupreme }]}>{"CLARITATE SUPREM\u0102 (81+)"}</Text>
          <Text style={s.zoneActionText}>
            {"Protejeaz\u0103 \u0219i scaleaz\u0103. Nu schimba ce func\u021bioneaz\u0103 \u2014 amplific\u0103 prin canale noi \u0219i audien\u021be adiacente. Aten\u021bie: Claritatea Suprem\u0103 e fragil\u0103. O schimbare de audien\u021b\u0103 sau pia\u021b\u0103 poate reseta R peste noapte. Monitorizeaz\u0103 lunar."}
          </Text>
        </View>
      </PageShell>

      {/* ═══════ PAGE 8 — Relevance Gate Rule ═══════ */}
      <PageShell chapterLabel={CHAPTER}>
        <View style={s.gateCard}>
          <Text style={s.gateTitle}>{"REGULA POARTA RELEVAN\u021aEI"}</Text>
          <Text style={s.body}>
            {"Dac\u0103 R < 3, scorul C este IRELEVANT \u2014 indiferent c\u00e2t de mari sunt I \u0219i F."}
          </Text>
          <Text style={s.gateCalc}>{"R = 2, I = 10, F = 10"}</Text>
          <Text style={s.gateOnPaper}>{"Pe h\u00e2rtie: Claritate Suprem\u0103 (102/110)."}</Text>
          <Text style={s.gateReality}>{"In realitate: mesaj perfect \u2192 audien\u021b\u0103 gre\u0219it\u0103 \u2192 zero."}</Text>
          <Text style={s.body}>{"Poarta Relevan\u021bei suprascrie ecua\u021bia."}</Text>
          <Text style={s.gateFinal}>{"R < 3 = E\u0218EC CRITIC, punct."}</Text>
        </View>
      </PageShell>

      {/* ═══════ PAGE 9 — CTA + Transition ═══════ */}
      <PageShell chapterLabel={CHAPTER}>
        <View style={{ backgroundColor: COLORS.cardBg, padding: 18, borderRadius: 6, alignItems: "center", marginBottom: SPACING.sectionGap }}>
          <Text style={{ fontFamily: FONTS.heading, fontSize: 16, fontWeight: 700, color: COLORS.textPrimary, textAlign: "center", marginBottom: 8 }}>
            {"\u0218tii cum func\u021bioneaz\u0103. Acum afl\u0103-\u021bi scorul."}
          </Text>
          <Text style={{ fontFamily: FONTS.body, fontSize: 10, color: COLORS.textSecondary, textAlign: "center", lineHeight: 1.55, marginBottom: 12 }}>
            {"Scoreaz\u0103-te manual folosind ghidul de mai sus, sau las\u0103 AI-ul s\u0103 o fac\u0103 \u00een 30 de secunde."}
          </Text>
          <View style={{ backgroundColor: COLORS.I, paddingVertical: 10, paddingHorizontal: 24, borderRadius: 4 }}>
            <Text style={{ fontFamily: FONTS.body, fontSize: 10, fontWeight: 700, color: "#FFFFFF" }}>
              {"Calculeaz\u0103-\u021bi Scorul C"}
            </Text>
          </View>
        </View>

        {/* Transition */}
        <View style={s.transitionBox}>
          <Text style={s.transitionText}>
            {"Dar ce faci dac\u0103 scorul e mic?"}
          </Text>
          <Text style={s.transitionCta}>
            {"Capitolul 05: Poarta Relevan\u021bei \u2192"}
          </Text>
        </View>
      </PageShell>
    </>
  );
}

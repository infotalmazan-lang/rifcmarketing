/* ─── Chapter 06 — Diagnostic Omnichannel ─── */

import React from "react";
import { Page, View, Text, StyleSheet } from "@react-pdf/renderer";
import { COLORS, FONTS, SPACING, PAGE_SIZE } from "../theme";
import { PageShell } from "../components/PageShell";

const CHAPTER = "Capitolul 06";

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
  chapterTitleLight: {
    fontFamily: FONTS.heading,
    fontSize: 36,
    fontWeight: 300,
    color: COLORS.textOnDarkSecondary,
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

  /* ── Intro shock ── */
  shockBox: {
    backgroundColor: COLORS.darkBg,
    padding: 20,
    borderRadius: 6,
    alignItems: "center",
    marginBottom: SPACING.sectionGap,
  },
  shockText: {
    fontFamily: FONTS.heading,
    fontSize: 16,
    fontWeight: 700,
    color: COLORS.textOnDark,
    textAlign: "center",
    lineHeight: 1.45,
  },

  /* ── Channel card ── */
  channelCard: {
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    borderRadius: 6,
    padding: 16,
    marginBottom: 16,
  },
  channelHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.borderLight,
  },
  channelIcon: {
    width: 32,
    height: 32,
    borderRadius: 6,
    backgroundColor: COLORS.I,
    justifyContent: "center",
    alignItems: "center",
  },
  channelIconText: {
    fontFamily: FONTS.mono,
    fontSize: 8,
    color: "#FFFFFF",
    fontWeight: 700,
  },
  channelName: {
    fontFamily: FONTS.heading,
    fontSize: 16,
    fontWeight: 700,
    color: COLORS.textPrimary,
    flex: 1,
  },
  channelBenchmark: {
    fontFamily: FONTS.mono,
    fontSize: 8,
    letterSpacing: 1,
    color: COLORS.C,
  },

  /* ── Variable diagnostic row ── */
  varDiagRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 8,
  },
  varDiagCard: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 4,
    padding: 8,
  },
  varDiagLetter: {
    fontFamily: FONTS.mono,
    fontSize: 10,
    fontWeight: 700,
    marginBottom: 3,
  },
  varDiagDesc: {
    fontFamily: FONTS.body,
    fontSize: 8,
    color: COLORS.textSecondary,
    lineHeight: 1.4,
    marginBottom: 3,
  },
  varDiagQuestion: {
    fontFamily: FONTS.heading,
    fontSize: 7.5,
    fontStyle: "italic",
    color: COLORS.textMuted,
    lineHeight: 1.35,
    marginBottom: 3,
  },
  varDiagRedFlag: {
    fontFamily: FONTS.mono,
    fontSize: 7,
    color: COLORS.R,
    marginTop: 2,
  },

  /* ── Summary / benchmark bar ── */
  summaryBox: {
    backgroundColor: COLORS.cardBg,
    padding: 10,
    borderRadius: 4,
    marginTop: 8,
  },
  summaryText: {
    fontFamily: FONTS.body,
    fontSize: 9,
    color: COLORS.textSecondary,
    lineHeight: 1.5,
    marginBottom: 4,
  },
  benchmarkRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 6,
  },
  benchmarkBar: {
    flex: 1,
    height: 8,
    backgroundColor: "#E5E7EB",
    borderRadius: 4,
    overflow: "hidden",
  },
  benchmarkLabel: {
    fontFamily: FONTS.mono,
    fontSize: 8,
    color: COLORS.C,
    width: 100,
  },

  /* ── Metrics row ── */
  metricsRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 8,
  },
  metricTag: {
    paddingVertical: 3,
    paddingHorizontal: 6,
    borderRadius: 3,
    backgroundColor: COLORS.cardBg,
    borderWidth: 0.5,
    borderColor: COLORS.borderLight,
  },
  metricText: {
    fontFamily: FONTS.mono,
    fontSize: 7,
    color: COLORS.textSecondary,
  },
  metricIndicator: {
    fontFamily: FONTS.mono,
    fontSize: 7,
    fontWeight: 700,
  },

  /* ── Quick win ── */
  quickWinBox: {
    backgroundColor: "#FFFBEB",
    borderLeftWidth: 3,
    borderLeftColor: COLORS.F,
    padding: 10,
    borderRadius: 4,
    marginTop: 8,
  },
  quickWinLabel: {
    fontFamily: FONTS.mono,
    fontSize: 7,
    letterSpacing: 1.5,
    color: COLORS.F,
    textTransform: "uppercase",
    marginBottom: 4,
  },
  quickWinText: {
    fontFamily: FONTS.body,
    fontSize: 9,
    color: COLORS.textSecondary,
    lineHeight: 1.5,
  },

  /* ── 3-step diagnostic ── */
  stepCard: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 14,
  },
  stepNum: {
    fontFamily: FONTS.mono,
    fontSize: 20,
    fontWeight: 700,
    color: COLORS.I,
    width: 32,
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontFamily: FONTS.body,
    fontSize: 11,
    fontWeight: 700,
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  stepBody: {
    fontFamily: FONTS.body,
    fontSize: 9.5,
    color: COLORS.textSecondary,
    lineHeight: 1.55,
  },

  /* ── Before/After example ── */
  exampleRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: SPACING.sectionGap,
  },
  exampleCard: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 6,
    padding: 14,
  },
  exampleLabel: {
    fontFamily: FONTS.mono,
    fontSize: 9,
    letterSpacing: 2,
    textTransform: "uppercase",
    marginBottom: 8,
  },
  exampleEq: {
    fontFamily: FONTS.mono,
    fontSize: 13,
    fontWeight: 700,
    marginBottom: 4,
  },
  exampleZone: {
    fontFamily: FONTS.mono,
    fontSize: 8,
    letterSpacing: 1,
    textTransform: "uppercase",
    marginBottom: 6,
  },
  exampleSteps: {
    fontFamily: FONTS.body,
    fontSize: 8.5,
    color: COLORS.textSecondary,
    lineHeight: 1.5,
    marginBottom: 2,
  },
  liftBox: {
    backgroundColor: COLORS.darkBg,
    padding: 12,
    borderRadius: 4,
    alignItems: "center",
  },
  liftText: {
    fontFamily: FONTS.body,
    fontSize: 11,
    fontWeight: 700,
    color: COLORS.textOnDark,
    textAlign: "center",
  },

  /* ── Closer ── */
  closerCard: {
    backgroundColor: COLORS.cardBg,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    padding: 18,
    borderRadius: 6,
    marginBottom: SPACING.sectionGap,
  },
  closerLine1: {
    fontFamily: FONTS.heading,
    fontSize: 16,
    fontWeight: 700,
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  closerBody: {
    fontFamily: FONTS.body,
    fontSize: 10,
    color: COLORS.textSecondary,
    lineHeight: 1.6,
    marginBottom: 8,
  },
  closerFinal: {
    fontFamily: FONTS.body,
    fontSize: 10.5,
    fontWeight: 700,
    color: COLORS.textPrimary,
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

/* ── Channel diagnostic data (hardcoded from ro.ts) ── */
const channels = [
  {
    key: "website",
    name: "Website / Landing Page",
    icon: "WEB",
    summary: "Cea mai testabil\u0103 form\u0103 de marketing. Fiecare element e m\u0103surabil: bounce, time on page, speed, conversion.",
    benchmark: "C >= 70 pentru landing pages performante",
    benchmarkValue: 70,
    metrics: [
      { label: "Bounce Rate", indicator: "R" },
      { label: "Time on Page", indicator: "I" },
      { label: "Page Speed", indicator: "F" },
      { label: "Conversion Rate", indicator: "C" },
    ],
    r: { desc: "URL-ul corespunde cu inten\u021bia de c\u0103utare a vizitatorului.", question: "Dac\u0103 cineva ajunge pe pagin\u0103 din Google, caut\u0103 exact ce oferi?", redFlag: "Bounce rate peste 60% = R sub 5" },
    i: { desc: "Headline-ul comunic\u0103 beneficiul principal \u00een sub 5 secunde.", question: "Po\u021bi articula UVP-ul paginii \u00een 10 cuvinte?", redFlag: "Time on page sub 15 sec = I sub 5" },
    f: { desc: "Layout scanabil, CTA unic \u0219i contrastant, white space, responsive, speed sub 3s.", question: "Site-ul se \u00eencarc\u0103 sub 3 secunde pe mobil?", redFlag: "Page speed peste 4s = F sub 5" },
    c: { desc: "Vizitatorul \u00een\u021belege exact cine e\u0219ti, ce oferi \u0219i ce trebuie s\u0103 fac\u0103.", question: "Testul de 5 sec: un str\u0103in poate spune ce vinzi?", redFlag: "Conversion rate sub 1% = C sub 50" },
    tip: "Quick Win: Testeaz\u0103 un singur CTA (elimin\u0103 restul) + headline cu beneficiu concret. Cele mai rapide +10 puncte la F \u0219i I.",
  },
  {
    key: "social",
    name: "Social Media",
    icon: "SOC",
    summary: "Formatul se schimb\u0103 la fiecare update de algoritm. Ce func\u021biona acum 6 luni poate fi invizibil azi.",
    benchmark: "C >= 60 pentru social media organic",
    benchmarkValue: 60,
    metrics: [
      { label: "Follower Match", indicator: "R" },
      { label: "Hook / Scroll Stop", indicator: "I" },
      { label: "Format Nativ", indicator: "F" },
      { label: "Engagement Rate", indicator: "C" },
    ],
    r: { desc: "Postezi pe platforma unde audien\u021ba ta petrece timp.", question: "Profilul ideal de follower corespunde cu ICP-ul t\u0103u de plat\u0103?", redFlag: "Follower growth dar zero DM-uri = R sub 5" },
    i: { desc: "Hook-ul din primele 3 cuvinte/secunde opre\u0219te scroll-ul.", question: "Primele 3 secunde din post/reel creeaz\u0103 o \u00eentrebare la care publicul vrea r\u0103spuns?", redFlag: "Reach mare dar saves/shares sub 1% = I sub 5" },
    f: { desc: "Format nativ platformei (Reels pe IG, carousel pe LinkedIn).", question: "Folose\u0219ti formatul cu cel mai mare engagement pe platforma aleas\u0103?", redFlag: "Engagement rate sub media platformei = F sub 5" },
    c: { desc: "Follower-ul \u0219tie exact ce oferi, cum \u00eel aju\u021bi \u0219i ce pas urm\u0103tor s\u0103 fac\u0103.", question: "Bio-ul + ultimele 9 posturi comunic\u0103 un mesaj consistent?", redFlag: "Mul\u021bi followers dar zero conversii = C sub 50" },
    tip: "\u00cenlocuie\u0219te primele 3 secunde din Reel cu un hook-\u00eentrebare. Engagement cre\u0219te cu 40-60% \u00een medie.",
  },
  {
    key: "email",
    name: "Email Marketing",
    icon: "EML",
    summary: "Cel mai mare ROI din digital ($36 per $1). Dar doar dac\u0103 lista e segmentat\u0103 \u0219i con\u021binutul e relevant.",
    benchmark: "C >= 75 pentru email marketing",
    benchmarkValue: 75,
    metrics: [
      { label: "Open Rate", indicator: "R" },
      { label: "Subject + Preview", indicator: "I" },
      { label: "Mobile Design", indicator: "F" },
      { label: "Click-Through Rate", indicator: "C" },
    ],
    r: { desc: "Lista e segmentat\u0103 pe interese/comportament.", question: "Segmentezi lista sau trimi\u021bi acela\u0219i email la to\u021bi?", redFlag: "Open rate sub 15% = R sub 5" },
    i: { desc: "Subject line-ul creeaz\u0103 curiozitate autentic\u0103.", question: "Subject line-ul t\u0103u ar func\u021biona ca headline de articol?", redFlag: "Open rate OK dar CTR sub 2% = I sub 5" },
    f: { desc: "Design curat, mobile-first, un singur CTA, text scanabil.", question: "Email-ul arat\u0103 bine pe telefon f\u0103r\u0103 a da scroll excesiv?", redFlag: "Click-to-open rate sub 10% = F sub 5" },
    c: { desc: "Recipientul \u0219tie instant ce prime\u0219te, de ce \u00eei e util \u0219i ce trebuie s\u0103 fac\u0103.", question: "Dac\u0103 cineva cite\u0219te doar subject + prima propozi\u021bie, \u00een\u021belege oferta?", redFlag: "Unsubscribe rate peste 0.5% per email = C sub 50" },
    tip: "Segmenteaz\u0103 lista \u00een 3 (cold/warm/hot) \u0219i trimite mesaje diferite. Open rate cre\u0219te cu 30%+ instant.",
  },
  {
    key: "paid_ads",
    name: "Paid Ads (Google / Meta / LinkedIn)",
    icon: "ADS",
    summary: "Buget ars sau buget multiplicat \u2014 diferen\u021ba e \u00een targetare (R) \u0219i message match (C).",
    benchmark: "C >= 65 pentru paid ads",
    benchmarkValue: 65,
    metrics: [
      { label: "Targeting Precision", indicator: "R" },
      { label: "Ad Copy Impact", indicator: "I" },
      { label: "Creative + LP Match", indicator: "F" },
      { label: "Conversion Rate", indicator: "C" },
    ],
    r: { desc: "Targetarea e precis\u0103: keywords cu inten\u021bie comercial\u0103, audien\u021be lookalike validate.", question: "Ai negative keywords / exclusion lists actualizate?", redFlag: "CTR sub 1% pe Google Search = R sub 5" },
    i: { desc: "Ad copy-ul comunic\u0103 beneficiul #1 \u0219i diferen\u021biatorul \u00een headline.", question: "Headline-ul ad-ului func\u021bioneaz\u0103 \u0219i f\u0103r\u0103 imagine/video?", redFlag: "CTR peste medie dar conversion rate sub 2% = I sub 5" },
    f: { desc: "Format potrivit obiectivului. Landing page aliniat cu ad-ul.", question: "Landing page-ul promite EXACT ce promite ad-ul?", redFlag: "Quality Score sub 6 (Google) = F sub 5" },
    c: { desc: "De la ad -> click -> landing page -> CTA, utilizatorul nu are nicio confuzie.", question: "Bounce rate pe landing page din ad e sub 40%?", redFlag: "CPA de 3x+ peste medie = C sub 50" },
    tip: "Adaug\u0103 50+ negative keywords \u0219i excluderi de audien\u021b\u0103. Economise\u0219ti 20-40% din buget f\u0103r\u0103 a pierde conversii.",
  },
];

function ChannelDiagnostic({
  ch,
}: {
  ch: typeof channels[number];
}) {
  const varColor = (v: string) =>
    v === "R" ? COLORS.R : v === "I" ? COLORS.I : v === "F" ? COLORS.F : COLORS.C;

  return (
    <View style={s.channelCard}>
      <View style={s.channelHeader}>
        <View style={s.channelIcon}>
          <Text style={s.channelIconText}>{ch.icon}</Text>
        </View>
        <Text style={s.channelName}>{ch.name}</Text>
        <Text style={s.channelBenchmark}>{ch.benchmark}</Text>
      </View>

      {/* R, I, F, C diagnostic */}
      <View style={s.varDiagRow}>
        {(["r", "i", "f", "c"] as const).map((v) => {
          const data = ch[v];
          const letter = v.toUpperCase();
          const color = varColor(letter);
          return (
            <View key={v} style={[s.varDiagCard, { borderColor: color }]}>
              <Text style={[s.varDiagLetter, { color }]}>{letter}</Text>
              <Text style={s.varDiagDesc}>{data.desc}</Text>
              <Text style={s.varDiagQuestion}>{data.question}</Text>
              <Text style={s.varDiagRedFlag}>{data.redFlag}</Text>
            </View>
          );
        })}
      </View>

      {/* Summary + benchmark */}
      <View style={s.summaryBox}>
        <Text style={s.summaryText}>{ch.summary}</Text>
        <View style={s.benchmarkRow}>
          <View style={s.benchmarkBar}>
            <View
              style={{
                width: `${ch.benchmarkValue}%`,
                height: "100%",
                backgroundColor: COLORS.C,
                borderRadius: 4,
              }}
            />
          </View>
          <Text style={s.benchmarkLabel}>{ch.benchmark}</Text>
        </View>
      </View>

      {/* Key metrics */}
      <View style={s.metricsRow}>
        {ch.metrics.map((m, i) => (
          <View key={i} style={s.metricTag}>
            <Text style={s.metricText}>
              {m.label}{" "}
              <Text style={[s.metricIndicator, { color: varColor(m.indicator) }]}>
                {m.indicator}
              </Text>
            </Text>
          </View>
        ))}
      </View>

      {/* Quick win */}
      <View style={s.quickWinBox}>
        <Text style={s.quickWinLabel}>QUICK WIN</Text>
        <Text style={s.quickWinText}>{ch.tip}</Text>
      </View>
    </View>
  );
}

export function Ch06Omnichannel() {
  return (
    <>
      {/* ═══════ PAGE 1 — Chapter opener (dark) ═══════ */}
      <Page size={PAGE_SIZE} style={s.openerPage}>
        <View>
          <Text style={s.chapterNum}>{CHAPTER}</Text>
          <Text style={s.chapterTitle}>Diagnostic</Text>
          <Text style={s.chapterTitleLight}>Omnichannel</Text>
          <View style={{ width: 40, height: 1, backgroundColor: COLORS.I, marginBottom: 16 }} />
          <Text style={s.chapterDesc}>
            {"Aceea\u0219i campanie poate avea C = 85 pe Email \u0219i C = 30 pe Instagram. Ecua\u021bia R IF C func\u021bioneaz\u0103 identic pe toate canalele \u2014 dar valorile R, I \u0219i F se schimb\u0103 dramatic de la un canal la altul."}
          </Text>
        </View>
      </Page>

      {/* ═══════ PAGE 2 — Intro shock + diagnostic overview ═══════ */}
      <PageShell chapterLabel={CHAPTER}>
        <View style={s.shockBox}>
          <Text style={s.shockText}>
            {"Aceea\u0219i campanie poate avea C = 85 pe Email \u0219i C = 30 pe Instagram."}
          </Text>
        </View>

        <Text style={s.body}>
          {"Ecua\u021bia R IF C func\u021bioneaz\u0103 identic pe toate canalele \u2014 dar valorile R, I \u0219i F se schimb\u0103 dramatic de la un canal la altul. Un mesaj perfect pe LinkedIn poate fi invizibil pe TikTok. Un email genial poate fi dezastru ca landing page."}
        </Text>

        <Text style={s.bodyBold}>
          {"Selecteaz\u0103 canalul. Diagnosticheaz\u0103 scorul. Descoper\u0103 unde pierzi bani."}
        </Text>

        {/* 3-Step diagnostic */}
        <Text style={[s.h2, { marginTop: SPACING.sectionGap }]}>
          {"Diagnostic Universal: 3 Pa\u0219i"}
        </Text>

        <View style={s.stepCard}>
          <Text style={s.stepNum}>01</Text>
          <View style={s.stepContent}>
            <Text style={s.stepTitle}>{"G\u0103se\u0219te veriga slab\u0103"}</Text>
            <Text style={s.stepBody}>
              {"Nu repara totul simultan. Scoreaz\u0103 R, I \u0219i F de la 1 la 10. Variabila cu nota cea mai mic\u0103 = punctul t\u0103u de p\u00e2rghie maxim\u0103. O singur\u0103 variabil\u0103 \u00eembun\u0103t\u0103\u021bit\u0103 cu 2-3 puncte poate urca C cu 20-30%."}
            </Text>
          </View>
        </View>

        <View style={s.stepCard}>
          <Text style={s.stepNum}>02</Text>
          <View style={s.stepContent}>
            <Text style={s.stepTitle}>{"Respect\u0103 Ierarhia de Fier: R \u2192 I \u2192 F"}</Text>
            <Text style={s.stepBody}>
              {"R < 3? STOP. Nu investi un euro \u00een I sau F. R \u2265 3, dar I slab? Rescrie mesajul. R solid, I solid, F slab? ACUM investe\u0219te \u00een design. F f\u0103r\u0103 I = Zgomot Estetic. I f\u0103r\u0103 R = Camer\u0103 goal\u0103."}
            </Text>
          </View>
        </View>

        <View style={s.stepCard}>
          <Text style={s.stepNum}>03</Text>
          <View style={s.stepContent}>
            <Text style={s.stepTitle}>{"Re-scoreaz\u0103. Repet\u0103. Scaleaz\u0103."}</Text>
            <Text style={s.stepBody}>
              {"Dup\u0103 fiecare optimizare, recalculeaz\u0103 C. Obiectivul: C \u2265 80 pe fiecare canal activ. Sub 80 = \u00eenc\u0103 pierzi bani. Peste 80 = zona brandurilor cult."}
            </Text>
          </View>
        </View>
      </PageShell>

      {/* ═══════ PAGE 3 — Website channel ═══════ */}
      <PageShell chapterLabel={CHAPTER}>
        <ChannelDiagnostic ch={channels[0]} />
      </PageShell>

      {/* ═══════ PAGE 4 — Social Media channel ═══════ */}
      <PageShell chapterLabel={CHAPTER}>
        <ChannelDiagnostic ch={channels[1]} />
      </PageShell>

      {/* ═══════ PAGE 5 — Email channel ═══════ */}
      <PageShell chapterLabel={CHAPTER}>
        <ChannelDiagnostic ch={channels[2]} />
      </PageShell>

      {/* ═══════ PAGE 6 — Paid Ads channel + Before/After ═══════ */}
      <PageShell chapterLabel={CHAPTER}>
        <ChannelDiagnostic ch={channels[3]} />
      </PageShell>

      {/* ═══════ PAGE 7 — Before/After example + Closer + Transition ═══════ */}
      <PageShell chapterLabel={CHAPTER}>
        <Text style={s.h2}>{"EXEMPLU: Procesul \u00een ac\u021biune"}</Text>

        <View style={s.exampleRow}>
          {/* Before */}
          <View style={[s.exampleCard, { borderColor: COLORS.R, backgroundColor: "#FEF2F2" }]}>
            <Text style={[s.exampleLabel, { color: COLORS.R }]}>{"\u00ceNAINTE"}</Text>
            <Text style={[s.exampleEq, { color: COLORS.R }]}>{"C = 7 + (4 \u00d7 8) = 39"}</Text>
            <Text style={[s.exampleZone, { color: COLORS.R }]}>ZGOMOT DE FOND</Text>
            <Text style={s.exampleSteps}>{"Pas 1: I = 4 e cel mai mic \u2192 focuseaz\u0103 pe I"}</Text>
            <Text style={s.exampleSteps}>{"Pas 2: R = 7 \u2265 3 OK, I slab \u2192 rescrie UVP-ul"}</Text>
            <Text style={s.exampleSteps}>{"Pas 3: Re-scoreaz\u0103 \u2192 I devine 8"}</Text>
          </View>

          {/* After */}
          <View style={[s.exampleCard, { borderColor: COLORS.C, backgroundColor: "#F0FDF4" }]}>
            <Text style={[s.exampleLabel, { color: COLORS.C }]}>{"DUP\u0102"}</Text>
            <Text style={[s.exampleEq, { color: COLORS.C }]}>{"C = 7 + (8 \u00d7 8) = 71"}</Text>
            <Text style={[s.exampleZone, { color: COLORS.C }]}>CLARITATE MEDIE</Text>
          </View>
        </View>

        <View style={s.liftBox}>
          <Text style={s.liftText}>
            {"+82% Claritate. Aceea\u0219i campanie. O singur\u0103 variabil\u0103."}
          </Text>
        </View>

        {/* Micro-closer */}
        <View style={[s.closerCard, { marginTop: SPACING.sectionGap }]}>
          <Text style={s.closerLine1}>{"Claritatea nu e un talent. E o decizie."}</Text>
          <Text style={s.closerBody}>
            {"Dac\u0103 o campanie nu merge, nu \u00eenseamn\u0103 c\u0103 \u201emarketingul nu func\u021bioneaz\u0103\u201d \u2014 \u00eenseamn\u0103 c\u0103 una dintre cele 3 piese este defect\u0103."}
          </Text>
          <Text style={s.closerFinal}>
            {"R IF C \u00ee\u021bi d\u0103 instrumentul de diagnostic. Tu decizi dac\u0103 \u00eel folose\u0219ti."}
          </Text>
        </View>

        {/* Transition */}
        <View style={s.transitionBox}>
          <Text style={s.transitionText}>
            {"Ai diagnosticat canalele. Acum hai s\u0103 vedem"}
          </Text>
          <Text style={s.transitionText}>
            {"ce se \u00eent\u00e2mpl\u0103 c\u00e2nd ecua\u021bia e\u0219ueaz\u0103 complet."}
          </Text>
          <Text style={s.transitionCta}>
            {"Capitolul 07: Arhetipuri de E\u0219ec \u2192"}
          </Text>
        </View>
      </PageShell>
    </>
  );
}

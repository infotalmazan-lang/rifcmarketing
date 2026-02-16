/* ─── Author Page + Resources + Back Cover ─── */

import React from "react";
import { Page, View, Text, StyleSheet, Svg, Rect } from "@react-pdf/renderer";
import { COLORS, FONTS, SPACING, PAGE_SIZE } from "../theme";
import { PageShell } from "../components/PageShell";
import { QuoteBlock } from "../components/QuoteBlock";

/* ─── Data ─── */

const PILLARS = [
  {
    id: "philosophy",
    label: "FILOZOFIA",
    quote: "\u201eMarketingul nu este magie, ci o disciplin\u0103 a Clarit\u0103\u021bii.\u201d",
    body: "R IF C s-a n\u0103scut ca reac\u021bie la \u201ezgomotul scump\u201d \u2014 bugete arse pe intui\u021bii, nu pe cifre. Campanii lansate \u201ela noroc\u201d. Echipe care dezbat gusturi \u00een loc s\u0103 citeasc\u0103 metrici.",
    highlight: "Am creat un sistem care elimin\u0103 subiectivitatea \u0219i \u00eenlocuie\u0219te \u201ecred c\u0103\u201d cu \u201escorul este\u201d.",
    color: "#DC2626",
  },
  {
    id: "expertise",
    label: "EXPERTIZA",
    body: "Mentor \u0219i creator de sisteme, activ\u00e2nd la intersec\u021bia dintre strategia digital\u0103, psihologia aplicat\u0103 \u0219i stoicismul de business. Fondator CONTINUUM GRUP \u2014 ecosistem de preservare a memoriei. Fondator Talmazan School \u2014 mentorat \u0219i consultan\u021b\u0103 de business.",
    highlight: "R IF C este motorul de diagnostic din spatele fiec\u0103rei campanii pe care o construiesc.",
    color: "#2563EB",
  },
  {
    id: "mission",
    label: "MISIUNEA",
    body: "R IF C este manifestul pentru afacerile care aleg rela\u021bia \u00een locul tranzac\u021biei \u0219i valoarea \u00een locul manipul\u0103rii. Mesajul clar nu vinde \u2014 serve\u0219te. Iar clientul care se simte servit, nu manipulat, revine \u0219i aduce al\u021bii.",
    highlight: "S\u0103 redau respectul fa\u021b\u0103 de client.",
    color: "#059669",
  },
];

const RESOURCES = [
  { title: "White Paper (Codul Surs\u0103)", desc: "Protocolul R IF C complet: filozofie, metodologie, scoring, ghid de implementare + exemple de diagnostic din industrii reale.", status: "available" },
  { title: "\u0218ablon de Scoring", desc: "Google Sheets / Excel cu calcul automat al scorului C, Poarta Relevan\u021bei, dashboard per campanie.", status: "coming_soon" },
  { title: "Card de Diagnostic Rapid", desc: "One-pager printabil: ecua\u021bia, defini\u021biile variabilelor, scala de scoring, checklist-ul cu 4 \u00eentreb\u0103ri.", status: "coming_soon" },
  { title: "Lucrare \u0218tiin\u021bific\u0103", desc: "Publica\u021bie academic\u0103 peer-reviewed cu validare empiric\u0103 \u0219i analiz\u0103 comparativ\u0103.", status: "in_development" },
];

/* ─── Styles ─── */

const s = StyleSheet.create({
  /* Author page */
  authorLabel: {
    fontFamily: FONTS.mono,
    fontSize: 10,
    letterSpacing: 3,
    textTransform: "uppercase",
    color: COLORS.textMuted,
    marginBottom: 6,
  },
  authorNameRow: {
    marginBottom: 4,
  },
  authorName: {
    fontFamily: FONTS.heading,
    fontSize: 28,
    color: COLORS.textPrimary,
    lineHeight: 1.2,
  },
  authorNameBold: {
    fontFamily: FONTS.heading,
    fontSize: 28,
    fontWeight: 700,
    color: COLORS.textPrimary,
    lineHeight: 1.2,
  },
  authorSubtitle: {
    fontFamily: FONTS.body,
    fontSize: 12,
    color: COLORS.textMuted,
    marginBottom: SPACING.sectionGap,
  },

  /* Pillar cards */
  pillarCard: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    padding: 14,
    marginBottom: 10,
  },
  pillarTopBorder: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
  },
  pillarLabel: {
    fontFamily: FONTS.mono,
    fontSize: 9,
    letterSpacing: 2,
    textTransform: "uppercase",
    marginBottom: 4,
  },
  pillarQuote: {
    fontFamily: FONTS.heading,
    fontSize: 12,
    fontStyle: "italic",
    color: COLORS.textPrimary,
    marginBottom: 6,
  },
  pillarBody: {
    fontFamily: FONTS.body,
    fontSize: 10,
    color: COLORS.textSecondary,
    lineHeight: 1.6,
    marginBottom: 6,
  },
  pillarHighlight: {
    fontFamily: FONTS.body,
    fontSize: 10,
    fontWeight: 700,
    color: COLORS.textPrimary,
    lineHeight: 1.6,
  },

  /* Personal */
  personalBody: {
    fontFamily: FONTS.body,
    fontSize: 10.5,
    color: COLORS.textSecondary,
    lineHeight: 1.7,
    marginBottom: 6,
  },
  personalHighlight: {
    fontFamily: FONTS.mono,
    fontSize: 10,
    fontWeight: 700,
    color: COLORS.C,
    marginBottom: 3,
  },

  /* Stats line */
  statsLine: {
    fontFamily: FONTS.mono,
    fontSize: 9,
    color: COLORS.textMuted,
    marginTop: 10,
    marginBottom: SPACING.sectionGap,
  },

  /* Entities */
  entityRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: SPACING.sectionGap,
  },
  entityBox: {
    width: "48%",
    backgroundColor: COLORS.cardBg,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    padding: 12,
  },
  entityName: {
    fontFamily: FONTS.mono,
    fontSize: 10,
    fontWeight: 700,
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  entityDesc: {
    fontFamily: FONTS.body,
    fontSize: 9,
    color: COLORS.textMuted,
    lineHeight: 1.5,
  },
  entityFounder: {
    fontFamily: FONTS.mono,
    fontSize: 8,
    color: COLORS.C,
    letterSpacing: 1,
    textTransform: "uppercase",
    marginBottom: 4,
  },

  /* Resources */
  resCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: COLORS.cardBg,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    padding: 12,
    marginBottom: 8,
  },
  resContent: {
    flex: 1,
    marginRight: 10,
  },
  resTitle: {
    fontFamily: FONTS.body,
    fontSize: 11,
    fontWeight: 700,
    color: COLORS.textPrimary,
    marginBottom: 3,
  },
  resDesc: {
    fontFamily: FONTS.body,
    fontSize: 9,
    color: COLORS.textSecondary,
    lineHeight: 1.5,
  },
  resBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  resBadgeText: {
    fontFamily: FONTS.mono,
    fontSize: 8,
    color: "#FFFFFF",
  },

  /* Back cover */
  backPage: {
    backgroundColor: COLORS.darkBg,
    paddingHorizontal: SPACING.pageMarginH,
    paddingVertical: 0,
    justifyContent: "space-between",
    alignItems: "center",
  },
  backTop: {
    width: "100%",
    marginTop: 0,
  },
  backCenter: {
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 30,
  },
  backFormulaRow: {
    flexDirection: "row",
    alignItems: "baseline",
    marginBottom: 28,
  },
  backFormulaLetter: {
    fontFamily: FONTS.mono,
    fontSize: 52,
    fontWeight: 700,
  },
  backFormulaOp: {
    fontFamily: FONTS.mono,
    fontSize: 40,
    color: COLORS.textOnDarkMuted,
    marginHorizontal: 6,
  },
  backFormulaSmall: {
    fontFamily: FONTS.mono,
    fontSize: 28,
    color: COLORS.textOnDarkMuted,
  },
  backQuoteText: {
    fontFamily: FONTS.heading,
    fontSize: 18,
    fontStyle: "italic",
    color: COLORS.textOnDark,
    textAlign: "center",
    lineHeight: 1.5,
    marginBottom: 8,
  },
  backQuoteAuthor: {
    fontFamily: FONTS.mono,
    fontSize: 10,
    color: COLORS.textOnDarkMuted,
    letterSpacing: 1,
    marginBottom: 30,
  },
  backDivider: {
    width: 40,
    height: 1,
    backgroundColor: COLORS.textOnDarkMuted,
    marginBottom: 20,
  },
  backBottom: {
    alignItems: "center",
    marginBottom: SPACING.pageMarginV,
  },
  backSite: {
    fontFamily: FONTS.mono,
    fontSize: 11,
    color: COLORS.textOnDarkSecondary,
    letterSpacing: 2,
    marginBottom: 6,
  },
  backCopyright: {
    fontFamily: FONTS.mono,
    fontSize: 8,
    color: COLORS.textOnDarkMuted,
    letterSpacing: 1,
    textAlign: "center",
  },
});

/* ─── Component ─── */

export function AuthorBackCover() {
  return (
    <>
      {/* Page 1: Author — Despre Autor */}
      <PageShell chapterLabel="Despre Autor">
        <Text style={s.authorLabel}>ARHITECTUL PROTOCOLULUI</Text>
        <View style={s.authorNameRow}>
          <Text style={s.authorName}>Dumitru</Text>
        </View>
        <View style={s.authorNameRow}>
          <Text style={s.authorNameBold}>Talmazan</Text>
        </View>
        <Text style={s.authorSubtitle}>
          Antidotul la haosul marketingului modern.
        </Text>

        {/* 3 Pillars */}
        {PILLARS.map((p) => (
          <View key={p.id} style={s.pillarCard}>
            <View style={[s.pillarTopBorder, { backgroundColor: p.color }]} />
            <Text style={[s.pillarLabel, { color: p.color }]}>{p.label}</Text>
            {p.quote && <Text style={s.pillarQuote}>{p.quote}</Text>}
            <Text style={s.pillarBody}>{p.body}</Text>
            <Text style={s.pillarHighlight}>{p.highlight}</Text>
          </View>
        ))}
      </PageShell>

      {/* Page 2: Personal + Entities + Signature */}
      <PageShell chapterLabel="Despre Autor">
        <Text style={s.personalBody}>
          Ca tat\u0103 de gemeni \u0219i antreprenor, \u0219tiu c\u0103 timpul este singura resurs\u0103 care nu poate fi recuperat\u0103. De aceea am proiectat R IF C s\u0103 ofere un verdict \u00een secunde, nu \u00een zile de analize subiective.
        </Text>
        <Text style={s.personalHighlight}>
          15 minute de protocol. 30 de secunde cu AI.
        </Text>
        <Text style={s.personalHighlight}>
          Un obicei care salveaz\u0103 mii de euro \u0219i sute de ore.
        </Text>

        {/* Entities */}
        <View style={s.entityRow}>
          <View style={s.entityBox}>
            <Text style={s.entityFounder}>Fondator</Text>
            <Text style={s.entityName}>CONTINUUM GRUP</Text>
            <Text style={s.entityDesc}>
              Ecosistem de preservare a memoriei
            </Text>
          </View>
          <View style={s.entityBox}>
            <Text style={s.entityFounder}>Fondator</Text>
            <Text style={s.entityName}>Talmazan School</Text>
            <Text style={s.entityDesc}>
              Mentorat \u0219i consultan\u021b\u0103 de business
            </Text>
          </View>
        </View>

        <Text style={s.statsLine}>
          3 ani de dezvoltare {"\u00B7"} 1.960+ studen\u021bi {"\u00B7"} 60+ institu\u021bii {"\u00B7"} 52K EUR revenue validat
        </Text>

        {/* Signature quote */}
        <QuoteBlock
          text={"S\u0103 restaur\u0103m respectul fa\u021b\u0103 de client\nprin mesaje care livreaz\u0103 valoare\n\u00eenainte de a cere bani."}
          attribution="\u2014 Dumitru Talmazan"
          color={COLORS.R}
        />
      </PageShell>

      {/* Page 3: Resources */}
      <PageShell chapterLabel="Resurse">
        <Text
          style={{
            fontFamily: FONTS.heading,
            fontSize: 22,
            color: COLORS.textPrimary,
            marginBottom: 6,
          }}
        >
          Resurse
        </Text>
        <Text
          style={{
            fontFamily: FONTS.body,
            fontSize: 11,
            color: COLORS.textMuted,
            marginBottom: SPACING.sectionGap,
          }}
        >
          Tot ce ai nevoie pentru a implementa R IF C \u00een opera\u021biunile tale de marketing.
        </Text>

        {RESOURCES.map((r, idx) => {
          const badgeColor =
            r.status === "available"
              ? COLORS.C
              : r.status === "coming_soon"
              ? COLORS.F
              : COLORS.textMuted;
          const badgeLabel =
            r.status === "available"
              ? "Disponibil"
              : r.status === "coming_soon"
              ? "\u00cen Cur\u00e2nd"
              : "\u00cen Dezvoltare";
          return (
            <View key={idx} style={s.resCard}>
              <View style={s.resContent}>
                <Text style={s.resTitle}>{r.title}</Text>
                <Text style={s.resDesc}>{r.desc}</Text>
              </View>
              <View style={[s.resBadge, { backgroundColor: badgeColor }]}>
                <Text style={s.resBadgeText}>{badgeLabel}</Text>
              </View>
            </View>
          );
        })}
      </PageShell>

      {/* Page 4: Back Cover — dark */}
      <Page size={PAGE_SIZE} style={s.backPage}>
        {/* Top accent bar */}
        <View style={s.backTop}>
          <Svg width="100%" height={3}>
            <Rect x={0} y={0} width="999" height={3} fill={COLORS.R} />
          </Svg>
        </View>

        {/* Center content */}
        <View style={s.backCenter}>
          {/* Formula: C = R + (I x F) */}
          <View style={s.backFormulaRow}>
            <Text style={[s.backFormulaLetter, { color: COLORS.C }]}>C</Text>
            <Text style={s.backFormulaOp}>=</Text>
            <Text style={[s.backFormulaLetter, { color: COLORS.R }]}>R</Text>
            <Text style={s.backFormulaOp}>+</Text>
            <Text style={s.backFormulaSmall}>(</Text>
            <Text style={[s.backFormulaLetter, { color: COLORS.I }]}>I</Text>
            <Text style={s.backFormulaOp}>{"\u00D7"}</Text>
            <Text style={[s.backFormulaLetter, { color: COLORS.F }]}>F</Text>
            <Text style={s.backFormulaSmall}>)</Text>
          </View>

          {/* Signature quote */}
          <Text style={s.backQuoteText}>
            {"\u201e"}S\u0103 restaur\u0103m respectul fa\u021b\u0103 de client{"\n"}
            prin mesaje care livreaz\u0103 valoare{"\n"}
            \u00eenainte de a cere bani.{"\u201d"}
          </Text>
          <Text style={s.backQuoteAuthor}>\u2014 Dumitru Talmazan</Text>

          {/* Divider */}
          <View style={s.backDivider} />
        </View>

        {/* Bottom */}
        <View style={s.backBottom}>
          <Text style={s.backSite}>rifcmarketing.com</Text>
          <Text style={s.backCopyright}>
            {"\u00A9"} DUMITRU TALMAZAN. TOATE DREPTURILE REZERVATE. PROTOCOLUL R IF C{"\u2122"}.
          </Text>
        </View>
      </Page>
    </>
  );
}

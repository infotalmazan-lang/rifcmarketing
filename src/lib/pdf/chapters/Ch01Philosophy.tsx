/* ─── Chapter 01 — Filozofia: Noua Paradigm\u0103. Claritatea ca Motor al Ac\u021biunii. ─── */

import React from "react";
import { Page, View, Text, StyleSheet, Svg, Rect, Line } from "@react-pdf/renderer";
import { COLORS, FONTS, SPACING, PAGE_SIZE } from "../theme";
import { PageShell } from "../components/PageShell";

const CHAPTER = "Capitolul 01";

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
    fontSize: 17,
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
  hook: {
    fontFamily: FONTS.heading,
    fontSize: 16,
    fontWeight: 700,
    color: COLORS.R,
    lineHeight: 1.4,
    marginBottom: SPACING.sectionGap,
    textAlign: "center",
  },

  /* ── Principle card ── */
  principleCard: {
    backgroundColor: COLORS.darkBg,
    padding: 24,
    borderRadius: 6,
    marginTop: SPACING.sectionGap,
    alignItems: "center",
  },
  principleLabel: {
    fontFamily: FONTS.mono,
    fontSize: 8,
    letterSpacing: 3,
    color: COLORS.R,
    marginBottom: 14,
    textTransform: "uppercase",
  },
  principleQuote: {
    fontFamily: FONTS.heading,
    fontSize: 18,
    fontWeight: 700,
    color: COLORS.textOnDark,
    textAlign: "center",
    lineHeight: 1.45,
    marginBottom: 12,
  },
  principleSub: {
    fontFamily: FONTS.body,
    fontSize: 10,
    color: COLORS.textOnDarkSecondary,
    textAlign: "center",
    lineHeight: 1.55,
  },

  /* ── Pillar card ── */
  pillarCard: {
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    borderRadius: 6,
    padding: 18,
    marginBottom: 16,
  },
  pillarLabel: {
    fontFamily: FONTS.mono,
    fontSize: 9,
    letterSpacing: 2,
    textTransform: "uppercase",
    marginBottom: 10,
  },
  pillarStatement: {
    fontFamily: FONTS.heading,
    fontSize: 13,
    fontWeight: 700,
    color: COLORS.textPrimary,
    lineHeight: 1.35,
    marginBottom: 10,
  },
  pillarMeaningTitle: {
    fontFamily: FONTS.body,
    fontSize: 9,
    fontWeight: 700,
    color: COLORS.textSecondary,
    letterSpacing: 1,
    textTransform: "uppercase",
    marginBottom: 4,
  },
  pillarMeaning: {
    fontFamily: FONTS.body,
    fontSize: 10,
    color: COLORS.textSecondary,
    lineHeight: 1.6,
    marginBottom: 10,
  },
  consequenceBox: {
    backgroundColor: COLORS.cardBg,
    padding: 10,
    borderRadius: 4,
    marginTop: 4,
  },
  consequenceLabel: {
    fontFamily: FONTS.mono,
    fontSize: 8,
    letterSpacing: 2,
    marginBottom: 6,
    textTransform: "uppercase",
  },
  consequenceLine: {
    fontFamily: FONTS.body,
    fontSize: 10,
    color: COLORS.textPrimary,
    lineHeight: 1.55,
  },

  /* ── Before / After comparison ── */
  comparisonRow: {
    flexDirection: "row",
    gap: 16,
    marginBottom: SPACING.sectionGap,
  },
  compCard: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 6,
    padding: 16,
  },
  compBefore: {
    borderColor: COLORS.R,
    backgroundColor: "#FEF2F2",
  },
  compAfter: {
    borderColor: COLORS.C,
    backgroundColor: "#F0FDF4",
  },
  compLabel: {
    fontFamily: FONTS.mono,
    fontSize: 9,
    letterSpacing: 2,
    textTransform: "uppercase",
    marginBottom: 6,
  },
  compFramework: {
    fontFamily: FONTS.heading,
    fontSize: 15,
    fontWeight: 700,
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  compMetaphor: {
    fontFamily: FONTS.body,
    fontSize: 10,
    fontWeight: 700,
    color: COLORS.textPrimary,
    lineHeight: 1.5,
    marginBottom: 6,
  },
  compDesc: {
    fontFamily: FONTS.body,
    fontSize: 9.5,
    color: COLORS.textSecondary,
    lineHeight: 1.55,
    marginBottom: 8,
  },
  compApproach: {
    fontFamily: FONTS.mono,
    fontSize: 8,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    marginBottom: 4,
  },
  compQuote: {
    fontFamily: FONTS.heading,
    fontSize: 13,
    fontWeight: 700,
    color: COLORS.textPrimary,
    fontStyle: "italic",
  },

  /* ── Stoic note ── */
  stoicCard: {
    backgroundColor: COLORS.cardBg,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.F,
    padding: 18,
    borderRadius: 4,
    marginBottom: SPACING.sectionGap,
  },
  stoicLabel: {
    fontFamily: FONTS.mono,
    fontSize: 9,
    letterSpacing: 2,
    color: COLORS.F,
    textTransform: "uppercase",
    marginBottom: 10,
  },
  stoicText: {
    fontFamily: FONTS.body,
    fontSize: 10.5,
    color: COLORS.textSecondary,
    lineHeight: 1.6,
    marginBottom: 6,
  },
  stoicHighlight: {
    fontFamily: FONTS.body,
    fontSize: 11,
    fontWeight: 700,
    color: COLORS.textPrimary,
    lineHeight: 1.6,
  },

  /* ── Final quote ── */
  finalQuoteBox: {
    backgroundColor: COLORS.darkBg,
    padding: 28,
    borderRadius: 6,
    alignItems: "center",
    marginBottom: SPACING.sectionGap,
  },
  finalQuoteText: {
    fontFamily: FONTS.heading,
    fontSize: 15,
    fontWeight: 300,
    color: COLORS.textOnDark,
    textAlign: "center",
    lineHeight: 1.55,
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

export function Ch01Philosophy() {
  return (
    <>
      {/* ═══════ PAGE 1 — Chapter opener (dark) ═══════ */}
      <Page size={PAGE_SIZE} style={s.openerPage}>
        <View>
          <Text style={s.chapterNum}>{CHAPTER}</Text>
          <Text style={s.chapterTitle}>Filozofia</Text>
          <Text style={s.chapterSubtitle}>
            {"Noua Paradigm\u0103.\nClaritatea ca Motor al Ac\u021biunii."}
          </Text>
          <View style={{ width: 40, height: 1, backgroundColor: COLORS.R, marginBottom: 16 }} />
          <Text style={s.chapterSub2}>
            {"De ce \u201eConversia\u201d este rezultatul, nu obiectivul."}
          </Text>
        </View>
      </Page>

      {/* ═══════ PAGE 2 — Hook + intro manifest ═══════ */}
      <PageShell chapterLabel={CHAPTER}>
        <Text style={s.hook}>
          {"De ce 73% din campaniile de marketing e\u0219ueaz\u0103 chiar \u0219i c\u00e2nd \u201earata bine\u201d?"}
        </Text>

        <Text style={s.h2}>
          {"Oamenii nu trebuie convin\u0219i. Trebuie l\u0103muri\u021bi."}
        </Text>

        <Text style={s.body}>
          {"Modelele tradi\u021bionale (AIDA, RACE) au fost create \u00eentr-o er\u0103 a deficitului de informa\u021bie \u2014 c\u00e2nd scopul era s\u0103 \u201e\u00eempingi\u201d clientul spre cump\u0103rare. Ast\u0103zi, \u00eentr-o er\u0103 a excesului de informa\u021bie, creierul uman a dezvoltat un "}
          <Text style={s.bodyBold}>scut anti-manipulare.</Text>
        </Text>

        <Text style={s.body}>
          {"R IF C schimb\u0103 regulile: nu urm\u0103rim s\u0103 convingem, ci s\u0103 elimin\u0103m confuzia. Ac\u021biunea este o consecin\u021b\u0103 natural\u0103 a \u00een\u021belegerii."}
        </Text>

        <Text style={s.body}>
          {"C\u00e2nd un mesaj este perfect clar, barierele psihologice dispar, iar clientul ac\u021bioneaz\u0103 de la sine \u2014 f\u0103r\u0103 presiune."}
        </Text>

        <Text style={s.bodyBold}>
          {"Aceasta e filozofia R IF C: Claritatea nu e un obiectiv de marketing. E o condi\u021bie prealabil\u0103."}
        </Text>
        <Text style={s.body}>
          {"F\u0103r\u0103 ea, orice buget e zgomot."}
        </Text>
      </PageShell>

      {/* ═══════ PAGE 3 — Principle card ═══════ */}
      <PageShell chapterLabel={CHAPTER}>
        <View style={s.principleCard}>
          <Text style={s.principleLabel}>PRINCIPIUL CENTRAL AL R IF C</Text>
          <Text style={s.principleQuote}>
            {"Oamenii ac\u021bioneaz\u0103 natural\nc\u00e2nd mesajul este clar."}
          </Text>
          <Text style={s.principleSub}>
            {"Nu trebuie convin\u0219i. Nu trebuie manipula\u021bi.\nNu trebuie \u201eoptimiza\u021bi\u201d. Trebuie l\u0103muri\u021bi."}
          </Text>
        </View>
      </PageShell>

      {/* ═══════ PAGE 4 — Pillars 1 & 2 ═══════ */}
      <PageShell chapterLabel={CHAPTER}>
        <Text style={s.h2}>Cele 3 Piloni ai Filozofiei R IF C</Text>

        {/* Pillar 1 — Economia Cognitiv\u0103 */}
        <View style={[s.pillarCard, { borderColor: "#DC2626" }]}>
          <Text style={[s.pillarLabel, { color: "#DC2626" }]}>ECONOMIA COGNITIV\u0102</Text>
          <Text style={s.pillarStatement}>
            {"Creierul proceseaz\u0103 11 milioane de bi\u021bi pe secund\u0103. Con\u0219tientizeaz\u0103 doar 50."}
          </Text>
          <Text style={s.pillarMeaningTitle}>Ce \u00eenseamn\u0103 pentru marketing:</Text>
          <Text style={s.pillarMeaning}>
            {"Creierul consum\u0103 20% din energia corpului. Orice mesaj confuz e perceput ca un \u201eatac\u201d asupra resurselor de energie. Dac\u0103 e greu de \u00een\u021beles, creierul \u00eel va ignora pentru a se proteja. O reclam\u0103 ignorat\u0103 cost\u0103 la fel ca una care nu a existat \u2014 dar tu ai pl\u0103tit pentru ea."}
          </Text>
          <View style={s.consequenceBox}>
            <Text style={[s.consequenceLabel, { color: "#DC2626" }]}>CONSECIN\u021aA R IF C</Text>
            <Text style={s.consequenceLine}>{"Claritatea este generozitate cognitiv\u0103."}</Text>
            <Text style={s.consequenceLine}>{"Este prima condi\u021bie a rentabilit\u0103\u021bii."}</Text>
            <Text style={[s.consequenceLine, { fontWeight: 700 }]}>{"Nu creativitatea. Nu bugetul. Claritatea."}</Text>
          </View>
        </View>

        {/* Pillar 2 — Eliminarea Anxiet\u0103\u021bii */}
        <View style={[s.pillarCard, { borderColor: "#2563EB" }]}>
          <Text style={[s.pillarLabel, { color: "#2563EB" }]}>ELIMINAREA ANXIET\u0102\u021aII</Text>
          <Text style={s.pillarStatement}>
            {"70% din co\u0219urile online sunt abandonate. Bounce rate mediu pe landing page: 55%."}
          </Text>
          <Text style={s.pillarMeaningTitle}>Ce \u00eenseamn\u0103 pentru marketing:</Text>
          <Text style={s.pillarMeaning}>
            {"Cauza nu e pre\u021bul. E confuzia. Confuzia genereaz\u0103 fric\u0103. Frica genereaz\u0103 am\u00e2nare. Anxietatea decizional\u0103 apare c\u00e2nd clientul nu \u00een\u021belege exact ce prime\u0219te, de ce are nevoie \u0219i ce trebuie s\u0103 fac\u0103."}
          </Text>
          <View style={s.consequenceBox}>
            <Text style={[s.consequenceLabel, { color: "#2563EB" }]}>CONSECIN\u021aA R IF C</Text>
            <Text style={s.consequenceLine}>{"R IF C \u00eenlocuie\u0219te \u201ev\u00e2nzarea agresiv\u0103\u201d cu \u201esiguran\u021ba decizional\u0103\u201d."}</Text>
            <Text style={s.consequenceLine}>{"Claritatea elimin\u0103 fric\u021biunea din customer journey \u2014"}</Text>
            <Text style={[s.consequenceLine, { fontWeight: 700 }]}>{"f\u0103r\u0103 \u00eendoieli, f\u0103r\u0103 ezitare, f\u0103r\u0103 v\u00e2nzare pierdut\u0103."}</Text>
          </View>
        </View>
      </PageShell>

      {/* ═══════ PAGE 5 — Pillar 3 ═══════ */}
      <PageShell chapterLabel={CHAPTER}>
        {/* Pillar 3 — Ireversibilitatea Ac\u021biunii */}
        <View style={[s.pillarCard, { borderColor: "#059669" }]}>
          <Text style={[s.pillarLabel, { color: "#059669" }]}>IREVERSIBILITATEA AC\u021aIUNII</Text>
          <Text style={s.pillarStatement}>
            {"Apple, Stripe \u0219i Basecamp nu \u201ev\u00e2nd agresiv\u201d. Convertesc organic prin claritate absolut\u0103."}
          </Text>
          <Text style={s.pillarMeaningTitle}>Ce \u00eenseamn\u0103 pentru marketing:</Text>
          <Text style={s.pillarMeaning}>
            {"Odat\u0103 ce Relevan\u021ba e stabil\u0103 \u0219i Interesul e amplificat de Form\u0103, ac\u021biunea devine inevitabil\u0103 \u2014 nu manipulat\u0103. Clientul nu e \u201econvins\u201d. E l\u0103murit."}
          </Text>
          <View style={s.consequenceBox}>
            <Text style={[s.consequenceLabel, { color: "#059669" }]}>CONSECIN\u021aA R IF C</Text>
            <Text style={s.consequenceLine}>{"Conversia nu e un obiectiv pe care \u00eel for\u021bezi."}</Text>
            <Text style={s.consequenceLine}>{"E o consecin\u021b\u0103 natural\u0103 a Clarit\u0103\u021bii."}</Text>
            <Text style={[s.consequenceLine, { fontWeight: 700 }]}>{"R IF C transform\u0103 push selling \u00een pull marketing."}</Text>
          </View>
        </View>
      </PageShell>

      {/* ═══════ PAGE 6 — Before / After (Tun vs Far) ═══════ */}
      <PageShell chapterLabel={CHAPTER}>
        <View style={s.comparisonRow}>
          {/* BEFORE */}
          <View style={[s.compCard, s.compBefore]}>
            <Text style={[s.compLabel, { color: COLORS.R }]}>\u00ceNAINTE</Text>
            <Text style={s.compFramework}>AIDA</Text>
            <Text style={s.compMetaphor}>
              {"Tun care trage spre un client baricadat."}
            </Text>
            <Text style={s.compDesc}>
              {"Modelul clasic for\u021beaz\u0103 aten\u021bia \u0219i impune ac\u021biunea prin presiune psihologic\u0103."}
            </Text>
            <Text style={[s.compApproach, { color: COLORS.R }]}>Push Selling</Text>
            <Text style={s.compQuote}>{"\u201eConvinge-l!\u201d"}</Text>
          </View>

          {/* AFTER */}
          <View style={[s.compCard, s.compAfter]}>
            <Text style={[s.compLabel, { color: COLORS.C }]}>ACUM</Text>
            <Text style={s.compFramework}>R IF C</Text>
            <Text style={s.compMetaphor}>
              {"Far care lumineaz\u0103 drumul. Clientul p\u0103\u0219e\u0219te singur."}
            </Text>
            <Text style={s.compDesc}>
              {"Claritatea elimin\u0103 barierele, iar clientul ac\u021bioneaz\u0103 natural, f\u0103r\u0103 presiune."}
            </Text>
            <Text style={[s.compApproach, { color: COLORS.C }]}>Pull Marketing</Text>
            <Text style={s.compQuote}>{"\u201eL\u0103mure\u0219te-l.\u201d"}</Text>
          </View>
        </View>
      </PageShell>

      {/* ═══════ PAGE 7 — Stoic note + final quote + transition ═══════ */}
      <PageShell chapterLabel={CHAPTER}>
        {/* Stoic note */}
        <View style={s.stoicCard}>
          <Text style={s.stoicLabel}>O NOT\u0102 STOIC\u0102</Text>
          <Text style={s.stoicText}>
            {"Marcus Aurelius spunea: \u201eConcentreaz\u0103-te pe ceea ce po\u021bi controla.\u201d"}
          </Text>
          <Text style={s.stoicText}>
            {"\u00cen marketing, nu po\u021bi controla pia\u021ba, algoritmul, competi\u021bia sau bugetul concuren\u021bei. Dar po\u021bi controla "}
            <Text style={s.stoicHighlight}>UN SINGUR lucru: Claritatea mesajului t\u0103u.</Text>
          </Text>
          <Text style={s.stoicText}>
            {"R IF C m\u0103soar\u0103 exact acel singur lucru pe care \u00eel controlezi. Restul devine consecin\u021b\u0103."}
          </Text>
        </View>

        {/* Final quote */}
        <View style={s.finalQuoteBox}>
          <Text style={s.finalQuoteText}>
            {"\u00cen era zgomotului, nu c\u00e2\u0219tig\u0103 cine \u021bip\u0103 mai tare,\nci cine ofer\u0103 cea mai mare lini\u0219te mental\u0103\nprin Claritate."}
          </Text>
        </View>

        {/* Transition */}
        <View style={s.transitionBox}>
          <Text style={s.transitionText}>
            {"Dac\u0103 Claritatea e destina\u021bia,"}
          </Text>
          <Text style={s.transitionText}>
            {"ecua\u021bia e harta."}
          </Text>
          <Text style={s.transitionCta}>
            {"Capitolul 02: Ecua\u021bia Universal\u0103 \u2192"}
          </Text>
        </View>
      </PageShell>
    </>
  );
}

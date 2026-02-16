/* ─── Chapter 11 — Integrare AI ─── */

import React from "react";
import { View, Text, StyleSheet } from "@react-pdf/renderer";
import { COLORS, FONTS, SPACING } from "../theme";
import { PageShell } from "../components/PageShell";
import { ChapterHeader } from "../components/ChapterHeader";
import { SectionText } from "../components/SectionText";
import { QuoteBlock } from "../components/QuoteBlock";

const CHAPTER_LABEL = "Capitolul 11";

/* ─── Prompt Data ─── */

const PROMPTS = [
  {
    id: "diagnostic",
    title: "PROMPT DIAGNOSTIC",
    usage: "Orice mesaj de marketing",
    level: "Incep\u0103tor",
    category: "diagnostic",
    text: `Ac\u021bioneaz\u0103 ca expert \u00een Protocolul R IF C Marketing.
Analizeaz\u0103 textul de mai jos \u0219i ofer\u0103-mi:
1. Scorul R (Relevan\u021b\u0103, 1-10): Cine este publicul \u0219i de ce i-ar p\u0103sa ACUM?
2. Scorul I (Interes, 1-10): Care este tensiunea creat\u0103? Beneficiul e unic \u0219i cuantificabil?
3. Scorul F (Form\u0103, 1-10): Este formatul optim pentru acest canal? Amplific\u0103 sau saboteaz\u0103?
4. Calculeaz\u0103 C = R + (I \u00d7 F)
5. Verdictul: \u00cen ce zon\u0103 se afl\u0103?
6. Identific\u0103 variabila cea mai slab\u0103 + O SINGUR\u0102 \u00eembun\u0103t\u0103\u021bire concret\u0103
7. Arhetip de E\u0219ec aplicabil?
8. Aplic\u0103 Poarta Relevan\u021bei: dac\u0103 R < 3, marcheaz\u0103 E\u0218EC CRITIC

Mesajul de analizat: [LIPE\u0218TE CON\u021aINUTUL T\u0102U AICI]`,
  },
  {
    id: "rewrite",
    title: "PROMPT RESCRIERE",
    usage: "\u00cembun\u0103t\u0103\u021bire mesaj existent",
    level: "Intermediar",
    category: "create",
    text: `Ac\u021bioneaz\u0103 ca expert R IF C Marketing \u0219i copywriter.
Rescrie mesajul de mai jos. Obiectivul: Scor C de minim 80.

\u2022 Cre\u0219te I: adaug\u0103 o promisiune unic\u0103, cuantificabil\u0103. Zero cli\u0219ee.
\u2022 Maximizeaz\u0103 F: structur\u0103 scanabil\u0103, ierarhie vizual\u0103, eliminare jargon.
\u2022 Men\u021bine R: NU schimba audien\u021ba \u021bint\u0103 sau targeting-ul.
\u2022 Regula 1 CTA: un singur call-to-action clar \u0219i specific.

Ofer\u0103 3 variante, fiecare cu scorul R IF C estimat.

Mesajul original: [LIPE\u0218TE MESAJUL ORIGINAL AICI]`,
  },
  {
    id: "landing",
    title: "PROMPT AUDIT LANDING PAGE",
    usage: "Website, landing page, pagin\u0103 de v\u00e2nzare",
    level: "Intermediar",
    category: "diagnostic",
    text: `Ac\u021bioneaz\u0103 ca expert R IF C Marketing \u0219i UX auditor.
Auditeaz\u0103 acest landing page:

R (Relevan\u021b\u0103): Sursa de trafic e aliniat\u0103 cu mesajul paginii?
I (Interes): Headline-ul comunic\u0103 beneficiul \u00een sub 5 secunde?
F (Form\u0103): UN singur CTA contrastant? Page speed sub 3s pe mobil?

Calculeaz\u0103 C. Identific\u0103 Arhetipul de E\u0219ec dac\u0103 C < 50.
Ofer\u0103 3 recomand\u0103ri prioritizate (R \u2192 I \u2192 F).

Landing page: [LIPE\u0218TE URL-UL SAU TEXTUL PAGINII]`,
  },
  {
    id: "ad-scoring",
    title: "PROMPT SCORING RECLAM\u0102",
    usage: "Ad-uri Facebook, Google, Instagram, LinkedIn",
    level: "Intermediar",
    category: "scoring",
    text: `Ac\u021bioneaz\u0103 ca expert R IF C Marketing \u0219i media buyer.
Scoreaz\u0103 acest creative de reclam\u0103:

R \u2014 Se potrive\u0219te cu prioritatea CURENT\u0102 a publicului?
I \u2014 Oferta iese \u00een eviden\u021b\u0103 \u00een 2 secunde de scroll?
F \u2014 Formatul e optimizat pentru ACEAST\u0102 platform\u0103?

Calculeaz\u0103 C \u0219i recomand\u0103:
\u2022 C \u2265 70: LANSEAZ\u0102
\u2022 C 40-69: REVIZUIE\u0218TE (indic\u0103 ce variabil\u0103)
\u2022 C < 40: RENUN\u021a\u0102 (explic\u0103 de ce)

Platforma: [FACEBOOK / INSTAGRAM / GOOGLE / LINKEDIN]
Creative-ul: [LIPE\u0218TE TEXTUL / DESCRIEREA AD-ULUI]`,
  },
  {
    id: "email",
    title: "PROMPT OPTIMIZARE EMAIL",
    usage: "Email marketing, newsletter",
    level: "Intermediar",
    category: "channel",
    text: `Ac\u021bioneaz\u0103 ca expert R IF C Marketing \u0219i email strategist.

R \u2014 Segmentarea e corect\u0103?
I \u2014 Subject line creeaz\u0103 curiozitate? Corpul livreaz\u0103 valoare?
F \u2014 Scanabil cu un CTA clar? Mobile-first?

Calculeaz\u0103 C. Ofer\u0103:
1. Scor R, I, F, C cu justificare
2. 3 variante subject line (cu I estimat per variant\u0103)
3. Recomandarea #1 pentru cel mai mare impact pe C

Email: [LIPE\u0218TE EMAILUL COMPLET]`,
  },
  {
    id: "social",
    title: "PROMPT AUDIT POST SOCIAL",
    usage: "Instagram, LinkedIn, TikTok, Facebook",
    level: "\u00cencep\u0103tor",
    category: "channel",
    text: `Ac\u021bioneaz\u0103 ca expert R IF C Marketing.

R \u2014 Postul vorbe\u0219te cu follower-ii care pot deveni clien\u021bi?
I \u2014 Hook-ul opre\u0219te scroll-ul?
F \u2014 Formatul e nativ platformei?

Calculeaz\u0103 C. Ofer\u0103:
1. Scor R, I, F, C
2. 3 variante hook alternativ
3. Recomandarea formatului optim

Platforma: [INSTAGRAM / LINKEDIN / TIKTOK]
Postul: [LIPE\u0218TE TEXTUL + DESCRIEREA VIZUALULUI]`,
  },
  {
    id: "ab-test",
    title: "PROMPT COMPARA\u021aIE A/B",
    usage: "Decidere \u00eentre 2 variante",
    level: "Avansat",
    category: "scoring",
    text: `Ac\u021bioneaz\u0103 ca expert R IF C Marketing.
Scoreaz\u0103 AMBELE variante cu R IF C \u0219i compar\u0103-le.

Per variant\u0103:
1. Scor R, I, F, C cu justificare
2. Variabila cea mai diferit\u0103

La final: Recomand\u0103 c\u00e2\u0219tig\u0103torul
Sugereaz\u0103 o Variant\u0103 C care combin\u0103 cele mai bune elemente.

Varianta A: [LIPE\u0218TE VARIANTA A]
Varianta B: [LIPE\u0218TE VARIANTA B]`,
  },
  {
    id: "campaign",
    title: "PROMPT CAMPANIE DE LA ZERO",
    usage: "Creare campanie nou\u0103",
    level: "Avansat",
    category: "create",
    text: `Ac\u021bioneaz\u0103 ca expert R IF C Marketing \u0219i campaign strategist.
Construie\u0219te o campanie de la zero cu R IF C integrat:

Pas 1 \u2014 R: Define\u0219te audien\u021ba, ICP-ul, timing-ul, canalul. R \u2265 3?
Pas 2 \u2014 I: Creeaz\u0103 UVP-ul, headline-ul, hook-ul. Clar \u00een 5 sec?
Pas 3 \u2014 F: Recomand\u0103 formatul optim. Amplific\u0103 I sau fric\u021biune?
Pas 4 \u2014 C: Calculeaz\u0103 C estimat. Dac\u0103 C < 70, ajusteaz\u0103.

Ofer\u0103 3 variante de mesaj final cu scor C.

Produs/Serviciu: [CE VINZI]
Audien\u021ba: [CUI VINZI]
Canal: [UNDE]`,
  },
];

const CATEGORIES = [
  { id: "diagnostic", label: "Diagnostic", count: 2, color: "#2563EB" },
  { id: "create", label: "Creare", count: 2, color: "#059669" },
  { id: "scoring", label: "Scoring", count: 2, color: "#D97706" },
  { id: "channel", label: "Per Canal", count: 2, color: "#DC2626" },
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
    fontWeight: 700,
    color: COLORS.textPrimary,
    marginBottom: SPACING.paragraphGap,
  },

  /* Flow visualization */
  flowRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.sectionGap,
  },
  flowBox: {
    width: "30%",
    borderRadius: 6,
    padding: 10,
    alignItems: "center",
    borderWidth: 1,
  },
  flowLabel: {
    fontFamily: FONTS.mono,
    fontSize: 9,
    fontWeight: 700,
    letterSpacing: 1,
    marginBottom: 4,
  },
  flowDesc: {
    fontFamily: FONTS.body,
    fontSize: 9,
    textAlign: "center",
    lineHeight: 1.5,
    marginBottom: 2,
  },
  flowScore: {
    fontFamily: FONTS.mono,
    fontSize: 10,
    fontWeight: 700,
    marginTop: 4,
  },
  flowArrow: {
    fontFamily: FONTS.mono,
    fontSize: 16,
    color: COLORS.C,
  },

  /* Categories row */
  catRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: SPACING.sectionGap,
  },
  catBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
  },
  catText: {
    fontFamily: FONTS.mono,
    fontSize: 9,
    fontWeight: 500,
  },

  /* Prompt card */
  promptCard: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    padding: SPACING.cardPadding,
    marginBottom: 12,
  },
  promptHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  promptTitle: {
    fontFamily: FONTS.mono,
    fontSize: 10,
    fontWeight: 700,
    color: COLORS.textPrimary,
    letterSpacing: 1,
  },
  promptMeta: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 8,
  },
  promptUsage: {
    fontFamily: FONTS.body,
    fontSize: 9,
    color: COLORS.textMuted,
  },
  promptLevel: {
    fontFamily: FONTS.mono,
    fontSize: 8,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 8,
    backgroundColor: COLORS.cardBg,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    color: COLORS.textMuted,
  },
  promptCode: {
    backgroundColor: COLORS.darkBg,
    borderRadius: 4,
    padding: 10,
  },
  promptCodeText: {
    fontFamily: FONTS.mono,
    fontSize: 8,
    color: COLORS.textOnDark,
    lineHeight: 1.5,
  },

  /* Why AI card */
  whyCard: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    padding: SPACING.cardPadding,
    marginBottom: SPACING.sectionGap,
  },
  whyTitle: {
    fontFamily: FONTS.mono,
    fontSize: 10,
    letterSpacing: 2,
    textTransform: "uppercase",
    color: COLORS.R,
    marginBottom: 8,
  },
  whyBody: {
    fontFamily: FONTS.body,
    fontSize: 10,
    color: COLORS.textSecondary,
    lineHeight: 1.6,
    marginBottom: 6,
  },
  whyHighlight: {
    fontFamily: FONTS.mono,
    fontSize: 10,
    fontWeight: 700,
    color: COLORS.textPrimary,
    marginBottom: 4,
  },

  /* VS table */
  vsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: SPACING.sectionGap,
  },
  vsBox: {
    width: "48%",
    backgroundColor: COLORS.cardBg,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    padding: 12,
  },
  vsTitle: {
    fontFamily: FONTS.mono,
    fontSize: 9,
    fontWeight: 700,
    letterSpacing: 1,
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  vsBullet: {
    flexDirection: "row",
    marginBottom: 3,
  },
  vsDot: {
    fontFamily: FONTS.mono,
    fontSize: 9,
    color: COLORS.textMuted,
    marginRight: 6,
    width: 10,
  },
  vsText: {
    fontFamily: FONTS.body,
    fontSize: 9,
    color: COLORS.textSecondary,
    lineHeight: 1.5,
    flex: 1,
  },

  /* Pro tip */
  proTipCard: {
    backgroundColor: COLORS.C + "0D",
    borderRadius: 6,
    borderWidth: 1,
    borderColor: COLORS.C + "40",
    padding: SPACING.cardPadding,
    marginBottom: SPACING.sectionGap,
  },
  proTipLabel: {
    fontFamily: FONTS.mono,
    fontSize: 9,
    letterSpacing: 2,
    textTransform: "uppercase",
    color: COLORS.C,
    marginBottom: 4,
  },
  proTipTitle: {
    fontFamily: FONTS.heading,
    fontSize: 14,
    color: COLORS.textPrimary,
    marginBottom: 6,
  },
  proTipBody: {
    fontFamily: FONTS.body,
    fontSize: 10,
    color: COLORS.textSecondary,
    lineHeight: 1.6,
  },
});

/* ─── Component ─── */

export function Ch11AIPrompts() {
  return (
    <>
      {/* Page 1: Chapter Header */}
      <ChapterHeader
        chapterNumber="11"
        title="Integrare AI"
        subtitle="R IF C + AI. Transform\u0103 orice LLM \u00eentr-un Strateg de Marketing."
        color={COLORS.I}
      />

      {/* Page 2: Intro + Why AI + Flow */}
      <PageShell chapterLabel={CHAPTER_LABEL}>
        <View style={s.introBlock}>
          <Text style={s.introAccent}>
            Nu mai cere AI-ului s\u0103 \u201escrie o reclam\u0103\u201d. Cere-i s\u0103 construiasc\u0103 Claritate.
          </Text>
          <Text style={s.introText}>
            Aceste prompt-uri transform\u0103 orice ChatGPT, Claude sau Gemini \u00eentr-un auditor R IF C antrenat. Copiaz\u0103, lipe\u0219te, prime\u0219ti scor + diagnostic + recomandare. Func\u021bioneaz\u0103 pe orice: landing page, email, reclam\u0103, post social, pitch deck.
          </Text>
        </View>

        {/* Why AI needs R IF C */}
        <View style={s.whyCard}>
          <Text style={s.whyTitle}>DE CE AI-UL ARE NEVOIE DE R IF C</Text>
          <Text style={s.whyBody}>
            F\u0103r\u0103 un framework, AI-ul produce mesaje generice \u2014 text fluent, bine structurat, dar complet lipsit de direc\u021bie.
          </Text>
          <Text style={s.whyHighlight}>
            Aceasta e Halucina\u021bia Creativ\u0103: AI-ul genereaz\u0103 Zgomot Estetic.
          </Text>
          <Text style={s.whyBody}>F = 9, dar I = 3 \u0219i R = 2.</Text>
          <Text style={s.whyBody}>
            Pe h\u00e2rtie arat\u0103 bine. \u00cen practic\u0103, converte\u0219te zero.
          </Text>
          <Text style={s.whyBody}>
            Folosind Protocolul R IF C, for\u021bezi algoritmul s\u0103 respecte ierarhia Relevan\u021bei \u0219i s\u0103 multiplice Interesul prin Form\u0103.
          </Text>
        </View>

        {/* Flow: Input → Filter → Output */}
        <View style={s.flowRow}>
          <View
            style={[
              s.flowBox,
              { backgroundColor: COLORS.R + "08", borderColor: COLORS.R + "30" },
            ]}
          >
            <Text style={[s.flowLabel, { color: COLORS.R }]}>INPUT HAOTIC</Text>
            <Text style={[s.flowDesc, { color: COLORS.textMuted }]}>
              \u201eScrie-mi o reclam\u0103 bun\u0103\u201d
            </Text>
            <Text style={[s.flowScore, { color: COLORS.R }]}>C = ???</Text>
          </View>
          <Text style={s.flowArrow}>{"\u2192"}</Text>
          <View
            style={[
              s.flowBox,
              { backgroundColor: COLORS.I + "08", borderColor: COLORS.I + "30" },
            ]}
          >
            <Text style={[s.flowLabel, { color: COLORS.I }]}>FILTRU R IF C</Text>
            <Text style={[s.flowDesc, { color: COLORS.textMuted }]}>
              R {"\u2265"} 3? I {"\u2265"} 5? F optim? C {"\u2265"} 80?
            </Text>
          </View>
          <Text style={s.flowArrow}>{"\u2192"}</Text>
          <View
            style={[
              s.flowBox,
              { backgroundColor: COLORS.C + "08", borderColor: COLORS.C + "30" },
            ]}
          >
            <Text style={[s.flowLabel, { color: COLORS.C }]}>OUTPUT CLAR</Text>
            <Text style={[s.flowDesc, { color: COLORS.textMuted }]}>
              Mesaj cu C = 87
            </Text>
            <Text style={[s.flowScore, { color: COLORS.C }]}>
              Claritate Suprem\u0103
            </Text>
          </View>
        </View>
      </PageShell>

      {/* Page 3: Prompts 1-3 */}
      <PageShell chapterLabel={CHAPTER_LABEL}>
        {/* Categories bar */}
        <View style={s.catRow}>
          {CATEGORIES.map((cat) => (
            <View
              key={cat.id}
              style={[
                s.catBadge,
                {
                  backgroundColor: cat.color + "0D",
                  borderColor: cat.color + "40",
                },
              ]}
            >
              <Text style={[s.catText, { color: cat.color }]}>
                {cat.label} ({cat.count})
              </Text>
            </View>
          ))}
        </View>

        {PROMPTS.slice(0, 2).map((p) => (
          <View key={p.id} style={s.promptCard}>
            <View style={s.promptHeader}>
              <Text style={s.promptTitle}>{p.title}</Text>
            </View>
            <View style={s.promptMeta}>
              <Text style={s.promptUsage}>{p.usage}</Text>
              <Text style={s.promptLevel}>{p.level}</Text>
            </View>
            <View style={s.promptCode}>
              <Text style={s.promptCodeText}>{p.text}</Text>
            </View>
          </View>
        ))}
      </PageShell>

      {/* Page 4: Prompts 3-5 */}
      <PageShell chapterLabel={CHAPTER_LABEL}>
        {PROMPTS.slice(2, 5).map((p) => (
          <View key={p.id} style={s.promptCard}>
            <View style={s.promptHeader}>
              <Text style={s.promptTitle}>{p.title}</Text>
            </View>
            <View style={s.promptMeta}>
              <Text style={s.promptUsage}>{p.usage}</Text>
              <Text style={s.promptLevel}>{p.level}</Text>
            </View>
            <View style={s.promptCode}>
              <Text style={s.promptCodeText}>{p.text}</Text>
            </View>
          </View>
        ))}
      </PageShell>

      {/* Page 5: Prompts 6-8 */}
      <PageShell chapterLabel={CHAPTER_LABEL}>
        {PROMPTS.slice(5, 8).map((p) => (
          <View key={p.id} style={s.promptCard}>
            <View style={s.promptHeader}>
              <Text style={s.promptTitle}>{p.title}</Text>
            </View>
            <View style={s.promptMeta}>
              <Text style={s.promptUsage}>{p.usage}</Text>
              <Text style={s.promptLevel}>{p.level}</Text>
            </View>
            <View style={s.promptCode}>
              <Text style={s.promptCodeText}>{p.text}</Text>
            </View>
          </View>
        ))}
      </PageShell>

      {/* Page 6: VS comparison + Pro Tip + CTA */}
      <PageShell chapterLabel={CHAPTER_LABEL}>
        {/* Prompts vs AI Audit */}
        <SectionText
          heading="Prompt-uri vs. AI Audit \u2014 Care e diferen\u021ba?"
          body=""
          headingColor={COLORS.I}
        />

        <View style={s.vsRow}>
          <View style={s.vsBox}>
            <Text style={s.vsTitle}>PROMPT-URI (acest capitol)</Text>
            {[
              "Func\u021bioneaz\u0103 \u00een ChatGPT, Claude, Gemini",
              "Tu controlezi procesul + personalizezi",
              "Gratuit \u2014 copiezi \u0219i lipe\u0219ti",
              "Ideal pentru rescriere \u0219i itera\u021bii detaliate",
            ].map((b, idx) => (
              <View key={idx} style={s.vsBullet}>
                <Text style={s.vsDot}>{"\u2022"}</Text>
                <Text style={s.vsText}>{b}</Text>
              </View>
            ))}
          </View>
          <View style={s.vsBox}>
            <Text style={s.vsTitle}>AI AUDIT (pe rifcmarketing.com)</Text>
            {[
              "Direct pe site, f\u0103r\u0103 copy-paste",
              "Rezultat instant, vizualizare grafic\u0103",
              "Compara\u021bii \u00eentre mesaje",
              "Ideal pentru audit rapid",
            ].map((b, idx) => (
              <View key={idx} style={s.vsBullet}>
                <Text style={s.vsDot}>{"\u2022"}</Text>
                <Text style={s.vsText}>{b}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Pro tip */}
        <View style={s.proTipCard}>
          <Text style={s.proTipLabel}>SFAT PRO</Text>
          <Text style={s.proTipTitle}>
            Propriul t\u0103u consultant R IF C, 24/7
          </Text>
          <Text style={s.proTipBody}>
            \u00cencarc\u0103 manualul R IF C (PDF-ul Codului Surs\u0103) \u00een baza de cuno\u0219tin\u021be a unui GPT personalizat (ChatGPT) sau Claude Project. Vei avea un consultant R IF C dedicat care \u00ee\u021bi auditeaz\u0103 fiecare email, postare sau landing page \u2014 f\u0103r\u0103 s\u0103 copiezi prompt-uri de fiecare dat\u0103.
          </Text>
        </View>

        <QuoteBlock
          text="AI-ul nu e problema. Lipsa direc\u021biei e problema. R IF C \u00eei d\u0103 AI-ului busola. Tu \u00eei dai con\u021binutul."
          attribution="rifcmarketing.com/audit"
          color={COLORS.C}
        />
      </PageShell>
    </>
  );
}

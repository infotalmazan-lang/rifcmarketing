/* ─── Chapter 10 — Studii de Caz ─── */

import React from "react";
import { View, Text, StyleSheet } from "@react-pdf/renderer";
import { COLORS, FONTS, SPACING } from "../theme";
import { PageShell } from "../components/PageShell";
import { ChapterHeader } from "../components/ChapterHeader";
import { SectionText } from "../components/SectionText";
import { QuoteBlock } from "../components/QuoteBlock";

const CHAPTER_LABEL = "Capitolul 10";

/* ─── Case Study data ─── */

const CASES = [
  {
    brand: "Magazin Online de Cosmetice Naturale",
    industry: "E-commerce",
    archetype: "Diamantul \u00cengropat",
    before: { r: 4, i: 3, f: 2, c: 10 },
    after: { r: 8, i: 7, f: 8, c: 64 },
    beforeJustifications: {
      r: "Email-urile erau trimise c\u0103tre \u00eentreaga baz\u0103 de date, f\u0103r\u0103 segmentare pe tip de piele, v\u00e2rst\u0103 sau istoric de achizi\u021bii.",
      i: "Mesajele prezentau produsele generic, f\u0103r\u0103 beneficii specifice sau diferen\u021biatori fa\u021b\u0103 de competi\u021bie.",
      f: "Wall-of-text f\u0103r\u0103 ierarhie vizual\u0103, imagini mici, f\u0103r\u0103 CTA clar. Formatare identic\u0103 pe desktop \u0219i mobil.",
    },
    afterJustifications: {
      r: "Segmentare pe 4 categorii (tip piele + istoric) cu timing bazat pe ciclul de reaprovizionare al clientului.",
      i: "Fiecare email deschide cu beneficiul specific pentru segmentul respectiv, cu social proof de la clien\u021bi similari.",
      f: "Layout scanabil cu hero image, un singur CTA vizibil, text minim, optimizat mobile-first.",
    },
    diagnostic: "Arhetip: Diamantul \u00cengropat. Produse excelente (calitate real\u0103), dar prezentare care le face invizibile.",
    fix: "Segmentare audien\u021b\u0103 \u00een 4 categorii, personalizare subiect email per segment, layout email redesign cu focus pe un singur produs + un singur CTA.",
    result: "Open rate +47%, CTR de la 0.3% la 2.1% (7x), revenue per email +340%. ROI campanie: 12:1.",
    lesson: "Nu conteaz\u0103 c\u00e2t de bun e produsul dac\u0103 mesajul nu ajunge la persoana potrivit\u0103, \u00een formatul potrivit.",
  },
  {
    brand: "Companie IT & Software",
    industry: "SaaS B2B",
    archetype: "Fantoma Invizibil\u0103",
    before: { r: 2, i: 6, f: 7, c: 44 },
    after: { r: 7, i: 8, f: 9, c: 79 },
    beforeJustifications: {
      r: "Landing page-ul targeta generic \"companii\" f\u0103r\u0103 specificare de industrie, m\u0103rime sau pain point concret.",
      i: "Con\u021binutul avea USP-uri reale dar exprimate \u00een jargon tehnic, accesibil doar inginerilor.",
      f: "Design curat, profesional, responsive. Formatul era bun dar nu compensa lipsa de relevan\u021b\u0103.",
    },
    afterJustifications: {
      r: "3 landing pages separate: manufacturing, logistics, retail. Fiecare cu pain points \u0219i case studies specifice.",
      i: "Headline-uri bazate pe rezultate business: \"Reduce\u021bi downtime-ul cu 73%\" \u00een loc de \"Platform AI avansat\u0103\".",
      f: "Layout optimizat cu social proof deasupra fold-ului, video testimonial 60s, CTA contextual per industrie.",
    },
    diagnostic: "Arhetip: Fantoma Invizibil\u0103. Landing page frumos executat dar complet generic. Vizitatorii nu se reg\u0103seau \u00een mesaj.",
    fix: "Creare 3 landing pages verticale cu messaging specific fiec\u0103rei industrii, social proof relevant \u0219i CTA contextual.",
    result: "Conversion rate de la 0.8% la 3.2% (4x), CPL redus cu 62%, MQL quality score +85%.",
    lesson: "Un landing page pentru toat\u0103 lumea nu vorbe\u0219te nim\u0103nui. Relevan\u021ba bate designul de fiecare dat\u0103.",
  },
  {
    brand: "Brut\u0103rie Artizanal\u0103 Local\u0103",
    industry: "Retail Local",
    archetype: "Zgomotul Estetic",
    before: { r: 8, i: 2, f: 6, c: 20 },
    after: { r: 9, i: 7, f: 8, c: 65 },
    beforeJustifications: {
      r: "Audien\u021ba era corect\u0103 (localnici, food lovers, raza 5km) \u0219i timing-ul bun.",
      i: "Post\u0103rile ar\u0103tau poze frumoase dar f\u0103r\u0103 mesaj, f\u0103r\u0103 poveste, f\u0103r\u0103 motiv s\u0103 alegi brut\u0103ria.",
      f: "Fotografii de calitate, hashtag-uri relevante, dar zero call-to-action \u0219i f\u0103r\u0103 link \u00een bio.",
    },
    afterJustifications: {
      r: "Targetare identic\u0103 plus retargeting pe vizitatorii site-ului \u0219i lookalike audience.",
      i: "Pove\u0219ti despre procesul de produc\u021bie, ingrediente locale, tradi\u021bie familial\u0103. UVP clar: \"P\u00e2ine cu maia natural\u0103, copt la lemne\".",
      f: "Format Reel 30s cu hook \u00een primele 3 secunde, CTA clar, link \u00een bio actualizat.",
    },
    diagnostic: "Arhetip: Zgomotul Estetic. Poze superbe, zero substan\u021b\u0103. Publicul d\u0103dea like dar nu cump\u0103ra.",
    fix: "Strategie de con\u021binut cu storytelling (proces, ingrediente, oameni), CTA explicit pe fiecare postare.",
    result: "Comenzi online +280%, follower-to-customer rate de la 0.1% la 2.3%, average order value +45%.",
    lesson: "Like-urile nu pl\u0103tesc chiria. Fiecare postare trebuie s\u0103 aib\u0103 un motiv clar pentru care cineva ar ac\u021biona.",
  },
  {
    brand: "Startup EdTech",
    industry: "EdTech",
    archetype: "Diamantul \u00cengropat",
    before: { r: 6, i: 7, f: 3, c: 27 },
    after: { r: 8, i: 9, f: 8, c: 80 },
    beforeJustifications: {
      r: "Audien\u021ba era corect identificat\u0103 (p\u0103rin\u021bi 30-45 ani) dar mesajul nu era calibrat.",
      i: "Platforma avea func\u021bionalit\u0103\u021bi unice (AI tutoring, gamification) dar comunicate \u00een liste de features.",
      f: "Landing page aglomerat: 7 sec\u021biuni above-the-fold, 3 CTA-uri diferite, wall-of-text.",
    },
    afterJustifications: {
      r: "Mesaj calibrat pe anxietatea parental\u0103: \"Copilul t\u0103u r\u0103m\u00e2ne \u00een urm\u0103 la matematic\u0103?\"",
      i: "Demo interactiv de 30 secunde direct pe landing page. Rezultat vizibil: \"+2 note \u00een 30 zile\".",
      f: "O singur\u0103 pagin\u0103 cu flow liniar: Problem > Demo > Social Proof > Pre\u021b > CTA. Un singur buton vizibil.",
    },
    diagnostic: "Arhetip: Diamantul \u00cengropat. Produs excelent, dar landing page-ul \u00eencerca s\u0103 spun\u0103 totul deodat\u0103.",
    fix: "Restructurare complet\u0103: un singur mesaj per ecran, flow liniar, demo interactiv embedded.",
    result: "Bounce rate de la 78% la 34%, sign-up rate +320%, cost per acquisition -58%.",
    lesson: "Dac\u0103 trebuie s\u0103 explici totul pe prima pagin\u0103, \u00eenseamn\u0103 c\u0103 nu ai un mesaj clar. Simplific\u0103.",
  },
  {
    brand: "Restaurant Premium",
    industry: "Restaurant",
    archetype: "Diamantul \u00cengropat",
    before: { r: 7, i: 5, f: 4, c: 27 },
    after: { r: 8, i: 8, f: 9, c: 80 },
    beforeJustifications: {
      r: "Publicul era corect dar mesajele nu diferen\u021biau \u00eentre segmente.",
      i: "Meniu de calitate, chef cu experien\u021b\u0103, dar comunicarea nu transmitea experien\u021ba.",
      f: "Newsletter text-only cu lista de preparate noi, f\u0103r\u0103 imagini, f\u0103r\u0103 structur\u0103.",
    },
    afterJustifications: {
      r: "3 segmente cu mesaje dedicate: romantic dinners, corporate events, weekend brunch.",
      i: "Fiecare email vinde experien\u021ba: \"O sear\u0103 pe care o s\u0103 o povesti\u021bi\" nu \"Meniu nou de toamn\u0103\".",
      f: "Email template premium cu food photography hero, font elegant, CTA mare, mobile-first.",
    },
    diagnostic: "Arhetip: Diamantul \u00cengropat. Restaurant excep\u021bional cu comunicare de cantin\u0103.",
    fix: "Rebranding comunicare din \"meniu\" \u00een \"experien\u021b\u0103\". Segmentare pe 3 ocazii, email redesign.",
    result: "Rezerv\u0103ri din email +195%, nota medie de plat\u0103 +35%, rata de dezabonare de la 4.2% la 0.8%.",
    lesson: "Oamenii nu cump\u0103r\u0103 preparate. Cump\u0103r\u0103 momente. Vinde experien\u021ba, nu ingredientele.",
  },
];

/* ─── Styles ─── */

const s = StyleSheet.create({
  /* Case card */
  caseCard: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    padding: SPACING.cardPadding,
    marginBottom: SPACING.sectionGap,
  },
  caseHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  caseBrand: {
    fontFamily: FONTS.heading,
    fontSize: 14,
    color: COLORS.textPrimary,
    flex: 1,
  },
  caseBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    backgroundColor: COLORS.R + "1A",
    borderWidth: 1,
    borderColor: COLORS.R + "40",
  },
  caseBadgeText: {
    fontFamily: FONTS.mono,
    fontSize: 8,
    color: COLORS.R,
    letterSpacing: 0.5,
  },
  caseIndustry: {
    fontFamily: FONTS.mono,
    fontSize: 9,
    color: COLORS.textMuted,
    marginBottom: 10,
  },

  /* Score display */
  scoresRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  scoreBox: {
    width: "48%",
    borderRadius: 4,
    padding: 10,
    borderWidth: 1,
  },
  scoreBoxLabel: {
    fontFamily: FONTS.mono,
    fontSize: 9,
    letterSpacing: 1,
    textTransform: "uppercase",
    marginBottom: 6,
  },
  scoreRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 3,
  },
  scoreVar: {
    fontFamily: FONTS.mono,
    fontSize: 10,
    fontWeight: 700,
  },
  scoreVal: {
    fontFamily: FONTS.mono,
    fontSize: 10,
  },
  scoreCTotal: {
    fontFamily: FONTS.mono,
    fontSize: 12,
    fontWeight: 700,
    marginTop: 4,
    paddingTop: 4,
    borderTopWidth: 0.5,
  },

  /* Justification */
  justLabel: {
    fontFamily: FONTS.mono,
    fontSize: 8,
    letterSpacing: 1,
    textTransform: "uppercase",
    color: COLORS.textMuted,
    marginBottom: 4,
    marginTop: 6,
  },
  justText: {
    fontFamily: FONTS.body,
    fontSize: 9,
    color: COLORS.textSecondary,
    lineHeight: 1.5,
    marginBottom: 2,
  },

  /* Diagnostic/Fix/Result */
  sectionLabel: {
    fontFamily: FONTS.mono,
    fontSize: 9,
    letterSpacing: 1,
    textTransform: "uppercase",
    marginBottom: 4,
    marginTop: 8,
  },
  sectionBody: {
    fontFamily: FONTS.body,
    fontSize: 10,
    color: COLORS.textSecondary,
    lineHeight: 1.6,
    marginBottom: 4,
  },

  /* Lesson box */
  lessonBox: {
    borderLeftWidth: 3,
    borderLeftColor: COLORS.C,
    paddingLeft: 10,
    paddingVertical: 6,
    marginTop: 8,
  },
  lessonLabel: {
    fontFamily: FONTS.mono,
    fontSize: 8,
    letterSpacing: 1,
    textTransform: "uppercase",
    color: COLORS.C,
    marginBottom: 3,
  },
  lessonText: {
    fontFamily: FONTS.heading,
    fontSize: 10,
    color: COLORS.textPrimary,
    lineHeight: 1.6,
    fontStyle: "italic",
  },

  /* Lift indicator */
  liftBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: COLORS.C + "1A",
    borderWidth: 1,
    borderColor: COLORS.C + "40",
    marginTop: 6,
  },
  liftText: {
    fontFamily: FONTS.mono,
    fontSize: 10,
    fontWeight: 700,
    color: COLORS.C,
  },
});

/* ─── Helper: render a single case study across 1-2 pages ─── */

function CaseStudyCard({ cs }: { cs: (typeof CASES)[0] }) {
  const cBefore = cs.before.r + cs.before.i * cs.before.f;
  const cAfter = cs.after.r + cs.after.i * cs.after.f;
  const lift = Math.round(((cAfter - cBefore) / Math.max(cBefore, 1)) * 100);

  return (
    <View style={s.caseCard}>
      {/* Header */}
      <View style={s.caseHeader}>
        <Text style={s.caseBrand}>{cs.brand}</Text>
        <View style={s.caseBadge}>
          <Text style={s.caseBadgeText}>{cs.archetype}</Text>
        </View>
      </View>
      <Text style={s.caseIndustry}>{cs.industry}</Text>

      {/* Before/After scores */}
      <View style={s.scoresRow}>
        {/* Before */}
        <View
          style={[
            s.scoreBox,
            { backgroundColor: COLORS.R + "08", borderColor: COLORS.R + "30" },
          ]}
        >
          <Text style={[s.scoreBoxLabel, { color: COLORS.R }]}>INAINTE</Text>
          <View style={s.scoreRow}>
            <Text style={[s.scoreVar, { color: COLORS.R }]}>R</Text>
            <Text style={[s.scoreVal, { color: COLORS.textSecondary }]}>
              {cs.before.r}/10
            </Text>
          </View>
          <View style={s.scoreRow}>
            <Text style={[s.scoreVar, { color: COLORS.I }]}>I</Text>
            <Text style={[s.scoreVal, { color: COLORS.textSecondary }]}>
              {cs.before.i}/10
            </Text>
          </View>
          <View style={s.scoreRow}>
            <Text style={[s.scoreVar, { color: COLORS.F }]}>F</Text>
            <Text style={[s.scoreVal, { color: COLORS.textSecondary }]}>
              {cs.before.f}/10
            </Text>
          </View>
          <Text style={[s.scoreCTotal, { color: COLORS.R, borderTopColor: COLORS.R + "30" }]}>
            C = {cBefore}
          </Text>
        </View>

        {/* After */}
        <View
          style={[
            s.scoreBox,
            { backgroundColor: COLORS.C + "08", borderColor: COLORS.C + "30" },
          ]}
        >
          <Text style={[s.scoreBoxLabel, { color: COLORS.C }]}>DUPA</Text>
          <View style={s.scoreRow}>
            <Text style={[s.scoreVar, { color: COLORS.R }]}>R</Text>
            <Text style={[s.scoreVal, { color: COLORS.textSecondary }]}>
              {cs.after.r}/10
            </Text>
          </View>
          <View style={s.scoreRow}>
            <Text style={[s.scoreVar, { color: COLORS.I }]}>I</Text>
            <Text style={[s.scoreVal, { color: COLORS.textSecondary }]}>
              {cs.after.i}/10
            </Text>
          </View>
          <View style={s.scoreRow}>
            <Text style={[s.scoreVar, { color: COLORS.F }]}>F</Text>
            <Text style={[s.scoreVal, { color: COLORS.textSecondary }]}>
              {cs.after.f}/10
            </Text>
          </View>
          <Text style={[s.scoreCTotal, { color: COLORS.C, borderTopColor: COLORS.C + "30" }]}>
            C = {cAfter}
          </Text>
        </View>
      </View>

      {/* Lift */}
      <View style={s.liftBadge}>
        <Text style={s.liftText}>+{lift}% Claritate</Text>
      </View>

      {/* Diagnostic */}
      <Text style={[s.sectionLabel, { color: COLORS.R }]}>DIAGNOSTIC</Text>
      <Text style={s.sectionBody}>{cs.diagnostic}</Text>

      {/* Fix */}
      <Text style={[s.sectionLabel, { color: COLORS.I }]}>SOLUTIA</Text>
      <Text style={s.sectionBody}>{cs.fix}</Text>

      {/* Result */}
      <Text style={[s.sectionLabel, { color: COLORS.C }]}>REZULTAT</Text>
      <Text style={s.sectionBody}>{cs.result}</Text>

      {/* Lesson */}
      <View style={s.lessonBox}>
        <Text style={s.lessonLabel}>LECTIA</Text>
        <Text style={s.lessonText}>{cs.lesson}</Text>
      </View>
    </View>
  );
}

/* ─── Component ─── */

export function Ch10CaseStudies() {
  return (
    <>
      {/* Page 1: Chapter Header */}
      <ChapterHeader
        chapterNumber="10"
        title="Studii de Caz"
        subtitle="Aplica\u021bii reale ale scoringului R IF C cu analiz\u0103 \u00eenainte/dup\u0103, rezultate m\u0103surabile \u0219i date de impact financiar."
        color={COLORS.C}
      />

      {/* Page 2: Intro + Case 1 */}
      <PageShell chapterLabel={CHAPTER_LABEL}>
        <SectionText
          body="Fiecare studiu de caz include scoring diagnostic complet, variabila specific\u0103 optimizat\u0103 \u0219i schimbarea rezultat\u0103 \u00een nivelul de Claritate."
        />
        <CaseStudyCard cs={CASES[0]} />
      </PageShell>

      {/* Page 3: Case 2 */}
      <PageShell chapterLabel={CHAPTER_LABEL}>
        <CaseStudyCard cs={CASES[1]} />
      </PageShell>

      {/* Page 4: Case 3 */}
      <PageShell chapterLabel={CHAPTER_LABEL}>
        <CaseStudyCard cs={CASES[2]} />
      </PageShell>

      {/* Page 5-6: Case 4 */}
      <PageShell chapterLabel={CHAPTER_LABEL}>
        <CaseStudyCard cs={CASES[3]} />
      </PageShell>

      {/* Page 7: Case 5 */}
      <PageShell chapterLabel={CHAPTER_LABEL}>
        <CaseStudyCard cs={CASES[4]} />
      </PageShell>

      {/* Page 8: Summary + transition */}
      <PageShell chapterLabel={CHAPTER_LABEL}>
        <SectionText
          heading="Tipar comun \u00een toate studiile de caz"
          body={[
            "1. Diagnosticul numeric identific\u0103 exact variabila defect\u0103 \u2014 nu o senza\u021bie, ci un num\u0103r.",
            "2. Optimizarea unei singure variabile poate genera cre\u0219teri de 100-500% \u00een Claritate.",
            "3. Poarta Relevan\u021bei (R < 3) este cel mai frecvent factor de e\u0219ec \u2014 \u0219i cel mai ignorat.",
            "4. Forma (F) este multiplicatorul cel mai subestimat: acela\u0219i mesaj, format diferit, impact de 3-10x.",
          ]}
          headingColor={COLORS.C}
        />

        <QuoteBlock
          text="Ai v\u0103zut cum func\u021bioneaz\u0103 R IF C \u00een practic\u0103. Acum \u00eenva\u021b\u0103 cum s\u0103-l folosesti cu AI."
          attribution="CAPITOLUL 11 \u2192 INTEGRARE AI"
          color={COLORS.C}
        />
      </PageShell>
    </>
  );
}

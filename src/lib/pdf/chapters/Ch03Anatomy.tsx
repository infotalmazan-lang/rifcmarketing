/* ─── Chapter 03 — Anatomia Variabilelor ─── */

import React from "react";
import { Page, View, Text, StyleSheet } from "@react-pdf/renderer";
import { COLORS, FONTS, SPACING, PAGE_SIZE } from "../theme";
import { PageShell } from "../components/PageShell";

const CHAPTER = "Capitolul 03";

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
    color: COLORS.F,
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

  /* ── Variable header ── */
  varHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    marginBottom: 14,
  },
  varLetterBox: {
    width: 48,
    height: 48,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  varLetter: {
    fontFamily: FONTS.mono,
    fontSize: 26,
    fontWeight: 700,
    color: "#FFFFFF",
  },
  varTitleBlock: {
    flex: 1,
  },
  varTitle: {
    fontFamily: FONTS.heading,
    fontSize: 20,
    fontWeight: 700,
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  varSubtitle: {
    fontFamily: FONTS.body,
    fontSize: 10.5,
    color: COLORS.textSecondary,
    lineHeight: 1.5,
  },

  /* ── Warning / red flag ── */
  warningBox: {
    backgroundColor: "#FEF2F2",
    borderLeftWidth: 3,
    borderLeftColor: COLORS.R,
    padding: 10,
    borderRadius: 4,
    marginBottom: 14,
  },
  warningText: {
    fontFamily: FONTS.body,
    fontSize: 9.5,
    color: COLORS.R,
    lineHeight: 1.5,
  },
  redFlagBox: {
    backgroundColor: COLORS.cardBg,
    borderLeftWidth: 3,
    padding: 10,
    borderRadius: 4,
    marginBottom: 14,
  },
  redFlagLabel: {
    fontFamily: FONTS.mono,
    fontSize: 7,
    letterSpacing: 2,
    textTransform: "uppercase",
    marginBottom: 4,
  },
  redFlagText: {
    fontFamily: FONTS.body,
    fontSize: 9.5,
    color: COLORS.textSecondary,
    lineHeight: 1.5,
  },

  /* ── Factor table ── */
  factorRow: {
    flexDirection: "row",
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.borderLight,
    paddingVertical: 8,
  },
  factorName: {
    width: 90,
    fontFamily: FONTS.body,
    fontSize: 9,
    fontWeight: 700,
    color: COLORS.textPrimary,
    lineHeight: 1.4,
  },
  factorDesc: {
    flex: 1,
    fontFamily: FONTS.body,
    fontSize: 9,
    color: COLORS.textSecondary,
    lineHeight: 1.45,
    paddingRight: 6,
  },
  factorQuestion: {
    width: 160,
    fontFamily: FONTS.heading,
    fontSize: 8.5,
    fontStyle: "italic",
    color: COLORS.textMuted,
    lineHeight: 1.4,
  },
  factorCritical: {
    fontFamily: FONTS.mono,
    fontSize: 7,
    color: COLORS.R,
    marginTop: 2,
  },
  tableHeader: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderMedium,
    paddingBottom: 6,
    marginBottom: 2,
  },
  tableHeaderText: {
    fontFamily: FONTS.mono,
    fontSize: 7,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    color: COLORS.textMuted,
  },

  /* ── Rule box ── */
  ruleBox: {
    backgroundColor: COLORS.darkBg,
    padding: 14,
    borderRadius: 4,
    marginTop: 12,
    marginBottom: 8,
  },
  ruleText: {
    fontFamily: FONTS.body,
    fontSize: 10,
    fontWeight: 700,
    color: COLORS.textOnDark,
    textAlign: "center",
    lineHeight: 1.5,
  },

  /* ── Body text ── */
  body: {
    fontFamily: FONTS.body,
    fontSize: 10.5,
    color: COLORS.textSecondary,
    lineHeight: 1.65,
    marginBottom: SPACING.paragraphGap,
  },
  h2: {
    fontFamily: FONTS.heading,
    fontSize: 18,
    fontWeight: 700,
    color: COLORS.textPrimary,
    marginBottom: 10,
    lineHeight: 1.3,
  },

  /* ── C explanation ── */
  cExplainBox: {
    backgroundColor: COLORS.cardBg,
    borderWidth: 1,
    borderColor: COLORS.C,
    padding: 14,
    borderRadius: 6,
    marginBottom: SPACING.sectionGap,
  },
  cExplainText: {
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

/* ── Helper: render a factor table for a variable ── */
function FactorTable({
  factors,
  color,
}: {
  factors: { name: string; desc: string; question: string; critical?: boolean }[];
  color: string;
}) {
  return (
    <View>
      <View style={s.tableHeader}>
        <Text style={[s.tableHeaderText, { width: 90 }]}>Sub-factor</Text>
        <Text style={[s.tableHeaderText, { flex: 1 }]}>Descriere</Text>
        <Text style={[s.tableHeaderText, { width: 160 }]}>{"\u00centrebare critic\u0103"}</Text>
      </View>
      {factors.map((f, i) => (
        <View key={i} style={s.factorRow}>
          <View style={{ width: 90 }}>
            <Text style={s.factorName}>{f.name}</Text>
            {f.critical && <Text style={s.factorCritical}>CRITIC</Text>}
          </View>
          <Text style={s.factorDesc}>{f.desc}</Text>
          <Text style={s.factorQuestion}>{f.question}</Text>
        </View>
      ))}
    </View>
  );
}

export function Ch03Anatomy() {
  return (
    <>
      {/* ═══════ PAGE 1 — Chapter opener (dark) ═══════ */}
      <Page size={PAGE_SIZE} style={s.openerPage}>
        <View>
          <Text style={s.chapterNum}>{CHAPTER}</Text>
          <Text style={s.chapterTitle}>Anatomia</Text>
          <Text style={s.chapterTitleLight}>Variabilelor</Text>
          <View style={{ width: 40, height: 1, backgroundColor: COLORS.F, marginBottom: 16 }} />
          <Text style={s.chapterDesc}>
            {"Marketingul nu se ghice\u0219te. Se asambleaz\u0103. Fiecare variabil\u0103 R IF C are puncte slabe ascunse. \u0218tii scorul t\u0103u general \u2014 dar \u0219tii exact UNDE pierzi puncte? Deschide fiecare variabil\u0103, verific\u0103 sub-factorii, \u0219i descoper\u0103 piesa defect\u0103 care trage tot scorul \u00een jos."}
          </Text>
        </View>
      </Page>

      {/* ═══════ PAGES 2-3 — R (Relevan\u021ba) ═══════ */}
      <PageShell chapterLabel={CHAPTER}>
        <View style={s.varHeader}>
          <View style={[s.varLetterBox, { backgroundColor: COLORS.R }]}>
            <Text style={s.varLetter}>R</Text>
          </View>
          <View style={s.varTitleBlock}>
            <Text style={s.varTitle}>{"RELEVAN\u021aA"}</Text>
            <Text style={s.varSubtitle}>{"Biletul de intrare \u2014 Cui \u00eei pas\u0103?"}</Text>
          </View>
        </View>

        <View style={s.warningBox}>
          <Text style={s.warningText}>
            {"R\u0103spunsul la \u201eCui?\u201d e \u201etoat\u0103 lumea\u201d? R e automat sub 5. Opre\u0219te-te aici."}
          </Text>
        </View>

        <View style={[s.redFlagBox, { borderLeftColor: COLORS.R }]}>
          <Text style={[s.redFlagLabel, { color: COLORS.R }]}>RED FLAG</Text>
          <Text style={s.redFlagText}>{"Vorbe\u0219ti despre tine, nu despre ei."}</Text>
        </View>

        <FactorTable
          color={COLORS.R}
          factors={[
            { name: "Audien\u021ba", desc: "Buyer persona definit\u0103: v\u00e2rst\u0103, rol, industrie, venit, comportament online. F\u0103r\u0103 ICP (Ideal Customer Profile), targetarea e loterie.", question: "Po\u021bi descrie ICP-ul \u00een 3 propozi\u021bii f\u0103r\u0103 \u201etoat\u0103 lumea\u201d?", critical: true },
            { name: "Timing", desc: "E problema lor #1 ACUM? Black Friday, Q4, cicluri bugetare B2B \u2014 timing-ul dicteaz\u0103 relevan\u021ba campaniei.", question: "Mesajul t\u0103u rezolv\u0103 problema lor #1 ACUM, nu acum 6 luni?" },
            { name: "Etapa din journey", desc: "Rece (nu te cunoa\u0219te), c\u0103ldu\u021b (te urm\u0103re\u0219te), sau fierbinte (gata s\u0103 cumpere)?", question: "\u0218tii dac\u0103 audien\u021ba e rece, c\u0103ldu\u021b\u0103 sau fierbinte \u2014 \u0219i vorbe\u0219ti pe m\u0103sur\u0103?" },
            { name: "Context situa\u021bional", desc: "Sezon, criz\u0103, trend, eveniment din pia\u021b\u0103", question: "Campania \u021bine cont de ce se \u00eent\u00e2mpl\u0103 \u00een pia\u021b\u0103 chiar acum?" },
            { name: "Geografie", desc: "Loca\u021bie, limb\u0103, cultur\u0103 local\u0103", question: "Mesajul e adaptat cultural \u0219i lingvistic pentru pia\u021ba \u021bint\u0103?" },
            { name: "Canal", desc: "LinkedIn pentru B2B, TikTok pentru Gen Z, Google pentru inten\u021bie de c\u0103utare. Canalul gre\u0219it = CPM pl\u0103tit degeaba.", question: "E\u0219ti pe canalul unde audien\u021ba petrece timp, sau pe cel pe care \u00ceL cuno\u0219ti tu?" },
            { name: "Segmentare", desc: "Vorbe\u0219ti cu toat\u0103 lumea sau cu un segment specific?", question: "Vorbe\u0219ti cu un segment specific sau cu \u201eto\u021bi\u201d?", critical: true },
          ]}
        />

        <View style={s.ruleBox}>
          <Text style={s.ruleText}>
            {"Dac\u0103 r\u0103spunsul la \"Cui?\" este \"tuturor\" \u2192 R este automat sub 5."}
          </Text>
        </View>
      </PageShell>

      {/* ═══════ PAGES 4-5 — I (Interesul) ═══════ */}
      <PageShell chapterLabel={CHAPTER}>
        <View style={s.varHeader}>
          <View style={[s.varLetterBox, { backgroundColor: COLORS.I }]}>
            <Text style={s.varLetter}>I</Text>
          </View>
          <View style={s.varTitleBlock}>
            <Text style={s.varTitle}>INTERESUL</Text>
            <Text style={s.varSubtitle}>{"Substan\u021ba \u2014 De ce ar r\u0103m\u00e2ne?"}</Text>
          </View>
        </View>

        <View style={s.warningBox}>
          <Text style={s.warningText}>
            {"Echipa nu poate articula UVP-ul \u00eentr-o propozi\u021bie? I e sub 5. Nu compensa cu F."}
          </Text>
        </View>

        <View style={[s.redFlagBox, { borderLeftColor: COLORS.I }]}>
          <Text style={[s.redFlagLabel, { color: COLORS.I }]}>RED FLAG</Text>
          <Text style={s.redFlagText}>{"Folose\u0219ti cli\u0219ee care nu mai impresioneaz\u0103 pe nimeni."}</Text>
        </View>

        <FactorTable
          color={COLORS.I}
          factors={[
            { name: "Beneficiu unic (USP)", desc: "Ce oferi tu ce nimeni altcineva nu ofer\u0103. Diferen\u021biatorul care face prospectul s\u0103 aleag\u0103 \u00eentre tine \u0219i competi\u021bie.", question: "Po\u021bi spune \u00een 7 cuvinte ce oferi tu \u0219i nimeni altcineva?", critical: true },
            { name: "Curiozitate / Open Loop", desc: "\u00centrebare f\u0103r\u0103 r\u0103spuns, afirma\u021bie incomplet\u0103", question: "Prima propozi\u021bie creeaz\u0103 o \u00eentrebare la care cititorul VREA r\u0103spunsul?", critical: true },
            { name: "Tensiune / Conflict", desc: "Problem\u0103 vs. solu\u021bie, mit vs. realitate", question: "Mesajul prezint\u0103 o durere real\u0103 \u00eenainte de solu\u021bie?" },
            { name: "Promisiune de transformare", desc: "De la X la Y \u00een Z timp", question: "Promisiunea ta e specific\u0103 (\u201ede la X la Y \u00een Z timp\u201d) sau vag\u0103?" },
            { name: "Dovad\u0103 social\u0103", desc: "Numere concrete, testimoniale verificabile, endorsement-uri de autoritate.", question: "Ai testimoniale, numere sau endorsement-uri verificabile?" },
            { name: "Urgen\u021b\u0103 / Scarcitate", desc: "Limitat \u00een timp sau cantitate (autentic\u0103, nu fabricat\u0103)", question: "Urgen\u021ba ta e autentic\u0103 sau fabricat\u0103?" },
            { name: "Controvers\u0103 / Opinie puternic\u0103", desc: "Pozi\u021bie care polarizeaz\u0103 \u0219i atrage aten\u021bie", question: "Ai o pozi\u021bie clar\u0103 sau e\u0219ti neutru ca to\u021bi ceilal\u021bi?" },
            { name: "Noutate / Exclusivitate", desc: "Primul, singurul, nu ai mai v\u0103zut asta", question: "E ceva ce audien\u021ba n-a mai auzit de 100 de ori?" },
            { name: "Storytelling", desc: "Narativ personal, poveste cu arc emo\u021bional", question: "Ai o poveste personal\u0103 care face brandul memorabil?" },
            { name: "Date / Statistici", desc: "Cifre concrete care \u0219ocheaz\u0103 sau surprind", question: "Folose\u0219ti cifre concrete care \u0219ocheaz\u0103 sau surprind?" },
          ]}
        />

        <View style={s.ruleBox}>
          <Text style={s.ruleText}>
            {"Dac\u0103 nu po\u021bi articula interesul \u00eentr-o propozi\u021bie \u2192 I este sub 5."}
          </Text>
        </View>
      </PageShell>

      {/* ═══════ PAGES 6-7 — F (Forma) ═══════ */}
      <PageShell chapterLabel={CHAPTER}>
        <View style={s.varHeader}>
          <View style={[s.varLetterBox, { backgroundColor: COLORS.F }]}>
            <Text style={s.varLetter}>F</Text>
          </View>
          <View style={s.varTitleBlock}>
            <Text style={s.varTitle}>FORMA</Text>
            <Text style={s.varSubtitle}>{"Caroseria \u2014 Cum se simte?"}</Text>
          </View>
        </View>

        <View style={s.warningBox}>
          <Text style={s.warningText}>
            {"F e multiplicator: formatul perfect pentru un mesaj gol e doar Zgomot Estetic."}
          </Text>
        </View>

        <View style={[s.redFlagBox, { borderLeftColor: COLORS.F }]}>
          <Text style={[s.redFlagLabel, { color: COLORS.F }]}>RED FLAG</Text>
          <Text style={s.redFlagText}>{"Blocuri imense de text pe mobil. Nimeni nu cite\u0219te asta."}</Text>
        </View>

        <FactorTable
          color={COLORS.F}
          factors={[
            { name: "Text", desc: "Fiecare cuv\u00e2nt trebuie s\u0103 merite locul pe pagin\u0103. Copy-ul bun e invizibil \u2014 cititorul vede mesajul, nu efortul.", question: "Copy-ul t\u0103u e scanabil \u00een 5 secunde sau e un bloc dens?" },
            { name: "Imagine static\u0103", desc: "O imagine bun\u0103 comunic\u0103 mesajul f\u0103r\u0103 text.", question: "Imaginea comunic\u0103 mesajul chiar f\u0103r\u0103 text?" },
            { name: "Video scurt", desc: "Hook-ul \u00een primele 3 secunde sau pierzi 65%.", question: "Hook-ul apare \u00een primele 3 secunde?" },
            { name: "Video lung", desc: "Func\u021bioneaz\u0103 doar cu structur\u0103: promisiune \u2192 valoare \u2192 direc\u021bie.", question: "Are structur\u0103 intro-con\u021binut-CTA sau e un monolog?" },
            { name: "Audio", desc: "Calitatea sunetului = credibilitate.", question: "Calitatea sunetului e profesional\u0103?" },
            { name: "Carusel / Slideshow", desc: "Fiecare slide: o singur\u0103 idee + un motiv de a da swipe.", question: "Fiecare slide are o singur\u0103 idee \u0219i un motiv de a da swipe?" },
            { name: "Document", desc: "Un PDF neformatat e Diamantul \u00cengropat \u00een form\u0103 pur\u0103.", question: "PDF-ul t\u0103u arat\u0103 profesional?" },
            { name: "Interactiv", desc: "Con\u021binut interactiv = 2x conversii vs pasiv.", question: "Ai calculator, quiz sau tool care implic\u0103 utilizatorul?" },
            { name: "Design / Layout", desc: "Ochiul trebuie s\u0103 urmeze: headline \u2192 beneficiu \u2192 CTA.", question: "Ochiul urmeaz\u0103 natural headline \u2192 body \u2192 CTA?", critical: true },
            { name: "Structur\u0103", desc: "F-pattern: oamenii scaneaz\u0103 \u00een F pe desktop.", question: "Pagina e scanabil\u0103 \u00een 3 secunde?" },
            { name: "CTA", desc: "1 CTA = +266% conversii vs 4+. Buton contrastant, text specific.", question: "Ai UN singur CTA vizibil? (1 CTA = +266% vs 4+.)", critical: true },
          ]}
        />

        <View style={s.ruleBox}>
          <Text style={s.ruleText}>
            {"F e multiplicator \u2014 un format gre\u0219it pentru mesajul potrivit distruge scorul. Un format perfect pentru un mesaj gol e doar \"Zgomot Estetic\"."}
          </Text>
        </View>
      </PageShell>

      {/* ═══════ PAGE 8 — C (Claritatea) ═══════ */}
      <PageShell chapterLabel={CHAPTER}>
        <View style={s.varHeader}>
          <View style={[s.varLetterBox, { backgroundColor: COLORS.C }]}>
            <Text style={s.varLetter}>C</Text>
          </View>
          <View style={s.varTitleBlock}>
            <Text style={s.varTitle}>CLARITATEA</Text>
            <Text style={s.varSubtitle}>{"Verdictul \u2014 C\u00e2t de clar e\u0219ti?"}</Text>
          </View>
        </View>

        <View style={s.warningBox}>
          <Text style={s.warningText}>
            {"C nu se \u201ecreeaz\u0103\u201d \u2014 se deblocheaz\u0103 prin R, I \u0219i F. Dac\u0103 C e sc\u0103zut, problema nu e la C."}
          </Text>
        </View>

        <View style={[s.redFlagBox, { borderLeftColor: COLORS.C }]}>
          <Text style={[s.redFlagLabel, { color: COLORS.C }]}>RED FLAG</Text>
          <Text style={s.redFlagText}>{"Vizitatorii nu pot spune ce vinzi dup\u0103 5 secunde pe pagin\u0103."}</Text>
        </View>

        <FactorTable
          color={COLORS.C}
          factors={[
            { name: "Testul de 5 secunde", desc: "Un str\u0103in \u00een\u021belege CUI e \u0219i CE ofer\u0103?", question: "Arat\u0103 pagina 5 sec unui str\u0103in. Poate spune ce oferi \u0219i cui?", critical: true },
            { name: "Testul de o propozi\u021bie", desc: "Po\u021bi rezuma mesajul \u00een max 10 cuvinte?", question: "Po\u021bi rezuma totul \u00een max 10 cuvinte?" },
            { name: "Zero jargon", desc: "Un copil de 12 ani ar \u00een\u021belege esen\u021ba?", question: "Un copil de 12 ani ar \u00een\u021belege esen\u021ba mesajului t\u0103u?" },
            { name: "Un singur mesaj", desc: "Nu 3 oferte, nu 5 beneficii, UN mesaj principal", question: "Pagina vinde UN lucru sau \u00eencearc\u0103 s\u0103 v\u00e2nd\u0103 5?", critical: true },
            { name: "Consisten\u021b\u0103", desc: "Message match: ad copy = landing page headline = experien\u021ba real\u0103.", question: "Ad-ul promite acela\u0219i lucru ca landing page-ul?" },
            { name: "Absen\u021ba fric\u021biunii", desc: "Clientul nu trebuie s\u0103 \"lucreze\" ca s\u0103 \u00een\u021beleag\u0103", question: "C\u00e2\u021bi pa\u0219i de la \u201einteresat\u201d la \u201eac\u021biune\u201d?" },
            { name: "Ac\u021biune evident\u0103", desc: "Pasul urm\u0103tor e clar f\u0103r\u0103 instruc\u021biuni", question: "Vizitatorul \u0219tie EXACT ce trebuie s\u0103 fac\u0103, f\u0103r\u0103 s\u0103 caute?" },
          ]}
        />

        <View style={s.ruleBox}>
          <Text style={s.ruleText}>
            {"C nu se \"creeaz\u0103\" \u2014 C se deblocheaz\u0103 prin optimizarea R, I \u0219i F."}
          </Text>
        </View>
      </PageShell>

      {/* ═══════ PAGE 9 — C Explanation + Transition ═══════ */}
      <PageShell chapterLabel={CHAPTER}>
        <Text style={s.h2}>{"Cum func\u021bioneaz\u0103 C?"}</Text>

        <View style={s.cExplainBox}>
          <Text style={s.cExplainText}>
            {"C nu se \u201econstruie\u0219te\u201d direct \u2014 C se deblocheaz\u0103 prin optimizarea R, I \u0219i F. Sub-factorii Clarit\u0103\u021bii sunt de fapt TESTE: verific\u0103ri rapide care \u00ee\u021bi spun dac\u0103 R, I \u0219i F converg spre un mesaj clar. Dac\u0103 un test pic\u0103, \u00eentoarce-te la variabila responsabil\u0103."}
          </Text>
        </View>

        {/* Transition */}
        <View style={s.transitionBox}>
          <Text style={s.transitionText}>
            {"Acum \u0219tii din ce piese e compus mesajul t\u0103u. E\u0219ti gata s\u0103-l m\u0103sori?"}
          </Text>
          <Text style={s.transitionCta}>
            {"Capitolul 04: Metodologia de Scoring \u2192"}
          </Text>
        </View>
      </PageShell>
    </>
  );
}

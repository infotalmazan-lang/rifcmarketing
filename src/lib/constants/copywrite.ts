/**
 * Copywrite / Text ADN — Constants
 * 5 AI Agents × 40 Subfactors × Extended Brand Profiles
 */

import type {
  CWAgentKey,
  CWAgentConfig,
  CWBrandField,
  CWFieldMeta,
  CWBrandPreset,
  CWIndustry,
  CWContentType,
  CWSubfactorDesc,
  CWObjectiveWeights,
  ExtendedBrandProfile,
} from "@/types/copywrite";

// ═══════════════════════════════════════════════════════
// AGENT COLORS (from prototype — vibrant palette)
// ═══════════════════════════════════════════════════════

export const CW_AGENT_COLORS: Record<CWAgentKey, { hex: string; rgb: string }> = {
  R:   { hex: "#ef4444", rgb: "239,68,68" },
  I:   { hex: "#f97316", rgb: "249,115,22" },
  F:   { hex: "#a855f7", rgb: "168,85,247" },
  C:   { hex: "#22c55e", rgb: "34,197,94" },
  CTA: { hex: "#3d6bff", rgb: "61,107,255" },
};

// ═══════════════════════════════════════════════════════
// AGENT CONFIGURATIONS
// ═══════════════════════════════════════════════════════

export const CW_AGENTS: Record<CWAgentKey, CWAgentConfig> = {
  R: {
    key: "R",
    name: "Relevanță",
    color: "#ef4444",
    rgb: "239,68,68",
    arcStart: 144, arcEnd: 180, nodeAngle: 162,
    duration: 7000,
    subfactors: [
      "Audience Relevance", "Problem-Solution Fit", "Temporal Context",
      "Platform Fit", "Competitor Diff.", "Hook Relevance", "Market Timing",
    ],
    desc: "Evaluează cât de relevant este conținutul pentru audiența țintă, platformă și context temporal. Un conținut cu relevanță scăzută va fi ignorat indiferent de calitate.",
    tip: "Concentrează-te pe problemele reale ale audienței tale.",
  },
  I: {
    key: "I",
    name: "Interes",
    color: "#f97316",
    rgb: "249,115,22",
    arcStart: 108, arcEnd: 144, nodeAngle: 126,
    duration: 10000,
    subfactors: [
      "Hook Strength", "Emotional Resonance", "Value Proposition",
      "Curiosity Gap", "Novelty Factor", "Narrative Structure",
      "Data/Statistics", "Authority Signals", "Conflict/Tension",
      "Interactive Elem.",
    ],
    desc: "Măsoară capacitatea conținutului de a capta și menține atenția. Include hook-ul, rezonanța emoțională, propunerea de valoare și elementele de curiozitate.",
    tip: "Primele 3 secunde determină 80% din interes.",
  },
  F: {
    key: "F",
    name: "Formă",
    color: "#a855f7",
    rgb: "168,85,247",
    arcStart: 72, arcEnd: 108, nodeAngle: 90,
    duration: 15000,
    subfactors: [
      "Visual Quality", "Typography", "Layout/Hierarchy",
      "Color Psychology", "Media Richness", "Mobile Optim.",
      "Load Speed", "Accessibility", "Brand Consistency",
      "Format Innovation", "Production Value",
    ],
    desc: "Analizează calitatea vizuală, tipografia, structura și optimizarea tehnică. Forma multiplicatoare înseamnă că un conținut excelent într-o formă proastă = 0.",
    tip: "Regula Zero: Dacă F=0, scorul total este zero.",
  },
  C: {
    key: "C",
    name: "Claritate",
    color: "#22c55e",
    rgb: "34,197,94",
    arcStart: 36, arcEnd: 72, nodeAngle: 54,
    duration: 8000,
    subfactors: [
      "Message Clarity", "Single-Idea Focus", "Action Clarity",
      "Benefit Comm.", "Cognitive Load", "Info Architecture",
      "Takeaway Memory",
    ],
    desc: "Evaluează claritatea mesajului, focusul pe o singură idee, acțiunea clară și sarcina cognitivă. Claritatea este rezultatul final al formulei RIFC.",
    tip: "Un mesaj trebuie înțeles în sub 3 secunde.",
  },
  CTA: {
    key: "CTA",
    name: "CTA",
    color: "#3d6bff",
    rgb: "61,107,255",
    arcStart: 0, arcEnd: 36, nodeAngle: 18,
    duration: 5000,
    subfactors: [
      "CTA Clarity", "CTA Urgency", "CTA Specificity",
      "CTA Present", "CTA Type",
    ],
    desc: "Analizează prezența, claritatea, urgența și specificitatea call-to-action-ului. Un CTA bun transformă interesul în acțiune.",
    tip: "CTA-ul trebuie să fie vizibil și specific.",
  },
};

export const CW_AGENT_KEYS: CWAgentKey[] = ["R", "I", "F", "C", "CTA"];

// ═══════════════════════════════════════════════════════
// 40 SUBFACTOR DESCRIPTIONS (d / low / mid / high)
// ═══════════════════════════════════════════════════════

export const CW_SF_DESCRIPTIONS: Record<string, CWSubfactorDesc> = {
  // ─── R: Relevance (7) ───
  "Audience Relevance": {
    d: "Cât de bine se potrivește cu audiența țintă",
    low: "Conținutul nu adresează nevoile audienței sau folosește un limbaj nepotrivit.",
    mid: "Se adresează parțial audienței, dar lipsesc referințe specifice.",
    high: "Vorbește direct audienței, cu limbaj și referințe specifice.",
  },
  "Problem-Solution Fit": {
    d: "Rezolvă o problemă reală a audienței",
    low: "Nu identifică o problemă reală sau soluția e vagă.",
    mid: "Menționează problema dar soluția nu e suficient de concretă.",
    high: "Prezintă clar problema + soluția cu argumente concrete.",
  },
  "Temporal Context": {
    d: "Relevanță în contextul temporal actual",
    low: "Referințe învechite sau irelevante temporal.",
    mid: "Parțial actual, dar fără urgență sau context de timing.",
    high: "Perfect aliniat cu momentul — sezon, trend, eveniment.",
  },
  "Platform Fit": {
    d: "Adaptat la specificul platformei",
    low: "Format/ton nepotrivit pentru platformă.",
    mid: "Respectă parțial convențiile platformei.",
    high: "Nativ pentru platformă: format, ton, lungime, CTA adaptat.",
  },
  "Competitor Diff.": {
    d: "Se diferențiază clar de competitori",
    low: "Mesaj generic, ar putea fi al oricui.",
    mid: "Are elemente de diferențiere dar nu suficient de clare.",
    high: "USP clar, imposibil de confundat cu un competitor.",
  },
  "Hook Relevance": {
    d: "Hook-ul adresează o nevoie reală",
    low: "Hook generic sau clickbait fără substanță.",
    mid: "Hook parțial relevant dar nu suficient de specific.",
    high: "Hook care lovește direct în durerea/nevoia audienței.",
  },
  "Market Timing": {
    d: "Momentul potrivit pe piață",
    low: "Moment greșit — piața nu e pregătită sau subiectul e epuizat.",
    mid: "Timing acceptabil dar fără avantaj de moment.",
    high: "Timing perfect — surfă pe un trend sau nevoie emergentă.",
  },

  // ─── I: Interest (10) ───
  "Hook Strength": {
    d: "Puterea de captare a atenției",
    low: "Nu captează atenția în primele 2 secunde.",
    mid: "Generează interes moderat dar nu oprește scroll-ul.",
    high: "Stop-the-scroll — captează imediat și creează nevoie de a citi mai departe.",
  },
  "Emotional Resonance": {
    d: "Rezonanță emoțională cu audiența",
    low: "Ton plat, nu evocă nicio emoție.",
    mid: "Emoție prezentă dar superficială.",
    high: "Provoacă emoție reală: empatie, entuziasm, urgență, surpriză.",
  },
  "Value Proposition": {
    d: "Propunere de valoare clară",
    low: "Nu e clar ce primește cititorul.",
    mid: "Valoarea e sugerată dar nu explicit articulată.",
    high: "Beneficiul e imediat clar și cuantificabil.",
  },
  "Curiosity Gap": {
    d: "Creează curiozitate",
    low: "Predictibil — cititorul știe deja ce urmează.",
    mid: "Ușoară curiozitate dar fără tensiune narativă.",
    high: "Creează un \"gap\" care obligă la citirea completă.",
  },
  "Novelty Factor": {
    d: "Grad de noutate a conținutului",
    low: "Repetitiv, deja văzut de multe ori.",
    mid: "Abordare parțial nouă pe un subiect cunoscut.",
    high: "Perspectivă fresh, informație nouă sau unghi surprinzător.",
  },
  "Narrative Structure": {
    d: "Structura narativă coerentă",
    low: "Dezorganizat, sare de la o idee la alta.",
    mid: "Structură de bază dar fără flow narativ.",
    high: "Arc narativ clar: hook → dezvoltare → climax → CTA.",
  },
  "Data/Statistics": {
    d: "Folosirea datelor și statisticilor",
    low: "Zero date sau cifre care susțin mesajul.",
    mid: "Câteva date dar fără context sau sursă.",
    high: "Date relevante, din surse credibile, cu context clar.",
  },
  "Authority Signals": {
    d: "Semnale de autoritate și credibilitate",
    low: "Zero credibilitate — cine spune asta și de ce contează?",
    mid: "Câteva semnale (testimonial, cifră) dar incomplete.",
    high: "Dovezi clare: premii, certificări, studii, cifre verificabile.",
  },
  "Conflict/Tension": {
    d: "Tensiune narativă",
    low: "Plat, fără contrast sau tensiune.",
    mid: "Ușoară tensiune dar fără rezoluție.",
    high: "Contrast puternic (before/after, problemă/soluție) care menține atenția.",
  },
  "Interactive Elem.": {
    d: "Elemente interactive sau participative",
    low: "Zero interactivitate sau motiv de engagement.",
    mid: "Un element interactiv dar fără profunzime.",
    high: "Multiple elemente care invită la participare activă.",
  },

  // ─── F: Form (11) ───
  "Visual Quality": {
    d: "Calitatea vizuală generală",
    low: "Vizual slab: imagini blur, fără grafică, neprofesional.",
    mid: "Vizual decent dar generic sau lipsit de identitate.",
    high: "Vizual premium, consistent, profesional, pe brand.",
  },
  "Typography": {
    d: "Tipografie și lizibilitate",
    low: "Font neligibil, mixaj haotic de stiluri.",
    mid: "Lizibil dar fără ierarhie tipografică clară.",
    high: "Ierarhie tipografică clară, consistentă cu brandul.",
  },
  "Layout/Hierarchy": {
    d: "Ierarhie vizuală și layout",
    low: "Informația e amestecată, fără prioritizare.",
    mid: "Structură de bază dar nu ghidează ochiul eficient.",
    high: "Ochiul parcurge natural: titlu → body → CTA, fără efort.",
  },
  "Color Psychology": {
    d: "Psihologia culorilor",
    low: "Culori alese la întâmplare, nu transmit emoția dorită.",
    mid: "Culori OK dar fără strategie psihologică.",
    high: "Culorile susțin emoția: urgență (roșu), trust (albastru), etc.",
  },
  "Media Richness": {
    d: "Diversitatea și calitatea media",
    low: "Text-only sau media de calitate scăzută.",
    mid: "Un tip de media (doar foto sau doar text).",
    high: "Mix de media (foto+grafică+text) care se completează.",
  },
  "Mobile Optim.": {
    d: "Optimizare pentru mobil",
    low: "Nelegibil/nefuncțional pe mobile.",
    mid: "Funcțional dar nu optimizat (fonturi mici, butoane mici).",
    high: "Mobile-first: text lizibil, CTA tap-friendly, format vertical.",
  },
  "Load Speed": {
    d: "Viteza de încărcare",
    low: "Se încarcă lent, pierde audiența.",
    mid: "Viteză acceptabilă dar cu elemente grele.",
    high: "Încărcare instantanee, optimizat pentru rețele lente.",
  },
  "Accessibility": {
    d: "Accesibilitate",
    low: "Excludere activă: fără alt-text, contrast slab.",
    mid: "Parțial accesibil dar cu lacune.",
    high: "Accesibil universal: contrast, alt-text, structură semantică.",
  },
  "Brand Consistency": {
    d: "Consistență cu identitatea de brand",
    low: "Nu se recunoaște brandul — ton, culori, mesaj diferite.",
    mid: "Parțial on-brand dar cu inconsistențe.",
    high: "100% pe brand: ton, vizual, valori — totul coerent.",
  },
  "Format Innovation": {
    d: "Inovație în formatul folosit",
    low: "Format uzat, fără nicio surpriză.",
    mid: "Format standard cu un element diferit.",
    high: "Format care surprinde și se diferențiază pe platformă.",
  },
  "Production Value": {
    d: "Valoarea de producție",
    low: "Pare făcut în grabă, neprofesional.",
    mid: "Producție decentă dar nu impresionează.",
    high: "Calitate premium care transmite: \"acest brand investește\".",
  },

  // ─── C: Clarity (7) ───
  "Message Clarity": {
    d: "Claritatea mesajului principal",
    low: "Mesajul nu e clar nici după citire completă.",
    mid: "Mesajul se înțelege dar necesită efort.",
    high: "Mesajul se înțelege în sub 3 secunde.",
  },
  "Single-Idea Focus": {
    d: "Focus pe o singură idee",
    low: "3+ idei amestecate, confuzie totală.",
    mid: "Idee principală cu digresiuni care distrag.",
    high: "O singură idee puternică, susținută de tot conținutul.",
  },
  "Action Clarity": {
    d: "Claritatea acțiunii dorite",
    low: "Cititorul nu știe ce să facă după.",
    mid: "Acțiunea e sugerată dar nu explicită.",
    high: "Clar ce trebuie făcut, cum, și de ce acum.",
  },
  "Benefit Comm.": {
    d: "Comunicarea beneficiului",
    low: "Listare de features, zero beneficii.",
    mid: "Beneficii menționate dar nu concretizate.",
    high: "Beneficiu clar, cuantificat, relevant pentru audiență.",
  },
  "Cognitive Load": {
    d: "Sarcină cognitivă (mai mic = mai bine)",
    low: "Supraîncărcat — prea mult text, prea multe idei.",
    mid: "Acceptabil dar unele secțiuni sunt dense.",
    high: "Ușor de procesat — informația e segmentată și clară.",
  },
  "Info Architecture": {
    d: "Arhitectura informației",
    low: "Informația e aruncată fără structură.",
    mid: "Structură de bază dar fără flow logic.",
    high: "Flow logic perfect: fiecare secțiune construiește pe precedenta.",
  },
  "Takeaway Memory": {
    d: "Memorabilitatea mesajului",
    low: "Nimic memorabil — uitat imediat.",
    mid: "Un element memorabil dar fără ancoră.",
    high: "Mesaj pe care audiența îl repetă a doua zi.",
  },

  // ─── CTA (5) ───
  "CTA Clarity": {
    d: "Claritatea call-to-action-ului",
    low: "CTA absent sau confuz.",
    mid: "CTA prezent dar vag (\"află mai mult\").",
    high: "CTA clar, specific, cu beneficiu inclus.",
  },
  "CTA Urgency": {
    d: "Urgența call-to-action-ului",
    low: "Zero urgență — nu e motiv să acționezi acum.",
    mid: "Ușoară urgență dar fără deadline sau limită.",
    high: "Urgență reală: deadline, locuri limitate, bonus temporar.",
  },
  "CTA Specificity": {
    d: "Specificitatea CTA",
    low: "CTA generic care ar funcționa pe orice produs.",
    mid: "Parțial specific dar fără detalii concrete.",
    high: "CTA unic pentru acest produs/ofertă/moment.",
  },
  "CTA Present": {
    d: "Prezența vizuală a CTA",
    low: "CTA ascuns sau inexistent vizual.",
    mid: "CTA prezent dar fără contrast sau evidențiere.",
    high: "CTA vizual dominant: contrast, dimensiune, poziție optimă.",
  },
  "CTA Type": {
    d: "Tipul de CTA ales",
    low: "Tip de CTA nepotrivit pentru obiectiv.",
    mid: "Tip acceptabil dar nu optimal.",
    high: "Tip perfect: achiziție/lead/engagement aliniat cu obiectivul.",
  },
};

// ═══════════════════════════════════════════════════════
// BRAND FIELDS (12)
// ═══════════════════════════════════════════════════════

export const CW_BRAND_FIELDS: CWBrandField[] = [
  { key: "logo",        label: "Logo",                type: "text",     icon: "Image" },
  { key: "desc",        label: "Descriere brand",     type: "textarea", icon: "FileText" },
  { key: "tone",        label: "Ton de voce",         type: "text",     icon: "Mic" },
  { key: "audience",    label: "Audiență țintă",      type: "textarea", icon: "Users" },
  { key: "colors",      label: "Culori brand",        type: "text",     icon: "Palette" },
  { key: "font",        label: "Font principal",      type: "text",     icon: "Type" },
  { key: "values",      label: "Valori brand",        type: "textarea", icon: "Gem" },
  { key: "mission",     label: "Misiune",             type: "textarea", icon: "Target" },
  { key: "usp",         label: "USP (Diferențiator)", type: "text",     icon: "Zap" },
  { key: "competitors", label: "Competitori",         type: "text",     icon: "Flag" },
  { key: "keywords",    label: "Cuvinte cheie",       type: "text",     icon: "Key" },
  { key: "avoid",       label: "De evitat",           type: "text",     icon: "Ban" },
];

// ═══════════════════════════════════════════════════════
// BRAND FIELD METADATA (why / example / helpers)
// ═══════════════════════════════════════════════════════

export const CW_FIELD_META: Record<string, CWFieldMeta> = {
  desc: {
    why: "Descrierea brandului este fundația evaluării RIFC. Agenții folosesc această descriere pentru a înțelege CE faci, PENTRU CINE și CUM te diferențiezi. Cu cât descrierea e mai clară, cu atât scorul de Relevanță va fi mai precis.",
    example: "Platformă SaaS B2B care automatizează raportarea financiară pentru startup-uri tech din Europa de Est. Folosim AI pentru a reduce timpul de closing de la 5 zile la 4 ore.",
    placeholder: "Descrie brandul tău: ce faci, pentru cine, cum te diferențiezi, ce problemă rezolvi...",
    helpers: [
      { key: "h_what", label: "Ce faci concret?", why: "AI-ul construiește descrierea pornind de la activitatea principală. Fără asta, rezultatul va fi prea generic.", example: "Vindem software de contabilitate cloud pentru firme mici", placeholder: "Ex: Vindem cursuri online de marketing digital" },
      { key: "h_who", label: "Pentru cine?", why: "Audiența dă direcția tonului și a nivelului de detaliu. AI-ul va adapta limbajul la publicul tău.", example: "Startup-uri tech cu 10-50 angajați din România", placeholder: "Ex: Antreprenori la început de drum, 25-40 ani" },
      { key: "h_how", label: "Cum te diferențiezi?", why: "Diferențiatorul face descrierea unică. Fără el, AI-ul va genera o descriere care ar putea fi a oricui.", example: "Singura platformă cu AI predictiv validat pe 500+ companii", placeholder: "Ex: Am 10 ani experiență și certificări internaționale" },
    ],
  },
  tone: {
    why: "Tonul de voce influențează direct cum agenții RIFC evaluează parametrul Interes. Un conținut scris în tonul greșit va primi scor mic la Emotional Resonance și Hook Strength.",
    example: "Profesional dar prietenos, cu date concrete, evitând jargonul excesiv. Folosim metafore simple și adresare directă cu \"tu\".",
    placeholder: "Descrie cum vorbește brandul tău: formal/informal, serios/jucăuș, tehnic/accesibil...",
    helpers: [
      { key: "h_formal", label: "Nivel formalitate", why: "Nivelul de formalitate determină cuvintele și structurile pe care AI-ul le va folosi.", example: "70% profesional, 30% conversațional", placeholder: "Ex: Foarte informal, prietenos, cu glume" },
      { key: "h_person", label: "Persoana gramaticală", why: "Determină dacă brandul vorbește ca \"noi\", \"eu\" sau adresează direct cu \"tu\".", example: "Noi/Tu, evităm persoana a 3-a", placeholder: "Ex: Persoana I (eu), foarte personal" },
    ],
  },
  audience: {
    why: "Audiența țintă calibrează agentul de Relevanță (R). Fără ea, agenții nu pot evalua dacă mesajul vorbește pe limba audienței. Scorul la Audience Relevance și Problem-Solution Fit depinde direct de asta.",
    example: "Marketing managers (25-45 ani) din companii mid-market românești, cu buget lunar 5K-50K EUR, frustrați de lipsa datelor obiective.",
    placeholder: "Cine este clientul ideal? Vârstă, rol, industrie, dureri, nevoi, comportament...",
    helpers: [
      { key: "h_demo", label: "Demografie", why: "Vârsta, locația și rolul clientului determină nivelul de sofisticare al descrierii generate.", example: "28-42 ani, urban, middle management", placeholder: "Ex: 22-35 ani, studenți și absolvenți" },
      { key: "h_pain", label: "Principala durere", why: "Durerea clientului e cea mai importantă — AI-ul va construi descrierea în jurul soluției.", example: "Nu știu ce conținut funcționează, pierd bani pe postări ineficiente", placeholder: "Ex: Nu știu cum să-mi promovez afacerea online" },
      { key: "h_goal", label: "Ce vor să obțină?", why: "Obiectivul final al clientului determină promisiunea pe care o face brandul tău.", example: "ROI clar pe fiecare postare, date obiective pentru raportare", placeholder: "Ex: Mai mulți clienți și vânzări online" },
    ],
  },
  values: {
    why: "Valorile brand sunt folosite de agentul Claritate (C) pentru a evalua Message Clarity și Single-Idea Focus. Conținutul care reflectă valorile primește scor mai mare la Brand Consistency.",
    example: "Precizie matematică — nu ne bazăm pe intuiție. Transparență — arătăm cum calculăm. Accesibilitate — facem complexul simplu.",
    placeholder: "Care sunt valorile fundamentale ale brandului? Ce principii ghidează tot ce comunicați?",
    helpers: [
      { key: "h_val1", label: "Valoarea #1", why: "Prima valoare definește nucleul brandului. AI-ul va construi totul pornind de la ea.", example: "Inovație — mereu căutăm soluții noi", placeholder: "Ex: Calitate" },
      { key: "h_val2", label: "Valoarea #2", why: "A doua valoare adaugă dimensiune.", example: "Transparență — nu ascundem nimic", placeholder: "Ex: Transparență" },
      { key: "h_val3", label: "Valoarea #3", why: "A treia valoare completează identitatea.", example: "Simplitate — facem complexul accesibil", placeholder: "Ex: Comunitate" },
    ],
  },
  mission: {
    why: "Misiunea brandului dă context global agenților RIFC. Este ancora care verifică dacă fiecare conținut contribuie la obiectivul mare.",
    example: "Transformăm evaluarea marketingului din feeling subiectiv în scor matematic obiectiv, accesibil oricui.",
    placeholder: "Care e misiunea brandului? Ce vreți să schimbați în lume/piață/industrie?",
    helpers: [
      { key: "h_before", label: "Cum e ÎNAINTE de tine?", why: "Starea \"before\" definește problema pe care o rezolvi.", example: "Marketerii ghicesc ce funcționează, bazându-se pe intuiție", placeholder: "Ex: Oamenii nu știu de unde să învețe marketing" },
      { key: "h_after", label: "Cum e DUPĂ ce folosesc produsul?", why: "Starea \"after\" e promisiunea ta.", example: "Au un scor clar 1-10 pentru fiecare conținut, cu recomandări precise", placeholder: "Ex: Au cunoștințe practice și încredere să implementeze" },
    ],
  },
  usp: {
    why: "USP-ul este cel mai important factor pentru Competitor Differentiation (R5). Agenții compară mesajul tău cu ce promit competitorii.",
    example: "Singura platformă de marketing cu 35 subfactori validați academic (publicație OSF + ORCID), nu opinii subiective.",
    placeholder: "Ce te face UNIC? De ce ar alege cineva TU și nu competitorul?",
    helpers: [
      { key: "h_only", label: "Suntem SINGURII care...", why: "Formula \"singurii care\" forțează specificitatea.", example: "...avem validare academică cu publicație peer-reviewed", placeholder: "Ex: ...predăm din experiență reală cu branduri mari" },
      { key: "h_better", label: "Facem X de N ori mai bine", why: "Comparația cantitativă face USP-ul concret și credibil.", example: "10x mai rapid decât auditul manual, cu 35 factori vs 3-5 la competitori", placeholder: "Ex: 3x mai ieftin decât un curs universitar echivalent" },
    ],
  },
  colors: {
    why: "Culorile brand afectează evaluarea Formei (F). Agentul verifică Color Psychology — dacă culorile din conținut se aliniază cu identitatea vizuală declarată.",
    example: "#3d6bff (albastru primar), #0c1120 (dark), #5ef08a (accent verde), #f97316 (CTA orange)",
    placeholder: "Coduri HEX sau nume culori: primar, secundar, accent, CTA...",
    helpers: [],
  },
  font: {
    why: "Fontul principal e verificat de agentul Formă la subfactorul Typography. Consistența tipografică crește scorul.",
    example: "Syne (headings) + DM Mono (body text, date) + Inter (UI elements)",
    placeholder: "Numele fonturilor: heading, body text, accente...",
    helpers: [],
  },
  competitors: {
    why: "Competitorii sunt folosiți la Competitor Differentiation (R5). Agentul verifică dacă mesajul tău se diferențiază clar de ce spun alții pe piață.",
    example: "HubSpot (enterprise, scump), Semrush (SEO-focused, nu evaluează conținut creativ), Grammarly (doar stil/gramatică)",
    placeholder: "Competitori principali: nume + punctul lor forte + slăbiciunea lor...",
    helpers: [],
  },
  keywords: {
    why: "Cuvintele cheie calibrează relevanța semantică. Agentul verifică dacă mesajul conține termenii pe care audiența îi caută.",
    example: "audit marketing, scor conținut, RIFC, diagnostic marketing, evaluare obiectivă, 35 factori",
    placeholder: "Termeni cheie din domeniu pe care audiența îi caută...",
    helpers: [],
  },
  avoid: {
    why: "Listele \"de evitat\" previn greșeli de comunicare. Agentul Claritate scade scorul dacă detectează termeni interzisi sau tonuri nepotrivite.",
    example: "Superlative fără dovezi (\"cel mai bun\"), jargon IT (\"API endpoint\"), promisiuni garantate (\"succes 100%\")",
    placeholder: "Cuvinte, expresii, tonuri sau subiecte de evitat în comunicare...",
    helpers: [],
  },
  logo: {
    why: "",
    example: "",
    placeholder: "",
    helpers: [],
  },
};

// ═══════════════════════════════════════════════════════
// DEFAULT BRANDS
// ═══════════════════════════════════════════════════════

const EMPTY_BRAND: ExtendedBrandProfile = {
  logo: "", desc: "", tone: "", audience: "", colors: "", font: "",
  values: "", mission: "", usp: "", competitors: "", keywords: "", avoid: "",
};

export const CW_DEFAULT_BRANDS: Record<string, CWBrandPreset> = {
  rifc: {
    name: "RIFC.AI",
    industry: "EdTech / SaaS",
    data: {
      logo: "Uploaded",
      desc: "Platformă SaaS de diagnostic matematic pentru conținut de marketing. Framework RIFC validat academic.",
      tone: "Profesional, precis, autoritar dar accesibil",
      audience: "Marketing managers, content creators, agenții digitale",
      colors: "#3d6bff, #0c1120, #5ef08a",
      font: "Syne + DM Mono",
      values: "Precizie matematică, Obiectivitate, Inovație",
      mission: "Transformăm evaluarea marketingului din feeling subiectiv în scor obiectiv",
      usp: "Singura platformă cu 35 subfactori validați academic (ORCID + OSF)",
      competitors: "",
      keywords: "RIFC, diagnostic marketing, scor obiectiv, 35 factori",
      avoid: "",
    },
  },
  talmazan: {
    name: "Talmazan School",
    industry: "Educație",
    data: {
      ...EMPTY_BRAND,
      logo: "Uploaded",
      desc: "Școală de marketing și comunicare fondată de Talmazan",
      tone: "Educativ, motivant, personal",
      audience: "Studenți, tineri profesioniști în marketing",
      values: "Educație practică, Excelență",
    },
  },
  continuum: {
    name: "Continuum SRL",
    industry: "Consultanță",
    data: { ...EMPTY_BRAND },
  },
};

// ═══════════════════════════════════════════════════════
// INDUSTRIES (47)
// ═══════════════════════════════════════════════════════

export const CW_INDUSTRIES: CWIndustry[] = [
  { name: "Tehnologie / IT", cat: "Tech" },
  { name: "SaaS / Software", cat: "Tech" },
  { name: "EdTech / SaaS", cat: "Tech" },
  { name: "FinTech", cat: "Tech" },
  { name: "HealthTech", cat: "Tech" },
  { name: "E-commerce", cat: "Retail" },
  { name: "Retail / Magazine", cat: "Retail" },
  { name: "Fashion / Modă", cat: "Retail" },
  { name: "Beauty / Cosmetice", cat: "Retail" },
  { name: "FMCG / Bunuri de consum", cat: "Retail" },
  { name: "Alimentație / Food & Beverage", cat: "Retail" },
  { name: "HoReCa / Restaurante", cat: "Servicii" },
  { name: "Turism / Hospitality", cat: "Servicii" },
  { name: "Imobiliare / Real Estate", cat: "Servicii" },
  { name: "Construcții", cat: "Servicii" },
  { name: "Auto / Automotive", cat: "Industrie" },
  { name: "Energie / Utilities", cat: "Industrie" },
  { name: "Producție / Manufacturing", cat: "Industrie" },
  { name: "Agricultură / AgroTech", cat: "Industrie" },
  { name: "Sănătate / Farma", cat: "Sănătate" },
  { name: "Wellness / Fitness", cat: "Sănătate" },
  { name: "Educație", cat: "Educație" },
  { name: "Educație online / Cursuri", cat: "Educație" },
  { name: "Media / Presă", cat: "Media" },
  { name: "Entertainment / Gaming", cat: "Media" },
  { name: "Marketing / Publicitate", cat: "Servicii" },
  { name: "Agenție digitală", cat: "Servicii" },
  { name: "Consultanță", cat: "Servicii" },
  { name: "Finanțe / Banking", cat: "Finanțe" },
  { name: "Asigurări", cat: "Finanțe" },
  { name: "Crypto / Blockchain", cat: "Finanțe" },
  { name: "Logistică / Transport", cat: "Logistică" },
  { name: "Telecom", cat: "Tech" },
  { name: "ONG / Non-profit", cat: "Social" },
  { name: "Guvern / Administrație publică", cat: "Social" },
  { name: "Legal / Juridic", cat: "Servicii" },
  { name: "HR / Recrutare", cat: "Servicii" },
  { name: "Sport / Fitness", cat: "Sport" },
  { name: "Artă / Design", cat: "Creativ" },
  { name: "Muzică / Audio", cat: "Creativ" },
  { name: "Freelancing / Creatori de conținut", cat: "Creativ" },
  { name: "B2B Services", cat: "B2B" },
  { name: "B2B Industrial", cat: "B2B" },
  { name: "Pet / Animale de companie", cat: "Lifestyle" },
  { name: "Copii / Parenting", cat: "Lifestyle" },
  { name: "Evenimente / Organizare", cat: "Servicii" },
];

// ═══════════════════════════════════════════════════════
// CONTENT TYPES
// ═══════════════════════════════════════════════════════

export const CW_CONTENT_TYPES: CWContentType[] = [
  { value: "instagram_reel", label: "Post Instagram / Reel" },
  { value: "text_article",   label: "Text / Articol" },
  { value: "email",          label: "Email marketing" },
  { value: "ad",             label: "Reclamă plătită (Ad)" },
  { value: "landing",        label: "Landing page copy" },
  { value: "script",         label: "Script video" },
  { value: "story_carousel", label: "Story / Carusel" },
];

// ═══════════════════════════════════════════════════════
// OBJECTIVE WEIGHTS (per objective)
// ═══════════════════════════════════════════════════════

export const CW_OBJECTIVE_WEIGHTS: Record<string, CWObjectiveWeights> = {
  awareness:  { R: 80, I: 70, F: 60, C: 75 },
  conversion: { R: 60, I: 80, F: 70, C: 90 },
  engagement: { R: 70, I: 90, F: 80, C: 65 },
  retention:  { R: 65, I: 75, F: 60, C: 85 },
  education:  { R: 75, I: 65, F: 55, C: 80 },
};

// ═══════════════════════════════════════════════════════
// IMPACT AGENTS PER BRAND FIELD
// ═══════════════════════════════════════════════════════

export const CW_FIELD_IMPACT: Record<string, string> = {
  desc:        "R (Relevanță), I (Interes), C (Claritate)",
  tone:        "I (Interes), F (Formă)",
  audience:    "R (Relevanță)",
  colors:      "F (Formă)",
  font:        "F (Formă)",
  values:      "C (Claritate)",
  mission:     "R, I, F, C, CTA — toți",
  usp:         "R (Relevanță), CTA",
  competitors: "R (Relevanță)",
  keywords:    "R (Relevanță), I (Interes)",
  avoid:       "C (Claritate)",
  logo:        "F (Formă)",
};

// ═══════════════════════════════════════════════════════
// INDUSTRY AVERAGES (for benchmark)
// ═══════════════════════════════════════════════════════

export const CW_INDUSTRY_AVERAGES: Record<CWAgentKey, number> = {
  R: 5.8,
  I: 4.5,
  F: 6.2,
  C: 5.0,
  CTA: 4.8,
};

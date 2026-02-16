export type Locale = "ro" | "en" | "ru";

export interface Dictionary {
  nav: {
    sections: { id: string; label: string; submenu?: { id: string; label: string }[] }[];
    langSwitch: string;
  };
  hero: {
    subtitle: string;
    titleLine1: string;
    titleLine2: string;
    titleLine3: string;
    description: string;
  };
  philosophy: {
    chapter: string;
    titlePlain: string;
    titleBold: string;
    /* legacy — used by whitepaper */
    description: string;
    descriptionBold: string;
    cards: { title: string; color: string; desc: string }[];
    /* PUNCT 1 — new title + hook */
    titleLine1: string;
    titleLine2: string;
    subtitle: string;
    hook: string;
    /* PUNCT 2 — intro manifest */
    introHeadline: string;
    introBody1: string;
    introShield: string;
    introBody2: string;
    introBody3: string;
    introCloser1: string;
    introCloser2: string;
    /* PUNCT 3 — central principle card */
    principleLabel: string;
    principleQuote: string;
    principleSub: string;
    /* PUNCT 4 — 3 pillars */
    pillars: {
      id: string;
      label: string;
      color: string;
      statement: string;
      meaningTitle: string;
      meaningBody: string;
      consequenceLabel: string;
      consequenceLine1: string;
      consequenceLine2: string;
      consequenceLine3: string;
    }[];
    /* PUNCT 5 — cannon vs lighthouse */
    beforeLabel: string;
    beforeFramework: string;
    beforeMetaphor: string;
    beforeDesc: string;
    beforeApproach: string;
    beforeQuote: string;
    afterLabel: string;
    afterFramework: string;
    afterMetaphor: string;
    afterDesc: string;
    afterApproach: string;
    afterQuote: string;
    /* PUNCT 6 — stoic note + final quote */
    stoicLabel: string;
    stoicIntro: string;
    stoicBody: string;
    stoicHighlight: string;
    stoicCloser: string;
    finalQuote: string;
    /* PUNCT 7 — transition to Ch02 */
    transitionLine1: string;
    transitionLine2: string;
    transitionCta: string;
    transitionTarget: string;
  };
  equation: {
    chapter: string;
    titlePlain: string;
    titleBold: string;
    /* legacy — used by whitepaper */
    description: string;
    variables: { letter: string; color: string; label: string; desc: string }[];
    maxScoreLabel: string;
    maxScoreNote: string;
    blueprintLabel: string;
    /* PUNCT 1 — new title */
    titleLine1: string;
    titleLine2: string;
    subtitle: string;
    /* PUNCT 2 — equation + I×F illumination */
    illuminationTitle: string;
    illuminationBody1: string;
    illuminationLowLabel: string;
    illuminationLowCalc: string;
    illuminationLowResult: string;
    illuminationHighLabel: string;
    illuminationHighCalc: string;
    illuminationHighResult: string;
    illuminationHighlight: string;
    illuminationBody2: string;
    illuminationCloser: string;
    /* PUNCT 3 — 4 architectural variables */
    archVars: {
      letter: string;
      color: string;
      title: string;
      metaphor: string;
      body: string;
      threshold: string;
    }[];
    /* PUNCT 5 — 2 contrasting scenarios */
    scenariosTitle: string;
    scenario1Label: string;
    scenario1Scores: string;
    scenario1Calc: string;
    scenario1Zone: string;
    scenario1Desc: string;
    scenario2Label: string;
    scenario2Scores: string;
    scenario2Calc: string;
    scenario2Zone: string;
    scenario2Desc: string;
    scenarioDiff: string;
    scenarioConclusion: string;
    /* PUNCT 6 — R additive */
    rAdditiveTitle: string;
    rAdditiveBody: string;
    rAdditiveCalc: string;
    rAdditiveOnPaper: string;
    rAdditiveReality: string;
    rAdditiveGate: string;
    rAdditiveLink: string;
    rAdditiveLinkTarget: string;
    /* PUNCT 7 — transition */
    transitionLine1: string;
    transitionLine2: string;
    transitionLine3: string;
    transitionCta: string;
    transitionTarget: string;
    blueprint: {
      title: string;
      subtitle: string;
      entry: string;
      theGate: string;
      relevanceCheck: string;
      breakerLabel: string;
      rejectLabel: string;
      rejectSub: string;
      pass: string;
      passCheck: string;
      addR: string;
      chamber: string;
      interestCore: string;
      energySource: string;
      formShell: string;
      formMultiplier: string;
      multiplication: string;
      multiplicationSub: string;
      clarity: string;
      clarityOutput: string;
      toLabel: string;
      market: string;
      formula: string;
      formulaDesc: string;
      rZone: string;
      ifZone: string;
      cZone: string;
      titleBlock: string;
      titleBlockSub: string;
      /* Gateway Blueprint views */
      bpHeader: string;
      bpTitle: string;
      views: { name: string; desc: string }[];
      /* SVG labels shared across views */
      svgEntry: string;
      svgTheGate: string;
      svgBreaker: string;
      svgReject: string;
      svgPass: string;
      svgAmplificationChamber: string;
      svgInterestCore: string;
      svgClarity: string;
      svgToMarket: string;
      svgFoundation: string;
      svgFoundationRelevance: string;
      svgFormWall: string;
      svgFormShell: string;
      svgFormArchitecture: string;
      svgInterestInside: string;
      svgClarityBroadcast: string;
      svgMessageEnters: string;
      svgUnderground: string;
      svgCracks: string;
      /* Front Elevation */
      svgFrontElevationFacade: string;
      svgFrontElevationDesc: string;
      svgFrontElevationBlock: string;
      svgFrontElevationBlockSub: string;
      /* Cross-Section */
      svgCrossSectionTitle: string;
      svgCrossSectionDesc: string;
      svgRelevanceFoundation: string;
      svgInterestStructuralCore: string;
      svgCOutput: string;
      svgFShell: string;
      svgICore: string;
      svgRBase: string;
      svgCrossSectionBlock: string;
      svgCrossSectionBlockSub: string;
      svgSectionFormula: string;
      /* Isometric */
      svgIsometricTitle: string;
      svgIsometricDesc: string;
      svgIsometricCaption: string;
      /* Exploded */
      svgExplodedTitle: string;
      svgExplodedDesc: string;
      svgLayer1: string;
      svgLayer2: string;
      svgLayer3: string;
      svgOutput: string;
      svgRelevanceLabel: string;
      svgFoundationGate: string;
      svgInterestLabel: string;
      svgEnergySource: string;
      svgFormLabel: string;
      svgAmplifierShell: string;
      svgBroadcastSignal: string;
      svgMultipliedImpact: string;
      svgStartHere: string;
      svgAddSubstance: string;
      svgAmplifyForm: string;
      svgBroadcastClarity: string;
    };
  };
  anatomy: {
    chapter: string;
    titlePlain: string;
    titleBold: string;
    description: string;
    variables: {
      letter: string;
      color: string;
      title: string;
      subtitle: string;
      warning: string;
      redFlag: string;
      factors: { name: string; desc: string; question: string; critical?: boolean }[];
      rule: string;
    }[];
    cExplanation: string;
    transitionText: string;
    transitionCta: string;
    transitionTarget: string;
  };
  methodology: {
    chapter: string;
    titlePlain: string;
    titleBold: string;
    /* legacy — used by whitepaper */
    description: string;
    tableHeaders: { score: string; clarity: string; status: string; impact: string };
    /* PUNCT 1 — new intro */
    introChallenge: string;
    introScoreGenerous: string;
    introScoreHarsh: string;
    introBody: string;
    /* PUNCT 2 — scoring guide per variable */
    scoringGuideTitle: string;
    scoringGuides: {
      letter: string;
      color: string;
      title: string;
      levels: { range: string; percent: number; desc: string }[];
      warning?: string;
    }[];
    /* PUNCT 3 — live example */
    exampleTitle: string;
    exampleScenario: string;
    exampleR: string;
    exampleI: string;
    exampleF: string;
    exampleResult: string;
    exampleResultZone: string;
    exampleDiagnostic: string;
    exampleImproved: string;
    exampleLift: string;
    /* PUNCT 4 — progress bar labels */
    progressLabels: string[];
    /* PUNCT 5 — action per zone */
    zoneActions: {
      actionLabel: string;
      actionText: string;
    }[];
    /* PUNCT 6 — relevance gate rule */
    gateRuleTitle: string;
    gateRuleIntro: string;
    gateRuleExample: string;
    gateRuleOnPaper: string;
    gateRuleInReality: string;
    gateRuleConclusion: string;
    gateRuleFinal: string;
    /* PUNCT 7 — CTA + transition */
    ctaTitle: string;
    ctaBody: string;
    ctaButton: string;
    ctaOr: string;
    ctaSecondaryLink: string;
    transitionText: string;
    transitionCta: string;
    transitionTarget: string;
  };
  relevanceGate: {
    chapter: string;
    titlePlain: string;
    titleBold: string;
    /* legacy — used by whitepaper */
    description: string;
    rule: string;
    ruleDescription: string;
    exampleLabel: string;
    exampleText: string;
    exampleResult: string;
    /* PUNCT 1 — new label + subtitle */
    safetyLabel: string;
    subtitle: string;
    /* PUNCT 2 — intro anaphora */
    introLines: string[];
    introBreak: string;
    introProtocol: string;
    /* PUNCT 3 — binary rule + toggle */
    binaryRule: string;
    toggleBullets: string[];
    toggleOnLabel: string;
    toggleOffLabel: string;
    /* PUNCT 4 — disaster simulation */
    disasterTitle: string;
    disaster1Scenario: string;
    disaster1OnPaper: string;
    disaster1Reality: string;
    disaster1Verdict: string;
    disaster2Intro: string;
    disaster2OnPaper: string;
    disaster2Reality: string;
    disaster2Verdict: string;
    /* PUNCT 5 — analogies */
    analogiesTitle: string;
    analogies: { icon: string; text: string }[];
    analogiesConclusion: string;
    /* PUNCT 6 — consequences + math */
    consequencesTitle: string;
    consequences: string[];
    mathThresholds: { r: number; equation: string; note: string }[];
    mathConclusion: string;
    /* PUNCT 7 — pre-launch protocol */
    protocolTitle: string;
    protocolQuestions: {
      num: string;
      category: string;
      question: string;
      yes: string;
      warning?: string;
      no: string;
    }[];
    protocolRule: string;
    protocolQuote: string;
    /* PUNCT 8 — ghost archetype link */
    ghostTitle: string;
    ghostBody: string;
    ghostLink: string;
    riskFraming: string;
    /* PUNCT 9 — CTA + transition */
    ctaIntro: string;
    ctaButton: string;
    transitionText: string;
    transitionCta: string;
    transitionTarget: string;
  };
  application: {
    chapter: string;
    titlePlain: string;
    titleBold: string;
    description: string;
    diagnosticTitle: string;
    steps: { num: string; title: string; desc: string }[];
  };
  omnichannel: {
    chapter: string;
    titlePlain: string;
    titleBold: string;
    /* legacy — used by whitepaper */
    description: string;
    perChannel: string;
    addChannel: string;
    addAll: string;
    simulateScore: string;
    selectZone: string;
    channelsActive: string;
    channelsAvailable: string;
    tipTitle: string;
    tipText: string;
    levelCritical: string;
    levelNoise: string;
    levelMedium: string;
    levelSupreme: string;
    relevanceGateWarning: string;
    low: string;
    mid: string;
    high: string;
    ctaAudit: string;
    ctaDiagnostic: string;
    diagnosticTitle: string;
    steps: { num: string; title: string; desc: string }[];
    /* Diagnostic 3 Steps — expanded */
    diagHook: string;
    step1Title: string;
    step1Body: string;
    step1Question: string;
    step2Title: string;
    step2Body: string;
    step2WarningTitle: string;
    step2WarningLine1: string;
    step2WarningLine2: string;
    step2WarningConclusion1: string;
    step2WarningConclusion2: string;
    step3Title: string;
    step3Body: string;
    step3Cycle: string;
    step3Goal: string;
    step3FinalCheck: string;
    /* Before/After example */
    exampleTitle: string;
    exampleBefore: string;
    exampleBeforeEq: string;
    exampleBeforeZone: string;
    exampleStep1: string;
    exampleStep2: string;
    exampleStep3: string;
    exampleAfter: string;
    exampleAfterEq: string;
    exampleAfterZone: string;
    exampleLift: string;
    /* Panic button CTA */
    ctaStuckTitle: string;
    ctaStuckSub: string;
    ctaAuditBtn: string;
    ctaAuditSub: string;
    ctaDiagnosticBtn: string;
    ctaDiagnosticSub: string;
    /* Micro-closer */
    closerLine1: string;
    closerBody: string;
    closerFinal: string;
    /* PUNCT 1 — new intro */
    introShock: string;
    introBody: string;
    introAction: string;
    /* PUNCT 2 — expanded variable descriptions per channel */
    channelVariables: Record<string, {
      r: { desc: string; question: string; redFlag: string };
      i: { desc: string; question: string; redFlag: string };
      f: { desc: string; question: string; redFlag: string };
      c: { desc: string; question: string; redFlag: string };
    }>;
    /* PUNCT 3 — channel summaries + benchmarks */
    channelSummaries: Record<string, {
      summary: string;
      benchmark: string;
      benchmarkValue: number;
      metrics: { label: string; indicator: string }[];
    }>;
    summaryLabel: string;
    keyMetricsLabel: string;
    benchmarkLabel: string;
    selectDetailHint: string;
    /* PUNCT 5 — dynamic diagnosis */
    diagGateActivated: string;
    diagCritical: string;
    diagInefficient: string;
    diagMedium: string;
    diagSupreme: string;
    diagLowestVar: string;
    diagIncrease: string;
    diagJumpTo: string;
    diagTestAudit: string;
    /* PUNCT 6 — per-channel pro tips */
    channelTips: Record<string, string>;
    quickWinLabel: string;
    /* PUNCT 7 — transition CTA */
    transitionLine1: string;
    transitionLine2: string;
    transitionCta: string;
    transitionTarget: string;
  };
  archetypes: {
    chapter: string;
    titlePlain: string;
    titleBold: string;
    titleSubtitle: string;
    description: string;
    simulatorTitle: string;
    simulatorSubtitle: string;
    simulatorEquationLabel: string;
    simulatorGateWarning: string;
    simulatorGateLabel: string;
    simulatorDetectedLabel: string;
    simulatorPresets: { label: string; r: number; i: number; f: number }[];
    simulatorLevels: {
      supreme: string;
      medium: string;
      inefficient: string;
    };
    items: {
      id: string;
      name: string;
      icon: string;
      color: string;
      equation: {
        r: { value: string; dim: boolean };
        i: { value: string; dim: boolean };
        f: { value: string; dim: boolean };
        result: string;
        resultColor: string;
      };
      headline: string;
      symptomLine: string;
      body: string;
      verdict: string;
      caseStudy: string;
      questions: string[];
      expandLabel: string;
    }[];
    /* Oglinda — filter questions between archetypes */
    mirrors: {
      prev: string;
      next: string;
    }[];
    diagnosisTitle: string;
    diagnosisSubtitle: string;
    diagnosisHeaders: { symptom: string; archetype: string; solution: string };
    diagnosisRows: {
      symptom: string;
      archetype: string;
      archetypeVar: string;
      solution: string;
      color: string;
    }[];
    ctaTitle: string;
    ctaHighlight: string;
    ctaBody: string;
    ctaButton: string;
    ctaOr: string;
    ctaSecondaryLink: string;
    caseStudyLabel: string;
    caseStudyBadge: string;
  };
  comparison: {
    chapter: string;
    titlePlain: string;
    titleBold: string;
    description: string;
    limitationLabel: string;
    advantageLabel: string;
    /* PUNCT 1 — new intro */
    subtitle: string;
    introAges: string;
    introNone: string;
    introBuild: string;
    introDiagnose: string;
    introOS1: string;
    introOS2: string;
    introOS3: string;
    /* PUNCT 2 — timeline */
    timelineNodes: { year: string; name: string; type: string }[];
    /* PUNCT 3 — detailed comparisons */
    promiseLabel: string;
    limitLabel: string;
    upgradeLabel: string;
    tabPrefix: string;
    frameworks: {
      id: string;
      name: string;
      year: string;
      promise: string;
      limit: string;
      upgrade: string;
    }[];
    /* PUNCT 4 — matrix */
    matrixHeaders: string[];
    matrixRows: { name: string; cells: boolean[] }[];
    matrixMultiplierNote1: string;
    matrixMultiplierNote2: string;
    /* PUNCT 7 — uniqueness statement */
    uniqueTitle: string;
    uniqueBody: string;
    uniqueFormula1: string;
    uniqueFormula2: string;
    uniqueConclusion1: string;
    uniqueConclusion2: string;
    /* PUNCT 5 — OS visualization */
    osTitle: string;
    osSub: string;
    osInputLabel: string;
    osInputDesc: string;
    osScanLabel: string;
    osScanDesc: string;
    osOutputLabel: string;
    osOutputDesc: string;
    osQuote: string;
    osWarning: string;
    /* PUNCT 6 — StoryBrand example */
    exampleTitle: string;
    exStep1: string;
    exStep1Desc: string;
    exStep2: string;
    exStep2R: string;
    exStep2I: string;
    exStep2F: string;
    exStep3: string;
    exStep3Eq: string;
    exStep3Zone: string;
    exStep3Problem: string;
    exStep4: string;
    exStep4Fix: string;
    exStep4Eq: string;
    exStep4Zone: string;
    exStep4Lift: string;
    exWithout: string;
    exWith: string;
    /* PUNCT 8 — CTA */
    ctaLine1: string;
    ctaLine2: string;
    ctaButton: string;
    /* Transition to Ch08 */
    transitionLine1: string;
    transitionLine2: string;
    transitionCta: string;
    transitionTarget: string;
  };
  implementation: {
    chapter: string;
    titleBold: string;
    titlePlain: string;
    description: string;
    checks: { mark: string; title: string; desc: string }[];
    /* PUNCT 1 — new title */
    titleLine1: string;
    titleLine2: string;
    introLine: string;
    /* PUNCT 2 — golden rule */
    goldenRuleLabel: string;
    goldenRuleLine1: string;
    goldenRuleLine2: string;
    goldenRuleLine3: string;
    goldenRuleLine4: string;
    goldenRuleFooter: string;
    /* PUNCT 3 — timeline */
    timelineTitle: string;
    timelineBars: { variable: string; color: string; minutes: number; label: string }[];
    timelineTotal: string;
    /* PUNCT 4 — audits */
    audits: {
      id: string;
      num: string;
      variable: string;
      label: string;
      color: string;
      time: string;
      brutalQuestion: string;
      whatToCheck: string;
      howToCheck: string[];
      redFlags: string[];
      outputLabel: string;
      outputScale: string;
      indicators: { condition: string; icon: string; action: string }[];
    }[];
    exampleTitle: string;
    exampleScores: string;
    exampleResult: string;
    exampleVerdict: string;
    exampleFix: string;
    /* PUNCT 5 — checklist */
    checklistTitle: string;
    checklistItems: string[];
    checklistPass: string;
    checklistFail: string;
    /* PUNCT 6 — adoption */
    adoptionLabel: string;
    adoptionTitle: string;
    adoptionPairs: { wrong: string; right: string }[];
    adoptionConclusion: string;
    /* PUNCT 7 — tool stack */
    toolStackTitle: string;
    toolStackItems: { audit: string; tools: string }[];
    toolStackFree: string;
    toolStackFreeLink: string;
    toolStackPremium: string;
    toolStackPremiumLink: string;
    /* PUNCT 8 — closer */
    closerLabel: string;
    closerLine1: string;
    closerLine2: string;
    closerLine3: string;
    closerLine4: string;
    ctaPrimary: string;
    ctaSecondary: string;
    /* Transition to Ch09 */
    transitionLine1: string;
    transitionLine2: string;
    transitionCta: string;
    transitionTarget: string;
  };
  caseStudies: {
    chapter: string;
    titlePlain: string;
    titleBold: string;
    description: string;
    labels: {
      before: string;
      after: string;
      showAfter: string;
      showBefore: string;
      diagnostic: string;
      fix: string;
      result: string;
      lesson: string;
      clarityScore: string;
      screenPreview: string;
      headline: string;
      body: string;
      cta: string;
      subject: string;
      screenEmail: string;
      screenLanding: string;
      screenSocial: string;
      relevanceGateFail: string;
      clarity: string;
      relevance: string;
      interest: string;
      form: string;
      afterOptimization: string;
    };
    cases: {
      brand: string;
      industry: string;
      icon: string;
      archetype: string;
      clarityLevel: "critical" | "noise" | "medium" | "supreme";
      before: {
        r: number; i: number; f: number; c: number;
        rJustification: string;
        iJustification: string;
        fJustification: string;
      };
      after: {
        r: number; i: number; f: number; c: number;
        rJustification: string;
        iJustification: string;
        fJustification: string;
      };
      screen: {
        type: "email" | "landing_page" | "social_ad";
        before: { headline: string; body: string; cta: string; subject?: string };
        after: { headline: string; body: string; cta: string; subject?: string };
      };
      diagnosticText: string;
      fixText: string;
      resultText: string;
      lessonText: string;
    }[];
  };
  aiPrompts: {
    chapter: string;
    titlePlain: string;
    titleBold: string;
    description: string;
    /* PUNCT 1 — new title + intro */
    titleLine1: string;
    titleLine2: string;
    introLine1: string;
    introLine2: string;
    introManual: string;
    introAI: string;
    introBody: string;
    introWorks: string;
    /* PUNCT 2 — why AI needs R IF C */
    whyTitle: string;
    whyBody1: string;
    whyHallucination: string;
    whyFormula: string;
    whyLooks: string;
    whyConverts: string;
    whyBody2: string;
    whyResult: string;
    /* PUNCT 3 — visual flow */
    flowInputLabel: string;
    flowInputDesc: string;
    flowInputScore: string;
    flowInputCaption: string;
    flowFilterLabel: string;
    flowFilterChecks: string[];
    flowFilterCaption: string;
    flowOutputLabel: string;
    flowOutputDesc: string;
    flowOutputScore: string;
    flowOutputCaption: string;
    /* PUNCT 4 — 8 prompts */
    prompts: {
      id: string;
      title: string;
      usage: string;
      level: string;
      category: string;
      promptText: string;
      placeholder: string;
      extraPlaceholder?: string;
      hasExample: boolean;
      exampleOutput?: string;
    }[];
    copyBtn: string;
    copiedBtn: string;
    exampleToggle: string;
    /* PUNCT 5 — categories */
    categories: { id: string; label: string; count: number; color: string }[];
    allLabel: string;
    /* PUNCT 6 — prompts vs AI audit */
    vsTitle: string;
    vsPromptsTitle: string;
    vsPromptsBullets: string[];
    vsAuditTitle: string;
    vsAuditBullets: string[];
    vsRecommendation: string;
    /* PUNCT 7 — pro tip */
    proTipLabel: string;
    proTipTitle: string;
    proTipBody: string;
    proTipSetup: string;
    proTipValue: string;
    /* PUNCT 8 — CTA */
    ctaLine1: string;
    ctaLine2: string;
    ctaPrimary: string;
    ctaSecondary: string;
    /* Transition to Ch11 */
    transitionLine1: string;
    transitionLine2: string;
    transitionCta: string;
    transitionTarget: string;
  };
  author: {
    chapter: string;
    name: string;
    nameBold: string;
    bio1: string;
    bio2: string;
    quote: string;
    tags: string[];
    /* PUNCT 1 — new title */
    label: string;
    subtitle: string;
    /* PUNCT 2 — 3 pillars */
    pillars: {
      id: string;
      label: string;
      quote?: string;
      body: string;
      highlight: string;
      color: string;
    }[];
    /* PUNCT 3 — personal element */
    personalBody: string;
    personalHighlight1: string;
    personalHighlight2: string;
    /* PUNCT 4 — signature quote */
    signatureQuote: string;
    signatureAuthor: string;
    /* PUNCT 5 — social proof */
    entity1: string;
    entity1Desc: string;
    entity2: string;
    entity2Desc: string;
    founderLabel: string;
    statsLine: string;
    /* PUNCT 6 — CTA */
    ctaQuestion: string;
    ctaPrimary: string;
    ctaOr: string;
    ctaSecondary: string;
  };
  cta: {
    chapter: string;
    titlePlain: string;
    titleBold: string;
    description: string;
    downloadBtn: string;
    consultingBtn: string;
    calculatorBtn: string;
  };
  footer: {
    copyright: string;
    site: string;
  };
  calculator: {
    chapter: string;
    titlePlain: string;
    titleBold: string;
    description: string;
    rLabel: string;
    iLabel: string;
    fLabel: string;
    belowGate: string;
    channelLabel: string;
    channelPlaceholder: string;
    notesLabel: string;
    notesPlaceholder: string;
    saveLocally: string;
    saved: string;
    copyResult: string;
    copied: string;
    yourScore: string;
    criticalFailure: string;
    relevanceGateTriggered: string;
    diagnosis: string;
    weakest: string;
    strongest: string;
    priority: string;
    priorityNoGate: string;
    priorityWeakR: string;
    priorityWeakI: string;
    priorityWeakF: string;
  };
  consulting: {
    chapter: string;
    titlePlain: string;
    titleBold: string;
    description: string;
    nameLabel: string;
    namePlaceholder: string;
    emailLabel: string;
    emailPlaceholder: string;
    companyLabel: string;
    companyPlaceholder: string;
    budgetLabel: string;
    budgetPlaceholder: string;
    budgetRanges: string[];
    messageLabel: string;
    messagePlaceholder: string;
    sending: string;
    sendRequest: string;
    successTitle: string;
    successMessage: string;
    errorMessage: string;
  };
  login: {
    title: string;
    subtitle: string;
    emailLabel: string;
    emailPlaceholder: string;
    passwordLabel: string;
    passwordPlaceholder: string;
    signingIn: string;
    signIn: string;
    noAccount: string;
    createOne: string;
  };
  register: {
    title: string;
    subtitle: string;
    nameLabel: string;
    namePlaceholder: string;
    emailLabel: string;
    emailPlaceholder: string;
    passwordLabel: string;
    passwordPlaceholder: string;
    creating: string;
    createAccount: string;
    hasAccount: string;
    signIn: string;
  };
  blog: {
    chapter: string;
    titleBold: string;
    description: string;
    noArticles: string;
    minRead: string;
    backToBlog: string;
  };
  resourcesPage: {
    chapter: string;
    titleBold: string;
    description: string;
    download: string;
    comingSoon: string;
    inDevelopment: string;
    resources: { title: string; desc: string; status: "available" | "coming_soon" | "in_development" }[];
  };
  dashboard: {
    label: string;
    welcomePlain: string;
    welcomeBold: string;
    savedCalculations: string;
    bookmarkedArticles: string;
    downloads: string;
    quickActions: string;
    newCalculation: string;
    newCalculationDesc: string;
    browseArticles: string;
    browseArticlesDesc: string;
    overview: string;
    calculations: string;
    bookmarks: string;
    backToSite: string;
    signOut: string;
    historyLabel: string;
    savedCalcTitle: string;
    savedCalcTitleBold: string;
    noCalcYet: string;
    createFirst: string;
    newBtn: string;
    savedLabel: string;
    bookmarkedTitle: string;
    bookmarkedTitleBold: string;
    noBookmarksYet: string;
    browseArticlesLink: string;
    historyDownloads: string;
    downloadHistoryTitle: string;
    downloadHistoryTitleBold: string;
    noDownloadsYet: string;
    browseResources: string;
  };
  notFound: {
    title: string;
    description: string;
    backHome: string;
  };
  data: {
    zones: { name: string; description: string; r: string; i: string; f: string; archetype: string; color: string }[];
    scoreRanges: { min: number; max: number; label: string; status: string; statusColor: string; impact: string }[];
    /* legacy — used by whitepaper */
    comparisons: { model: string; full: string; weakness: string; rifc: string }[];
    aiPrompts: { label: string; text: string }[]; /* legacy — kept for compat */
  };
  diagnosis: {
    criticalFailure: string;
    invisiblePhantom: string;
    aestheticNoise: string;
    buriedDiamond: string;
    weakestVariable: string;
    focusHere: string;
  };
  audit: {
    chapter: string;
    titlePlain: string;
    titleBold: string;
    description: string;
    tabText: string;
    tabUrl: string;
    textPlaceholder: string;
    urlPlaceholder: string;
    channelLabel: string;
    channelPlaceholder: string;
    analyzeBtn: string;
    analyzing: string;
    analyzingMessages: string[];
    resultTitle: string;
    justificationLabel: string;
    recommendationsTitle: string;
    analyzedContent: string;
    copyResult: string;
    copied: string;
    saveLocal: string;
    saved: string;
    reAnalyze: string;
    errorGeneric: string;
    errorUrl: string;
    errorEmpty: string;
    errorRateLimit: string;
    errorNoKey: string;
    tabAudit: string;
    tabRecommendations: string;
    aiDisclaimer: string;
    savePdf: string;
    inputPreview: string;
    tabYoutube: string;
    tabImage: string;
    tabPdf: string;
    youtubePlaceholder: string;
    imageDropzone: string;
    imageDropzoneHint: string;
    pdfDropzone: string;
    pdfDropzoneHint: string;
    errorYoutube: string;
    errorYoutubeNoTranscript: string;
    errorImageTooLarge: string;
    errorImageFormat: string;
    errorPdfTooLarge: string;
    errorPdfTooManyPages: string;
    errorPdfFormat: string;
    previewYoutube: string;
    previewImage: string;
    previewPdf: string;
    previewPages: string;
    removeFile: string;
    channels: { value: string; label: string }[];
  };
}

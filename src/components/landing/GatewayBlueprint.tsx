"use client";

import { useRef, useState, useEffect } from "react";
import { useTranslation } from "@/lib/i18n";
import type { Dictionary } from "@/lib/i18n/types";

type BP = Dictionary["equation"]["blueprint"];

/* ── SVG Views ───────────────────────────────────────────── */

function TopView({ bp }: { bp: BP }) {
  return (
    <svg viewBox="0 0 800 500" className="w-full h-full">
      <defs>
        <pattern id="gridBg1" patternUnits="userSpaceOnUse" width="40" height="40">
          <line x1="0" y1="0" x2="0" y2="40" stroke="#1a3a5c" strokeWidth="0.3" opacity="0.3" />
          <line x1="0" y1="0" x2="40" y2="0" stroke="#1a3a5c" strokeWidth="0.3" opacity="0.3" />
        </pattern>
        <filter id="bpGlow1"><feGaussianBlur stdDeviation="3" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
      </defs>
      <rect x="0" y="0" width="800" height="500" fill="url(#gridBg1)" />
      <rect x="520" y="455" width="270" height="40" fill="none" stroke="#3a6a9c" strokeWidth="1" opacity="0.5" />
      <text x="655" y="472" textAnchor="middle" fill="#3a6a9c" fontSize="8" fontFamily="monospace" letterSpacing="2">{bp.titleBlock}</text>
      <text x="655" y="485" textAnchor="middle" fill="#3a6a9c" fontSize="7" fontFamily="monospace" opacity="0.5">{bp.titleBlockSub}</text>
      <text x="400" y="30" textAnchor="middle" fill="#5a9ad5" fontSize="11" fontFamily="monospace" letterSpacing="4">{bp.views[0].name.toUpperCase()}</text>
      <rect x="60" y="70" width="680" height="370" rx="0" fill="none" stroke="#3a6a9c" strokeWidth="1.5" opacity="0.3" />
      {/* R Gate */}
      <rect x="60" y="130" width="160" height="250" fill="rgba(220,38,38,0.04)" stroke="#DC2626" strokeWidth="2" />
      <rect x="60" y="220" width="10" height="30" fill="#DC2626" opacity="0.3" />
      <rect x="60" y="260" width="10" height="30" fill="#DC2626" opacity="0.3" />
      <path d="M70,220 A30,30 0 0,1 100,220" fill="none" stroke="#DC2626" strokeWidth="0.8" opacity="0.4" strokeDasharray="3,2" />
      <path d="M70,290 A30,30 0 0,0 100,290" fill="none" stroke="#DC2626" strokeWidth="0.8" opacity="0.4" strokeDasharray="3,2" />
      <path d="M25,255 L55,255" fill="none" stroke="#DC2626" strokeWidth="1.5" />
      <path d="M50,250 L58,255 L50,260" fill="#DC2626" />
      <text x="15" y="245" fill="#DC2626" fontSize="8" fontFamily="monospace" opacity="0.6">{bp.svgEntry}</text>
      <text x="140" y="240" textAnchor="middle" fill="#DC2626" fontSize="36" fontFamily="Georgia, serif" fontWeight="300">R</text>
      <text x="140" y="265" textAnchor="middle" fill="#DC2626" fontSize="9" fontFamily="monospace" letterSpacing="1">{bp.svgTheGate}</text>
      <rect x="100" y="310" width="80" height="30" rx="2" fill="none" stroke="#DC2626" strokeWidth="1" opacity="0.5" />
      <line x1="115" y1="325" x2="130" y2="325" stroke="#DC2626" strokeWidth="1.5" opacity="0.7" />
      <line x1="130" y1="325" x2="143" y2="315" stroke="#DC2626" strokeWidth="1.5" opacity="0.7" />
      <circle cx="145" cy="314" r="2.5" fill="none" stroke="#DC2626" strokeWidth="1" opacity="0.7" />
      <text x="140" y="352" textAnchor="middle" fill="#DC2626" fontSize="7" fontFamily="monospace" opacity="0.5">{bp.svgBreaker}</text>
      <path d="M140,370 L140,400 L90,400" fill="none" stroke="#DC2626" strokeWidth="1" opacity="0.3" strokeDasharray="4,3" />
      <text x="75" y="398" textAnchor="end" fill="#DC2626" fontSize="7" fontFamily="monospace" opacity="0.35">{bp.svgReject}</text>
      {/* Passage */}
      <rect x="220" y="225" width="60" height="60" fill="none" stroke="#555" strokeWidth="1" strokeDasharray="4,2" />
      <path d="M225,255 L275,255" fill="none" stroke="#059669" strokeWidth="1" />
      <path d="M270,250 L278,255 L270,260" fill="#059669" opacity="0.5" />
      <text x="250" y="245" textAnchor="middle" fill="#555" fontSize="7" fontFamily="monospace" opacity="0.5">{bp.svgPass}</text>
      {/* I×F Chamber */}
      <rect x="280" y="100" width="280" height="310" fill="rgba(37,99,235,0.02)" stroke="#2563EB" strokeWidth="1.5" />
      <rect x="275" y="95" width="290" height="320" fill="none" stroke="#D97706" strokeWidth="1.5" strokeDasharray="8,4" />
      <text x="420" y="125" textAnchor="middle" fill="#888" fontSize="9" fontFamily="monospace" letterSpacing="2">{bp.svgAmplificationChamber}</text>
      <rect x="330" y="170" width="180" height="170" rx="2" fill="rgba(37,99,235,0.06)" stroke="#2563EB" strokeWidth="1.5" />
      {[200, 230, 260, 290, 310].map(y => (<line key={y} x1="335" y1={y} x2="505" y2={y} stroke="#2563EB" strokeWidth="0.3" opacity="0.3" />))}
      {[360, 390, 420, 450, 480].map(x => (<line key={x} x1={x} y1="175" x2={x} y2="335" stroke="#2563EB" strokeWidth="0.3" opacity="0.3" />))}
      <text x="420" y="215" textAnchor="middle" fill="#2563EB" fontSize="28" fontFamily="Georgia, serif" fontWeight="300">I</text>
      <text x="420" y="300" textAnchor="middle" fill="#2563EB" fontSize="8" fontFamily="monospace" letterSpacing="1" opacity="0.6">{bp.svgInterestCore}</text>
      <path d="M285,255 L295,240 L295,270 Z" fill="rgba(217,119,6,0.2)" stroke="#D97706" strokeWidth="1" />
      <path d="M555,255 L545,240 L545,270 Z" fill="rgba(217,119,6,0.2)" stroke="#D97706" strokeWidth="1" />
      <text x="300" y="155" fill="#D97706" fontSize="16" fontFamily="Georgia, serif">F</text>
      <text x="420" y="380" textAnchor="middle" fill="#888" fontSize="11" fontFamily="monospace">{"\u0049 \u00d7 F"}</text>
      {/* C Output */}
      <path d="M560,255 L600,255" fill="none" stroke="#059669" strokeWidth="2" />
      <path d="M595,250 L603,255 L595,260" fill="#059669" />
      <circle cx="670" cy="255" r="60" fill="rgba(5,150,105,0.05)" stroke="#059669" strokeWidth="2" />
      <path d="M635,270 A40,40 0 0,1 705,270" fill="none" stroke="#059669" strokeWidth="1" opacity="0.3" />
      <line x1="670" y1="255" x2="695" y2="235" stroke="#059669" strokeWidth="1.5" filter="url(#bpGlow1)" />
      <circle cx="670" cy="255" r="3" fill="#059669" />
      <text x="670" y="248" textAnchor="middle" fill="#059669" fontSize="28" fontFamily="Georgia, serif" fontWeight="300" filter="url(#bpGlow1)">C</text>
      <text x="670" y="290" textAnchor="middle" fill="#059669" fontSize="8" fontFamily="monospace" letterSpacing="1" opacity="0.7">{bp.svgClarity}</text>
      <path d="M730,255 L770,255" fill="none" stroke="#059669" strokeWidth="1.5" />
      <path d="M765,250 L773,255 L765,260" fill="#059669" opacity="0.5" />
      <text x="775" y="255" fill="#059669" fontSize="7" fontFamily="monospace" opacity="0.5">{bp.svgToMarket}</text>
      {/* Dimension lines */}
      <line x1="60" y1="60" x2="740" y2="60" stroke="#3a6a9c" strokeWidth="0.5" opacity="0.3" />
      <text x="140" y="56" textAnchor="middle" fill="#3a6a9c" fontSize="7" fontFamily="monospace" opacity="0.4">{bp.rZone}</text>
      <text x="390" y="56" textAnchor="middle" fill="#3a6a9c" fontSize="7" fontFamily="monospace" opacity="0.4">{bp.ifZone}</text>
      <text x="650" y="56" textAnchor="middle" fill="#3a6a9c" fontSize="7" fontFamily="monospace" opacity="0.4">{bp.cZone}</text>
      <text x="400" y="450" textAnchor="middle" fill="#555" fontSize="11" fontFamily="monospace" letterSpacing="2">{bp.formula}</text>
    </svg>
  );
}

function FrontElevation({ bp }: { bp: BP }) {
  return (
    <svg viewBox="0 0 800 520" className="w-full h-full">
      <defs>
        <pattern id="gridFE" patternUnits="userSpaceOnUse" width="40" height="40">
          <line x1="0" y1="0" x2="0" y2="40" stroke="#1a3a5c" strokeWidth="0.3" opacity="0.2" />
          <line x1="0" y1="0" x2="40" y2="0" stroke="#1a3a5c" strokeWidth="0.3" opacity="0.2" />
        </pattern>
        <filter id="feGlow"><feGaussianBlur stdDeviation="4" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
      </defs>
      <rect x="0" y="0" width="800" height="520" fill="url(#gridFE)" />
      <text x="400" y="28" textAnchor="middle" fill="#5a9ad5" fontSize="11" fontFamily="monospace" letterSpacing="4">{bp.svgFrontElevationFacade}</text>
      <text x="400" y="44" textAnchor="middle" fill="#3a6a9c" fontSize="9" fontFamily="monospace" opacity="0.5">{bp.svgFrontElevationDesc}</text>
      <line x1="40" y1="430" x2="760" y2="430" stroke="#3a6a9c" strokeWidth="1" opacity="0.4" />
      <text x="770" y="434" fill="#3a6a9c" fontSize="7" fontFamily="monospace" opacity="0.3">{"\u00b10.00"}</text>
      {/* R Foundation */}
      <rect x="100" y="430" width="600" height="50" fill="rgba(220,38,38,0.08)" stroke="#DC2626" strokeWidth="1.5" />
      {[130, 170, 210, 250, 290, 330, 370, 410, 450, 490, 530, 570, 610, 650].map(x => (
        <line key={x} x1={x} y1="435" x2={x} y2="475" stroke="#DC2626" strokeWidth="0.5" opacity="0.15" />
      ))}
      <text x="400" y="458" textAnchor="middle" fill="#DC2626" fontSize="22" fontFamily="Georgia, serif" fontWeight="300">R</text>
      <text x="400" y="475" textAnchor="middle" fill="#DC2626" fontSize="8" fontFamily="monospace" letterSpacing="2" opacity="0.6">{bp.svgFoundationRelevance}</text>
      <text x="60" y="458" fill="#DC2626" fontSize="7" fontFamily="monospace" opacity="0.4" textAnchor="end">{bp.svgUnderground}</text>
      <text x="60" y="468" fill="#DC2626" fontSize="7" fontFamily="monospace" opacity="0.3" textAnchor="end">{bp.svgCracks}</text>
      {/* Main building facade */}
      <rect x="150" y="140" width="500" height="290" fill="rgba(37,99,235,0.02)" stroke="#2563EB" strokeWidth="1.5" />
      <rect x="140" y="130" width="520" height="300" fill="none" stroke="#D97706" strokeWidth="2" />
      <path d="M140,130 L400,60 L660,130" fill="rgba(217,119,6,0.05)" stroke="#D97706" strokeWidth="2" />
      {/* Columns */}
      {[180, 280, 380, 480, 580].map(x => (
        <g key={x}>
          <rect x={x-8} y="140" width="16" height="280" fill="rgba(217,119,6,0.06)" stroke="#D97706" strokeWidth="1" opacity="0.6" />
          <rect x={x-12} y="135" width="24" height="10" rx="2" fill="none" stroke="#D97706" strokeWidth="0.8" opacity="0.5" />
          <rect x={x-12} y="415" width="24" height="10" rx="1" fill="none" stroke="#D97706" strokeWidth="0.8" opacity="0.5" />
        </g>
      ))}
      <text x="720" y="280" fill="#D97706" fontSize="20" fontFamily="Georgia, serif" fontWeight="300">F</text>
      <text x="720" y="298" fill="#D97706" fontSize="8" fontFamily="monospace" opacity="0.6">{bp.svgFormLabel}</text>
      <text x="720" y="310" fill="#D97706" fontSize="7" fontFamily="monospace" opacity="0.35">{bp.svgFormArchitecture}</text>
      {/* Windows */}
      {[180, 240, 300, 360].map(y => (
        [220, 300, 380, 460, 540].map(x => (
          <g key={`${x}-${y}`}>
            <rect x={x-14} y={y} width="28" height="36" rx="1" fill="rgba(37,99,235,0.08)" stroke="#2563EB" strokeWidth="0.8" opacity="0.5" />
            <rect x={x-10} y={y+4} width="20" height="28" rx="0" fill="rgba(37,99,235,0.04)" />
          </g>
        ))
      ))}
      <text x="400" y="270" textAnchor="middle" fill="#2563EB" fontSize="32" fontFamily="Georgia, serif" fontWeight="300" opacity="0.3">I</text>
      <text x="400" y="295" textAnchor="middle" fill="#2563EB" fontSize="9" fontFamily="monospace" opacity="0.25" letterSpacing="2">{bp.svgInterestInside}</text>
      {/* Main entrance */}
      <rect x="365" y="350" width="70" height="80" rx="3" fill="rgba(220,38,38,0.1)" stroke="#DC2626" strokeWidth="2" />
      <line x1="400" y1="350" x2="400" y2="430" stroke="#DC2626" strokeWidth="1" opacity="0.4" />
      <circle cx="393" cy="395" r="3" fill="none" stroke="#DC2626" strokeWidth="1" opacity="0.6" />
      <circle cx="407" cy="395" r="3" fill="none" stroke="#DC2626" strokeWidth="1" opacity="0.6" />
      <text x="400" y="370" textAnchor="middle" fill="#DC2626" fontSize="10" fontFamily="Georgia, serif">R</text>
      <text x="400" y="382" textAnchor="middle" fill="#DC2626" fontSize="6" fontFamily="monospace" opacity="0.6">{bp.svgTheGate}</text>
      <path d="M400,490 L400,435" fill="none" stroke="#DC2626" strokeWidth="1.5" />
      <path d="M395,440 L400,432 L405,440" fill="#DC2626" />
      <text x="400" y="504" textAnchor="middle" fill="#DC2626" fontSize="8" fontFamily="monospace" opacity="0.5">{bp.svgMessageEnters}</text>
      {/* C Signal on roof */}
      <circle cx="400" cy="60" r="25" fill="rgba(5,150,105,0.08)" stroke="#059669" strokeWidth="1.5" />
      <text x="400" y="66" textAnchor="middle" fill="#059669" fontSize="20" fontFamily="Georgia, serif" filter="url(#feGlow)">C</text>
      {[35, 50, 65].map((r, i) => (
        <path key={r} d={`M${400-r},${55} A${r},${r*0.6} 0 0,0 ${400+r},${55}`} fill="none" stroke="#059669" strokeWidth={1.2 - i * 0.3} opacity={0.4 - i * 0.1} />
      ))}
      <text x="400" y="25" textAnchor="middle" fill="#059669" fontSize="8" fontFamily="monospace" letterSpacing="2" opacity="0.6">{bp.svgClarityBroadcast}</text>
      {/* Height dimensions */}
      <line x1="85" y1="60" x2="85" y2="480" stroke="#3a6a9c" strokeWidth="0.5" opacity="0.3" />
      <text x="80" y="95" textAnchor="end" fill="#3a6a9c" fontSize="7" fontFamily="monospace" opacity="0.3">{bp.cZone}</text>
      <text x="80" y="280" textAnchor="end" fill="#3a6a9c" fontSize="7" fontFamily="monospace" opacity="0.3">{bp.ifZone}</text>
      <text x="80" y="458" textAnchor="end" fill="#3a6a9c" fontSize="7" fontFamily="monospace" opacity="0.3">{bp.rZone}</text>
      <rect x="520" y="478" width="270" height="35" fill="none" stroke="#3a6a9c" strokeWidth="1" opacity="0.5" />
      <text x="655" y="493" textAnchor="middle" fill="#3a6a9c" fontSize="8" fontFamily="monospace" letterSpacing="2">{bp.svgFrontElevationBlock}</text>
      <text x="655" y="505" textAnchor="middle" fill="#3a6a9c" fontSize="7" fontFamily="monospace" opacity="0.5">{bp.svgFrontElevationBlockSub}</text>
    </svg>
  );
}

function CrossSection({ bp }: { bp: BP }) {
  return (
    <svg viewBox="0 0 800 520" className="w-full h-full">
      <defs>
        <pattern id="gridCS" patternUnits="userSpaceOnUse" width="40" height="40">
          <line x1="0" y1="0" x2="0" y2="40" stroke="#1a3a5c" strokeWidth="0.3" opacity="0.2" />
          <line x1="0" y1="0" x2="40" y2="0" stroke="#1a3a5c" strokeWidth="0.3" opacity="0.2" />
        </pattern>
        <pattern id="hatch" patternUnits="userSpaceOnUse" width="8" height="8" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="8" stroke="#DC2626" strokeWidth="0.5" opacity="0.15" />
        </pattern>
        <filter id="csGlow"><feGaussianBlur stdDeviation="3" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
      </defs>
      <rect x="0" y="0" width="800" height="520" fill="url(#gridCS)" />
      <text x="400" y="28" textAnchor="middle" fill="#5a9ad5" fontSize="11" fontFamily="monospace" letterSpacing="4">{bp.svgCrossSectionTitle}</text>
      <text x="400" y="44" textAnchor="middle" fill="#3a6a9c" fontSize="9" fontFamily="monospace" opacity="0.5">{bp.svgCrossSectionDesc}</text>
      <text x="30" y="270" fill="#DC2626" fontSize="10" fontFamily="monospace" fontWeight="600">A</text>
      <line x1="50" y1="270" x2="80" y2="270" stroke="#DC2626" strokeWidth="1.5" strokeDasharray="8,3" />
      <text x="770" y="270" fill="#DC2626" fontSize="10" fontFamily="monospace" fontWeight="600" textAnchor="end">A</text>
      <line x1="720" y1="270" x2="750" y2="270" stroke="#DC2626" strokeWidth="1.5" strokeDasharray="8,3" />
      <line x1="80" y1="400" x2="720" y2="400" stroke="#3a6a9c" strokeWidth="1.5" opacity="0.5" />
      {/* R Foundation */}
      <rect x="100" y="400" width="600" height="70" fill="url(#hatch)" stroke="#DC2626" strokeWidth="2" />
      <rect x="100" y="400" width="600" height="70" fill="rgba(220,38,38,0.05)" />
      {[140, 220, 300, 380, 460, 540, 620, 660].map(x => (
        <rect key={x} x={x} y="410" width="30" height="50" fill="none" stroke="#DC2626" strokeWidth="0.5" opacity="0.2" />
      ))}
      <text x="400" y="438" textAnchor="middle" fill="#DC2626" fontSize="28" fontFamily="Georgia, serif" fontWeight="300">R</text>
      <text x="400" y="460" textAnchor="middle" fill="#DC2626" fontSize="9" fontFamily="monospace" letterSpacing="2">{bp.svgRelevanceFoundation}</text>
      <line x1="200" y1="440" x2="220" y2="440" stroke="#DC2626" strokeWidth="2" opacity="0.6" />
      <line x1="220" y1="440" x2="235" y2="428" stroke="#DC2626" strokeWidth="2" opacity="0.6" />
      <circle cx="237" cy="427" r="3" fill="none" stroke="#DC2626" strokeWidth="1.5" opacity="0.6" />
      <text x="260" y="443" fill="#DC2626" fontSize="7" fontFamily="monospace" opacity="0.5">{"GATE R\u22653"}</text>
      {/* I Internal Structure */}
      <rect x="140" y="160" width="520" height="240" fill="rgba(37,99,235,0.03)" stroke="#2563EB" strokeWidth="2" />
      {[200, 250, 300, 350].map(y => (
        <g key={y}>
          <rect x="145" y={y-4} width="510" height="8" fill="rgba(37,99,235,0.08)" stroke="#2563EB" strokeWidth="0.8" />
          <line x1="145" y1={y-4} x2="655" y2={y-4} stroke="#2563EB" strokeWidth="0.5" opacity="0.3" />
          <line x1="145" y1={y+4} x2="655" y2={y+4} stroke="#2563EB" strokeWidth="0.5" opacity="0.3" />
        </g>
      ))}
      {[180, 300, 420, 540, 620].map(x => (
        <rect key={x} x={x-5} y="165" width="10" height="230" fill="rgba(37,99,235,0.1)" stroke="#2563EB" strokeWidth="0.8" />
      ))}
      <line x1="375" y1="265" x2="375" y2="285" stroke="#2563EB" strokeWidth="3" opacity="0.4" />
      <line x1="388" y1="269" x2="388" y2="281" stroke="#2563EB" strokeWidth="1.5" opacity="0.4" />
      <line x1="401" y1="265" x2="401" y2="285" stroke="#2563EB" strokeWidth="3" opacity="0.4" />
      <line x1="414" y1="269" x2="414" y2="281" stroke="#2563EB" strokeWidth="1.5" opacity="0.4" />
      <text x="400" y="225" textAnchor="middle" fill="#2563EB" fontSize="26" fontFamily="Georgia, serif" fontWeight="300">I</text>
      <text x="400" y="320" textAnchor="middle" fill="#2563EB" fontSize="9" fontFamily="monospace" letterSpacing="2" opacity="0.6">{bp.svgInterestStructuralCore}</text>
      {/* F Outer Wall */}
      <rect x="120" y="110" width="25" height="290" fill="rgba(217,119,6,0.12)" stroke="#D97706" strokeWidth="2" />
      {[130, 150, 170, 190, 210, 230, 250, 270, 290, 310, 330, 350, 370].map(y => (
        <line key={`l${y}`} x1="122" y1={y} x2="143" y2={y+15} stroke="#D97706" strokeWidth="0.5" opacity="0.3" />
      ))}
      <rect x="655" y="110" width="25" height="290" fill="rgba(217,119,6,0.12)" stroke="#D97706" strokeWidth="2" />
      {[130, 150, 170, 190, 210, 230, 250, 270, 290, 310, 330, 350, 370].map(y => (
        <line key={`r${y}`} x1="657" y1={y} x2="678" y2={y+15} stroke="#D97706" strokeWidth="0.5" opacity="0.3" />
      ))}
      <path d="M110,110 L400,65 L690,110" fill="none" stroke="#D97706" strokeWidth="2" />
      <path d="M110,110 L400,65 L690,110 L690,120 L400,75 L110,120 Z" fill="rgba(217,119,6,0.1)" stroke="#D97706" strokeWidth="1" />
      <text x="98" y="260" fill="#D97706" fontSize="16" fontFamily="Georgia, serif" textAnchor="end">F</text>
      <text x="98" y="275" fill="#D97706" fontSize="7" fontFamily="monospace" opacity="0.6" textAnchor="end">{bp.svgFormWall}</text>
      <text x="700" y="260" fill="#D97706" fontSize="16" fontFamily="Georgia, serif">F</text>
      <text x="700" y="275" fill="#D97706" fontSize="7" fontFamily="monospace" opacity="0.6">{bp.svgFormWall}</text>
      {/* C Antenna */}
      <line x1="400" y1="65" x2="400" y2="30" stroke="#059669" strokeWidth="2" />
      <circle cx="400" cy="25" r="8" fill="rgba(5,150,105,0.15)" stroke="#059669" strokeWidth="1.5" filter="url(#csGlow)" />
      <text x="400" y="29" textAnchor="middle" fill="#059669" fontSize="10" fontFamily="Georgia, serif">C</text>
      {[18, 28, 38].map((r, i) => (
        <path key={r} d={`M${400-r},20 A${r},${r*0.5} 0 0,0 ${400+r},20`} fill="none" stroke="#059669" strokeWidth={1 - i * 0.2} opacity={0.4 - i * 0.1} />
      ))}
      <line x1="730" y1="90" x2="730" y2="475" stroke="#3a6a9c" strokeWidth="0.5" opacity="0.3" />
      <text x="745" y="30" fill="#059669" fontSize="8" fontFamily="monospace" opacity="0.5">{bp.svgCOutput}</text>
      <text x="745" y="95" fill="#D97706" fontSize="8" fontFamily="monospace" opacity="0.5">{bp.svgFShell}</text>
      <text x="745" y="270" fill="#2563EB" fontSize="8" fontFamily="monospace" opacity="0.5">{bp.svgICore}</text>
      <text x="745" y="435" fill="#DC2626" fontSize="8" fontFamily="monospace" opacity="0.5">{bp.svgRBase}</text>
      <text x="400" y="500" textAnchor="middle" fill="#555" fontSize="11" fontFamily="monospace" letterSpacing="2">{bp.svgSectionFormula}</text>
      <rect x="520" y="478" width="270" height="35" fill="none" stroke="#3a6a9c" strokeWidth="1" opacity="0.5" />
      <text x="655" y="493" textAnchor="middle" fill="#3a6a9c" fontSize="8" fontFamily="monospace" letterSpacing="2">{bp.svgCrossSectionBlock}</text>
      <text x="655" y="505" textAnchor="middle" fill="#3a6a9c" fontSize="7" fontFamily="monospace" opacity="0.5">{bp.svgCrossSectionBlockSub}</text>
    </svg>
  );
}

function Isometric3D({ bp }: { bp: BP }) {
  return (
    <svg viewBox="0 0 800 560" className="w-full h-full">
      <defs>
        <filter id="isoGlow"><feGaussianBlur stdDeviation="4" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
      </defs>
      <text x="400" y="28" textAnchor="middle" fill="#5a9ad5" fontSize="11" fontFamily="monospace" letterSpacing="4">{bp.svgIsometricTitle}</text>
      <text x="400" y="44" textAnchor="middle" fill="#3a6a9c" fontSize="9" fontFamily="monospace" opacity="0.5">{bp.svgIsometricDesc}</text>
      {/* R Foundation Block */}
      <path d="M200,420 L400,350 L600,420 L400,490 Z" fill="rgba(220,38,38,0.08)" stroke="#DC2626" strokeWidth="1.5" />
      <path d="M200,420 L200,450 L400,520 L400,490 Z" fill="rgba(220,38,38,0.12)" stroke="#DC2626" strokeWidth="1.5" />
      <path d="M600,420 L600,450 L400,520 L400,490 Z" fill="rgba(220,38,38,0.06)" stroke="#DC2626" strokeWidth="1.5" />
      <text x="400" y="445" textAnchor="middle" fill="#DC2626" fontSize="22" fontFamily="Georgia, serif" fontWeight="300">R</text>
      <text x="400" y="465" textAnchor="middle" fill="#DC2626" fontSize="7" fontFamily="monospace" letterSpacing="2" opacity="0.6">{bp.svgFoundation}</text>
      <path d="M260,430 L260,445 L310,458 L310,443 Z" fill="rgba(220,38,38,0.2)" stroke="#DC2626" strokeWidth="1" />
      <text x="285" y="452" textAnchor="middle" fill="#DC2626" fontSize="6" fontFamily="monospace" opacity="0.7">{bp.svgTheGate}</text>
      {/* I Core Structure */}
      <path d="M250,290 L400,230 L550,290 L400,350 Z" fill="rgba(37,99,235,0.06)" stroke="#2563EB" strokeWidth="1.5" />
      <path d="M250,290 L250,410 L400,470 L400,350 Z" fill="rgba(37,99,235,0.1)" stroke="#2563EB" strokeWidth="1.5" />
      <path d="M550,290 L550,410 L400,470 L400,350 Z" fill="rgba(37,99,235,0.04)" stroke="#2563EB" strokeWidth="1.5" />
      <line x1="380" y1="305" x2="380" y2="320" stroke="#2563EB" strokeWidth="2.5" opacity="0.4" />
      <line x1="390" y1="308" x2="390" y2="317" stroke="#2563EB" strokeWidth="1.2" opacity="0.4" />
      <line x1="400" y1="301" x2="400" y2="316" stroke="#2563EB" strokeWidth="2.5" opacity="0.4" />
      <line x1="410" y1="304" x2="410" y2="313" stroke="#2563EB" strokeWidth="1.2" opacity="0.4" />
      <text x="400" y="280" textAnchor="middle" fill="#2563EB" fontSize="18" fontFamily="Georgia, serif" fontWeight="300">I</text>
      <text x="400" y="340" textAnchor="middle" fill="#2563EB" fontSize="7" fontFamily="monospace" letterSpacing="1" opacity="0.5">{bp.svgInterestCore}</text>
      {/* F Outer Shell */}
      <path d="M220,260 L400,190 L580,260 L400,330 Z" fill="none" stroke="#D97706" strokeWidth="2" strokeDasharray="8,4" />
      <path d="M220,260 L220,415 L400,485 L400,330 Z" fill="none" stroke="#D97706" strokeWidth="2" strokeDasharray="8,4" />
      <path d="M580,260 L580,415 L400,485 L400,330 Z" fill="none" stroke="#D97706" strokeWidth="2" strokeDasharray="8,4" />
      <path d="M225,340 L235,330 L235,350 Z" fill="rgba(217,119,6,0.3)" stroke="#D97706" strokeWidth="1" />
      <path d="M575,340 L565,330 L565,350 Z" fill="rgba(217,119,6,0.3)" stroke="#D97706" strokeWidth="1" />
      <text x="195" y="340" fill="#D97706" fontSize="14" fontFamily="Georgia, serif" textAnchor="end">F</text>
      <text x="195" y="355" fill="#D97706" fontSize="7" fontFamily="monospace" opacity="0.5" textAnchor="end">{bp.svgFormShell}</text>
      {/* Roof */}
      <path d="M220,260 L400,140 L580,260" fill="rgba(217,119,6,0.04)" stroke="#D97706" strokeWidth="1.5" />
      <path d="M400,190 L400,140" fill="none" stroke="#D97706" strokeWidth="1" opacity="0.3" />
      {/* C Antenna */}
      <line x1="400" y1="140" x2="400" y2="80" stroke="#059669" strokeWidth="2" />
      <circle cx="400" cy="72" r="10" fill="rgba(5,150,105,0.1)" stroke="#059669" strokeWidth="1.5" filter="url(#isoGlow)" />
      <text x="400" y="77" textAnchor="middle" fill="#059669" fontSize="12" fontFamily="Georgia, serif">C</text>
      {[22, 36, 50, 64].map((r, i) => (
        <path key={r} d={`M${400-r},${68} A${r},${r*0.4} 0 0,0 ${400+r},${68}`} fill="none" stroke="#059669" strokeWidth={1.5 - i * 0.3} opacity={0.5 - i * 0.1} filter="url(#isoGlow)" />
      ))}
      <text x="400" y="52" textAnchor="middle" fill="#059669" fontSize="9" fontFamily="monospace" letterSpacing="2" opacity="0.7">{bp.svgClarity}</text>
      <text x="400" y="42" textAnchor="middle" fill="#059669" fontSize="7" fontFamily="monospace" opacity="0.4">0 — 110</text>
      {/* Entry / Exit arrows */}
      <path d="M120,460 L190,432" fill="none" stroke="#DC2626" strokeWidth="1.5" />
      <path d="M185,437 L193,430 L187,427" fill="#DC2626" />
      <text x="105" y="470" fill="#DC2626" fontSize="8" fontFamily="monospace" opacity="0.6">{bp.svgMessageEnters}</text>
      <path d="M610,430 L680,460" fill="none" stroke="#059669" strokeWidth="1.5" />
      <path d="M675,455 L683,462 L677,465" fill="#059669" />
      <text x="690" y="470" fill="#059669" fontSize="8" fontFamily="monospace" opacity="0.6">{bp.svgToMarket}</text>
      <text x="400" y="530" textAnchor="middle" fill="#555" fontSize="11" fontFamily="monospace" letterSpacing="2">{bp.formula}</text>
      <text x="400" y="548" textAnchor="middle" fill="#444" fontSize="8" fontFamily="monospace" opacity="0.4">{bp.svgIsometricCaption}</text>
    </svg>
  );
}

function ExplodedView({ bp }: { bp: BP }) {
  return (
    <svg viewBox="0 0 800 600" className="w-full h-full">
      <defs>
        <filter id="exGlow"><feGaussianBlur stdDeviation="3" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
      </defs>
      <text x="400" y="28" textAnchor="middle" fill="#5a9ad5" fontSize="11" fontFamily="monospace" letterSpacing="4">{bp.svgExplodedTitle}</text>
      <text x="400" y="44" textAnchor="middle" fill="#3a6a9c" fontSize="9" fontFamily="monospace" opacity="0.5">{bp.svgExplodedDesc}</text>
      {/* Assembly lines */}
      <line x1="400" y1="540" x2="400" y2="475" stroke="#555" strokeWidth="1" strokeDasharray="4,4" opacity="0.3" />
      <line x1="400" y1="425" x2="400" y2="355" stroke="#555" strokeWidth="1" strokeDasharray="4,4" opacity="0.3" />
      <line x1="400" y1="290" x2="400" y2="225" stroke="#555" strokeWidth="1" strokeDasharray="4,4" opacity="0.3" />
      <line x1="400" y1="165" x2="400" y2="110" stroke="#555" strokeWidth="1" strokeDasharray="4,4" opacity="0.3" />
      {/* Layer 4: R Foundation */}
      <path d="M220,510 L400,455 L580,510 L400,565 Z" fill="rgba(220,38,38,0.08)" stroke="#DC2626" strokeWidth="2" />
      <path d="M220,510 L220,540 L400,595 L400,565 Z" fill="rgba(220,38,38,0.12)" stroke="#DC2626" strokeWidth="1.5" />
      <path d="M580,510 L580,540 L400,595 L400,565 Z" fill="rgba(220,38,38,0.06)" stroke="#DC2626" strokeWidth="1.5" />
      <line x1="360" y1="530" x2="380" y2="530" stroke="#DC2626" strokeWidth="2" opacity="0.6" />
      <line x1="380" y1="530" x2="392" y2="520" stroke="#DC2626" strokeWidth="2" opacity="0.6" />
      <circle cx="394" cy="519" r="3" fill="none" stroke="#DC2626" strokeWidth="1.5" opacity="0.6" />
      <text x="400" y="505" textAnchor="middle" fill="#DC2626" fontSize="20" fontFamily="Georgia, serif" fontWeight="300">R</text>
      <text x="660" y="510" fill="#DC2626" fontSize="12" fontFamily="monospace" letterSpacing="1">{bp.svgLayer1}</text>
      <text x="660" y="525" fill="#DC2626" fontSize="9" fontFamily="monospace" opacity="0.6">{bp.svgRelevanceLabel}</text>
      <text x="660" y="538" fill="#DC2626" fontSize="8" fontFamily="monospace" opacity="0.35">{bp.svgFoundationGate}</text>
      <text x="660" y="550" fill="#DC2626" fontSize="8" fontFamily="monospace" opacity="0.35">Score: 1-10</text>
      <line x1="585" y1="525" x2="650" y2="525" stroke="#DC2626" strokeWidth="0.5" opacity="0.3" />
      {/* Layer 3: I Core */}
      <path d="M260,385 L400,335 L540,385 L400,435 Z" fill="rgba(37,99,235,0.06)" stroke="#2563EB" strokeWidth="2" />
      <path d="M260,385 L260,425 L400,475 L400,435 Z" fill="rgba(37,99,235,0.1)" stroke="#2563EB" strokeWidth="1.5" />
      <path d="M540,385 L540,425 L400,475 L400,435 Z" fill="rgba(37,99,235,0.04)" stroke="#2563EB" strokeWidth="1.5" />
      <line x1="385" y1="375" x2="385" y2="390" stroke="#2563EB" strokeWidth="2" opacity="0.4" />
      <line x1="395" y1="378" x2="395" y2="387" stroke="#2563EB" strokeWidth="1" opacity="0.4" />
      <line x1="405" y1="375" x2="405" y2="390" stroke="#2563EB" strokeWidth="2" opacity="0.4" />
      <text x="400" y="380" textAnchor="middle" fill="#2563EB" fontSize="20" fontFamily="Georgia, serif" fontWeight="300">I</text>
      <text x="660" y="385" fill="#2563EB" fontSize="12" fontFamily="monospace" letterSpacing="1">{bp.svgLayer2}</text>
      <text x="660" y="400" fill="#2563EB" fontSize="9" fontFamily="monospace" opacity="0.6">{bp.svgInterestLabel}</text>
      <text x="660" y="413" fill="#2563EB" fontSize="8" fontFamily="monospace" opacity="0.35">{bp.svgEnergySource}</text>
      <text x="660" y="425" fill="#2563EB" fontSize="8" fontFamily="monospace" opacity="0.35">Score: 1-10</text>
      <line x1="545" y1="400" x2="650" y2="400" stroke="#2563EB" strokeWidth="0.5" opacity="0.3" />
      {/* Layer 2: F Shell */}
      <path d="M230,255 L400,195 L570,255 L400,315 Z" fill="none" stroke="#D97706" strokeWidth="2" strokeDasharray="8,4" />
      <path d="M230,255 L230,295 L400,355 L400,315 Z" fill="rgba(217,119,6,0.04)" stroke="#D97706" strokeWidth="1.5" strokeDasharray="8,4" />
      <path d="M570,255 L570,295 L400,355 L400,315 Z" fill="rgba(217,119,6,0.02)" stroke="#D97706" strokeWidth="1.5" strokeDasharray="8,4" />
      <path d="M238,275 L248,265 L248,285 Z" fill="rgba(217,119,6,0.3)" stroke="#D97706" strokeWidth="1" />
      <path d="M562,275 L552,265 L552,285 Z" fill="rgba(217,119,6,0.3)" stroke="#D97706" strokeWidth="1" />
      <text x="400" y="260" textAnchor="middle" fill="#D97706" fontSize="20" fontFamily="Georgia, serif" fontWeight="300">F</text>
      <text x="660" y="255" fill="#D97706" fontSize="12" fontFamily="monospace" letterSpacing="1">{bp.svgLayer3}</text>
      <text x="660" y="270" fill="#D97706" fontSize="9" fontFamily="monospace" opacity="0.6">{bp.svgFormLabel}</text>
      <text x="660" y="283" fill="#D97706" fontSize="8" fontFamily="monospace" opacity="0.35">{bp.svgAmplifierShell}</text>
      <text x="660" y="295" fill="#D97706" fontSize="8" fontFamily="monospace" opacity="0.35">Score: 1-10</text>
      <line x1="575" y1="270" x2="650" y2="270" stroke="#D97706" strokeWidth="0.5" opacity="0.3" />
      {/* I×F indicator */}
      <text x="130" y="330" fill="#888" fontSize="10" fontFamily="monospace" textAnchor="end">{"I \u00d7 F ="}</text>
      <text x="130" y="345" fill="#888" fontSize="8" fontFamily="monospace" textAnchor="end" opacity="0.5">{bp.svgMultipliedImpact}</text>
      {/* Layer 1: C Antenna */}
      <rect x="385" y="130" width="30" height="35" rx="2" fill="rgba(5,150,105,0.08)" stroke="#059669" strokeWidth="1.5" />
      <line x1="400" y1="130" x2="400" y2="90" stroke="#059669" strokeWidth="2" />
      <circle cx="400" cy="82" r="12" fill="rgba(5,150,105,0.1)" stroke="#059669" strokeWidth="1.5" filter="url(#exGlow)" />
      <text x="400" y="87" textAnchor="middle" fill="#059669" fontSize="12" fontFamily="Georgia, serif">C</text>
      {[22, 36, 50].map((r, i) => (
        <path key={r} d={`M${400-r},${78} A${r},${r*0.4} 0 0,0 ${400+r},${78}`} fill="none" stroke="#059669" strokeWidth={1.2 - i * 0.3} opacity={0.5 - i * 0.12} filter="url(#exGlow)" />
      ))}
      <text x="660" y="105" fill="#059669" fontSize="12" fontFamily="monospace" letterSpacing="1">{bp.svgOutput}</text>
      <text x="660" y="120" fill="#059669" fontSize="9" fontFamily="monospace" opacity="0.6">{bp.svgClarity}</text>
      <text x="660" y="133" fill="#059669" fontSize="8" fontFamily="monospace" opacity="0.35">{bp.svgBroadcastSignal}</text>
      <text x="660" y="145" fill="#059669" fontSize="8" fontFamily="monospace" opacity="0.35">Score: 0-110</text>
      <line x1="420" y1="120" x2="650" y2="120" stroke="#059669" strokeWidth="0.5" opacity="0.3" />
      {/* Build order */}
      <path d="M70,520 L70,130" fill="none" stroke="#555" strokeWidth="1" />
      <path d="M67,135 L70,125 L73,135" fill="#555" />
      <text x="80" y="530" fill="#DC2626" fontSize="9" fontFamily="monospace">{bp.svgStartHere}</text>
      <text x="80" y="405" fill="#2563EB" fontSize="9" fontFamily="monospace">{bp.svgAddSubstance}</text>
      <text x="80" y="275" fill="#D97706" fontSize="9" fontFamily="monospace">{bp.svgAmplifyForm}</text>
      <text x="80" y="115" fill="#059669" fontSize="9" fontFamily="monospace">{bp.svgBroadcastClarity}</text>
      <text x="400" y="585" textAnchor="middle" fill="#555" fontSize="11" fontFamily="monospace" letterSpacing="2">{bp.formula}</text>
    </svg>
  );
}

/* ── View definitions ────────────────────────────────────── */

/* Lucide-style SVG icons (no emoji) */
const icons = [
  <svg key="0" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M19 12l-7 7-7-7" /></svg>,
  <svg key="1" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="2" width="16" height="20" rx="2" /><path d="M9 22v-4h6v4M8 6h.01M16 6h.01M12 6h.01M12 10h.01M8 10h.01M16 10h.01M12 14h.01M8 14h.01M16 14h.01" /></svg>,
  <svg key="2" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="6" cy="6" r="3" /><circle cx="6" cy="18" r="3" /><line x1="20" y1="4" x2="8.12" y2="15.88" /><line x1="14.47" y1="14.48" x2="20" y2="20" /><line x1="8.12" y1="8.12" x2="12" y2="12" /></svg>,
  <svg key="3" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" /><polyline points="3.27 6.96 12 12.01 20.73 6.96" /><line x1="12" y1="22.08" x2="12" y2="12" /></svg>,
  <svg key="4" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2" /><polyline points="2 17 12 22 22 17" /><polyline points="2 12 12 17 22 12" /></svg>,
];

const renderers = [TopView, FrontElevation, CrossSection, Isometric3D, ExplodedView];

/* ── Main Component ──────────────────────────────────────── */

export default function GatewayBlueprint() {
  const { t } = useTranslation();
  const bp = t.equation.blueprint;
  const containerRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const ActiveView = renderers[active];

  return (
    <div
      ref={containerRef}
      className="transition-all duration-700"
      style={{ opacity: inView ? 1 : 0, transform: `translateY(${inView ? 0 : 20}px)` }}
    >
      {/* Header */}
      <div className="text-center mb-4">
        <div className="font-mono text-[10px] tracking-[4px] text-[#5a9ad5] mb-2 uppercase">
          {bp.bpHeader}
        </div>
        <div className="text-[22px] font-light tracking-[-0.5px]">
          {bp.bpTitle.includes("R IF C") ? (
            <>
              {bp.bpTitle.split("R IF C")[0]}
              <span className="text-rifc-red font-semibold">R IF C</span>
              {bp.bpTitle.split("R IF C")[1]}
            </>
          ) : (
            bp.bpTitle
          )}
        </div>
      </div>

      {/* View tabs — NO emoji, Lucide icons only */}
      <div className="flex flex-wrap gap-1.5 justify-center mb-4">
        {bp.views.map((v, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className="flex items-center gap-1.5 px-3 py-2 rounded font-mono text-[11px] tracking-[0.5px] transition-all duration-300 border cursor-pointer"
            style={{
              background: active === i ? "rgba(90,154,213,0.15)" : "rgba(255,255,255,0.02)",
              borderColor: active === i ? "#5a9ad5" : "rgba(255,255,255,0.06)",
              color: active === i ? "#5a9ad5" : "rgba(230,237,243,0.4)",
            }}
          >
            {icons[i]}
            <span className="hidden sm:inline">{v.name}</span>
          </button>
        ))}
      </div>

      {/* Description */}
      <div className="text-center mb-4 font-mono text-[12px] text-text-ghost">
        {bp.views[active].desc}
      </div>

      {/* SVG viewport */}
      <div
        className="border border-border-subtle rounded-sm p-3 md:p-4 bg-[rgba(255,255,255,0.01)] flex items-center justify-center"
        style={{ minHeight: "380px" }}
      >
        <ActiveView bp={bp} />
      </div>
    </div>
  );
}

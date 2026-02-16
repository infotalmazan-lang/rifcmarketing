/* ─── DiagramBlock — Reusable SVG diagram primitives ─── */
/* NOTE: @react-pdf/renderer SVG Text accepts fontSize/fontFamily/fontWeight
   at runtime but the type definitions omit them. We cast via style objects. */

import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Svg,
  Rect,
  Line,
  Circle,
  G,
  Text as SvgText,
  Path,
} from "@react-pdf/renderer";
import { COLORS, FONTS, SPACING } from "../theme";

/* ─── Helper: build SVG text style object with font properties ─── */
type SvgFontStyle = Record<string, unknown>;

function svgFont(
  size: number,
  family: string,
  weight?: number,
): SvgFontStyle {
  return {
    fontSize: size,
    fontFamily: family,
    ...(weight ? { fontWeight: weight } : {}),
  };
}

/* ═══════════════════════════════════════════════════════
   BlueprintDiagram — Simplified gateway blueprint
   3 zones: R Gate -> I x F Amplification -> C Output
   ═══════════════════════════════════════════════════════ */

const blueprintStyles = StyleSheet.create({
  container: {
    marginBottom: SPACING.sectionGap,
    alignItems: "center",
  },
  label: {
    fontFamily: FONTS.mono,
    fontSize: 8,
    letterSpacing: 1,
    textTransform: "uppercase",
    color: COLORS.textMuted,
    marginBottom: 6,
    textAlign: "center",
  },
});

export function BlueprintDiagram() {
  const svgWidth = 440;
  const svgHeight = 100;
  const zoneH = 50;
  const zoneY = 25;
  const zoneW = 110;
  const gap = 25;
  const arrowLen = gap - 6;

  const zone1X = 20;
  const zone2X = zone1X + zoneW + gap;
  const zone3X = zone2X + zoneW + gap;

  const monoLg = svgFont(12, FONTS.mono, 700);
  const bodySm = svgFont(8, FONTS.body);

  return (
    <View style={blueprintStyles.container}>
      <Text style={blueprintStyles.label}>Blueprint — Protocol Flow</Text>
      <Svg width={svgWidth} height={svgHeight} viewBox={`0 0 ${svgWidth} ${svgHeight}`}>
        {/* Zone 1 — R Gate */}
        <Rect
          x={zone1X}
          y={zoneY}
          width={zoneW}
          height={zoneH}
          rx={4}
          fill={COLORS.R + "1A"}
          stroke={COLORS.R}
          strokeWidth={1.5}
        />
        <SvgText
          x={zone1X + zoneW / 2}
          y={zoneY + 20}
          textAnchor="middle"
          fill={COLORS.R}
          style={monoLg as never}
        >
          R Gate
        </SvgText>
        <SvgText
          x={zone1X + zoneW / 2}
          y={zoneY + 36}
          textAnchor="middle"
          fill={COLORS.textMuted}
          style={bodySm as never}
        >
          Relevance Filter
        </SvgText>

        {/* Arrow 1 to 2 */}
        <Line
          x1={zone1X + zoneW + 3}
          y1={zoneY + zoneH / 2}
          x2={zone1X + zoneW + 3 + arrowLen}
          y2={zoneY + zoneH / 2}
          stroke={COLORS.textMuted}
          strokeWidth={1}
        />
        <Path
          d={`M${zone2X - 4},${zoneY + zoneH / 2 - 4} L${zone2X},${zoneY + zoneH / 2} L${zone2X - 4},${zoneY + zoneH / 2 + 4}`}
          stroke={COLORS.textMuted}
          strokeWidth={1}
          fill="none"
        />

        {/* Zone 2 — I x F Amplification */}
        <Rect
          x={zone2X}
          y={zoneY}
          width={zoneW}
          height={zoneH}
          rx={4}
          fill={COLORS.I + "0D"}
          stroke={COLORS.I}
          strokeWidth={1.5}
        />
        <SvgText
          x={zone2X + zoneW / 2}
          y={zoneY + 20}
          textAnchor="middle"
          fill={COLORS.I}
          style={monoLg as never}
        >
          {"I \u00D7 F"}
        </SvgText>
        <SvgText
          x={zone2X + zoneW / 2}
          y={zoneY + 36}
          textAnchor="middle"
          fill={COLORS.textMuted}
          style={bodySm as never}
        >
          Amplification
        </SvgText>

        {/* Arrow 2 to 3 */}
        <Line
          x1={zone2X + zoneW + 3}
          y1={zoneY + zoneH / 2}
          x2={zone2X + zoneW + 3 + arrowLen}
          y2={zoneY + zoneH / 2}
          stroke={COLORS.textMuted}
          strokeWidth={1}
        />
        <Path
          d={`M${zone3X - 4},${zoneY + zoneH / 2 - 4} L${zone3X},${zoneY + zoneH / 2} L${zone3X - 4},${zoneY + zoneH / 2 + 4}`}
          stroke={COLORS.textMuted}
          strokeWidth={1}
          fill="none"
        />

        {/* Zone 3 — C Output */}
        <Rect
          x={zone3X}
          y={zoneY}
          width={zoneW}
          height={zoneH}
          rx={4}
          fill={COLORS.C + "1A"}
          stroke={COLORS.C}
          strokeWidth={1.5}
        />
        <SvgText
          x={zone3X + zoneW / 2}
          y={zoneY + 20}
          textAnchor="middle"
          fill={COLORS.C}
          style={monoLg as never}
        >
          C Output
        </SvgText>
        <SvgText
          x={zone3X + zoneW / 2}
          y={zoneY + 36}
          textAnchor="middle"
          fill={COLORS.textMuted}
          style={bodySm as never}
        >
          Conversion
        </SvgText>
      </Svg>
    </View>
  );
}

/* ═══════════════════════════════════════════════════════
   TimelineDiagram — Horizontal line with dots and labels
   ═══════════════════════════════════════════════════════ */

interface TimelineItem {
  year: string;
  label: string;
  color?: string;
}

interface TimelineDiagramProps {
  items: TimelineItem[];
}

const timelineStyles = StyleSheet.create({
  container: {
    marginBottom: SPACING.sectionGap,
    alignItems: "center",
  },
});

export function TimelineDiagram({ items }: TimelineDiagramProps) {
  const svgWidth = 460;
  const svgHeight = 70;
  const lineY = 25;
  const padX = 30;
  const usableWidth = svgWidth - padX * 2;
  const count = items.length;

  const monoBoldSm = svgFont(8, FONTS.mono, 700);
  const bodyXs = svgFont(7, FONTS.body);

  return (
    <View style={timelineStyles.container}>
      <Svg width={svgWidth} height={svgHeight} viewBox={`0 0 ${svgWidth} ${svgHeight}`}>
        {/* Horizontal baseline */}
        <Line
          x1={padX}
          y1={lineY}
          x2={svgWidth - padX}
          y2={lineY}
          stroke={COLORS.borderMedium}
          strokeWidth={1}
        />

        {/* Dots + labels */}
        {items.map((item, idx) => {
          const x = count === 1
            ? svgWidth / 2
            : padX + (idx / (count - 1)) * usableWidth;
          const dotColor = item.color || COLORS.textMuted;

          return (
            <G key={idx}>
              {/* Dot */}
              <Circle cx={x} cy={lineY} r={5} fill={dotColor} />
              <Circle cx={x} cy={lineY} r={3} fill={COLORS.pageBg} />
              <Circle cx={x} cy={lineY} r={1.5} fill={dotColor} />

              {/* Year above */}
              <SvgText
                x={x}
                y={lineY - 10}
                textAnchor="middle"
                fill={dotColor}
                style={monoBoldSm as never}
              >
                {item.year}
              </SvgText>

              {/* Label below */}
              <SvgText
                x={x}
                y={lineY + 18}
                textAnchor="middle"
                fill={COLORS.textSecondary}
                style={bodyXs as never}
              >
                {item.label}
              </SvgText>
            </G>
          );
        })}
      </Svg>
    </View>
  );
}

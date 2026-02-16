/* ─── ChapterHeader — Full dark page for chapter openers ─── */

import React from "react";
import { Page, View, Text, StyleSheet, Svg, Rect } from "@react-pdf/renderer";
import { COLORS, FONTS, SPACING, PAGE_SIZE } from "../theme";

interface ChapterHeaderProps {
  chapterNumber: string;
  title: string;
  subtitle?: string;
  color: string;
}

const styles = StyleSheet.create({
  page: {
    backgroundColor: COLORS.darkBg,
    paddingHorizontal: SPACING.pageMarginH,
    paddingVertical: SPACING.pageMarginV,
    justifyContent: "center",
    position: "relative",
  },
  content: {
    flex: 1,
    justifyContent: "center",
  },
  bigNumber: {
    fontFamily: FONTS.mono,
    fontSize: 72,
    opacity: 0.15,
    marginBottom: -10,
  },
  chapterLabel: {
    fontFamily: FONTS.mono,
    fontSize: 10,
    letterSpacing: 3,
    textTransform: "uppercase",
    color: COLORS.textOnDarkMuted,
    marginBottom: 12,
  },
  title: {
    fontFamily: FONTS.heading,
    fontSize: 36,
    color: COLORS.textOnDark,
    lineHeight: 1.2,
    marginBottom: 14,
  },
  subtitle: {
    fontFamily: FONTS.body,
    fontSize: 14,
    color: COLORS.textOnDarkMuted,
    lineHeight: 1.6,
    maxWidth: 380,
  },
  bottomBar: {
    position: "absolute",
    bottom: SPACING.pageMarginV,
    left: SPACING.pageMarginH,
    right: SPACING.pageMarginH,
  },
});

export function ChapterHeader({
  chapterNumber,
  title,
  subtitle,
  color,
}: ChapterHeaderProps) {
  return (
    <Page size={PAGE_SIZE} style={styles.page}>
      <View style={styles.content}>
        {/* Large ghost number */}
        <Text style={[styles.bigNumber, { color }]}>
          {chapterNumber}
        </Text>

        {/* Chapter label */}
        <Text style={styles.chapterLabel}>
          Capitolul {chapterNumber}
        </Text>

        {/* Title */}
        <Text style={styles.title}>{title}</Text>

        {/* Subtitle */}
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>

      {/* Bottom color accent bar */}
      <View style={styles.bottomBar}>
        <Svg width="100%" height={3}>
          <Rect x={0} y={0} width="999" height={3} fill={color} />
        </Svg>
      </View>
    </Page>
  );
}

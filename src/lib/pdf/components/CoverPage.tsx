/* ─── CoverPage — Full dark cover for the RIFC White Paper ─── */

import React from "react";
import { Page, View, Text, StyleSheet, Svg, Rect } from "@react-pdf/renderer";
import { COLORS, FONTS, SPACING, PAGE_SIZE } from "../theme";

const styles = StyleSheet.create({
  page: {
    backgroundColor: COLORS.darkBg,
    paddingHorizontal: SPACING.pageMarginH,
    paddingVertical: 0,
    justifyContent: "space-between",
    alignItems: "center",
  },
  topBar: {
    width: "100%",
    marginTop: 0,
  },
  centerBlock: {
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 20,
  },
  formulaRow: {
    flexDirection: "row",
    alignItems: "baseline",
    marginBottom: 24,
  },
  formulaLetter: {
    fontFamily: FONTS.mono,
    fontSize: 48,
  },
  formulaSpace: {
    fontFamily: FONTS.mono,
    fontSize: 48,
    color: COLORS.textOnDarkMuted,
    marginHorizontal: 4,
  },
  title: {
    fontFamily: FONTS.heading,
    fontSize: 28,
    fontWeight: 300,
    color: COLORS.textOnDark,
    textAlign: "center",
    lineHeight: 1.3,
    marginBottom: 14,
  },
  subtitle: {
    fontFamily: FONTS.body,
    fontSize: 14,
    color: COLORS.textOnDarkMuted,
    textAlign: "center",
    marginBottom: 28,
  },
  divider: {
    width: 40,
    height: 1,
    backgroundColor: COLORS.textOnDarkMuted,
    marginBottom: 20,
  },
  author: {
    fontFamily: FONTS.body,
    fontSize: 12,
    color: COLORS.textOnDarkSecondary,
    textAlign: "center",
    letterSpacing: 1,
  },
  bottomBlock: {
    alignItems: "center",
    marginBottom: SPACING.pageMarginV,
  },
  website: {
    fontFamily: FONTS.mono,
    fontSize: 9,
    color: COLORS.textOnDarkMuted,
    letterSpacing: 1,
    marginBottom: 6,
  },
  year: {
    fontFamily: FONTS.mono,
    fontSize: 9,
    color: COLORS.textOnDarkMuted,
    letterSpacing: 2,
  },
});

export function CoverPage() {
  return (
    <Page size={PAGE_SIZE} style={styles.page}>
      {/* Top red accent bar */}
      <View style={styles.topBar}>
        <Svg width="100%" height={3}>
          <Rect x={0} y={0} width="999" height={3} fill={COLORS.R} />
        </Svg>
      </View>

      {/* Center content */}
      <View style={styles.centerBlock}>
        {/* R IF C formula in colored mono */}
        <View style={styles.formulaRow}>
          <Text style={[styles.formulaLetter, { color: COLORS.R }]}>R</Text>
          <Text style={styles.formulaSpace}>{" "}</Text>
          <Text style={[styles.formulaLetter, { color: COLORS.I }]}>I</Text>
          <Text style={[styles.formulaLetter, { color: COLORS.I }]}>F</Text>
          <Text style={styles.formulaSpace}>{" "}</Text>
          <Text style={[styles.formulaLetter, { color: COLORS.C }]}>C</Text>
        </View>

        {/* Title */}
        <Text style={styles.title}>
          Matematica Emo{"\u021B"}ional{"\u0103"} a Marketingului
        </Text>

        {/* Subtitle */}
        <Text style={styles.subtitle}>Un Protocol de Marketing</Text>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Author */}
        <Text style={styles.author}>Dumitru Talmazan</Text>
      </View>

      {/* Bottom */}
      <View style={styles.bottomBlock}>
        <Text style={styles.website}>rifcmarketing.com</Text>
        <Text style={styles.year}>2025</Text>
      </View>
    </Page>
  );
}

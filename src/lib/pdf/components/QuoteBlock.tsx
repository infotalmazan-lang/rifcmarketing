/* ─── QuoteBlock — Blockquote with colored left border ─── */

import React from "react";
import { View, Text, StyleSheet } from "@react-pdf/renderer";
import { COLORS, FONTS, SPACING } from "../theme";

interface QuoteBlockProps {
  text: string;
  attribution?: string;
  color?: string;
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    marginBottom: SPACING.sectionGap,
  },
  border: {
    width: 3,
    borderRadius: 1.5,
    marginRight: 14,
  },
  body: {
    flex: 1,
    paddingVertical: 10,
    paddingRight: 12,
    paddingLeft: 0,
    borderRadius: 4,
  },
  quoteText: {
    fontFamily: FONTS.heading,
    fontSize: 14,
    fontStyle: "italic",
    color: COLORS.textPrimary,
    lineHeight: 1.6,
    marginBottom: 8,
  },
  attribution: {
    fontFamily: FONTS.mono,
    fontSize: 9,
    letterSpacing: 1,
    textTransform: "uppercase",
    color: COLORS.textMuted,
  },
});

export function QuoteBlock({
  text,
  attribution,
  color = COLORS.R,
}: QuoteBlockProps) {
  return (
    <View style={styles.container}>
      {/* Colored left border */}
      <View style={[styles.border, { backgroundColor: color }]} />

      {/* Quote body with tinted background */}
      <View
        style={[
          styles.body,
          { backgroundColor: color + "0D" }, // ~5% opacity hex
        ]}
      >
        <Text style={styles.quoteText}>{text}</Text>
        {attribution && (
          <Text style={styles.attribution}>{attribution}</Text>
        )}
      </View>
    </View>
  );
}

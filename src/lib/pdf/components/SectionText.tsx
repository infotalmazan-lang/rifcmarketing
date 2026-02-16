/* ─── SectionText — Body text block with optional heading ─── */

import React from "react";
import { View, Text, StyleSheet } from "@react-pdf/renderer";
import type { Style } from "@react-pdf/types";
import { COLORS, FONTS, SPACING } from "../theme";

interface SectionTextProps {
  heading?: string;
  body: string | string[];
  headingColor?: string;
}

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.sectionGap,
  },
  heading: {
    fontFamily: FONTS.heading,
    fontSize: 18,
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  paragraph: {
    fontFamily: FONTS.body,
    fontSize: 11,
    color: COLORS.textSecondary,
    lineHeight: 1.7,
    marginBottom: SPACING.paragraphGap,
  },
  lastParagraph: {
    marginBottom: 0,
  },
});

export function SectionText({ heading, body, headingColor }: SectionTextProps) {
  const paragraphs = Array.isArray(body) ? body : [body];

  const headingStyle: Style[] = headingColor
    ? [styles.heading, { color: headingColor }]
    : [styles.heading];

  return (
    <View style={styles.container}>
      {heading && (
        <Text style={headingStyle}>
          {heading}
        </Text>
      )}

      {paragraphs.map((text, idx) => {
        const isLast = idx === paragraphs.length - 1;
        const pStyle: Style[] = isLast
          ? [styles.paragraph, styles.lastParagraph]
          : [styles.paragraph];
        return (
          <Text key={idx} style={pStyle}>
            {text}
          </Text>
        );
      })}
    </View>
  );
}

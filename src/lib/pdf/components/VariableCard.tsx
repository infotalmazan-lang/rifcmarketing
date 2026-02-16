/* ─── VariableCard — Card for a single RIFC variable ─── */

import React from "react";
import { View, Text, StyleSheet } from "@react-pdf/renderer";
import { COLORS, FONTS, SPACING } from "../theme";

interface VariableCardProps {
  letter: string;
  name: string;
  description: string;
  color: string;
  threshold?: string;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    padding: SPACING.cardPadding,
    marginBottom: SPACING.paragraphGap,
  },
  topBorder: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
  },
  letter: {
    fontFamily: FONTS.mono,
    fontSize: 36,
    fontWeight: 700,
    marginBottom: 6,
  },
  name: {
    fontFamily: FONTS.heading,
    fontSize: 14,
    fontWeight: 700,
    color: COLORS.textPrimary,
    marginBottom: 6,
  },
  description: {
    fontFamily: FONTS.body,
    fontSize: 10,
    color: COLORS.textSecondary,
    lineHeight: 1.6,
    marginBottom: 8,
  },
  thresholdBox: {
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    borderWidth: 1,
  },
  thresholdText: {
    fontFamily: FONTS.mono,
    fontSize: 9,
  },
});

export function VariableCard({
  letter,
  name,
  description,
  color,
  threshold,
}: VariableCardProps) {
  return (
    <View style={styles.card}>
      {/* Colored top border */}
      <View style={[styles.topBorder, { backgroundColor: color }]} />

      {/* Letter */}
      <Text style={[styles.letter, { color }]}>{letter}</Text>

      {/* Name */}
      <Text style={styles.name}>{name}</Text>

      {/* Description */}
      <Text style={styles.description}>{description}</Text>

      {/* Threshold badge */}
      {threshold && (
        <View
          style={[
            styles.thresholdBox,
            {
              borderColor: color + "40", // 25% opacity
              backgroundColor: color + "0D", // 5% opacity
            },
          ]}
        >
          <Text style={[styles.thresholdText, { color }]}>{threshold}</Text>
        </View>
      )}
    </View>
  );
}

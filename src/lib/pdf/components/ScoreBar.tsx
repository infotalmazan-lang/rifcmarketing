/* ─── ScoreBar — Horizontal progress bar with label and value ─── */

import React from "react";
import { View, Text, StyleSheet } from "@react-pdf/renderer";
import { COLORS, FONTS, SPACING } from "../theme";

interface ScoreBarProps {
  label: string;
  value: number;
  max: number;
  color: string;
}

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.paragraphGap,
  },
  labelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
    marginBottom: 4,
  },
  label: {
    fontFamily: FONTS.mono,
    fontSize: 9,
    color: COLORS.textSecondary,
  },
  value: {
    fontFamily: FONTS.mono,
    fontSize: 12,
    fontWeight: 700,
  },
  barTrack: {
    height: 8,
    backgroundColor: COLORS.borderLight,
    borderRadius: 4,
    overflow: "hidden",
  },
  barFill: {
    height: 8,
    borderRadius: 4,
  },
});

export function ScoreBar({ label, value, max, color }: ScoreBarProps) {
  const pct = Math.min(Math.max((value / max) * 100, 0), 100);

  return (
    <View style={styles.container}>
      {/* Label + value row */}
      <View style={styles.labelRow}>
        <Text style={styles.label}>{label}</Text>
        <Text style={[styles.value, { color }]}>{value}</Text>
      </View>

      {/* Bar */}
      <View style={styles.barTrack}>
        <View
          style={[
            styles.barFill,
            {
              width: `${pct}%`,
              backgroundColor: color,
            },
          ]}
        />
      </View>
    </View>
  );
}

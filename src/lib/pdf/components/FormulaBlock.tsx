/* ─── FormulaBlock — C = R + (I x F) formula display ─── */

import React from "react";
import { View, Text, StyleSheet } from "@react-pdf/renderer";
import { COLORS, FONTS } from "../theme";

interface FormulaBlockProps {
  r?: number;
  i?: number;
  f?: number;
  c?: number;
  size?: "sm" | "md" | "lg";
}

const SIZES = {
  sm: 12,
  md: 18,
  lg: 28,
} as const;

export function FormulaBlock({
  r,
  i,
  f,
  c,
  size = "md",
}: FormulaBlockProps) {
  const fontSize = SIZES[size];
  const operatorSize = fontSize * 0.8;

  const styles = StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "baseline",
      justifyContent: "center",
      paddingVertical: size === "lg" ? 16 : size === "md" ? 10 : 6,
    },
    variable: {
      fontFamily: FONTS.mono,
      fontSize,
      fontWeight: 700,
    },
    value: {
      fontFamily: FONTS.mono,
      fontSize: fontSize * 0.7,
      fontWeight: 400,
      marginLeft: 2,
    },
    operator: {
      fontFamily: FONTS.mono,
      fontSize: operatorSize,
      color: COLORS.textMuted,
      marginHorizontal: size === "lg" ? 8 : size === "md" ? 5 : 3,
    },
    paren: {
      fontFamily: FONTS.mono,
      fontSize,
      color: COLORS.textMuted,
    },
  });

  const showValues = r !== undefined || i !== undefined || f !== undefined || c !== undefined;

  return (
    <View style={styles.container}>
      {/* C */}
      <Text style={[styles.variable, { color: COLORS.C }]}>C</Text>
      {showValues && c !== undefined && (
        <Text style={[styles.value, { color: COLORS.C }]}>{c}</Text>
      )}

      {/* = */}
      <Text style={styles.operator}>=</Text>

      {/* R */}
      <Text style={[styles.variable, { color: COLORS.R }]}>R</Text>
      {showValues && r !== undefined && (
        <Text style={[styles.value, { color: COLORS.R }]}>{r}</Text>
      )}

      {/* + */}
      <Text style={styles.operator}>+</Text>

      {/* ( */}
      <Text style={styles.paren}>(</Text>

      {/* I */}
      <Text style={[styles.variable, { color: COLORS.I }]}>I</Text>
      {showValues && i !== undefined && (
        <Text style={[styles.value, { color: COLORS.I }]}>{i}</Text>
      )}

      {/* x */}
      <Text style={styles.operator}>{"\u00D7"}</Text>

      {/* F */}
      <Text style={[styles.variable, { color: COLORS.F }]}>F</Text>
      {showValues && f !== undefined && (
        <Text style={[styles.value, { color: COLORS.F }]}>{f}</Text>
      )}

      {/* ) */}
      <Text style={styles.paren}>)</Text>
    </View>
  );
}

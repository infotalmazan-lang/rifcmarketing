/* ─── ChecklistBlock — Checklist items with check/dash indicators ─── */

import React from "react";
import { View, Text, StyleSheet } from "@react-pdf/renderer";
import type { Style } from "@react-pdf/types";
import { COLORS, FONTS, SPACING } from "../theme";

interface ChecklistItem {
  text: string;
  checked?: boolean;
}

interface ChecklistBlockProps {
  items: ChecklistItem[];
}

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.sectionGap,
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: SPACING.smallGap,
  },
  indicator: {
    width: 16,
    height: 16,
    borderRadius: 3,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
    marginTop: 1,
  },
  checkedIndicator: {
    backgroundColor: COLORS.C + "1A",
    borderWidth: 1,
    borderColor: COLORS.C + "40",
  },
  uncheckedIndicator: {
    backgroundColor: COLORS.borderLight,
    borderWidth: 1,
    borderColor: COLORS.borderMedium,
  },
  checkmark: {
    fontFamily: FONTS.mono,
    fontSize: 9,
    color: COLORS.C,
    fontWeight: 700,
  },
  dash: {
    fontFamily: FONTS.mono,
    fontSize: 9,
    color: COLORS.textMuted,
  },
  text: {
    flex: 1,
    fontFamily: FONTS.body,
    fontSize: 10,
    color: COLORS.textSecondary,
    lineHeight: 1.6,
  },
  checkedText: {
    color: COLORS.textPrimary,
  },
});

export function ChecklistBlock({ items }: ChecklistBlockProps) {
  return (
    <View style={styles.container}>
      {items.map((item, idx) => {
        const indicatorStyle: Style[] = item.checked
          ? [styles.indicator, styles.checkedIndicator]
          : [styles.indicator, styles.uncheckedIndicator];

        const textStyle: Style[] = item.checked
          ? [styles.text, styles.checkedText]
          : [styles.text];

        return (
          <View key={idx} style={styles.row}>
            {/* Indicator box */}
            <View style={indicatorStyle}>
              {item.checked ? (
                <Text style={styles.checkmark}>{"\u2713"}</Text>
              ) : (
                <Text style={styles.dash}>{"\u2014"}</Text>
              )}
            </View>

            {/* Item text */}
            <Text style={textStyle}>
              {item.text}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

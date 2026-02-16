/* ─── ComparisonTable — Generic table with header & alternating rows ─── */

import React from "react";
import { View, Text, StyleSheet } from "@react-pdf/renderer";
import type { Style } from "@react-pdf/types";
import { COLORS, FONTS, SPACING } from "../theme";

interface ComparisonTableProps {
  headers: string[];
  rows: string[][];
  highlightColumn?: number;
}

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.sectionGap,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    overflow: "hidden",
  },
  headerRow: {
    flexDirection: "row",
    backgroundColor: COLORS.darkBg,
    paddingVertical: 8,
    paddingHorizontal: 6,
  },
  headerCell: {
    fontFamily: FONTS.mono,
    fontSize: 9,
    color: COLORS.textOnDark,
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  dataRow: {
    flexDirection: "row",
    paddingVertical: 7,
    paddingHorizontal: 6,
    borderTopWidth: 0.5,
    borderTopColor: COLORS.borderLight,
  },
  dataRowEven: {
    backgroundColor: COLORS.pageBg,
  },
  dataRowOdd: {
    backgroundColor: COLORS.cardBg,
  },
  dataCell: {
    fontFamily: FONTS.body,
    fontSize: 10,
    color: COLORS.textSecondary,
    lineHeight: 1.5,
  },
  highlightedCell: {
    color: COLORS.C,
    fontWeight: 500,
  },
});

export function ComparisonTable({
  headers,
  rows,
  highlightColumn,
}: ComparisonTableProps) {
  const colCount = headers.length;
  const colWidth = `${100 / colCount}%`;

  return (
    <View style={styles.container}>
      {/* Header row */}
      <View style={styles.headerRow}>
        {headers.map((header, idx) => (
          <Text
            key={idx}
            style={[styles.headerCell, { width: colWidth }]}
          >
            {header}
          </Text>
        ))}
      </View>

      {/* Data rows */}
      {rows.map((row, rowIdx) => {
        const rowStyle: Style[] = rowIdx % 2 === 0
          ? [styles.dataRow, styles.dataRowEven]
          : [styles.dataRow, styles.dataRowOdd];

        return (
          <View key={rowIdx} style={rowStyle}>
            {row.map((cell, cellIdx) => {
              const isHighlighted =
                highlightColumn !== undefined && cellIdx === highlightColumn;
              const cellStyle: Style[] = isHighlighted
                ? [styles.dataCell, { width: colWidth }, styles.highlightedCell]
                : [styles.dataCell, { width: colWidth }];

              return (
                <Text key={cellIdx} style={cellStyle}>
                  {cell}
                </Text>
              );
            })}
          </View>
        );
      })}
    </View>
  );
}

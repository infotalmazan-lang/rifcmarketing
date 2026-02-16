/* ─── TableOfContents — Table of contents page ─── */

import React from "react";
import { Page, View, Text, StyleSheet } from "@react-pdf/renderer";
import { COLORS, FONTS, SPACING, PAGE_SIZE } from "../theme";

interface ToCChapter {
  number: string;
  title: string;
  page: number;
}

interface TableOfContentsProps {
  chapters: ToCChapter[];
}

const CHAPTER_COLORS: Record<string, string> = {
  "01": COLORS.R,
  "02": COLORS.I,
  "03": COLORS.F,
  "04": COLORS.C,
};

function getChapterColor(num: string): string {
  return CHAPTER_COLORS[num] || COLORS.textMuted;
}

const styles = StyleSheet.create({
  page: {
    backgroundColor: COLORS.pageBg,
    paddingHorizontal: SPACING.pageMarginH,
    paddingVertical: SPACING.pageMarginV,
  },
  heading: {
    fontFamily: FONTS.heading,
    fontSize: 28,
    color: COLORS.textPrimary,
    marginBottom: 32,
  },
  row: {
    flexDirection: "row",
    alignItems: "baseline",
    marginBottom: 14,
    paddingBottom: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.borderLight,
  },
  number: {
    fontFamily: FONTS.mono,
    fontSize: 12,
    fontWeight: 700,
    width: 36,
  },
  title: {
    fontFamily: FONTS.body,
    fontSize: 12,
    color: COLORS.textPrimary,
    flex: 1,
  },
  leader: {
    fontFamily: FONTS.mono,
    fontSize: 8,
    color: COLORS.textGhost,
    marginHorizontal: 8,
    letterSpacing: 2,
  },
  pageNum: {
    fontFamily: FONTS.mono,
    fontSize: 11,
    color: COLORS.textMuted,
    width: 28,
    textAlign: "right",
  },
});

export function TableOfContents({ chapters }: TableOfContentsProps) {
  return (
    <Page size={PAGE_SIZE} style={styles.page}>
      <Text style={styles.heading}>Cuprins</Text>

      {chapters.map((ch, idx) => {
        const color = getChapterColor(ch.number);
        return (
          <View key={idx} style={styles.row}>
            {/* Chapter number — colored */}
            <Text style={[styles.number, { color }]}>{ch.number}</Text>

            {/* Title */}
            <Text style={styles.title}>{ch.title}</Text>

            {/* Dotted leader */}
            <Text style={styles.leader}>
              {"...................."}
            </Text>

            {/* Page number */}
            <Text style={styles.pageNum}>{ch.page}</Text>
          </View>
        );
      })}
    </Page>
  );
}

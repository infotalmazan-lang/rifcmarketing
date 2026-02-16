/* ─── PageShell — A4 page wrapper with consistent header & footer ─── */

import React from "react";
import { Page, View, Text, StyleSheet } from "@react-pdf/renderer";
import type { Style } from "@react-pdf/types";
import { COLORS, FONTS, SPACING, PAGE_SIZE } from "../theme";

interface PageShellProps {
  children: React.ReactNode;
  dark?: boolean;
  showHeader?: boolean;
  chapterLabel?: string;
}

const styles = StyleSheet.create({
  page: {
    paddingTop: SPACING.pageMarginV,
    paddingBottom: SPACING.pageMarginV + 10,
    paddingHorizontal: SPACING.pageMarginH,
    backgroundColor: COLORS.pageBg,
    position: "relative",
  },
  pageDark: {
    backgroundColor: COLORS.darkBg,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.sectionGap,
    paddingBottom: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.borderLight,
  },
  headerDark: {
    borderBottomColor: "#2A2A3A",
  },
  chapterLabel: {
    fontFamily: FONTS.mono,
    fontSize: 8,
    letterSpacing: 2,
    textTransform: "uppercase",
    color: COLORS.textMuted,
  },
  chapterLabelDark: {
    color: COLORS.textOnDarkMuted,
  },
  headerBrand: {
    fontFamily: FONTS.mono,
    fontSize: 8,
    letterSpacing: 1,
    color: COLORS.textMuted,
  },
  headerBrandDark: {
    color: COLORS.textOnDarkMuted,
  },
  content: {
    flex: 1,
  },
  footer: {
    position: "absolute",
    bottom: SPACING.pageMarginV - 5,
    left: SPACING.pageMarginH,
    right: SPACING.pageMarginH,
    textAlign: "center",
    fontFamily: FONTS.mono,
    fontSize: 8,
    color: COLORS.textGhost,
  },
  footerDark: {
    color: COLORS.textOnDarkMuted,
  },
});

export function PageShell({
  children,
  dark = false,
  showHeader = true,
  chapterLabel,
}: PageShellProps) {
  const pageStyle: Style[] = dark
    ? [styles.page, styles.pageDark]
    : [styles.page];

  const headerStyle: Style[] = dark
    ? [styles.header, styles.headerDark]
    : [styles.header];

  const chapterLabelStyle: Style[] = dark
    ? [styles.chapterLabel, styles.chapterLabelDark]
    : [styles.chapterLabel];

  const headerBrandStyle: Style[] = dark
    ? [styles.headerBrand, styles.headerBrandDark]
    : [styles.headerBrand];

  const footerStyle: Style[] = dark
    ? [styles.footer, styles.footerDark]
    : [styles.footer];

  return (
    <Page size={PAGE_SIZE} style={pageStyle}>
      {showHeader && (
        <View style={headerStyle}>
          <Text style={chapterLabelStyle}>
            {chapterLabel || ""}
          </Text>
          <Text style={headerBrandStyle}>
            R IF C
          </Text>
        </View>
      )}

      <View style={styles.content}>{children}</View>

      <Text
        style={footerStyle}
        render={({ pageNumber, totalPages }) =>
          `${pageNumber} / ${totalPages}`
        }
        fixed
      />
    </Page>
  );
}

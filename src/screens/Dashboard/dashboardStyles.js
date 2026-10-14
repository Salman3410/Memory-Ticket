
import { StyleSheet } from "react-native";

export function createDashboardStyles(theme, isDark = false) {
  const palette = theme?.colors ?? {};

  const background =
    palette.background ?? (isDark ? "#171624" : "#F1F0F6");

  const surface =
    palette.surface ?? (isDark ? "#211F30" : "#FFFFFF");

  const surfaceMuted =
    palette.surfaceSecondary ??
    (isDark ? "#292740" : "#F1F0F6");

  const border =
    palette.border ?? (isDark ? "#39364D" : "#D9D8E2");

  const text =
    palette.text ?? (isDark ? "#F7F5FC" : "#242424");

  const textSecondary =
    palette.textSecondary ?? (isDark ? "#C4C0D0" : "#707080");

  const primary =
    palette.primary ?? (isDark ? "#C8C2FF" : "#34345C");

  const accent =
    palette.accent ?? (isDark ? "#FF8E72" : "#E76F51");

  const heroBackground = "#34345C";

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: background,
    },

    content: {
      paddingHorizontal: 18,
      paddingTop: 55,
      paddingBottom: 100,
      backgroundColor: background,
    },

    header: {
      marginBottom: 18,
    },

    eyebrow: {
      fontSize: 11,
      fontWeight: "700",
      letterSpacing: 1.8,
      color: accent,
      marginBottom: 7,
    },

    greeting: {
      fontSize: 28,
      fontWeight: "700",
      color: text,
    },

    subtitle: {
      marginTop: 5,
      fontSize: 14,
      lineHeight: 20,
      color: textSecondary,
    },

    /* HERO */

    heroCard: {
      position: "relative",
      backgroundColor: heroBackground,
      borderRadius: 22,
      padding: 20,
      marginBottom: 15,
      overflow: "hidden",
    },

    heroTopRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
    },

    heroEyebrow: {
      fontSize: 10,
      fontWeight: "700",
      letterSpacing: 1.6,
      color: "#FFFFFF",
      opacity: 0.65,
    },

    heroCount: {
      marginTop: 7,
      fontSize: 48,
      lineHeight: 52,
      fontWeight: "800",
      color: "#FFFFFF",
    },

    heroDescription: {
      fontSize: 14,
      color: "#FFFFFF",
      opacity: 0.8,
    },

    heroIcon: {
      width: 48,
      height: 48,
      borderRadius: 15,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#FFFFFF",
      overflow: "hidden",
    },

    heroLogo: {
      width: "100%",
      height: "100%",
    },

    ticketDivider: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginTop: 20,
      marginBottom: 18,
      paddingHorizontal: 1,
    },

    ticketDot: {
      width: 4,
      height: 4,
      borderRadius: 2,
      backgroundColor: "rgba(255,255,255,0.45)",
    },

    ticketNotchLeft: {
      position: "absolute",
      width: 26,
      height: 26,
      borderRadius: 13,
      backgroundColor: background,
      left: -13,
      top: "50%",
      marginTop: -13,
    },

    ticketNotchRight: {
      position: "absolute",
      width: 26,
      height: 26,
      borderRadius: 13,
      backgroundColor: background,
      right: -13,
      top: "50%",
      marginTop: -13,
    },

    heroStatsRow: {
      flexDirection: "row",
    },

    heroStat: {
      flex: 1,
    },

    heroStatValue: {
      fontSize: 17,
      fontWeight: "700",
      color: "#FFFFFF",
    },

    heroStatLabel: {
      marginTop: 3,
      fontSize: 9,
      fontWeight: "700",
      letterSpacing: 0.8,
      color: "#FFFFFF",
      opacity: 0.6,
    },

    /* STATISTICS */

    statsCard: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: surface,
      borderWidth: 1,
      borderColor: border,
      borderRadius: 18,
      paddingVertical: 17,
      paddingHorizontal: 8,
    },

    statItem: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
    },

    statValue: {
      fontSize: 19,
      fontWeight: "800",
      color: text,
    },

    statLabel: {
      marginTop: 4,
      fontSize: 10,
      fontWeight: "600",
      color: textSecondary,
      textAlign: "center",
    },

    statDivider: {
      width: 1,
      height: 30,
      backgroundColor: border,
    },

    /* QUICK ACTIONS */

    quickActions: {
      gap: 10,
      paddingBottom: 4,
      marginBottom: 25,
    },

    quickAction: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: surface,
      borderWidth: 1,
      borderColor: border,
      borderRadius: 14,
      paddingVertical: 10,
      paddingHorizontal: 13,
    },

    quickActionIcon: {
      width: 30,
      height: 30,
      borderRadius: 10,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: surfaceMuted,
      marginRight: 8,
    },

    quickActionText: {
      fontSize: 12,
      fontWeight: "700",
      color: primary,
    },

    /* MEMORY PULSE */

    pulseCard: {
      backgroundColor: surface,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: border,
      padding: 17,
      marginBottom: 28,
    },

    pulseHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
    },

    pulseTitle: {
      fontSize: 18,
      fontWeight: "700",
      color: text,
    },

    pulseSubtitle: {
      marginTop: 3,
      fontSize: 12,
      color: textSecondary,
    },

    pulseBadge: {
      backgroundColor: surfaceMuted,
      borderRadius: 12,
      paddingHorizontal: 10,
      paddingVertical: 6,
    },

    pulseBadgeText: {
      fontSize: 10,
      fontWeight: "700",
      color: primary,
    },

    chart: {
      height: 155,
      marginTop: 18,
      flexDirection: "row",
      justifyContent: "space-around",
      alignItems: "flex-end",
    },

    barColumn: {
      flex: 1,
      alignItems: "center",
      height: "100%",
      justifyContent: "flex-end",
    },

    barValue: {
      height: 18,
      fontSize: 10,
      fontWeight: "700",
      color: primary,
    },

    barTrack: {
      width: 18,
      height: 110,
      justifyContent: "flex-end",
      backgroundColor: surfaceMuted,
      borderRadius: 10,
      overflow: "hidden",
    },

    bar: {
      width: "100%",
      backgroundColor: accent,
      borderRadius: 10,
    },

    barLabel: {
      marginTop: 7,
      fontSize: 10,
      color: textSecondary,
    },

    pulseInsight: {
      marginTop: 14,
      fontSize: 12,
      lineHeight: 18,
      color: textSecondary,
    },

    pulseInsightStrong: {
      fontWeight: "700",
      color: text,
    },

    /* SECTIONS */

    section: {
      marginBottom: 28,
    },

    sectionHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 12,
    },

    sectionTitle: {
      fontSize: 18,
      fontWeight: "700",
      color: text,
    },

    sectionAction: {
      flexDirection: "row",
      alignItems: "center",
    },

    sectionActionText: {
      fontSize: 11,
      fontWeight: "700",
      letterSpacing: 0.5,
      color: primary,
      textTransform: "uppercase",
    },

    horizontalContent: {
      gap: 12,
    },

    /* MEMORY CARD */

    memoryCard: {
      width: 220,
      backgroundColor: surface,
      borderRadius: 16,
      overflow: "hidden",
      borderWidth: 1,
      borderColor: border,
    },

    memoryImageWrapper: {
      width: "100%",
      height: 130,
      backgroundColor: surfaceMuted,
    },

    memoryImage: {
      width: "100%",
      height: "100%",
    },

    memoryImagePlaceholder: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
    },

    placeholderText: {
      fontSize: 24,
      fontWeight: "700",
      color: primary,
    },

    memoryContent: {
      padding: 12,
    },

    memoryTitle: {
      fontSize: 15,
      fontWeight: "700",
      color: text,
    },

    memoryDate: {
      marginTop: 5,
      fontSize: 12,
      color: textSecondary,
    },

    memoryLocation: {
      marginTop: 4,
      fontSize: 12,
      color: primary,
    },

    /* ON THIS DAY */

    onThisDayCard: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      backgroundColor: surface,
      borderWidth: 1,
      borderColor: border,
      borderRadius: 18,
      padding: 15,
    },

    onThisDayLeft: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      paddingRight: 12,
    },

    onThisDayIcon: {
      width: 44,
      height: 44,
      borderRadius: 14,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: surfaceMuted,
      marginRight: 12,
    },

    onThisDayTextWrapper: {
      flex: 1,
    },

    onThisDayEyebrow: {
      fontSize: 9,
      fontWeight: "800",
      letterSpacing: 1.5,
      color: accent,
    },

    onThisDayTitle: {
      marginTop: 4,
      fontSize: 15,
      lineHeight: 19,
      fontWeight: "700",
      color: text,
    },

    onThisDaySubtitle: {
      marginTop: 4,
      fontSize: 11,
      lineHeight: 16,
      color: textSecondary,
    },

    /* MEMORY SPOTLIGHT */

    spotlightCard: {
      backgroundColor: surface,
      borderRadius: 20,
      overflow: "hidden",
      borderWidth: 1,
      borderColor: border,
    },

    spotlightImageWrapper: {
      width: "100%",
      height: 225,
      backgroundColor: surfaceMuted,
    },

    spotlightImage: {
      width: "100%",
      height: "100%",
    },

    spotlightPlaceholder: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
    },

    spotlightBadge: {
      position: "absolute",
      top: 12,
      left: 12,
      backgroundColor: "rgba(52,52,92,0.88)",
      paddingHorizontal: 10,
      paddingVertical: 7,
      borderRadius: 10,
    },

    spotlightBadgeText: {
      fontSize: 9,
      fontWeight: "800",
      letterSpacing: 1,
      color: "#FFFFFF",
    },

    spotlightContent: {
      flexDirection: "row",
      alignItems: "center",
      padding: 16,
    },

    spotlightMain: {
      flex: 1,
      paddingRight: 10,
    },

    spotlightTitle: {
      fontSize: 18,
      lineHeight: 23,
      fontWeight: "700",
      color: text,
    },

    spotlightDate: {
      marginTop: 6,
      fontSize: 11,
      color: textSecondary,
    },

    spotlightLocationRow: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: 6,
    },

    spotlightLocation: {
      flex: 1,
      marginLeft: 4,
      fontSize: 11,
      color: primary,
    },

    spotlightArrow: {
      width: 36,
      height: 36,
      borderRadius: 12,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: surfaceMuted,
    },

    /* COLLECTIONS */

    collectionsGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-between",
      gap: 10,
    },

    collectionCard: {
      width: "48%",
      minHeight: 92,
      justifyContent: "center",
      backgroundColor: surface,
      borderRadius: 16,
      padding: 14,
      borderWidth: 1,
      borderColor: border,
    },

    collectionName: {
      fontSize: 15,
      fontWeight: "700",
      color: text,
    },

    collectionCount: {
      marginTop: 7,
      fontSize: 12,
      color: textSecondary,
    },

    /* PLACES PREVIEW */

    placesCard: {
      backgroundColor: surface,
      borderWidth: 1,
      borderColor: border,
      borderRadius: 16,
      paddingHorizontal: 15,
    },

    placeRow: {
      minHeight: 52,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      borderBottomWidth: 1,
      borderBottomColor: border,
      paddingVertical: 10,
    },

    placeRowLast: {
      borderBottomWidth: 0,
    },

    placeTextWrapper: {
      flex: 1,
      paddingRight: 12,
    },

    placeName: {
      fontSize: 14,
      fontWeight: "600",
      color: text,
    },

    placeCount: {
      fontSize: 13,
      fontWeight: "700",
      color: primary,
    },

    /* STATES */

    emptyText: {
      fontSize: 13,
      color: textSecondary,
      paddingVertical: 4,
    },

    loadingContainer: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: background,
    },
  });
}

export const styles = createDashboardStyles(
  {
    colors: {
      background: "#F1F0F6",
      surface: "#FFFFFF",
      border: "#D9D8E2",
      text: "#242424",
      textSecondary: "#777681",
      primary: "#34345C",
      accent: "#E76F51",
    },
  },
  false
);

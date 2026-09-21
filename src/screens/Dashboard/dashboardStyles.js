import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F1F0F6",
  },

  content: {
    paddingHorizontal: 18,
    paddingTop: 55,
    paddingBottom: 100,
  },

  header: {
    marginBottom: 18,
  },

  eyebrow: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.8,
    color: "#E76F51",
    marginBottom: 7,
  },

  greeting: {
    fontSize: 28,
    fontWeight: "700",
    color: "#242424",
  },

  subtitle: {
    marginTop: 5,
    fontSize: 14,
    lineHeight: 20,
    color: "#777681",
  },

  /* HERO */

  heroCard: {
    position: "relative",
    backgroundColor: "#34345C",
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
    backgroundColor: "#F1F0F6",
    left: -13,
    top: "50%",
    marginTop: -13,
  },

  ticketNotchRight: {
    position: "absolute",
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: "#F1F0F6",
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

  /* QUICK ACTIONS */

  quickActions: {
    gap: 10,
    paddingBottom: 4,
    marginBottom: 25,
  },

  quickAction: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#D9D8E2",
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
    backgroundColor: "#F1F0F6",
    marginRight: 8,
  },

  quickActionText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#34345C",
  },

  /* PULSE */

  pulseCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#D9D8E2",
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
    color: "#242424",
  },

  pulseSubtitle: {
    marginTop: 3,
    fontSize: 12,
    color: "#777681",
  },

  pulseBadge: {
    backgroundColor: "#F1F0F6",
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },

  pulseBadgeText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#34345C",
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
    color: "#34345C",
  },

  barTrack: {
    width: 18,
    height: 110,
    justifyContent: "flex-end",
    backgroundColor: "#F1F0F6",
    borderRadius: 10,
    overflow: "hidden",
  },

  bar: {
    width: "100%",
    backgroundColor: "#E76F51",
    borderRadius: 10,
  },

  barLabel: {
    marginTop: 7,
    fontSize: 10,
    color: "#777681",
  },

  pulseInsight: {
    marginTop: 14,
    fontSize: 12,
    lineHeight: 18,
    color: "#777681",
  },

  pulseInsightStrong: {
    fontWeight: "700",
    color: "#34345C",
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
    color: "#242424",
  },

  sectionAction: {
    flexDirection: "row",
    alignItems: "center",
  },

  sectionActionText: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.5,
    color: "#34345C",
    textTransform: "uppercase",
  },

  horizontalContent: {
    gap: 12,
  },

  /* MEMORY CARD */

  memoryCard: {
    width: 220,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#D9D8E2",
  },

  memoryImageWrapper: {
    width: "100%",
    height: 130,
    backgroundColor: "#E8E7ED",
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
    color: "#34345C",
  },

  memoryContent: {
    padding: 12,
  },

  memoryTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#242424",
  },

  memoryDate: {
    marginTop: 5,
    fontSize: 12,
    color: "#777681",
  },

  memoryLocation: {
    marginTop: 4,
    fontSize: 12,
    color: "#34345C",
  },

  /* ON THIS DAY */

  onThisDayCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#D9D8E2",
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
    backgroundColor: "#F1F0F6",
    marginRight: 12,
  },

  onThisDayTextWrapper: {
    flex: 1,
  },

  onThisDayEyebrow: {
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 1.5,
    color: "#E76F51",
  },

  onThisDayTitle: {
    marginTop: 4,
    fontSize: 15,
    lineHeight: 19,
    fontWeight: "700",
    color: "#242424",
  },

  onThisDaySubtitle: {
    marginTop: 4,
    fontSize: 11,
    lineHeight: 16,
    color: "#777681",
  },

  /* MEMORY SPOTLIGHT */

  spotlightCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#D9D8E2",
  },

  spotlightImageWrapper: {
    width: "100%",
    height: 225,
    backgroundColor: "#E8E7ED",
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
    color: "#242424",
  },

  spotlightDate: {
    marginTop: 6,
    fontSize: 11,
    color: "#777681",
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
    color: "#34345C",
  },

  spotlightArrow: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F1F0F6",
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
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: "#D9D8E2",
  },

  collectionName: {
    fontSize: 15,
    fontWeight: "700",
    color: "#242424",
  },

  collectionCount: {
    marginTop: 7,
    fontSize: 12,
    color: "#777681",
  },

  /* LOADING */

  emptyText: {
    fontSize: 13,
    color: "#777681",
    paddingVertical: 4,
  },

  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F1F0F6",
  },
});


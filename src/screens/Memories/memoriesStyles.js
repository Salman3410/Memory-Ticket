import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  // --------------------------------------------------
  // CONTAINER
  // --------------------------------------------------

  container: {
    flex: 1,
    backgroundColor: "#F1F0F6",
  },

  scrollContent: {
    paddingHorizontal: 22,
    paddingTop: 55,
    paddingBottom: 100,
  },

  // --------------------------------------------------
  // HEADER
  // --------------------------------------------------

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 25,
  },

  headerEyebrow: {
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 1.8,
    color: "#E76F51",
    marginBottom: 4,
  },

  headerTitle: {
    fontSize: 28,
    fontWeight: "900",
    color: "#242424",
    letterSpacing: -0.5,
  },

  addButton: {
    width: 46,
    height: 46,
    borderRadius: 15,
    backgroundColor: "#34345C",
    alignItems: "center",
    justifyContent: "center",

    shadowColor: "#34345C",

    shadowOffset: {
      width: 0,
      height: 4,
    },

    shadowOpacity: 0.18,
    shadowRadius: 7,

    elevation: 5,
  },

  // --------------------------------------------------
  // CURRENT VIEW
  // --------------------------------------------------

  viewHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 13,
  },

  viewTitle: {
    fontSize: 17,
    fontWeight: "900",
    color: "#242424",
  },

  viewCount: {
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 1,
    color: "#9A99A5",
  },

  // --------------------------------------------------
  // LOADING
  // --------------------------------------------------

  loadingState: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#D9D8E2",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 35,
  },

  loadingTitle: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: "800",
    color: "#242424",
  },

  // --------------------------------------------------
  // FOOTER
  // --------------------------------------------------

  footerText: {
    textAlign: "center",
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 1.5,
    color: "#9A99A5",
    marginTop: 25,
  },

  headerActions: {
    flexDirection: "row",
    alignItems: "center",
  },

  headerActions: {
    flexDirection: "row",
    alignItems: "center",
  },

  timelineButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    minHeight: 45,
    paddingHorizontal: 11,
    marginRight: 8,
    borderRadius: 20,
    // backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#D9D8E2",
  },

  timelineButtonActive: {
    backgroundColor: "#34345C",
    borderColor: "#34345C",
  },

  timelineButtonText: {
    marginLeft: 6,
    fontSize: 12,
    fontWeight: "800",
    color: "#34345C",
  },

  timelineButtonTextActive: {
    color: "#FFFFFF",
  },

  timelineEmptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 30,
    paddingVertical: 70,
  },

  timelineEmptyTitle: {
    marginTop: 14,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "800",
    color: "#34345C",
  },

  timelineEmptyText: {
    marginTop: 7,
    textAlign: "center",
    fontSize: 14,
    lineHeight: 21,
    color: "#77768A",
  },

  timelineModalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(36, 36, 36, 0.35)",
  },

  timelineModal: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    backgroundColor: "#FFFFFF",
  },

  timelineModalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  timelineModalTitle: {
    fontSize: 21,
    fontWeight: "800",
    color: "#34345C",
  },

  timelineCloseButton: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 18,
    backgroundColor: "#F1F0F6",
  },

  timelineYearRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 18,
    paddingHorizontal: 22,
  },

  timelineYearArrow: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
    backgroundColor: "#F1F0F6",
  },

  timelineYear: {
    fontSize: 22,
    fontWeight: "800",
    color: "#242424",
  },

  timelineMonthGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 18,
  },

  timelineMonthItem: {
    width: "31.5%",
    minHeight: 48,
    marginBottom: 10,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    backgroundColor: "#F1F0F6",
  },

  timelineMonthItemSelected: {
    backgroundColor: "#34345C",
  },

  timelineMonthText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#34345C",
  },

  timelineMonthTextSelected: {
    color: "#FFFFFF",
  },

  timelineClearButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    minHeight: 44,
    marginTop: 2,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#D9D8E2",
  },

  timelineClearText: {
    marginLeft: 7,
    fontSize: 14,
    fontWeight: "700",
    color: "#34345C",
  },

  timelineActions: {
    flexDirection: "row",
    marginTop: 12,
  },

  timelineCancelButton: {
    flex: 1,
    minHeight: 48,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 6,
    borderRadius: 12,
    backgroundColor: "#F1F0F6",
  },

  timelineCancelText: {
    fontSize: 14,
    fontWeight: "800",
    color: "#34345C",
  },

  timelineDoneButton: {
    flex: 1,
    minHeight: 48,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 6,
    borderRadius: 12,
    backgroundColor: "#34345C",
  },

  timelineDoneText: {
    fontSize: 14,
    fontWeight: "800",
    color: "#FFFFFF",
  },
});

export default styles;

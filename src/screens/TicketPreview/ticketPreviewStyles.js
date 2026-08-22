import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F1F0F6",
  },

  scrollContent: {
    paddingHorizontal: 22,
    paddingTop: 55,
    paddingBottom: 50,
  },

  // ==================================================
  // HEADER
  // ==================================================

  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 28,
  },

  backButton: {
    width: 44,
    height: 44,
    borderRadius: 14,

    backgroundColor: "#FFFFFF",

    alignItems: "center",
    justifyContent: "center",

    borderWidth: 1,
    borderColor: "#D9D8E2",

    marginRight: 13,
  },

  headerTextContainer: {
    flex: 1,
  },

  headerEyebrow: {
    fontSize: 9,
    fontWeight: "900",

    letterSpacing: 1.7,

    color: "#E76F51",

    marginBottom: 3,
  },

  headerTitle: {
    fontSize: 24,
    fontWeight: "900",

    color: "#242424",
  },

  headerSpacer: {
    width: 44,
  },

  // ==================================================
  // PREVIEW INTRO
  // ==================================================

  previewHeader: {
    marginBottom: 20,
  },

  previewTitle: {
    fontSize: 19,
    fontWeight: "900",

    color: "#242424",

    marginBottom: 5,
  },

  previewSubtitle: {
    fontSize: 12,
    lineHeight: 19,

    color: "#707080",
  },

  // ==================================================
  // TICKET SHADOW
  // ==================================================

  ticketShadow: {
    shadowColor: "#242424",

    shadowOffset: {
      width: 0,
      height: 10,
    },

    shadowOpacity: 0.22,
    shadowRadius: 16,

    elevation: 8,

    marginBottom: 4,
  },

  // ==================================================
  // TICKET
  // ==================================================

  ticket: {
    backgroundColor: "#F9B900",

    overflow: "hidden",

    borderRadius: 2,
  },

  // ==================================================
  // TOP PERFORATION
  // ==================================================

  topPerforation: {
    height: 17,

    flexDirection: "row",

    justifyContent: "space-around",
    alignItems: "flex-start",

    backgroundColor: "#F9B900",

    overflow: "hidden",
  },

  perforationHole: {
    width: 17,
    height: 17,

    borderRadius: 9,

    backgroundColor: "#F1F0F6",

    marginTop: -8,
  },

  // ==================================================
  // TICKET HEADER
  // ==================================================

  ticketHeader: {
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 14,

    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },

  ticketBrand: {
    fontSize: 25,
    fontWeight: "900",

    letterSpacing: -1,

    color: "#D92F16",

    textTransform: "uppercase",
  },

  ticketSubBrand: {
    fontSize: 10,
    fontWeight: "900",

    letterSpacing: 0.2,

    color: "#D92F16",

    marginTop: -1,
  },

  ticketNumber: {
    fontSize: 10,
    fontWeight: "900",

    letterSpacing: 1,

    color: "#D92F16",

    marginTop: 3,
  },

  // ==================================================
  // IMAGE
  // ==================================================

  ticketImageContainer: {
    height: 230,
    width: "100%",
    backgroundColor: "#FFFFFF",

    overflow: "hidden",
  },

  ticketImage: {
    width: "100%",
    height: "100%",

    resizeMode: "cover",

    opacity: 1,
  },

  imageOverlay: {
    position: "absolute",

    top: 0,
    left: 0,
    right: 0,
    bottom: 0,

    backgroundColor: "rgba(255, 176, 0, 0.18)",
  },

  noImage: {
    flex: 1,

    alignItems: "center",
    justifyContent: "center",

    backgroundColor: "#E88925",
  },

  noImageText: {
    fontSize: 9,
    fontWeight: "900",

    letterSpacing: 1,

    color: "#D94D28",

    marginTop: 7,
  },

  // ==================================================
  // INFORMATION
  // ==================================================

  ticketInfo: {
    paddingHorizontal: 20,
    paddingTop: 19,
    paddingBottom: 20,
  },

  memoryLabel: {
    fontSize: 9,
    fontWeight: "900",

    letterSpacing: 1.8,

    color: "#D92F16",

    marginBottom: 6,
  },

  ticketTitle: {
    fontSize: 27,
    lineHeight: 29,

    fontWeight: "900",

    letterSpacing: -0.8,

    color: "#D92F16",

    textTransform: "uppercase",
  },

  ticketDivider: {
    height: 1,

    backgroundColor: "rgba(217, 47, 22, 0.35)",

    marginVertical: 17,
  },

  infoRow: {
    flexDirection: "row",
  },

  infoItem: {
    flex: 1,

    paddingRight: 10,
  },

  infoLabel: {
    fontSize: 8,
    fontWeight: "900",

    letterSpacing: 1.2,

    color: "#D92F16",

    marginBottom: 4,
  },

  infoValue: {
    fontSize: 12,
    lineHeight: 16,

    fontWeight: "800",

    color: "#D92F16",

    textTransform: "uppercase",
  },

  // ==================================================
  // DESCRIPTION
  // ==================================================

  descriptionContainer: {
    marginTop: 18,

    paddingTop: 12,

    borderTopWidth: 1,

    borderTopColor: "rgba(217, 47, 22, 0.25)",
  },

  description: {
    fontSize: 11,
    lineHeight: 17,

    fontWeight: "700",

    fontStyle: "italic",

    color: "#D92F16",
  },

  // ==================================================
  // MIDDLE PERFORATION
  // ==================================================

  middlePerforation: {
    height: 18,

    position: "relative",

    justifyContent: "center",
    alignItems: "center",
  },

  middleDashedLine: {
    width: "82%",

    borderTopWidth: 1,

    borderStyle: "dashed",

    borderColor: "#D92F16",

    opacity: 0.7,
  },

  sideCutoutLeft: {
    position: "absolute",

    left: -11,

    width: 22,
    height: 22,

    borderRadius: 11,

    backgroundColor: "#F1F0F6",
  },

  sideCutoutRight: {
    position: "absolute",

    right: -11,

    width: 22,
    height: 22,

    borderRadius: 11,

    backgroundColor: "#F1F0F6",
  },

  // ==================================================
  // FOOTER
  // ==================================================

  ticketFooter: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 10,

    flexDirection: "row",

    justifyContent: "space-between",
    alignItems: "flex-end",
  },

  admitText: {
    fontSize: 10,
    fontWeight: "900",

    letterSpacing: 1,

    color: "#D92F16",
  },

  footerSmallText: {
    fontSize: 7,
    fontWeight: "900",

    letterSpacing: 1,

    color: "#D92F16",

    marginTop: 4,
  },

  // ==================================================
  // BARCODE
  // ==================================================

  barcode: {
    height: 42,

    width: 125,

    flexDirection: "row",

    alignItems: "center",
    justifyContent: "space-between",

    overflow: "hidden",
  },

  bar: {
    height: 34,

    backgroundColor: "#D92F16",
  },

  barSmall: {
    width: 2,
  },

  barMedium: {
    width: 3,
  },

  barWide: {
    width: 5,
  },

  // ==================================================
  // SERIAL
  // ==================================================

  serialContainer: {
    alignItems: "flex-end",

    paddingHorizontal: 20,

    paddingBottom: 12,
  },

  serialText: {
    fontSize: 8,
    fontWeight: "900",

    letterSpacing: 1.3,

    color: "#D92F16",
  },

  // ==================================================
  // BOTTOM PERFORATION
  // ==================================================

  bottomPerforation: {
    height: 17,

    flexDirection: "row",

    justifyContent: "space-around",
    alignItems: "flex-end",

    backgroundColor: "#F9B900",

    overflow: "hidden",
  },

  // ==================================================
  // ACTIONS
  // ==================================================

  actionsContainer: {
    marginTop: 22,

    gap: 10,
  },

  saveButton: {
    height: 56,

    borderRadius: 14,

    backgroundColor: "#34345C",

    flexDirection: "row",

    alignItems: "center",
    justifyContent: "center",

    gap: 9,

    shadowColor: "#34345C",

    shadowOffset: {
      width: 0,
      height: 5,
    },

    shadowOpacity: 0.18,
    shadowRadius: 8,

    elevation: 5,
  },

  saveButtonText: {
    fontSize: 12,
    fontWeight: "900",

    letterSpacing: 1.4,

    color: "#FFFFFF",
  },

  editButton: {
    height: 52,

    borderRadius: 14,

    borderWidth: 1.5,
    borderColor: "#34345C",

    backgroundColor: "#FFFFFF",

    flexDirection: "row",

    alignItems: "center",
    justifyContent: "center",

    gap: 8,
  },

  editButtonText: {
    fontSize: 11,
    fontWeight: "900",

    letterSpacing: 1.2,

    color: "#34345C",
  },

  // ==================================================
  // FOOTER
  // ==================================================

  footerText: {
    textAlign: "center",

    fontSize: 10,

    color: "#9A99A5",

    marginTop: 18,
  },
  ticketImageContainer: {
    width: "100%",
    height: 240,
    overflow: "hidden",
    position: "relative",
  },

  ticketImageSlide: {
    height: "100%",
    position: "relative",
  },

  ticketImage: {
    width: "100%",
    height: "100%",
  },

  imageOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },

  imageCounter: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "rgba(0, 0, 0, 0.65)",
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 12,
  },

  imageCounterText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "700",
  },

  imageDots: {
    position: "absolute",
    bottom: 10,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
  },

  imageDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "rgba(255, 255, 255, 0.55)",
  },

  imageDotActive: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#FFFFFF",
  },
});

export default styles;

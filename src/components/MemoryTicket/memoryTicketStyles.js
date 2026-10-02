import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  // --------------------------------------------------
  // OUTER FRAME / A7 TICKET
  // --------------------------------------------------

  ticketFrame: {
    width: "100%",

    // A7 portrait ratio
    aspectRatio: 74 / 105,

    position: "relative",

    backgroundColor: "transparent",

    borderRadius: 4,

    overflow: "hidden",

    shadowColor: "#000",

    shadowOffset: {
      width: 0,
      height: 8,
    },

    shadowOpacity: 0.18,

    shadowRadius: 14,

    elevation: 0,

    zIndex: 1,
  },

  // --------------------------------------------------
  // COMPACT
  // --------------------------------------------------

  ticketCompact: {
    transform: [
      {
        scale: 0.96,
      },
    ],
  },

  // --------------------------------------------------
  // CLASSIC PNG BACKGROUND
  // --------------------------------------------------

  ticketBackground: {
    position: "absolute",

    top: 0,
    left: 0,

    width: "100%",
    height: "100%",

    zIndex: 0,
  },

  // --------------------------------------------------
  // CONTENT
  // --------------------------------------------------

  ticketContent: {
    position: "absolute",

    top: 0,
    left: 0,
    right: 0,
    bottom: 0,

    paddingHorizontal: 17,

    paddingTop: 17,

    paddingBottom: 14,

    zIndex: 2,
  },

  // --------------------------------------------------
  // HEADER
  // --------------------------------------------------

  header: {
    height: 34,

    flexDirection: "row",

    alignItems: "center",

    justifyContent: "space-between",
  },

  brandText: {
    fontSize: 8,

    fontWeight: "900",

    letterSpacing: 2,

    textTransform: "uppercase",
  },

  brandSubText: {
    marginTop: 2,

    fontSize: 6,

    lineHeight: 8,

    fontWeight: "800",

    letterSpacing: 1.1,

    textTransform: "uppercase",
  },

  // --------------------------------------------------
  // IMAGE
  // --------------------------------------------------

  imageSection: {
    width: "100%",

    // Same visual weight as the old ticket image
    height: 180,

    marginTop: 4,

    overflow: "hidden",

    position: "relative",

    borderRadius: 3,
  },

  imageTouchable: {
    flex: 1,
  },

  ticketImageSlide: {
    height: "100%",
  },

  ticketImage: {
    width: "100%",

    height: "100%",
  },

  noImage: {
    flex: 1,

    alignItems: "center",

    justifyContent: "center",
  },

  noImageText: {
    marginTop: 7,

    fontSize: 8,

    fontWeight: "900",

    letterSpacing: 1,
  },

  // --------------------------------------------------
  // IMAGE COUNTER
  // --------------------------------------------------

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

  // --------------------------------------------------
  // IMAGE DOTS
  // --------------------------------------------------

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

  // --------------------------------------------------
  // TITLE
  // --------------------------------------------------

  titleSection: {
    marginTop: 10,

    marginBottom: 13,
  },

  ticketTitle: {
    fontSize: 27,

    lineHeight: 27,

    fontWeight: "900",

    textTransform: "uppercase",

    letterSpacing: -0.5,
  },

  // --------------------------------------------------
  // TAGS
  // --------------------------------------------------

  tagsContainer: {
    flexDirection: "row",

    flexWrap: "wrap",

    gap: 7,

    marginBottom: 13,
  },

  tagChip: {
    paddingHorizontal: 0,

    paddingVertical: 2,

    borderBottomWidth: 1,
  },

  tagText: {
    fontSize: 8,

    lineHeight: 11,

    fontWeight: "800",

    letterSpacing: 0.2,
  },

  // --------------------------------------------------
  // DESCRIPTION
  // --------------------------------------------------

  descriptionSection: {
    marginBottom: 13,
  },

  descriptionLabel: {
    fontSize: 7,

    fontWeight: "900",

    letterSpacing: 1,

    marginBottom: 4,

    textTransform: "uppercase",
  },

  descriptionText: {
    fontSize: 11,

    lineHeight: 16,

    fontWeight: "600",
  },

  // --------------------------------------------------
  // INFORMATION
  // --------------------------------------------------

  infoSection: {
    marginBottom: 12,

    flexDirection: "row",

    gap: 14,
  },

  infoBlock: {
    flex: 1,
  },

  infoLabel: {
    fontSize: 7,

    fontWeight: "900",

    letterSpacing: 1,

    marginBottom: 3,

    textTransform: "uppercase",
  },

  infoValue: {
    fontSize: 11,

    fontWeight: "800",

    textTransform: "uppercase",
  },

  // --------------------------------------------------
  // ADMISSION
  // --------------------------------------------------

  admissionSection: {
    flexDirection: "row",

    alignItems: "center",

    gap: 7,

    marginBottom: 10,
  },

  admissionLabel: {
    fontSize: 8,

    fontWeight: "900",

    letterSpacing: 0.8,

    textTransform: "uppercase",
  },

  admissionValue: {
    fontSize: 11,

    fontWeight: "900",
  },

  // --------------------------------------------------
  // FOOTER
  // --------------------------------------------------

  footer: {
    position: "absolute",

    left: 17,

    right: 17,

    bottom: 14,

    flexDirection: "row",

    alignItems: "flex-end",

    justifyContent: "space-between",

    minHeight: 52,
  },

  ticketNumberContainer: {
    width: 65,
  },

  ticketNumberLabel: {
    fontSize: 6,

    fontWeight: "900",

    letterSpacing: 0.8,

    marginBottom: 3,

    textTransform: "uppercase",
  },

  ticketNumber: {
    fontSize: 10,

    fontWeight: "900",

    letterSpacing: 1,
  },

  // --------------------------------------------------
  // BARCODE
  // --------------------------------------------------

  barcode: {
    height: 43,

    flex: 1,

    flexDirection: "row",

    alignItems: "stretch",

    justifyContent: "flex-end",

    gap: 2,

    overflow: "hidden",
  },

  barcodeFull: {
    marginLeft: 0,
  },

  bar: {
    height: "100%",
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
});

export default styles;

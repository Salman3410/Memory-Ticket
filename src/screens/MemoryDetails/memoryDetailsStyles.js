import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F1F0F6",
  },

  scrollContent: {
    paddingHorizontal: 22,
    paddingTop: 55,
    paddingBottom: 110,
  },

  // -------------------------
  // HEADER
  // -------------------------

  header: {
    height: 50,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    marginBottom: 18,
  },

  backButton: {
    width: 44,
    height: 44,
    borderRadius: 14,

    backgroundColor: "#FFFFFF",

    alignItems: "center",
    justifyContent: "center",
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: "#242424",
  },

  favoriteButton: {
    width: 44,
    height: 44,
    borderRadius: 14,

    backgroundColor: "#FFFFFF",

    alignItems: "center",
    justifyContent: "center",

    borderWidth: 1,
    borderColor: "#D9D8E2",
  },

  favoriteButtonActive: {
    borderColor: "#F3D3CF",
    backgroundColor: "#FFF7F6",
  },

  // -------------------------
  // PHOTO
  // -------------------------

  photoContainer: {
    width: "100%",
    height: 300,

    borderRadius: 22,

    overflow: "hidden",

    backgroundColor: "#D9D8E2",

    position: "relative",

    marginBottom: 14,
  },

  memoryImage: {
    width: "100%",
    height: "100%",
  },

  photoBadge: {
    position: "absolute",

    left: 14,
    bottom: 14,

    height: 32,

    paddingHorizontal: 11,

    borderRadius: 10,

    backgroundColor: "#34345C",

    flexDirection: "row",
    alignItems: "center",

    gap: 6,
  },

  photoBadgeText: {
    fontSize: 8,
    fontWeight: "900",
    letterSpacing: 1,

    color: "#FFFFFF",
  },

  // -------------------------
  // TICKET
  // -------------------------

  ticketCard: {
    backgroundColor: "#FFFFFF",

    borderRadius: 22,

    paddingHorizontal: 20,
    paddingTop: 22,
    paddingBottom: 17,

    borderWidth: 1,
    borderColor: "#D9D8E2",

    overflow: "hidden",
  },

  eyebrow: {
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 1.5,

    color: "#E76F51",

    marginBottom: 6,
  },

  title: {
    fontSize: 25,
    lineHeight: 31,

    fontWeight: "900",

    color: "#242424",
  },

  ticketDivider: {
    height: 25,

    flexDirection: "row",
    alignItems: "center",

    marginHorizontal: -20,
  },

  cutoutLeft: {
    width: 17,
    height: 34,

    borderRadius: 17,

    backgroundColor: "#F1F0F6",

    marginLeft: -9,
  },

  dashedLine: {
    flex: 1,

    borderTopWidth: 1,
    borderStyle: "dashed",
    borderColor: "#D9D8E2",
  },

  cutoutRight: {
    width: 17,
    height: 34,

    borderRadius: 17,

    backgroundColor: "#F1F0F6",

    marginRight: -9,
  },

  // -------------------------
  // INFORMATION
  // -------------------------

  infoRow: {
    flexDirection: "row",
    alignItems: "center",

    marginBottom: 18,
  },

  infoIcon: {
    width: 40,
    height: 40,

    borderRadius: 12,

    backgroundColor: "#F1F0F6",

    alignItems: "center",
    justifyContent: "center",

    marginRight: 12,
  },

  infoContent: {
    flex: 1,
  },

  infoLabel: {
    fontSize: 8,
    fontWeight: "900",
    letterSpacing: 1.2,

    color: "#9A99A5",

    marginBottom: 4,
  },

  infoValue: {
    fontSize: 13,
    fontWeight: "700",

    color: "#242424",
  },

  descriptionContainer: {
    marginTop: 2,
    marginBottom: 18,
  },

  description: {
    fontSize: 13,
    lineHeight: 21,

    color: "#707080",

    marginTop: 7,
  },

  // -------------------------
  // TICKET FOOTER
  // -------------------------

  ticketFooter: {
    borderTopWidth: 1,
    borderStyle: "dashed",
    borderColor: "#D9D8E2",

    paddingTop: 14,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  ticketNumber: {
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 1.2,

    color: "#A4A3AE",
  },

  // -------------------------
  // DELETE
  // -------------------------

  deleteButton: {
    height: 52,

    borderRadius: 14,

    backgroundColor: "#FFF7F6",

    borderWidth: 1,
    borderColor: "#F3D3CF",

    marginTop: 18,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",

    gap: 8,
  },

  deleteText: {
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 1.2,

    color: "#D9534F",
  },

  // -------------------------
  // EMPTY / NOT FOUND
  // -------------------------

  notFoundContainer: {
    flex: 1,

    backgroundColor: "#F1F0F6",

    alignItems: "center",
    justifyContent: "center",

    paddingHorizontal: 30,
  },

  notFoundTitle: {
    fontSize: 20,
    fontWeight: "900",

    color: "#242424",

    marginTop: 15,
    marginBottom: 18,
  },

  backToMemoriesButton: {
    height: 48,

    paddingHorizontal: 22,

    borderRadius: 13,

    backgroundColor: "#34345C",

    alignItems: "center",
    justifyContent: "center",
  },

  backToMemoriesText: {
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 1,

    color: "#FFFFFF",
  },

  footerText: {
    textAlign: "center",

    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 1,

    color: "#9A99A5",

    marginTop: 18,
  },
});

export default styles;

import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
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

  headerText: {
    flex: 1,
  },

  headerEyebrow: {
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 1.6,

    color: "#E76F51",

    marginBottom: 3,
  },

  headerTitle: {
    fontSize: 26,
    fontWeight: "900",

    color: "#242424",
  },

  // --------------------------------------------------
  // SECTION
  // --------------------------------------------------

  sectionTitle: {
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 1.5,

    color: "#707080",

    marginBottom: 10,
    marginTop: 4,

    paddingLeft: 3,
  },

  // --------------------------------------------------
  // CARD
  // --------------------------------------------------

  card: {
    backgroundColor: "#FFFFFF",

    borderRadius: 18,

    borderWidth: 1,
    borderColor: "#D9D8E2",

    overflow: "hidden",

    marginBottom: 25,
  },

  // --------------------------------------------------
  // NORMAL ROW
  // --------------------------------------------------

  row: {
    minHeight: 76,

    paddingHorizontal: 14,

    flexDirection: "row",
    alignItems: "center",
  },

  // --------------------------------------------------
  // ICON
  // --------------------------------------------------

  iconBox: {
    width: 42,
    height: 42,

    borderRadius: 12,

    backgroundColor: "#F1F0F6",

    alignItems: "center",
    justifyContent: "center",

    marginRight: 12,
  },

  // --------------------------------------------------
  // CONTENT
  // --------------------------------------------------

  rowContent: {
    flex: 1,
  },

  rowTitle: {
    fontSize: 13,
    fontWeight: "800",

    color: "#242424",

    marginBottom: 4,
  },

  rowSubtitle: {
    fontSize: 10,
    lineHeight: 15,

    color: "#9A99A5",

    maxWidth: 240,
  },

  // --------------------------------------------------
  // THEME
  // --------------------------------------------------

  themeText: {
    fontSize: 8,
    fontWeight: "900",
    letterSpacing: 0.8,

    color: "#34345C",
  },

  // --------------------------------------------------
  // STORAGE
  // --------------------------------------------------

  storageContainer: {
    padding: 16,
  },

  storageHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
  },

  storageInfo: {
    flexDirection: "row",
    alignItems: "center",

    marginTop: 12,

    paddingLeft: 2,

    gap: 6,
  },

  storageCount: {
    fontSize: 11,
    fontWeight: "800",

    color: "#E76F51",

    letterSpacing: 0.2,
  },

  storageDetails: {
    marginTop: 16,

    paddingTop: 14,

    borderTopWidth: 1,
    borderTopColor: "#ECEBF0",
  },

  storageUsageRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    marginBottom: 9,
  },

  storageUsageLabel: {
    fontSize: 8,
    fontWeight: "900",

    color: "#707080",

    letterSpacing: 1,
  },

  storageUsageValue: {
    fontSize: 11,
    fontWeight: "900",

    color: "#34345C",
  },

  storageProgressBackground: {
    width: "100%",
    height: 7,

    borderRadius: 10,

    backgroundColor: "#ECEBF0",

    overflow: "hidden",
  },

  storageProgress: {
    height: "100%",

    borderRadius: 10,

    backgroundColor: "#E76F51",
  },

  storageBreakdown: {
    marginTop: 14,
  },

  storageBreakdownRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    marginBottom: 8,
  },

  storageBreakdownLabel: {
    fontSize: 10,

    color: "#707080",
  },

  storageBreakdownValue: {
    fontSize: 10,
    fontWeight: "700",

    color: "#34345C",
  },

  clearStorageButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",

    alignSelf: "stretch",

    marginTop: 12,

    paddingHorizontal: 12,
    paddingVertical: 11,

    borderRadius: 11,

    backgroundColor: "#FDEDEC",

    borderWidth: 1,
    borderColor: "#F5C6C2",

    gap: 6,
  },

  clearStorageText: {
    fontSize: 9,
    fontWeight: "900",

    letterSpacing: 0.6,

    color: "#D9534F",
  },

  // --------------------------------------------------
  // ACCOUNT
  // --------------------------------------------------

  accountRow: {
    minHeight: 76,

    paddingHorizontal: 14,

    flexDirection: "row",
    alignItems: "center",
  },

  accountDivider: {
    height: 1,

    backgroundColor: "#ECEBF0",

    marginLeft: 68,
  },

  // --------------------------------------------------
  // CHANGE PASSWORD
  // --------------------------------------------------

  passwordIconBox: {
    backgroundColor: "#F1F0F6",
  },

  // --------------------------------------------------
  // DELETE ACCOUNT
  // --------------------------------------------------

  deleteIconBox: {
    backgroundColor: "#FDEDEC",
  },

  deleteTitle: {
    color: "#D9534F",
  },

  deleteIcon: {
    color: "#D9534F",
  },

  // --------------------------------------------------
  // FOOTER
  // --------------------------------------------------

  footerText: {
    textAlign: "center",

    fontSize: 8,
    fontWeight: "800",

    letterSpacing: 1,

    color: "#AAA9B3",

    marginTop: 10,
  },
});

export default styles;

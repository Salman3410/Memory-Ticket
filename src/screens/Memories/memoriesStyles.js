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
});

export default styles;

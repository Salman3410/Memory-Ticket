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

    marginBottom: 22,
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
  // EDIT
  // -------------------------

  editButton: {
    height: 52,

    borderRadius: 14,

    backgroundColor: "#FFFFFF",

    borderWidth: 1,
    borderColor: "#D9D8E2",

    marginTop: 22,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",

    gap: 8,
  },

  editText: {
    fontSize: 10,
    fontWeight: "900",

    letterSpacing: 1.2,

    color: "#34345C",
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

    marginTop: 8,

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
  // FOOTER
  // -------------------------

  footerText: {
    textAlign: "center",

    fontSize: 9,
    fontWeight: "800",

    letterSpacing: 1,

    color: "#9A99A5",

    marginTop: 18,
  },

  // -------------------------
  // NOT FOUND
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
});

export default styles;

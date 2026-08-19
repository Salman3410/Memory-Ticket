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

  eyebrow: {
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 1.7,

    color: "#E76F51",

    marginBottom: 3,
  },

  title: {
    fontSize: 23,
    fontWeight: "900",

    color: "#242424",
  },

  logoCard: {
    backgroundColor: "#34345C",

    borderRadius: 23,

    alignItems: "center",

    paddingVertical: 30,

    marginBottom: 16,
  },

  logoIcon: {
    width: 64,
    height: 64,

    borderRadius: 20,

    backgroundColor: "#E76F51",

    alignItems: "center",
    justifyContent: "center",

    marginBottom: 15,
  },

  logoTitle: {
    fontSize: 25,
    fontWeight: "900",

    color: "#FFFFFF",

    marginBottom: 5,
  },

  logoSubtitle: {
    fontSize: 11,

    color: "#D9D8E2",
  },

  contentCard: {
    backgroundColor: "#FFFFFF",

    borderRadius: 20,

    borderWidth: 1,
    borderColor: "#D9D8E2",

    padding: 20,

    marginBottom: 16,
  },

  heading: {
    fontSize: 18,
    fontWeight: "900",

    color: "#242424",

    marginBottom: 12,
  },

  paragraph: {
    fontSize: 13,
    lineHeight: 20,

    color: "#707080",

    marginBottom: 12,
  },

  featureCard: {
    backgroundColor: "#FFFFFF",

    borderRadius: 20,

    borderWidth: 1,
    borderColor: "#D9D8E2",

    paddingHorizontal: 16,
    paddingVertical: 4,
  },

  feature: {
    minHeight: 72,
    gap:15,
    flexDirection: "row",
    alignItems: "center",
  },

  featureTitle: {
    fontSize: 13,
    fontWeight: "800",

    color: "#242424",

    marginBottom: 3,
  },

  featureText: {
    fontSize: 10,

    color: "#9A99A5",
  },

  divider: {
    height: 1,

    backgroundColor: "#EEEFF3",

    marginLeft: 36,
  },

  version: {
    textAlign: "center",

    fontSize: 8,
    fontWeight: "800",
    letterSpacing: 1,

    color: "#AAA9B3",

    marginTop: 20,
  },
});

export default styles;

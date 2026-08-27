import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 1.5,
    color: "#707080",
    marginTop: 28,
    marginBottom: 10,
    paddingLeft: 3,
  },

  menuContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#D9D8E2",
    overflow: "hidden",
  },

  menuItem: {
    minHeight: 70,
    paddingHorizontal: 13,
    flexDirection: "row",
    alignItems: "center",
  },

  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#F1F0F6",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  menuTextContainer: {
    flex: 1,
  },

  menuTitle: {
    fontSize: 13,
    fontWeight: "800",
    color: "#242424",
    marginBottom: 3,
  },

  menuSubtitle: {
    fontSize: 10,
    color: "#9A99A5",
  },

  menuDivider: {
    height: 1,
    backgroundColor: "#EEEFF3",
    marginLeft: 65,
  },
});

export default styles;


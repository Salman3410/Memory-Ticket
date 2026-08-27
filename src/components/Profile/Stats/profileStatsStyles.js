import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  statsContainer: {
    height: 82,
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    marginTop: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    borderWidth: 1,
    borderColor: "#D9D8E2",
  },

  stat: {
    flex: 1,
    alignItems: "center",
  },

  statNumber: {
    fontSize: 20,
    fontWeight: "900",
    color: "#34345C",
    marginBottom: 3,
  },

  statLabel: {
    fontSize: 8,
    fontWeight: "900",
    letterSpacing: 0.9,
    color: "#9A99A5",
  },

  statDivider: {
    width: 1,
    height: 32,
    backgroundColor: "#D9D8E2",
  },
});

export default styles;

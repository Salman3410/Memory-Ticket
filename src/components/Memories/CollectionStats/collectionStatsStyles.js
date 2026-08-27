import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  collectionCard: {
    height: 100,
    borderRadius: 20,
    backgroundColor: "#34345C",
    paddingHorizontal: 18,
    flexDirection: "row",
    alignItems: "center",
    overflow: "hidden",
    marginBottom: 25,
  },

  collectionIcon: {
    width: 56,
    height: 56,
    borderRadius: 17,
    backgroundColor: "#E76F51",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 15,
  },

  collectionInfo: {
    zIndex: 2,
  },

  collectionNumber: {
    fontSize: 27,
    fontWeight: "900",
    color: "#FFFFFF",
    lineHeight: 30,
  },

  collectionLabel: {
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 1.4,
    color: "#D9D8E2",
    marginTop: 3,
  },

  collectionDecor: {
    position: "absolute",
    right: -15,
    top: -25,
    width: 130,
    height: 130,
  },

  decorCircleOne: {
    position: "absolute",
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#F2C14E",
    opacity: 0.12,
  },

  decorCircleTwo: {
    position: "absolute",
    width: 75,
    height: 75,
    borderRadius: 38,
    backgroundColor: "#E76F51",
    opacity: 0.15,
    right: 5,
    bottom: 5,
  },

  favoriteStat: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginLeft: "auto",
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 10,
    backgroundColor: "#FFF7F6",
  },

  favoriteStatNumber: {
    fontSize: 12,
    fontWeight: "900",
    color: "#E76F51",
  },
});

export default styles;

import { Image, StyleSheet, View } from "react-native";

const logo = require("../../../assets/Memento-icon.png");

function MementoLogo({ size = 52, borderRadius = 26 }) {
  return (
    <View
      style={[
        styles.container,
        {
          width: size,
          height: size,
          borderRadius,
        },
      ]}
    >
      <Image
        source={logo}
        style={[
          styles.image,
          {
            width: size,
            height: size,
            borderRadius,
          },
        ]}
        resizeMode="cover"
      />
    </View>
  );
}

export default MementoLogo;

const styles = StyleSheet.create({
  container: {
    overflow: "hidden",
    backgroundColor: "#FFFFFF",
  },

  image: {
    width: "100%",
    height: "100%",
  },
});

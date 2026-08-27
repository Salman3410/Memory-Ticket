import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import styles from "../homeStyles";

function FavoriteBanner({ favoritesCount, navigation }) {
  if (favoritesCount <= 0) {
    return null;
  }

  return (
    <TouchableOpacity
      style={styles.favoriteBanner}
      onPress={() => navigation.navigate("Memories")}
      activeOpacity={0.85}
    >
      <View style={styles.favoriteBannerIcon}>
        <Ionicons name="heart" size={20} color="#E76F51" />
      </View>

      <View style={styles.favoriteBannerContent}>
        <Text style={styles.favoriteBannerTitle}>Your favorite moments</Text>

        <Text style={styles.favoriteBannerDescription}>
          {favoritesCount} {favoritesCount === 1 ? "memory" : "memories"} you've
          chosen to keep close.
        </Text>
      </View>

      <Ionicons name="arrow-forward" size={18} color="#34345C" />
    </TouchableOpacity>
  );
}

export default FavoriteBanner;

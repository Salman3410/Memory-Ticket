import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import styles from "../settingsStyles";

function AppearanceSection() {
  return (
    <>
      <Text style={styles.sectionTitle}>APPEARANCE</Text>

      <View style={styles.card}>
        <View style={styles.row}>
          <View style={styles.iconBox}>
            <Ionicons
              name="color-palette-outline"
              size={20}
              color="#34345C"
            />
          </View>

          <View style={styles.rowContent}>
            <Text style={styles.rowTitle}>
              Memory Ticket Theme
            </Text>

            <Text style={styles.rowSubtitle}>
              Minimal, nostalgic and personal.
            </Text>
          </View>

          <Text style={styles.themeText}>DEFAULT</Text>
        </View>
      </View>
    </>
  );
}

export default AppearanceSection;


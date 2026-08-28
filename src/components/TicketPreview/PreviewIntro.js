import React from "react";
import { View, Text } from "react-native";

import styles from "./previewIntroStyles";

function PreviewIntro() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Looks good?</Text>

      <Text style={styles.subtitle}>
        This moment is ready to become a ticket.
      </Text>
    </View>
  );
}

export default PreviewIntro;
  
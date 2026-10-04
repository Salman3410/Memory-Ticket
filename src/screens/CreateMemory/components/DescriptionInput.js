import { View, Text, TextInput } from "react-native";

import styles from "../createMemoryStyles";

function DescriptionInput({ description, setDescription }) {
  const handleChange = (text) => {
    if (text.length <= 100) {
      setDescription(text);
    }
  };

  return (
    <View style={styles.inputGroup}>
      <View style={styles.descriptionHeader}>
        <Text style={styles.label}>DESCRIPTION</Text>

        <Text style={styles.characterCount}>{description.length}/100</Text>
      </View>

      <TextInput
        style={styles.descriptionInput}
        value={description}
        onChangeText={handleChange}
        placeholder="Tell the story behind this moment..."
        placeholderTextColor="#9A9AA3"
        multiline
        textAlignVertical="top"
      />
    </View>
  );
}

export default DescriptionInput;

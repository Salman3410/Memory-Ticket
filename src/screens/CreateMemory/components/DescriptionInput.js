import { View, Text, TextInput } from "react-native";
import styles from "../createMemoryStyles";

function DescriptionInput({ description, setDescription }) {
  const handleChange = (text) => {
    if (text.length <= 500) {
      setDescription(text);
    }
  };

  return (
    <View style={styles.inputGroup}>
      <View style={styles.descriptionHeader}>
        <Text style={styles.label}>DESCRIPTION</Text>

        <Text style={styles.characterCount}>{description.length}/500</Text>
      </View>

      <TextInput
        style={styles.descriptionInput}
        value={description}
        onChangeText={handleChange}
        placeholder="Tell the story behind this moment..."
        placeholderTextColor="#A6A5AE"
        multiline
        textAlignVertical="top"
      />
    </View>
  );
}

export default DescriptionInput;

import { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import styles from "../../screens/CreateMemory/createMemoryStyles";

const MAX_TAGS = 20;
const MAX_TAG_LENGTH = 30;

function TagsInput({ tags, setTags }) {
  const [tagInput, setTagInput] = useState("");

  const addTag = () => {
    const normalizedTag = tagInput.trim().replace(/^#+/, "").toLowerCase();

    if (!normalizedTag) {
      return;
    }

    if (normalizedTag.length > MAX_TAG_LENGTH) {
      return;
    }

    if (tags.length >= MAX_TAGS) {
      setTagInput("");
      return;
    }

    if (tags.includes(normalizedTag)) {
      setTagInput("");
      return;
    }

    setTags([...tags, normalizedTag]);
    setTagInput("");
  };

  const removeTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleTagChange = (value) => {
    setTagInput(value.slice(0, MAX_TAG_LENGTH + 1));
  };

  return (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>TAGS</Text>

      {tags.length > 0 && (
        <View style={styles.tagsContainer}>
          {tags.map((tag) => (
            <View key={tag} style={styles.tagChip}>
              <Text style={styles.tagText}>#{tag}</Text>

              <TouchableOpacity onPress={() => removeTag(tag)} hitSlop={8}>
                <Ionicons name="close" size={15} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}

      <View style={styles.inputWithIcon}>
        <Ionicons name="pricetag-outline" size={17} color="#7E7E88" />

        <TextInput
          style={styles.iconInput}
          value={tagInput}
          onChangeText={handleTagChange}
          onSubmitEditing={addTag}
          placeholder="Add a tag"
          placeholderTextColor="#9A9AA3"
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="done"
          maxLength={MAX_TAG_LENGTH + 1}
        />

        <TouchableOpacity
          onPress={addTag}
          disabled={!tagInput.trim()}
          hitSlop={8}
          activeOpacity={0.7}
        >
          <Ionicons name="add-circle-outline" size={21} color="#34345C" />
        </TouchableOpacity>
      </View>

      <Text style={styles.helperText}>{tags.length}/20 tags</Text>
    </View>
  );
}

export default TagsInput;

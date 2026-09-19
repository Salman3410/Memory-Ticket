import { useState } from "react";

import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

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
                <Ionicons name="close" size={16} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}

      <View style={styles.inputWithIcon}>
        <Ionicons name="pricetag-outline" size={22} color="#707080" />

        <TextInput
          style={styles.iconInput}
          value={tagInput}
          onChangeText={handleTagChange}
          onSubmitEditing={addTag}
          placeholder="Add a tag"
          placeholderTextColor="#A6A5AE"
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="done"
          maxLength={MAX_TAG_LENGTH + 1}
        />

        <TouchableOpacity
          onPress={addTag}
          disabled={!tagInput.trim()}
          hitSlop={8}
        >
          <Ionicons name="add-circle-outline" size={24} color="#34345C" />
        </TouchableOpacity>
      </View>

      <Text style={styles.helperText}>{tags.length}/20 tags</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  inputGroup: {
    marginBottom: 18,
  },

  label: {
    fontSize: 12,
    fontWeight: "700",
    color: "#707080",
    letterSpacing: 0.8,
    marginBottom: 8,
  },

  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 10,
    gap: 8,
  },

  tagChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#34345C",
    borderRadius: 16,
    paddingLeft: 12,
    paddingRight: 9,
    paddingVertical: 7,
  },

  tagText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "600",
  },

  inputWithIcon: {
    minHeight: 52,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#D9D8E2",
    borderRadius: 12,
    paddingHorizontal: 14,
    backgroundColor: "#FFFFFF",
  },

  iconInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 15,
    color: "#242424",
    paddingVertical: 0,
  },

  helperText: {
    marginTop: 6,
    fontSize: 11,
    color: "#A6A5AE",
  },
});

export default TagsInput;

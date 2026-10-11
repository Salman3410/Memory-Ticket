import { useState } from "react";
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import styles from "../../screens/CreateMemory/createMemoryStyles";

const MAX_TAGS = 20;
const MAX_TAG_LENGTH = 30;

function TagsInput({ tags, setTags, theme, isDark }) {
  const [tagInput, setTagInput] = useState("");

  const colors = theme?.colors || {};

  const textColor =
    colors.text || (isDark ? "#F1F0F6" : "#242424");

  const mutedTextColor =
    colors.textSecondary ||
    colors.textMuted ||
    (isDark ? "#A6A6B8" : "#737387");

  const placeholderColor =
    colors.placeholder ||
    (isDark ? "#88889C" : "#9A9AA3");

  const surfaceColor =
    colors.surface ||
    colors.card ||
    (isDark ? "#232333" : "#FFFFFF");

  const borderColor =
    colors.border || (isDark ? "#38384C" : "#D9D8E2");

  const primaryColor =
    colors.primary || "#34345C";

  const accentColor =
    colors.accent || "#E76F51";

  const addTag = () => {
    const normalizedTag = tagInput
      .trim()
      .replace(/^#+/, "")
      .toLowerCase();

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
      <Text
        style={[
          styles.label,
          {
            color: textColor,
          },
        ]}
      >
        TAGS
      </Text>

      {/* TAG CHIPS */}

      {tags.length > 0 && (
        <View style={styles.tagsContainer}>
          {tags.map((tag) => (
            <View
              key={tag}
              style={[
                styles.tagChip,
                {
                  backgroundColor: primaryColor,
                },
              ]}
            >
              <Text style={styles.tagText}>
                #{tag}
              </Text>

              <TouchableOpacity
                onPress={() => removeTag(tag)}
                hitSlop={8}
                activeOpacity={0.7}
                accessibilityRole="button"
                accessibilityLabel={`Remove tag ${tag}`}
              >
                <Ionicons
                  name="close"
                  size={15}
                  color="#FFFFFF"
                />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}

      {/* TAG INPUT */}

      <View
        style={[
          styles.inputWithIcon,
          {
            backgroundColor: surfaceColor,
            borderColor,
          },
        ]}
      >
        <Ionicons
          name="pricetag-outline"
          size={17}
          color={mutedTextColor}
        />

        <TextInput
          style={[
            styles.iconInput,
            {
              color: textColor,
              backgroundColor: "transparent",
            },
          ]}
          value={tagInput}
          onChangeText={handleTagChange}
          onSubmitEditing={addTag}
          placeholder="Add a tag"
          placeholderTextColor={placeholderColor}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="done"
          maxLength={MAX_TAG_LENGTH + 1}
          selectionColor={accentColor}
        />

        <TouchableOpacity
          onPress={addTag}
          disabled={!tagInput.trim()}
          hitSlop={8}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="Add tag"
          accessibilityState={{
            disabled: !tagInput.trim(),
          }}
        >
          <Ionicons
            name="add-circle-outline"
            size={21}
            color={
              tagInput.trim()
                ? accentColor
                : mutedTextColor
            }
          />
        </TouchableOpacity>
      </View>

      {/* TAG COUNTER */}

      <Text
        style={[
          styles.helperText,
          {
            color: mutedTextColor,
          },
        ]}
      >
        {tags.length}/{MAX_TAGS} tags
      </Text>
    </View>
  );
}

export default TagsInput;

import React from "react";

import { View, Text, TextInput } from "react-native";

import { Ionicons } from "@expo/vector-icons";

import styles from "./editMemoryDetailsStyles";

function EditMemoryDetails({
  title,
  setTitle,
  location,
  setLocation,
  description,
  setDescription,
  theme,
  isDark,
}) {
  const colors = theme?.colors || {};

  const textColor = colors.text || (isDark ? "#F1F0F6" : "#242424");

  const mutedTextColor =
    colors.textSecondary ||
    colors.textMuted ||
    (isDark ? "#A6A6B8" : "#737387");

  const placeholderColor =
    colors.placeholder || (isDark ? "#88889C" : "#9A9AA3");

  const surfaceColor =
    colors.surface || colors.card || (isDark ? "#232333" : "#FFFFFF");

  const borderColor = colors.border || (isDark ? "#38384C" : "#D9D8E2");

  const accentColor = colors.accent || "#E76F51";

  const inputContainerStyle = {
    backgroundColor: surfaceColor,
    borderColor,
  };

  const inputTextStyle = {
    color: textColor,
    backgroundColor: "transparent",
  };

  // --------------------------------------------------
  // RENDER
  // --------------------------------------------------

  return (
    <View style={styles.section}>
      {/* SECTION HEADER */}

      <View style={styles.sectionHeader}>
        <Text
          style={[
            styles.sectionTitle,
            {
              color: textColor,
            },
          ]}
        >
          Edit the story
        </Text>

        <Text
          style={[
            styles.stepText,
            {
              color: accentColor,
            },
          ]}
        >
          DETAILS
        </Text>
      </View>

      {/* MEMORY TITLE */}

      <View style={styles.inputGroup}>
        <Text
          style={[
            styles.label,
            {
              color: textColor,
            },
          ]}
        >
          MEMORY TITLE
        </Text>

        <View style={[styles.inputWithIcon, inputContainerStyle]}>
          <Ionicons name="text-outline" size={17} color={mutedTextColor} />

          <TextInput
            style={[styles.iconInput, inputTextStyle]}
            placeholder="Memory title"
            placeholderTextColor={placeholderColor}
            value={title}
            onChangeText={setTitle}
            maxLength={50}
            autoCapitalize="sentences"
            autoCorrect={false}
            selectionColor={accentColor}
          />
        </View>
      </View>

      {/* LOCATION */}

      <View style={styles.inputGroup}>
        <Text
          style={[
            styles.label,
            {
              color: textColor,
            },
          ]}
        >
          LOCATION
        </Text>

        <View style={[styles.inputWithIcon, inputContainerStyle]}>
          <Ionicons name="location-outline" size={17} color={mutedTextColor} />

          <TextInput
            style={[styles.iconInput, inputTextStyle]}
            placeholder="Where did it happen?"
            placeholderTextColor={placeholderColor}
            value={location}
            onChangeText={setLocation}
            maxLength={60}
            autoCapitalize="sentences"
            autoCorrect={false}
            selectionColor={accentColor}
          />
        </View>
      </View>

      {/* DESCRIPTION */}

      <View style={styles.inputGroup}>
        <View style={styles.descriptionHeader}>
          <Text
            style={[
              styles.label,
              {
                color: textColor,
              },
            ]}
          >
            DESCRIPTION
          </Text>

          <Text
            style={[
              styles.characterCount,
              {
                color: mutedTextColor,
              },
            ]}
          >
            {description.length}/100
          </Text>
        </View>

        <TextInput
          style={[
            styles.descriptionInput,
            {
              backgroundColor: surfaceColor,
              borderColor,
              color: textColor,
            },
          ]}
          placeholder="Write something you'll want to remember..."
          placeholderTextColor={placeholderColor}
          value={description}
          onChangeText={setDescription}
          multiline
          maxLength={100}
          textAlignVertical="top"
          selectionColor={accentColor}
        />
      </View>
    </View>
  );
}

export default EditMemoryDetails;

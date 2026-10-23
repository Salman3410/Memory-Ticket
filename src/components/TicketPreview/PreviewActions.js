import { useCallback, useRef } from "react";
import {
  Animated,
  View,
  Text,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import styles from "./previewActionsStyles";

function darkenHexColor(color) {
  const hex = color.replace("#", "");

  if (!/^[0-9a-fA-F]{6}$/.test(hex)) {
    return "#252545";
  }

  const channels = [0, 2, 4].map((index) =>
    Math.round(
      parseInt(hex.slice(index, index + 2), 16) * 0.7
    )
  );

  return `#${channels
    .map((value) => value.toString(16).padStart(2, "0"))
    .join("")}`;
}

function PreviewActions({
  onSave,
  onEdit,
  theme,
  isDark,
}) {
  const colors = theme?.colors || {};

  const primaryColor = colors.primary || "#34345C";

  const surfaceColor =
    colors.surface ||
    colors.card ||
    (isDark ? "#232333" : "#FFFFFF");

  const textColor =
    colors.text ||
    (isDark ? "#F1F0F6" : "#242424");

  const borderColor =
    colors.border ||
    (isDark ? "#38384C" : "#D9D8E2");

  const tactileBaseColor = darkenHexColor(primaryColor);

  const saveTranslateY = useRef(
    new Animated.Value(0)
  ).current;

  const animateSaveButton = useCallback(
    (pressed) => {
      Animated.spring(saveTranslateY, {
        toValue: pressed ? 4 : 0,
        stiffness: 350,
        damping: 25,
        mass: 0.6,
        useNativeDriver: true,
      }).start();
    },
    [saveTranslateY]
  );

  return (
    <View style={styles.container}>
      {/* TACTILE SAVE MEMORY BUTTON */}
      <View
        style={{
          position: "relative",
          marginBottom: 4,
        }}
      >
        {/* Dark bottom layer */}
        <View
          pointerEvents="none"
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 4,
            bottom: -4,
            borderRadius: 12,
            backgroundColor: tactileBaseColor,
          }}
        />

        {/* Animated button face */}
        <Animated.View
          style={{
            transform: [
              {
                translateY: saveTranslateY,
              },
            ],
          }}
        >
          <TouchableOpacity
            style={[
              styles.saveButton,
              {
                backgroundColor: primaryColor,
              },
            ]}
            onPress={onSave}
            onPressIn={() => animateSaveButton(true)}
            onPressOut={() => animateSaveButton(false)}
            activeOpacity={1}
            accessibilityRole="button"
            accessibilityLabel="Save memory"
          >
            <Ionicons
              name="bookmark-outline"
              size={20}
              color="#FFFFFF"
            />

            <Text style={styles.saveButtonText}>
              SAVE MEMORY
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </View>

      {/* EDIT BUTTON — ORIGINAL BEHAVIOR */}
      <TouchableOpacity
        style={[
          styles.editButton,
          {
            backgroundColor: surfaceColor,
            borderColor,
          },
        ]}
        onPress={onEdit}
        activeOpacity={0.8}
      >
        <Ionicons
          name="create-outline"
          size={19}
          color={primaryColor}
        />

        <Text
          style={[
            styles.editButtonText,
            {
              color: primaryColor || textColor,
            },
          ]}
        >
          EDIT
        </Text>
      </TouchableOpacity>
    </View>
  );
}

export default PreviewActions;

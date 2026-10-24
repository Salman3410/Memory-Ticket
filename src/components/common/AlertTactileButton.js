import React, { useCallback, useRef } from "react";

import {
  Animated,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

function darkenHexColor(color, factor = 0.7) {
  if (typeof color !== "string") {
    return "#252545";
  }

  let hex = color.replace("#", "").trim();

  if (/^[0-9a-fA-F]{3}$/.test(hex)) {
    hex = hex
      .split("")
      .map((character) => character + character)
      .join("");
  }

  if (!/^[0-9a-fA-F]{6}$/.test(hex)) {
    return "#252545";
  }

  const channels = [0, 2, 4].map((index) =>
    Math.round(
      parseInt(hex.slice(index, index + 2), 16) * factor
    )
  );

  return `#${channels
    .map((value) => value.toString(16).padStart(2, "0"))
    .join("")}`;
}

function AlertTactileButton({
  label,
  onPress,
  icon,
  iconSize = 17,
  iconPosition = "left",

  color = "#34345C",
  textColor = "#FFFFFF",
  iconColor,

  baseColor,
  height = 48,
  borderRadius = 14,
  depth = 2,

  disabled = false,

  style,
  contentStyle,
  textStyle,

  accessibilityLabel,
}) {
  const translateY = useRef(new Animated.Value(0)).current;

  const bottomColor = baseColor || darkenHexColor(color);

  const animateButton = useCallback(
    (pressed) => {
      Animated.spring(translateY, {
        toValue: pressed && !disabled ? depth : 0,
        stiffness: 350,
        damping: 25,
        mass: 0.6,
        useNativeDriver: true,
      }).start();
    },
    [translateY, disabled, depth]
  );

  return (
    <View
      style={[
        styles.wrapper,
        { marginBottom: depth },
        style,
      ]}
    >
      {/* DARK BOTTOM LAYER */}
      <View
        pointerEvents="none"
        style={[
          styles.bottomLayer,
          {
            top: depth,
            bottom: -depth,
            borderRadius,
            backgroundColor: bottomColor,
          },
        ]}
      />

      {/* ANIMATED BUTTON */}
      <Animated.View
        style={[
          styles.animatedContainer,
          {
            transform: [{ translateY }],
          },
        ]}
      >
        <Pressable
          onPress={onPress}
          onPressIn={() => animateButton(true)}
          onPressOut={() => animateButton(false)}
          disabled={disabled}
          accessibilityRole="button"
          accessibilityLabel={accessibilityLabel || label}
          accessibilityState={{ disabled }}
          style={[
            styles.button,
            {
              height,
              borderRadius,
              backgroundColor: color,
              opacity: disabled ? 0.65 : 1,
            },
            contentStyle,
          ]}
        >
          {icon && iconPosition === "left" && (
            <Ionicons
              name={icon}
              size={iconSize}
              color={iconColor || textColor}
            />
          )}

          <Text
            numberOfLines={1}
            style={[
              styles.label,
              { color: textColor },
              textStyle,
            ]}
          >
            {label}
          </Text>

          {icon && iconPosition === "right" && (
            <Ionicons
              name={icon}
              size={iconSize}
              color={iconColor || textColor}
            />
          )}
        </Pressable>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  // Deliberately no default width: the parent controls the button width.
  wrapper: {
    position: "relative",
    minWidth: 0,
  },

  animatedContainer: {
    width: "100%",
  },

  bottomLayer: {
    position: "absolute",
    left: 0,
    right: 0,
  },

  button: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingHorizontal: 8,
    overflow: "hidden",
  },

  label: {
    flexShrink: 1,
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 0.4,
    textAlign: "center",
  },
});

export default React.memo(AlertTactileButton);
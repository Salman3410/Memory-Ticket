
import React, { useCallback, useRef } from "react";

import {
  ActivityIndicator,
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

function TactileButton({
  label = "CONTINUE",
  onPress,
  icon,
  iconSize = 20,
  iconPosition = "left",

  color = "#34345C",
  textColor = "#FFFFFF",
  iconColor,

  baseColor,
  height = 56,
  borderRadius = 14,
  depth = 4,

  loading = false,
  loadingText = "PLEASE WAIT...",
  disabled = false,

  style,
  textStyle,
  contentStyle,

  accessibilityLabel,
  accessibilityHint,

  ...pressableProps
}) {
  const translateY = useRef(new Animated.Value(0)).current;

  const isDisabled = disabled || loading;

  const bottomColor = baseColor || darkenHexColor(color);

  const animateButton = useCallback(
    (pressed) => {
      Animated.spring(translateY, {
        toValue: pressed && !isDisabled ? depth : 0,
        stiffness: 350,
        damping: 25,
        mass: 0.6,
        useNativeDriver: true,
      }).start();
    },
    [translateY, isDisabled, depth]
  );

  const handlePressIn = () => {
    animateButton(true);
  };

  const handlePressOut = () => {
    animateButton(false);
  };

  return (
    <View
      style={[
        styles.wrapper,
        {
          marginBottom: depth,
        },
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

      {/* ANIMATED BUTTON FACE */}

      <Animated.View
        style={{
          transform: [{ translateY }],
        }}
      >
        <Pressable
          {...pressableProps}
          onPress={onPress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          disabled={isDisabled}
          accessibilityRole="button"
          accessibilityLabel={accessibilityLabel || label}
          accessibilityHint={accessibilityHint}
          accessibilityState={{
            disabled: isDisabled,
            busy: loading,
          }}
          style={[
            styles.button,
            {
              height,
              borderRadius,
              backgroundColor: color,
              opacity: isDisabled ? 0.65 : 1,
            },
            contentStyle,
          ]}
        >
          {loading ? (
            <>
              <ActivityIndicator
                size="small"
                color={textColor}
              />

              <Text
                style={[
                  styles.label,
                  { color: textColor },
                  textStyle,
                ]}
              >
                {loadingText}
              </Text>
            </>
          ) : (
            <>
              {/* LEFT ICON */}

              {icon && iconPosition === "left" ? (
                <Ionicons
                  name={icon}
                  size={iconSize}
                  color={iconColor || textColor}
                />
              ) : null}

              {/* LABEL — RENDERED ONCE */}

              <Text
                style={[
                  styles.label,
                  { color: textColor },
                  textStyle,
                ]}
              >
                {label}
              </Text>

              {/* RIGHT ICON */}

              {icon && iconPosition === "right" ? (
                <Ionicons
                  name={icon}
                  size={iconSize}
                  color={iconColor || textColor}
                />
              ) : null}
            </>
          )}
        </Pressable>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
    position: "relative",
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
    gap: 9,
    paddingHorizontal: 16,

    shadowColor: "#34345C",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.12,
    shadowRadius: 3,
    elevation: 2,
  },

  label: {
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 1.2,
    textAlign: "center",
  },
});

export default React.memo(TactileButton);

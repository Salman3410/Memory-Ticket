import React from "react";
import { View, TouchableOpacity, Text,StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";


function CustomTabBar({ state, descriptors, navigation }) {
  const getIcon = (routeName, focused) => {
    switch (routeName) {
      case "Home":
        return focused ? "home" : "home-outline";

      case "Memories":
        return focused ? "ticket" : "ticket-outline";

      case "Create":
        return "add";

      case "Profile":
        return focused ? "person" : "person-outline";

      default:
        return "ellipse-outline";
    }
  };

  const handlePress = (route, isFocused) => {
    const event = navigation.emit({
      type: "tabPress",
      target: route.key,
      canPreventDefault: true,
    });

    if (!isFocused && !event.defaultPrevented) {
      navigation.navigate(route.name);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.tabBar}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];

          const isFocused = state.index === index;

          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
                ? options.title
                : route.name;

          const isCreate = route.name === "Create";

          if (isCreate) {
            return (
              <TouchableOpacity
                key={route.key}
                style={styles.createTab}
                activeOpacity={0.8}
                onPress={() => handlePress(route, isFocused)}
              >
                <View style={styles.createIcon}>
                  <Ionicons
                    name={getIcon(route.name, isFocused)}
                    size={23}
                    color="#FFFFFF"
                  />
                </View>

                <Text style={styles.createLabel}>{label}</Text>
              </TouchableOpacity>
            );
          }

          return (
            <TouchableOpacity
              key={route.key}
              style={styles.tab}
              activeOpacity={0.7}
              onPress={() => handlePress(route, isFocused)}
            >
              <View
                style={[
                  styles.iconWrapper,
                  isFocused && styles.activeIconWrapper,
                ]}
              >
                <Ionicons
                  name={getIcon(route.name, isFocused)}
                  size={21}
                  color={isFocused ? "#34345C" : "#9695A2"}
                />
              </View>

              <Text style={[styles.label, isFocused && styles.activeLabel]}>
                {label}
              </Text>

              {isFocused && <View style={styles.activeIndicator} />}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

export default CustomTabBar;
const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,

    paddingHorizontal: 18,
    paddingBottom: 16,
  },

  // -------------------------
  // TAB BAR
  // -------------------------

  tabBar: {
    height: 72,

    backgroundColor: "#FFFFFF",

    borderRadius: 20,

    borderWidth: 1,
    borderColor: "#D9D8E2",

    flexDirection: "row",
    alignItems: "center",

    shadowColor: "#242440",
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 12,

    elevation: 8,

    overflow: "hidden",
  },

  // -------------------------
  // NORMAL TAB
  // -------------------------

  tab: {
    flex: 1,
    height: "100%",

    alignItems: "center",
    justifyContent: "center",

    position: "relative",
  },

  iconWrapper: {
    width: 38,
    height: 32,

    alignItems: "center",
    justifyContent: "center",

    borderRadius: 10,
  },

  activeIconWrapper: {
    backgroundColor: "#F1F0F6",
  },

  label: {
    fontSize: 8,
    fontWeight: "800",
    letterSpacing: 0.8,

    color: "#9695A2",

    marginTop: 3,
  },

  activeLabel: {
    color: "#34345C",
  },

  // -------------------------
  // ACTIVE INDICATOR
  // -------------------------

  activeIndicator: {
    position: "absolute",

    bottom: 6,

    width: 4,
    height: 4,

    borderRadius: 2,

    backgroundColor: "#E76F51",
  },

  // -------------------------
  // CREATE TAB
  // -------------------------

  createTab: {
    flex: 1,

    height: "100%",

    alignItems: "center",
    justifyContent: "center",

    position: "relative",
  },

  createIcon: {
    width: 40,
    height: 40,

    borderRadius: 13,

    backgroundColor: "#E76F51",

    alignItems: "center",
    justifyContent: "center",

    shadowColor: "#E76F51",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.18,
    shadowRadius: 5,

    elevation: 4,
  },

  createLabel: {
    fontSize: 8,
    fontWeight: "900",
    letterSpacing: 0.8,

    color: "#E76F51",

    marginTop: 3,
  },
});


import { memo } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

function CustomTabBar({
  state,
  descriptors,
  navigation,
}) {
  const getIcon = (
    routeName,
    focused,
  ) => {
    switch (routeName) {
      case "Home":
        return focused
          ? "home"
          : "home-outline";

      case "Memories":
        return focused
          ? "ticket"
          : "ticket-outline";

      case "Create":
        return "add";

      case "Dashboard":
        return focused
          ? "grid"
          : "grid-outline";

      case "Profile":
        return focused
          ? "person"
          : "person-outline";

      default:
        return "ellipse-outline";
    }
  };

  const handlePress = (
    route,
    isFocused,
  ) => {
    const event =
      navigation.emit({
        type: "tabPress",
        target: route.key,
        canPreventDefault: true,
      });

    if (
      !isFocused &&
      !event.defaultPrevented
    ) {
      navigation.navigate(
        route.name,
      );
    }
  };

  const handleLongPress = (
    route,
  ) => {
    navigation.emit({
      type: "tabLongPress",
      target: route.key,
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.tabBar}>
        {state.routes.map(
          (route, index) => {
            const { options } =
              descriptors[route.key];

            const isFocused =
              state.index === index;

            const isCreate =
              route.name === "Create";

            return (
              <TabItem
                key={route.key}
                icon={getIcon(
                  route.name,
                  isFocused,
                )}
                isFocused={isFocused}
                isCreate={isCreate}
                onPress={() =>
                  handlePress(
                    route,
                    isFocused,
                  )
                }
                onLongPress={() =>
                  handleLongPress(
                    route,
                  )
                }
                accessibilityLabel={
                  options.tabBarAccessibilityLabel ||
                  options.tabBarLabel ||
                  options.title ||
                  route.name
                }
              />
            );
          },
        )}
      </View>
    </View>
  );
}


const TabItem = memo(
  function TabItem({
    icon,
    isFocused,
    isCreate,
    onPress,
    onLongPress,
    accessibilityLabel,
  }) {
    const pressScale =
      useSharedValue(1);

    const handlePressIn = () => {
      pressScale.value = withSpring(
        isCreate ? 1.18 : 1.24,
        {
          damping: 9,
          stiffness: 320,
          mass: 0.32,
        },
      );
    };

    const handlePressOut = () => {
      pressScale.value = withSpring(
        1,
        {
          damping: 11,
          stiffness: 260,
          mass: 0.4,
        },
      );
    };

    const animatedStyle =
      useAnimatedStyle(() => {
        return {
          transform: [
            {
              scale: pressScale.value,
            },
          ],
        };
      });

    return (
      <TouchableOpacity
        style={styles.tab}
        activeOpacity={0.9}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={onPress}
        onLongPress={onLongPress}
        accessibilityRole="button"
        accessibilityState={{
          selected: isFocused,
        }}
        accessibilityLabel={
          accessibilityLabel
        }
      >
        <Animated.View
          style={[
            isCreate
              ? styles.createButton
              : styles.iconButton,
            animatedStyle,
          ]}
        >
          <Ionicons
            name={icon}
            size={isCreate ? 23 : 22}
            color={
              isCreate
                ? "#FFFFFF"
                : isFocused
                  ? "#34345C"
                  : "#92919D"
            }
          />
        </Animated.View>
      </TouchableOpacity>
    );
  },
);

export default CustomTabBar;

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 18,
    paddingBottom: 14,
  },

  tabBar: {
    height: 58,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E3E1E9",
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#34345C",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.07,
    shadowRadius: 10,
    elevation: 5,
  },

  tab: {
    flex: 1,
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },

  iconButton: {
    width: 48,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
  },

  createButton: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#E76F51",
    shadowColor: "#E76F51",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.14,
    shadowRadius: 5,
    elevation: 3,
  },
});

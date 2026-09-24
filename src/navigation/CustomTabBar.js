import { useEffect, memo, useState } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";

function CustomTabBar({
  state,
  descriptors,
  navigation,
}) {
  const [barWidth, setBarWidth] = useState(0);

  const tabCount = state.routes.length;

  const activeIndex = useSharedValue(
    state.index,
  );

  const liquidScale = useSharedValue(1);

  const tabWidth =
    tabCount > 0 && barWidth > 0
      ? barWidth / tabCount
      : 0;

  const activeRoute =
    state.routes[state.index];

  const isCreateActive =
    activeRoute?.name === "Create";

  useEffect(() => {
    activeIndex.value = withTiming(
      state.index,
      {
        duration: 260,
        easing: Easing.out(
          Easing.cubic,
        ),
      },
    );


    liquidScale.value = withSequence(
      withTiming(1.1, {
        duration: 100,
        easing: Easing.out(
          Easing.cubic,
        ),
      }),

      withSpring(1, {
        damping: 20,
        stiffness: 180,
        mass: 0.6,
      }),
    );
  }, [state.index]);

  const activeBubbleStyle =
    useAnimatedStyle(() => {
      const bubbleWidth = 48;

      const translateX =
        activeIndex.value *
          tabWidth +
        (tabWidth - bubbleWidth) / 2;

      return {
        transform: [
          {
            translateX,
          },
          {
            scaleX:
              liquidScale.value,
          },
        ],
      };
    });

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
      <View
        style={styles.tabBar}
        onLayout={(event) => {
          const { width } =
            event.nativeEvent.layout;

          setBarWidth(width);
        }}
      >
        {/* Active liquid bubble */}
        {!isCreateActive &&
          barWidth > 0 && (
            <Animated.View
              pointerEvents="none"
              style={[
                styles.activeBubble,
                activeBubbleStyle,
              ]}
            />
          )}

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
                routeName={route.name}
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
    const iconScale =
      useSharedValue(
        isFocused ? 1.06 : 1,
      );

    useEffect(() => {
      iconScale.value =
        withSpring(
          isFocused ? 1.06 : 1,
          {
            damping: 16,
            stiffness: 240,
            mass: 0.45,
          },
        );
    }, [isFocused]);

    const iconAnimatedStyle =
      useAnimatedStyle(() => {
        return {
          transform: [
            {
              scale:
                iconScale.value,
            },
          ],
        };
      });

    return (
      <TouchableOpacity
        style={styles.tab}
        activeOpacity={0.8}
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
            iconAnimatedStyle,
          ]}
        >
          <Ionicons
            name={icon}
            size={
              isCreate ? 23 : 21
            }
            color={
              isCreate
                ? "#FFFFFF"
                : isFocused
                  ? "#FFFFFF"
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
  // =========================
  // OUTER CONTAINER
  // =========================

  container: {
    position: "absolute",

    left: 0,
    right: 0,
    bottom: 0,

    paddingHorizontal: 18,
    paddingBottom: 14,
  },

  // =========================
  // TAB BAR
  // =========================

  tabBar: {
    height: 58,

    backgroundColor: "#FFFFFF",

    borderRadius: 20,

    borderWidth: 1,
    borderColor: "#E3E1E9",

    flexDirection: "row",
    alignItems: "center",

    position: "relative",

    overflow: "hidden",

    shadowColor: "#34345C",

    shadowOffset: {
      width: 0,
      height: 4,
    },

    shadowOpacity: 0.07,
    shadowRadius: 10,

    elevation: 5,
  },

  // =========================
  // ACTIVE LIQUID BUBBLE
  // =========================

  activeBubble: {
    position: "absolute",

    left: 0,
    top: 5,

    width: 48,
    height: 48,

    borderRadius: 17,

    backgroundColor: "#34345C",

    zIndex: 0,
  },

  // =========================
  // TAB
  // =========================

  tab: {
    flex: 1,

    height: "100%",

    alignItems: "center",
    justifyContent: "center",

    zIndex: 2,
  },

  // =========================
  // NORMAL ICON
  // =========================

  iconButton: {
    width: 48,
    height: 48,

    borderRadius: 17,

    alignItems: "center",
    justifyContent: "center",
  },

  // =========================
  // CREATE BUTTON
  // =========================

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

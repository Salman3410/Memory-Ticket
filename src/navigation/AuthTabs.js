import { useEffect } from "react";

import {
  View,
  Text,
  Image,
  StyleSheet,
} from "react-native";

import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";

import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import LoginScreen from "../screens/Auth/LoginScreen";
import SignupScreen from "../screens/Auth/SignupScreen";

const Tab = createMaterialTopTabNavigator();

const AnimatedView =
  Animated.createAnimatedComponent(View);

function AuthTabs() {
  const brandOpacity = useSharedValue(0);
  const brandY = useSharedValue(10);

  useEffect(() => {
    brandOpacity.value = withTiming(1, {
      duration: 450,
      easing: Easing.out(Easing.cubic),
    });

    brandY.value = withTiming(0, {
      duration: 450,
      easing: Easing.out(Easing.cubic),
    });
  }, []);

  const brandAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: brandOpacity.value,
      transform: [
        {
          translateY: brandY.value,
        },
      ],
    };
  });

  return (
    <View style={styles.authTabsContainer}>
      {/* Memento Brand */}
      <AnimatedView
        style={[
          styles.brandContainer,
          brandAnimatedStyle,
        ]}
      >
        <View style={styles.brandIcon}>
          <Image
            source={require("../../assets/icon.png")}
            style={styles.logoImage}
            resizeMode="contain"
          />
        </View>

        <Text style={styles.brandText}>
          MEMENTO
        </Text>
      </AnimatedView>

      {/* Login / Signup Tabs */}
      <Tab.Navigator
        initialRouteName="Login"
        screenOptions={{
          swipeEnabled: true,

          tabBarStyle: styles.tabBar,

          tabBarContentContainerStyle:
            styles.tabBarContent,

          tabBarItemStyle:
            styles.tabBarItem,

          tabBarLabelStyle:
            styles.tabBarLabel,

          tabBarActiveTintColor:
            "#34345C",

          tabBarInactiveTintColor:
            "#8B8A98",

          tabBarIndicatorStyle:
            styles.tabBarIndicator,

          tabBarIndicatorContainerStyle:
            styles.tabBarIndicatorContainer,

          tabBarPressColor:
            "transparent",

          tabBarPressOpacity: 0.7,

          tabBarBounces: false,

          tabBarAllowFontScaling: false,
        }}
      >
        <Tab.Screen
          name="Login"
          component={LoginScreen}
          options={{
            tabBarLabel: "LOGIN",
          }}
        />

        <Tab.Screen
          name="Signup"
          component={SignupScreen}
          options={{
            tabBarLabel: "SIGN UP",
          }}
        />
      </Tab.Navigator>
    </View>
  );
}

const styles = StyleSheet.create({
  authTabsContainer: {
    flex: 1,
    backgroundColor: "#F1F0F6",
  },

  // =========================
  // MEMENTO BRAND
  // =========================

  brandContainer: {
    alignItems: "center",
    justifyContent: "center",

    marginBottom: 8,

    paddingTop: 70,
  },

  brandIcon: {
    alignItems: "center",
    justifyContent: "center",
  },

  logoImage: {
    width: 58,
    height: 58,
    borderRadius: 30,
  },

  brandText: {
    marginTop: 10,

    fontSize: 18,
    fontWeight: "800",

    letterSpacing: 3,

    color: "#34345C",
  },

  // =========================
  // TOP TAB BAR
  // =========================

  tabBar: {
    height: 58,

    backgroundColor: "#F1F0F6",

    elevation: 0,

    shadowColor: "transparent",
    shadowOpacity: 0,
    shadowRadius: 0,

    borderBottomWidth: 0,
  },

  tabBarContent: {
    paddingHorizontal: 18,

    paddingTop: 6,
    paddingBottom: 6,
  },

  tabBarItem: {
    minHeight: 46,

    justifyContent: "center",
  },

  tabBarLabel: {
    fontSize: 12,

    fontWeight: "700",

    letterSpacing: 1,

    textAlign: "center",
  },

  tabBarIndicatorContainer: {
    paddingHorizontal: 18,
  },

  tabBarIndicator: {
    height: 3,

    backgroundColor: "#34345C",

    borderRadius: 3,

    marginHorizontal: 34,
  },
});

export default AuthTabs;

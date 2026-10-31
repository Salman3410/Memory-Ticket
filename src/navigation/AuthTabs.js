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

import { useTheme } from "../context/ThemeContext";

import LoginScreen from "../screens/Auth/LoginScreen";
import SignupScreen from "../screens/Auth/SignupScreen";

const Tab = createMaterialTopTabNavigator();

const AnimatedView = Animated.createAnimatedComponent(View);

function AuthTabs() {
  const { theme, isDark } = useTheme();
  const colors = theme?.colors || {};

  const backgroundColor =
    colors.background || (isDark ? "#171624" : "#F1F0F6");

  const surfaceColor =
    colors.surface || (isDark ? "#211F30" : "#FFFFFF");

  const textColor =
    colors.text || (isDark ? "#F7F5FC" : "#242424");

  const secondaryTextColor =
    colors.textSecondary ||
    colors.textMuted ||
    (isDark ? "#C4C0D0" : "#8B8A98");

  const borderColor =
    colors.border || (isDark ? "#39364D" : "#D9D8E2");

  const primaryColor =
    colors.primary || (isDark ? "#C8C2FF" : "#34345C");

  const styles = createStyles({
    backgroundColor,
    surfaceColor,
    textColor,
    secondaryTextColor,
    borderColor,
    primaryColor,
  });

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
  }, [brandOpacity, brandY]);

  const brandAnimatedStyle = useAnimatedStyle(() => ({
    opacity: brandOpacity.value,
    transform: [{ translateY: brandY.value }],
  }));

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
            source={require("../../assets/appIcon.png")}
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

          sceneStyle: {
            backgroundColor,
          },

          tabBarStyle: styles.tabBar,

          tabBarContentContainerStyle:
            styles.tabBarContent,

          tabBarItemStyle:
            styles.tabBarItem,

          tabBarLabelStyle:
            styles.tabBarLabel,

          tabBarActiveTintColor: primaryColor,

          tabBarInactiveTintColor: secondaryTextColor,

          tabBarIndicatorStyle:
            styles.tabBarIndicator,

          tabBarIndicatorContainerStyle:
            styles.tabBarIndicatorContainer,

          tabBarPressColor: "transparent",

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

function createStyles({
  backgroundColor,
  surfaceColor,
  textColor,
  secondaryTextColor,
  borderColor,
  primaryColor,
}) {
  return StyleSheet.create({
    authTabsContainer: {
      flex: 1,
      backgroundColor,
    },

    // MEMENTO BRAND
    brandContainer: {
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 8,
      paddingTop: 70,
    },

    brandIcon: {
      width: 62,
      height: 62,
      alignItems: "center",
      justifyContent: "center",
      overflow: "hidden",
      borderRadius: 18,
      backgroundColor: surfaceColor,
      borderWidth: 1,
      borderColor,
    },

    logoImage: {
      width: 62,
      height: 62,
      maxWidth: 62,
      maxHeight: 62,
    },

    brandText: {
      marginTop: 10,
      fontSize: 18,
      fontWeight: "800",
      letterSpacing: 3,
      color: textColor,
    },

    // TOP TAB BAR
    tabBar: {
      height: 58,
      backgroundColor,
      elevation: 0,
      shadowColor: "transparent",
      shadowOpacity: 0,
      shadowRadius: 0,
      borderBottomWidth: 1,
      borderBottomColor: borderColor,
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
      backgroundColor: primaryColor,
      borderRadius: 3,
      marginHorizontal: 34,
    },
  });
}

export default AuthTabs;
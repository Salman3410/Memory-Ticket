import { View, Text, Image, StyleSheet } from "react-native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import LoginScreen from "../screens/Auth/LoginScreen";
import SignupScreen from "../screens/Auth/SignupScreen";

const Tab = createMaterialTopTabNavigator();

function AuthTabs() {
  return (
    <View style={styles.authTabsContainer}>
      {/* Memento Brand */}
      <View style={styles.brandContainer}>
        <View style={styles.brandIcon}>
          <Image
            source={require("../../assets/icon.png")}
            style={styles.logoImage}
            resizeMode="contain"
          />
        </View>

        <Text style={styles.brandText}>MEMENTO</Text>
      </View>

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
          tabBarActiveTintColor: "#34345C",
          tabBarInactiveTintColor: "#8B8A98",
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

const styles = StyleSheet.create({
  authTabsContainer: {
    flex: 1,
    backgroundColor: "#F1F0F6",
  },

  brandContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
    paddingTop:70
  },

  brandIcon: {
    alignItems: "center",
    justifyContent: "center",
  },

  logoImage: {
    width: 58,
    height: 58,
    borderRadius:30
  },

  brandText: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: "800",
    letterSpacing: 3,
    color: "#34345C",
  },

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

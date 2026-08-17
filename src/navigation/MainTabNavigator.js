import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import HomeScreen from "../screens/Home/HomeScreen";
import MemoriesScreen from "../screens/Memories/MemoriesScreen";
import CreateMemoryScreen from "../screens/CreateMemory/CreateMemoryScreen";
import ProfileScreen from "../screens/Profile/ProfileScreen";

import CustomTabBar from "./CustomTabBar";

const Tab = createBottomTabNavigator();

function MainTabNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: "HOME",
        }}
      />

      <Tab.Screen
        name="Memories"
        component={MemoriesScreen}
        options={{
          tabBarLabel: "MEMORIES",
        }}
      />

      <Tab.Screen
        name="Create"
        component={CreateMemoryScreen}
        options={{
          tabBarLabel: "CREATE",
        }}
      />

      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: "PROFILE",
        }}
      />
    </Tab.Navigator>
  );
}

export default MainTabNavigator;

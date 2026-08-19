import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import MainTabNavigator from "./MainTabNavigator";
import TicketPreviewScreen from "../screens/TicketPreview/TicketPreviewScreen";
import MemoryDetailsScreen from "../screens/MemoryDetails/MemoryDetailsScreen";
import EditMemoryScreen from "../screens/EditMemory/EditMemoryScreen";
import SettingsScreen from "../screens/Settings/SettingsScreen";
import AboutScreen from "../screens/About/AboutScreen";
import EditProfileScreen from "../screens/Profile/EditProfileScreen";
import ChangePasswordScreen from "../screens/ChangePassword/ChangePasswordScreen";

const Stack = createNativeStackNavigator();

function AppNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="MainTabs" component={MainTabNavigator} />

      <Stack.Screen name="TicketPreview" component={TicketPreviewScreen} />

      <Stack.Screen name="MemoryDetails" component={MemoryDetailsScreen} />

      <Stack.Screen name="EditMemory" component={EditMemoryScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="About" component={AboutScreen} />
      <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
      <Stack.Screen
        name="EditProfile"
        component={EditProfileScreen}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
}

export default AppNavigator;

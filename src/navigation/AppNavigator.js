import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import MainTabNavigator from "./MainTabNavigator";
import TicketPreviewScreen from "../screens/TicketPreview/TicketPreviewScreen";
import MemoryDetailsScreen from "../screens/MemoryDetails/MemoryDetailsScreen";

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
    </Stack.Navigator>
  );
}

export default AppNavigator;

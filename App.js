import React from "react";
import { NavigationContainer } from "@react-navigation/native";

import { AuthProvider } from "./src/context/AuthContext";
import { MemoryProvider } from "./src/context/MemoryContext";

import RootNavigator from "./src/navigation/RootNavigator";

function App() {
  return (
    <AuthProvider>
      <MemoryProvider>
        <NavigationContainer>
          <RootNavigator />
        </NavigationContainer>
      </MemoryProvider>
    </AuthProvider>
  );
}

export default App;

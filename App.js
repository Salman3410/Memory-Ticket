import React from "react";
import { NavigationContainer } from "@react-navigation/native";

import { MemoryProvider } from "./src/context/MemoryContext";

import RootNavigator from "./src/navigation/RootNavigator";

function App() {
  return (
    <MemoryProvider>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </MemoryProvider>
  );
}

export default App;

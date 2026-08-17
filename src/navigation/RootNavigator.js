import React from "react";

import AuthNavigator from "./AuthNavigator";
import AppNavigator from "./AppNavigator";

function RootNavigator() {
  const isAuthenticated = true;

  return <>{isAuthenticated ? <AppNavigator /> : <AuthNavigator />}</>;
}

export default RootNavigator;

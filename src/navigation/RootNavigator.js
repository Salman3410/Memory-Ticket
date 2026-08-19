import React from "react";
import { useAuth } from "../hooks/useAuth";

import AuthNavigator from "./AuthNavigator";
import AppNavigator from "./AppNavigator";

function RootNavigator() {
  const { user, loading } = useAuth();

  if (loading) {
    return null;
  }

  return user ? <AppNavigator /> : <AuthNavigator />;
}

export default RootNavigator;

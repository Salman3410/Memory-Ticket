import * as LocalAuthentication from "expo-local-authentication";
import * as SecureStore from "expo-secure-store";

const APP_LOCK_KEY = "memento.appLock.enabled";

export async function getAppLockEnabled() {
  const value = await SecureStore.getItemAsync(APP_LOCK_KEY);
  return value === "true";
}

export async function setAppLockEnabled(enabled) {
  await SecureStore.setItemAsync(APP_LOCK_KEY, enabled ? "true" : "false");
}

export async function getBiometricSupport() {
  const compatible = await LocalAuthentication.hasHardwareAsync();
  const enrolled = await LocalAuthentication.isEnrolledAsync();

  return {
    compatible,
    enrolled,
    supported: compatible && enrolled,
  };
}

export async function authenticateAppLock() {
  const support = await getBiometricSupport();

  if (!support.supported) {
    return {
      success: false,
      reason: "biometric_unavailable",
    };
  }

  const result = await LocalAuthentication.authenticateAsync({
    promptMessage: "Unlock Memento",
    cancelLabel: "Cancel",
    disableDeviceFallback: false,
  });

  return {
    success: result.success,
    reason: result.success ? null : result.error || "authentication_failed",
  };
}

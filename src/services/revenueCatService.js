import { Platform } from "react-native";
import Purchases from "react-native-purchases";

const PREMIUM_ENTITLEMENT = "premium";

function getApiKey() {
  if (Platform.OS === "ios") {
    return process.env.EXPO_PUBLIC_REVENUECAT_IOS_API_KEY || "";
  }

  if (Platform.OS === "android") {
    return process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_API_KEY || "";
  }

  return process.env.EXPO_PUBLIC_REVENUECAT_WEB_API_KEY || "";
}

function getUserId(user) {
  return String(user?._id || user?.id || "");
}

let configuredApiKey = null;

export function isRevenueCatConfigured() {
  return Boolean(getApiKey());
}

export async function configureRevenueCat(user) {
  const apiKey = getApiKey();
  const appUserId = getUserId(user);

  if (!apiKey) return { configured: false, reason: "missing_api_key" };
  if (!appUserId) return { configured: false, reason: "missing_user_id" };

  if (!configuredApiKey) {
    Purchases.configure({
      apiKey,
      appUserID: appUserId,
    });

    configuredApiKey = apiKey;

    return {
      configured: true,
      customerInfo: await Purchases.getCustomerInfo(),
    };
  }

  return {
    configured: true,
    customerInfo: await Purchases.logIn(appUserId),
  };
}

export async function logOutRevenueCat() {
  if (!configuredApiKey) return null;

  try {
    return await Purchases.logOut();
  } catch {
    return null;
  }
}

export async function getRevenueCatCustomerInfo() {
  if (!configuredApiKey) return null;
  return Purchases.getCustomerInfo();
}

export async function getRevenueCatOfferings() {
  if (!configuredApiKey) return null;
  return Purchases.getOfferings();
}

export async function purchaseRevenueCatPackage(packageToPurchase) {
  if (!configuredApiKey) {
    throw new Error("Subscription billing is not configured yet.");
  }

  return Purchases.purchasePackage(packageToPurchase);
}

export async function restoreRevenueCatPurchases() {
  if (!configuredApiKey) {
    throw new Error("Subscription billing is not configured yet.");
  }

  return Purchases.restorePurchases();
}

export function hasPremiumEntitlement(customerInfo) {
  return Boolean(
    customerInfo?.entitlements?.active?.[PREMIUM_ENTITLEMENT],
  );
}

export const PREMIUM_ENTITLEMENT_ID = PREMIUM_ENTITLEMENT;

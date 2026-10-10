import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { useAuth } from "../hooks/useAuth";
import {
  PREMIUM_FEATURES,
  SUBSCRIPTION_PLANS,
  STORAGE_LIMITS,
} from "../constants/subscription";
import {
  configureRevenueCat,
  getRevenueCatCustomerInfo,
  getRevenueCatOfferings,
  hasPremiumEntitlement,
  logOutRevenueCat,
  purchaseRevenueCatPackage,
  restoreRevenueCatPurchases,
  isRevenueCatConfigured,
} from "../services/revenueCatService";

export const SubscriptionContext = createContext(null);

function isPremiumFromUser(user) {
  if (!user) return false;
  if (user.isPremium === true) return true;

  return Boolean(
    user.subscription?.plan === SUBSCRIPTION_PLANS.PREMIUM &&
      user.subscription?.status === "active",
  );
}

export function SubscriptionProvider({ children }) {
  const { user } = useAuth();
  const [customerInfo, setCustomerInfo] = useState(null);
  const [offerings, setOfferings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [purchaseLoading, setPurchaseLoading] = useState(false);
  const [billingConfigured, setBillingConfigured] = useState(false);

  const refreshSubscription = useCallback(async () => {
    if (!user) {
      setCustomerInfo(null);
      setOfferings(null);
      setBillingConfigured(false);
      setLoading(false);
      return null;
    }

    if (!isRevenueCatConfigured()) {
      setBillingConfigured(false);
      setLoading(false);
      return null;
    }

    try {
      setLoading(true);
      const configured = await configureRevenueCat(user);

      if (!configured.configured) {
        setBillingConfigured(false);
        return null;
      }

      setBillingConfigured(true);

      const [nextCustomerInfo, nextOfferings] = await Promise.all([
        getRevenueCatCustomerInfo(),
        getRevenueCatOfferings(),
      ]);

      setCustomerInfo(nextCustomerInfo || configured.customerInfo || null);
      setOfferings(nextOfferings || null);

      return nextCustomerInfo || configured.customerInfo || null;
    } catch (error) {
      console.error("RevenueCat initialization error:", error);
      setBillingConfigured(false);
      return null;
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    refreshSubscription();
  }, [refreshSubscription]);

  useEffect(() => {
    if (user) return undefined;

    logOutRevenueCat();
    return undefined;
  }, [user]);

  const isPremium =
    hasPremiumEntitlement(customerInfo) || isPremiumFromUser(user);

  const plan = isPremium
    ? SUBSCRIPTION_PLANS.PREMIUM
    : SUBSCRIPTION_PLANS.FREE;

  const storageLimitBytes = isPremium
    ? STORAGE_LIMITS.premiumBytes
    : STORAGE_LIMITS.freeBytes;

  const hasPremiumFeature = useCallback(
    (feature) =>
      isPremium && Object.values(PREMIUM_FEATURES).includes(feature),
    [isPremium],
  );

  const requirePremium = useCallback(
    (feature) => ({
      allowed: hasPremiumFeature(feature),
      feature,
    }),
    [hasPremiumFeature],
  );

  const purchasePackage = useCallback(async (packageToPurchase) => {
    setPurchaseLoading(true);

    try {
      const result = await purchaseRevenueCatPackage(packageToPurchase);
      setCustomerInfo(result?.customerInfo || null);
      return result;
    } finally {
      setPurchaseLoading(false);
    }
  }, []);

  const restorePurchases = useCallback(async () => {
    setPurchaseLoading(true);

    try {
      const nextCustomerInfo = await restoreRevenueCatPurchases();
      setCustomerInfo(nextCustomerInfo || null);
      return nextCustomerInfo;
    } finally {
      setPurchaseLoading(false);
    }
  }, []);

  const value = useMemo(
    () => ({
      plan,
      isPremium,
      customerInfo,
      offerings,
      loading,
      purchaseLoading,
      billingConfigured,
      storageLimitBytes,
      refreshSubscription,
      purchasePackage,
      restorePurchases,
      hasPremiumFeature,
      requirePremium,
    }),
    [
      plan,
      isPremium,
      customerInfo,
      offerings,
      loading,
      purchaseLoading,
      billingConfigured,
      storageLimitBytes,
      refreshSubscription,
      purchasePackage,
      restorePurchases,
      hasPremiumFeature,
      requirePremium,
    ],
  );

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription() {
  const context = useContext(SubscriptionContext);

  if (!context) {
    throw new Error(
      "useSubscription must be used inside SubscriptionProvider.",
    );
  }

  return context;
}

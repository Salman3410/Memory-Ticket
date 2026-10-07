import {
  createContext,
  useCallback,
  useContext,
  useMemo,
} from "react";

import { useAuth } from "../hooks/useAuth";

import {
  PREMIUM_FEATURES,
  SUBSCRIPTION_PLANS,
  STORAGE_LIMITS,
} from "../constants/subscription";

export const SubscriptionContext = createContext(null);

function isPremiumUser(user) {
  if (!user) {
    return false;
  }

  if (user.isPremium === true) {
    return true;
  }

  const subscription = user.subscription;

  if (!subscription) {
    return false;
  }

  return (
    subscription.plan === SUBSCRIPTION_PLANS.PREMIUM &&
    subscription.status === "active"
  );
}

export function SubscriptionProvider({ children }) {
  const { user } = useAuth();

  const isPremium = isPremiumUser(user);

  const plan = isPremium
    ? SUBSCRIPTION_PLANS.PREMIUM
    : SUBSCRIPTION_PLANS.FREE;

  const storageLimitBytes = isPremium
    ? STORAGE_LIMITS.premiumBytes
    : STORAGE_LIMITS.freeBytes;

  const hasPremiumFeature = useCallback(
    (feature) => {
      return isPremium && Object.values(PREMIUM_FEATURES).includes(feature);
    },
    [isPremium],
  );

  const requirePremium = useCallback(
    (feature) => {
      return {
        allowed: hasPremiumFeature(feature),
        feature,
      };
    },
    [hasPremiumFeature],
  );

  const value = useMemo(
    () => ({
      plan,
      isPremium,
      storageLimitBytes,
      hasPremiumFeature,
      requirePremium,
    }),
    [
      plan,
      isPremium,
      storageLimitBytes,
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

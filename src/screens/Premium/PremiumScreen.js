import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { useSubscription } from "../../context/SubscriptionContext";
import {
  PREMIUM_FEATURE_LIST,
  SUBSCRIPTION_PRICING,
} from "../../constants/subscription";

import styles from "./premiumStyles";

function PremiumScreen({ navigation }) {
  const { isPremium } = useSubscription();
  const [selectedPlan, setSelectedPlan] = useState("annual");
  const [loading, setLoading] = useState(false);

  const selectedPricing = useMemo(
    () => SUBSCRIPTION_PRICING[selectedPlan],
    [selectedPlan],
  );

  const handlePurchase = async () => {
    setLoading(true);

    try {
      // Billing provider integration will be connected here.
      // The entitlement layer is intentionally provider-agnostic.
    } finally {
      setLoading(false);
    }
  };

  if (isPremium) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.8}
          >
            <Ionicons name="chevron-back" size={23} color="#34345C" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>MEMENTO PREMIUM</Text>

          <View style={styles.headerSpacer} />
        </View>

        <View style={styles.activeContainer}>
          <View style={styles.activeIcon}>
            <Ionicons name="sparkles" size={28} color="#34345C" />
          </View>

          <Text style={styles.activeTitle}>Premium is active</Text>

          <Text style={styles.activeText}>
            Your Memento Premium benefits are unlocked.
          </Text>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.85}
          >
            <Text style={styles.secondaryButtonText}>BACK TO MEMENTO</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.8}
          >
            <Ionicons name="chevron-back" size={23} color="#34345C" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>MEMENTO PREMIUM</Text>

          <View style={styles.headerSpacer} />
        </View>

        <View style={styles.hero}>
          <View style={styles.heroBadge}>
            <Ionicons name="sparkles" size={16} color="#34345C" />
            <Text style={styles.heroBadgeText}>PREMIUM</Text>
          </View>

          <Text style={styles.heroTitle}>
            Preserve more.
            {"\n"}
            Create more.
            {"\n"}
            Relive more.
          </Text>

          <Text style={styles.heroSubtitle}>
            Unlock the advanced side of Memento while keeping your memories
            yours.
          </Text>
        </View>

        <View style={styles.storageCard}>
          <View style={styles.storageIcon}>
            <Ionicons name="cloud-outline" size={22} color="#34345C" />
          </View>

          <View style={styles.storageContent}>
            <Text style={styles.storageTitle}>25 GB Cloud Storage</Text>
            <Text style={styles.storageSubtitle}>
              Free includes 2 GB. Premium expands your memory archive to 25 GB.
            </Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>PREMIUM FEATURES</Text>

        <View style={styles.featureCard}>
          {PREMIUM_FEATURE_LIST.map((feature, index) => (
            <View
              key={feature.key}
              style={[
                styles.featureRow,
                index === PREMIUM_FEATURE_LIST.length - 1 &&
                  styles.featureRowLast,
              ]}
            >
              <View style={styles.featureIcon}>
                <Ionicons
                  name={feature.icon}
                  size={19}
                  color="#34345C"
                />
              </View>

              <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>{feature.title}</Text>
                <Text style={styles.featureDescription}>
                  {feature.description}
                </Text>
              </View>

              <Ionicons name="checkmark" size={18} color="#E76F51" />
            </View>
          ))}
        </View>

        <Text style={styles.sectionTitle}>CHOOSE YOUR PLAN</Text>

        <View style={styles.planGroup}>
          <TouchableOpacity
            style={[
              styles.planCard,
              selectedPlan === "monthly" && styles.planCardSelected,
            ]}
            onPress={() => setSelectedPlan("monthly")}
            activeOpacity={0.85}
          >
            <View style={styles.planRadio}>
              {selectedPlan === "monthly" ? (
                <View style={styles.planRadioSelected} />
              ) : null}
            </View>

            <View style={styles.planContent}>
              <Text style={styles.planTitle}>MONTHLY</Text>
              <Text style={styles.planPrice}>PKR 200</Text>
              <Text style={styles.planPeriod}>per month</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.planCard,
              selectedPlan === "annual" && styles.planCardSelected,
            ]}
            onPress={() => setSelectedPlan("annual")}
            activeOpacity={0.85}
          >
            <View style={styles.planBadge}>
              <Text style={styles.planBadgeText}>BEST VALUE</Text>
            </View>

            <View style={styles.planRadio}>
              {selectedPlan === "annual" ? (
                <View style={styles.planRadioSelected} />
              ) : null}
            </View>

            <View style={styles.planContent}>
              <Text style={styles.planTitle}>ANNUAL</Text>
              <Text style={styles.planPrice}>PKR 1,700</Text>
              <Text style={styles.planPeriod}>per year • save PKR 700</Text>
            </View>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.purchaseButton, loading && styles.purchaseButtonDisabled]}
          onPress={handlePurchase}
          disabled={loading}
          activeOpacity={0.85}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <>
              <Text style={styles.purchaseButtonText}>
                START PREMIUM • {selectedPricing.label.replace("PKR ", "PKR ")}
              </Text>
              <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
            </>
          )}
        </TouchableOpacity>

        <Text style={styles.disclaimer}>
          Subscription purchases will be completed through the platform
          billing system. Restore purchase and subscription management will be
          added with the billing provider integration.
        </Text>
      </ScrollView>
    </View>
  );
}

export default React.memo(PremiumScreen);

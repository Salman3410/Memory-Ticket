import React, { memo, useMemo, useState } from "react";

import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  StatusBar,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { useSubscription } from "../../context/SubscriptionContext";
import { useTheme } from "../../context/ThemeContext";

import {
  PREMIUM_FEATURE_LIST,
  SUBSCRIPTION_PRICING,
} from "../../constants/subscription";

import styles from "./premiumStyles";

function PremiumScreen({ navigation }) {
  const { isPremium } = useSubscription();

  const { theme, isDark } = useTheme();
  const { colors } = theme;

  const [selectedPlan, setSelectedPlan] = useState("annual");
  const [loading, setLoading] = useState(false);

  const selectedPricing = useMemo(
    () => SUBSCRIPTION_PRICING[selectedPlan],
    [selectedPlan],
  );

  // --------------------------------------------------
  // PURCHASE
  // --------------------------------------------------

  const handlePurchase = async () => {
    if (loading) return;

    setLoading(true);

    try {
      // Billing provider integration will be connected here.
      // The entitlement layer remains provider-agnostic.
    } finally {
      setLoading(false);
    }
  };

  // --------------------------------------------------
  // SHARED HEADER
  // --------------------------------------------------

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity
        style={[
          styles.backButton,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
          },
        ]}
        onPress={() => navigation.goBack()}
        activeOpacity={0.8}
      >
        <Ionicons name="chevron-back" size={23} color={colors.icon} />
      </TouchableOpacity>

      <Text style={[styles.headerTitle, { color: colors.text }]}>
        MEMENTO PREMIUM
      </Text>

      <View style={styles.headerSpacer} />
    </View>
  );

  // --------------------------------------------------
  // ACTIVE PREMIUM
  // --------------------------------------------------

  if (isPremium) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <StatusBar
          barStyle={isDark ? "light-content" : "dark-content"}
          backgroundColor={colors.background}
        />

        {renderHeader()}

        <View style={styles.activeContainer}>
          <View
            style={[
              styles.activeIcon,
              {
                backgroundColor: colors.surfaceSecondary,
              },
            ]}
          >
            <Ionicons name="sparkles" size={28} color={colors.accent} />
          </View>

          <Text style={[styles.activeTitle, { color: colors.text }]}>
            Premium is active
          </Text>

          <Text style={[styles.activeText, { color: colors.textSecondary }]}>
            Your Memento Premium benefits are unlocked.
          </Text>

          <TouchableOpacity
            style={[
              styles.secondaryButton,
              { backgroundColor: colors.primary },
            ]}
            onPress={() => navigation.goBack()}
            activeOpacity={0.85}
          >
            <Text
              style={[
                styles.secondaryButtonText,
                { color: colors.primaryText },
              ]}
            >
              BACK TO MEMENTO
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // --------------------------------------------------
  // PREMIUM OFFER
  // --------------------------------------------------

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor={colors.background}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {renderHeader()}

        {/* HERO */}

        <View
          style={[
            styles.hero,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
            },
          ]}
        >
          <View
            style={[
              styles.heroBadge,
              {
                backgroundColor: colors.surfaceSecondary,
              },
            ]}
          >
            <Ionicons name="sparkles" size={16} color={colors.accent} />

            <Text style={[styles.heroBadgeText, { color: colors.text }]}>
              PREMIUM
            </Text>
          </View>

          <Text style={[styles.heroTitle, { color: colors.text }]}>
            Preserve more.
            {"\n"}
            Create more.
            {"\n"}
            Relive more.
          </Text>

          <Text style={[styles.heroSubtitle, { color: colors.textSecondary }]}>
            Unlock the advanced side of Memento while keeping your memories
            yours.
          </Text>
        </View>

        {/* CLOUD STORAGE */}

        <View
          style={[
            styles.storageCard,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
            },
          ]}
        >
          <View
            style={[
              styles.storageIcon,
              {
                backgroundColor: colors.surfaceSecondary,
              },
            ]}
          >
            <Ionicons name="cloud-outline" size={22} color={colors.icon} />
          </View>

          <View style={styles.storageContent}>
            <Text style={[styles.storageTitle, { color: colors.text }]}>
              25 GB Cloud Storage
            </Text>

            <Text
              style={[styles.storageSubtitle, { color: colors.textSecondary }]}
            >
              Free includes 2 GB. Premium expands your memory archive to 25 GB.
            </Text>
          </View>
        </View>

        {/* PREMIUM FEATURES */}

        <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>
          PREMIUM FEATURES
        </Text>

        <View
          style={[
            styles.featureCard,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
            },
          ]}
        >
          {PREMIUM_FEATURE_LIST.map((feature, index) => {
            const isLast = index === PREMIUM_FEATURE_LIST.length - 1;

            return (
              <View
                key={feature.key}
                style={[
                  styles.featureRow,
                  {
                    borderBottomColor: colors.divider,
                  },
                  isLast && styles.featureRowLast,
                ]}
              >
                <View
                  style={[
                    styles.featureIcon,
                    {
                      backgroundColor: colors.surfaceSecondary,
                    },
                  ]}
                >
                  <Ionicons name={feature.icon} size={19} color={colors.icon} />
                </View>

                <View style={styles.featureContent}>
                  <Text style={[styles.featureTitle, { color: colors.text }]}>
                    {feature.title}
                  </Text>

                  <Text
                    style={[
                      styles.featureDescription,
                      { color: colors.textSecondary },
                    ]}
                  >
                    {feature.description}
                  </Text>
                </View>

                <Ionicons name="checkmark" size={18} color={colors.accent} />
              </View>
            );
          })}
        </View>

        {/* PLAN SELECTION */}

        <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>
          CHOOSE YOUR PLAN
        </Text>

        <View style={styles.planGroup}>
          {/* MONTHLY */}

          <TouchableOpacity
            style={[
              styles.planCard,
              {
                backgroundColor: colors.surface,
                borderColor:
                  selectedPlan === "monthly" ? colors.accent : colors.border,
              },
              selectedPlan === "monthly" && styles.planCardSelected,
            ]}
            onPress={() => setSelectedPlan("monthly")}
            activeOpacity={0.85}
          >
            <View
              style={[
                styles.planRadio,
                {
                  borderColor:
                    selectedPlan === "monthly" ? colors.accent : colors.border,
                },
              ]}
            >
              {selectedPlan === "monthly" && (
                <View
                  style={[
                    styles.planRadioSelected,
                    { backgroundColor: colors.accent },
                  ]}
                />
              )}
            </View>

            <View style={styles.planContent}>
              <Text style={[styles.planTitle, { color: colors.textSecondary }]}>
                MONTHLY
              </Text>

              <Text style={[styles.planPrice, { color: colors.text }]}>
                PKR 200
              </Text>

              <Text
                style={[styles.planPeriod, { color: colors.textSecondary }]}
              >
                per month
              </Text>
            </View>
          </TouchableOpacity>

          {/* ANNUAL */}

          <TouchableOpacity
            style={[
              styles.planCard,
              {
                backgroundColor: colors.surface,
                borderColor:
                  selectedPlan === "annual" ? colors.accent : colors.border,
              },
              selectedPlan === "annual" && styles.planCardSelected,
            ]}
            onPress={() => setSelectedPlan("annual")}
            activeOpacity={0.85}
          >
            <View
              style={[styles.planBadge, { backgroundColor: colors.accent }]}
            >
              <Text style={[styles.planBadgeText, { color: "#FFFFFF" }]}>
                BEST VALUE
              </Text>
            </View>

            <View
              style={[
                styles.planRadio,
                {
                  borderColor:
                    selectedPlan === "annual" ? colors.accent : colors.border,
                },
              ]}
            >
              {selectedPlan === "annual" && (
                <View
                  style={[
                    styles.planRadioSelected,
                    { backgroundColor: colors.accent },
                  ]}
                />
              )}
            </View>

            <View style={styles.planContent}>
              <Text style={[styles.planTitle, { color: colors.textSecondary }]}>
                ANNUAL
              </Text>

              <Text style={[styles.planPrice, { color: colors.text }]}>
                PKR 1,700
              </Text>

              <Text
                style={[styles.planPeriod, { color: colors.textSecondary }]}
              >
                per year • save PKR 700
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* PURCHASE BUTTON */}

        <TouchableOpacity
          style={[
            styles.purchaseButton,
            {
              backgroundColor: colors.primary,
              opacity: loading ? 0.65 : 1,
            },
            loading && styles.purchaseButtonDisabled,
          ]}
          onPress={handlePurchase}
          disabled={loading}
          activeOpacity={0.85}
        >
          {loading ? (
            <ActivityIndicator color={colors.primaryText} />
          ) : (
            <>
              <Text
                style={[
                  styles.purchaseButtonText,
                  { color: colors.primaryText },
                ]}
              >
                START PREMIUM • {selectedPricing.label}
              </Text>

              <Ionicons
                name="arrow-forward"
                size={18}
                color={colors.primaryText}
              />
            </>
          )}
        </TouchableOpacity>

        {/* DISCLAIMER */}

        <Text style={[styles.disclaimer, { color: colors.textMuted }]}>
          Subscription purchases will be completed through the platform billing
          system. Restore purchase and subscription management will be added
          with the billing provider integration.
        </Text>
      </ScrollView>
    </View>
  );
}

export default memo(PremiumScreen);

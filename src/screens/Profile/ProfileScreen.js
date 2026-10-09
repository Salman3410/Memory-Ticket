import React from "react";

import { View, Text, ScrollView, StatusBar } from "react-native";

import { useMemory } from "../../hooks/useMemory";
import { useAuth } from "../../hooks/useAuth";
import { useRewards } from "../../hooks/useRewards";

import { useSubscription } from "../../context/SubscriptionContext";
import { useAppAlert } from "../../context/AlertContext";
import { useTheme } from "../../context/ThemeContext";

import ProfileCard from "../../components/Profile/Card/ProfileCard";
import ProfileStats from "../../components/Profile/Stats/ProfileStats";
import ProfileMenu from "../../components/Profile/Menu/ProfileMenu";
import LogoutButton from "../../components/Profile/Logout/LogoutButton";

import styles from "./profileStyles";

function ProfileScreen({ navigation }) {
  const { memories } = useMemory();
  const { user, logout } = useAuth();
  const { coins } = useRewards();

  const { isPremium } = useSubscription();
  const { showAlert } = useAppAlert();

  const { theme, isDark } = useTheme();
  const { colors } = theme;

  const stats = {
    memories: memories.length,
    tickets: memories.length,
    favorites: memories.filter((memory) => memory.favorite).length,
  };

  // --------------------------------------------------
  // NAVIGATION
  // --------------------------------------------------

  const handleEditProfile = () => {
    navigation.getParent()?.navigate("EditProfile");
  };

  const handlePremium = () => {
    navigation.getParent()?.navigate("Premium");
  };

  const handleSettings = () => {
    navigation.getParent()?.navigate("Settings");
  };

  const handleAbout = () => {
    navigation.getParent()?.navigate("About");
  };

  const handleRewards = () => {
    showAlert({
      type: "info",
      icon: "gift-outline",
      title: "Memento Rewards",
      message: "The rewards section is coming soon.",
      confirmText: "OK",
      showClose: true,
    });
  };

  // --------------------------------------------------
  // LOGOUT
  // --------------------------------------------------

  const handleLogout = () => {
    showAlert({
      type: "warning",
      icon: "log-out-outline",
      title: "Log Out?",
      message: "Are you sure you want to log out of Memento?",
      cancelText: "Cancel",
      confirmText: "Log Out",
      showCancel: true,

      onConfirm: async () => {
        try {
          await logout();
        } catch (error) {
          console.error("Logout error:", error);

          showAlert({
            type: "danger",
            icon: "close-circle-outline",
            title: "Logout Failed",
            message: "Unable to log out. Please try again.",
            confirmText: "OK",
          });
        }
      },
    });
  };

  // --------------------------------------------------
  // ACCOUNT MENU
  // --------------------------------------------------

  const accountMenuItems = [
    {
      title: "Memento Premium",
      subtitle: isPremium
        ? "Premium is active"
        : "Unlock advanced Memento features",
      icon: "sparkles-outline",
      onPress: handlePremium,
    },
    {
      title: "Edit Profile",
      subtitle: "Change your name or profile photo",
      icon: "person-outline",
      onPress: handleEditProfile,
    },
    {
      title: "Memento Rewards",
      subtitle: `${coins} Coins • Earn and redeem rewards`,
      icon: "gift-outline",
      onPress: handleRewards,
    },
    {
      title: "Settings",
      subtitle: "Manage your app preferences",
      icon: "options-outline",
      onPress: handleSettings,
    },
    {
      title: "About Memento",
      subtitle: "Learn more about the app",
      icon: "information-circle-outline",
      onPress: handleAbout,
    },
  ];

  // --------------------------------------------------
  // APP MENU
  // --------------------------------------------------

  const appMenuItems = [
    {
      title: "Your Favorites",
      subtitle: "Memories you don't want to forget",
      icon: "heart-outline",
      onPress: () =>
        navigation.navigate("Memories", {
          filter: "favorites",
        }),
    },
  ];

  // --------------------------------------------------
  // UI
  // --------------------------------------------------

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.background,
        },
      ]}
    >
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor={colors.background}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* HEADER */}

        <View style={styles.header}>
          <View>
            <Text style={[styles.headerEyebrow, { color: colors.accent }]}>
              YOUR SPACE
            </Text>

            <Text style={[styles.headerTitle, { color: colors.text }]}>
              Profile
            </Text>
          </View>
        </View>

        {/* PROFILE CARD */}

        <ProfileCard
          user={user}
          onEditProfile={handleEditProfile}
          colors={colors}
          isDark={isDark}
        />

        {/* PROFILE STATS */}

        <ProfileStats stats={stats} colors={colors} isDark={isDark} />

        {/* ACCOUNT MENU */}

        <ProfileMenu
          title="ACCOUNT"
          items={accountMenuItems}
          colors={colors}
          isDark={isDark}
        />

        {/* APP MENU */}

        <ProfileMenu
          title="APP"
          items={appMenuItems}
          colors={colors}
          isDark={isDark}
        />

        {/* LOGOUT */}

        <LogoutButton onPress={handleLogout} colors={colors} isDark={isDark} />

        {/* VERSION */}

        <Text style={[styles.versionText, { color: colors.textMuted }]}>
          MEMENTO • VERSION 2.5.0
        </Text>
      </ScrollView>
    </View>
  );
}

export default ProfileScreen;

import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { useMemory } from "../../hooks/useMemory";
import { useAuth } from "../../hooks/useAuth";

import styles from "./profileStyles";

function ProfileScreen({ navigation }) {
  const { memories } = useMemory();
  const { user, logout } = useAuth();

  const stats = {
    memories: memories.length,
    tickets: memories.length,
    favorites: memories.filter((memory) => memory.favorite).length,
  };

  const handleEditProfile = () => {
    navigation.getParent()?.navigate("EditProfile");
  };

  const handleSettings = () => {
    navigation.navigate("Settings");
  };

  const handleAbout = () => {
    navigation.navigate("About");
  };

  const handleLogout = () => {
    Alert.alert("Log Out", "Are you sure you want to log out?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Log Out",
        style: "destructive",
        onPress: logout,
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}

        <View style={styles.header}>
          <View>
            <Text style={styles.headerEyebrow}>YOUR SPACE</Text>

            <Text style={styles.headerTitle}>Profile</Text>
          </View>

          <TouchableOpacity
            style={styles.settingsButton}
            onPress={handleSettings}
            activeOpacity={0.7}
          >
            <Ionicons name="settings-outline" size={21} color="#34345C" />
          </TouchableOpacity>
        </View>

        {/* Profile Card */}

        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            {user?.profileImage ? (
              <Image
                source={{
                  uri: user.profileImage,
                }}
                style={styles.avatar}
              />
            ) : (
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {user?.name?.charAt(0)?.toUpperCase() || "M"}
                </Text>
              </View>
            )}

            <TouchableOpacity
              style={styles.cameraButton}
              onPress={handleEditProfile}
              activeOpacity={0.8}
            >
              <Ionicons name="camera" size={13} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          <Text style={styles.userName}>{user?.name || "Memory Keeper"}</Text>

          <Text style={styles.userEmail}>{user?.email || ""}</Text>

          <View style={styles.memberBadge}>
            <Ionicons name="ticket-outline" size={13} color="#E76F51" />

            <Text style={styles.memberBadgeText}>MEMORY COLLECTOR</Text>
          </View>
        </View>

        {/* Stats */}

        <View style={styles.statsContainer}>
          <View style={styles.stat}>
            <Text style={styles.statNumber}>{stats.memories}</Text>

            <Text style={styles.statLabel}>MEMORIES</Text>
          </View>

          <View style={styles.statDivider} />

          <View style={styles.stat}>
            <Text style={styles.statNumber}>{stats.tickets}</Text>

            <Text style={styles.statLabel}>TICKETS</Text>
          </View>

          <View style={styles.statDivider} />

          <View style={styles.stat}>
            <Text style={styles.statNumber}>{stats.favorites}</Text>

            <Text style={styles.statLabel}>FAVORITES</Text>
          </View>
        </View>

        {/* Account */}

        <Text style={styles.sectionTitle}>ACCOUNT</Text>

        <View style={styles.menuContainer}>
          {/* Edit Profile */}

          <TouchableOpacity
            style={styles.menuItem}
            onPress={handleEditProfile}
            activeOpacity={0.7}
          >
            <View style={styles.menuIcon}>
              <Ionicons name="person-outline" size={19} color="#34345C" />
            </View>

            <View style={styles.menuTextContainer}>
              <Text style={styles.menuTitle}>Edit Profile</Text>

              <Text style={styles.menuSubtitle}>
                Change your name or profile photo
              </Text>
            </View>

            <Ionicons name="chevron-forward" size={18} color="#A4A3AE" />
          </TouchableOpacity>

          <View style={styles.menuDivider} />

          {/* Settings */}

          <TouchableOpacity
            style={styles.menuItem}
            onPress={handleSettings}
            activeOpacity={0.7}
          >
            <View style={styles.menuIcon}>
              <Ionicons name="options-outline" size={19} color="#34345C" />
            </View>

            <View style={styles.menuTextContainer}>
              <Text style={styles.menuTitle}>Settings</Text>

              <Text style={styles.menuSubtitle}>
                Manage your app preferences
              </Text>
            </View>

            <Ionicons name="chevron-forward" size={18} color="#A4A3AE" />
          </TouchableOpacity>

          <View style={styles.menuDivider} />

          {/* About */}

          <TouchableOpacity
            style={styles.menuItem}
            onPress={handleAbout}
            activeOpacity={0.7}
          >
            <View style={styles.menuIcon}>
              <Ionicons
                name="information-circle-outline"
                size={19}
                color="#34345C"
              />
            </View>

            <View style={styles.menuTextContainer}>
              <Text style={styles.menuTitle}>About Memory Ticket</Text>

              <Text style={styles.menuSubtitle}>Learn more about the app</Text>
            </View>

            <Ionicons name="chevron-forward" size={18} color="#A4A3AE" />
          </TouchableOpacity>
        </View>

        {/* App */}

        <Text style={styles.sectionTitle}>APP</Text>

        <View style={styles.menuContainer}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() =>
              navigation.navigate("Memories", {
                filter: "favorites",
              })
            }
            activeOpacity={0.7}
          >
            <View style={styles.menuIcon}>
              <Ionicons name="heart-outline" size={19} color="#34345C" />
            </View>

            <View style={styles.menuTextContainer}>
              <Text style={styles.menuTitle}>Your Favorites</Text>

              <Text style={styles.menuSubtitle}>
                Memories you don't want to forget
              </Text>
            </View>

            <Ionicons name="chevron-forward" size={18} color="#A4A3AE" />
          </TouchableOpacity>
        </View>

        {/* Logout */}

        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
          activeOpacity={0.75}
        >
          <Ionicons name="log-out-outline" size={19} color="#D9534F" />

          <Text style={styles.logoutText}>LOG OUT</Text>
        </TouchableOpacity>

        {/* Version */}

        <Text style={styles.versionText}>MEMORY TICKET • VERSION 1.0.0</Text>
      </ScrollView>
    </View>
  );
}

export default ProfileScreen;

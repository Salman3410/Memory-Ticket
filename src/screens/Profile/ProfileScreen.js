import {
  View,
  Text,
  ScrollView,
  Alert,
} from "react-native";

import { useMemory } from "../../hooks/useMemory";
import { useAuth } from "../../hooks/useAuth";

import ProfileCard from "../../components/Profile/Card/ProfileCard";
import ProfileStats from "../../components/Profile/Stats/ProfileStats";
import ProfileMenu from "../../components/Profile/Menu/ProfileMenu";
import LogoutButton from "../../components/Profile/Logout/LogoutButton";

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
    Alert.alert(
      "Log Out",
      "Are you sure you want to log out?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Log Out",
          style: "destructive",
          onPress: logout,
        },
      ]
    );
  };

  const accountMenuItems = [
    {
      title: "Edit Profile",
      subtitle: "Change your name or profile photo",
      icon: "person-outline",
      onPress: handleEditProfile,
    },
    {
      title: "Settings",
      subtitle: "Manage your app preferences",
      icon: "options-outline",
      onPress: handleSettings,
    },
    {
      title: "About Memory Ticket",
      subtitle: "Learn more about the app",
      icon: "information-circle-outline",
      onPress: handleAbout,
    },
  ];

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

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* HEADER */}

        <View style={styles.header}>
          <View>
            <Text style={styles.headerEyebrow}>YOUR SPACE</Text>

            <Text style={styles.headerTitle}>Profile</Text>
          </View>
        </View>

        {/* PROFILE CARD */}

        <ProfileCard user={user} onEditProfile={handleEditProfile} />

        {/* STATS */}

        <ProfileStats stats={stats} />

        {/* ACCOUNT */}

        <ProfileMenu title="ACCOUNT" items={accountMenuItems} />

        {/* APP */}

        <ProfileMenu title="APP" items={appMenuItems} />

        {/* LOGOUT */}

        <LogoutButton onPress={handleLogout} />

        {/* VERSION */}

        <Text style={styles.versionText}>MEMORY TICKET • VERSION 1.0.0</Text>
      </ScrollView>
    </View>
  );
}

export default ProfileScreen;


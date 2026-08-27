import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import styles from "./profileCardStyles";

function ProfileCard({ user, onEditProfile }) {
  return (
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
          onPress={onEditProfile}
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
  );
}

export default ProfileCard;

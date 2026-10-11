import { View, Text, TouchableOpacity, Image } from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { useTheme } from "../../../context/ThemeContext";
import styles from "./profileCardStyles";

function ProfileCard({ user, onEditProfile }) {
  const { theme, isDark } = useTheme();
  const { colors } = theme;

  // Light mode: white border
  // Dark mode: match the profile card background
  const cardBackground = colors.surface;

  const avatarBorderColor = isDark ? cardBackground : "#FFFFFF";

  return (
    <View
      style={[
        styles.profileCard,
        {
          backgroundColor: cardBackground,
          borderColor: colors.border,
        },
      ]}
    >
      <View style={styles.avatarContainer}>
        {user?.profileImage ? (
          <Image
            source={{ uri: user.profileImage }}
            style={[
              styles.avatar,
              {
                borderColor: avatarBorderColor,
              },
            ]}
          />
        ) : (
          <View
            style={[
              styles.avatar,
              {
                backgroundColor: colors.surfaceSecondary,
                borderColor: avatarBorderColor,
              },
            ]}
          >
            <Text style={[styles.avatarText, { color: colors.text }]}>
              {user?.name?.charAt(0)?.toUpperCase() || "M"}
            </Text>
          </View>
        )}

        <TouchableOpacity
          style={[
            styles.cameraButton,
            {
              backgroundColor: colors.accent,
              borderColor: avatarBorderColor,
            },
          ]}
          onPress={onEditProfile}
          activeOpacity={0.8}
        >
          <Ionicons name="camera" size={13} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <Text style={[styles.userName, { color: colors.text }]}>
        {user?.name || "Memory Keeper"}
      </Text>

      <Text style={[styles.userEmail, { color: colors.textSecondary }]}>
        {user?.email || ""}
      </Text>

      <View
        style={[
          styles.memberBadge,
          {
            backgroundColor: colors.surfaceSecondary,
            borderColor: colors.border,
          },
        ]}
      >
        <Ionicons name="ticket-outline" size={13} color={colors.accent} />

        <Text style={[styles.memberBadgeText, { color: colors.accent }]}>
          MEMORY COLLECTOR
        </Text>
      </View>
    </View>
  );
}

export default ProfileCard;

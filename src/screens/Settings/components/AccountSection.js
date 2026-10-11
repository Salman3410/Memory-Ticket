import React from "react";

import { View, Text, TouchableOpacity } from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../../context/ThemeContext";

import styles from "../settingsStyles";

function AccountSection({ navigation, onDeleteAccount }) {
  const { theme } = useTheme();
  const { colors } = theme;

  return (
    <>
      <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>
        ACCOUNT
      </Text>

      <View
        style={[
          styles.card,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
          },
        ]}
      >
        {/* CHANGE PASSWORD */}
        <TouchableOpacity
          style={styles.accountRow}
          onPress={() => navigation.navigate("ChangePassword")}
          activeOpacity={0.7}
        >
          <View
            style={[
              styles.iconBox,
              styles.passwordIconBox,
              {
                backgroundColor: colors.surfaceSecondary,
              },
            ]}
          >
            <Ionicons
              name="lock-closed-outline"
              size={20}
              color={colors.icon}
            />
          </View>

          <View style={styles.rowContent}>
            <Text style={[styles.rowTitle, { color: colors.text }]}>
              Change Password
            </Text>

            <Text style={[styles.rowSubtitle, { color: colors.textSecondary }]}>
              Update your account password
            </Text>
          </View>

          <Ionicons name="chevron-forward" size={18} color={colors.iconMuted} />
        </TouchableOpacity>

        <View
          style={[styles.accountDivider, { backgroundColor: colors.divider }]}
        />

        {/* DELETE ACCOUNT */}
        <TouchableOpacity
          style={styles.accountRow}
          onPress={onDeleteAccount}
          activeOpacity={0.7}
        >
          <View style={[styles.iconBox, styles.deleteIconBox]}>
            <Ionicons name="trash-outline" size={20} color={colors.danger} />
          </View>

          <View style={styles.rowContent}>
            <Text
              style={[
                styles.rowTitle,
                styles.deleteTitle,
                { color: colors.danger },
              ]}
            >
              Delete Account
            </Text>

            <Text style={[styles.rowSubtitle, { color: colors.textSecondary }]}>
              Permanently delete your account and memories
            </Text>
          </View>

          <Ionicons name="chevron-forward" size={18} color={colors.iconMuted} />
        </TouchableOpacity>
      </View>
    </>
  );
}

export default AccountSection;

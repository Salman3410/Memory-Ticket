import React, { useState } from "react";

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StatusBar,
} from "react-native";

import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";

import { useAuth } from "../../hooks/useAuth";
import { useTheme } from "../../context/ThemeContext";
import { useAppAlert } from "../../context/AlertContext";
import { useMementoNotifications } from "../../hooks/useMementoNotifications";

import TactileButton from "../../components/common/TactileButton";

import styles from "./editProfileStyles";

function EditProfileScreen({ navigation }) {
  const { user, updateProfile } = useAuth();

  const { theme, isDark } = useTheme();
  const { colors } = theme;

  const { showAlert } = useAppAlert();
  const { notify, notifyError } = useMementoNotifications();

  const [name, setName] = useState(user?.name || "");
  const [profileImage, setProfileImage] = useState(
    user?.profileImage || null
  );
  const [saving, setSaving] = useState(false);

  const avatarBorderColor = isDark
    ? colors.background
    : "#FFFFFF";

  const primaryTextColor = colors.primaryText || "#FFFFFF";

  const pickProfileImage = async () => {
    try {
      const permission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permission.granted) {
        showAlert({
          type: "warning",
          icon: "lock-closed-outline",
          title: "Permission Required",
          message:
            "Please allow photo library access to choose a profile photo.",
          confirmText: "OK",
        });
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets?.[0]?.uri) {
        setProfileImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Profile photo picker error:", error);

      notifyError(
        "Photo Unavailable",
        "Unable to select a profile photo. Please try again."
      );
    }
  };

  const handleSave = async () => {
    if (saving) {
      return;
    }

    if (!name.trim()) {
      showAlert({
        type: "warning",
        icon: "person-outline",
        title: "Name Required",
        message: "Please enter your name before saving your profile.",
        confirmText: "OK",
      });
      return;
    }

    setSaving(true);

    try {
      const result = await updateProfile({
        name: name.trim(),
        profileImage,
      });

      if (!result.success) {
        notifyError(
          "Update Failed",
          result.message || "Something went wrong. Please try again."
        );
        return;
      }

      navigation.goBack();
      notify("profileUpdated");
    } catch (error) {
      console.error("Edit profile error:", error);

      notifyError(
        "Update Failed",
        error?.message || "Unable to update your profile. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

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

      <KeyboardAwareScrollView
        bottomOffset={30}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* HEADER */}

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
            activeOpacity={0.7}
            disabled={saving}
          >
            <Ionicons
              name="arrow-back"
              size={21}
              color={colors.icon}
            />
          </TouchableOpacity>

          <View style={styles.headerTextContainer}>
            <Text
              style={[
                styles.headerEyebrow,
                { color: colors.accent },
              ]}
            >
              ACCOUNT
            </Text>

            <Text
              style={[
                styles.headerTitle,
                { color: colors.text },
              ]}
            >
              Edit Profile
            </Text>
          </View>

          <View style={styles.headerSpacer} />
        </View>

        {/* PROFILE PHOTO */}

        <View style={styles.photoSection}>
          <View style={styles.avatarContainer}>
            {profileImage ? (
              <Image
                source={{ uri: profileImage }}
                style={[
                  styles.avatarImage,
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
                <Text
                  style={[
                    styles.avatarText,
                    { color: colors.text },
                  ]}
                >
                  {name?.charAt(0)?.toUpperCase() || "M"}
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
              onPress={pickProfileImage}
              activeOpacity={0.8}
              disabled={saving}
            >
              <Ionicons
                name="camera"
                size={16}
                color="#FFFFFF"
              />
            </TouchableOpacity>
          </View>

          <Text
            style={[
              styles.photoTitle,
              { color: colors.text },
            ]}
          >
            Profile Photo
          </Text>

          <TouchableOpacity
            onPress={pickProfileImage}
            activeOpacity={0.7}
            disabled={saving}
          >
            <Text
              style={[
                styles.changePhotoText,
                { color: colors.accent },
              ]}
            >
              CHANGE PHOTO
            </Text>
          </TouchableOpacity>
        </View>

        {/* FORM */}

        <View style={styles.formContainer}>
          {/* NAME */}

          <View style={styles.inputGroup}>
            <Text
              style={[
                styles.label,
                { color: colors.textMuted },
              ]}
            >
              NAME
            </Text>

            <View
              style={[
                styles.inputWrapper,
                {
                  backgroundColor: colors.input,
                  borderColor: colors.border,
                },
              ]}
            >
              <Ionicons
                name="person-outline"
                size={17}
                color={colors.iconMuted}
              />

              <TextInput
                style={[
                  styles.input,
                  { color: colors.text },
                ]}
                value={name}
                onChangeText={setName}
                placeholder="Your name"
                placeholderTextColor={colors.textMuted}
                autoCapitalize="words"
                autoCorrect={false}
                maxLength={40}
                editable={!saving}
                returnKeyType="done"
              />
            </View>
          </View>

          {/* EMAIL */}

          <View style={styles.inputGroup}>
            <Text
              style={[
                styles.label,
                { color: colors.textMuted },
              ]}
            >
              EMAIL
            </Text>

            <View
              style={[
                styles.inputWrapper,
                styles.disabledInput,
                {
                  backgroundColor: colors.surfaceSecondary,
                  borderColor: colors.border,
                },
              ]}
            >
              <Ionicons
                name="mail-outline"
                size={17}
                color={colors.iconMuted}
              />

              <TextInput
                style={[
                  styles.input,
                  styles.disabledText,
                  { color: colors.textMuted },
                ]}
                value={user?.email || ""}
                editable={false}
                selectTextOnFocus={false}
              />
            </View>

            <Text
              style={[
                styles.helperText,
                { color: colors.textSecondary },
              ]}
            >
              Email cannot be changed here.
            </Text>
          </View>
        </View>

        {/* SAVE CHANGES BUTTON */}

        <TactileButton
          label="SAVE CHANGES"
          icon="checkmark"
          onPress={handleSave}
          loading={saving}
          loadingText="SAVING..."
          disabled={saving}
          color={colors.primary || "#34345C"}
          textColor={primaryTextColor}
          iconColor={primaryTextColor}
          height={56}
          borderRadius={14}
          depth={4}
          style={{
            marginTop: 12,
          }}
        />

        {/* FOOTER */}

        <Text
          style={[
            styles.footerText,
            { color: colors.textMuted },
          ]}
        >
          Keep your profile up to date.
        </Text>
      </KeyboardAwareScrollView>
    </View>
  );
}

export default EditProfileScreen;
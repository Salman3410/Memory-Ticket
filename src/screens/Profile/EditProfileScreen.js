import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";

import { useAuth } from "../../hooks/useAuth";

import styles from "./editProfileStyles";

function EditProfileScreen({ navigation }) {
  const { user, updateProfile } = useAuth();

  const [name, setName] = useState(user?.name || "");
  const [profileImage, setProfileImage] = useState(user?.profileImage || null);

  const [saving, setSaving] = useState(false);

  const pickProfileImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert(
        "Permission Required",
        "Please allow photo library access to choose a profile photo.",
      );

      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert("Name Required", "Please enter your name.");

      return;
    }

    setSaving(true);

    const result = await updateProfile({
      name: name.trim(),
      profileImage,
    });

    setSaving(false);

    if (!result.success) {
      Alert.alert("Update Failed", result.message || "Something went wrong.");

      return;
    }

    Alert.alert(
      "Profile Updated",
      "Your profile has been updated successfully.",
      [
        {
          text: "OK",
          onPress: () => navigation.goBack(),
        },
      ],
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}

        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={22} color="#242424" />
          </TouchableOpacity>

          <View style={styles.headerTextContainer}>
            <Text style={styles.headerEyebrow}>ACCOUNT</Text>

            <Text style={styles.headerTitle}>Edit Profile</Text>
          </View>

          <View style={styles.headerSpacer} />
        </View>

        {/* Profile Photo */}

        <View style={styles.photoSection}>
          <View style={styles.avatarContainer}>
            {profileImage ? (
              <Image
                source={{ uri: profileImage }}
                style={styles.avatarImage}
              />
            ) : (
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {name?.charAt(0)?.toUpperCase() || "M"}
                </Text>
              </View>
            )}

            <TouchableOpacity
              style={styles.cameraButton}
              onPress={pickProfileImage}
              activeOpacity={0.8}
            >
              <Ionicons name="camera" size={17} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          <Text style={styles.photoTitle}>Profile Photo</Text>

          <TouchableOpacity onPress={pickProfileImage} activeOpacity={0.7}>
            <Text style={styles.changePhotoText}>CHANGE PHOTO</Text>
          </TouchableOpacity>
        </View>

        {/* Form */}

        <View style={styles.formContainer}>
          {/* Name */}

          <View style={styles.inputGroup}>
            <Text style={styles.label}>NAME</Text>

            <View style={styles.inputWrapper}>
              <Ionicons
                name="person-outline"
                size={20}
                color="#707080"
                style={styles.inputIcon}
              />

              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Your name"
                placeholderTextColor="#A39C92"
                autoCapitalize="words"
                autoCorrect={false}
                maxLength={40}
              />
            </View>
          </View>

          {/* Email */}

          <View style={styles.inputGroup}>
            <Text style={styles.label}>EMAIL</Text>

            <View style={[styles.inputWrapper, styles.disabledInput]}>
              <Ionicons
                name="mail-outline"
                size={20}
                color="#A4A3AE"
                style={styles.inputIcon}
              />

              <TextInput
                style={[styles.input, styles.disabledText]}
                value={user?.email || ""}
                editable={false}
              />
            </View>

            <Text style={styles.helperText}>Email cannot be changed here.</Text>
          </View>
        </View>

        {/* Save */}

        <TouchableOpacity
          style={[styles.saveButton, saving && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={saving}
          activeOpacity={0.85}
        >
          {saving ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <>
              <Text style={styles.saveButtonText}>SAVE CHANGES</Text>

              <Ionicons name="checkmark" size={20} color="#FFFFFF" />
            </>
          )}
        </TouchableOpacity>

        <Text style={styles.footerText}>Keep your profile up to date.</Text>
      </ScrollView>
    </View>
  );
}

export default EditProfileScreen;

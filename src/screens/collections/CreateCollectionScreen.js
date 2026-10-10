import React, { useCallback, useState } from "react";

import {
ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StatusBar,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { useCollection } from "../../hooks/useCollection";

import styles from "./createCollectionStyles";
import { useTheme } from "../../context/ThemeContext";

function CreateCollectionScreen({ navigation }) {
  const { theme, isDark } = useTheme();
  const colors = theme?.colors || {};
  const screenBackground = colors.background || (isDark ? "#171624" : "#F1F0F6");
  const surfaceColor = colors.surface || (isDark ? "#211F30" : "#FFFFFF");
  const textColor = colors.text || (isDark ? "#F7F5FC" : "#242424");
  const secondaryTextColor = colors.textSecondary || colors.textMuted || (isDark ? "#C4C0D0" : "#707080");
  const borderColor = colors.border || (isDark ? "#39364D" : "#D9D8E2");

  const { createCollection } = useCollection();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);

  const handleCreate = useCallback(async () => {
    const trimmedName = name.trim();
    const trimmedDescription = description.trim();

    if (!trimmedName) {
      return;
    }

    try {
      setSaving(true);

      const collection = await createCollection({
        name: trimmedName,
        description: trimmedDescription,
      });

      if (collection?._id || collection?.id) {
        navigation.replace("CollectionDetails", {
          collectionId: collection._id || collection.id,
        });

        return;
      }

      navigation.goBack();
    } catch (error) {
      console.error("Create collection error:", error);
    } finally {
      setSaving(false);
    }
  }, [name, description, createCollection, navigation]);

  const handleCancel = useCallback(() => {
    if (saving) {
      return;
    }

    navigation.goBack();
  }, [navigation, saving]);

  const isDisabled = !name.trim() || saving;

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: screenBackground }]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={screenBackground} />
      {/* HEADER */}

      <View style={[styles.header, { backgroundColor: screenBackground }]}>
        <TouchableOpacity
          onPress={handleCancel}
          disabled={saving}
          activeOpacity={0.7}
        >
          <Text style={[styles.cancelText, { color: colors.primary || "#34345C" }]}>Cancel</Text>
        </TouchableOpacity>

        <Text style={[styles.headerTitle, { color: textColor }]}>New Collection</Text>

        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* PREVIEW */}

        <View style={[styles.previewTicket, { backgroundColor: surfaceColor, borderColor }]}>
          <View style={styles.previewTop}>
            <View style={styles.previewMark}>
              <Text style={[styles.previewMarkText, { color: secondaryTextColor }]}>M</Text>
            </View>

            <View style={[styles.previewText, { color: secondaryTextColor }]}>
              <Text style={[styles.previewLabel, { color: secondaryTextColor }]}>NEW COLLECTION</Text>

              <Text style={[styles.previewName, { color: textColor }]} numberOfLines={2}>
                {name.trim() || "Your Collection"}
              </Text>

              <Text style={[styles.previewCount, { color: secondaryTextColor }]}>0 MEMORIES</Text>
            </View>
          </View>

          <View style={styles.previewDivider} />

          <View style={[styles.previewFooter, { color: secondaryTextColor }]}>
            <Text style={styles.previewBrand}>MEMENTO</Text>

            <View style={styles.previewBarcode}>
              {[4, 2, 5, 3, 6, 2].map((width, index) => (
                <View key={index} style={[styles.previewBar, { width }]} />
              ))}
            </View>
          </View>
        </View>

        {/* NAME */}

        <View style={styles.fieldContainer}>
          <Text style={[styles.label, { color: secondaryTextColor }]}>COLLECTION NAME</Text>

          <View style={[styles.inputWithIcon, { backgroundColor: surfaceColor, borderColor }]}>
            <Ionicons name="albums-outline" size={17} color={colors.textMuted || "#7E7E88"} />

            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="e.g. Turkey Trip"
              placeholderTextColor={colors.textMuted || "#9A9AA3"}
              style={[styles.input, { backgroundColor: colors.input || surfaceColor, borderColor, color: textColor }]}
              maxLength={100}
              autoFocus
              autoCapitalize="sentences"
              autoCorrect={false}
              returnKeyType="next"
            />
          </View>

          <Text style={[styles.characterCount, { color: secondaryTextColor }]}>{name.length}/100</Text>
        </View>

        {/* DESCRIPTION */}

        <View style={styles.fieldContainer}>
          <Text style={[styles.label, { color: secondaryTextColor }]}>DESCRIPTION</Text>

          <TextInput
            value={description}
            onChangeText={setDescription}
            placeholder="Add a short description"
            placeholderTextColor={colors.textMuted || "#9A9AA3"}
            style={[styles.descriptionInput, { backgroundColor: colors.input || surfaceColor, borderColor, color: textColor }]}
            maxLength={200}
            multiline
            textAlignVertical="top"
          />

          <Text style={[styles.characterCount, { color: secondaryTextColor }]}>{description.length}/200</Text>
        </View>

        {/* HELPER */}

        <View style={[styles.helper, { color: secondaryTextColor }]}>
          <Text style={[styles.helperTitle, { color: textColor }]}>BUILD YOUR TICKET</Text>

          <Text style={[styles.helperText, { color: secondaryTextColor }]}>
            Add memories after creating the collection. The same memory can
            belong to multiple collections.
          </Text>
        </View>
      </ScrollView>

      {/* FOOTER */}

      <View style={[styles.footer, { color: secondaryTextColor }]}>
        <TouchableOpacity
          style={[
            styles.createButton,
            isDisabled && styles.createButtonDisabled,
          ]}
          onPress={handleCreate}
          disabled={isDisabled}
          activeOpacity={0.85}
        >
          {saving ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={[styles.createButtonText, { color: colors.primaryText || "#FFFFFF" }]}>Create Collection</Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

export default CreateCollectionScreen;

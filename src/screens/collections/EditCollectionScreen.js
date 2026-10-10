import {
useCallback, useState } from "react";

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

import MementoLogo from "../../components/common/MementoLogo";

import styles from "./editCollectionStyles";
import { useTheme } from "../../context/ThemeContext";

function EditCollectionScreen({ route, navigation }) {
  const { theme, isDark } = useTheme();
  const colors = theme?.colors || {};
  const screenBackground = colors.background || (isDark ? "#171624" : "#F1F0F6");
  const surfaceColor = colors.surface || (isDark ? "#211F30" : "#FFFFFF");
  const textColor = colors.text || (isDark ? "#F7F5FC" : "#242424");
  const secondaryTextColor = colors.textSecondary || colors.textMuted || (isDark ? "#C4C0D0" : "#707080");
  const borderColor = colors.border || (isDark ? "#39364D" : "#D9D8E2");

  const { collectionId, collection } = route.params || {};

  const { updateCollection } = useCollection();

  const [name, setName] = useState(collection?.name || "");
  const [description, setDescription] = useState(collection?.description || "");
  const [saving, setSaving] = useState(false);

  const memoryCount =
    collection?.memoryCount ||
    (Array.isArray(collection?.memories) ? collection.memories.length : 0);

  const handleSave = useCallback(async () => {
    const trimmedName = name.trim();
    const trimmedDescription = description.trim();

    if (!trimmedName || !collectionId || saving) {
      return;
    }

    try {
      setSaving(true);

      await updateCollection(collectionId, {
        name: trimmedName,
        description: trimmedDescription,
      });

      navigation.goBack();
    } catch (error) {
      console.error("Update collection error:", error);
    } finally {
      setSaving(false);
    }
  }, [name, description, collectionId, saving, updateCollection, navigation]);

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
          <Text style={[styles.cancelText, { color: colors.primaryText || "#FFFFFF" }]}>Cancel</Text>
        </TouchableOpacity>

        <Text style={[styles.headerTitle, { color: textColor }]}>Edit Collection</Text>

        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* CURRENT COLLECTION */}

        <View style={[styles.previewTicket, { backgroundColor: surfaceColor, borderColor }]}>
          <View style={styles.previewTop}>
            <MementoLogo size={58} borderRadius={29} />

            <View style={[styles.previewText, { color: secondaryTextColor }]}>
              <Text style={[styles.previewLabel, { color: secondaryTextColor }]}>EDITING COLLECTION</Text>

              <Text style={[styles.previewName, { color: textColor }]} numberOfLines={2}>
                {name.trim() || "Your Collection"}
              </Text>

              <Text style={[styles.previewCount, { color: secondaryTextColor }]}>
                {memoryCount === 1 ? "1 MEMORY" : `${memoryCount} MEMORIES`}
              </Text>
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
              placeholder="Collection name"
              placeholderTextColor={colors.textMuted || "#9A9AA3"}
              style={[styles.input, { backgroundColor: colors.input || surfaceColor, borderColor, color: textColor }]}
              maxLength={100}
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
      </ScrollView>

      {/* FOOTER */}

      <View style={[styles.footer, { color: secondaryTextColor }]}>
        <TouchableOpacity
          style={[styles.saveButton, isDisabled && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={isDisabled}
          activeOpacity={0.85}
        >
          {saving ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={[styles.saveButtonText, { color: colors.primaryText || "#FFFFFF" }]}>Save Changes</Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

export default EditCollectionScreen;

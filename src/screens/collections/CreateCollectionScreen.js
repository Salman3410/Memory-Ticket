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
import { useTheme } from "../../context/ThemeContext";
import styles from "./createCollectionStyles";

function CreateCollectionScreen({ navigation }) {
  const { theme, isDark } = useTheme();
  const colors = theme?.colors || {};

  const screenBackground =
    colors.background || (isDark ? "#171624" : "#F1F0F6");

  const surfaceColor =
    colors.surface || (isDark ? "#211F30" : "#FFFFFF");

  const textColor =
    colors.text || (isDark ? "#F7F5FC" : "#242424");

  const secondaryTextColor =
    colors.textSecondary ||
    colors.textMuted ||
    (isDark ? "#C4C0D0" : "#707080");

  const mutedTextColor =
    colors.textMuted || (isDark ? "#89849C" : "#9A99A5");

  const borderColor =
    colors.border || (isDark ? "#39364D" : "#D9D8E2");

  const inputBackground =
    colors.input || (isDark ? "#292638" : "#F8F8FA");

  const primaryColor =
    colors.primary || (isDark ? "#C8C2FF" : "#34345C");

  const primaryTextColor =
    colors.primaryText || (isDark ? "#25223D" : "#FFFFFF");

  const disabledButtonColor =
    isDark ? "#383548" : "#D9D8E2";

  const { createCollection } = useCollection();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);

  const handleCreate = useCallback(async () => {
    const trimmedName = name.trim();
    const trimmedDescription = description.trim();

    if (!trimmedName || saving) {
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
  }, [name, description, saving, createCollection, navigation]);

  const handleCancel = useCallback(() => {
    if (saving) {
      return;
    }

    navigation.goBack();
  }, [navigation, saving]);

  const isDisabled = !name.trim() || saving;

  return (
    <KeyboardAvoidingView
      style={[
        styles.container,
        { flex: 1, backgroundColor: screenBackground },
      ]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor={screenBackground}
      />

      {/* HEADER */}
      <View
        style={[
          styles.header,
          {
            backgroundColor: screenBackground,
            borderBottomColor: borderColor,
          },
        ]}
      >
        <TouchableOpacity
          onPress={handleCancel}
          disabled={saving}
          activeOpacity={0.7}
          style={styles.headerAction}
        >
          <Text
            style={[
              styles.cancelText,
              { color: primaryColor },
            ]}
          >
            Cancel
          </Text>
        </TouchableOpacity>

        <Text
          style={[
            styles.headerTitle,
            { color: textColor },
          ]}
        >
          New Collection
        </Text>

        <View
          style={[
            styles.headerSpacer,
            { backgroundColor: "transparent" },
          ]}
        />
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.content,
          { backgroundColor: screenBackground },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* COLLECTION TICKET PREVIEW */}
        <View
          style={[
            styles.previewTicket,
            {
              backgroundColor: surfaceColor,
              borderColor,
            },
          ]}
        >
          <View style={styles.previewTop}>
            <View
              style={[
                styles.previewMark,
                {
                  backgroundColor: inputBackground,
                  borderColor,
                },
              ]}
            >
              <Text
                style={[
                  styles.previewMarkText,
                  { color: primaryColor },
                ]}
              >
                M
              </Text>
            </View>

            <View style={styles.previewText}>
              <Text
                style={[
                  styles.previewLabel,
                  { color: secondaryTextColor },
                ]}
              >
                NEW COLLECTION
              </Text>

              <Text
                style={[
                  styles.previewName,
                  { color: textColor },
                ]}
                numberOfLines={2}
              >
                {name.trim() || "Your Collection"}
              </Text>

              <Text
                style={[
                  styles.previewCount,
                  { color: secondaryTextColor },
                ]}
              >
                0 MEMORIES
              </Text>
            </View>
          </View>

          <View
            style={[
              styles.previewDivider,
              { borderTopColor: borderColor },
            ]}
          />

          <View style={styles.previewFooter}>
            <Text
              style={[
                styles.previewBrand,
                { color: secondaryTextColor },
              ]}
            >
              MEMENTO
            </Text>

            <View style={styles.previewBarcode}>
              {[4, 2, 5, 3, 6, 2].map((width, index) => (
                <View
                  key={index}
                  style={[
                    styles.previewBar,
                    {
                      width,
                      backgroundColor: primaryColor,
                    },
                  ]}
                />
              ))}
            </View>
          </View>
        </View>

        {/* COLLECTION NAME */}
        <View style={styles.fieldContainer}>
          <Text
            style={[
              styles.label,
              { color: secondaryTextColor },
            ]}
          >
            COLLECTION NAME
          </Text>

          <View
            style={[
              styles.inputWithIcon,
              {
                backgroundColor: inputBackground,
                borderColor,
              },
            ]}
          >
            <Ionicons
              name="albums-outline"
              size={19}
              color={secondaryTextColor}
            />

            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="e.g. Turkey Trip"
              placeholderTextColor={mutedTextColor}
              style={[
                styles.input,
                {
                  flex: 1,
                  minWidth: 0,
                  backgroundColor: inputBackground,
                  color: textColor,
                  borderColor: "transparent",
                },
              ]}
              maxLength={100}
              autoFocus
              autoCapitalize="sentences"
              autoCorrect={false}
              returnKeyType="next"
            />
          </View>

          <Text
            style={[
              styles.characterCount,
              { color: secondaryTextColor },
            ]}
          >
            {name.length}/100
          </Text>
        </View>

        {/* DESCRIPTION */}
        <View style={styles.fieldContainer}>
          <Text
            style={[
              styles.label,
              { color: secondaryTextColor },
            ]}
          >
            DESCRIPTION
          </Text>

          <TextInput
            value={description}
            onChangeText={setDescription}
            placeholder="Add a short description"
            placeholderTextColor={mutedTextColor}
            style={[
              styles.descriptionInput,
              {
                backgroundColor: inputBackground,
                borderColor,
                color: textColor,
              },
            ]}
            maxLength={200}
            multiline
            textAlignVertical="top"
          />

          <Text
            style={[
              styles.characterCount,
              { color: secondaryTextColor },
            ]}
          >
            {description.length}/200
          </Text>
        </View>

        {/* HELPER SECTION */}
        <View
          style={[
            styles.helper,
            {
              backgroundColor: surfaceColor,
              borderColor,
            },
          ]}
        >
          <View style={styles.helperHeadingRow}>
            <Ionicons
              name="ticket-outline"
              size={18}
              color={primaryColor}
            />

            <Text
              style={[
                styles.helperTitle,
                { color: textColor },
              ]}
            >
              BUILD YOUR TICKET
            </Text>
          </View>

          <Text
            style={[
              styles.helperText,
              { color: secondaryTextColor },
            ]}
          >
            Add memories after creating the collection. The same memory can
            belong to multiple collections.
          </Text>
        </View>
      </ScrollView>

      {/* FOOTER */}
      <View
        style={[
          styles.footer,
          {
            backgroundColor: screenBackground,
            borderTopColor: borderColor,
          },
        ]}
      >
        <TouchableOpacity
          style={[
            styles.createButton,
            {
              backgroundColor: isDisabled
                ? disabledButtonColor
                : primaryColor,
              opacity: saving ? 0.8 : 1,
            },
          ]}
          onPress={handleCreate}
          disabled={isDisabled}
          activeOpacity={0.85}
        >
          {saving ? (
            <ActivityIndicator
              size="small"
              color={isDisabled ? secondaryTextColor : primaryTextColor}
            />
          ) : (
            <>
              <Text
                style={[
                  styles.createButtonText,
                  {
                    color: isDisabled
                      ? secondaryTextColor
                      : primaryTextColor,
                  },
                ]}
              >
                Create Collection
              </Text>

              <Ionicons
                name="arrow-forward"
                size={18}
                color={
                  isDisabled
                    ? secondaryTextColor
                    : primaryTextColor
                }
              />
            </>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

export default CreateCollectionScreen;
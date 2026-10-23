import React, {
  useCallback,
  useMemo,
  useState,
} from "react";

import {
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
import { useAppAlert } from "../../context/AlertContext";

import TactileButton from "../../components/common/TactileButton";

import styles from "./createCollectionStyles";

function CreateCollectionScreen({ navigation }) {
  const { theme, isDark } = useTheme();
  const { showAlert } = useAppAlert();
  const colors = theme?.colors || {};

  // --------------------------------------------------
  // THEME COLORS
  // --------------------------------------------------

  const screenBackground =
    colors.background || (isDark ? "#171624" : "#F1F0F6");

  const surfaceColor =
    colors.surface ||
    colors.card ||
    (isDark ? "#211F30" : "#FFFFFF");

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
    colors.primaryText ||
    (isDark && primaryColor === "#C8C2FF"
      ? "#25223D"
      : "#FFFFFF");

  const disabledButtonColor =
    isDark ? "#383548" : "#D9D8E2";

  const { createCollection } = useCollection();

  // --------------------------------------------------
  // FORM STATE
  // --------------------------------------------------

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);

  // --------------------------------------------------
  // THEMED STYLES
  // --------------------------------------------------

  const themedStyles = useMemo(
    () => ({
      container: {
        ...styles.container,
        backgroundColor: screenBackground,
      },

      header: {
        ...styles.header,
        backgroundColor: screenBackground,
        borderBottomColor: borderColor,
      },

      content: {
        ...styles.content,
        backgroundColor: screenBackground,
      },

      previewTicket: {
        ...styles.previewTicket,
        backgroundColor: surfaceColor,
        borderColor,
      },

      previewMark: {
        ...styles.previewMark,
        backgroundColor: inputBackground,
        borderColor,
      },

      previewMarkText: {
        ...styles.previewMarkText,
        color: primaryColor,
      },

      previewLabel: {
        ...styles.previewLabel,
        color: secondaryTextColor,
      },

      previewName: {
        ...styles.previewName,
        color: textColor,
      },

      previewCount: {
        ...styles.previewCount,
        color: secondaryTextColor,
      },

      previewDivider: {
        ...styles.previewDivider,
        borderTopColor: borderColor,
      },

      previewBrand: {
        ...styles.previewBrand,
        color: secondaryTextColor,
      },

      label: {
        ...styles.label,
        color: secondaryTextColor,
      },

      inputWithIcon: {
        ...styles.inputWithIcon,
        backgroundColor: inputBackground,
        borderColor,
      },

      input: {
        ...styles.input,
        backgroundColor: inputBackground,
        color: textColor,
      },

      descriptionInput: {
        ...styles.descriptionInput,
        backgroundColor: inputBackground,
        borderColor,
        color: textColor,
      },

      characterCount: {
        ...styles.characterCount,
        color: secondaryTextColor,
      },

      helper: {
        ...styles.helper,
        backgroundColor: surfaceColor,
        borderColor,
      },

      helperTitle: {
        ...styles.helperTitle,
        color: textColor,
      },

      helperText: {
        ...styles.helperText,
        color: secondaryTextColor,
      },

      footer: {
        ...styles.footer,
        backgroundColor: screenBackground,
        borderTopColor: borderColor,
      },

      cancelText: {
        ...styles.cancelText,
        color: primaryColor,
      },

      headerTitle: {
        ...styles.headerTitle,
        color: textColor,
      },
    }),
    [
      screenBackground,
      surfaceColor,
      textColor,
      secondaryTextColor,
      borderColor,
      inputBackground,
      primaryColor,
    ],
  );

  // --------------------------------------------------
  // CREATE COLLECTION
  // --------------------------------------------------

  const handleCreate = useCallback(async () => {
    const trimmedName = name.trim();
    const trimmedDescription = description.trim();

    if (saving) {
      return;
    }

    if (!trimmedName) {
      showAlert({
        type: "warning",
        icon: "text-outline",
        title: "Collection Name Required",
        message: "Enter a name for your collection before creating it.",
        confirmText: "OK",
        showCancel: false,
      });

      return;
    }

    try {
      setSaving(true);

      const result = await createCollection({
        name: trimmedName,
        description: trimmedDescription,
      });

      if (result?.success === false) {
        throw new Error(
          result.message || "Unable to create your collection.",
        );
      }

      const createdCollection =
        result?.collection ||
        result?.data ||
        result;

      const createdId =
        createdCollection?._id ||
        createdCollection?.id;

      if (createdId) {
        navigation.replace("CollectionDetails", {
          collectionId: createdId,
        });

        return;
      }

      // Preserve the existing fallback behavior.
      navigation.goBack();
    } catch (error) {
      console.error("Create collection error:", error);

      showAlert({
        type: "danger",
        icon: "close-circle-outline",
        title: "Creation Failed",
        message:
          error?.message ||
          "Unable to create your collection. Please try again.",
        confirmText: "OK",
        showCancel: false,
      });
    } finally {
      setSaving(false);
    }
  }, [
    name,
    description,
    saving,
    createCollection,
    navigation,
    showAlert,
  ]);

  // --------------------------------------------------
  // CANCEL
  // --------------------------------------------------

  const handleCancel = useCallback(() => {
    if (saving) {
      return;
    }

    const hasEnteredData =
      name.trim().length > 0 ||
      description.trim().length > 0;

    if (!hasEnteredData) {
      navigation.goBack();
      return;
    }

    showAlert({
      type: "warning",
      icon: "alert-circle-outline",
      title: "Discard Collection?",
      message:
        "Your collection details haven't been saved. Do you want to discard them?",
      cancelText: "Keep Editing",
      confirmText: "Discard",
      showCancel: true,
      onConfirm: () => {
        navigation.goBack();
      },
    });
  }, [
    saving,
    name,
    description,
    navigation,
    showAlert,
  ]);

  // --------------------------------------------------
  // BUTTON STATE
  // --------------------------------------------------

  const isNameEmpty = !name.trim();

  const createButtonColor = isNameEmpty
    ? disabledButtonColor
    : primaryColor;

  const createButtonTextColor = isNameEmpty
    ? secondaryTextColor
    : primaryTextColor;

  // --------------------------------------------------
  // SCREEN
  // --------------------------------------------------

  return (
    <KeyboardAvoidingView
      style={themedStyles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor={screenBackground}
      />

      {/* HEADER */}

      <View style={themedStyles.header}>
        <TouchableOpacity
          onPress={handleCancel}
          disabled={saving}
          activeOpacity={0.7}
          style={styles.headerAction}
          accessibilityRole="button"
          accessibilityLabel="Cancel creating collection"
        >
          <Text style={themedStyles.cancelText}>
            Cancel
          </Text>
        </TouchableOpacity>

        <Text
          style={themedStyles.headerTitle}
          numberOfLines={1}
        >
          New Collection
        </Text>

        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={themedStyles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* COLLECTION TICKET PREVIEW */}

        <View style={themedStyles.previewTicket}>
          <View style={styles.previewTop}>
            <View style={themedStyles.previewMark}>
              <Text style={themedStyles.previewMarkText}>
                M
              </Text>
            </View>

            <View style={styles.previewText}>
              <Text style={themedStyles.previewLabel}>
                NEW COLLECTION
              </Text>

              <Text
                style={themedStyles.previewName}
                numberOfLines={2}
              >
                {name.trim() || "Your Collection"}
              </Text>

              <Text style={themedStyles.previewCount}>
                0 MEMORIES
              </Text>
            </View>
          </View>

          <View style={themedStyles.previewDivider} />

          <View style={styles.previewFooter}>
            <Text style={themedStyles.previewBrand}>
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
          <Text style={themedStyles.label}>
            COLLECTION NAME
          </Text>

          <View style={themedStyles.inputWithIcon}>
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
              style={themedStyles.input}
              maxLength={100}
              autoFocus
              autoCapitalize="sentences"
              autoCorrect={false}
              returnKeyType="next"
              editable={!saving}
              accessibilityLabel="Collection name"
            />
          </View>

          <Text style={themedStyles.characterCount}>
            {name.length}/100
          </Text>
        </View>

        {/* DESCRIPTION */}

        <View style={styles.fieldContainer}>
          <Text style={themedStyles.label}>
            DESCRIPTION
          </Text>

          <TextInput
            value={description}
            onChangeText={setDescription}
            placeholder="Add a short description"
            placeholderTextColor={mutedTextColor}
            style={themedStyles.descriptionInput}
            maxLength={200}
            multiline
            textAlignVertical="top"
            editable={!saving}
            accessibilityLabel="Collection description"
          />

          <Text style={themedStyles.characterCount}>
            {description.length}/200
          </Text>
        </View>

        {/* HELPER SECTION */}

        <View style={themedStyles.helper}>
          <View style={styles.helperHeadingRow}>
            <Ionicons
              name="ticket-outline"
              size={18}
              color={primaryColor}
            />

            <Text style={themedStyles.helperTitle}>
              BUILD YOUR TICKET
            </Text>
          </View>

          <Text style={themedStyles.helperText}>
            Add memories after creating the collection. The same memory can
            belong to multiple collections.
          </Text>
        </View>
      </ScrollView>

      {/* FOOTER */}

      <View style={themedStyles.footer}>
        <TactileButton
          label="CREATE COLLECTION"
          onPress={handleCreate}
          icon="arrow-forward"
          iconPosition="right"
          color={createButtonColor}
          textColor={createButtonTextColor}
          iconColor={createButtonTextColor}
          height={52}
          borderRadius={13}
          depth={3}
          loading={saving}
          loadingText="CREATING COLLECTION..."
          disabled={saving}
          style={styles.createButtonWrapper}
          contentStyle={styles.createButton}
          textStyle={styles.createButtonText}
          accessibilityHint="Create a new collection with the name and description entered"
        />
      </View>
    </KeyboardAvoidingView>
  );
}

export default CreateCollectionScreen;
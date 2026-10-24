import { useCallback, useMemo, useState } from "react";
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
import { useMementoNotifications } from "../../hooks/useMementoNotifications";
import MementoLogo from "../../components/common/MementoLogo";
import TactileButton from "../../components/common/TactileButton";

import styles from "./editCollectionStyles";

function EditCollectionScreen({ route, navigation }) {
  const { theme, isDark } = useTheme();
  const { showAlert } = useAppAlert();
  const { notify, notifyError } = useMementoNotifications();
  const colors = theme?.colors || {};

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

  const { collectionId, collection } = route.params || {};
  const { updateCollection } = useCollection();

  const [name, setName] = useState(collection?.name || "");
  const [description, setDescription] = useState(
    collection?.description || ""
  );
  const [saving, setSaving] = useState(false);

  const memoryCount =
    collection?.memoryCount ??
    (Array.isArray(collection?.memories)
      ? collection.memories.length
      : 0);

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

      logoContainer: {
        ...styles.logoContainer,
        backgroundColor: inputBackground,
        borderColor,
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

      infoCard: {
        ...styles.infoCard,
        backgroundColor: surfaceColor,
        borderColor,
      },

      infoTitle: {
        ...styles.infoTitle,
        color: textColor,
      },

      infoDescription: {
        ...styles.infoDescription,
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
    ]
  );

  const handleSave = useCallback(async () => {
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
        message: "Enter a name for your collection before saving.",
        confirmText: "OK",
        showCancel: false,
      });

      return;
    }

    if (!collectionId) {
      showAlert({
        type: "danger",
        icon: "alert-circle-outline",
        title: "Collection Not Found",
        message:
          "The collection could not be identified. Return to your collections and try again.",
        confirmText: "OK",
        showCancel: false,
      });

      return;
    }

    try {
      setSaving(true);

      const result = await updateCollection(collectionId, {
        name: trimmedName,
        description: trimmedDescription,
      });

      if (result === false || result?.success === false) {
        throw new Error(
          result?.message || "Unable to update this collection."
        );
      }

      // Notify only after the update succeeds.
      notify("collectionUpdated", {
        message: `"${trimmedName}" has been updated successfully.`,
      });

      navigation.goBack();
    } catch (error) {
      console.error("Update collection error:", error);

      notifyError(
        "Update Failed",
        error?.message ||
          "Unable to save your collection changes. Please try again."
      );
    } finally {
      setSaving(false);
    }
  }, [
    name,
    description,
    saving,
    collectionId,
    updateCollection,
    navigation,
    showAlert,
    notify,
    notifyError,
  ]);

  const handleCancel = useCallback(() => {
    if (saving) {
      return;
    }

    const originalName = collection?.name || "";
    const originalDescription = collection?.description || "";

    const hasChanges =
      name !== originalName ||
      description !== originalDescription;

    if (!hasChanges) {
      navigation.goBack();
      return;
    }

    showAlert({
      type: "warning",
      icon: "alert-circle-outline",
      title: "Discard Changes?",
      message:
        "Your collection has unsaved changes. Do you want to leave without saving them?",
      cancelText: "Keep Editing",
      confirmText: "Discard",
      showCancel: true,
      onConfirm: () => {
        navigation.goBack();
      },
    });
  }, [
    saving,
    collection,
    name,
    description,
    navigation,
    showAlert,
  ]);
  
  const isNameEmpty = !name.trim();

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
          style={styles.headerAction}
          onPress={handleCancel}
          disabled={saving}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="Cancel editing"
        >
          <Text style={themedStyles.cancelText}>
            Cancel
          </Text>
        </TouchableOpacity>

        <Text
          style={themedStyles.headerTitle}
          numberOfLines={1}
        >
          Edit Collection
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
            <View style={themedStyles.logoContainer}>
              <MementoLogo size={42} borderRadius={13} />
            </View>

            <View style={styles.previewText}>
              <Text style={themedStyles.previewLabel}>
                EDITING COLLECTION
              </Text>

              <Text
                style={themedStyles.previewName}
                numberOfLines={2}
              >
                {name.trim() || "Your Collection"}
              </Text>

              <Text style={themedStyles.previewCount}>
                {memoryCount === 1
                  ? "1 MEMORY"
                  : `${memoryCount} MEMORIES`}
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
              placeholder="Collection name"
              placeholderTextColor={mutedTextColor}
              style={themedStyles.input}
              maxLength={100}
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

        {/* MEMORY INFORMATION */}

        <View style={themedStyles.infoCard}>
          <Ionicons
            name="images-outline"
            size={20}
            color={primaryColor}
          />

          <View style={styles.infoTextContainer}>
            <Text style={themedStyles.infoTitle}>
              Memories stay safe
            </Text>

            <Text style={themedStyles.infoDescription}>
              Updating this collection changes its details, not the memories
              saved inside it.
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* FOOTER */}

      <View style={themedStyles.footer}>
        <TactileButton
          label="SAVE CHANGES"
          onPress={handleSave}
          icon="checkmark"
          color={primaryColor}
          textColor={primaryTextColor}
          iconColor={primaryTextColor}
          height={52}
          borderRadius={13}
          depth={3}
          loading={saving}
          loadingText="SAVING CHANGES..."
          disabled={saving}
          style={styles.saveButtonWrapper}
          contentStyle={styles.saveButton}
          textStyle={styles.saveButtonText}
          accessibilityHint="Save your collection name and description"
        />

        {isNameEmpty ? (
          <Text
            style={[
              styles.validationHint,
              { color: secondaryTextColor },
            ]}
          >
            A collection name is required.
          </Text>
        ) : null}
      </View>
    </KeyboardAvoidingView>
  );
}

export default EditCollectionScreen;
import { useCallback, useState } from "react";

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
    colors.primaryText ||
    (isDark && primaryColor === "#C8C2FF" ? "#25223D" : "#FFFFFF");

  const disabledButtonColor =
    isDark ? "#383548" : "#D9D8E2";

  const { collectionId, collection } = route.params || {};
  const { updateCollection } = useCollection();

  const [name, setName] = useState(collection?.name || "");
  const [description, setDescription] = useState(
    collection?.description || "",
  );
  const [saving, setSaving] = useState(false);

  const memoryCount =
    collection?.memoryCount ??
    (Array.isArray(collection?.memories)
      ? collection.memories.length
      : 0);

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
  }, [
    name,
    description,
    collectionId,
    saving,
    updateCollection,
    navigation,
  ]);

  const handleCancel = useCallback(() => {
    if (saving) {
      return;
    }

    navigation.goBack();
  }, [navigation, saving]);

  const isNameEmpty = !name.trim();
  const isDisabled = isNameEmpty || saving;

  return (
    <KeyboardAvoidingView
      style={[
        styles.container,
        { backgroundColor: screenBackground },
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
          style={styles.headerAction}
          onPress={handleCancel}
          disabled={saving}
          activeOpacity={0.7}
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
          numberOfLines={1}
        >
          Edit Collection
        </Text>

        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={{ flex: 1 }}
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
                styles.logoContainer,
                {
                  backgroundColor: inputBackground,
                  borderColor,
                },
              ]}
            >
              <MementoLogo size={42} borderRadius={13} />
            </View>

            <View style={styles.previewText}>
              <Text
                style={[
                  styles.previewLabel,
                  { color: secondaryTextColor },
                ]}
              >
                EDITING COLLECTION
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
                {memoryCount === 1
                  ? "1 MEMORY"
                  : `${memoryCount} MEMORIES`}
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
              placeholder="Collection name"
              placeholderTextColor={mutedTextColor}
              style={[
                styles.input,
                {
                  backgroundColor: inputBackground,
                  color: textColor,
                },
              ]}
              maxLength={100}
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

        {/* MEMORY INFORMATION */}
        <View
          style={[
            styles.infoCard,
            {
              backgroundColor: surfaceColor,
              borderColor,
            },
          ]}
        >
          <Ionicons
            name="images-outline"
            size={20}
            color={primaryColor}
          />

          <View style={styles.infoTextContainer}>
            <Text
              style={[
                styles.infoTitle,
                { color: textColor },
              ]}
            >
              Memories stay safe
            </Text>

            <Text
              style={[
                styles.infoDescription,
                { color: secondaryTextColor },
              ]}
            >
              Updating this collection changes its details, not the memories
              saved inside it.
            </Text>
          </View>
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
            styles.saveButton,
            {
              backgroundColor: isNameEmpty
                ? disabledButtonColor
                : primaryColor,
              opacity: saving ? 0.8 : 1,
            },
          ]}
          onPress={handleSave}
          disabled={isDisabled}
          activeOpacity={0.85}
        >
          {saving ? (
            <ActivityIndicator
              size="small"
              color={primaryTextColor}
            />
          ) : (
            <>
              <Ionicons
                name="checkmark"
                size={18}
                color={
                  isNameEmpty
                    ? mutedTextColor
                    : primaryTextColor
                }
              />

              <Text
                style={[
                  styles.saveButtonText,
                  {
                    color: isNameEmpty
                      ? mutedTextColor
                      : primaryTextColor,
                  },
                ]}
              >
                Save Changes
              </Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

export default EditCollectionScreen;
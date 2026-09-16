import React, { useCallback, useState } from "react";

import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { useCollection } from "../../hooks/useCollection";

function EditCollectionScreen({ route, navigation }) {
  const { collectionId, collection } = route.params || {};

  const { updateCollection } = useCollection();

  const [name, setName] = useState(
    collection?.name || ""
  );

  const [description, setDescription] = useState(
    collection?.description || ""
  );

  const [saving, setSaving] = useState(false);

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

  const isDisabled = !name.trim() || saving;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={
        Platform.OS === "ios"
          ? "padding"
          : undefined
      }
    >
      <View style={styles.header}>
        <TouchableOpacity
          onPress={handleCancel}
          disabled={saving}
          activeOpacity={0.7}
        >
          <Text style={styles.cancelText}>
            Cancel
          </Text>
        </TouchableOpacity>

        <Text style={styles.headerTitle}>
          Edit Collection
        </Text>

        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>
            Collection Name
          </Text>

          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Collection name"
            placeholderTextColor="#999999"
            style={styles.input}
            maxLength={100}
            returnKeyType="next"
          />

          <Text style={styles.characterCount}>
            {name.length}/100
          </Text>
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.label}>
            Description
          </Text>

          <TextInput
            value={description}
            onChangeText={setDescription}
            placeholder="Add a short description"
            placeholderTextColor="#999999"
            style={[
              styles.input,
              styles.descriptionInput,
            ]}
            maxLength={500}
            multiline
            textAlignVertical="top"
          />

          <Text style={styles.characterCount}>
            {description.length}/500
          </Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.saveButton,
            isDisabled && styles.saveButtonDisabled,
          ]}
          onPress={handleSave}
          disabled={isDisabled}
          activeOpacity={0.85}
        >
          {saving ? (
            <ActivityIndicator
              size="small"
              color="#FFFFFF"
            />
          ) : (
            <Text style={styles.saveButtonText}>
              Save Changes
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

export default EditCollectionScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F1F0F6",
  },

  header: {
    height: 60,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#D9D8E2",
    backgroundColor: "#F1F0F6",
  },

  cancelText: {
    fontSize: 15,
    color: "#34345C",
    fontWeight: "600",
  },

  headerTitle: {
    fontSize: 18,
    color: "#242424",
    fontWeight: "700",
  },

  headerSpacer: {
    width: 52,
  },

  content: {
    padding: 20,
    paddingBottom: 40,
  },

  fieldContainer: {
    marginBottom: 24,
  },

  label: {
    marginBottom: 8,
    fontSize: 14,
    fontWeight: "700",
    color: "#242424",
  },

  input: {
    minHeight: 52,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: "#D9D8E2",
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    fontSize: 16,
    color: "#242424",
  },

  descriptionInput: {
    minHeight: 130,
    paddingTop: 14,
    paddingBottom: 14,
  },

  characterCount: {
    marginTop: 5,
    alignSelf: "flex-end",
    fontSize: 11,
    color: "#888888",
  },

  footer: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 20,
    borderTopWidth: 1,
    borderTopColor: "#D9D8E2",
    backgroundColor: "#F1F0F6",
  },

  saveButton: {
    height: 52,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    backgroundColor: "#34345C",
  },

  saveButtonDisabled: {
    opacity: 0.5,
  },

  saveButtonText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#FFFFFF",
  },
});


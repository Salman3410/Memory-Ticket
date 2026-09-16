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

function CreateCollectionScreen({ navigation }) {
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
  }, [
    name,
    description,
    createCollection,
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
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>

        <Text style={styles.headerTitle}>
          New Collection
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
            placeholder="e.g. Turkey Trip"
            placeholderTextColor="#999999"
            style={styles.input}
            maxLength={100}
            autoFocus
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

        <View style={styles.infoContainer}>
          <Text style={styles.infoTitle}>
            Organize your memories
          </Text>

          <Text style={styles.infoText}>
            You can add memories to this collection
            after creating it. A memory can belong to
            multiple collections.
          </Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
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
            <ActivityIndicator
              size="small"
              color="#FFFFFF"
            />
          ) : (
            <Text style={styles.createButtonText}>
              Create Collection
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

export default CreateCollectionScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F1F0F6",
  },

  header: {
    height: 90,
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

  infoContainer: {
    padding: 16,
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#D9D8E2",
  },

  infoTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#34345C",
  },

  infoText: {
    marginTop: 6,
    fontSize: 13,
    lineHeight: 19,
    color: "#666666",
  },

  footer: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 20,
    borderTopWidth: 1,
    borderTopColor: "#D9D8E2",
    backgroundColor: "#F1F0F6",
  },

  createButton: {
    height: 52,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    backgroundColor: "#34345C",
  },

  createButtonDisabled: {
    opacity: 0.5,
  },

  createButtonText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#FFFFFF",
  },
});

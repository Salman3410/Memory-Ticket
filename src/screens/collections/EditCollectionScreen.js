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
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { useCollection } from "../../hooks/useCollection";

import MementoLogo from "../../components/common/MementoLogo";

import styles from "./editCollectionStyles";

function EditCollectionScreen({ route, navigation }) {
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
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      {/* HEADER */}

      <View style={styles.header}>
        <TouchableOpacity
          onPress={handleCancel}
          disabled={saving}
          activeOpacity={0.7}
        >
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Edit Collection</Text>

        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* CURRENT COLLECTION */}

        <View style={styles.previewTicket}>
          <View style={styles.previewTop}>
            <MementoLogo size={58} borderRadius={29} />

            <View style={styles.previewText}>
              <Text style={styles.previewLabel}>EDITING COLLECTION</Text>

              <Text style={styles.previewName} numberOfLines={2}>
                {name.trim() || "Your Collection"}
              </Text>

              <Text style={styles.previewCount}>
                {memoryCount === 1 ? "1 MEMORY" : `${memoryCount} MEMORIES`}
              </Text>
            </View>
          </View>

          <View style={styles.previewDivider} />

          <View style={styles.previewFooter}>
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
          <Text style={styles.label}>COLLECTION NAME</Text>

          <View style={styles.inputWithIcon}>
            <Ionicons name="albums-outline" size={17} color="#7E7E88" />

            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Collection name"
              placeholderTextColor="#9A9AA3"
              style={styles.input}
              maxLength={100}
              autoCapitalize="sentences"
              autoCorrect={false}
              returnKeyType="next"
            />
          </View>

          <Text style={styles.characterCount}>{name.length}/100</Text>
        </View>

        {/* DESCRIPTION */}

        <View style={styles.fieldContainer}>
          <Text style={styles.label}>DESCRIPTION</Text>

          <TextInput
            value={description}
            onChangeText={setDescription}
            placeholder="Add a short description"
            placeholderTextColor="#9A9AA3"
            style={styles.descriptionInput}
            maxLength={200}
            multiline
            textAlignVertical="top"
          />

          <Text style={styles.characterCount}>{description.length}/200</Text>
        </View>
      </ScrollView>

      {/* FOOTER */}

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.saveButton, isDisabled && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={isDisabled}
          activeOpacity={0.85}
        >
          {saving ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={styles.saveButtonText}>Save Changes</Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

export default EditCollectionScreen;

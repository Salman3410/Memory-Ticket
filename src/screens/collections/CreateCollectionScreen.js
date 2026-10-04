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
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { useCollection } from "../../hooks/useCollection";

import styles from "./createCollectionStyles";

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

        <Text style={styles.headerTitle}>New Collection</Text>

        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* PREVIEW */}

        <View style={styles.previewTicket}>
          <View style={styles.previewTop}>
            <View style={styles.previewMark}>
              <Text style={styles.previewMarkText}>M</Text>
            </View>

            <View style={styles.previewText}>
              <Text style={styles.previewLabel}>NEW COLLECTION</Text>

              <Text style={styles.previewName} numberOfLines={2}>
                {name.trim() || "Your Collection"}
              </Text>

              <Text style={styles.previewCount}>0 MEMORIES</Text>
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
              placeholder="e.g. Turkey Trip"
              placeholderTextColor="#9A9AA3"
              style={styles.input}
              maxLength={100}
              autoFocus
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

        {/* HELPER */}

        <View style={styles.helper}>
          <Text style={styles.helperTitle}>BUILD YOUR TICKET</Text>

          <Text style={styles.helperText}>
            Add memories after creating the collection. The same memory can
            belong to multiple collections.
          </Text>
        </View>
      </ScrollView>

      {/* FOOTER */}

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
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={styles.createButtonText}>Create Collection</Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

export default CreateCollectionScreen;

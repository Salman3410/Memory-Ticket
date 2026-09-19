import { useCallback, useState } from "react";
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
import MementoLogo from "../../components/common/MementoLogo";

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

        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Collection Name</Text>

          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Collection name"
            placeholderTextColor="#999999"
            style={styles.input}
            maxLength={100}
            returnKeyType="next"
          />

          <Text style={styles.characterCount}>{name.length}/100</Text>
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Description</Text>

          <TextInput
            value={description}
            onChangeText={setDescription}
            placeholder="Add a short description"
            placeholderTextColor="#999999"
            style={[styles.input, styles.descriptionInput]}
            maxLength={500}
            multiline
            textAlignVertical="top"
          />

          <Text style={styles.characterCount}>{description.length}/500</Text>
        </View>
      </ScrollView>

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F1F0F6",
  },

  header: {
    height: 80,
    paddingTop:20,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#D9D8E2",
  },

  cancelText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#34345C",
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#242424",
  },

  headerSpacer: {
    width: 52,
  },

  content: {
    padding: 20,
    paddingBottom: 35,
  },

  previewTicket: {
    overflow: "hidden",
    borderRadius: 18,
    backgroundColor: "#FFFFFF",
    marginBottom: 28,
  },

  previewTop: {
    minHeight: 120,
    padding: 17,
    flexDirection: "row",
    alignItems: "center",
  },

  previewText: {
    flex: 1,
    marginLeft: 14,
  },

  previewLabel: {
    fontSize: 8,
    fontWeight: "800",
    letterSpacing: 1.5,
    color: "#E76F51",
  },

  previewName: {
    marginTop: 4,
    fontSize: 19,
    lineHeight: 23,
    fontWeight: "800",
    color: "#242424",
  },

  previewCount: {
    marginTop: 4,
    fontSize: 8,
    fontWeight: "800",
    letterSpacing: 1,
    color: "#34345C",
  },

  previewDivider: {
    marginHorizontal: 17,
    borderTopWidth: 1,
    borderTopColor: "#CECDD6",
    borderStyle: "dashed",
  },

  previewFooter: {
    paddingHorizontal: 17,
    paddingVertical: 11,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  previewBrand: {
    fontSize: 7,
    fontWeight: "800",
    letterSpacing: 1.4,
    color: "#9999A1",
  },

  previewBarcode: {
    height: 16,
    flexDirection: "row",
    gap: 2,
  },

  previewBar: {
    height: "100%",
    backgroundColor: "#34345C",
  },

  fieldContainer: {
    marginBottom: 23,
  },

  label: {
    marginBottom: 8,
    fontSize: 13,
    fontWeight: "800",
    color: "#242424",
  },

  input: {
    minHeight: 52,
    paddingHorizontal: 15,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#D9D8E2",
    fontSize: 16,
    color: "#242424",
  },

  descriptionInput: {
    minHeight: 125,
    paddingTop: 14,
    paddingBottom: 14,
  },

  characterCount: {
    marginTop: 5,
    alignSelf: "flex-end",
    fontSize: 10,
    color: "#8A8A8A",
  },

  footer: {
    paddingHorizontal: 20,
    paddingTop: 11,
    paddingBottom: 20,
    backgroundColor: "#F1F0F6",
    borderTopWidth: 1,
    borderTopColor: "#D9D8E2",
  },

  saveButton: {
    height: 52,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#34345C",
  },

  saveButtonDisabled: {
    opacity: 0.45,
  },

  saveButtonText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#FFFFFF",
  },
});

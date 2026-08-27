import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import styles from "./editMemoryActionsStyles";

function EditMemoryActions({ onSave, onCancel }) {
  return (
    <View>
      {/* SAVE */}
      <TouchableOpacity
        style={styles.saveButton}
        onPress={onSave}
        activeOpacity={0.85}
      >
        <Ionicons name="checkmark" size={21} color="#FFFFFF" />

        <Text style={styles.saveButtonText}>SAVE CHANGES</Text>
      </TouchableOpacity>

      {/* CANCEL */}
      <TouchableOpacity
        style={styles.cancelButton}
        onPress={onCancel}
        activeOpacity={0.75}
      >
        <Text style={styles.cancelButtonText}>CANCEL</Text>
      </TouchableOpacity>

      {/* FOOTER */}
      <Text style={styles.footerText}>KEEP THE MOMENT. KEEP THE STORY.</Text>
    </View>
  );
}

export default EditMemoryActions;

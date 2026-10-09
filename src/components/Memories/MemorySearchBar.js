import { View, TouchableOpacity, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../../context/ThemeContext";
import styles from "./memorySearchBarStyles";

function MemorySearchBar({ value, onChangeText, onClear }) {
  const { theme, isDark } = useTheme();

  const colors = theme?.colors || {};
  const textColor = colors.text || (isDark ? "#F1F0F6" : "#242424");
  const mutedTextColor =
    colors.textSecondary ||
    colors.textMuted ||
    (isDark ? "#A6A6B8" : "#7E7E88");
  const placeholderColor =
    colors.placeholder || (isDark ? "#88889C" : "#9A9AA3");
  const surfaceColor =
    colors.surface || colors.card || (isDark ? "#232333" : "#FFFFFF");
  const borderColor = colors.border || (isDark ? "#38384C" : "#D9D8E2");
  const accentColor = colors.accent || "#E76F51";

  return (
    <View
      style={[
        styles.searchContainer,
        {
          backgroundColor: surfaceColor,
          borderColor,
        },
      ]}
    >
      <Ionicons name="search-outline" size={17} color={mutedTextColor} />

      <TextInput
        style={[
          styles.searchInput,
          {
            color: textColor,
            backgroundColor: "transparent",
          },
        ]}
        placeholder="Search memories..."
        placeholderTextColor={placeholderColor}
        value={value}
        onChangeText={onChangeText}
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="search"
        selectionColor={accentColor}
      />

      {!!value?.length && (
        <TouchableOpacity
          style={styles.clearSearchButton}
          onPress={onClear}
          activeOpacity={0.7}
          hitSlop={6}
          accessibilityRole="button"
          accessibilityLabel="Clear search"
        >
          <Ionicons
            name="close-circle-outline"
            size={17}
            color={mutedTextColor}
          />
        </TouchableOpacity>
      )}
    </View>
  );
}

export default MemorySearchBar;

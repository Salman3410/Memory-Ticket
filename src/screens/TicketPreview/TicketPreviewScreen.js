import { useMemo, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  useWindowDimensions,
  ActivityIndicator,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useMemory } from "../../hooks/useMemory";
import { useAppAlert } from "../../context/AlertContext";
import { useTheme } from "../../context/ThemeContext";
import MemoryTicket from "../../components/MemoryTicket/MemoryTicket";
import TicketCustomizationSheet from "../../components/TicketCustomization/TicketCustomizationSheet";
import { normalizeTicketCustomization } from "../../utils/ticketCustomization";
import styles from "./ticketPreviewStyles";

function TicketPreviewScreen({ route, navigation }) {
  const { addMemory } = useMemory();
  const { showAlert } = useAppAlert();
  const { theme, isDark } = useTheme();

  const { memory } = route.params || {};
  const { width: screenWidth } = useWindowDimensions();
  const [activeImage, setActiveImage] = useState(0);
  const [saving, setSaving] = useState(false);
  const [customization, setCustomization] = useState(() =>
    normalizeTicketCustomization(memory || {}),
  );

  const [customizationVisible, setCustomizationVisible] = useState(false);

  const colors = useMemo(() => {
    const themeColors = theme?.colors || {};

    return {
      background: themeColors.background || (isDark ? "#171724" : "#F1F0F6"),

      surface:
        themeColors.surface ||
        themeColors.card ||
        (isDark ? "#232333" : "#FFFFFF"),

      text: themeColors.text || (isDark ? "#F1F0F6" : "#242424"),

      textSecondary:
        themeColors.textSecondary ||
        themeColors.textMuted ||
        (isDark ? "#A6A6B8" : "#737387"),

      border: themeColors.border || (isDark ? "#38384C" : "#D9D8E2"),

      primary: themeColors.primary || "#34345C",

      accent: themeColors.accent || "#E76F51",
    };
  }, [theme, isDark]);

  const screenStyles = useMemo(() => {
    return {
      container: {
        ...styles.container,
        backgroundColor: colors.background,
      },

      scrollContent: {
        ...styles.scrollContent,
        backgroundColor: colors.background,
      },

      header: {
        ...styles.header,
        backgroundColor: colors.background,
      },

      backButton: {
        ...styles.backButton,
        backgroundColor: colors.surface,
        borderColor: colors.border,
      },

      headerEyebrow: {
        ...styles.headerEyebrow,
        color: colors.textSecondary,
      },

      headerTitle: {
        ...styles.headerTitle,
        color: colors.text,
      },

      previewTitle: {
        ...styles.previewTitle,
        color: colors.text,
      },

      previewSubtitle: {
        ...styles.previewSubtitle,
        color: colors.textSecondary,
      },

      swipeHintText: {
        ...styles.swipeHintText,
        color: colors.textSecondary,
      },

      editButton: {
        ...styles.editButton,
        backgroundColor: colors.surface,
        borderColor: colors.border,
      },

      editButtonText: {
        ...styles.editButtonText,
        color: colors.primary,
      },

      saveButton: {
        ...styles.saveButton,
        backgroundColor: colors.primary,
        opacity: 1,
      },

      saveButtonDisabled: {
        ...styles.saveButton,
        backgroundColor: colors.primary,
        opacity: 1,
      },

      saveButtonText: {
        ...styles.saveButtonText,
        color: "#FFFFFF",
      },

      footerText: {
        ...styles.footerText,
        color: colors.textSecondary,
      },
    };
  }, [colors]);

  if (!memory) {
    return (
      <View style={screenStyles.container}>
        <StatusBar
          barStyle={isDark ? "light-content" : "dark-content"}
          backgroundColor={colors.background}
        />

        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            paddingHorizontal: 30,
          }}
        >
          <Ionicons
            name="alert-circle-outline"
            size={45}
            color={colors.primary}
          />

          <Text
            style={{
              fontSize: 20,
              fontWeight: "900",
              color: colors.text,
              marginTop: 15,
              marginBottom: 18,
              textAlign: "center",
            }}
          >
            Memory data not found
          </Text>

          <TouchableOpacity
            style={{
              height: 48,
              paddingHorizontal: 22,
              borderRadius: 13,
              backgroundColor: colors.primary,
              alignItems: "center",
              justifyContent: "center",
            }}
            onPress={() =>
              navigation.navigate("MainTabs", {
                screen: "Create",
              })
            }
            activeOpacity={0.8}
          >
            <Text
              style={{
                fontSize: 10,
                fontWeight: "900",
                letterSpacing: 1,
                color: "#FFFFFF",
              }}
            >
              CREATE MEMORY
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const images = Array.isArray(memory.images)
    ? memory.images
    : memory.image
      ? [memory.image]
      : [];

  const previewMemory = {
    ...memory,
    ...customization,
  };

  const handleSave = async () => {
    if (saving) {
      return;
    }

    try {
      if (!images.length) {
        showAlert({
          type: "warning",
          icon: "images-outline",
          title: "No Photos",
          message: "This memory doesn't contain any photos.",
          confirmText: "OK",
        });

        return;
      }

      setSaving(true);

      const savedMemory = await addMemory({
        title: memory.title || "",

        location: memory.location || "",

        locationData: memory.locationData || null,

        network: memory.network || memory.environment?.network || null,

        description: memory.description || "",

        tags: Array.isArray(memory.tags) ? [...memory.tags] : [],

        images: [...images],

        date: memory.date || new Date().toISOString(),

        favorite: false,

        environment: memory.environment || null,

        ticketStyle: customization.ticketStyle,

        ticketAccent: customization.ticketAccent,

        ticketOptions: {
          ...customization.ticketOptions,
        },
      });

      if (!savedMemory) {
        throw new Error("Memory was not created.");
      }

      navigation.navigate("MainTabs", {
        screen: "Memories",
      });
    } catch (error) {
      console.error("Error saving memory:", error);

      showAlert({
        type: "danger",
        icon: "close-circle-outline",
        title: "Save Failed",
        message: error?.message || "Unable to save the memory.",
        confirmText: "OK",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = () => {
    if (saving) {
      return;
    }

    navigation.navigate("MainTabs", {
      screen: "Create",

      params: {
        editMemory: {
          ...memory,

          images: [...images],

          image: images[0] || memory.image || null,

          location: memory.location || "",

          locationData: memory.locationData || null,

          tags: Array.isArray(memory.tags) ? [...memory.tags] : [],

          ticketStyle: customization.ticketStyle,

          ticketAccent: customization.ticketAccent,

          ticketOptions: {
            ...customization.ticketOptions,
          },
        },
      },
    });
  };

  const renderTicket = (image, index) => {
    return (
      <View
        key={`ticket-${index}-${image}`}
        style={[
          styles.ticketSlide,
          {
            width: screenWidth - 44,
            marginRight: 12,
          },
        ]}
      >
        <View style={styles.ticketShadow}>
          <MemoryTicket
            key={`preview-${index}-${previewMemory.ticketStyle}-${previewMemory.ticketAccent}`}
            memory={previewMemory}
            image={image}
          />
        </View>
      </View>
    );
  };

  return (
    <View style={screenStyles.container}>
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor={colors.background}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={screenStyles.scrollContent}
        nestedScrollEnabled
      >
        {/* HEADER */}

        <View style={screenStyles.header}>
          <TouchableOpacity
            style={screenStyles.backButton}
            onPress={() => navigation.goBack()}
            disabled={saving}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={21} color={colors.text} />
          </TouchableOpacity>

          <View style={styles.headerTextContainer}>
            <Text style={screenStyles.headerEyebrow}>YOUR MEMORY</Text>

            <Text style={screenStyles.headerTitle}>Ticket Preview</Text>
          </View>

          <View style={styles.headerSpacer} />
        </View>

        {/* INTRO */}

        <View style={styles.previewHeader}>
          <Text style={screenStyles.previewTitle}>Looks good?</Text>

          <Text style={screenStyles.previewSubtitle}>
            This moment is ready to become a ticket.
          </Text>
        </View>

        {/* TICKET CAROUSEL */}

        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          nestedScrollEnabled
          decelerationRate="fast"
          snapToInterval={screenWidth - 32}
          snapToAlignment="start"
          disableIntervalMomentum
          onMomentumScrollEnd={(event) => {
            const index = Math.round(
              event.nativeEvent.contentOffset.x / (screenWidth - 32),
            );

            setActiveImage(Math.max(0, Math.min(index, images.length - 1)));
          }}
        >
          {images.length > 0 ? images.map(renderTicket) : renderTicket(null, 0)}
        </ScrollView>

        {/* SWIPE HINT */}

        {images.length > 1 && (
          <View style={styles.swipeHint}>
            <Ionicons
              name="swap-horizontal-outline"
              size={16}
              color={colors.textSecondary}
            />

            <Text style={screenStyles.swipeHintText}>
              SWIPE TO VIEW MORE PHOTOS
            </Text>
          </View>
        )}

        {/* CUSTOMIZE TICKET */}

        <TouchableOpacity
          style={[
            screenStyles.editButton,
            {
              marginTop: 12,
              marginBottom: 10,
            },
          ]}
          onPress={() => setCustomizationVisible(true)}
          disabled={saving}
          activeOpacity={0.8}
        >
          <Ionicons
            name="color-palette-outline"
            size={19}
            color={colors.primary}
          />

          <Text style={screenStyles.editButtonText}>CUSTOMIZE TICKET</Text>
        </TouchableOpacity>

        {/* ACTIONS */}

        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={
              saving ? screenStyles.saveButtonDisabled : screenStyles.saveButton
            }
            onPress={handleSave}
            disabled={saving}
            activeOpacity={1}
          >
            {saving ? (
              <>
                <ActivityIndicator size="small" color="#FFFFFF" />

                <Text style={screenStyles.saveButtonText}>SAVING...</Text>
              </>
            ) : (
              <>
                <Ionicons name="bookmark-outline" size={20} color="#FFFFFF" />

                <Text style={screenStyles.saveButtonText}>SAVE MEMORY</Text>
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={screenStyles.editButton}
            onPress={handleEdit}
            disabled={saving}
            activeOpacity={0.8}
          >
            <Ionicons name="create-outline" size={19} color={colors.primary} />

            <Text style={screenStyles.editButtonText}>EDIT</Text>
          </TouchableOpacity>
        </View>

        {/* FOOTER */}

        <Text style={screenStyles.footerText}>
          Every moment deserves a ticket.
        </Text>
      </ScrollView>

      {/* TICKET CUSTOMIZATION SHEET */}

      <TicketCustomizationSheet
        visible={customizationVisible}
        value={customization}
        onChange={setCustomization}
        onClose={() => setCustomizationVisible(false)}
        theme={theme}
        isDark={isDark}
      />
    </View>
  );
}

export default TicketPreviewScreen;

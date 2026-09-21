import { useState } from "react";

import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  useWindowDimensions,
  Alert,
  ActivityIndicator,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { useMemory } from "../../hooks/useMemory";

import MemoryTicket from "../../components/MemoryTicket/MemoryTicket";

import TicketCustomizationSheet from "../../components/TicketCustomization/TicketCustomizationSheet";

import { normalizeTicketCustomization } from "../../utils/ticketCustomization";

import styles from "./ticketPreviewStyles";

function TicketPreviewScreen({ route, navigation }) {
  const { addMemory } = useMemory();

  const { memory } = route.params || {};

  const { width: screenWidth } = useWindowDimensions();

  const [activeImage, setActiveImage] = useState(0);

  const [saving, setSaving] = useState(false);

  const [customization, setCustomization] = useState(() =>
    normalizeTicketCustomization(memory || {}),
  );

  const [customizationVisible, setCustomizationVisible] = useState(false);

  if (!memory) {
    return (
      <View style={styles.container}>
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            paddingHorizontal: 30,
          }}
        >
          <Ionicons name="alert-circle-outline" size={45} color="#34345C" />

          <Text
            style={{
              fontSize: 20,
              fontWeight: "900",
              color: "#242424",
              marginTop: 15,
              marginBottom: 18,
            }}
          >
            Memory data not found
          </Text>

          <TouchableOpacity
            style={{
              height: 48,
              paddingHorizontal: 22,
              borderRadius: 13,
              backgroundColor: "#34345C",
              alignItems: "center",
              justifyContent: "center",
            }}
            onPress={() =>
              navigation.navigate("MainTabs", {
                screen: "Create",
              })
            }
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
        Alert.alert("No Photos", "This memory doesn't contain any photos.");

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

      Alert.alert(
        "Save Failed",
        error?.message || "Unable to save the memory.",
      );
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
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        nestedScrollEnabled
      >
        {/* HEADER */}

        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            disabled={saving}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={21} color="#242424" />
          </TouchableOpacity>

          <View style={styles.headerTextContainer}>
            <Text style={styles.headerEyebrow}>YOUR MEMORY</Text>

            <Text style={styles.headerTitle}>Ticket Preview</Text>
          </View>

          <View style={styles.headerSpacer} />
        </View>

        {/* INTRO */}

        <View style={styles.previewHeader}>
          <Text style={styles.previewTitle}>Looks good?</Text>

          <Text style={styles.previewSubtitle}>
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

            setActiveImage(index);
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
              color="#9A99A5"
            />

            <Text style={styles.swipeHintText}>SWIPE TO VIEW MORE PHOTOS</Text>
          </View>
        )}

        {/* CUSTOMIZE */}

        <TouchableOpacity
          style={[
            styles.editButton,
            {
              marginTop: 12,
              marginBottom: 10,
            },
          ]}
          onPress={() => setCustomizationVisible(true)}
          disabled={saving}
          activeOpacity={0.8}
        >
          <Ionicons name="color-palette-outline" size={19} color="#34345C" />

          <Text style={styles.editButtonText}>CUSTOMIZE TICKET</Text>
        </TouchableOpacity>

        {/* ACTIONS */}

        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={[styles.saveButton, saving && styles.saveButtonDisabled]}
            onPress={handleSave}
            disabled={saving}
            activeOpacity={0.85}
          >
            {saving ? (
              <>
                <ActivityIndicator size="small" color="#FFFFFF" />

                <Text style={styles.saveButtonText}>SAVING...</Text>
              </>
            ) : (
              <>
                <Ionicons name="bookmark-outline" size={20} color="#FFFFFF" />

                <Text style={styles.saveButtonText}>SAVE MEMORY</Text>
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.editButton}
            onPress={handleEdit}
            disabled={saving}
            activeOpacity={0.8}
          >
            <Ionicons name="create-outline" size={19} color="#34345C" />

            <Text style={styles.editButtonText}>EDIT</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.footerText}>Every moment deserves a ticket.</Text>
      </ScrollView>

      <TicketCustomizationSheet
        visible={customizationVisible}
        value={customization}
        onChange={setCustomization}
        onClose={() => setCustomizationVisible(false)}
      />
    </View>
  );
}

export default TicketPreviewScreen;

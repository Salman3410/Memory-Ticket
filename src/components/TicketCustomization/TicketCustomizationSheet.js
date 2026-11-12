
import { useMemo, useCallback } from "react";

import {
  Modal,
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { useTheme } from "../../context/ThemeContext";

import TactileButton from "../../components/common/TactileButton";

import {
  normalizeTicketCustomization,
} from "../../utils/ticketCustomization";

import styles from "./ticketCustomizationStyles";

// AVAILABLE TICKET DESIGNS
const TICKET_STYLE_OPTIONS = [
  {
    id: "classic",
    label: "Classic",
    description: "The original Memento ticket",
    preview: require("../../../assets/tickets/classic.png"),
  },
  {
    id: "red-pattern",
    label: "Red Pattern",
    description: "A playful pattern for your memories",
    preview: require(
      "../../../assets/tickets/sticker/red-sticker.png"
    ),
  },
  {
    id: "red-lines",
    label: "Red Lines",
    description: "Flowing lines with a bold red finish",
    preview: require(
      "../../../assets/tickets/pattern/red-line.png"
    ),
  },
];

function TicketCustomizationSheet({
  visible,
  value,
  onChange,
  onClose,
  onSave = null,
  saving = false,
  title = "Customize Ticket",
}) {
  const { isDark, theme } = useTheme();

  const colors = theme?.colors || {};

  // THEME COLORS
  const surfaceColor =
    colors.surface ||
    (isDark ? "#211F30" : "#FFFFFF");

  const surfaceSecondaryColor =
    colors.surfaceSecondary ||
    (isDark ? "#292740" : "#F1F0F6");

  const textColor =
    colors.text ||
    (isDark ? "#F7F5FC" : "#242424");

  const secondaryTextColor =
    colors.textSecondary ||
    colors.textMuted ||
    (isDark ? "#C4C0D0" : "#707080");

  const borderColor =
    colors.border ||
    (isDark ? "#39364D" : "#D9D8E2");

  const dividerColor =
    colors.divider || borderColor;

  const primaryColor =
    colors.primary ||
    (isDark ? "#C8C2FF" : "#34345C");

  const accentColor =
    colors.accent || "#E76F51";

  // NORMALIZE CUSTOMIZATION
  const customization = useMemo(
    () => normalizeTicketCustomization(value),
    [value]
  );

  const actionLabel = saving
    ? "SAVING..."
    : onSave
      ? "SAVE CHANGES"
      : "DONE";

  // CHECK CURRENT STYLE
  const selectedStyleId = TICKET_STYLE_OPTIONS.some(
    (item) => item.id === customization.ticketStyle
  )
    ? customization.ticketStyle
    : "classic";

  // UPDATE CUSTOMIZATION
  const updateCustomization = useCallback(
    (changes) => {
      if (typeof onChange !== "function") {
        return;
      }

      onChange({
        ...customization,
        ...changes,
      });
    },
    [customization, onChange]
  );

  // SELECT TICKET DESIGN
  const selectTicketStyle = useCallback(
    (styleId) => {
      if (saving) {
        return;
      }

      updateCustomization({
        ticketStyle: styleId,
      });
    },
    [saving, updateCustomization]
  );

  // TOGGLE TICKET OPTIONS
  const toggleOption = useCallback(
    (key) => {
      updateCustomization({
        ticketOptions: {
          ...customization.ticketOptions,
          [key]: !customization.ticketOptions?.[key],
        },
      });
    },
    [customization, updateCustomization]
  );

  // HANDLE DONE / SAVE
  const handleAction = useCallback(() => {
    if (saving) {
      return;
    }

    if (typeof onSave === "function") {
      onSave();
      return;
    }

    onClose?.();
  }, [saving, onSave, onClose]);

  // HANDLE CLOSE
  const handleClose = useCallback(() => {
    if (!saving) {
      onClose?.();
    }
  }, [saving, onClose]);

  // RENDER VISIBILITY TOGGLE
  const renderToggle = (label, key) => {
    const enabled = Boolean(
      customization.ticketOptions?.[key]
    );

    return (
      <TouchableOpacity
        key={key}
        style={[
          styles.optionRow,
          {
            backgroundColor: surfaceSecondaryColor,
            borderColor,
            borderBottomColor: dividerColor,
          },
        ]}
        onPress={() => toggleOption(key)}
        activeOpacity={0.75}
        disabled={saving}
        accessibilityRole="switch"
        accessibilityLabel={label}
        accessibilityState={{
          checked: enabled,
          disabled: saving,
        }}
      >
        <View style={styles.optionTextContainer}>
          <Text
            style={[
              styles.optionLabel,
              {
                color: textColor,
              },
            ]}
          >
            {label}
          </Text>

          <Text
            style={[
              styles.optionState,
              {
                color: secondaryTextColor,
              },
            ]}
          >
            {enabled ? "VISIBLE" : "HIDDEN"}
          </Text>
        </View>

        <Ionicons
          name={
            enabled
              ? "checkmark-circle"
              : "ellipse-outline"
          }
          size={24}
          color={
            enabled
              ? primaryColor
              : secondaryTextColor
          }
        />
      </TouchableOpacity>
    );
  };

  // RENDER TICKET STYLE CARD
  const renderStyleCard = (styleOption) => {
    const selected =
      selectedStyleId === styleOption.id;

    return (
      <TouchableOpacity
        key={styleOption.id}
        onPress={() =>
          selectTicketStyle(styleOption.id)
        }
        activeOpacity={0.8}
        disabled={saving}
        accessibilityRole="radio"
        accessibilityLabel={styleOption.label}
        accessibilityState={{
          checked: selected,
          disabled: saving,
        }}
        style={{
          width: "48%",
          marginBottom: 13,
          padding: 9,
          borderRadius: 14,
          borderWidth: selected ? 2 : 1,
          borderColor: selected
            ? primaryColor
            : borderColor,
          backgroundColor: surfaceSecondaryColor,
          overflow: "hidden",
        }}
      >
        {/* TICKET IMAGE PREVIEW */}
        <View
          style={{
            width: "100%",
            height: 155,
            borderRadius: 9,
            overflow: "hidden",
            backgroundColor: surfaceColor,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Image
            source={styleOption.preview}
            resizeMode="contain"
            style={{
              width: "100%",
              height: "100%",
            }}
          />
        </View>

        {/* TICKET NAME AND DESCRIPTION */}
        <View
          style={{
            marginTop: 11,
            paddingRight: 19,
          }}
        >
          <Text
            style={{
              fontSize: 12,
              fontWeight: "900",
              color: textColor,
            }}
            numberOfLines={1}
          >
            {styleOption.label}
          </Text>

          <Text
            style={{
              fontSize: 9,
              lineHeight: 14,
              marginTop: 4,
              color: secondaryTextColor,
            }}
            numberOfLines={2}
          >
            {styleOption.description}
          </Text>
        </View>

        {/* SELECTED INDICATOR */}
        {selected && (
          <View
            style={{
              position: "absolute",
              top: 15,
              right: 15,
              width: 24,
              height: 24,
              borderRadius: 12,
              backgroundColor: primaryColor,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Ionicons
              name="checkmark"
              size={15}
              color="#FFFFFF"
            />
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      statusBarTranslucent
      onRequestClose={handleClose}
    >
      <View
        style={[
          styles.overlay,
          {
            backgroundColor: "rgba(0,0,0,0.62)",
          },
        ]}
      >
        <View
          style={[
            styles.sheet,
            {
              backgroundColor: surfaceColor,
              borderColor,
            },
          ]}
        >
          {/* HEADER */}
          <View
            style={[
              styles.header,
              {
                borderBottomColor: dividerColor,
              },
            ]}
          >
            <View style={{ flex: 1 }}>
              <Text
                style={[
                  styles.eyebrow,
                  {
                    color: accentColor,
                  },
                ]}
              >
                MEMENTO
              </Text>

              <Text
                style={[
                  styles.title,
                  {
                    color: textColor,
                  },
                ]}
              >
                {title}
              </Text>
            </View>

            <TouchableOpacity
              style={[
                styles.closeButton,
                {
                  backgroundColor: surfaceSecondaryColor,
                  borderColor,
                },
              ]}
              onPress={handleClose}
              disabled={saving}
              activeOpacity={0.75}
              accessibilityRole="button"
              accessibilityLabel="Close ticket customization"
            >
              <Ionicons
                name="close"
                size={22}
                color={textColor}
              />
            </TouchableOpacity>
          </View>

          {/* SCROLLABLE CONTENT */}
          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={[
              styles.scrollContent,
              {
                backgroundColor: surfaceColor,
              },
            ]}
          >
            {/* TICKET STYLE SECTION */}
            <View
              style={{
                marginBottom: 7,
              }}
            >
              <Text
                style={[
                  styles.sectionLabel,
                  {
                    color: secondaryTextColor,
                  },
                ]}
              >
                TICKET STYLE
              </Text>

              <Text
                style={{
                  fontSize: 10,
                  color: secondaryTextColor,
                  marginTop: -3,
                  marginBottom: 14,
                }}
              >
                Choose a design for your memory ticket.
              </Text>
            </View>

            {/* DESIGN GRID */}
            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                justifyContent: "space-between",
              }}
            >
              {TICKET_STYLE_OPTIONS.map(
                renderStyleCard
              )}
            </View>

            {/* DIVIDER */}
            <View
              style={{
                height: 1,
                backgroundColor: dividerColor,
                marginTop: 3,
                marginBottom: 18,
              }}
            />

            {/* SHOW ON TICKET */}
            <Text
              style={[
                styles.sectionLabel,
                styles.contentSectionLabel,
                {
                  color: secondaryTextColor,
                },
              ]}
            >
              SHOW ON TICKET
            </Text>

            {renderToggle(
              "Location",
              "showLocation"
            )}

            {renderToggle(
              "Date",
              "showDate"
            )}

            {renderToggle(
              "Description",
              "showDescription"
            )}

            {renderToggle(
              "Ticket Number",
              "showTicketNumber"
            )}

            {/* DONE BUTTON */}
            <View style={styles.doneButtonContainer}>
              <TactileButton
                title={actionLabel}
                onPress={handleAction}
                disabled={saving}
                loading={saving}
                variant="primary"
              />
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

export default TicketCustomizationSheet;

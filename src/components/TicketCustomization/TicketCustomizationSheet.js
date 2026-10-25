import { useMemo, useCallback } from "react";
import {
  Modal,
  View,
  Text,
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

  const surfaceColor =
    colors.surface || (isDark ? "#211F30" : "#FFFFFF");

  const surfaceSecondaryColor =
    colors.surfaceSecondary || (isDark ? "#292740" : "#F1F0F6");

  const textColor =
    colors.text || (isDark ? "#F7F5FC" : "#242424");

  const secondaryTextColor =
    colors.textSecondary ||
    colors.textMuted ||
    (isDark ? "#C4C0D0" : "#707080");

  const borderColor =
    colors.border || (isDark ? "#39364D" : "#D9D8E2");

  const dividerColor = colors.divider || borderColor;

  const primaryColor =
    colors.primary || (isDark ? "#C8C2FF" : "#34345C");

  const accentColor = colors.accent || "#E76F51";

  const customization = useMemo(
    () => normalizeTicketCustomization(value),
    [value],
  );

  const actionLabel = saving
    ? "SAVING..."
    : onSave
      ? "SAVE CHANGES"
      : "DONE";

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
    [customization, onChange],
  );

  const toggleOption = useCallback(
    (key) => {
      updateCustomization({
        ticketOptions: {
          ...customization.ticketOptions,
          [key]: !customization.ticketOptions?.[key],
        },
      });
    },
    [customization, updateCustomization],
  );

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

  const handleClose = useCallback(() => {
    if (!saving) {
      onClose?.();
    }
  }, [saving, onClose]);

  const renderToggle = (label, key) => {
    const enabled = Boolean(customization.ticketOptions?.[key]);

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
              { color: textColor },
            ]}
          >
            {label}
          </Text>

          <Text
            style={[
              styles.optionState,
              { color: secondaryTextColor },
            ]}
          >
            {enabled ? "VISIBLE" : "HIDDEN"}
          </Text>
        </View>

        <Ionicons
          name={enabled ? "checkmark-circle" : "ellipse-outline"}
          size={24}
          color={enabled ? primaryColor : secondaryTextColor}
        />
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
                  { color: accentColor },
                ]}
              >
                MEMENTO
              </Text>

              <Text
                style={[
                  styles.title,
                  { color: textColor },
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

          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={[
              styles.scrollContent,
              { backgroundColor: surfaceColor },
            ]}
          >
            {/*
            <Text
              style={[
                styles.sectionLabel,
                { color: secondaryTextColor },
              ]}
            >
              TICKET STYLE
            </Text>

            <View style={styles.styleGrid}>
              {TICKET_STYLE_OPTIONS.map((styleOption) => {
                const selected =
                  customization.ticketStyle === styleOption.id;

                return (
                  <TouchableOpacity
                    key={styleOption.id}
                    style={[
                      styles.styleCard,
                      selected && styles.styleCardActive,
                      {
                        backgroundColor: surfaceSecondaryColor,
                        borderColor: selected
                          ? primaryColor
                          : borderColor,
                      },
                    ]}
                    onPress={() =>
                      updateCustomization({
                        ticketStyle: styleOption.id,
                      })
                    }
                    activeOpacity={0.8}
                    disabled={saving}
                  >
                    <View
                      style={[
                        styles.stylePreview,
                        styleOption.id === "classic" &&
                          styles.classicPreview,
                        styleOption.id === "minimal" &&
                          styles.minimalPreview,
                        styleOption.id === "vintage" &&
                          styles.vintagePreview,
                        {
                          backgroundColor: isDark
                            ? "#302D43"
                            : "#FFFFFF",
                          borderColor,
                        },
                      ]}
                    >
                      <View
                        style={[
                          styles.previewLine,
                          { backgroundColor: primaryColor },
                        ]}
                      />

                      <View
                        style={[
                          styles.previewBlock,
                          { backgroundColor: accentColor },
                        ]}
                      />

                      <View
                        style={[
                          styles.previewBlockSmall,
                          {
                            backgroundColor: isDark
                              ? "#625E79"
                              : "#D9D8E2",
                          },
                        ]}
                      />
                    </View>

                    <View style={styles.styleCardText}>
                      <Text
                        style={[
                          styles.styleCardTitle,
                          { color: textColor },
                        ]}
                      >
                        {styleOption.label}
                      </Text>

                      <Text
                        style={[
                          styles.styleCardDescription,
                          { color: secondaryTextColor },
                        ]}
                      >
                        {styleOption.description}
                      </Text>
                    </View>

                    {selected && (
                      <View
                        style={[
                          styles.selectedBadge,
                          { backgroundColor: primaryColor },
                        ]}
                      >
                        <Ionicons
                          name="checkmark"
                          size={13}
                          color="#FFFFFF"
                        />
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
            */}

            {/*
            <Text
              style={[
                styles.sectionLabel,
                styles.accentSectionLabel,
                { color: secondaryTextColor },
              ]}
            >
              ACCENT COLOR
            </Text>

            <View style={styles.accentRow}>
              {TICKET_ACCENT_OPTIONS.map((accent) => {
                const selected =
                  customization.ticketAccent === accent.id;

                return (
                  <TouchableOpacity
                    key={accent.id}
                    style={styles.accentItem}
                    onPress={() =>
                      updateCustomization({
                        ticketAccent: accent.id,
                      })
                    }
                    activeOpacity={0.75}
                    disabled={saving}
                  >
                    <View
                      style={[
                        styles.accentCircle,
                        {
                          backgroundColor: accent.color,
                          borderColor: selected
                            ? primaryColor
                            : borderColor,
                        },
                        selected && styles.accentCircleActive,
                      ]}
                    >
                      {selected && (
                        <Ionicons
                          name="checkmark"
                          size={16}
                          color="#FFFFFF"
                        />
                      )}
                    </View>

                    <Text
                      style={[
                        styles.accentLabel,
                        {
                          color: selected
                            ? textColor
                            : secondaryTextColor,
                        },
                      ]}
                    >
                      {accent.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
            */}

            {/* SHOW ON TICKET */}
            <Text
              style={[
                styles.sectionLabel,
                styles.contentSectionLabel,
                { color: secondaryTextColor },
              ]}
            >
              SHOW ON TICKET
            </Text>

            {renderToggle("Location", "showLocation")}
            {renderToggle("Date", "showDate")}
            {renderToggle("Description", "showDescription")}
            {renderToggle("Ticket Number", "showTicketNumber")}

            {/* TACTILE ACTION BUTTON */}
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
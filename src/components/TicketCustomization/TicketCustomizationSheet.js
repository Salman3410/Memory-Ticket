import React from "react";

import { Modal, View, Text, ScrollView, TouchableOpacity } from "react-native";

import { Ionicons } from "@expo/vector-icons";

import {
  TICKET_STYLE_OPTIONS,
  TICKET_ACCENT_OPTIONS,
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
  const customization = normalizeTicketCustomization(value);

  const updateCustomization = (changes) => {
    onChange({
      ...customization,
      ...changes,
    });
  };

  const toggleOption = (key) => {
    updateCustomization({
      ticketOptions: {
        ...customization.ticketOptions,
        [key]: !customization.ticketOptions[key],
      },
    });
  };

  const renderToggle = (label, key) => {
    const enabled = customization.ticketOptions[key];

    return (
      <TouchableOpacity
        style={styles.optionRow}
        onPress={() => toggleOption(key)}
        activeOpacity={0.8}
      >
        <View style={styles.optionTextContainer}>
          <Text style={styles.optionLabel}>{label}</Text>

          <Text style={styles.optionState}>
            {enabled ? "VISIBLE" : "HIDDEN"}
          </Text>
        </View>

        <Ionicons
          name={enabled ? "checkmark-circle" : "ellipse-outline"}
          size={24}
          color={enabled ? "#34345C" : "#B8B7C1"}
        />
      </TouchableOpacity>
    );
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={() => {
        if (!saving) {
          onClose();
        }
      }}
    >
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          {/* HEADER */}

          <View style={styles.header}>
            <View>
              <Text style={styles.eyebrow}>MEMENTO</Text>

              <Text style={styles.title}>{title}</Text>
            </View>

            <TouchableOpacity
              style={styles.closeButton}
              onPress={onClose}
              disabled={saving}
              activeOpacity={0.8}
            >
              <Ionicons name="close" size={22} color="#242424" />
            </TouchableOpacity>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {/* TICKET STYLE */}

            <Text style={styles.sectionLabel}>TICKET STYLE</Text>

            <View style={styles.styleGrid}>
              {TICKET_STYLE_OPTIONS.map((styleOption) => {
                const selected = customization.ticketStyle === styleOption.id;

                return (
                  <TouchableOpacity
                    key={styleOption.id}
                    style={[
                      styles.styleCard,

                      selected && styles.styleCardActive,
                    ]}
                    onPress={() =>
                      updateCustomization({
                        ticketStyle: styleOption.id,
                      })
                    }
                    activeOpacity={0.85}
                  >
                    <View
                      style={[
                        styles.stylePreview,

                        styleOption.id === "classic" && styles.classicPreview,

                        styleOption.id === "minimal" && styles.minimalPreview,

                        styleOption.id === "vintage" && styles.vintagePreview,
                      ]}
                    >
                      <View
                        style={[
                          styles.previewLine,

                          styleOption.id === "minimal" &&
                            styles.previewLineMinimal,
                        ]}
                      />

                      <View style={styles.previewBlock} />

                      <View style={styles.previewBlockSmall} />
                    </View>

                    <View style={styles.styleCardText}>
                      <Text style={styles.styleCardTitle}>
                        {styleOption.label}
                      </Text>

                      <Text style={styles.styleCardDescription}>
                        {styleOption.description}
                      </Text>
                    </View>

                    {selected && (
                      <View style={styles.selectedBadge}>
                        <Ionicons name="checkmark" size={13} color="#FFFFFF" />
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* ACCENT COLOR */}

            <Text style={[styles.sectionLabel, styles.accentSectionLabel]}>
              ACCENT COLOR
            </Text>

            <View style={styles.accentRow}>
              {TICKET_ACCENT_OPTIONS.map((accent) => {
                const selected = customization.ticketAccent === accent.id;

                return (
                  <TouchableOpacity
                    key={accent.id}
                    style={styles.accentItem}
                    onPress={() =>
                      updateCustomization({
                        ticketAccent: accent.id,
                      })
                    }
                    activeOpacity={0.8}
                  >
                    <View
                      style={[
                        styles.accentCircle,

                        {
                          backgroundColor: accent.color,
                        },

                        selected && styles.accentCircleActive,
                      ]}
                    >
                      {selected && (
                        <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                      )}
                    </View>

                    <Text style={styles.accentLabel}>{accent.label}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* CONTENT VISIBILITY */}

            <Text style={[styles.sectionLabel, styles.contentSectionLabel]}>
              SHOW ON TICKET
            </Text>

            {renderToggle("Location", "showLocation")}

            {renderToggle("Date", "showDate")}

            {renderToggle("Description", "showDescription")}

            {renderToggle("Admission", "showAdmission")}

            {renderToggle("Ticket Number", "showTicketNumber")}

            {/* ACTION */}

            <TouchableOpacity
              style={[styles.doneButton, saving && styles.doneButtonDisabled]}
              onPress={onSave || onClose}
              disabled={saving}
              activeOpacity={0.85}
            >
              {saving ? (
                <Text style={styles.doneButtonText}>SAVING...</Text>
              ) : (
                <Text style={styles.doneButtonText}>
                  {onSave ? "SAVE CHANGES" : "DONE"}
                </Text>
              )}
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

export default TicketCustomizationSheet;

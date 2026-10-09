import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import { Text, TouchableOpacity, View } from "react-native";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import { Ionicons } from "@expo/vector-icons";
import styles from "./advancedSearchStyles";

const DEFAULT_FILTERS = {
  favoriteOnly: false,
  hasPhotos: false,
  dateRange: "all",
  tag: null,
  collectionId: null,
  searchIn: ["title", "description", "location", "tags", "category"],
};

const SEARCH_FIELDS = [
  { key: "title", label: "Title" },
  { key: "description", label: "Description" },
  { key: "location", label: "Location" },
  { key: "tags", label: "Tags" },
  { key: "category", label: "Category" },
];

const DATE_OPTIONS = [
  { key: "all", label: "All time" },
  { key: "7days", label: "Last 7 days" },
  { key: "30days", label: "Last 30 days" },
  { key: "90days", label: "Last 90 days" },
  { key: "year", label: "This year" },
];

const AdvancedSearch = forwardRef(function AdvancedSearch(
  {
    filters,
    onApply,
    onClose,
    availableTags = [],
    collections = [],
    theme,
    isDark,
  },
  ref,
) {
  const bottomSheetRef = useRef(null);
  const [draftFilters, setDraftFilters] = useState(DEFAULT_FILTERS);
  const snapPoints = useMemo(() => ["70%", "92%"], []);

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

  useImperativeHandle(
    ref,
    () => ({
      open: () => {
        setDraftFilters({
          ...DEFAULT_FILTERS,
          ...filters,
          searchIn:
            Array.isArray(filters?.searchIn) && filters.searchIn.length > 0
              ? [...filters.searchIn]
              : [...DEFAULT_FILTERS.searchIn],
        });

        bottomSheetRef.current?.present();
      },

      close: () => {
        bottomSheetRef.current?.dismiss();
      },
    }),
    [filters],
  );

  const renderBackdrop = useCallback(
    (props) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        opacity={0.35}
        pressBehavior="close"
      />
    ),
    [],
  );

  const handleSheetClose = useCallback(() => {
    onClose?.();
  }, [onClose]);

  const toggleSearchField = useCallback((field) => {
    setDraftFilters((current) => {
      const currentFields = Array.isArray(current.searchIn)
        ? current.searchIn
        : [];

      const exists = currentFields.includes(field);

      const nextFields = exists
        ? currentFields.filter((item) => item !== field)
        : [...currentFields, field];

      return {
        ...current,
        searchIn: nextFields,
      };
    });
  }, []);

  const toggleFavorite = useCallback(() => {
    setDraftFilters((current) => ({
      ...current,
      favoriteOnly: !current.favoriteOnly,
    }));
  }, []);

  const toggleHasPhotos = useCallback(() => {
    setDraftFilters((current) => ({
      ...current,
      hasPhotos: !current.hasPhotos,
    }));
  }, []);

  const handleDateRange = useCallback((dateRange) => {
    setDraftFilters((current) => ({
      ...current,
      dateRange,
    }));
  }, []);

  const handleTag = useCallback((tag) => {
    setDraftFilters((current) => ({
      ...current,
      tag: current.tag === tag ? null : tag,
    }));
  }, []);

  const handleCollection = useCallback((collectionId) => {
    setDraftFilters((current) => ({
      ...current,
      collectionId:
        String(current.collectionId) === String(collectionId)
          ? null
          : collectionId,
    }));
  }, []);

  const handleClear = useCallback(() => {
    const clearedFilters = {
      ...DEFAULT_FILTERS,
      searchIn: [...DEFAULT_FILTERS.searchIn],
    };

    setDraftFilters(clearedFilters);
    onApply(clearedFilters);
  }, [onApply]);

  const handleApply = useCallback(() => {
    onApply({
      ...draftFilters,
      searchIn: [...(draftFilters.searchIn || [])],
    });
  }, [draftFilters, onApply]);

  const sectionTitleStyle = [
    styles.sectionTitle,
    {
      color: colors.textSecondary,
    },
  ];

  const unselectedChipStyle = {
    backgroundColor: colors.background,
    borderColor: colors.border,
  };

  const selectedChipStyle = {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  };

  const selectedRowBackground = colors.background;
  return (
    <BottomSheetModal
      ref={bottomSheetRef}
      index={1}
      snapPoints={snapPoints}
      enableDynamicSizing={false}
      enablePanDownToClose
      backdropComponent={renderBackdrop}
      onDismiss={handleSheetClose}
      backgroundStyle={[
        styles.background,
        {
          backgroundColor: colors.surface,
        },
      ]}
      handleIndicatorStyle={[
        styles.handleIndicator,
        {
          backgroundColor: colors.border,
        },
      ]}
    >
      <View
        style={[
          styles.container,
          {
            backgroundColor: colors.surface,
          },
        ]}
      >
        {/* HEADER */}

        <View style={styles.header}>
          <View>
            <Text
              style={[
                styles.eyebrow,
                {
                  color: colors.accent,
                },
              ]}
            >
              REFINE YOUR SEARCH
            </Text>

            <Text
              style={[
                styles.title,
                {
                  color: colors.text,
                },
              ]}
            >
              Advanced Search
            </Text>
          </View>

          <TouchableOpacity
            style={[
              styles.closeButton,
              {
                backgroundColor: colors.background,
                borderColor: colors.border,
              },
            ]}
            onPress={() => bottomSheetRef.current?.dismiss()}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel="Close advanced search"
          >
            <Ionicons name="close" size={22} color={colors.text} />
          </TouchableOpacity>
        </View>

        {/* SCROLLABLE CONTENT */}

        <View
          style={[
            styles.scrollContainer,
            {
              backgroundColor: colors.surface,
            },
          ]}
        >
          <BottomSheetScrollView
            style={[
              styles.scrollView,
              {
                backgroundColor: colors.surface,
              },
            ]}
            contentContainerStyle={[
              styles.content,
              {
                backgroundColor: colors.surface,
              },
            ]}
            showsVerticalScrollIndicator
            nestedScrollEnabled
            bounces
          >
            {/* SEARCH IN */}

            <View style={styles.section}>
              <Text style={sectionTitleStyle}>SEARCH IN</Text>

              <View style={styles.optionGrid}>
                {SEARCH_FIELDS.map((field) => {
                  const selected = draftFilters.searchIn?.includes(field.key);

                  return (
                    <TouchableOpacity
                      key={field.key}
                      style={[
                        styles.optionChip,
                        selected && styles.optionChipActive,
                        selected ? selectedChipStyle : unselectedChipStyle,
                      ]}
                      onPress={() => toggleSearchField(field.key)}
                      activeOpacity={0.7}
                    >
                      {selected && (
                        <Ionicons name="checkmark" size={15} color="#FFFFFF" />
                      )}

                      <Text
                        style={[
                          styles.optionChipText,
                          selected && styles.optionChipTextActive,
                          {
                            color: selected ? "#FFFFFF" : colors.text,
                          },
                        ]}
                      >
                        {field.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* FILTERS */}

            <View style={styles.section}>
              <Text style={sectionTitleStyle}>FILTERS</Text>

              {/* FAVORITES ONLY */}

              <TouchableOpacity
                style={[
                  styles.rowOption,
                  draftFilters.favoriteOnly && styles.rowOptionActive,
                  {
                    backgroundColor: draftFilters.favoriteOnly
                      ? selectedRowBackground
                      : colors.surface,
                    borderColor: colors.border,
                  },
                ]}
                onPress={toggleFavorite}
                activeOpacity={0.7}
              >
                <View style={styles.rowOptionLeft}>
                  <Ionicons
                    name={draftFilters.favoriteOnly ? "heart" : "heart-outline"}
                    size={19}
                    color={colors.primary}
                  />

                  <Text
                    style={[
                      styles.rowOptionText,
                      {
                        color: colors.text,
                      },
                    ]}
                  >
                    Favorites only
                  </Text>
                </View>

                <Ionicons
                  name={
                    draftFilters.favoriteOnly
                      ? "checkmark-circle"
                      : "ellipse-outline"
                  }
                  size={21}
                  color={
                    draftFilters.favoriteOnly
                      ? colors.accent
                      : colors.textSecondary
                  }
                />
              </TouchableOpacity>

              {/* HAS PHOTOS */}

              <TouchableOpacity
                style={[
                  styles.rowOption,
                  draftFilters.hasPhotos && styles.rowOptionActive,
                  {
                    backgroundColor: draftFilters.hasPhotos
                      ? selectedRowBackground
                      : colors.surface,
                    borderColor: colors.border,
                  },
                ]}
                onPress={toggleHasPhotos}
                activeOpacity={0.7}
              >
                <View style={styles.rowOptionLeft}>
                  <Ionicons
                    name="images-outline"
                    size={19}
                    color={colors.primary}
                  />

                  <Text
                    style={[
                      styles.rowOptionText,
                      {
                        color: colors.text,
                      },
                    ]}
                  >
                    Has photos
                  </Text>
                </View>

                <Ionicons
                  name={
                    draftFilters.hasPhotos
                      ? "checkmark-circle"
                      : "ellipse-outline"
                  }
                  size={21}
                  color={
                    draftFilters.hasPhotos
                      ? colors.accent
                      : colors.textSecondary
                  }
                />
              </TouchableOpacity>
            </View>

            {/* DATE */}

            <View style={styles.section}>
              <Text style={sectionTitleStyle}>DATE</Text>

              <View style={styles.optionGrid}>
                {DATE_OPTIONS.map((option) => {
                  const selected = draftFilters.dateRange === option.key;

                  return (
                    <TouchableOpacity
                      key={option.key}
                      style={[
                        styles.optionChip,
                        selected && styles.optionChipActive,
                        selected ? selectedChipStyle : unselectedChipStyle,
                      ]}
                      onPress={() => handleDateRange(option.key)}
                      activeOpacity={0.7}
                    >
                      <Text
                        style={[
                          styles.optionChipText,
                          selected && styles.optionChipTextActive,
                          {
                            color: selected ? "#FFFFFF" : colors.text,
                          },
                        ]}
                      >
                        {option.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* TAGS */}

            <View style={styles.section}>
              <Text style={sectionTitleStyle}>TAGS</Text>

              {availableTags.length === 0 ? (
                <Text
                  style={[
                    styles.emptyText,
                    {
                      color: colors.textSecondary,
                    },
                  ]}
                >
                  No tags available yet.
                </Text>
              ) : (
                <View style={styles.optionGrid}>
                  {availableTags.map((tag) => {
                    const selected = draftFilters.tag === tag.name;

                    return (
                      <TouchableOpacity
                        key={tag.name}
                        style={[
                          styles.optionChip,
                          selected && styles.optionChipActive,
                          selected ? selectedChipStyle : unselectedChipStyle,
                        ]}
                        onPress={() => handleTag(tag.name)}
                        activeOpacity={0.7}
                      >
                        <Text
                          style={[
                            styles.optionChipText,
                            selected && styles.optionChipTextActive,
                            {
                              color: selected ? "#FFFFFF" : colors.text,
                            },
                          ]}
                        >
                          #{tag.name}
                        </Text>

                        <Text
                          style={[
                            styles.optionCount,
                            selected && styles.optionCountActive,
                            {
                              color: selected
                                ? "#FFFFFF"
                                : colors.textSecondary,
                            },
                          ]}
                        >
                          {tag.count}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              )}
            </View>

            {/* COLLECTIONS */}

            <View style={styles.section}>
              <Text style={sectionTitleStyle}>COLLECTION</Text>

              {collections.length === 0 ? (
                <Text
                  style={[
                    styles.emptyText,
                    {
                      color: colors.textSecondary,
                    },
                  ]}
                >
                  No collections available yet.
                </Text>
              ) : (
                <View style={styles.collectionList}>
                  {collections.map((collection) => {
                    const collectionId = collection?._id || collection?.id;

                    const selected =
                      String(draftFilters.collectionId) ===
                      String(collectionId);

                    const collectionName =
                      collection?.name ||
                      collection?.title ||
                      "Untitled collection";

                    return (
                      <TouchableOpacity
                        key={String(collectionId)}
                        style={[
                          styles.rowOption,
                          selected && styles.rowOptionActive,
                          {
                            backgroundColor: selected
                              ? selectedRowBackground
                              : colors.surface,
                            borderColor: colors.border,
                          },
                        ]}
                        onPress={() => handleCollection(collectionId)}
                        activeOpacity={0.7}
                      >
                        <View style={styles.rowOptionLeft}>
                          <Ionicons
                            name="albums-outline"
                            size={19}
                            color={colors.primary}
                          />

                          <Text
                            style={[
                              styles.rowOptionText,
                              {
                                color: colors.text,
                              },
                            ]}
                          >
                            {collectionName}
                          </Text>
                        </View>

                        <Ionicons
                          name={
                            selected ? "checkmark-circle" : "ellipse-outline"
                          }
                          size={21}
                          color={
                            selected ? colors.accent : colors.textSecondary
                          }
                        />
                      </TouchableOpacity>
                    );
                  })}
                </View>
              )}
            </View>
          </BottomSheetScrollView>
        </View>

        {/* ACTIONS */}

        <View
          style={[
            styles.actions,
            {
              backgroundColor: colors.surface,
              borderTopColor: colors.border,
            },
          ]}
        >
          <TouchableOpacity
            style={[
              styles.clearButton,
              {
                backgroundColor: colors.background,
                borderColor: colors.border,
              },
            ]}
            onPress={handleClear}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.clearButtonText,
                {
                  color: colors.primary,
                },
              ]}
            >
              CLEAR
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.applyButton,
              {
                backgroundColor: colors.primary,
              },
            ]}
            onPress={handleApply}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.applyButtonText,
                {
                  color: "#FFFFFF",
                },
              ]}
            >
              APPLY FILTERS
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </BottomSheetModal>
  );
});

export default React.memo(AdvancedSearch);

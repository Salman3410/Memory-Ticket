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
  {
    key: "title",
    label: "Title",
  },
  {
    key: "description",
    label: "Description",
  },
  {
    key: "location",
    label: "Location",
  },
  {
    key: "tags",
    label: "Tags",
  },
  {
    key: "category",
    label: "Category",
  },
];

const DATE_OPTIONS = [
  {
    key: "all",
    label: "All time",
  },
  {
    key: "7days",
    label: "Last 7 days",
  },
  {
    key: "30days",
    label: "Last 30 days",
  },
  {
    key: "90days",
    label: "Last 90 days",
  },
  {
    key: "year",
    label: "This year",
  },
];

const AdvancedSearch = forwardRef(function AdvancedSearch(
  { filters, onApply, onClose, availableTags = [], collections = [] },
  ref,
) {
  const bottomSheetRef = useRef(null);

  const [draftFilters, setDraftFilters] = useState(DEFAULT_FILTERS);

  const snapPoints = useMemo(() => ["70%", "92%"], []);

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

  // ------------------------------------------
  // BACKDROP
  // ------------------------------------------

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

  // ------------------------------------------
  // CLOSE
  // ------------------------------------------

  const handleSheetClose = useCallback(() => {
    onClose?.();
  }, [onClose]);

  // ------------------------------------------
  // SEARCH FIELD
  // ------------------------------------------

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

  // ------------------------------------------
  // FAVORITES
  // ------------------------------------------

  const toggleFavorite = useCallback(() => {
    setDraftFilters((current) => ({
      ...current,
      favoriteOnly: !current.favoriteOnly,
    }));
  }, []);

  // ------------------------------------------
  // HAS PHOTOS
  // ------------------------------------------

  const toggleHasPhotos = useCallback(() => {
    setDraftFilters((current) => ({
      ...current,
      hasPhotos: !current.hasPhotos,
    }));
  }, []);

  // ------------------------------------------
  // DATE
  // ------------------------------------------

  const handleDateRange = useCallback((dateRange) => {
    setDraftFilters((current) => ({
      ...current,
      dateRange,
    }));
  }, []);

  // ------------------------------------------
  // TAG
  // ------------------------------------------

  const handleTag = useCallback((tag) => {
    setDraftFilters((current) => ({
      ...current,
      tag: current.tag === tag ? null : tag,
    }));
  }, []);

  // ------------------------------------------
  // COLLECTION
  // ------------------------------------------

  const handleCollection = useCallback((collectionId) => {
    setDraftFilters((current) => ({
      ...current,
      collectionId:
        String(current.collectionId) === String(collectionId)
          ? null
          : collectionId,
    }));
  }, []);

  // ------------------------------------------
  // CLEAR
  // ------------------------------------------

  const handleClear = useCallback(() => {
    const clearedFilters = {
      ...DEFAULT_FILTERS,
      searchIn: [...DEFAULT_FILTERS.searchIn],
    };

    setDraftFilters(clearedFilters);
    onApply(clearedFilters);
  }, [onApply]);

  // ------------------------------------------
  // APPLY
  // ------------------------------------------

  const handleApply = useCallback(() => {
    onApply({
      ...draftFilters,
      searchIn: [...(draftFilters.searchIn || [])],
    });
  }, [draftFilters, onApply]);

  return (
    <BottomSheetModal
      ref={bottomSheetRef}
      index={1}
      snapPoints={snapPoints}
      enableDynamicSizing={false}
      enablePanDownToClose
      backdropComponent={renderBackdrop}
      onDismiss={handleSheetClose}
      backgroundStyle={styles.background}
      handleIndicatorStyle={styles.handleIndicator}
    >
      <View style={styles.container}>
        {/* HEADER */}
        <View style={styles.header}>
          <View>
            <Text style={styles.eyebrow}>REFINE YOUR SEARCH</Text>

            <Text style={styles.title}>Advanced Search</Text>
          </View>

          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => bottomSheetRef.current?.dismiss()}
            activeOpacity={0.7}
          >
            <Ionicons name="close" size={22} color="#34345C" />
          </TouchableOpacity>
        </View>

        {/* SCROLLABLE CONTENT */}
        <View style={styles.scrollContainer}>
          <BottomSheetScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={true}
            nestedScrollEnabled={true}
            bounces={true}
          >
            {/* SEARCH IN */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>SEARCH IN</Text>

              <View style={styles.optionGrid}>
                {SEARCH_FIELDS.map((field) => {
                  const selected = draftFilters.searchIn?.includes(field.key);

                  return (
                    <TouchableOpacity
                      key={field.key}
                      style={[
                        styles.optionChip,
                        selected && styles.optionChipActive,
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
              <Text style={styles.sectionTitle}>FILTERS</Text>

              <TouchableOpacity
                style={[
                  styles.rowOption,
                  draftFilters.favoriteOnly && styles.rowOptionActive,
                ]}
                onPress={toggleFavorite}
                activeOpacity={0.7}
              >
                <View style={styles.rowOptionLeft}>
                  <Ionicons
                    name={draftFilters.favoriteOnly ? "heart" : "heart-outline"}
                    size={19}
                    color="#34345C"
                  />

                  <Text style={styles.rowOptionText}>Favorites only</Text>
                </View>

                <Ionicons
                  name={
                    draftFilters.favoriteOnly
                      ? "checkmark-circle"
                      : "ellipse-outline"
                  }
                  size={21}
                  color="#34345C"
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.rowOption,
                  draftFilters.hasPhotos && styles.rowOptionActive,
                ]}
                onPress={toggleHasPhotos}
                activeOpacity={0.7}
              >
                <View style={styles.rowOptionLeft}>
                  <Ionicons name="images-outline" size={19} color="#34345C" />

                  <Text style={styles.rowOptionText}>Has photos</Text>
                </View>

                <Ionicons
                  name={
                    draftFilters.hasPhotos
                      ? "checkmark-circle"
                      : "ellipse-outline"
                  }
                  size={21}
                  color="#34345C"
                />
              </TouchableOpacity>
            </View>

            {/* DATE */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>DATE</Text>

              <View style={styles.optionGrid}>
                {DATE_OPTIONS.map((option) => {
                  const selected = draftFilters.dateRange === option.key;

                  return (
                    <TouchableOpacity
                      key={option.key}
                      style={[
                        styles.optionChip,
                        selected && styles.optionChipActive,
                      ]}
                      onPress={() => handleDateRange(option.key)}
                      activeOpacity={0.7}
                    >
                      <Text
                        style={[
                          styles.optionChipText,
                          selected && styles.optionChipTextActive,
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
              <Text style={styles.sectionTitle}>TAGS</Text>

              {availableTags.length === 0 ? (
                <Text style={styles.emptyText}>No tags available yet.</Text>
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
                        ]}
                        onPress={() => handleTag(tag.name)}
                        activeOpacity={0.7}
                      >
                        <Text
                          style={[
                            styles.optionChipText,
                            selected && styles.optionChipTextActive,
                          ]}
                        >
                          #{tag.name}
                        </Text>

                        <Text
                          style={[
                            styles.optionCount,
                            selected && styles.optionCountActive,
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

            {/* COLLECTION */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>COLLECTION</Text>

              {collections.length === 0 ? (
                <Text style={styles.emptyText}>
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
                        ]}
                        onPress={() => handleCollection(collectionId)}
                        activeOpacity={0.7}
                      >
                        <View style={styles.rowOptionLeft}>
                          <Ionicons
                            name="albums-outline"
                            size={19}
                            color="#34345C"
                          />

                          <Text style={styles.rowOptionText}>
                            {collectionName}
                          </Text>
                        </View>

                        <Ionicons
                          name={
                            selected ? "checkmark-circle" : "ellipse-outline"
                          }
                          size={21}
                          color="#34345C"
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
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.clearButton}
            onPress={handleClear}
            activeOpacity={0.7}
          >
            <Text style={styles.clearButtonText}>CLEAR</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.applyButton}
            onPress={handleApply}
            activeOpacity={0.8}
          >
            <Text style={styles.applyButtonText}>APPLY FILTERS</Text>
          </TouchableOpacity>
        </View>
      </View>
    </BottomSheetModal>
  );
});

export default React.memo(AdvancedSearch);

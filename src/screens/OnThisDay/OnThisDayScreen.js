import React, { useCallback, useMemo, useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  Text,
  TouchableOpacity,
  View,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useMemory } from "../../hooks/useMemory";
import MemoryTicket from "../../components/MemoryTicket/MemoryTicket";
import { styles } from "./onThisDayStyles";
import { useTheme } from "../../context/ThemeContext";

const SCREEN_WIDTH = Dimensions.get("window").width;
const MAX_MEMORIES = 10;

function getMemoryDate(memory) {
  return memory?.date || memory?.createdAt || null;
}

function getTimestamp(memory) {
  const value = getMemoryDate(memory);

  if (!value) {
    return 0;
  }
  const timestamp = new Date(value).getTime();
  return Number.isNaN(timestamp) ? 0 : timestamp;
}

function getOnThisDayMemories(memories) {
  const today = new Date();

  const targetMonth = today.getMonth();

  const targetDay = today.getDate();

  const currentYear = today.getFullYear();

  return memories
    .filter((memory) => {
      const value = getMemoryDate(memory);

      if (!value) {
        return false;
      }

      const date = new Date(value);

      if (Number.isNaN(date.getTime())) {
        return false;
      }

      return (
        date.getMonth() === targetMonth &&
        date.getDate() === targetDay &&
        date.getFullYear() < currentYear
      );
    })
    .sort((a, b) => {
      return getTimestamp(b) - getTimestamp(a);
    })
    .slice(0, MAX_MEMORIES);
}

function formatDate() {
  const today = new Date();

  return today.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
  });
}

function OnThisDayScreen({ navigation }) {
  const { theme, isDark } = useTheme();
  const colors = theme?.colors || {};
  const screenBackground = colors.background || (isDark ? "#171624" : "#F1F0F6");
  const surfaceColor = colors.surface || (isDark ? "#211F30" : "#FFFFFF");
  const textColor = colors.text || (isDark ? "#F7F5FC" : "#242424");
  const secondaryTextColor = colors.textSecondary || colors.textMuted || (isDark ? "#C4C0D0" : "#707080");
  const borderColor = colors.border || (isDark ? "#39364D" : "#D9D8E2");

  const { memories = [] } = useMemory();

  const [currentIndex, setCurrentIndex] = useState(0);

  const flatListRef = useRef(null);

  const onThisDayMemories = useMemo(() => {
    return getOnThisDayMemories(memories);
  }, [memories]);

  const targetDate = useMemo(() => {
    return formatDate();
  }, []);

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 60,
  }).current;

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    const firstVisible = viewableItems?.[0];

    if (firstVisible?.index !== undefined && firstVisible?.index !== null) {
      setCurrentIndex(firstVisible.index);
    }
  }).current;

  const openMemory = useCallback(
    (memory) => {
      if (!memory?.id) {
        return;
      }

      navigation.navigate("MemoryDetails", {
        memoryId: memory.id,
      });
    },
    [navigation],
  );

  const renderItem = useCallback(
    ({ item }) => {
      const image = item?.images?.[0] || item?.image || null;

      return (
        <View style={[styles.ticketPage, { backgroundColor: screenBackground }]}>
          <TouchableOpacity
            activeOpacity={0.95}
            onPress={() => openMemory(item)}
          >
            <MemoryTicket memory={item} image={image} singleMode />
          </TouchableOpacity>
        </View>
      );
    },
    [openMemory, screenBackground],
  );

  const keyExtractor = useCallback((item, index) => {
    return (
      item?.id || item?._id || item?.clientMemoryId || `on-this-day-${index}`
    );
  }, []);

  if (!onThisDayMemories.length) {
    return (
      <View style={[styles.container, { backgroundColor: screenBackground }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={screenBackground} />
        <View style={[styles.header, { backgroundColor: screenBackground }]}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => navigation.goBack()}
            style={[styles.backButton, { backgroundColor: surfaceColor, borderColor }]}
          >
            <Ionicons name="chevron-back" size={22} color={colors.primary || "#34345C"} />
          </TouchableOpacity>

          <Text style={[styles.headerTitle, { color: textColor }]}>ON THIS DAY</Text>

          <View style={styles.headerSpacer} />
        </View>

        <View style={[styles.emptyContainer, { backgroundColor: screenBackground }]}>
          <View style={[styles.emptyTicket, { backgroundColor: surfaceColor, borderColor }]}>
            <View style={styles.emptyIcon}>
              <Ionicons name="time-outline" size={28} color={colors.primary || "#34345C"} />
            </View>

            <Text style={[styles.emptyTitle, { color: textColor }]}>Nothing from this day</Text>

            <Text style={[styles.emptyText, { color: secondaryTextColor }]}>
              You don't have any memories from {targetDate} in previous years.
            </Text>

            <Text style={[styles.emptyHint, { color: secondaryTextColor }]}>
              Maybe today will become a memory worth keeping.
            </Text>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: screenBackground }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={screenBackground} />

      <View style={[styles.header, { backgroundColor: screenBackground }]}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => navigation.goBack()}
          style={[styles.backButton, { backgroundColor: surfaceColor, borderColor }]}
        >
          <Ionicons name="chevron-back" size={22} color={colors.primary || "#34345C"} />
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Text style={[styles.headerTitle, { color: textColor }]}>ON THIS DAY</Text>

          <Text style={[styles.headerDate, { color: secondaryTextColor }]}>{targetDate}</Text>
        </View>

        <View style={styles.headerSpacer} />
      </View>

      <View style={[styles.subtitleWrapper, { backgroundColor: surfaceColor, borderColor }]}>
        <Text style={[styles.subtitle, { color: textColor }]}>
          {onThisDayMemories.length}{" "}
          {onThisDayMemories.length === 1 ? "memory" : "memories"} from this day
          in previous years
        </Text>
      </View>

      <FlatList
        ref={flatListRef}
        data={onThisDayMemories}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        snapToInterval={SCREEN_WIDTH}
        decelerationRate="fast"
        initialNumToRender={1}
        maxToRenderPerBatch={2}
        windowSize={3}
        removeClippedSubviews
        getItemLayout={(_, index) => ({
          length: SCREEN_WIDTH,
          offset: SCREEN_WIDTH * index,
          index,
        })}
        viewabilityConfig={viewabilityConfig}
        onViewableItemsChanged={onViewableItemsChanged}
        contentContainerStyle={styles.ticketListContent}
      />

      <View style={[styles.bottomInfo, { color: secondaryTextColor }]}>
        <View style={[styles.positionBadge, { backgroundColor: surfaceColor, borderColor }]}>
          <Text style={[styles.positionText, { color: secondaryTextColor }]}>
            {currentIndex + 1} / {onThisDayMemories.length}
          </Text>
        </View>

        {onThisDayMemories.length > 1 && (
          <Text style={[styles.swipeHint, { color: secondaryTextColor }]}>Swipe to rediscover memories</Text>
        )}
      </View>
    </View>
  );
}

export default React.memo(OnThisDayScreen);

import React, { useCallback, useMemo, useRef, useState } from "react";

import {
  Dimensions,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { useMemory } from "../../hooks/useMemory";

import MemoryTicket from "../../components/MemoryTicket/MemoryTicket";

import { styles } from "./onThisDayStyles";

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

  const targetYear = today.getFullYear() - 1;
  const targetMonth = today.getMonth();
  const targetDay = today.getDate();

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
        date.getFullYear() === targetYear &&
        date.getMonth() === targetMonth &&
        date.getDate() === targetDay
      );
    })
    .sort((a, b) => {
      return getTimestamp(b) - getTimestamp(a);
    })
    .slice(0, MAX_MEMORIES);
}

function formatDate() {
  const today = new Date();

  const targetDate = new Date(
    today.getFullYear() - 1,
    today.getMonth(),
    today.getDate(),
  );

  return targetDate.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function OnThisDayScreen({ navigation }) {
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
        <View style={styles.ticketPage}>
          <TouchableOpacity
            activeOpacity={0.95}
            onPress={() => openMemory(item)}
          >
            <MemoryTicket memory={item} image={image} singleMode />
          </TouchableOpacity>
        </View>
      );
    },
    [openMemory],
  );

  const keyExtractor = useCallback((item, index) => {
    return (
      item?.id || item?._id || item?.clientMemoryId || `on-this-day-${index}`
    );
  }, []);

  if (!onThisDayMemories.length) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Ionicons name="chevron-back" size={22} color="#34345C" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>ON THIS DAY</Text>

          <View style={styles.headerSpacer} />
        </View>

        <View style={styles.emptyContainer}>
          <View style={styles.emptyTicket}>
            <View style={styles.emptyIcon}>
              <Ionicons name="time-outline" size={28} color="#34345C" />
            </View>

            <Text style={styles.emptyTitle}>Nothing from one year ago</Text>

            <Text style={styles.emptyText}>
              You don't have a memory from {targetDate}.
            </Text>

            <Text style={styles.emptyHint}>
              Maybe today will become a memory worth keeping.
            </Text>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={22} color="#34345C" />
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>ON THIS DAY</Text>

          <Text style={styles.headerDate}>{targetDate}</Text>
        </View>

        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.subtitleWrapper}>
        <Text style={styles.subtitle}>
          {onThisDayMemories.length}{" "}
          {onThisDayMemories.length === 1 ? "memory" : "memories"} from one year
          ago
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

      <View style={styles.bottomInfo}>
        <View style={styles.positionBadge}>
          <Text style={styles.positionText}>
            {currentIndex + 1} / {onThisDayMemories.length}
          </Text>
        </View>

        {onThisDayMemories.length > 1 && (
          <Text style={styles.swipeHint}>
            Swipe to rediscover more memories
          </Text>
        )}
      </View>
    </View>
  );
}

export default React.memo(OnThisDayScreen);

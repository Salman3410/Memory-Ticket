import { useMemo } from "react";

import { useMemory } from "./useMemory";
import { useCollection } from "./useCollection";

function getMemoryDate(memory) {
  return memory?.createdAt || memory?.date || null;
}

function getMemoryTimestamp(memory) {
  const value = getMemoryDate(memory);

  if (!value) {
    return 0;
  }

  const timestamp = new Date(value).getTime();

  return Number.isNaN(timestamp) ? 0 : timestamp;
}

function getMemoryPhotoCount(memory) {
  if (Array.isArray(memory?.images) && memory.images.length > 0) {
    return memory.images.length;
  }

  return memory?.image ? 1 : 0;
}

function getPlaceName(memory) {
  return (
    memory?.locationData?.city ||
    memory?.locationData?.name ||
    memory?.location ||
    null
  );
}

function createMonthlyActivity(memories) {
  const now = new Date();
  const months = [];

  for (let i = 5; i >= 0; i -= 1) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);

    months.push({
      year: date.getFullYear(),
      month: date.getMonth(),
      label: date.toLocaleDateString("en-US", {
        month: "short",
      }),
      count: 0,
    });
  }

  memories.forEach((memory) => {
    const value = getMemoryDate(memory);

    if (!value) {
      return;
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return;
    }

    const month = months.find(
      (item) =>
        item.year === date.getFullYear() && item.month === date.getMonth(),
    );

    if (month) {
      month.count += 1;
    }
  });

  return months;
}

export default function useDashboard() {
  const { memories = [], loading: memoriesLoading = false } = useMemory();

  const { collections = [], loading: collectionsLoading = false } =
    useCollection();

  const stats = useMemo(() => {
    const totalMemories = memories.length;

    const totalPhotos = memories.reduce((total, memory) => {
      return total + getMemoryPhotoCount(memory);
    }, 0);

    const uniquePlaces = new Set();

    memories.forEach((memory) => {
      const place = getPlaceName(memory);

      if (place) {
        uniquePlaces.add(place.trim());
      }
    });

    const totalPlaces = uniquePlaces.size;

    const totalFavorites = memories.filter(
      (memory) => memory?.favorite === true,
    ).length;

    return {
      totalMemories,
      totalPhotos,
      totalPlaces,
      totalFavorites,
      totalCollections: collections.length,
    };
  }, [memories, collections]);

  const recentMemories = useMemo(() => {
    return [...memories]
      .sort((a, b) => getMemoryTimestamp(b) - getMemoryTimestamp(a))
      .slice(0, 4);
  }, [memories]);

  const favoriteMemories = useMemo(() => {
    return memories
      .filter((memory) => memory?.favorite === true)
      .sort((a, b) => getMemoryTimestamp(b) - getMemoryTimestamp(a))
      .slice(0, 4);
  }, [memories]);

  const recentCollections = useMemo(() => {
    return [...collections].slice(0, 4);
  }, [collections]);

  const places = useMemo(() => {
    const placeMap = new Map();

    memories.forEach((memory) => {
      const placeName = getPlaceName(memory);

      if (!placeName) {
        return;
      }

      const cleanName = placeName.trim();

      if (!cleanName) {
        return;
      }

      if (!placeMap.has(cleanName)) {
        placeMap.set(cleanName, 0);
      }

      placeMap.set(cleanName, placeMap.get(cleanName) + 1);
    });

    return [...placeMap.entries()]
      .map(([name, count]) => ({
        name,
        count,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 4);
  }, [memories]);

  const onThisDay = useMemo(() => {
    const today = new Date();

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
          date.getDate() === today.getDate() &&
          date.getMonth() === today.getMonth() &&
          date.getFullYear() !== today.getFullYear()
        );
      })
      .sort((a, b) => getMemoryTimestamp(b) - getMemoryTimestamp(a));
  }, [memories]);

  const monthlyActivity = useMemo(() => {
    return createMonthlyActivity(memories);
  }, [memories]);

  const thisMonthCount = useMemo(() => {
    return monthlyActivity[monthlyActivity.length - 1]?.count || 0;
  }, [monthlyActivity]);

  const mostActiveMonth = useMemo(() => {
    return monthlyActivity.reduce(
      (highest, current) => {
        if (current.count > highest.count) {
          return current;
        }

        return highest;
      },
      {
        count: 0,
        label: "",
      },
    );
  }, [monthlyActivity]);

  const featuredMemory = useMemo(() => {
    if (!memories.length) {
      return null;
    }

    return [...memories]
      .sort((a, b) => {
        const photoDifference = getMemoryPhotoCount(b) - getMemoryPhotoCount(a);

        if (photoDifference !== 0) {
          return photoDifference;
        }

        return getMemoryTimestamp(b) - getMemoryTimestamp(a);
      })
      .slice(0, 1)[0];
  }, [memories]);

  return {
    stats,
    recentMemories,
    favoriteMemories,
    recentCollections,
    places,
    onThisDay,
    monthlyActivity,
    thisMonthCount,
    mostActiveMonth,
    featuredMemory,
    loading: memoriesLoading || collectionsLoading,
  };
}

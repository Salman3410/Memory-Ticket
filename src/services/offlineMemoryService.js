import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from "expo-file-system/legacy";

const PENDING_MEMORIES_KEY =
  "@memory_ticket_pending_memories";

const LOCAL_MEMORIES_KEY =
  "@memory_ticket_local_memories";

const OFFLINE_IMAGES_DIRECTORY =
  `${FileSystem.documentDirectory}memory-ticket-offline/`;

const ensureOfflineDirectory = async () => {
  const directoryInfo =
    await FileSystem.getInfoAsync(
      OFFLINE_IMAGES_DIRECTORY,
    );

  if (!directoryInfo.exists) {
    await FileSystem.makeDirectoryAsync(
      OFFLINE_IMAGES_DIRECTORY,
      {
        intermediates: true,
      },
    );
  }
};

export const generateClientMemoryId = () => {
  return `memory-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 10)}`;
};

const getFileName = (uri, index) => {
  const fallbackName =
    `image-${Date.now()}-${index}.jpg`;

  if (!uri || typeof uri !== "string") {
    return fallbackName;
  }

  const name = uri.split("/").pop();

  if (!name) {
    return fallbackName;
  }

  return name.split("?")[0] || fallbackName;
};

export const persistImage = async (
  uri,
  clientMemoryId,
  index,
) => {
  if (!uri) {
    throw new Error(
      "Image URI is required.",
    );
  }

  await ensureOfflineDirectory();

  const originalName = getFileName(
    uri,
    index,
  );

  const safeName =
    `${clientMemoryId}-${index}-${originalName}`;

  const destination =
    `${OFFLINE_IMAGES_DIRECTORY}${safeName}`;

  // Don't copy if already present.
  const existing =
    await FileSystem.getInfoAsync(destination);

  if (existing.exists) {
    return destination;
  }

  await FileSystem.copyAsync({
    from: uri,
    to: destination,
  });

  return destination;
};

export const persistMemoryImages = async (
  memory,
) => {
  const clientMemoryId =
    memory.clientMemoryId ||
    generateClientMemoryId();

  const images = Array.isArray(
    memory.images,
  )
    ? memory.images
    : memory.image
      ? [memory.image]
      : [];

  if (images.length === 0) {
    throw new Error(
      "At least one image is required.",
    );
  }

  const localImages = [];

  for (
    let index = 0;
    index < Math.min(images.length, 5);
    index += 1
  ) {
    const uri = images[index];

    // Already a persistent local copy.
    if (
      typeof uri === "string" &&
      uri.startsWith(
        OFFLINE_IMAGES_DIRECTORY,
      )
    ) {
      localImages.push(uri);
      continue;
    }

    const localUri =
      await persistImage(
        uri,
        clientMemoryId,
        index,
      );

    localImages.push(localUri);
  }

  return {
    clientMemoryId,
    localImages,
  };
};

export const getPendingMemories = async () => {
  try {
    const raw =
      await AsyncStorage.getItem(
        PENDING_MEMORIES_KEY,
      );

    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw);

    return Array.isArray(parsed)
      ? parsed
      : [];
  } catch (error) {
    console.error(
      "Get pending memories error:",
      error,
    );

    return [];
  }
};

export const savePendingMemories = async (
  memories,
) => {
  await AsyncStorage.setItem(
    PENDING_MEMORIES_KEY,
    JSON.stringify(memories),
  );
};

export const addPendingMemory = async (
  memory,
) => {
  const current =
    await getPendingMemories();

  const exists = current.some(
    (item) =>
      item.clientMemoryId ===
      memory.clientMemoryId,
  );

  if (!exists) {
    current.push(memory);
  }

  await savePendingMemories(current);

  return memory;
};

export const removePendingMemory = async (
  clientMemoryId,
) => {
  const current =
    await getPendingMemories();

  const remaining = current.filter(
    (memory) =>
      memory.clientMemoryId !==
      clientMemoryId,
  );

  await savePendingMemories(remaining);
};

export const getLocalMemories = async () => {
  try {
    const raw =
      await AsyncStorage.getItem(
        LOCAL_MEMORIES_KEY,
      );

    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw);

    return Array.isArray(parsed)
      ? parsed
      : [];
  } catch (error) {
    console.error(
      "Get local memories error:",
      error,
    );

    return [];
  }
};

export const saveLocalMemories = async (
  memories,
) => {
  await AsyncStorage.setItem(
    LOCAL_MEMORIES_KEY,
    JSON.stringify(memories),
  );
};

export const upsertLocalMemory = async (
  memory,
) => {
  const current =
    await getLocalMemories();

  const index = current.findIndex(
    (item) => {
      if (
        memory.clientMemoryId &&
        item.clientMemoryId
      ) {
        return (
          item.clientMemoryId ===
          memory.clientMemoryId
        );
      }

      return item.id === memory.id;
    },
  );

  if (index >= 0) {
    current[index] = {
      ...current[index],
      ...memory,
    };
  } else {
    current.unshift(memory);
  }

  await saveLocalMemories(current);

  return memory;
};

export const removeLocalMemory = async (
  memoryId,
  clientMemoryId = null,
) => {
  const current =
    await getLocalMemories();

  const remaining = current.filter(
    (memory) => {
      if (
        clientMemoryId &&
        memory.clientMemoryId
      ) {
        return (
          memory.clientMemoryId !==
          clientMemoryId
        );
      }

      return memory.id !== memoryId;
    },
  );

  await saveLocalMemories(remaining);
};

export const getOfflineMemories = async () => {
  const local =
    await getLocalMemories();

  const pending =
    await getPendingMemories();

  const combined = [
    ...pending,
    ...local,
  ];

  const unique = [];
  const seen = new Set();

  for (const memory of combined) {
    const key =
      memory.clientMemoryId ||
      memory.id;

    if (!key || seen.has(key)) {
      continue;
    }

    seen.add(key);
    unique.push(memory);
  }

  return unique;
};

// --------------------------------------------------
// CLEAR LOCAL MEMORY CACHE
// --------------------------------------------------

export const clearLocalMemories = async () => {
  await AsyncStorage.removeItem(
    LOCAL_MEMORIES_KEY,
  );
};
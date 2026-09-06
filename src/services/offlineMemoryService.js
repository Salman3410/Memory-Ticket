import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from "expo-file-system/legacy";

// --------------------------------------------------
// STORAGE KEYS
// --------------------------------------------------

const PENDING_MEMORIES_KEY =
  "@memory_ticket_pending_memories";

const LOCAL_MEMORIES_KEY =
  "@memory_ticket_local_memories";

const OFFLINE_IMAGES_DIRECTORY =
  `${FileSystem.documentDirectory}memory-ticket-offline/`;

// --------------------------------------------------
// IN-MEMORY CACHE
// --------------------------------------------------

let pendingMemoriesCache = null;
let localMemoriesCache = null;

let offlineDirectoryPromise = null;

// --------------------------------------------------
// ENSURE OFFLINE IMAGE DIRECTORY
// --------------------------------------------------

const ensureOfflineDirectory = async () => {
  if (!offlineDirectoryPromise) {
    offlineDirectoryPromise = (async () => {
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
    })();
  }

  return offlineDirectoryPromise;
};

// --------------------------------------------------
// GENERATE CLIENT MEMORY ID
// --------------------------------------------------

export const generateClientMemoryId = () => {
  return `memory-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 10)}`;
};

// --------------------------------------------------
// GET FILE NAME
// --------------------------------------------------

const getFileName = (uri, index) => {
  const fallbackName =
    `image-${Date.now()}-${index}.jpg`;

  if (!uri || typeof uri !== "string") {
    return fallbackName;
  }

  const name = uri.split("/").pop();

  return (
    name?.split("?")[0] ||
    fallbackName
  );
};

// --------------------------------------------------
// PERSIST ONE IMAGE
// --------------------------------------------------

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

  const originalName =
    getFileName(uri, index);

  const safeName =
    `${clientMemoryId}-${index}-${originalName}`;

  const destination =
    `${OFFLINE_IMAGES_DIRECTORY}${safeName}`;

  const existing =
    await FileSystem.getInfoAsync(
      destination,
    );

  if (existing.exists) {
    return destination;
  }

  await FileSystem.copyAsync({
    from: uri,
    to: destination,
  });

  return destination;
};

// --------------------------------------------------
// PERSIST ALL MEMORY IMAGES
// --------------------------------------------------

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

  const limitedImages =
    images.slice(0, 5);

  // Copy all images in parallel.
  const localImages =
    await Promise.all(
      limitedImages.map(
        (uri, index) =>
          typeof uri === "string" &&
          uri.startsWith(
            OFFLINE_IMAGES_DIRECTORY,
          )
            ? Promise.resolve(uri)
            : persistImage(
                uri,
                clientMemoryId,
                index,
              ),
      ),
    );

  return {
    clientMemoryId,
    localImages,
  };
};

// --------------------------------------------------
// GET PENDING MEMORIES
// --------------------------------------------------

export const getPendingMemories =
  async () => {
    if (pendingMemoriesCache) {
      return pendingMemoriesCache;
    }

    try {
      const raw =
        await AsyncStorage.getItem(
          PENDING_MEMORIES_KEY,
        );

      if (!raw) {
        pendingMemoriesCache = [];
        return pendingMemoriesCache;
      }

      const parsed =
        JSON.parse(raw);

      pendingMemoriesCache =
        Array.isArray(parsed)
          ? parsed
          : [];

      return pendingMemoriesCache;
    } catch (error) {
      console.error(
        "Get pending memories error:",
        error,
      );

      pendingMemoriesCache = [];

      return pendingMemoriesCache;
    }
  };

// --------------------------------------------------
// SAVE PENDING MEMORIES
// --------------------------------------------------

export const savePendingMemories =
  async (memories) => {
    pendingMemoriesCache =
      Array.isArray(memories)
        ? memories
        : [];

    await AsyncStorage.setItem(
      PENDING_MEMORIES_KEY,
      JSON.stringify(
        pendingMemoriesCache,
      ),
    );

    return pendingMemoriesCache;
  };

// --------------------------------------------------
// ADD PENDING MEMORY
// --------------------------------------------------

export const addPendingMemory =
  async (memory) => {
    const current =
      await getPendingMemories();

    const index =
      current.findIndex(
        (item) =>
          item.clientMemoryId ===
          memory.clientMemoryId,
      );

    if (index >= 0) {
      current[index] = {
        ...current[index],
        ...memory,
      };
    } else {
      current.unshift(memory);
    }

    return savePendingMemories(
      current,
    );
  };

// --------------------------------------------------
// REMOVE PENDING MEMORY
// --------------------------------------------------

export const removePendingMemory =
  async (clientMemoryId) => {
    const current =
      await getPendingMemories();

    const remaining =
      current.filter(
        (memory) =>
          memory.clientMemoryId !==
          clientMemoryId,
      );

    return savePendingMemories(
      remaining,
    );
  };

// --------------------------------------------------
// GET LOCAL MEMORIES
// --------------------------------------------------

export const getLocalMemories =
  async () => {
    if (localMemoriesCache) {
      return localMemoriesCache;
    }

    try {
      const raw =
        await AsyncStorage.getItem(
          LOCAL_MEMORIES_KEY,
        );

      if (!raw) {
        localMemoriesCache = [];
        return localMemoriesCache;
      }

      const parsed =
        JSON.parse(raw);

      localMemoriesCache =
        Array.isArray(parsed)
          ? parsed
          : [];

      return localMemoriesCache;
    } catch (error) {
      console.error(
        "Get local memories error:",
        error,
      );

      localMemoriesCache = [];

      return localMemoriesCache;
    }
  };

// --------------------------------------------------
// SAVE LOCAL MEMORIES
// --------------------------------------------------

export const saveLocalMemories =
  async (memories) => {
    localMemoriesCache =
      Array.isArray(memories)
        ? memories
        : [];

    await AsyncStorage.setItem(
      LOCAL_MEMORIES_KEY,
      JSON.stringify(
        localMemoriesCache,
      ),
    );

    return localMemoriesCache;
  };

// --------------------------------------------------
// UPSERT LOCAL MEMORY
// --------------------------------------------------

export const upsertLocalMemory =
  async (memory) => {
    const current =
      await getLocalMemories();

    const index =
      current.findIndex(
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

          return (
            item.id === memory.id
          );
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

    return saveLocalMemories(
      current,
    );
  };

// --------------------------------------------------
// REMOVE LOCAL MEMORY
// --------------------------------------------------

export const removeLocalMemory =
  async (
    memoryId,
    clientMemoryId = null,
  ) => {
    const current =
      await getLocalMemories();

    const remaining =
      current.filter(
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

          return (
            memory.id !==
            memoryId
          );
        },
      );

    return saveLocalMemories(
      remaining,
    );
  };

// --------------------------------------------------
// CLEAR LOCAL MEMORY CACHE
// --------------------------------------------------

export const clearLocalMemories =
  async () => {
    localMemoriesCache = [];

    await AsyncStorage.removeItem(
      LOCAL_MEMORIES_KEY,
    );
  };

// --------------------------------------------------
// GET OFFLINE MEMORIES
// --------------------------------------------------

export const getOfflineMemories =
  async () => {
    const [
      local,
      pending,
    ] = await Promise.all([
      getLocalMemories(),
      getPendingMemories(),
    ]);

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

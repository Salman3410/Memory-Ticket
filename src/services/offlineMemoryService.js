import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from "expo-file-system/legacy";
import * as ImageManipulator from "expo-image-manipulator";

const PENDING_MEMORIES_KEY = "@memory_ticket_pending_memories";
const LOCAL_MEMORIES_KEY = "@memory_ticket_local_memories";
const OFFLINE_IMAGES_DIRECTORY = `${FileSystem.documentDirectory}memory-ticket-offline/`;

const MAX_IMAGE_SIZE = 1600;
const IMAGE_QUALITY = 0.8;

let pendingMemoriesCache = null;
let localMemoriesCache = null;

let pendingWritePromise = Promise.resolve();
let localWritePromise = Promise.resolve();

let offlineDirectoryPromise = null;

const ensureOfflineDirectory = async () => {
  if (!offlineDirectoryPromise) {
    offlineDirectoryPromise = (async () => {
      const directoryInfo = await FileSystem.getInfoAsync(
        OFFLINE_IMAGES_DIRECTORY,
      );

      if (!directoryInfo.exists) {
        await FileSystem.makeDirectoryAsync(OFFLINE_IMAGES_DIRECTORY, {
          intermediates: true,
        });
      }
    })();
  }

  return offlineDirectoryPromise;
};

export const generateClientMemoryId = () => {
  return `memory-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
};

const getFileName = (uri, index) => {
  const fallbackName = `image-${Date.now()}-${index}.jpg`;

  if (!uri || typeof uri !== "string") {
    return fallbackName;
  }

  const name = uri.split("/").pop();

  return name?.split("?")[0] || fallbackName;
};

export const compressImage = async (uri) => {
  if (!uri) {
    throw new Error("Image URI is required.");
  }

  try {
    const result = await ImageManipulator.manipulateAsync(
      uri,
      [
        {
          resize: {
            width: MAX_IMAGE_SIZE,
          },
        },
      ],
      {
        compress: IMAGE_QUALITY,
        format: ImageManipulator.SaveFormat.JPEG,
      },
    );

    return result.uri;
  } catch (error) {
    console.error("Image compression error:", error);

    return uri;
  }
};

export const persistImage = async (uri, clientMemoryId, index) => {
  if (!uri) {
    throw new Error("Image URI is required.");
  }

  await ensureOfflineDirectory();

  if (uri.startsWith(OFFLINE_IMAGES_DIRECTORY)) {
    return uri;
  }

  const compressedUri = await compressImage(uri);

  const originalName = getFileName(uri, index);

  const baseName = originalName
    .replace(/\.[^/.]+$/, "")
    .replace(/[^a-zA-Z0-9-_]/g, "_");

  const fileName = `${clientMemoryId}-${index}-${baseName}.jpg`;

  const destination = `${OFFLINE_IMAGES_DIRECTORY}${fileName}`;

  const existing = await FileSystem.getInfoAsync(destination);

  if (existing.exists) {
    return destination;
  }

  await FileSystem.copyAsync({
    from: compressedUri,
    to: destination,
  });

  if (
    compressedUri !== uri &&
    !compressedUri.startsWith(OFFLINE_IMAGES_DIRECTORY)
  ) {
    try {
      await FileSystem.deleteAsync(compressedUri, {
        idempotent: true,
      });
    } catch (error) {
      console.log("Unable to delete temporary compressed image:", error);
    }
  }

  return destination;
};

export const persistMemoryImages = async (memory) => {
  const clientMemoryId = memory.clientMemoryId || generateClientMemoryId();

  const images = Array.isArray(memory.images)
    ? memory.images
    : memory.image
      ? [memory.image]
      : [];

  if (!images.length) {
    throw new Error("At least one image is required.");
  }

  const limitedImages = images.slice(0, 5);

  const localImages = await Promise.all(
    limitedImages.map((uri, index) => persistImage(uri, clientMemoryId, index)),
  );

  return {
    clientMemoryId,
    localImages,
  };
};

export const getPendingMemories = async () => {
  if (pendingMemoriesCache !== null) {
    return pendingMemoriesCache;
  }

  try {
    const raw = await AsyncStorage.getItem(PENDING_MEMORIES_KEY);

    if (!raw) {
      pendingMemoriesCache = [];
      return pendingMemoriesCache;
    }

    const parsed = JSON.parse(raw);

    pendingMemoriesCache = Array.isArray(parsed) ? parsed : [];

    return pendingMemoriesCache;
  } catch (error) {
    console.error("Get pending memories error:", error);

    pendingMemoriesCache = [];

    return pendingMemoriesCache;
  }
};

const writePendingMemories = (memories) => {
  const next = Array.isArray(memories) ? memories : [];

  pendingMemoriesCache = next;

  pendingWritePromise = pendingWritePromise
    .catch(() => {})
    .then(() =>
      AsyncStorage.setItem(
        PENDING_MEMORIES_KEY,
        JSON.stringify(pendingMemoriesCache),
      ),
    );

  return pendingWritePromise.then(() => pendingMemoriesCache);
};

export const savePendingMemories = async (memories) => {
  return writePendingMemories(memories);
};

export const addPendingMemory = async (memory) => {
  const current = await getPendingMemories();

  const index = current.findIndex(
    (item) => item.clientMemoryId === memory.clientMemoryId,
  );

  let next;

  if (index >= 0) {
    next = current.slice();

    next[index] = {
      ...next[index],
      ...memory,
    };
  } else {
    next = [memory, ...current];
  }

  return writePendingMemories(next);
};

export const removePendingMemory = async (clientMemoryId) => {
  const current = await getPendingMemories();

  const next = current.filter(
    (memory) => memory.clientMemoryId !== clientMemoryId,
  );

  return writePendingMemories(next);
};

export const getLocalMemories = async () => {
  if (localMemoriesCache !== null) {
    return localMemoriesCache;
  }

  try {
    const raw = await AsyncStorage.getItem(LOCAL_MEMORIES_KEY);

    if (!raw) {
      localMemoriesCache = [];
      return localMemoriesCache;
    }

    const parsed = JSON.parse(raw);

    localMemoriesCache = Array.isArray(parsed) ? parsed : [];

    return localMemoriesCache;
  } catch (error) {
    console.error("Get local memories error:", error);

    localMemoriesCache = [];

    return localMemoriesCache;
  }
};

const writeLocalMemories = (memories) => {
  const next = Array.isArray(memories) ? memories : [];

  localMemoriesCache = next;

  localWritePromise = localWritePromise
    .catch(() => {})
    .then(() =>
      AsyncStorage.setItem(
        LOCAL_MEMORIES_KEY,
        JSON.stringify(localMemoriesCache),
      ),
    );

  return localWritePromise.then(() => localMemoriesCache);
};

export const saveLocalMemories = async (memories) => {
  return writeLocalMemories(memories);
};

const findLocalMemoryIndex = (memories, memory) => {
  return memories.findIndex((item) => {
    if (memory.clientMemoryId && item.clientMemoryId) {
      return item.clientMemoryId === memory.clientMemoryId;
    }

    return item.id === memory.id;
  });
};

export const upsertLocalMemory = async (memory) => {
  const current = await getLocalMemories();

  const next = current.slice();

  const index = findLocalMemoryIndex(next, memory);

  if (index >= 0) {
    next[index] = {
      ...next[index],
      ...memory,
    };
  } else {
    next.unshift(memory);
  }

  return writeLocalMemories(next);
};

export const upsertLocalMemories = async (memories) => {
  if (!Array.isArray(memories)) {
    return getLocalMemories();
  }

  if (!memories.length) {
    return getLocalMemories();
  }

  const current = await getLocalMemories();

  const next = current.slice();

  const indexMap = new Map();

  for (let index = 0; index < next.length; index += 1) {
    const item = next[index];

    const key = item.clientMemoryId || item.id;

    if (key) {
      indexMap.set(key, index);
    }
  }

  for (const memory of memories) {
    const key = memory.clientMemoryId || memory.id;

    if (!key) {
      continue;
    }

    const existingIndex = indexMap.get(key);

    if (existingIndex !== undefined) {
      next[existingIndex] = {
        ...next[existingIndex],
        ...memory,
      };
    } else {
      next.unshift(memory);

      // Keep map indexes valid.
      for (const [mapKey, mapIndex] of indexMap) {
        indexMap.set(mapKey, mapIndex + 1);
      }

      indexMap.set(key, 0);
    }
  }

  return writeLocalMemories(next);
};

export const removeLocalMemory = async (memoryId, clientMemoryId = null) => {
  const current = await getLocalMemories();

  const next = current.filter((memory) => {
    if (clientMemoryId && memory.clientMemoryId) {
      return memory.clientMemoryId !== clientMemoryId;
    }

    return memory.id !== memoryId;
  });

  return writeLocalMemories(next);
};

export const removeLocalMemories = async (memories) => {
  if (!Array.isArray(memories)) {
    return getLocalMemories();
  }

  const ids = new Set();

  for (const memory of memories) {
    const key = memory.clientMemoryId || memory.id;

    if (key) {
      ids.add(key);
    }
  }

  if (!ids.size) {
    return getLocalMemories();
  }

  const current = await getLocalMemories();

  const next = current.filter((memory) => {
    const key = memory.clientMemoryId || memory.id;

    return !ids.has(key);
  });

  return writeLocalMemories(next);
};

export const clearLocalMemories = async () => {
  localMemoriesCache = [];

  localWritePromise = localWritePromise
    .catch(() => {})
    .then(() => AsyncStorage.removeItem(LOCAL_MEMORIES_KEY));

  return localWritePromise;
};

export const getOfflineMemories = async () => {
  const [local, pending] = await Promise.all([
    getLocalMemories(),
    getPendingMemories(),
  ]);

  if (!local.length && !pending.length) {
    return [];
  }

  const unique = [];
  const seen = new Set();

  for (const memory of [...pending, ...local]) {
    const key = memory.clientMemoryId || memory.id;

    if (!key || seen.has(key)) {
      continue;
    }

    seen.add(key);
    unique.push(memory);
  }

  return unique;
};

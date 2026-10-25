import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from "expo-file-system/legacy";
import * as ImageManipulator from "expo-image-manipulator";

const PENDING_MEMORIES_KEY = "@memory_ticket_pending_memories";
const LOCAL_MEMORIES_KEY = "@memory_ticket_local_memories";
const PENDING_MEMORY_OPERATIONS_KEY =
  "@memory_ticket_pending_memory_operations";

const OFFLINE_IMAGES_DIRECTORY = FileSystem.documentDirectory
  ? `${FileSystem.documentDirectory}memory-ticket-offline/`
  : null;

const MAX_IMAGE_SIZE = 1600;
const IMAGE_QUALITY = 0.8;

const hashString = (value) => {
  let hash = 2166136261;
  const input = String(value);

  for (let i = 0; i < input.length; i += 1) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }

  return (hash >>> 0).toString(16);
};

const perfNow = () =>
  globalThis.performance?.now?.() ?? Date.now();

const logPerf = (label, startedAt, details = {}) => {
  if (!__DEV__) return;

  console.log(`[Memento Perf] ${label}`, {
    durationMs: Number((perfNow() - startedAt).toFixed(1)),
    ...details,
  });
};

const getMemoryKeys = (memory) =>
  [
    ...new Set(
      [
        memory?.clientMemoryId,
        memory?._id,
        memory?.id,
      ]
        .filter(Boolean)
        .map(String),
    ),
  ];

let pendingMemoriesCache = null;
let localMemoriesCache = null;
let pendingMemoryOperationsCache = null;

let pendingMemoryOperationsWritePromise = Promise.resolve();
let pendingWritePromise = Promise.resolve();
let localWritePromise = Promise.resolve();
let offlineDirectoryPromise = null;

/*
 * Account-deletion cleanup state.
 *
 * While cleanup is running:
 * - New tracked operations are rejected.
 * - Queued storage writes cannot write old data back.
 * - Existing tracked operations are allowed to finish or cancel.
 * - Cleanup deletes the persistent storage only after they settle.
 *
 * If cleanup fails, storage remains locked until cleanup succeeds.
 */
let offlineMemoryDataGeneration = 0;
let clearingOfflineMemoryData = false;
let clearOfflineMemoryDataPromise = null;

const activeOfflineOperations = new Set();

const runTrackedOperation = (operation) => {
  if (clearingOfflineMemoryData) {
    return Promise.reject(
      new Error(
        "Offline memory storage is being cleared.",
      ),
    );
  }

  const generation = offlineMemoryDataGeneration;

  let trackedPromise;

  trackedPromise = (async () => {
    if (
      clearingOfflineMemoryData ||
      generation !== offlineMemoryDataGeneration
    ) {
      throw new Error(
        "Offline memory operation cancelled.",
      );
    }

    return operation(generation);
  })();

  activeOfflineOperations.add(trackedPromise);

  trackedPromise.then(
    () => {
      activeOfflineOperations.delete(trackedPromise);
    },
    () => {
      activeOfflineOperations.delete(trackedPromise);
    },
  );

  return trackedPromise;
};

const assertOperationActive = (generation) => {
  if (
    clearingOfflineMemoryData ||
    generation !== offlineMemoryDataGeneration
  ) {
    throw new Error(
      "Offline memory operation cancelled because storage is being cleared.",
    );
  }
};

const ensureOfflineDirectory = async () => {
  if (clearingOfflineMemoryData) {
    throw new Error(
      "Offline memory storage is being cleared.",
    );
  }

  if (!OFFLINE_IMAGES_DIRECTORY) {
    throw new Error(
      "The document directory is unavailable.",
    );
  }

  if (!offlineDirectoryPromise) {
    offlineDirectoryPromise = (async () => {
      const directoryInfo = await FileSystem.getInfoAsync(
        OFFLINE_IMAGES_DIRECTORY,
      );

      if (clearingOfflineMemoryData) {
        throw new Error(
          "Offline memory storage is being cleared.",
        );
      }

      if (!directoryInfo.exists) {
        await FileSystem.makeDirectoryAsync(
          OFFLINE_IMAGES_DIRECTORY,
          {
            intermediates: true,
          },
        );
      }
    })().catch((error) => {
      offlineDirectoryPromise = null;
      throw error;
    });
  }

  return offlineDirectoryPromise;
};

/* ============================================================
   IDS AND IMAGE COMPRESSION
============================================================ */

export const generateClientMemoryId = () =>
  `memory-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 10)}`;

export const compressImage = async (uri) => {
  if (!uri) {
    throw new Error("Image URI is required.");
  }

  try {
    const result = await ImageManipulator.manipulateAsync(
      uri,
      [{ resize: { width: MAX_IMAGE_SIZE } }],
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

/* ============================================================
   PERSIST IMAGE
============================================================ */

const persistImageInternal = async (
  uri,
  clientMemoryId,
  index,
  generation,
) => {
  if (!uri || typeof uri !== "string") {
    throw new Error("Image URI is required.");
  }

  assertOperationActive(generation);

  await ensureOfflineDirectory();

  assertOperationActive(generation);

  if (uri.startsWith(OFFLINE_IMAGES_DIRECTORY)) {
    const localInfo = await FileSystem.getInfoAsync(uri);

    assertOperationActive(generation);

    if (localInfo.exists && (localInfo.size ?? 0) > 0) {
      return uri;
    }

    throw new Error(
      "The saved local image file is missing.",
    );
  }

  const safeMemoryId = String(
    clientMemoryId || generateClientMemoryId(),
  ).replace(/[^a-zA-Z0-9-_]/g, "_");

  const destination =
    `${OFFLINE_IMAGES_DIRECTORY}` +
    `${safeMemoryId}-${index}-${hashString(uri)}.jpg`;

  const destinationInfo = await FileSystem.getInfoAsync(
    destination,
  );

  assertOperationActive(generation);

  if (
    destinationInfo.exists &&
    (destinationInfo.size ?? 0) > 0
  ) {
    return destination;
  }

  let sourceUri = uri;
  let downloadedTempUri = null;
  let compressedUri = null;

  try {
    if (/^https?:\/\//i.test(uri)) {
      const tempDirectory =
        FileSystem.cacheDirectory ||
        FileSystem.documentDirectory;

      if (!tempDirectory) {
        throw new Error(
          "No writable directory is available.",
        );
      }

      downloadedTempUri =
        `${tempDirectory}` +
        `memento-download-${hashString(uri)}-${Date.now()}-` +
        `${Math.random().toString(36).slice(2, 8)}.jpg`;

      const downloadResult = await FileSystem.downloadAsync(
        uri,
        downloadedTempUri,
      );

      assertOperationActive(generation);

      sourceUri = downloadResult.uri;
    }

    compressedUri = await compressImage(sourceUri);

    assertOperationActive(generation);

    assertOperationActive(generation);

    await FileSystem.copyAsync({
      from: compressedUri,
      to: destination,
    });

    assertOperationActive(generation);

    const savedInfo = await FileSystem.getInfoAsync(
      destination,
    );

    assertOperationActive(generation);

    if (
      !savedInfo.exists ||
      (savedInfo.size ?? 0) <= 0
    ) {
      throw new Error(
        "The image was not saved correctly.",
      );
    }

    return destination;
  } catch (error) {
    try {
      await FileSystem.deleteAsync(destination, {
        idempotent: true,
      });
    } catch {}

    throw error;
  } finally {
    const temporaryFiles = new Set();

    if (downloadedTempUri) {
      temporaryFiles.add(downloadedTempUri);
    }

    if (
      compressedUri &&
      compressedUri !== sourceUri &&
      compressedUri !== uri &&
      (
        !OFFLINE_IMAGES_DIRECTORY ||
        !compressedUri.startsWith(
          OFFLINE_IMAGES_DIRECTORY,
        )
      )
    ) {
      temporaryFiles.add(compressedUri);
    }

    for (const temporaryUri of temporaryFiles) {
      try {
        await FileSystem.deleteAsync(temporaryUri, {
          idempotent: true,
        });
      } catch {}
    }
  }
};

export const persistImage = (
  uri,
  clientMemoryId,
  index,
) =>
  runTrackedOperation((generation) =>
    persistImageInternal(
      uri,
      clientMemoryId,
      index,
      generation,
    ),
  );

/* ============================================================
   PERSIST MEMORY IMAGES
============================================================ */

const persistMemoryImagesInternal = async (
  memory,
  generation,
) => {
  assertOperationActive(generation);

  const clientMemoryId = String(
    memory.clientMemoryId ||
      memory._id ||
      memory.id ||
      generateClientMemoryId(),
  );

  const images =
    Array.isArray(memory.images) && memory.images.length
      ? memory.images
      : Array.isArray(memory.localImages) &&
          memory.localImages.length
        ? memory.localImages
        : memory.image
          ? [memory.image]
          : [];

  if (!images.length) {
    throw new Error("At least one image is required.");
  }

  const startedAt = perfNow();
  const limitedImages = images.slice(0, 5);

  const localImages = await Promise.all(
    limitedImages.map((uri, index) =>
      persistImage(uri, clientMemoryId, index),
    ),
  );

  assertOperationActive(generation);

  logPerf("Persist memory images", startedAt, {
    imageCount: limitedImages.length,
    memoryId: clientMemoryId,
  });

  return {
    clientMemoryId,
    localImages,
  };
};

export const persistMemoryImages = (memory) =>
  runTrackedOperation((generation) =>
    persistMemoryImagesInternal(memory, generation),
  );

/* ============================================================
   PENDING MEMORIES
============================================================ */

export const getPendingMemories = async () => {
  if (clearingOfflineMemoryData) {
    return [];
  }

  if (pendingMemoriesCache !== null) {
    return pendingMemoriesCache;
  }

  const generation = offlineMemoryDataGeneration;

  try {
    const raw = await AsyncStorage.getItem(
      PENDING_MEMORIES_KEY,
    );

    if (
      clearingOfflineMemoryData ||
      generation !== offlineMemoryDataGeneration
    ) {
      return [];
    }

    if (!raw) {
      pendingMemoriesCache = [];
      return pendingMemoriesCache;
    }

    const parsed = JSON.parse(raw);

    pendingMemoriesCache = Array.isArray(parsed)
      ? parsed
      : [];

    return pendingMemoriesCache;
  } catch (error) {
    if (
      clearingOfflineMemoryData ||
      generation !== offlineMemoryDataGeneration
    ) {
      return [];
    }

    console.error(
      "Get pending memories error:",
      error,
    );

    pendingMemoriesCache = [];
    return pendingMemoriesCache;
  }
};

const writePendingMemories = (memories) => {
  if (clearingOfflineMemoryData) {
    return Promise.resolve([]);
  }

  const generation = offlineMemoryDataGeneration;

  pendingMemoriesCache = Array.isArray(memories)
    ? memories
    : [];

  pendingWritePromise = pendingWritePromise
    .catch(() => {})
    .then(() => {
      if (
        clearingOfflineMemoryData ||
        generation !== offlineMemoryDataGeneration
      ) {
        return;
      }

      return AsyncStorage.setItem(
        PENDING_MEMORIES_KEY,
        JSON.stringify(pendingMemoriesCache),
      );
    });

  return pendingWritePromise.then(
    () => pendingMemoriesCache,
  );
};

export const savePendingMemories = (memories) =>
  runTrackedOperation(() =>
    writePendingMemories(memories),
  );

export const addPendingMemory = (memory) =>
  runTrackedOperation(async () => {
    const current = await getPendingMemories();

    if (clearingOfflineMemoryData) {
      throw new Error(
        "Offline memory storage is being cleared.",
      );
    }

    const index = current.findIndex(
      (item) =>
        item.clientMemoryId === memory.clientMemoryId,
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
  });

export const removePendingMemory = (
  clientMemoryId,
) =>
  runTrackedOperation(async () => {
    const current = await getPendingMemories();

    if (clearingOfflineMemoryData) {
      throw new Error(
        "Offline memory storage is being cleared.",
      );
    }

    return writePendingMemories(
      current.filter(
        (memory) =>
          memory.clientMemoryId !== clientMemoryId,
      ),
    );
  });

/* ============================================================
   LOCAL MEMORIES
============================================================ */

export const getLocalMemories = async () => {
  if (clearingOfflineMemoryData) {
    return [];
  }

  if (localMemoriesCache !== null) {
    return localMemoriesCache;
  }

  const generation = offlineMemoryDataGeneration;

  try {
    const raw = await AsyncStorage.getItem(
      LOCAL_MEMORIES_KEY,
    );

    if (
      clearingOfflineMemoryData ||
      generation !== offlineMemoryDataGeneration
    ) {
      return [];
    }

    if (!raw) {
      localMemoriesCache = [];
      return localMemoriesCache;
    }

    const parsed = JSON.parse(raw);

    localMemoriesCache = Array.isArray(parsed)
      ? parsed
      : [];

    return localMemoriesCache;
  } catch (error) {
    if (
      clearingOfflineMemoryData ||
      generation !== offlineMemoryDataGeneration
    ) {
      return [];
    }

    console.error(
      "Get local memories error:",
      error,
    );

    localMemoriesCache = [];
    return localMemoriesCache;
  }
};

const writeLocalMemories = (memories) => {
  if (clearingOfflineMemoryData) {
    return Promise.resolve([]);
  }

  const generation = offlineMemoryDataGeneration;

  localMemoriesCache = Array.isArray(memories)
    ? memories
    : [];

  const writeStartedAt = perfNow();

  localWritePromise = localWritePromise
    .catch(() => {})
    .then(() => {
      if (
        clearingOfflineMemoryData ||
        generation !== offlineMemoryDataGeneration
      ) {
        return;
      }

      return AsyncStorage.setItem(
        LOCAL_MEMORIES_KEY,
        JSON.stringify(localMemoriesCache),
      );
    })
    .then((result) => {
      logPerf(
        "AsyncStorage local memories write",
        writeStartedAt,
        {
          count: localMemoriesCache.length,
        },
      );

      return result;
    });

  return localWritePromise.then(
    () => localMemoriesCache,
  );
};

export const saveLocalMemories = (memories) =>
  runTrackedOperation(() =>
    writeLocalMemories(memories),
  );

const findLocalMemoryIndex = (memories, memory) => {
  const keys = new Set(getMemoryKeys(memory));

  if (!keys.size) return -1;

  return memories.findIndex((item) =>
    getMemoryKeys(item).some((key) => keys.has(key)),
  );
};

export const upsertLocalMemory = (memory) =>
  runTrackedOperation(async () => {
    const current = await getLocalMemories();

    if (clearingOfflineMemoryData) {
      throw new Error(
        "Offline memory storage is being cleared.",
      );
    }

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
  });

export const upsertLocalMemories = (memories) =>
  runTrackedOperation(async () => {
    if (!Array.isArray(memories) || memories.length === 0) {
      return getLocalMemories();
    }

    const startedAt = perfNow();
    const current = await getLocalMemories();

    if (clearingOfflineMemoryData) {
      throw new Error(
        "Offline memory storage is being cleared.",
      );
    }

    const next = current.slice();

    const existingIndex = new Map();

    for (let index = 0; index < next.length; index += 1) {
      for (const key of getMemoryKeys(next[index])) {
        existingIndex.set(key, index);
      }
    }

    const newRecords = [];
    const newRecordIndex = new Map();

    for (const memory of memories) {
      const keys = getMemoryKeys(memory);

      if (!keys.length) continue;

      let matchedIndex;

      for (const key of keys) {
        if (existingIndex.has(key)) {
          matchedIndex = existingIndex.get(key);
          break;
        }

        if (newRecordIndex.has(key)) {
          matchedIndex = newRecordIndex.get(key);
          break;
        }
      }

      if (matchedIndex !== undefined) {
        if (matchedIndex < next.length) {
          next[matchedIndex] = {
            ...next[matchedIndex],
            ...memory,
          };

          for (const key of keys) {
            existingIndex.set(key, matchedIndex);
          }
        } else {
          const newIndex = matchedIndex - next.length;

          newRecords[newIndex] = {
            ...newRecords[newIndex],
            ...memory,
          };

          for (const key of keys) {
            newRecordIndex.set(key, matchedIndex);
          }
        }

        continue;
      }

      const newIndex = newRecords.length;
      newRecords.push(memory);

      for (const key of keys) {
        newRecordIndex.set(key, next.length + newIndex);
      }
    }

    const result = [...newRecords.reverse(), ...next];

    logPerf("Build local memory upsert batch", startedAt, {
      incoming: memories.length,
      existing: current.length,
      newRecords: newRecords.length,
    });

    return writeLocalMemories(result);
  });

export const reconcileLocalMemories = ({
  serverMemories = [],
  pendingMemories = [],
  pendingOperations = [],
} = {}) =>
  runTrackedOperation(async () => {
    if (!Array.isArray(serverMemories)) {
      throw new Error(
        "Cannot reconcile local memories without a complete server list.",
      );
    }

    const startedAt = perfNow();

    const serverKeys = new Set(
      serverMemories.flatMap(getMemoryKeys),
    );

    const pendingCreateKeys = new Set(
      pendingMemories.flatMap(getMemoryKeys),
    );

    const pendingDeleteKeys = new Set();
    const pendingMutationKeys = new Set();

    for (const operation of pendingOperations) {
      const keys = [
        operation.clientMemoryId,
        operation.memoryId,
      ]
        .filter(Boolean)
        .map(String);

      const target =
        operation.type === "delete"
          ? pendingDeleteKeys
          : pendingMutationKeys;

      for (const key of keys) {
        target.add(key);
      }
    }

    const current = await getLocalMemories();

    if (clearingOfflineMemoryData) {
      throw new Error(
        "Offline memory storage is being cleared.",
      );
    }

    const retained = current.filter((memory) => {
      const keys = getMemoryKeys(memory);

      if (
        keys.some((key) => pendingDeleteKeys.has(key))
      ) {
        return false;
      }

      if (keys.some((key) => serverKeys.has(key))) {
        return true;
      }

      if (
        keys.some((key) => pendingCreateKeys.has(key))
      ) {
        return true;
      }

      if (
        keys.some((key) => pendingMutationKeys.has(key))
      ) {
        return true;
      }

      if (
        memory.syncStatus === "pending" ||
        memory.syncReady === false ||
        memory.hasPendingChanges === true
      ) {
        return true;
      }

      return false;
    });

    await writeLocalMemories(retained);

    logPerf("Reconcile local memories", startedAt, {
      before: current.length,
      after: retained.length,
      removed: current.length - retained.length,
    });

    return retained;
  });

export const removeLocalMemory = (
  memoryId,
  clientMemoryId = null,
) =>
  runTrackedOperation(async () => {
    const current = await getLocalMemories();

    if (clearingOfflineMemoryData) {
      throw new Error(
        "Offline memory storage is being cleared.",
      );
    }

    const targetKeys = new Set(
      [clientMemoryId, memoryId]
        .filter(Boolean)
        .map(String),
    );

    const next = current.filter(
      (memory) =>
        !getMemoryKeys(memory).some((key) =>
          targetKeys.has(key),
        ),
    );

    return writeLocalMemories(next);
  });

export const removeLocalMemories = (memories) =>
  runTrackedOperation(async () => {
    if (!Array.isArray(memories)) {
      return getLocalMemories();
    }

    const ids = new Set(
      memories.flatMap((memory) => getMemoryKeys(memory)),
    );

    if (!ids.size) {
      return getLocalMemories();
    }

    const current = await getLocalMemories();

    if (clearingOfflineMemoryData) {
      throw new Error(
        "Offline memory storage is being cleared.",
      );
    }

    return writeLocalMemories(
      current.filter(
        (memory) =>
          !getMemoryKeys(memory).some((key) =>
            ids.has(key),
          ),
      ),
    );
  });

export const clearLocalMemories = () =>
  runTrackedOperation(() => {
    localMemoriesCache = [];

    const generation = offlineMemoryDataGeneration;

    localWritePromise = localWritePromise
      .catch(() => {})
      .then(() => {
        if (
          clearingOfflineMemoryData ||
          generation !== offlineMemoryDataGeneration
        ) {
          return;
        }

        return AsyncStorage.removeItem(
          LOCAL_MEMORIES_KEY,
        );
      });

    return localWritePromise;
  });

export const getOfflineMemories = async () => {
  if (clearingOfflineMemoryData) {
    return [];
  }

  const generation = offlineMemoryDataGeneration;

  const [local, pending] = await Promise.all([
    getLocalMemories(),
    getPendingMemories(),
  ]);

  if (
    clearingOfflineMemoryData ||
    generation !== offlineMemoryDataGeneration
  ) {
    return [];
  }

  if (!local.length && !pending.length) {
    return [];
  }

  const unique = [];
  const seenKeys = new Set();

  // Pending memories take priority over older local copies.
  for (const memory of [...pending, ...local]) {
    const keys = getMemoryKeys(memory);

    if (
      !keys.length ||
      keys.some((key) => seenKeys.has(key))
    ) {
      continue;
    }

    unique.push(memory);

    for (const key of keys) {
      seenKeys.add(key);
    }
  }

  return unique;
};

/* ============================================================
   PENDING MEMORY OPERATIONS
============================================================ */

export const getPendingMemoryOperations = async () => {
  if (clearingOfflineMemoryData) {
    return [];
  }

  if (pendingMemoryOperationsCache !== null) {
    return pendingMemoryOperationsCache;
  }

  const generation = offlineMemoryDataGeneration;

  try {
    const raw = await AsyncStorage.getItem(
      PENDING_MEMORY_OPERATIONS_KEY,
    );

    if (
      clearingOfflineMemoryData ||
      generation !== offlineMemoryDataGeneration
    ) {
      return [];
    }

    if (!raw) {
      pendingMemoryOperationsCache = [];
      return pendingMemoryOperationsCache;
    }

    const parsed = JSON.parse(raw);

    pendingMemoryOperationsCache = Array.isArray(parsed)
      ? parsed
      : [];

    return pendingMemoryOperationsCache;
  } catch (error) {
    if (
      clearingOfflineMemoryData ||
      generation !== offlineMemoryDataGeneration
    ) {
      return [];
    }

    console.error(
      "Get pending memory operations error:",
      error,
    );

    pendingMemoryOperationsCache = [];
    return pendingMemoryOperationsCache;
  }
};

const writePendingMemoryOperations = (operations) => {
  if (clearingOfflineMemoryData) {
    return Promise.resolve([]);
  }

  const generation = offlineMemoryDataGeneration;

  pendingMemoryOperationsCache = Array.isArray(operations)
    ? operations
    : [];

  pendingMemoryOperationsWritePromise =
    pendingMemoryOperationsWritePromise
      .catch(() => {})
      .then(() => {
        if (
          clearingOfflineMemoryData ||
          generation !== offlineMemoryDataGeneration
        ) {
          return;
        }

        return AsyncStorage.setItem(
          PENDING_MEMORY_OPERATIONS_KEY,
          JSON.stringify(pendingMemoryOperationsCache),
        );
      });

  return pendingMemoryOperationsWritePromise.then(
    () => pendingMemoryOperationsCache,
  );
};

const getOperationMemoryKey = (operation) =>
  String(
    operation.clientMemoryId ||
      operation.memoryId ||
      "",
  );

export const addPendingMemoryOperation = (
  operation,
) =>
  runTrackedOperation(async () => {
    const allowedTypes = ["update", "favorite", "delete"];

    if (
      !operation?.type ||
      !allowedTypes.includes(operation.type)
    ) {
      throw new Error(
        "Unsupported pending memory operation.",
      );
    }

    const targetKey = getOperationMemoryKey(operation);

    if (!targetKey) {
      throw new Error(
        "A memory ID is required for a queued operation.",
      );
    }

    const now = Date.now();

    const normalized = {
      ...operation,
      operationId:
        operation.operationId ||
        `mutation-${now}-${Math.random()
          .toString(36)
          .slice(2, 10)}`,
      createdAt: operation.createdAt || now,
      updatedAt: now,
    };

    const current = await getPendingMemoryOperations();

    if (clearingOfflineMemoryData) {
      throw new Error(
        "Offline memory storage is being cleared.",
      );
    }

    let next = current.slice();

    if (operation.type === "delete") {
      next = next.filter(
        (item) =>
          getOperationMemoryKey(item) !== targetKey,
      );

      next.push(normalized);

      return writePendingMemoryOperations(next);
    }

    const existingIndex = next.findIndex(
      (item) =>
        getOperationMemoryKey(item) === targetKey &&
        item.type === operation.type,
    );

    if (existingIndex >= 0) {
      const existing = next[existingIndex];

      next[existingIndex] = {
        ...existing,
        ...normalized,
        operationId: normalized.operationId,
        createdAt: now,
        payload:
          operation.type === "update"
            ? {
                ...(existing.payload || {}),
                ...(operation.payload || {}),
              }
            : normalized.payload,
      };
    } else {
      next.push(normalized);
    }

    next.sort(
      (a, b) =>
        Number(a.createdAt || 0) -
        Number(b.createdAt || 0),
    );

    return writePendingMemoryOperations(next);
  });

export const removePendingMemoryOperation = (
  operationId,
) =>
  runTrackedOperation(async () => {
    const current = await getPendingMemoryOperations();

    if (clearingOfflineMemoryData) {
      throw new Error(
        "Offline memory storage is being cleared.",
      );
    }

    return writePendingMemoryOperations(
      current.filter(
        (operation) =>
          operation.operationId !== operationId,
      ),
    );
  });

export const clearPendingMemoryOperations = () =>
  runTrackedOperation(() => {
    pendingMemoryOperationsCache = [];

    const generation = offlineMemoryDataGeneration;

    pendingMemoryOperationsWritePromise =
      pendingMemoryOperationsWritePromise
        .catch(() => {})
        .then(() => {
          if (
            clearingOfflineMemoryData ||
            generation !== offlineMemoryDataGeneration
          ) {
            return;
          }

          return AsyncStorage.removeItem(
            PENDING_MEMORY_OPERATIONS_KEY,
          );
        });

    return pendingMemoryOperationsWritePromise;
  });

/* ============================================================
   CLEAR ALL OFFLINE MEMORY DATA
============================================================ */

/**
 * Used after successful account deletion.
 *
 * Clears:
 * - @memory_ticket_pending_memories
 * - @memory_ticket_local_memories
 * - @memory_ticket_pending_memory_operations
 * - In-memory service caches
 * - Persisted offline image directory
 *
 * It does not clear unrelated app settings or other AsyncStorage keys.
 */
export const clearAllOfflineMemoryData = async () => {
  if (clearOfflineMemoryDataPromise) {
    return clearOfflineMemoryDataPromise;
  }

  clearingOfflineMemoryData = true;
  offlineMemoryDataGeneration += 1;

  // Reset memory immediately so getters do not expose old records.
  pendingMemoriesCache = [];
  localMemoriesCache = [];
  pendingMemoryOperationsCache = [];

  const activeOperations = [
    ...activeOfflineOperations,
  ];

  const pendingWrites = [
    pendingWritePromise,
    localWritePromise,
    pendingMemoryOperationsWritePromise,
  ];

  const directorySetup = offlineDirectoryPromise;

  let cleanupSucceeded = false;

  const cleanupPromise = (async () => {
    /*
     * No new tracked operation can start while clearing is true.
     * Existing operations either finish or stop at their guards.
     */
    await Promise.allSettled([
      ...activeOperations,
      ...pendingWrites,
      ...(directorySetup ? [directorySetup] : []),
    ]);

    /*
     * Await the current queue promises again in case an operation
     * queued a write before cleanup began.
     */
    await Promise.allSettled([
      pendingWritePromise,
      localWritePromise,
      pendingMemoryOperationsWritePromise,
    ]);

    const cleanupTasks = [
      AsyncStorage.multiRemove([
        PENDING_MEMORIES_KEY,
        LOCAL_MEMORIES_KEY,
        PENDING_MEMORY_OPERATIONS_KEY,
      ]),
    ];

    if (OFFLINE_IMAGES_DIRECTORY) {
      cleanupTasks.push(
        FileSystem.deleteAsync(
          OFFLINE_IMAGES_DIRECTORY,
          { idempotent: true },
        ),
      );
    }

    const results = await Promise.allSettled(
      cleanupTasks,
    );

    const errors = results
      .filter((result) => result.status === "rejected")
      .map((result) => result.reason);

    // Clear all module-level caches and reset queue references.
    pendingMemoriesCache = [];
    localMemoriesCache = [];
    pendingMemoryOperationsCache = [];

    offlineDirectoryPromise = null;

    pendingWritePromise = Promise.resolve();
    localWritePromise = Promise.resolve();
    pendingMemoryOperationsWritePromise =
      Promise.resolve();

    if (errors.length > 0) {
      console.error(
        "Some offline memory data could not be cleared:",
        errors,
      );

      throw new Error(
        "Unable to clear all offline memory data.",
      );
    }

    cleanupSucceeded = true;

    return {
      success: true,
    };
  })();

  clearOfflineMemoryDataPromise = cleanupPromise;

  try {
    return await cleanupPromise;
  } finally {
    if (clearOfflineMemoryDataPromise === cleanupPromise) {
      clearOfflineMemoryDataPromise = null;
    }

    if (cleanupSucceeded) {
      clearingOfflineMemoryData = false;
    }
  }
};
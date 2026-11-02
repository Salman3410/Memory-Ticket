import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from "expo-file-system/legacy";
import * as ImageManipulator from "expo-image-manipulator";

const LEGACY_PENDING_MEMORIES_KEY = "@memory_ticket_pending_memories";
const LEGACY_LOCAL_MEMORIES_KEY = "@memory_ticket_local_memories";
const LEGACY_PENDING_OPERATIONS_KEY =
  "@memory_ticket_pending_memory_operations";

const STORAGE_NAMESPACE = "@memento_account";

const OFFLINE_IMAGES_ROOT = FileSystem.documentDirectory
  ? `${FileSystem.documentDirectory}memory-ticket-offline/`
  : null;

const MAX_IMAGE_SIZE = 1600;
const IMAGE_QUALITY = 0.8;

const accountStates = new Map();

const perfNow = () =>
  globalThis.performance?.now?.() ?? Date.now();

const logPerf = (label, startedAt, details = {}) => {
  if (!__DEV__) return;

  console.log(`[Memento Perf] ${label}`, {
    durationMs: Number((perfNow() - startedAt).toFixed(1)),
    ...details,
  });
};

const hashString = (value) => {
  let hash = 2166136261;
  const input = String(value);

  for (let index = 0; index < input.length; index += 1) {
    hash ^= input.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return (hash >>> 0).toString(16);
};

const normalizeAccountId = (accountId) => {
  if (
    accountId === undefined ||
    accountId === null ||
    String(accountId).trim() === ""
  ) {
    throw new Error(
      "A valid account ID is required for offline memory storage.",
    );
  }

  return String(accountId).trim();
};

const getAccountStorageId = (accountId) =>
  encodeURIComponent(normalizeAccountId(accountId));

const getAccountStorageKeys = (accountId) => {
  const storageId = getAccountStorageId(accountId);
  const prefix = `${STORAGE_NAMESPACE}:${storageId}`;

  return {
    pendingMemories: `${prefix}:pending_memories`,
    localMemories: `${prefix}:local_memories`,
    pendingOperations: `${prefix}:pending_operations`,
  };
};

const getAccountImagesDirectory = (accountId) => {
  if (!OFFLINE_IMAGES_ROOT) return null;

  return (
    `${OFFLINE_IMAGES_ROOT}` +
    `${getAccountStorageId(accountId)}/`
  );
};

const createAccountState = (accountId) => ({
  accountId: normalizeAccountId(accountId),

  storageId: getAccountStorageId(accountId),

  keys: getAccountStorageKeys(accountId),

  imagesDirectory: getAccountImagesDirectory(accountId),

  pendingMemoriesCache: null,
  localMemoriesCache: null,
  pendingOperationsCache: null,

  pendingWritePromise: Promise.resolve(),
  localWritePromise: Promise.resolve(),
  pendingOperationsWritePromise: Promise.resolve(),

  directoryPromise: null,

  generation: 0,
  clearing: false,
  clearPromise: null,

  activeOperations: new Set(),
});

const getAccountState = (accountId) => {
  const normalizedAccountId =
    normalizeAccountId(accountId);

  const storageId =
    getAccountStorageId(normalizedAccountId);

  let state = accountStates.get(storageId);

  if (!state) {
    state = createAccountState(normalizedAccountId);

    accountStates.set(storageId, state);
  }

  return state;
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

const assertRecordOwner = (
  record,
  accountId,
  label,
) => {
  if (!record || typeof record !== "object") {
    throw new Error(`${label} must be an object.`);
  }

  if (
    record.ownerAccountId &&
    String(record.ownerAccountId) !== String(accountId)
  ) {
    throw new Error(
      `${label} belongs to a different account. Storage operation rejected.`,
    );
  }

  return {
    ...record,
    ownerAccountId: String(accountId),
  };
};

const assertOperationActive = (
  state,
  generation,
) => {
  if (
    state.clearing ||
    generation !== state.generation
  ) {
    throw new Error(
      "Offline memory operation cancelled because this account's storage is being cleared.",
    );
  }
};

const runTrackedOperation = (
  accountId,
  operation,
) => {
  const state = getAccountState(accountId);

  if (state.clearing) {
    return Promise.reject(
      new Error(
        "This account's offline memory storage is being cleared.",
      ),
    );
  }

  const generation = state.generation;

  let trackedPromise;

  trackedPromise = (async () => {
    assertOperationActive(state, generation);

    return operation(state, generation);
  })();

  state.activeOperations.add(trackedPromise);

  trackedPromise.then(
    () => {
      state.activeOperations.delete(trackedPromise);
    },
    () => {
      state.activeOperations.delete(trackedPromise);
    },
  );

  return trackedPromise;
};

const ensureOfflineDirectory = async (
  state,
  generation,
) => {
  assertOperationActive(state, generation);

  if (!state.imagesDirectory) {
    throw new Error(
      "The document directory is unavailable.",
    );
  }

  if (!state.directoryPromise) {
    state.directoryPromise = (async () => {
      const directoryInfo =
        await FileSystem.getInfoAsync(
          state.imagesDirectory,
        );

      assertOperationActive(state, generation);

      if (!directoryInfo.exists) {
        await FileSystem.makeDirectoryAsync(
          state.imagesDirectory,
          {
            intermediates: true,
          },
        );
      }

      assertOperationActive(state, generation);
    })().catch((error) => {
      state.directoryPromise = null;
      throw error;
    });
  }

  return state.directoryPromise;
};

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
    console.error(
      "Image compression error:",
      error,
    );

    return uri;
  }
};

const persistImageInternal = async (
  state,
  uri,
  clientMemoryId,
  index,
  generation,
) => {
  if (!uri || typeof uri !== "string") {
    throw new Error("Image URI is required.");
  }

  assertOperationActive(state, generation);

  await ensureOfflineDirectory(
    state,
    generation,
  );

  assertOperationActive(state, generation);

  const isInOfflineRoot = Boolean(
    OFFLINE_IMAGES_ROOT &&
      uri.startsWith(OFFLINE_IMAGES_ROOT),
  );

  const isInThisAccountDirectory = Boolean(
    state.imagesDirectory &&
      uri.startsWith(state.imagesDirectory),
  );

  if (
    isInOfflineRoot &&
    !isInThisAccountDirectory
  ) {
    throw new Error(
      "The image belongs to another account's offline storage.",
    );
  }

  if (isInThisAccountDirectory) {
    const localInfo =
      await FileSystem.getInfoAsync(uri);

    assertOperationActive(state, generation);

    if (
      localInfo.exists &&
      (localInfo.size ?? 0) > 0
    ) {
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
    `${state.imagesDirectory}` +
    `${safeMemoryId}-${index}-${hashString(uri)}.jpg`;

  const destinationInfo =
    await FileSystem.getInfoAsync(destination);

  assertOperationActive(state, generation);

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

      const downloadResult =
        await FileSystem.downloadAsync(
          uri,
          downloadedTempUri,
        );

      assertOperationActive(state, generation);

      sourceUri = downloadResult.uri;
    }

    compressedUri =
      await compressImage(sourceUri);

    assertOperationActive(state, generation);

    await FileSystem.copyAsync({
      from: compressedUri,
      to: destination,
    });

    assertOperationActive(state, generation);

    const savedInfo =
      await FileSystem.getInfoAsync(destination);

    assertOperationActive(state, generation);

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
      await FileSystem.deleteAsync(
        destination,
        { idempotent: true },
      );
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
      !compressedUri.startsWith(
        state.imagesDirectory,
      )
    ) {
      temporaryFiles.add(compressedUri);
    }

    for (const temporaryUri of temporaryFiles) {
      try {
        await FileSystem.deleteAsync(
          temporaryUri,
          { idempotent: true },
        );
      } catch {}
    }
  }
};

export const persistImage = (
  accountId,
  uri,
  clientMemoryId,
  index,
) =>
  runTrackedOperation(
    accountId,
    (state, generation) =>
      persistImageInternal(
        state,
        uri,
        clientMemoryId,
        index,
        generation,
      ),
  );

const persistMemoryImagesInternal = async (
  state,
  memory,
  generation,
) => {
  assertOperationActive(state, generation);

  if (!memory || typeof memory !== "object") {
    throw new Error("Memory data is required.");
  }

  assertRecordOwner(
    memory,
    state.accountId,
    "Memory",
  );

  const clientMemoryId = String(
    memory.clientMemoryId ||
      memory._id ||
      memory.id ||
      generateClientMemoryId(),
  );

  const images =
    Array.isArray(memory.images) &&
    memory.images.length
      ? memory.images
      : Array.isArray(memory.localImages) &&
          memory.localImages.length
        ? memory.localImages
        : memory.image
          ? [memory.image]
          : [];

  if (!images.length) {
    throw new Error(
      "At least one image is required.",
    );
  }

  const startedAt = perfNow();

  const limitedImages = images.slice(0, 5);

  const localImages = await Promise.all(
    limitedImages.map((uri, index) =>
      persistImageInternal(
        state,
        uri,
        clientMemoryId,
        index,
        generation,
      ),
    ),
  );

  assertOperationActive(state, generation);

  logPerf(
    "Persist memory images",
    startedAt,
    {
      imageCount: limitedImages.length,
      memoryId: clientMemoryId,
      account: state.storageId,
    },
  );

  return {
    clientMemoryId,
    localImages,
  };
};

export const persistMemoryImages = (
  accountId,
  memory,
) =>
  runTrackedOperation(
    accountId,
    (state, generation) =>
      persistMemoryImagesInternal(
        state,
        memory,
        generation,
      ),
  );

export const getPendingMemories = async (
  accountId,
) => {
  const state = getAccountState(accountId);

  if (state.clearing) return [];

  if (state.pendingMemoriesCache !== null) {
    return state.pendingMemoriesCache;
  }

  const generation = state.generation;

  try {
    const raw = await AsyncStorage.getItem(
      state.keys.pendingMemories,
    );

    if (
      state.clearing ||
      generation !== state.generation
    ) {
      return [];
    }

    if (!raw) {
      state.pendingMemoriesCache = [];
      return state.pendingMemoriesCache;
    }

    const parsed = JSON.parse(raw);

    const records = Array.isArray(parsed)
      ? parsed
      : [];

    state.pendingMemoriesCache = records
      .filter(
        (record) =>
          !record?.ownerAccountId ||
          String(record.ownerAccountId) ===
            state.accountId,
      )
      .map((record) => ({
        ...record,
        ownerAccountId: state.accountId,
      }));

    return state.pendingMemoriesCache;
  } catch (error) {
    if (
      state.clearing ||
      generation !== state.generation
    ) {
      return [];
    }

    console.error(
      "Get pending memories error:",
      error,
    );

    state.pendingMemoriesCache = [];

    return state.pendingMemoriesCache;
  }
};

const writePendingMemories = (
  state,
  memories,
  generation,
) => {
  if (state.clearing) {
    return Promise.resolve([]);
  }

  const snapshot = Array.isArray(memories)
    ? memories.map((memory) =>
        assertRecordOwner(
          memory,
          state.accountId,
          "Pending memory",
        ),
      )
    : [];

  state.pendingMemoriesCache = snapshot;

  state.pendingWritePromise =
    state.pendingWritePromise
      .catch(() => {})
      .then(() => {
        if (
          state.clearing ||
          generation !== state.generation
        ) {
          return;
        }

        return AsyncStorage.setItem(
          state.keys.pendingMemories,
          JSON.stringify(snapshot),
        );
      });

  return state.pendingWritePromise.then(
    () => state.pendingMemoriesCache,
  );
};

export const savePendingMemories = (
  accountId,
  memories,
) =>
  runTrackedOperation(
    accountId,
    (state, generation) =>
      writePendingMemories(
        state,
        memories,
        generation,
      ),
  );

export const addPendingMemory = (
  accountId,
  memory,
) =>
  runTrackedOperation(
    accountId,
    async (state, generation) => {
      const ownedMemory = assertRecordOwner(
        memory,
        state.accountId,
        "Pending memory",
      );

      const current = await getPendingMemories(
        state.accountId,
      );

      assertOperationActive(state, generation);

      const index = current.findIndex(
        (item) =>
          String(item.clientMemoryId || "") ===
          String(ownedMemory.clientMemoryId || ""),
      );

      let next;

      if (index >= 0) {
        next = current.slice();

        next[index] = {
          ...next[index],
          ...ownedMemory,
        };
      } else {
        next = [ownedMemory, ...current];
      }

      return writePendingMemories(
        state,
        next,
        generation,
      );
    },
  );

export const removePendingMemory = (
  accountId,
  clientMemoryId,
) =>
  runTrackedOperation(
    accountId,
    async (state, generation) => {
      const current = await getPendingMemories(
        state.accountId,
      );

      assertOperationActive(state, generation);

      return writePendingMemories(
        state,
        current.filter(
          (memory) =>
            String(memory.clientMemoryId || "") !==
            String(clientMemoryId || ""),
        ),
        generation,
      );
    },
  );

/* ============================================================
   LOCAL MEMORIES
============================================================ */

export const getLocalMemories = async (
  accountId,
) => {
  const state = getAccountState(accountId);

  if (state.clearing) return [];

  if (state.localMemoriesCache !== null) {
    return state.localMemoriesCache;
  }

  const generation = state.generation;

  try {
    const raw = await AsyncStorage.getItem(
      state.keys.localMemories,
    );

    if (
      state.clearing ||
      generation !== state.generation
    ) {
      return [];
    }

    if (!raw) {
      state.localMemoriesCache = [];
      return state.localMemoriesCache;
    }

    const parsed = JSON.parse(raw);

    const records = Array.isArray(parsed)
      ? parsed
      : [];

    state.localMemoriesCache = records
      .filter(
        (record) =>
          !record?.ownerAccountId ||
          String(record.ownerAccountId) ===
            state.accountId,
      )
      .map((record) => ({
        ...record,
        ownerAccountId: state.accountId,
      }));

    return state.localMemoriesCache;
  } catch (error) {
    if (
      state.clearing ||
      generation !== state.generation
    ) {
      return [];
    }

    console.error(
      "Get local memories error:",
      error,
    );

    state.localMemoriesCache = [];

    return state.localMemoriesCache;
  }
};

const writeLocalMemories = (
  state,
  memories,
  generation,
) => {
  if (state.clearing) {
    return Promise.resolve([]);
  }

  const snapshot = Array.isArray(memories)
    ? memories.map((memory) =>
        assertRecordOwner(
          memory,
          state.accountId,
          "Local memory",
        ),
      )
    : [];

  state.localMemoriesCache = snapshot;

  const writeStartedAt = perfNow();

  state.localWritePromise =
    state.localWritePromise
      .catch(() => {})
      .then(() => {
        if (
          state.clearing ||
          generation !== state.generation
        ) {
          return;
        }

        return AsyncStorage.setItem(
          state.keys.localMemories,
          JSON.stringify(snapshot),
        );
      })
      .then((result) => {
        logPerf(
          "AsyncStorage local memories write",
          writeStartedAt,
          {
            count: snapshot.length,
            account: state.storageId,
          },
        );

        return result;
      });

  return state.localWritePromise.then(
    () => state.localMemoriesCache,
  );
};

export const saveLocalMemories = (
  accountId,
  memories,
) =>
  runTrackedOperation(
    accountId,
    (state, generation) =>
      writeLocalMemories(
        state,
        memories,
        generation,
      ),
  );

const findLocalMemoryIndex = (
  memories,
  memory,
) => {
  const keys = new Set(getMemoryKeys(memory));

  if (!keys.size) return -1;

  return memories.findIndex((item) =>
    getMemoryKeys(item).some((key) =>
      keys.has(key),
    ),
  );
};

export const upsertLocalMemory = (
  accountId,
  memory,
) =>
  runTrackedOperation(
    accountId,
    async (state, generation) => {
      const ownedMemory = assertRecordOwner(
        memory,
        state.accountId,
        "Local memory",
      );

      const current = await getLocalMemories(
        state.accountId,
      );

      assertOperationActive(state, generation);

      const next = current.slice();

      const index = findLocalMemoryIndex(
        next,
        ownedMemory,
      );

      if (index >= 0) {
        next[index] = {
          ...next[index],
          ...ownedMemory,
        };
      } else {
        next.unshift(ownedMemory);
      }

      return writeLocalMemories(
        state,
        next,
        generation,
      );
    },
  );

export const upsertLocalMemories = (
  accountId,
  memories,
) =>
  runTrackedOperation(
    accountId,
    async (state, generation) => {
      if (
        !Array.isArray(memories) ||
        memories.length === 0
      ) {
        return getLocalMemories(state.accountId);
      }

      const startedAt = perfNow();

      const incoming = memories.map((memory) =>
        assertRecordOwner(
          memory,
          state.accountId,
          "Local memory",
        ),
      );

      const current = await getLocalMemories(
        state.accountId,
      );

      assertOperationActive(state, generation);

      const next = current.slice();

      const existingIndex = new Map();

      for (
        let index = 0;
        index < next.length;
        index += 1
      ) {
        for (const key of getMemoryKeys(next[index])) {
          existingIndex.set(key, index);
        }
      }

      const newRecords = [];
      const newRecordIndex = new Map();

      for (const memory of incoming) {
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
            const newIndex =
              matchedIndex - next.length;

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
          newRecordIndex.set(
            key,
            next.length + newIndex,
          );
        }
      }

      const result = [
        ...newRecords.reverse(),
        ...next,
      ];

      logPerf(
        "Build local memory upsert batch",
        startedAt,
        {
          incoming: incoming.length,
          existing: current.length,
          newRecords: newRecords.length,
          account: state.storageId,
        },
      );

      return writeLocalMemories(
        state,
        result,
        generation,
      );
    },
  );

export const reconcileLocalMemories = (
  accountId,
  {
    serverMemories = [],
    pendingMemories = [],
    pendingOperations = [],
  } = {},
) =>
  runTrackedOperation(
    accountId,
    async (state, generation) => {
      if (!Array.isArray(serverMemories)) {
        throw new Error(
          "Cannot reconcile local memories without a complete server list.",
        );
      }

      const startedAt = perfNow();

      const safePendingMemories =
        pendingMemories.map((memory) =>
          assertRecordOwner(
            memory,
            state.accountId,
            "Pending memory",
          ),
        );

      const safePendingOperations =
        pendingOperations.map((operation) =>
          assertRecordOwner(
            operation,
            state.accountId,
            "Pending operation",
          ),
        );

      const serverKeys = new Set(
        serverMemories.flatMap(getMemoryKeys),
      );

      const pendingCreateKeys = new Set(
        safePendingMemories.flatMap(getMemoryKeys),
      );

      const pendingDeleteKeys = new Set();
      const pendingMutationKeys = new Set();

      for (const operation of safePendingOperations) {
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

      const current = await getLocalMemories(
        state.accountId,
      );

      assertOperationActive(state, generation);

      const retained = current.filter((memory) => {
        const keys = getMemoryKeys(memory);

        if (
          keys.some((key) =>
            pendingDeleteKeys.has(key),
          )
        ) {
          return false;
        }

        if (
          keys.some((key) =>
            serverKeys.has(key),
          )
        ) {
          return true;
        }

        if (
          keys.some((key) =>
            pendingCreateKeys.has(key),
          )
        ) {
          return true;
        }

        if (
          keys.some((key) =>
            pendingMutationKeys.has(key),
          )
        ) {
          return true;
        }

        return (
          memory.syncStatus === "pending" ||
          memory.syncReady === false ||
          memory.hasPendingChanges === true
        );
      });

      await writeLocalMemories(
        state,
        retained,
        generation,
      );

      logPerf(
        "Reconcile local memories",
        startedAt,
        {
          before: current.length,
          after: retained.length,
          removed: current.length - retained.length,
          account: state.storageId,
        },
      );

      return retained;
    },
  );

export const removeLocalMemory = (
  accountId,
  memoryId,
  clientMemoryId = null,
) =>
  runTrackedOperation(
    accountId,
    async (state, generation) => {
      const current = await getLocalMemories(
        state.accountId,
      );

      assertOperationActive(state, generation);

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

      return writeLocalMemories(
        state,
        next,
        generation,
      );
    },
  );

export const removeLocalMemories = (
  accountId,
  memories,
) =>
  runTrackedOperation(
    accountId,
    async (state, generation) => {
      if (!Array.isArray(memories)) {
        return getLocalMemories(state.accountId);
      }

      const ids = new Set(
        memories.flatMap((memory) =>
          getMemoryKeys(memory),
        ),
      );

      if (!ids.size) {
        return getLocalMemories(state.accountId);
      }

      const current = await getLocalMemories(
        state.accountId,
      );

      assertOperationActive(state, generation);

      return writeLocalMemories(
        state,
        current.filter(
          (memory) =>
            !getMemoryKeys(memory).some((key) =>
              ids.has(key),
            ),
        ),
        generation,
      );
    },
  );

export const clearLocalMemories = (
  accountId,
) =>
  runTrackedOperation(
    accountId,
    (state, generation) => {
      state.localMemoriesCache = [];

      state.localWritePromise =
        state.localWritePromise
          .catch(() => {})
          .then(() => {
            if (
              state.clearing ||
              generation !== state.generation
            ) {
              return;
            }

            return AsyncStorage.removeItem(
              state.keys.localMemories,
            );
          });

      return state.localWritePromise;
    },
  );

export const getOfflineMemories = async (
  accountId,
) => {
  const state = getAccountState(accountId);

  if (state.clearing) return [];

  const generation = state.generation;

  const [local, pending] = await Promise.all([
    getLocalMemories(state.accountId),
    getPendingMemories(state.accountId),
  ]);

  if (
    state.clearing ||
    generation !== state.generation
  ) {
    return [];
  }

  if (!local.length && !pending.length) {
    return [];
  }

  const unique = [];
  const seenKeys = new Set();

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

export const getPendingMemoryOperations = async (
  accountId,
) => {
  const state = getAccountState(accountId);

  if (state.clearing) return [];

  if (state.pendingOperationsCache !== null) {
    return state.pendingOperationsCache;
  }

  const generation = state.generation;

  try {
    const raw = await AsyncStorage.getItem(
      state.keys.pendingOperations,
    );

    if (
      state.clearing ||
      generation !== state.generation
    ) {
      return [];
    }

    if (!raw) {
      state.pendingOperationsCache = [];
      return state.pendingOperationsCache;
    }

    const parsed = JSON.parse(raw);

    const records = Array.isArray(parsed)
      ? parsed
      : [];

    state.pendingOperationsCache = records
      .filter(
        (operation) =>
          !operation?.ownerAccountId ||
          String(operation.ownerAccountId) ===
            state.accountId,
      )
      .map((operation) => ({
        ...operation,
        ownerAccountId: state.accountId,
      }));

    return state.pendingOperationsCache;
  } catch (error) {
    if (
      state.clearing ||
      generation !== state.generation
    ) {
      return [];
    }

    console.error(
      "Get pending memory operations error:",
      error,
    );

    state.pendingOperationsCache = [];

    return state.pendingOperationsCache;
  }
};

const writePendingMemoryOperations = (
  state,
  operations,
  generation,
) => {
  if (state.clearing) {
    return Promise.resolve([]);
  }

  const snapshot = Array.isArray(operations)
    ? operations.map((operation) =>
        assertRecordOwner(
          operation,
          state.accountId,
          "Pending operation",
        ),
      )
    : [];

  state.pendingOperationsCache = snapshot;

  state.pendingOperationsWritePromise =
    state.pendingOperationsWritePromise
      .catch(() => {})
      .then(() => {
        if (
          state.clearing ||
          generation !== state.generation
        ) {
          return;
        }

        return AsyncStorage.setItem(
          state.keys.pendingOperations,
          JSON.stringify(snapshot),
        );
      });

  return state.pendingOperationsWritePromise.then(
    () => state.pendingOperationsCache,
  );
};

const getOperationMemoryKey = (operation) =>
  String(
    operation?.clientMemoryId ||
      operation?.memoryId ||
      "",
  );

export const addPendingMemoryOperation = (
  accountId,
  operation,
) =>
  runTrackedOperation(
    accountId,
    async (state, generation) => {
      const ownedOperation = assertRecordOwner(
        operation,
        state.accountId,
        "Pending operation",
      );

      const allowedTypes = [
        "update",
        "favorite",
        "delete",
      ];

      if (
        !ownedOperation.type ||
        !allowedTypes.includes(ownedOperation.type)
      ) {
        throw new Error(
          "Unsupported pending memory operation.",
        );
      }

      const targetKey =
        getOperationMemoryKey(ownedOperation);

      if (!targetKey) {
        throw new Error(
          "A memory ID is required for a queued operation.",
        );
      }

      const now = Date.now();

      const normalized = {
        ...ownedOperation,

        operationId:
          ownedOperation.operationId ||
          `mutation-${now}-${Math.random()
            .toString(36)
            .slice(2, 10)}`,

        createdAt: ownedOperation.createdAt || now,
        updatedAt: now,

        ownerAccountId: state.accountId,
      };

      const current =
        await getPendingMemoryOperations(
          state.accountId,
        );

      assertOperationActive(state, generation);

      let next = current.slice();

      if (normalized.type === "delete") {
        next = next.filter(
          (item) =>
            getOperationMemoryKey(item) !== targetKey,
        );

        next.push(normalized);

        return writePendingMemoryOperations(
          state,
          next,
          generation,
        );
      }

      const existingIndex = next.findIndex(
        (item) =>
          getOperationMemoryKey(item) === targetKey &&
          item.type === normalized.type,
      );

      if (existingIndex >= 0) {
        const existing = next[existingIndex];

        next[existingIndex] = {
          ...existing,
          ...normalized,

          operationId: normalized.operationId,
          createdAt: now,

          payload:
            normalized.type === "update"
              ? {
                  ...(existing.payload || {}),
                  ...(normalized.payload || {}),
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

      return writePendingMemoryOperations(
        state,
        next,
        generation,
      );
    },
  );

export const removePendingMemoryOperation = (
  accountId,
  operationId,
) =>
  runTrackedOperation(
    accountId,
    async (state, generation) => {
      const current =
        await getPendingMemoryOperations(
          state.accountId,
        );

      assertOperationActive(state, generation);

      return writePendingMemoryOperations(
        state,
        current.filter(
          (operation) =>
            operation.operationId !== operationId,
        ),
        generation,
      );
    },
  );

export const clearPendingMemoryOperations = (
  accountId,
) =>
  runTrackedOperation(
    accountId,
    (state, generation) => {
      state.pendingOperationsCache = [];

      state.pendingOperationsWritePromise =
        state.pendingOperationsWritePromise
          .catch(() => {})
          .then(() => {
            if (
              state.clearing ||
              generation !== state.generation
            ) {
              return;
            }

            return AsyncStorage.removeItem(
              state.keys.pendingOperations,
            );
          });

      return state.pendingOperationsWritePromise;
    },
  );

export const clearAllOfflineMemoryData = async (
  accountId,
) => {
  const state = getAccountState(accountId);

  if (state.clearPromise) {
    return state.clearPromise;
  }

  state.clearing = true;
  state.generation += 1;

  state.pendingMemoriesCache = [];
  state.localMemoriesCache = [];
  state.pendingOperationsCache = [];

  const activeOperations = [
    ...state.activeOperations,
  ];

  const pendingWrites = [
    state.pendingWritePromise,
    state.localWritePromise,
    state.pendingOperationsWritePromise,
  ];

  const directorySetup = state.directoryPromise;

  let cleanupSucceeded = false;

  const cleanupPromise = (async () => {
    await Promise.allSettled([
      ...activeOperations,
      ...pendingWrites,
      ...(directorySetup ? [directorySetup] : []),
    ]);

    await Promise.allSettled([
      state.pendingWritePromise,
      state.localWritePromise,
      state.pendingOperationsWritePromise,
    ]);

    const cleanupTasks = [
      AsyncStorage.multiRemove([
        state.keys.pendingMemories,
        state.keys.localMemories,
        state.keys.pendingOperations,
      ]),
    ];

    if (state.imagesDirectory) {
      cleanupTasks.push(
        FileSystem.deleteAsync(
          state.imagesDirectory,
          { idempotent: true },
        ),
      );
    }

    const results = await Promise.allSettled(
      cleanupTasks,
    );

    const errors = results
      .filter(
        (result) => result.status === "rejected",
      )
      .map((result) => result.reason);

    state.pendingMemoriesCache = [];
    state.localMemoriesCache = [];
    state.pendingOperationsCache = [];

    state.directoryPromise = null;

    state.pendingWritePromise = Promise.resolve();
    state.localWritePromise = Promise.resolve();

    state.pendingOperationsWritePromise =
      Promise.resolve();

    if (errors.length > 0) {
      console.error(
        "Some account-scoped offline memory data could not be cleared:",
        errors,
      );

      throw new Error(
        "Unable to clear this account's offline memory data.",
      );
    }

    cleanupSucceeded = true;

    return {
      success: true,
      accountId: state.accountId,
    };
  })();

  state.clearPromise = cleanupPromise;

  try {
    return await cleanupPromise;
  } finally {
    if (state.clearPromise === cleanupPromise) {
      state.clearPromise = null;
    }

    if (cleanupSucceeded) {
      state.clearing = false;

      accountStates.delete(state.storageId);
    }
  }
};

export const LEGACY_OFFLINE_STORAGE_KEYS =
  Object.freeze({
    pendingMemories: LEGACY_PENDING_MEMORIES_KEY,
    localMemories: LEGACY_LOCAL_MEMORIES_KEY,
    pendingOperations: LEGACY_PENDING_OPERATIONS_KEY,
  });

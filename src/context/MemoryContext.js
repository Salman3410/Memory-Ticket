
import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { useAuth } from "../hooks/useAuth";

import {
  getNetworkInfo,
  addNetworkListener,
} from "../services/networkService";

import { getCurrentLocation } from "../services/locationService";

import {
  getMemories as getMemoriesApi,
  createMemory as createMemoryApi,
  updateMemory as updateMemoryApi,
  deleteMemory as deleteMemoryApi,
  deleteAllMemories as deleteAllMemoriesApi,
  toggleFavorite as toggleFavoriteApi,
} from "../api/memoryApi";

import {
  generateClientMemoryId,
  persistMemoryImages as persistMemoryImagesForAccount,
  getPendingMemories as getPendingMemoriesForAccount,
  getLocalMemories as getLocalMemoriesForAccount,
  getPendingMemoryOperations as getPendingMemoryOperationsForAccount,
  addPendingMemoryOperation as addPendingMemoryOperationForAccount,
  removePendingMemoryOperation as removePendingMemoryOperationForAccount,
  clearPendingMemoryOperations as clearPendingMemoryOperationsForAccount,
  addPendingMemory as addPendingMemoryForAccount,
  removePendingMemory as removePendingMemoryForAccount,
  getOfflineMemories as getOfflineMemoriesForAccount,
  upsertLocalMemory as upsertLocalMemoryForAccount,
  upsertLocalMemories as upsertLocalMemoriesForAccount,
  removeLocalMemory as removeLocalMemoryForAccount,
  clearLocalMemories as clearLocalMemoriesForAccount,
  reconcileLocalMemories as reconcileLocalMemoriesForAccount,
} from "../services/offlineMemoryService";

import {
  normalizeTicketCustomization,
} from "../utils/ticketCustomization";

export const MemoryContext = createContext(null);

// --------------------------------------------------
// NETWORK HELPERS
// --------------------------------------------------

const isNetworkOnline = (networkInfo) =>
  Boolean(
    networkInfo &&
      networkInfo.isConnected === true &&
      networkInfo.isInternetReachable !== false,
  );

// --------------------------------------------------
// PERFORMANCE HELPERS
// --------------------------------------------------

const perfNow = () =>
  globalThis.performance?.now?.() ?? Date.now();

const logPerf = (label, startedAt, details = {}) => {
  if (!__DEV__) return;

  console.log(`[Memento Perf] ${label}`, {
    durationMs: Number((perfNow() - startedAt).toFixed(1)),
    ...details,
  });
};

// --------------------------------------------------
// MEMORY ID HELPERS
// --------------------------------------------------

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

const findMatchingMemory = (memoryMap, memory) => {
  for (const key of getMemoryKeys(memory)) {
    const match = memoryMap.get(key);

    if (match) return match;
  }

  return null;
};

// --------------------------------------------------
// MEMORY IMAGE HELPERS
// --------------------------------------------------

const getMemoryImageUris = (memory) => {
  if (
    Array.isArray(memory?.images) &&
    memory.images.length
  ) {
    return memory.images
      .filter(
        (uri) =>
          typeof uri === "string" &&
          uri.length > 0,
      )
      .slice(0, 5);
  }

  if (
    typeof memory?.image === "string" &&
    memory.image
  ) {
    return [memory.image];
  }

  return [];
};

// --------------------------------------------------
// MEMORY PROVIDER
// --------------------------------------------------

export function MemoryProvider({ children }) {
  const {
    token,
    user,
    loading: authLoading,
  } = useAuth();

  const rawAccountId =
    user?._id ??
    user?.id ??
    null;

  const accountId =
    rawAccountId !== null &&
    rawAccountId !== undefined
      ? String(rawAccountId).trim() || null
      : null;

  const [memories, setMemories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [loadedAccountId, setLoadedAccountId] = useState(null);

  // --------------------------------------------------
  // LATEST MEMORY REFERENCE
  // --------------------------------------------------

  // Keeps the latest memory list available to callbacks
  // without waiting for another React render.
  const memoriesRef = useRef(memories);

  memoriesRef.current = memories;

  // --------------------------------------------------
  // ACCOUNT-SCOPED STORAGE
  // --------------------------------------------------

  const accountStorage = useMemo(() => {
    const requireAccountId = () => {
      if (!accountId) {
        throw new Error(
          "A valid authenticated account ID is required for offline storage.",
        );
      }

      return accountId;
    };

    return {
      persistMemoryImages: (memory) =>
        persistMemoryImagesForAccount(
          requireAccountId(),
          memory,
        ),

      getPendingMemories: () =>
        getPendingMemoriesForAccount(
          requireAccountId(),
        ),

      getLocalMemories: () =>
        getLocalMemoriesForAccount(
          requireAccountId(),
        ),

      getPendingMemoryOperations: () =>
        getPendingMemoryOperationsForAccount(
          requireAccountId(),
        ),

      addPendingMemoryOperation: (operation) =>
        addPendingMemoryOperationForAccount(
          requireAccountId(),
          operation,
        ),

      removePendingMemoryOperation: (operationId) =>
        removePendingMemoryOperationForAccount(
          requireAccountId(),
          operationId,
        ),

      clearPendingMemoryOperations: () =>
        clearPendingMemoryOperationsForAccount(
          requireAccountId(),
        ),

      addPendingMemory: (memory) =>
        addPendingMemoryForAccount(
          requireAccountId(),
          memory,
        ),

      removePendingMemory: (clientMemoryId) =>
        removePendingMemoryForAccount(
          requireAccountId(),
          clientMemoryId,
        ),

      getOfflineMemories: () =>
        getOfflineMemoriesForAccount(
          requireAccountId(),
        ),

      upsertLocalMemory: (memory) =>
        upsertLocalMemoryForAccount(
          requireAccountId(),
          memory,
        ),

      upsertLocalMemories: (memoryList) =>
        upsertLocalMemoriesForAccount(
          requireAccountId(),
          memoryList,
        ),

      removeLocalMemory: (
        memoryId,
        clientMemoryId = null,
      ) =>
        removeLocalMemoryForAccount(
          requireAccountId(),
          memoryId,
          clientMemoryId,
        ),

      clearLocalMemories: () =>
        clearLocalMemoriesForAccount(
          requireAccountId(),
        ),

      reconcileLocalMemories: (options) =>
        reconcileLocalMemoriesForAccount(
          requireAccountId(),
          options,
        ),
    };
  }, [accountId]);

  // --------------------------------------------------
  // SESSION VALIDATION
  // --------------------------------------------------

  const currentSessionRef = useRef({
    token,
    accountId,
  });

  currentSessionRef.current = {
    token,
    accountId,
  };

  const isCurrentSession = useCallback(
    (
      expectedToken,
      expectedAccountId = accountId,
    ) =>
      Boolean(
        expectedToken &&
          expectedAccountId,
      ) &&
      currentSessionRef.current.token ===
        expectedToken &&
      currentSessionRef.current.accountId ===
        expectedAccountId,
    [accountId],
  );

  // --------------------------------------------------
  // ASYNC OPERATION REFERENCES
  // --------------------------------------------------

  const syncPromiseRef = useRef(null);
  const syncRequestedRef = useRef(false);
  const refreshPromiseRef = useRef(null);

  const preparingMemoryIdsRef = useRef(new Set());
  const cancelledMemoryIdsRef = useRef(new Set());

  const previousSessionRef = useRef({
    token,
    accountId,
  });

  // --------------------------------------------------
  // HANDLE ACCOUNT CHANGES
  // --------------------------------------------------

  useEffect(() => {
    const previousSession =
      previousSessionRef.current;

    if (
      previousSession.token === token &&
      previousSession.accountId === accountId
    ) {
      return;
    }

    previousSessionRef.current = {
      token,
      accountId,
    };

    syncRequestedRef.current = false;
    syncPromiseRef.current = null;
    refreshPromiseRef.current = null;

    preparingMemoryIdsRef.current.clear();
    cancelledMemoryIdsRef.current.clear();

    // Clear the reference immediately so memories from
    // the previous account cannot be opened.
    memoriesRef.current = [];

    setMemories([]);
    setLoadedAccountId(null);
    setSyncing(false);
    setLoading(Boolean(token && accountId));
  }, [token, accountId]);

  // --------------------------------------------------
  // NORMALIZE MEMORY
  // --------------------------------------------------

  const normalizeMemory = useCallback((memory) => {
    if (!memory) return null;

    const images =
      Array.isArray(memory.images) &&
      memory.images.length
        ? memory.images
        : memory.image
          ? [memory.image]
          : [];

    const tags = Array.isArray(memory.tags)
      ? [
          ...new Set(
            memory.tags
              .filter(
                (tag) =>
                  typeof tag === "string",
              )
              .map((tag) =>
                tag
                  .trim()
                  .replace(/^#+/, "")
                  .toLowerCase(),
              )
              .filter(Boolean)
              .slice(0, 20),
          ),
        ]
      : [];

    const customization =
      normalizeTicketCustomization(memory);

    return {
      ...memory,

      id:
        memory._id ||
        memory.id ||
        memory.clientMemoryId,

      images,
      image: images[0] || null,
      tags,

      favorite:
        memory.isFavorite === true ||
        (
          memory.isFavorite == null &&
          memory.favorite === true
        ),

      locationData: memory.locationData || null,

      environment: {
        ...(memory.environment || {}),
        network:
          memory.network ||
          memory.environment?.network ||
          null,
      },

      ticketStyle: customization.ticketStyle,
      ticketAccent: customization.ticketAccent,

      ticketOptions: {
        ...customization.ticketOptions,
      },

      imagePublicIds: Array.isArray(
        memory.imagePublicIds,
      )
        ? memory.imagePublicIds
        : [],

      syncStatus:
        memory.syncStatus || "synced",
    };
  }, []);

  // --------------------------------------------------
  // MERGE SERVER, LOCAL AND PENDING MEMORIES
  // --------------------------------------------------

  const mergeMemories = useCallback(
    (
      serverMemories,
      localMemories,
      pendingMemories,
    ) => {
      const localMap = new Map();

      for (const memory of localMemories) {
        for (const key of getMemoryKeys(memory)) {
          localMap.set(key, memory);
        }
      }

      const mergedServer = serverMemories
        .map((memory) => {
          const local = findMatchingMemory(
            localMap,
            memory,
          );

          const normalized =
            normalizeMemory(memory);

          if (!normalized) return null;

          if (
            !normalized.localImages?.length &&
            local?.localImages?.length
          ) {
            normalized.localImages =
              local.localImages;
          }

          if (
            !Object.prototype.hasOwnProperty.call(
              memory,
              "tags",
            ) &&
            Array.isArray(local?.tags)
          ) {
            normalized.tags = local.tags;
          }

          if (
            !Object.prototype.hasOwnProperty.call(
              memory,
              "ticketStyle",
            ) &&
            local?.ticketStyle
          ) {
            normalized.ticketStyle =
              local.ticketStyle;
          }

          if (
            !Object.prototype.hasOwnProperty.call(
              memory,
              "ticketAccent",
            ) &&
            local?.ticketAccent
          ) {
            normalized.ticketAccent =
              local.ticketAccent;
          }

          if (
            !Object.prototype.hasOwnProperty.call(
              memory,
              "ticketOptions",
            ) &&
            local?.ticketOptions
          ) {
            normalized.ticketOptions = {
              ...local.ticketOptions,
            };
          }

          return normalized;
        })
        .filter(Boolean);

      const serverKeys = new Set(
        mergedServer.flatMap((memory) =>
          getMemoryKeys(memory),
        ),
      );

      const remainingPending = pendingMemories
        .filter(
          (memory) =>
            !getMemoryKeys(memory).some((key) =>
              serverKeys.has(key),
            ),
        )
        .map((memory) => {
          const normalized =
            normalizeMemory(memory);

          if (!normalized) return null;

          if (memory.localImages?.length) {
            normalized.images =
              memory.localImages;

            normalized.image =
              memory.localImages[0] || null;

            normalized.localImages =
              memory.localImages;
          }

          return normalized;
        })
        .filter(Boolean);

      return [
        ...remainingPending,
        ...mergedServer,
      ];
    },
    [normalizeMemory],
  );

  // --------------------------------------------------
  // LOAD LOCAL MEMORIES
  // --------------------------------------------------

  const loadLocalMemories = useCallback(async () => {
    if (
      !token ||
      !accountId ||
      !isCurrentSession(token)
    ) {
      return [];
    }

    const startedAt = perfNow();

    try {
      const [
        offlineMemories,
        pendingOperations,
      ] = await Promise.all([
        accountStorage.getOfflineMemories(),
        accountStorage.getPendingMemoryOperations(),
      ]);

      if (!isCurrentSession(token)) {
        return [];
      }

      const pendingDeleteKeys = new Set(
        pendingOperations
          .filter(
            (operation) =>
              operation.type === "delete",
          )
          .flatMap((operation) =>
            [
              operation.clientMemoryId,
              operation.memoryId,
            ]
              .filter(Boolean)
              .map(String),
          ),
      );

      const visibleMemories =
        offlineMemories.filter(
          (memory) =>
            !getMemoryKeys(memory).some((key) =>
              pendingDeleteKeys.has(key),
            ),
        );

      const normalized = visibleMemories
        .map((memory) => {
          const result =
            normalizeMemory(memory);

          if (
            result &&
            memory.localImages?.length
          ) {
            result.images =
              memory.localImages;

            result.image =
              memory.localImages[0] || null;

            result.localImages =
              memory.localImages;
          }

          return result;
        })
        .filter(Boolean);

      if (!isCurrentSession(token)) {
        return [];
      }

      memoriesRef.current = normalized;
      setMemories(normalized);

      logPerf("Load local memories", startedAt, {
        count: normalized.length,
        accountId,
      });

      return normalized;
    } catch (error) {
      if (isCurrentSession(token)) {
        console.error(
          "Load local memories error:",
          error,
        );
      }

      return [];
    }
  }, [
    token,
    accountId,
    accountStorage,
    normalizeMemory,
    isCurrentSession,
  ]);

  // --------------------------------------------------
  // REFRESH SERVER MEMORIES
  // --------------------------------------------------

  const refreshServerMemories = useCallback(async () => {
    if (
      !token ||
      !accountId ||
      !isCurrentSession(token)
    ) {
      return false;
    }

    const existingRefresh =
      refreshPromiseRef.current;

    if (
      existingRefresh?.token === token &&
      existingRefresh?.accountId === accountId
    ) {
      return existingRefresh.promise;
    }

    const refreshEntry = {
      token,
      accountId,
      promise: null,
    };

    const refreshPromise = (async () => {
      const refreshStartedAt = perfNow();

      try {
        const apiStartedAt = perfNow();

        const result = await getMemoriesApi(token);

        if (!isCurrentSession(token)) {
          return false;
        }

        logPerf(
          "Fetch server memories",
          apiStartedAt,
          {
            success: result?.success === true,
            count: Array.isArray(
              result?.data?.memories,
            )
              ? result.data.memories.length
              : 0,
            accountId,
          },
        );

        if (!result?.success) {
          return false;
        }

        if (
          !Array.isArray(
            result.data?.memories,
          )
        ) {
          console.warn(
            "Cannot reconcile memories: server response did not contain a valid memory array.",
          );

          return false;
        }

        const backendMemories =
          result.data.memories;

        const [
          localMemories,
          pendingMemories,
          pendingOperations,
        ] = await Promise.all([
          accountStorage.getLocalMemories(),
          accountStorage.getPendingMemories(),
          accountStorage.getPendingMemoryOperations(),
        ]);

        if (!isCurrentSession(token)) {
          return false;
        }

        const pendingDeleteKeys = new Set(
          pendingOperations
            .filter(
              (operation) =>
                operation.type === "delete",
            )
            .flatMap((operation) =>
              [
                operation.clientMemoryId,
                operation.memoryId,
              ]
                .filter(Boolean)
                .map(String),
            ),
        );

        const visibleServerMemories =
          backendMemories.filter(
            (memory) =>
              !getMemoryKeys(memory).some((key) =>
                pendingDeleteKeys.has(key),
              ),
          );

        const localMap = new Map();

        for (const memory of localMemories) {
          for (const key of getMemoryKeys(memory)) {
            localMap.set(key, memory);
          }
        }

        const imageCacheStartedAt = perfNow();

        let totalServerImages = 0;
        let imageCacheFailures = 0;

        for (const memory of visibleServerMemories) {
          totalServerImages +=
            getMemoryImageUris(memory).length;
        }

        const serverMemoriesWithCachedImages = [];
        const batchSize = 3;

        for (
          let offset = 0;
          offset < visibleServerMemories.length;
          offset += batchSize
        ) {
          if (!isCurrentSession(token)) {
            return false;
          }

          const batch =
            visibleServerMemories.slice(
              offset,
              offset + batchSize,
            );

          const cachedBatch = await Promise.all(
            batch.map(async (memory) => {
              if (!isCurrentSession(token)) {
                return null;
              }

              const local = findMatchingMemory(
                localMap,
                memory,
              );

              const sourceImages =
                getMemoryImageUris(memory);

              if (!sourceImages.length) {
                return {
                  ...memory,
                  localImages:
                    local?.localImages || [],
                };
              }

              try {
                const { localImages } =
                  await accountStorage.persistMemoryImages({
                    ...memory,

                    clientMemoryId:
                      memory.clientMemoryId ||
                      memory._id ||
                      memory.id,

                    images: sourceImages,
                  });

                if (!isCurrentSession(token)) {
                  return null;
                }

                return {
                  ...memory,
                  localImages,
                };
              } catch (error) {
                if (!isCurrentSession(token)) {
                  return null;
                }

                imageCacheFailures += 1;

                console.warn(
                  `Unable to cache images for memory ${
                    memory._id ||
                    memory.id ||
                    "unknown"
                  }:`,
                  error,
                );

                return {
                  ...memory,
                  localImages:
                    local?.localImages || [],
                };
              }
            }),
          );

          if (!isCurrentSession(token)) {
            return false;
          }

          serverMemoriesWithCachedImages.push(
            ...cachedBatch.filter(Boolean),
          );
        }

        logPerf(
          "Cache server images",
          imageCacheStartedAt,
          {
            memories: visibleServerMemories.length,
            images: totalServerImages,
            failedMemories: imageCacheFailures,
            accountId,
          },
        );

        if (!isCurrentSession(token)) {
          return false;
        }

        const pendingMutationKeys = new Set();

        for (const operation of pendingOperations) {
          if (operation.type === "delete") {
            continue;
          }

          if (operation.clientMemoryId) {
            pendingMutationKeys.add(
              String(operation.clientMemoryId),
            );
          }

          if (operation.memoryId) {
            pendingMutationKeys.add(
              String(operation.memoryId),
            );
          }
        }

        const normalizedServer =
          serverMemoriesWithCachedImages
            .map((memory) => {
              const normalized =
                normalizeMemory(memory);

              if (!normalized) return null;

              const local = findMatchingMemory(
                localMap,
                memory,
              );

              const keys =
                getMemoryKeys(memory);

              const hasQueuedMutation =
                keys.some((key) =>
                  pendingMutationKeys.has(key),
                );

              if (local && hasQueuedMutation) {
                Object.assign(normalized, local, {
                  id: normalized.id || local.id,

                  _id:
                    normalized._id || local._id,

                  clientMemoryId:
                    local.clientMemoryId ||
                    normalized.clientMemoryId,

                  localImages:
                    memory.localImages?.length
                      ? memory.localImages
                      : local.localImages || [],

                  hasPendingChanges: true,
                });
              }

              if (
                !Object.prototype.hasOwnProperty.call(
                  memory,
                  "tags",
                ) &&
                Array.isArray(local?.tags)
              ) {
                normalized.tags = local.tags;
              }

              if (
                !Object.prototype.hasOwnProperty.call(
                  memory,
                  "ticketStyle",
                ) &&
                local?.ticketStyle
              ) {
                normalized.ticketStyle =
                  local.ticketStyle;
              }

              if (
                !Object.prototype.hasOwnProperty.call(
                  memory,
                  "ticketAccent",
                ) &&
                local?.ticketAccent
              ) {
                normalized.ticketAccent =
                  local.ticketAccent;
              }

              if (
                !Object.prototype.hasOwnProperty.call(
                  memory,
                  "ticketOptions",
                ) &&
                local?.ticketOptions
              ) {
                normalized.ticketOptions = {
                  ...local.ticketOptions,
                };
              }

              return normalized;
            })
            .filter(Boolean);

        const serverWithLocalImages =
          normalizedServer.map((memory) => {
            const local = findMatchingMemory(
              localMap,
              memory,
            );

            const localImages =
              memory.localImages?.length
                ? memory.localImages
                : local?.localImages || [];

            return localImages.length
              ? {
                  ...memory,
                  localImages,
                }
              : memory;
          });

        const visiblePendingMemories =
          pendingMemories.filter(
            (memory) =>
              !getMemoryKeys(memory).some((key) =>
                pendingDeleteKeys.has(key),
              ),
          );

        const mergeStartedAt = perfNow();

        const merged = mergeMemories(
          serverWithLocalImages,
          localMemories,
          visiblePendingMemories,
        );

        if (!isCurrentSession(token)) {
          return false;
        }

        // Important: update the ref immediately.
        // ensureMemoryAvailable can now locate a memory
        // as soon as this refresh promise resolves.
        memoriesRef.current = merged;

        setMemories(merged);

        logPerf(
          "Merge server and local memories",
          mergeStartedAt,
          {
            server: serverWithLocalImages.length,
            local: localMemories.length,
            pending: visiblePendingMemories.length,
            merged: merged.length,
            accountId,
          },
        );

        const storageStartedAt = perfNow();

        await accountStorage.upsertLocalMemories(
          serverWithLocalImages.map((memory) => ({
            ...memory,
            syncStatus: "synced",
          })),
        );

        if (!isCurrentSession(token)) {
          return false;
        }

        logPerf(
          "Persist server memories locally",
          storageStartedAt,
          {
            count: serverWithLocalImages.length,
            accountId,
          },
        );

        const reconcileStartedAt = perfNow();

        const reconciledLocalMemories =
          await accountStorage.reconcileLocalMemories({
            serverMemories: backendMemories,
            pendingMemories,
            pendingOperations,
          });

        if (!isCurrentSession(token)) {
          return false;
        }

        logPerf(
          "Reconcile local cache",
          reconcileStartedAt,
          {
            remaining: reconciledLocalMemories.length,
            accountId,
          },
        );

        return true;
      } catch (error) {
        if (isCurrentSession(token)) {
          console.error(
            "Refresh server memories error:",
            error,
          );
        }

        return false;
      } finally {
        logPerf(
          "Refresh server memories total",
          refreshStartedAt,
          { accountId },
        );
      }
    })();

    refreshEntry.promise = refreshPromise;
    refreshPromiseRef.current = refreshEntry;

    try {
      return await refreshPromise;
    } finally {
      if (
        refreshPromiseRef.current === refreshEntry
      ) {
        refreshPromiseRef.current = null;
      }
    }
  }, [
    token,
    accountId,
    accountStorage,
    normalizeMemory,
    mergeMemories,
    isCurrentSession,
  ]);

  // --------------------------------------------------
  // LOAD MEMORIES
  // --------------------------------------------------

  const loadMemories = useCallback(async () => {
    if (!token || !accountId) {
      memoriesRef.current = [];

      setMemories([]);
      setLoadedAccountId(null);
      setLoading(false);
      setSyncing(false);

      return;
    }

    if (!isCurrentSession(token)) {
      return;
    }

    const startedAt = perfNow();

    setLoading(true);
    setLoadedAccountId(null);

    try {
      await loadLocalMemories();

      if (!isCurrentSession(token)) {
        return;
      }

      setLoadedAccountId(accountId);
      setLoading(false);

      const network = await getNetworkInfo().catch(
        () => null,
      );

      if (!isCurrentSession(token)) {
        return;
      }

      if (isNetworkOnline(network)) {
        await refreshServerMemories();
      }
    } catch (error) {
      if (isCurrentSession(token)) {
        console.error(
          "Load memories error:",
          error,
        );

        setLoadedAccountId(accountId);
      }
    } finally {
      if (isCurrentSession(token)) {
        setLoading(false);
      }

      logPerf(
        "Load memories total",
        startedAt,
        { accountId },
      );
    }
  }, [
    token,
    accountId,
    loadLocalMemories,
    refreshServerMemories,
    isCurrentSession,
  ]);

  // --------------------------------------------------
  // SYNC SINGLE MEMORY
  // --------------------------------------------------

  const syncMemory = useCallback(
    async (pendingMemory) => {
      if (
        !token ||
        !accountId ||
        !isCurrentSession(token) ||
        !pendingMemory ||
        pendingMemory.syncReady === false
      ) {
        return null;
      }

      if (
        pendingMemory.ownerAccountId &&
        String(pendingMemory.ownerAccountId) !== accountId
      ) {
        console.error(
          "Rejected pending memory belonging to another account.",
        );

        return null;
      }

      const clientMemoryId =
        pendingMemory.clientMemoryId;

      if (!clientMemoryId) {
        console.error(
          "Cannot sync memory without clientMemoryId.",
        );

        return null;
      }

      try {
        const result = await createMemoryApi(
          token,
          pendingMemory,
        );

        if (!isCurrentSession(token)) {
          return null;
        }

        if (!result.success) {
          console.error(
            "Memory sync failed:",
            result.message,
          );

          return null;
        }

        const serverMemory = result.data?.memory;

        const savedMemory =
          normalizeMemory(serverMemory);

        if (!savedMemory) {
          console.error(
            "Server did not return the created memory.",
          );

          return null;
        }

        if (
          !Object.prototype.hasOwnProperty.call(
            serverMemory || {},
            "tags",
          ) &&
          Array.isArray(pendingMemory.tags)
        ) {
          const normalizedTags = normalizeMemory({
            tags: pendingMemory.tags,
          });

          savedMemory.tags =
            normalizedTags?.tags || [];
        }

        const customization =
          normalizeTicketCustomization(
            pendingMemory,
          );

        if (
          !Object.prototype.hasOwnProperty.call(
            serverMemory || {},
            "ticketStyle",
          )
        ) {
          savedMemory.ticketStyle =
            customization.ticketStyle;
        }

        if (
          !Object.prototype.hasOwnProperty.call(
            serverMemory || {},
            "ticketAccent",
          )
        ) {
          savedMemory.ticketAccent =
            customization.ticketAccent;
        }

        if (
          !Object.prototype.hasOwnProperty.call(
            serverMemory || {},
            "ticketOptions",
          )
        ) {
          savedMemory.ticketOptions = {
            ...customization.ticketOptions,
          };
        }

        const syncedMemory = {
          ...savedMemory,
          clientMemoryId,

          localImages: Array.isArray(
            pendingMemory.localImages,
          )
            ? pendingMemory.localImages
            : [],

          syncReady: true,
          syncStatus: "synced",
        };

        if (!isCurrentSession(token)) {
          return null;
        }

        await accountStorage.upsertLocalMemory(
          syncedMemory,
        );

        if (!isCurrentSession(token)) {
          return null;
        }

        await accountStorage.removePendingMemory(
          clientMemoryId,
        );

        if (!isCurrentSession(token)) {
          return null;
        }

        setMemories((current) => {
          if (!isCurrentSession(token)) {
            return current;
          }

          const index = current.findIndex(
            (memory) =>
              memory.clientMemoryId === clientMemoryId ||
              memory.id === clientMemoryId ||
              memory.id === syncedMemory.id,
          );

          const next =
            index === -1
              ? [syncedMemory, ...current]
              : current.map(
                  (memory, currentIndex) =>
                    currentIndex === index
                      ? syncedMemory
                      : memory,
                );

          memoriesRef.current = next;

          return next;
        });

        return syncedMemory;
      } catch (error) {
        if (isCurrentSession(token)) {
          console.error(
            "Sync memory error:",
            error,
          );
        }

        return null;
      }
    },
    [
      token,
      accountId,
      accountStorage,
      normalizeMemory,
      isCurrentSession,
    ],
  );

  // --------------------------------------------------
  // SYNC PENDING MUTATIONS
  // --------------------------------------------------

  const syncPendingMutations = useCallback(async () => {
    if (
      !token ||
      !accountId ||
      !isCurrentSession(token)
    ) {
      return;
    }

    const operations =
      await accountStorage.getPendingMemoryOperations();

    if (
      !isCurrentSession(token) ||
      !operations.length
    ) {
      return;
    }

    const accountOperations = operations.filter(
      (operation) =>
        !operation.ownerAccountId ||
        String(operation.ownerAccountId) === accountId,
    );

    let localMemories =
      await accountStorage.getLocalMemories();

    if (!isCurrentSession(token)) {
      return;
    }

    let pendingCreates =
      await accountStorage.getPendingMemories();

    if (!isCurrentSession(token)) {
      return;
    }

    for (const operation of accountOperations) {
      if (!isCurrentSession(token)) {
        return;
      }

      if (
        operation.ownerAccountId &&
        String(operation.ownerAccountId) !== accountId
      ) {
        console.error(
          "Rejected queued mutation belonging to another account.",
        );

        continue;
      }

      const operationKeys = new Set(
        [
          operation.clientMemoryId,
          operation.memoryId,
        ]
          .filter(Boolean)
          .map(String),
      );

      const createStillPending =
        pendingCreates.some(
          (memory) =>
            operation.clientMemoryId &&
            memory.clientMemoryId ===
              operation.clientMemoryId,
        );

      if (createStillPending) {
        continue;
      }

      const localMemory = localMemories.find(
        (memory) =>
          getMemoryKeys(memory).some((key) =>
            operationKeys.has(key),
          ),
      );

      const targetMemoryId =
        localMemory?._id ||
        localMemory?.id ||
        operation.memoryId;

      if (!targetMemoryId) {
        console.warn(
          "Deferring a queued mutation without a server ID.",
          operation,
        );

        continue;
      }

      try {
        let result;

        if (operation.type === "update") {
          result = await updateMemoryApi(
            token,
            targetMemoryId,
            operation.payload || {},
          );
        } else if (
          operation.type === "favorite"
        ) {
          result = await toggleFavoriteApi(
            token,
            targetMemoryId,
            operation.favorite === true,
          );
        } else if (operation.type === "delete") {
          result = await deleteMemoryApi(
            token,
            targetMemoryId,
          );
        } else {
          console.warn(
            "Unknown queued memory operation:",
            operation.type,
          );

          break;
        }

        if (!isCurrentSession(token)) {
          return;
        }

        if (!result?.success) {
          console.warn(
            `Memory ${operation.type} sync failed:`,
            result?.message ||
              "Unknown API error.",
          );

          break;
        }

        if (operation.type === "delete") {
          await accountStorage.removeLocalMemory(
            targetMemoryId,
            operation.clientMemoryId || null,
          );

          if (!isCurrentSession(token)) {
            return;
          }

          setMemories((current) => {
            if (!isCurrentSession(token)) {
              return current;
            }

            const next = current.filter(
              (memory) =>
                !getMemoryKeys(memory).some((key) =>
                  operationKeys.has(key),
                ),
            );

            memoriesRef.current = next;

            return next;
          });
        } else {
          const serverMemory = result.data?.memory;

          const normalizedServerMemory =
            normalizeMemory(serverMemory);

          if (!normalizedServerMemory) {
            console.warn(
              "Mutation response did not include a memory record.",
            );

            break;
          }

          const syncedMemory = {
            ...(localMemory || {}),
            ...normalizedServerMemory,

            clientMemoryId:
              operation.clientMemoryId ||
              localMemory?.clientMemoryId,

            localImages:
              localMemory?.localImages || [],

            hasPendingChanges: false,
            syncStatus: "synced",
          };

          if (
            !Object.prototype.hasOwnProperty.call(
              serverMemory || {},
              "tags",
            ) &&
            Array.isArray(localMemory?.tags)
          ) {
            syncedMemory.tags = localMemory.tags;
          }

          if (
            !Object.prototype.hasOwnProperty.call(
              serverMemory || {},
              "isFavorite",
            ) &&
            !Object.prototype.hasOwnProperty.call(
              serverMemory || {},
              "favorite",
            ) &&
            localMemory
          ) {
            syncedMemory.favorite =
              localMemory.favorite === true;

            syncedMemory.isFavorite =
              localMemory.favorite === true;
          }

          if (
            !Array.isArray(serverMemory?.images) ||
            serverMemory.images.length === 0
          ) {
            syncedMemory.images =
              localMemory?.images || [];

            syncedMemory.image =
              syncedMemory.images[0] || null;
          }

          if (
            !Object.prototype.hasOwnProperty.call(
              serverMemory || {},
              "ticketStyle",
            ) &&
            localMemory?.ticketStyle
          ) {
            syncedMemory.ticketStyle =
              localMemory.ticketStyle;
          }

          if (
            !Object.prototype.hasOwnProperty.call(
              serverMemory || {},
              "ticketAccent",
            ) &&
            localMemory?.ticketAccent
          ) {
            syncedMemory.ticketAccent =
              localMemory.ticketAccent;
          }

          if (
            !Object.prototype.hasOwnProperty.call(
              serverMemory || {},
              "ticketOptions",
            ) &&
            localMemory?.ticketOptions
          ) {
            syncedMemory.ticketOptions = {
              ...localMemory.ticketOptions,
            };
          }

          if (!isCurrentSession(token)) {
            return;
          }

          await accountStorage.upsertLocalMemory(
            syncedMemory,
          );

          if (!isCurrentSession(token)) {
            return;
          }

          setMemories((current) => {
            if (!isCurrentSession(token)) {
              return current;
            }

            const index = current.findIndex(
              (memory) =>
                getMemoryKeys(memory).some(
                  (key) =>
                    operationKeys.has(key) ||
                    key === String(
                      syncedMemory.id ||
                        syncedMemory._id ||
                        "",
                    ),
                ),
            );

            const next =
              index === -1
                ? [syncedMemory, ...current]
                : current.map(
                    (memory, currentIndex) =>
                      currentIndex === index
                        ? syncedMemory
                        : memory,
                  );

            memoriesRef.current = next;

            return next;
          });
        }

        if (!isCurrentSession(token)) {
          return;
        }

        await accountStorage.removePendingMemoryOperation(
          operation.operationId,
        );

        if (!isCurrentSession(token)) {
          return;
        }

        localMemories =
          await accountStorage.getLocalMemories();

        if (!isCurrentSession(token)) {
          return;
        }

        pendingCreates =
          await accountStorage.getPendingMemories();

        if (!isCurrentSession(token)) {
          return;
        }
      } catch (error) {
        if (isCurrentSession(token)) {
          console.error(
            `Sync memory ${operation.type} operation error:`,
            error,
          );
        }

        break;
      }
    }
  }, [
    token,
    accountId,
    accountStorage,
    normalizeMemory,
    isCurrentSession,
  ]);

  // --------------------------------------------------
  // RUN SYNC QUEUE PASS
  // --------------------------------------------------

  const runSyncQueuePass = useCallback(async () => {
    if (
      !token ||
      !accountId ||
      !isCurrentSession(token)
    ) {
      return;
    }

    const network = await getNetworkInfo().catch(
      (error) => {
        if (isCurrentSession(token)) {
          console.warn(
            "Unable to check network before sync:",
            error,
          );
        }

        return null;
      },
    );

    if (!isCurrentSession(token)) {
      return;
    }

    if (!isNetworkOnline(network)) {
      return;
    }

    let pending =
      await accountStorage.getPendingMemories();

    if (!isCurrentSession(token)) {
      return;
    }

    for (const memory of pending) {
      if (!isCurrentSession(token)) {
        return;
      }

      if (
        memory.ownerAccountId &&
        String(memory.ownerAccountId) !== accountId
      ) {
        console.error(
          "Rejected pending create belonging to another account.",
        );

        continue;
      }

      if (
        memory.syncReady !== false ||
        !memory.clientMemoryId ||
        preparingMemoryIdsRef.current.has(
          memory.clientMemoryId,
        )
      ) {
        continue;
      }

      const sourceImages =
        Array.isArray(memory.images) &&
        memory.images.length
          ? memory.images
          : Array.isArray(memory.localImages)
            ? memory.localImages
            : [];

      if (!sourceImages.length) {
        continue;
      }

      try {
        const { localImages } =
          await accountStorage.persistMemoryImages({
            ...memory,
            images: sourceImages,
            clientMemoryId:
              memory.clientMemoryId,
          });

        if (!isCurrentSession(token)) {
          return;
        }

        const readyMemory = {
          ...memory,
          images: localImages,
          localImages,
          syncReady: true,
          syncStatus: "pending",
        };

        await accountStorage.upsertLocalMemory(
          readyMemory,
        );

        if (!isCurrentSession(token)) {
          return;
        }

        await accountStorage.addPendingMemory(
          readyMemory,
        );

        if (!isCurrentSession(token)) {
          return;
        }

        setMemories((current) => {
          if (!isCurrentSession(token)) {
            return current;
          }

          const next = current.map((item) =>
            item.clientMemoryId ===
              readyMemory.clientMemoryId ||
            item.id === readyMemory.clientMemoryId
              ? {
                  ...item,
                  images: localImages,
                  image: localImages[0] || null,
                  localImages,
                  syncReady: true,
                  syncStatus: "pending",
                }
              : item,
          );

          memoriesRef.current = next;

          return next;
        });
      } catch (error) {
        if (isCurrentSession(token)) {
          console.warn(
            `Unable to recover images for ${memory.clientMemoryId}:`,
            error,
          );
        }
      }
    }

    if (!isCurrentSession(token)) {
      return;
    }

    pending =
      await accountStorage.getPendingMemories();

    if (!isCurrentSession(token)) {
      return;
    }

    const readyPending = pending.filter(
      (memory) =>
        memory.syncReady !== false &&
        (
          (
            Array.isArray(memory.localImages) &&
            memory.localImages.length > 0
          ) ||
          (
            Array.isArray(memory.images) &&
            memory.images.length > 0
          )
        ),
    );

    for (const pendingMemory of readyPending) {
      if (!isCurrentSession(token)) {
        return;
      }

      if (
        pendingMemory.ownerAccountId &&
        String(pendingMemory.ownerAccountId) !== accountId
      ) {
        continue;
      }

      const synced = await syncMemory(
        pendingMemory,
      );

      if (!isCurrentSession(token)) {
        return;
      }

      if (!synced) {
        break;
      }
    }

    if (!isCurrentSession(token)) {
      return;
    }

    await syncPendingMutations();
  }, [
    token,
    accountId,
    accountStorage,
    syncMemory,
    syncPendingMutations,
    isCurrentSession,
  ]);

  // --------------------------------------------------
  // SYNC PENDING MEMORIES
  // --------------------------------------------------

  const syncPendingMemories = useCallback(async () => {
    if (
      !token ||
      !accountId ||
      !isCurrentSession(token)
    ) {
      return;
    }

    const existingSync = syncPromiseRef.current;

    if (
      existingSync?.token === token &&
      existingSync?.accountId === accountId
    ) {
      syncRequestedRef.current = true;

      await existingSync.promise;

      return;
    }

    const syncEntry = {
      token,
      accountId,
      promise: null,
    };

    const activePromise = (async () => {
      if (!isCurrentSession(token)) {
        return;
      }

      setSyncing(true);

      try {
        do {
          if (!isCurrentSession(token)) {
            break;
          }

          syncRequestedRef.current = false;

          await runSyncQueuePass();
        } while (
          isCurrentSession(token) &&
          syncRequestedRef.current
        );
      } catch (error) {
        if (isCurrentSession(token)) {
          console.error(
            "Sync pending memories error:",
            error,
          );
        }
      } finally {
        if (isCurrentSession(token)) {
          setSyncing(false);
        }
      }
    })();

    syncEntry.promise = activePromise;
    syncPromiseRef.current = syncEntry;

    try {
      await activePromise;
    } finally {
      if (syncPromiseRef.current === syncEntry) {
        syncPromiseRef.current = null;
      }
    }
  }, [
    token,
    accountId,
    runSyncQueuePass,
    isCurrentSession,
  ]);

  // --------------------------------------------------
  // INITIAL LOAD
  // --------------------------------------------------

  useEffect(() => {
    if (authLoading) return;

    void loadMemories();
  }, [
    authLoading,
    token,
    accountId,
    loadMemories,
  ]);

  // --------------------------------------------------
  // NETWORK LISTENER
  // --------------------------------------------------

  useEffect(() => {
    if (
      authLoading ||
      !token ||
      !accountId
    ) {
      return undefined;
    }

    const listenerToken = token;
    const listenerAccountId = accountId;

    const subscription = addNetworkListener(
      (networkInfo) => {
        if (
          !isCurrentSession(
            listenerToken,
            listenerAccountId,
          )
        ) {
          return;
        }

        if (!isNetworkOnline(networkInfo)) {
          return;
        }

        void (async () => {
          await syncPendingMemories();

          if (
            !isCurrentSession(
              listenerToken,
              listenerAccountId,
            )
          ) {
            return;
          }

          await refreshServerMemories();
        })();
      },
    );

    void syncPendingMemories();

    return () => {
      subscription?.remove?.();
    };
  }, [
    authLoading,
    token,
    accountId,
    syncPendingMemories,
    refreshServerMemories,
    isCurrentSession,
  ]);

  // --------------------------------------------------
  // ADD MEMORY
  // --------------------------------------------------

  const addMemory = useCallback(
    async (memory) => {
      if (
        !token ||
        !accountId ||
        !isCurrentSession(token)
      ) {
        throw new Error(
          "You must be logged in to create a memory.",
        );
      }

      try {
        const originalImages =
          Array.isArray(memory?.images)
            ? memory.images.slice(0, 5)
            : memory?.image
              ? [memory.image]
              : [];

        if (!originalImages.length) {
          throw new Error(
            "At least one image is required.",
          );
        }

        const clientMemoryId =
          memory?.clientMemoryId ||
          generateClientMemoryId();

        const networkPromise =
          getNetworkInfo().catch((error) => {
            if (isCurrentSession(token)) {
              console.warn(
                "Network info error:",
                error,
              );
            }

            return null;
          });

        const locationPromise = memory?.locationData
          ? Promise.resolve(memory.locationData)
          : getCurrentLocation().catch((error) => {
              if (isCurrentSession(token)) {
                console.warn(
                  "Location capture failed:",
                  error,
                );
              }

              return null;
            });

        const [
          networkResult,
          locationResult,
        ] = await Promise.all([
          networkPromise,
          locationPromise,
        ]);

        if (!isCurrentSession(token)) {
          throw new Error(
            "Your session has ended.",
          );
        }

        const customization =
          normalizeTicketCustomization(memory);

        const localMemoryData = {
          ...memory,
          clientMemoryId,

          location:
            typeof memory?.location === "string"
              ? memory.location.trim()
              : "",

          locationData:
            locationResult || null,

          network:
            memory?.network ||
            memory?.environment?.network ||
            networkResult ||
            null,

          images: originalImages,
          localImages: originalImages,

          syncStatus: "pending",
          syncReady: false,

          ticketStyle: customization.ticketStyle,
          ticketAccent: customization.ticketAccent,

          ticketOptions: {
            ...customization.ticketOptions,
          },
        };

        const localMemory =
          normalizeMemory(localMemoryData);

        if (!localMemory) {
          throw new Error(
            "Unable to prepare local memory.",
          );
        }

        if (!isCurrentSession(token)) {
          throw new Error(
            "Your session has ended.",
          );
        }

        setMemories((current) => {
          const next = [
            localMemory,
            ...current,
          ];

          memoriesRef.current = next;

          return next;
        });

        preparingMemoryIdsRef.current.add(
          clientMemoryId,
        );

        try {
          await accountStorage.addPendingMemory(
            localMemoryData,
          );

          if (!isCurrentSession(token)) {
            throw new Error(
              "Your session has ended.",
            );
          }

          await accountStorage.upsertLocalMemory(
            localMemoryData,
          );

          if (!isCurrentSession(token)) {
            throw new Error(
              "Your session has ended.",
            );
          }
        } catch (storageError) {
          preparingMemoryIdsRef.current.delete(
            clientMemoryId,
          );

          throw storageError;
        }

        void (async () => {
          try {
            if (!isCurrentSession(token)) {
              return;
            }

            const { localImages } =
              await accountStorage.persistMemoryImages({
                ...localMemoryData,
                images: originalImages,
                clientMemoryId,
              });

            if (
              !isCurrentSession(token) ||
              cancelledMemoryIdsRef.current.has(
                clientMemoryId,
              )
            ) {
              return;
            }

            const currentQueue =
              await accountStorage.getPendingMemories();

            if (!isCurrentSession(token)) {
              return;
            }

            const currentQueuedMemory =
              currentQueue.find(
                (item) =>
                  item.clientMemoryId ===
                  clientMemoryId,
              );

            const persistedMemory = {
              ...localMemoryData,
              ...(currentQueuedMemory || {}),

              images: localImages,
              localImages,

              syncReady: true,
              syncStatus: "pending",
            };

            await accountStorage.upsertLocalMemory(
              persistedMemory,
            );

            if (!isCurrentSession(token)) {
              return;
            }

            await accountStorage.addPendingMemory(
              persistedMemory,
            );

            if (!isCurrentSession(token)) {
              return;
            }

            setMemories((current) => {
              const next = current.map((item) =>
                item.clientMemoryId === clientMemoryId ||
                item.id === clientMemoryId
                  ? {
                      ...item,
                      ...persistedMemory,

                      images: localImages,
                      image: localImages[0] || null,
                      localImages,

                      syncReady: true,
                      syncStatus: "pending",
                    }
                  : item,
              );

              memoriesRef.current = next;

              return next;
            });

            if (!isCurrentSession(token)) {
              return;
            }

            await syncPendingMemories();
          } catch (error) {
            if (isCurrentSession(token)) {
              console.error(
                "Background memory preparation failed:",
                error,
              );

              setMemories((current) => {
                const next = current.map((item) =>
                  item.clientMemoryId === clientMemoryId ||
                  item.id === clientMemoryId
                    ? {
                        ...item,
                        syncReady: false,
                        syncStatus: "pending",
                      }
                    : item,
                );

                memoriesRef.current = next;

                return next;
              });
            }
          } finally {
            preparingMemoryIdsRef.current.delete(
              clientMemoryId,
            );

            cancelledMemoryIdsRef.current.delete(
              clientMemoryId,
            );
          }
        })();

        return localMemory;
      } catch (error) {
        if (isCurrentSession(token)) {
          console.error(
            "Add memory error:",
            error,
          );
        }

        throw error;
      }
    },
    [
      token,
      accountId,
      accountStorage,
      normalizeMemory,
      syncPendingMemories,
      isCurrentSession,
    ],
  );

  // --------------------------------------------------
  // UPDATE MEMORY
  // --------------------------------------------------

  const updateMemory = useCallback(
    async (memoryId, updatedData) => {
      if (
        !token ||
        !accountId ||
        !isCurrentSession(token)
      ) {
        throw new Error(
          "You must be logged in.",
        );
      }

      if (!memoryId) {
        throw new Error(
          "Memory ID is required.",
        );
      }

      const existingMemory = memoriesRef.current.find(
        (memory) =>
          getMemoryKeys(memory).includes(String(memoryId)),
      );

      if (!existingMemory) {
        throw new Error(
          "Memory not found.",
        );
      }

      const customization =
        normalizeTicketCustomization({
          ...existingMemory,
          ...updatedData,
        });

      const finalUpdatedData = {
        ...updatedData,

        ticketStyle: customization.ticketStyle,
        ticketAccent: customization.ticketAccent,

        ticketOptions: {
          ...customization.ticketOptions,
        },
      };

      const pendingCreates =
        await accountStorage.getPendingMemories();

      if (!isCurrentSession(token)) {
        throw new Error(
          "Your session has ended.",
        );
      }

      const isPendingCreate = Boolean(
        existingMemory.clientMemoryId &&
          pendingCreates.some(
            (memory) =>
              memory.clientMemoryId ===
              existingMemory.clientMemoryId,
          ),
      );

      const updatedMemory = normalizeMemory({
        ...existingMemory,
        ...finalUpdatedData,

        id: existingMemory.id,
        _id: existingMemory._id,

        clientMemoryId:
          existingMemory.clientMemoryId,

        localImages:
          existingMemory.localImages || [],

        syncStatus: isPendingCreate
          ? "pending"
          : "synced",

        syncReady: existingMemory.syncReady,
        hasPendingChanges: !isPendingCreate,
      });

      if (!updatedMemory) {
        throw new Error(
          "Unable to prepare updated memory.",
        );
      }

      if (!isCurrentSession(token)) {
        throw new Error(
          "Your session has ended.",
        );
      }

      await accountStorage.upsertLocalMemory(
        updatedMemory,
      );

      if (!isCurrentSession(token)) {
        throw new Error(
          "Your session has ended.",
        );
      }

      if (isPendingCreate) {
        await accountStorage.addPendingMemory(
          updatedMemory,
        );
      } else {
        await accountStorage.addPendingMemoryOperation({
          type: "update",

          memoryId:
            existingMemory._id ||
            existingMemory.id,

          clientMemoryId:
            existingMemory.clientMemoryId || null,

          payload: finalUpdatedData,
        });
      }

      if (!isCurrentSession(token)) {
        throw new Error(
          "Your session has ended.",
        );
      }

      setMemories((current) => {
        const next = current.map((memory) =>
          getMemoryKeys(memory).some(
            (key) => key === String(memoryId),
          )
            ? updatedMemory
            : memory,
        );

        memoriesRef.current = next;

        return next;
      });

      if (!isPendingCreate) {
        await syncPendingMemories();
      }

      if (!isCurrentSession(token)) {
        throw new Error(
          "Your session has ended.",
        );
      }

      return updatedMemory;
    },
    [
      token,
      accountId,
      accountStorage,
      normalizeMemory,
      syncPendingMemories,
      isCurrentSession,
    ],
  );

  // --------------------------------------------------
  // DELETE MEMORY
  // --------------------------------------------------

  const deleteMemory = useCallback(
    async (memoryId) => {
      if (
        !token ||
        !accountId ||
        !isCurrentSession(token)
      ) {
        throw new Error(
          "You must be logged in.",
        );
      }

      if (!memoryId) {
        throw new Error(
          "Memory ID is required.",
        );
      }

      const existingMemory = memoriesRef.current.find(
        (memory) =>
          getMemoryKeys(memory).includes(String(memoryId)),
      );

      const clientMemoryId =
        existingMemory?.clientMemoryId || null;

      const pendingCreates =
        await accountStorage.getPendingMemories();

      if (!isCurrentSession(token)) {
        throw new Error(
          "Your session has ended.",
        );
      }

      const isPendingCreate = Boolean(
        clientMemoryId &&
          pendingCreates.some(
            (memory) =>
              memory.clientMemoryId ===
              clientMemoryId,
          ),
      );

      const activeSync = syncPromiseRef.current;

      const isCurrentAccountSync =
        activeSync?.token === token &&
        activeSync?.accountId === accountId;

      if (
        isPendingCreate &&
        !isCurrentAccountSync
      ) {
        if (
          preparingMemoryIdsRef.current.has(
            clientMemoryId,
          )
        ) {
          cancelledMemoryIdsRef.current.add(
            clientMemoryId,
          );
        }

        await accountStorage.removePendingMemory(
          clientMemoryId,
        );

        if (!isCurrentSession(token)) {
          throw new Error(
            "Your session has ended.",
          );
        }

        await accountStorage.removeLocalMemory(
          existingMemory?.id || memoryId,
          clientMemoryId,
        );

        if (!isCurrentSession(token)) {
          throw new Error(
            "Your session has ended.",
          );
        }

        setMemories((current) => {
          const next = current.filter(
            (memory) =>
              memory.clientMemoryId !==
                clientMemoryId &&
              memory.id !==
                (existingMemory?.id || memoryId),
          );

          memoriesRef.current = next;

          return next;
        });

        return true;
      }

      await accountStorage.addPendingMemoryOperation({
        type: "delete",

        memoryId:
          existingMemory?._id ||
          existingMemory?.id ||
          memoryId,

        clientMemoryId,
      });

      if (!isCurrentSession(token)) {
        throw new Error(
          "Your session has ended.",
        );
      }

      await accountStorage.removeLocalMemory(
        existingMemory?.id || memoryId,
        clientMemoryId,
      );

      if (!isCurrentSession(token)) {
        throw new Error(
          "Your session has ended.",
        );
      }

      setMemories((current) => {
        const next = current.filter(
          (memory) =>
            !getMemoryKeys(memory).some(
              (key) =>
                key === String(memoryId) ||
                (
                  clientMemoryId &&
                  key === String(clientMemoryId)
                ),
            ),
        );

        memoriesRef.current = next;

        return next;
      });

      await syncPendingMemories();

      if (!isCurrentSession(token)) {
        throw new Error(
          "Your session has ended.",
        );
      }

      return true;
    },
    [
      token,
      accountId,
      accountStorage,
      syncPendingMemories,
      isCurrentSession,
    ],
  );

  // --------------------------------------------------
  // TOGGLE FAVORITE
  // --------------------------------------------------

  const toggleFavorite = useCallback(
    async (memoryId) => {
      if (
        !token ||
        !accountId ||
        !isCurrentSession(token)
      ) {
        throw new Error(
          "You must be logged in.",
        );
      }

      const existingMemory = memoriesRef.current.find(
        (memory) =>
          getMemoryKeys(memory).includes(String(memoryId)),
      );

      if (!existingMemory) {
        throw new Error(
          "Memory not found.",
        );
      }

      const nextFavorite =
        !existingMemory.favorite;

      const optimisticMemory = {
        ...existingMemory,
        favorite: nextFavorite,
        isFavorite: nextFavorite,
      };

      const pendingCreates =
        await accountStorage.getPendingMemories();

      if (!isCurrentSession(token)) {
        throw new Error(
          "Your session has ended.",
        );
      }

      const isPendingCreate = Boolean(
        existingMemory.clientMemoryId &&
          pendingCreates.some(
            (memory) =>
              memory.clientMemoryId ===
              existingMemory.clientMemoryId,
          ),
      );

      if (isPendingCreate) {
        const pendingMemory = {
          ...optimisticMemory,
          syncStatus: "pending",
          syncReady: existingMemory.syncReady,
        };

        await accountStorage.upsertLocalMemory(
          pendingMemory,
        );

        if (!isCurrentSession(token)) {
          throw new Error(
            "Your session has ended.",
          );
        }

        await accountStorage.addPendingMemory(
          pendingMemory,
        );

        if (!isCurrentSession(token)) {
          throw new Error(
            "Your session has ended.",
          );
        }

        setMemories((current) => {
          const next = current.map((memory) =>
            getMemoryKeys(memory).some(
              (key) => key === String(memoryId),
            )
              ? pendingMemory
              : memory,
          );

          memoriesRef.current = next;

          return next;
        });

        return pendingMemory;
      }

      const locallyUpdated = {
        ...optimisticMemory,
        hasPendingChanges: true,
        syncStatus: "synced",
      };

      await accountStorage.upsertLocalMemory(
        locallyUpdated,
      );

      if (!isCurrentSession(token)) {
        throw new Error(
          "Your session has ended.",
        );
      }

      await accountStorage.addPendingMemoryOperation({
        type: "favorite",

        memoryId:
          existingMemory._id ||
          existingMemory.id,

        clientMemoryId:
          existingMemory.clientMemoryId || null,

        favorite: nextFavorite,
      });

      if (!isCurrentSession(token)) {
        throw new Error(
          "Your session has ended.",
        );
      }

      setMemories((current) => {
        const next = current.map((memory) =>
          getMemoryKeys(memory).some(
            (key) => key === String(memoryId),
          )
            ? locallyUpdated
            : memory,
        );

        memoriesRef.current = next;

        return next;
      });

      await syncPendingMemories();

      if (!isCurrentSession(token)) {
        throw new Error(
          "Your session has ended.",
        );
      }

      return locallyUpdated;
    },
    [
      token,
      accountId,
      accountStorage,
      syncPendingMemories,
      isCurrentSession,
    ],
  );

  // --------------------------------------------------
  // GET MEMORY BY ID
  // --------------------------------------------------

  const getMemoryById = useCallback((memoryId) => {
    const targetId = String(memoryId ?? "").trim();

    if (!targetId) {
      return null;
    }

    return (
      memoriesRef.current.find((memory) =>
        getMemoryKeys(memory).some(
          (key) => key.trim() === targetId,
        ),
      ) || null
    );
  }, []);

  // --------------------------------------------------
  // ENSURE MEMORY IS AVAILABLE
  // --------------------------------------------------

  // Used by Ask Memento source-card navigation.
  //
  // 1. Check local and already-loaded memories.
  // 2. If missing, fetch the authenticated user's memories.
  // 3. Reconcile server and local data.
  // 4. Check again before allowing navigation.
  //
  // No memory is fetched by arbitrary ID. The server
  // response is restricted to the authenticated user.
  const ensureMemoryAvailable = useCallback(
    async (memoryId) => {
      const targetId = String(
        memoryId ?? "",
      ).trim();

      if (!targetId) {
        return {
          success: false,
          reason: "invalid_id",
          memory: null,
        };
      }

      // First check the current local collection.
      const existingMemory =
        getMemoryById(targetId);

      if (existingMemory) {
        return {
          success: true,
          reason: null,
          memory: existingMemory,
          refreshed: false,
        };
      }

      // Attempt to recover the missing memory from
      // the authenticated user's server collection.
      const refreshed =
        await refreshServerMemories();

      // Verify that the session did not change.
      if (
        !token ||
        !accountId ||
        !isCurrentSession(token)
      ) {
        return {
          success: false,
          reason: "session_changed",
          memory: null,
        };
      }

      // Check the ref immediately after refresh.
      const recoveredMemory =
        getMemoryById(targetId);

      if (recoveredMemory) {
        return {
          success: true,
          reason: null,
          memory: recoveredMemory,
          refreshed: true,
        };
      }

      return {
        success: false,
        reason: refreshed
          ? "not_found"
          : "refresh_failed",
        memory: null,
      };
    },
    [
      token,
      accountId,
      getMemoryById,
      refreshServerMemories,
      isCurrentSession,
    ],
  );

  // --------------------------------------------------
  // SYNC NOW
  // --------------------------------------------------

  const syncNow = useCallback(async () => {
    if (
      !token ||
      !accountId ||
      !isCurrentSession(token)
    ) {
      return;
    }

    await syncPendingMemories();
  }, [
    token,
    accountId,
    syncPendingMemories,
    isCurrentSession,
  ]);

  // --------------------------------------------------
  // CLEAR MEMORIES
  // --------------------------------------------------

  const clearMemories = useCallback(async () => {
    if (
      !token ||
      !accountId ||
      !isCurrentSession(token)
    ) {
      throw new Error(
        "You must be logged in.",
      );
    }

    const result = await deleteAllMemoriesApi(token);

    if (!isCurrentSession(token)) {
      throw new Error(
        "Your session has ended.",
      );
    }

    if (!result.success) {
      throw new Error(
        result.message ||
          "Unable to clear memory storage.",
      );
    }

    await accountStorage.clearLocalMemories();

    if (!isCurrentSession(token)) {
      throw new Error(
        "Your session has ended.",
      );
    }

    await accountStorage.clearPendingMemoryOperations();

    if (!isCurrentSession(token)) {
      throw new Error(
        "Your session has ended.",
      );
    }

    const pending =
      await accountStorage.getPendingMemories();

    if (!isCurrentSession(token)) {
      throw new Error(
        "Your session has ended.",
      );
    }

    await Promise.all(
      pending
        .filter(
          (memory) => memory.clientMemoryId,
        )
        .map((memory) =>
          accountStorage.removePendingMemory(
            memory.clientMemoryId,
          ),
        ),
    );

    if (!isCurrentSession(token)) {
      throw new Error(
        "Your session has ended.",
      );
    }

    memoriesRef.current = [];

    setMemories([]);

    return {
      success: true,
      deletedCount:
        result.data?.deletedCount || 0,
    };
  }, [
    token,
    accountId,
    accountStorage,
    isCurrentSession,
  ]);

  const contextValue = useMemo(
    () => ({
      accountId: loadedAccountId,

      memories,
      loading,
      syncing,

      addMemory,
      updateMemory,
      deleteMemory,
      toggleFavorite,

      getMemoryById,
      ensureMemoryAvailable,

      loadMemories,
      refreshMemories: loadMemories,

      syncNow,
      clearMemories,
    }),
    [
      loadedAccountId,
      memories,
      loading,
      syncing,

      addMemory,
      updateMemory,
      deleteMemory,
      toggleFavorite,

      getMemoryById,
      ensureMemoryAvailable,

      loadMemories,
      syncNow,
      clearMemories,
    ],
  );

  return (
    <MemoryContext.Provider value={contextValue}>
      {children}
    </MemoryContext.Provider>
  );
}

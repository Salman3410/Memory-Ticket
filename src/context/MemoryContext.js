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
  persistMemoryImages,
  getPendingMemories,
  getLocalMemories,
  getPendingMemoryOperations,
  addPendingMemoryOperation,
  removePendingMemoryOperation,
  clearPendingMemoryOperations,
  addPendingMemory,
  removePendingMemory,
  getOfflineMemories,
  upsertLocalMemory,
  upsertLocalMemories,
  removeLocalMemory,
  clearLocalMemories,
  reconcileLocalMemories,
} from "../services/offlineMemoryService";
import {
  normalizeTicketCustomization,
} from "../utils/ticketCustomization";

export const MemoryContext = createContext(null);

const isNetworkOnline = (networkInfo) =>
  Boolean(
    networkInfo &&
      networkInfo.isConnected === true &&
      networkInfo.isInternetReachable !== false,
  );

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

const findMatchingMemory = (memoryMap, memory) => {
  for (const key of getMemoryKeys(memory)) {
    const match = memoryMap.get(key);

    if (match) return match;
  }

  return null;
};

const getMemoryImageUris = (memory) => {
  if (Array.isArray(memory?.images) && memory.images.length) {
    return memory.images
      .filter(
        (uri) =>
          typeof uri === "string" &&
          uri.length > 0,
      )
      .slice(0, 5);
  }

  if (typeof memory?.image === "string" && memory.image) {
    return [memory.image];
  }

  return [];
};

export function MemoryProvider({ children }) {
  const {
    token,
    loading: authLoading,
  } = useAuth();

  const [memories, setMemories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  const currentTokenRef = useRef(token);
  currentTokenRef.current = token;

  const isCurrentSession = useCallback(
    (expectedToken) =>
      currentTokenRef.current === expectedToken,
    [],
  );

  const syncPromiseRef = useRef(null);
  const syncRequestedRef = useRef(false);
  const refreshPromiseRef = useRef(null);

  const preparingMemoryIdsRef = useRef(new Set());
  const cancelledMemoryIdsRef = useRef(new Set());

  const previousTokenRef = useRef(token);

  useEffect(() => {
    if (previousTokenRef.current === token) {
      return;
    }
    previousTokenRef.current = token;
    syncRequestedRef.current = false;
    syncPromiseRef.current = null;
    refreshPromiseRef.current = null;
    preparingMemoryIdsRef.current.clear();
    cancelledMemoryIdsRef.current.clear();
    setMemories([]);
    setSyncing(false);
    setLoading(Boolean(token));
  }, [token]);

  const normalizeMemory = useCallback((memory) => {
    if (!memory) return null;

    const images =
      Array.isArray(memory.images) && memory.images.length
        ? memory.images
        : memory.image
          ? [memory.image]
          : [];

    const tags = Array.isArray(memory.tags)
      ? [
          ...new Set(
            memory.tags
              .filter((tag) => typeof tag === "string")
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

      imagePublicIds: Array.isArray(memory.imagePublicIds)
        ? memory.imagePublicIds
        : [],

      syncStatus: memory.syncStatus || "synced",
    };
  }, []);

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

  const loadLocalMemories = useCallback(async () => {
    if (!token || !isCurrentSession(token)) {
      return [];
    }

    const startedAt = perfNow();

    try {
      const [
        offlineMemories,
        pendingOperations,
      ] = await Promise.all([
        getOfflineMemories(),
        getPendingMemoryOperations(),
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
            result.images = memory.localImages;

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

      setMemories(normalized);

      logPerf("Load local memories", startedAt, {
        count: normalized.length,
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
  }, [token, normalizeMemory, isCurrentSession]);

  const refreshServerMemories = useCallback(async () => {
    if (!token || !isCurrentSession(token)) {
      return false;
    }

    const existingRefresh = refreshPromiseRef.current;

    if (existingRefresh?.token === token) {
      return existingRefresh.promise;
    }

    const refreshEntry = {
      token,
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
          },
        );

        if (!result?.success) {
          return false;
        }

        if (!Array.isArray(result.data?.memories)) {
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
          getLocalMemories(),
          getPendingMemories(),
          getPendingMemoryOperations(),
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
                  await persistMemoryImages({
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

        setMemories(merged);

        logPerf(
          "Merge server and local memories",
          mergeStartedAt,
          {
            server: serverWithLocalImages.length,
            local: localMemories.length,
            pending: visiblePendingMemories.length,
            merged: merged.length,
          },
        );

        const storageStartedAt = perfNow();

        await upsertLocalMemories(
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
          },
        );

        const reconcileStartedAt = perfNow();

        const reconciledLocalMemories =
          await reconcileLocalMemories({
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
        );
      }
    })();

    refreshEntry.promise = refreshPromise;
    refreshPromiseRef.current = refreshEntry;

    try {
      return await refreshPromise;
    } finally {
      if (refreshPromiseRef.current === refreshEntry) {
        refreshPromiseRef.current = null;
      }
    }
  }, [
    token,
    normalizeMemory,
    mergeMemories,
    isCurrentSession,
  ]);

  const loadMemories = useCallback(async () => {
    if (!isCurrentSession(token)) {
      return;
    }

    if (!token) {
      setMemories([]);
      setLoading(false);
      setSyncing(false);
      return;
    }

    const startedAt = perfNow();

    setLoading(true);

    try {
      await loadLocalMemories();

      if (!isCurrentSession(token)) {
        return;
      }

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
        console.error("Load memories error:", error);
      }
    } finally {
      if (isCurrentSession(token)) {
        setLoading(false);
      }

      logPerf("Load memories total", startedAt);
    }
  }, [
    token,
    loadLocalMemories,
    refreshServerMemories,
    isCurrentSession,
  ]);

  const syncMemory = useCallback(
    async (pendingMemory) => {
      if (
        !token ||
        !isCurrentSession(token) ||
        !pendingMemory ||
        pendingMemory.syncReady === false
      ) {
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

        await upsertLocalMemory(syncedMemory);

        if (!isCurrentSession(token)) {
          return null;
        }

        await removePendingMemory(clientMemoryId);

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

          if (index === -1) {
            return [syncedMemory, ...current];
          }

          return current.map(
            (memory, currentIndex) =>
              currentIndex === index
                ? syncedMemory
                : memory,
          );
        });

        return syncedMemory;
      } catch (error) {
        if (isCurrentSession(token)) {
          console.error("Sync memory error:", error);
        }

        return null;
      }
    },
    [token, normalizeMemory, isCurrentSession],
  );

  const syncPendingMutations = useCallback(async () => {
    if (!token || !isCurrentSession(token)) {
      return;
    }

    const operations =
      await getPendingMemoryOperations();

    if (
      !isCurrentSession(token) ||
      !operations.length
    ) {
      return;
    }

    let localMemories = await getLocalMemories();

    if (!isCurrentSession(token)) {
      return;
    }

    let pendingCreates = await getPendingMemories();

    if (!isCurrentSession(token)) {
      return;
    }

    for (const operation of operations) {
      if (!isCurrentSession(token)) {
        return;
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
        } else if (operation.type === "favorite") {
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
            result?.message || "Unknown API error.",
          );

          break;
        }

        if (operation.type === "delete") {
          await removeLocalMemory(
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

            return current.filter(
              (memory) =>
                !getMemoryKeys(memory).some((key) =>
                  operationKeys.has(key),
                ),
            );
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

          await upsertLocalMemory(syncedMemory);

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

            if (index === -1) {
              return [syncedMemory, ...current];
            }

            return current.map(
              (memory, currentIndex) =>
                currentIndex === index
                  ? syncedMemory
                  : memory,
            );
          });
        }

        if (!isCurrentSession(token)) {
          return;
        }

        await removePendingMemoryOperation(
          operation.operationId,
        );

        if (!isCurrentSession(token)) {
          return;
        }

        localMemories = await getLocalMemories();

        if (!isCurrentSession(token)) {
          return;
        }

        pendingCreates = await getPendingMemories();

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
  }, [token, normalizeMemory, isCurrentSession]);

  const runSyncQueuePass = useCallback(async () => {
    if (!token || !isCurrentSession(token)) {
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

    let pending = await getPendingMemories();

    if (!isCurrentSession(token)) {
      return;
    }

    for (const memory of pending) {
      if (!isCurrentSession(token)) {
        return;
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
          await persistMemoryImages({
            ...memory,
            images: sourceImages,
            clientMemoryId: memory.clientMemoryId,
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

        await upsertLocalMemory(readyMemory);

        if (!isCurrentSession(token)) {
          return;
        }

        await addPendingMemory(readyMemory);

        if (!isCurrentSession(token)) {
          return;
        }

        setMemories((current) => {
          if (!isCurrentSession(token)) {
            return current;
          }

          return current.map((item) =>
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

    pending = await getPendingMemories();

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

      const synced = await syncMemory(pendingMemory);

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
    syncMemory,
    syncPendingMutations,
    isCurrentSession,
  ]);

  const syncPendingMemories = useCallback(async () => {
    if (!token || !isCurrentSession(token)) {
      return;
    }

    const existingSync = syncPromiseRef.current;

    if (existingSync?.token === token) {
      syncRequestedRef.current = true;
      await existingSync.promise;
      return;
    }

    const syncEntry = {
      token,
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
    runSyncQueuePass,
    isCurrentSession,
  ]);

  useEffect(() => {
    if (authLoading) return;

    void loadMemories();
  }, [authLoading, token, loadMemories]);

  useEffect(() => {
    if (authLoading || !token) {
      return undefined;
    }

    const listenerToken = token;

    const subscription = addNetworkListener(
      (networkInfo) => {
        if (!isCurrentSession(listenerToken)) {
          return;
        }

        if (!isNetworkOnline(networkInfo)) {
          return;
        }

        void (async () => {
          await syncPendingMemories();

          if (!isCurrentSession(listenerToken)) {
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
    syncPendingMemories,
    refreshServerMemories,
    isCurrentSession,
  ]);

  const addMemory = useCallback(
    async (memory) => {
      if (!token || !isCurrentSession(token)) {
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
              console.warn("Network info error:", error);
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
          throw new Error("Your session has ended.");
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

          locationData: locationResult || null,

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
          throw new Error("Your session has ended.");
        }

        setMemories((current) => {
          if (!isCurrentSession(token)) {
            return current;
          }

          return [
            localMemory,
            ...current,
          ];
        });

        preparingMemoryIdsRef.current.add(
          clientMemoryId,
        );

        try {
          await addPendingMemory(localMemoryData);

          if (!isCurrentSession(token)) {
            throw new Error("Your session has ended.");
          }

          await upsertLocalMemory(localMemoryData);

          if (!isCurrentSession(token)) {
            throw new Error("Your session has ended.");
          }
        } catch (storageError) {
          preparingMemoryIdsRef.current.delete(
            clientMemoryId,
          );

          throw storageError;
        }

        /*
         * Prepare images in the background. Every continuation
         * verifies that the token still belongs to this session
         * before writing local data or modifying React state.
         */
        void (async () => {
          try {
            if (!isCurrentSession(token)) {
              return;
            }

            const { localImages } =
              await persistMemoryImages({
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
              await getPendingMemories();

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

            await upsertLocalMemory(persistedMemory);

            if (!isCurrentSession(token)) {
              return;
            }

            await addPendingMemory(persistedMemory);

            if (!isCurrentSession(token)) {
              return;
            }

            setMemories((current) => {
              if (!isCurrentSession(token)) {
                return current;
              }

              return current.map((item) =>
                item.clientMemoryId ===
                  clientMemoryId ||
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

              setMemories((current) =>
                current.map((item) =>
                  item.clientMemoryId ===
                    clientMemoryId ||
                  item.id === clientMemoryId
                    ? {
                        ...item,
                        syncReady: false,
                        syncStatus: "pending",
                      }
                    : item,
                ),
              );
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
          console.error("Add memory error:", error);
        }

        throw error;
      }
    },
    [
      token,
      normalizeMemory,
      syncPendingMemories,
      isCurrentSession,
    ],
  );

  const updateMemory = useCallback(
    async (memoryId, updatedData) => {
      if (!token || !isCurrentSession(token)) {
        throw new Error("You must be logged in.");
      }

      if (!memoryId) {
        throw new Error("Memory ID is required.");
      }

      const existingMemory = memories.find(
        (memory) =>
          memory.id === memoryId ||
          memory.clientMemoryId === memoryId,
      );

      if (!existingMemory) {
        throw new Error("Memory not found.");
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
        await getPendingMemories();

      if (!isCurrentSession(token)) {
        throw new Error("Your session has ended.");
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
        throw new Error("Your session has ended.");
      }

      await upsertLocalMemory(updatedMemory);

      if (!isCurrentSession(token)) {
        throw new Error("Your session has ended.");
      }

      if (isPendingCreate) {
        await addPendingMemory(updatedMemory);
      } else {
        await addPendingMemoryOperation({
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
        throw new Error("Your session has ended.");
      }

      setMemories((current) => {
        if (!isCurrentSession(token)) {
          return current;
        }

        return current.map((memory) =>
          memory.id === memoryId ||
          memory.clientMemoryId === memoryId
            ? updatedMemory
            : memory,
        );
      });

      if (!isPendingCreate) {
        await syncPendingMemories();
      }

      if (!isCurrentSession(token)) {
        throw new Error("Your session has ended.");
      }

      return updatedMemory;
    },
    [
      token,
      memories,
      normalizeMemory,
      syncPendingMemories,
      isCurrentSession,
    ],
  );

  const deleteMemory = useCallback(
    async (memoryId) => {
      if (!token || !isCurrentSession(token)) {
        throw new Error("You must be logged in.");
      }

      if (!memoryId) {
        throw new Error("Memory ID is required.");
      }

      const existingMemory = memories.find(
        (memory) =>
          memory.id === memoryId ||
          memory.clientMemoryId === memoryId,
      );

      const clientMemoryId =
        existingMemory?.clientMemoryId || null;

      const pendingCreates =
        await getPendingMemories();

      if (!isCurrentSession(token)) {
        throw new Error("Your session has ended.");
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

      if (
        isPendingCreate &&
        activeSync?.token !== token
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

        await removePendingMemory(clientMemoryId);

        if (!isCurrentSession(token)) {
          throw new Error("Your session has ended.");
        }

        await removeLocalMemory(
          existingMemory?.id || memoryId,
          clientMemoryId,
        );

        if (!isCurrentSession(token)) {
          throw new Error("Your session has ended.");
        }

        setMemories((current) => {
          if (!isCurrentSession(token)) {
            return current;
          }

          return current.filter(
            (memory) =>
              memory.clientMemoryId !==
                clientMemoryId &&
              memory.id !==
                (existingMemory?.id || memoryId),
          );
        });

        return true;
      }

      await addPendingMemoryOperation({
        type: "delete",

        memoryId:
          existingMemory?._id ||
          existingMemory?.id ||
          memoryId,

        clientMemoryId,
      });

      if (!isCurrentSession(token)) {
        throw new Error("Your session has ended.");
      }

      await removeLocalMemory(
        existingMemory?.id || memoryId,
        clientMemoryId,
      );

      if (!isCurrentSession(token)) {
        throw new Error("Your session has ended.");
      }

      setMemories((current) => {
        if (!isCurrentSession(token)) {
          return current;
        }

        return current.filter(
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
      });

      await syncPendingMemories();

      if (!isCurrentSession(token)) {
        throw new Error("Your session has ended.");
      }

      return true;
    },
    [
      token,
      memories,
      syncPendingMemories,
      isCurrentSession,
    ],
  );

  const toggleFavorite = useCallback(
    async (memoryId) => {
      if (!token || !isCurrentSession(token)) {
        throw new Error("You must be logged in.");
      }

      const existingMemory = memories.find(
        (memory) =>
          memory.id === memoryId ||
          memory.clientMemoryId === memoryId,
      );

      if (!existingMemory) {
        throw new Error("Memory not found.");
      }

      const nextFavorite =
        !existingMemory.favorite;

      const optimisticMemory = {
        ...existingMemory,
        favorite: nextFavorite,
        isFavorite: nextFavorite,
      };

      const pendingCreates =
        await getPendingMemories();

      if (!isCurrentSession(token)) {
        throw new Error("Your session has ended.");
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

        await upsertLocalMemory(pendingMemory);

        if (!isCurrentSession(token)) {
          throw new Error("Your session has ended.");
        }

        await addPendingMemory(pendingMemory);

        if (!isCurrentSession(token)) {
          throw new Error("Your session has ended.");
        }

        setMemories((current) => {
          if (!isCurrentSession(token)) {
            return current;
          }

          return current.map((memory) =>
            memory.id === memoryId ||
            memory.clientMemoryId === memoryId
              ? pendingMemory
              : memory,
          );
        });

        return pendingMemory;
      }

      const locallyUpdated = {
        ...optimisticMemory,
        hasPendingChanges: true,
        syncStatus: "synced",
      };

      await upsertLocalMemory(locallyUpdated);

      if (!isCurrentSession(token)) {
        throw new Error("Your session has ended.");
      }

      await addPendingMemoryOperation({
        type: "favorite",

        memoryId:
          existingMemory._id ||
          existingMemory.id,

        clientMemoryId:
          existingMemory.clientMemoryId || null,

        favorite: nextFavorite,
      });

      if (!isCurrentSession(token)) {
        throw new Error("Your session has ended.");
      }

      setMemories((current) => {
        if (!isCurrentSession(token)) {
          return current;
        }

        return current.map((memory) =>
          memory.id === memoryId ||
          memory.clientMemoryId === memoryId
            ? locallyUpdated
            : memory,
        );
      });

      await syncPendingMemories();

      if (!isCurrentSession(token)) {
        throw new Error("Your session has ended.");
      }

      return locallyUpdated;
    },
    [
      token,
      memories,
      syncPendingMemories,
      isCurrentSession,
    ],
  );

  const getMemoryById = useCallback(
    (memoryId) =>
      memories.find(
        (memory) =>
          memory.id === memoryId ||
          memory.clientMemoryId === memoryId,
      ),
    [memories],
  );

  const syncNow = useCallback(async () => {
    if (!token || !isCurrentSession(token)) {
      return;
    }

    await syncPendingMemories();
  }, [
    token,
    syncPendingMemories,
    isCurrentSession,
  ]);

  const clearMemories = useCallback(async () => {
    if (!token || !isCurrentSession(token)) {
      throw new Error("You must be logged in.");
    }

    const result = await deleteAllMemoriesApi(token);

    if (!isCurrentSession(token)) {
      throw new Error("Your session has ended.");
    }

    if (!result.success) {
      throw new Error(
        result.message ||
          "Unable to clear memory storage.",
      );
    }

    await clearLocalMemories();

    if (!isCurrentSession(token)) {
      throw new Error("Your session has ended.");
    }

    await clearPendingMemoryOperations();

    if (!isCurrentSession(token)) {
      throw new Error("Your session has ended.");
    }

    const pending = await getPendingMemories();

    if (!isCurrentSession(token)) {
      throw new Error("Your session has ended.");
    }

    await Promise.all(
      pending
        .filter((memory) => memory.clientMemoryId)
        .map((memory) =>
          removePendingMemory(memory.clientMemoryId),
        ),
    );

    if (!isCurrentSession(token)) {
      throw new Error("Your session has ended.");
    }

    setMemories([]);

    return {
      success: true,
      deletedCount:
        result.data?.deletedCount || 0,
    };
  }, [token, isCurrentSession]);

  const contextValue = useMemo(
    () => ({
      memories,
      loading,
      syncing,
      addMemory,
      updateMemory,
      deleteMemory,
      toggleFavorite,
      getMemoryById,
      loadMemories,
      refreshMemories: loadMemories,
      syncNow,
      clearMemories,
    }),
    [
      memories,
      loading,
      syncing,
      addMemory,
      updateMemory,
      deleteMemory,
      toggleFavorite,
      getMemoryById,
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
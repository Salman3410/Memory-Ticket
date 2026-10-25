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

    if (match) {
      return match;
    }
  }

  return null;
};

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

export function MemoryProvider({ children }) {
  const {
    token,
    loading: authLoading,
  } = useAuth();

  const [memories, setMemories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  const syncPromiseRef = useRef(null);
  const syncRequestedRef = useRef(false);

  const preparingMemoryIdsRef = useRef(new Set());
  const cancelledMemoryIdsRef = useRef(new Set());

  const normalizeMemory = useCallback((memory) => {
    if (!memory) {
      return null;
    }

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
                (tag) => typeof tag === "string",
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

    const ticketCustomization =
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

      ticketStyle:
        ticketCustomization.ticketStyle,

      ticketAccent:
        ticketCustomization.ticketAccent,

      ticketOptions: {
        ...ticketCustomization.ticketOptions,
      },

      imagePublicIds: Array.isArray(
        memory.imagePublicIds,
      )
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

          if (!normalized) {
            return null;
          }

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

          if (!normalized) {
            return null;
          }

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
    if (!token) {
      return [];
    }

    try {
      const [
        offlineMemories,
        pendingOperations,
      ] = await Promise.all([
        getOfflineMemories(),
        getPendingMemoryOperations(),
      ]);

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
          const result = normalizeMemory(memory);

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

      setMemories(normalized);

      return normalized;
    } catch (error) {
      console.error(
        "Load local memories error:",
        error,
      );

      return [];
    }
  }, [token, normalizeMemory]);

  const refreshServerMemories = useCallback(async () => {
    if (!token) {
      return false;
    }

    try {
      const result = await getMemoriesApi(token);

      if (!result.success) {
        return false;
      }

      const backendMemories = Array.isArray(
        result.data?.memories,
      )
        ? result.data.memories
        : [];

      const [
        localMemories,
        pendingMemories,
        pendingOperations,
      ] = await Promise.all([
        getLocalMemories(),
        getPendingMemories(),
        getPendingMemoryOperations(),
      ]);

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

      const serverMemoriesWithCachedImages = [];
      const batchSize = 3;

      for (
        let offset = 0;
        offset < visibleServerMemories.length;
        offset += batchSize
      ) {
        const batch =
          visibleServerMemories.slice(
            offset,
            offset + batchSize,
          );

        const cachedBatch = await Promise.all(
          batch.map(async (memory) => {
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

              return {
                ...memory,
                localImages,
              };
            } catch (error) {
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

        serverMemoriesWithCachedImages.push(
          ...cachedBatch,
        );
      }

      const normalizedServer =
        serverMemoriesWithCachedImages
          .map((memory) => {
            const normalized =
              normalizeMemory(memory);

            if (!normalized) {
              return null;
            }

            const local = findMatchingMemory(
              localMap,
              memory,
            );

            const memoryKeys =
              getMemoryKeys(memory);

            const hasQueuedMutation =
              pendingOperations.some(
                (operation) => {
                  if (
                    operation.type === "delete"
                  ) {
                    return false;
                  }

                  const operationKeys = [
                    operation.clientMemoryId,
                    operation.memoryId,
                  ]
                    .filter(Boolean)
                    .map(String);

                  return memoryKeys.some((key) =>
                    operationKeys.includes(key),
                  );
                },
              );

            if (local && hasQueuedMutation) {
              Object.assign(normalized, local, {
                id:
                  normalized.id || local.id,

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

      const merged = mergeMemories(
        serverWithLocalImages,
        localMemories,
        visiblePendingMemories,
      );

      setMemories(merged);

      await upsertLocalMemories(
        serverWithLocalImages.map((memory) => ({
          ...memory,
          syncStatus: "synced",
        })),
      );

      return true;
    } catch (error) {
      console.error(
        "Refresh server memories error:",
        error,
      );

      return false;
    }
  }, [
    token,
    normalizeMemory,
    mergeMemories,
  ]);

  const loadMemories = useCallback(async () => {
    if (!token) {
      setMemories([]);
      setLoading(false);

      return;
    }

    setLoading(true);

    try {
      await loadLocalMemories();

      setLoading(false);

      const network = await getNetworkInfo().catch(
        () => null,
      );

      if (isNetworkOnline(network)) {
        await refreshServerMemories();
      }
    } catch (error) {
      console.error(
        "Load memories error:",
        error,
      );

      setLoading(false);
    }
  }, [
    token,
    loadLocalMemories,
    refreshServerMemories,
  ]);

  const syncMemory = useCallback(
    async (pendingMemory) => {
      if (
        !token ||
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
          const normalizedTags =
            normalizeMemory({
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

        await upsertLocalMemory(syncedMemory);
        await removePendingMemory(clientMemoryId);

        setMemories((current) => {
          const index = current.findIndex(
            (memory) =>
              memory.clientMemoryId ===
                clientMemoryId ||
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
        console.error(
          "Sync memory error:",
          error,
        );

        return null;
      }
    },
    [token, normalizeMemory],
  );

  const syncPendingMutations = useCallback(async () => {
    if (!token) {
      return;
    }

    const operations =
      await getPendingMemoryOperations();

    if (!operations.length) {
      return;
    }

    let localMemories = await getLocalMemories();
    let pendingCreates = await getPendingMemories();

    for (const operation of operations) {
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
        } else if (
          operation.type === "delete"
        ) {
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

        if (!result?.success) {
          console.warn(
            `Memory ${operation.type} sync failed:`,
            result?.message ||
              "Unknown API error.",
          );

          break;
        }

        if (operation.type === "delete") {
          await removeLocalMemory(
            targetMemoryId,
            operation.clientMemoryId || null,
          );

          setMemories((current) =>
            current.filter(
              (memory) =>
                !getMemoryKeys(memory).some(
                  (key) => operationKeys.has(key),
                ),
            ),
          );
        } else {
          const serverMemory =
            result.data?.memory;

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

          await upsertLocalMemory(syncedMemory);

          setMemories((current) => {
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

        await removePendingMemoryOperation(
          operation.operationId,
        );

        localMemories = await getLocalMemories();
        pendingCreates = await getPendingMemories();
      } catch (error) {
        console.error(
          `Sync memory ${operation.type} operation error:`,
          error,
        );

        break;
      }
    }
  }, [token, normalizeMemory]);

  const runSyncQueuePass = useCallback(async () => {
    const network = await getNetworkInfo().catch(
      (error) => {
        console.warn(
          "Unable to check network before sync:",
          error,
        );

        return null;
      },
    );

    if (!isNetworkOnline(network)) {
      return;
    }

    let pending = await getPendingMemories();

    for (const memory of pending) {
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

        const readyMemory = {
          ...memory,

          images: localImages,
          localImages,

          syncReady: true,
          syncStatus: "pending",
        };

        await upsertLocalMemory(readyMemory);
        await addPendingMemory(readyMemory);

        setMemories((current) =>
          current.map((item) =>
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
          ),
        );
      } catch (error) {
        console.warn(
          `Unable to recover images for ${memory.clientMemoryId}:`,
          error,
        );
      }
    }

    pending = await getPendingMemories();

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
      const synced = await syncMemory(pendingMemory);

      if (!synced) {
        break;
      }
    }

    await syncPendingMutations();
  }, [
    token,
    syncMemory,
    syncPendingMutations,
  ]);

  const syncPendingMemories = useCallback(async () => {
    if (!token) {
      return;
    }

    if (syncPromiseRef.current) {
      syncRequestedRef.current = true;
      await syncPromiseRef.current;

      return;
    }

    const activePromise = (async () => {
      setSyncing(true);

      try {
        do {
          syncRequestedRef.current = false;

          await runSyncQueuePass();
        } while (syncRequestedRef.current);
      } catch (error) {
        console.error(
          "Sync pending memories error:",
          error,
        );
      } finally {
        setSyncing(false);
      }
    })();

    syncPromiseRef.current = activePromise;

    try {
      await activePromise;
    } finally {
      if (syncPromiseRef.current === activePromise) {
        syncPromiseRef.current = null;
      }
    }
  }, [token, runSyncQueuePass]);

  useEffect(() => {
    if (authLoading) {
      return;
    }

    loadMemories();
  }, [
    authLoading,
    token,
    loadMemories,
  ]);

  useEffect(() => {
    if (authLoading || !token) {
      return undefined;
    }

    const subscription = addNetworkListener(
      (networkInfo) => {
        if (!isNetworkOnline(networkInfo)) {
          return;
        }

        void (async () => {
          await syncPendingMemories();
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
  ]);

  const addMemory = useCallback(
    async (memory) => {
      if (!token) {
        throw new Error(
          "You must be logged in to create a memory.",
        );
      }

      try {
        const clientMemoryId =
          memory?.clientMemoryId ||
          generateClientMemoryId();

        const networkPromise =
          getNetworkInfo().catch((error) => {
            console.warn(
              "Network info error:",
              error,
            );

            return null;
          });

        const locationPromise = memory?.locationData
          ? Promise.resolve(memory.locationData)
          : getCurrentLocation().catch((error) => {
              console.warn(
                "Location capture failed:",
                error,
              );

              return null;
            });

        const [
          networkResult,
          locationResult,
        ] = await Promise.all([
          networkPromise,
          locationPromise,
        ]);

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

        const ticketCustomization =
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

          ticketStyle:
            ticketCustomization.ticketStyle,

          ticketAccent:
            ticketCustomization.ticketAccent,

          ticketOptions: {
            ...ticketCustomization.ticketOptions,
          },
        };

        const localMemory =
          normalizeMemory(localMemoryData);

        if (!localMemory) {
          throw new Error(
            "Unable to prepare local memory.",
          );
        }

        setMemories((current) => [
          localMemory,
          ...current,
        ]);

        preparingMemoryIdsRef.current.add(
          clientMemoryId,
        );

        try {
          await addPendingMemory(localMemoryData);
          await upsertLocalMemory(localMemoryData);
        } catch (storageError) {
          preparingMemoryIdsRef.current.delete(
            clientMemoryId,
          );

          throw storageError;
        }

        void (async () => {
          try {
            const { localImages } =
              await persistMemoryImages({
                ...localMemoryData,
                images: originalImages,
                clientMemoryId,
              });

            if (
              cancelledMemoryIdsRef.current.has(
                clientMemoryId,
              )
            ) {
              return;
            }

            const currentQueue =
              await getPendingMemories();

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
            await addPendingMemory(persistedMemory);

            setMemories((current) =>
              current.map((item) =>
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
              ),
            );

            await syncPendingMemories();
          } catch (error) {
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
        console.error("Add memory error:", error);

        throw error;
      }
    },
    [
      token,
      normalizeMemory,
      syncPendingMemories,
    ],
  );

  const updateMemory = useCallback(
    async (memoryId, updatedData) => {
      if (!token) {
        throw new Error(
          "You must be logged in.",
        );
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

        ticketStyle:
          customization.ticketStyle,

        ticketAccent:
          customization.ticketAccent,

        ticketOptions: {
          ...customization.ticketOptions,
        },
      };

      const pendingCreates =
        await getPendingMemories();

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

      if (isPendingCreate) {
        await upsertLocalMemory(updatedMemory);
        await addPendingMemory(updatedMemory);
      } else {
        await upsertLocalMemory(updatedMemory);

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

      setMemories((current) =>
        current.map((memory) =>
          memory.id === memoryId ||
          memory.clientMemoryId === memoryId
            ? updatedMemory
            : memory,
        ),
      );

      if (!isPendingCreate) {
        await syncPendingMemories();
      }

      return updatedMemory;
    },
    [
      token,
      memories,
      normalizeMemory,
      syncPendingMemories,
    ],
  );

  const deleteMemory = useCallback(
    async (memoryId) => {
      if (!token) {
        throw new Error(
          "You must be logged in.",
        );
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

      const isPendingCreate = Boolean(
        clientMemoryId &&
          pendingCreates.some(
            (memory) =>
              memory.clientMemoryId === clientMemoryId,
          ),
      );

      if (
        isPendingCreate &&
        !syncPromiseRef.current
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

        await removeLocalMemory(
          existingMemory?.id || memoryId,
          clientMemoryId,
        );

        setMemories((current) =>
          current.filter(
            (memory) =>
              memory.clientMemoryId !==
                clientMemoryId &&
              memory.id !==
                (existingMemory?.id || memoryId),
          ),
        );

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

      await removeLocalMemory(
        existingMemory?.id || memoryId,
        clientMemoryId,
      );

      setMemories((current) =>
        current.filter(
          (memory) =>
            !getMemoryKeys(memory).some(
              (key) =>
                key === String(memoryId) ||
                (
                  clientMemoryId &&
                  key === String(clientMemoryId)
                ),
            ),
        ),
      );

      await syncPendingMemories();

      return true;
    },
    [
      token,
      memories,
      syncPendingMemories,
    ],
  );

  const toggleFavorite = useCallback(
    async (memoryId) => {
      if (!token) {
        throw new Error(
          "You must be logged in.",
        );
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
        await addPendingMemory(pendingMemory);

        setMemories((current) =>
          current.map((memory) =>
            memory.id === memoryId ||
            memory.clientMemoryId === memoryId
              ? pendingMemory
              : memory,
          ),
        );

        return pendingMemory;
      }

      const locallyUpdated = {
        ...optimisticMemory,

        hasPendingChanges: true,
        syncStatus: "synced",
      };

      await upsertLocalMemory(locallyUpdated);

      await addPendingMemoryOperation({
        type: "favorite",

        memoryId:
          existingMemory._id ||
          existingMemory.id,

        clientMemoryId:
          existingMemory.clientMemoryId || null,

        favorite: nextFavorite,
      });

      setMemories((current) =>
        current.map((memory) =>
          memory.id === memoryId ||
          memory.clientMemoryId === memoryId
            ? locallyUpdated
            : memory,
        ),
      );

      await syncPendingMemories();

      return locallyUpdated;
    },
    [
      token,
      memories,
      syncPendingMemories,
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
    await syncPendingMemories();
  }, [syncPendingMemories]);

  const clearMemories = useCallback(async () => {
    if (!token) {
      throw new Error(
        "You must be logged in.",
      );
    }

    const result = await deleteAllMemoriesApi(token);

    if (!result.success) {
      throw new Error(
        result.message ||
          "Unable to clear memory storage.",
      );
    }

    await clearLocalMemories();
    await clearPendingMemoryOperations();

    const pending = await getPendingMemories();

    await Promise.all(
      pending
        .filter((memory) => memory.clientMemoryId)
        .map((memory) =>
          removePendingMemory(
            memory.clientMemoryId,
          ),
        ),
    );

    setMemories([]);

    return {
      success: true,
      deletedCount:
        result.data?.deletedCount || 0,
    };
  }, [token]);

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
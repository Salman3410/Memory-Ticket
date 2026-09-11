import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useAuth } from "../hooks/useAuth";
import { getNetworkInfo, addNetworkListener } from "../services/networkService";
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
  addPendingMemory,
  removePendingMemory,
  getOfflineMemories,
  upsertLocalMemory,
  upsertLocalMemories,
  removeLocalMemory,
  clearLocalMemories,
} from "../services/offlineMemoryService";

export const MemoryContext = createContext(null);

export function MemoryProvider({ children }) {
  const { token, loading: authLoading } = useAuth();

  const [memories, setMemories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  const syncLock = useRef(false);

  const normalizeMemory = useCallback((memory) => {
    if (!memory) {
      return null;
    }

    const images = Array.isArray(memory.images) ? memory.images : [];

    return {
      ...memory,

      id: memory._id || memory.id || memory.clientMemoryId,

      images,

      image: images[0] || null,

      favorite: memory.isFavorite === true,

      locationData: memory.locationData || null,

      environment: {
        network: memory.network || null,
      },

      imagePublicIds: Array.isArray(memory.imagePublicIds)
        ? memory.imagePublicIds
        : [],

      syncStatus: memory.syncStatus || "synced",
    };
  }, []);

  const mergeMemories = useCallback(
    (serverMemories, localMemories, pendingMemories) => {
      const localMap = new Map();

      for (const memory of localMemories) {
        const key = memory.clientMemoryId || memory.id;

        if (key) {
          localMap.set(key, memory);
        }
      }

      const mergedServer = serverMemories
        .map((memory) => {
          const key = memory.clientMemoryId || memory.id;

          const local = localMap.get(key);

          const normalized = normalizeMemory(memory);

          if (local?.localImages?.length) {
            normalized.localImages = local.localImages;
          }

          return normalized;
        })
        .filter(Boolean);

      const serverKeys = new Set(
        mergedServer.map((memory) => memory.clientMemoryId || memory.id),
      );

      const remainingPending = pendingMemories
        .filter((memory) => {
          const key = memory.clientMemoryId || memory.id;

          return !serverKeys.has(key);
        })
        .map((memory) => {
          const normalized = normalizeMemory(memory);

          if (memory.localImages?.length) {
            normalized.images = memory.localImages;

            normalized.image = memory.localImages[0] || null;

            normalized.localImages = memory.localImages;
          }

          return normalized;
        })
        .filter(Boolean);

      return [...remainingPending, ...mergedServer];
    },
    [normalizeMemory],
  );

  const loadLocalMemories = useCallback(async () => {
    if (!token) {
      return [];
    }

    try {
      const offlineMemories = await getOfflineMemories();

      const normalized = offlineMemories
        .map((memory) => {
          const result = normalizeMemory(memory);

          if (result && memory.localImages?.length) {
            result.images = memory.localImages;

            result.image = memory.localImages[0] || null;

            result.localImages = memory.localImages;
          }

          return result;
        })
        .filter(Boolean);

      if (normalized.length) {
        setMemories(normalized);
      }

      return normalized;
    } catch (error) {
      console.error("Load local memories error:", error);

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

    const backendMemories = Array.isArray(result.data?.memories)
      ? result.data.memories
      : [];

    const [localMemories, pendingMemories] = await Promise.all([
      import("../services/offlineMemoryService").then(({ getLocalMemories }) =>
        getLocalMemories(),
      ),

      getPendingMemories(),
    ]);

    const normalizedServer = backendMemories
      .map(normalizeMemory)
      .filter(Boolean);

    const localMemoryMap = new Map();

    for (const memory of localMemories) {
      const key = memory.clientMemoryId || memory.id;

      if (key) {
        localMemoryMap.set(key, memory);
      }
    }

    const serverWithLocalImages = normalizedServer.map((memory) => {
      const key = memory.clientMemoryId || memory.id;

      const local = localMemoryMap.get(key);

      if (local?.localImages?.length) {
        return {
          ...memory,
          localImages: local.localImages,
        };
      }

      return memory;
    });

    const merged = mergeMemories(
      serverWithLocalImages,
      localMemories,
      pendingMemories,
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
    console.error("Refresh server memories error:", error);

    return false;
  }
}, [token, normalizeMemory, mergeMemories]);

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

      const network = await getNetworkInfo();

      const online =
        network.isConnected !== false && network.isInternetReachable !== false;

      if (online) {
        await refreshServerMemories();
      }
    } catch (error) {
      console.error("Load memories error:", error);

      setLoading(false);
    }
  }, [token, loadLocalMemories, refreshServerMemories]);

  const syncMemory = useCallback(
    async (pendingMemory) => {
      if (!token || !pendingMemory) {
        return null;
      }

      try {
        const result = await createMemoryApi(token, pendingMemory);

        if (!result.success) {
          console.error("Memory sync failed:", result.message);

          return null;
        }

        const savedMemory = normalizeMemory(result.data?.memory);

        if (!savedMemory) {
          return null;
        }

        const syncedMemory = {
          ...savedMemory,

          clientMemoryId: pendingMemory.clientMemoryId,

          localImages: pendingMemory.localImages || [],

          syncStatus: "synced",
        };

        await Promise.all([
          removePendingMemory(pendingMemory.clientMemoryId),

          upsertLocalMemory(syncedMemory),
        ]);

        setMemories((currentMemories) =>
          currentMemories.map((memory) =>
            memory.clientMemoryId === pendingMemory.clientMemoryId
              ? syncedMemory
              : memory,
          ),
        );

        return syncedMemory;
      } catch (error) {
        console.error("Sync memory error:", error);

        return null;
      }
    },
    [token, normalizeMemory],
  );

  const syncPendingMemories = useCallback(async () => {
    if (!token || syncLock.current) {
      return;
    }

    try {
      const network = await getNetworkInfo();

      const online =
        network.isConnected !== false && network.isInternetReachable !== false;

      if (!online) {
        return;
      }

      const pending = await getPendingMemories();

      if (!pending.length) {
        return;
      }

      syncLock.current = true;
      setSyncing(true);

      for (const pendingMemory of pending) {
        const synced = await syncMemory(pendingMemory);

        if (!synced) {
          break;
        }
      }
    } catch (error) {
      console.error("Sync pending memories error:", error);
    } finally {
      syncLock.current = false;
      setSyncing(false);
    }
  }, [token, syncMemory]);

  useEffect(() => {
    if (authLoading) {
      return;
    }

    loadMemories();
  }, [authLoading, token, loadMemories]);

  useEffect(() => {
    if (authLoading || !token) {
      return undefined;
    }

    const subscription = addNetworkListener(
      ({ isConnected, isInternetReachable }) => {
        const online = isConnected !== false && isInternetReachable !== false;

        if (online) {
          syncPendingMemories();
          refreshServerMemories();
        }
      },
    );

    syncPendingMemories();

    return () => {
      subscription?.remove?.();
    };
  }, [authLoading, token, syncPendingMemories, refreshServerMemories]);

  const addMemory = useCallback(
    async (memory) => {
      if (!token) {
        throw new Error("You must be logged in to create a memory.");
      }

      try {
        const clientMemoryId =
          memory?.clientMemoryId || generateClientMemoryId();

        // Use already captured location data.
        // Only request GPS when it is actually missing.
        const locationData = memory?.locationData || null;

        const finalLocation =
          typeof memory?.location === "string" ? memory.location.trim() : "";

        const finalNetwork =
          memory?.network || memory?.environment?.network || null;

        const originalImages = Array.isArray(memory?.images)
          ? memory.images.slice(0, 5)
          : memory?.image
            ? [memory.image]
            : [];

        if (!originalImages.length) {
          throw new Error("At least one image is required.");
        }

        // --------------------------------------------------
        // CREATE MEMORY IMMEDIATELY
        // --------------------------------------------------

        const localMemoryData = {
          ...memory,

          clientMemoryId,

          location: finalLocation,

          locationData,

          network: finalNetwork,

          // Use the original image URIs for the
          // immediate UI. They will be permanently
          // persisted in the background.
          images: originalImages,

          localImages: originalImages,

          syncStatus: "pending",
        };

        const localMemory = normalizeMemory(localMemoryData);

        if (!localMemory) {
          throw new Error("Unable to prepare local memory.");
        }

        // --------------------------------------------------
        // SHOW IMMEDIATELY
        // --------------------------------------------------

        setMemories((current) => [localMemory, ...current]);

        // --------------------------------------------------
        // SAVE BASIC DATA
        // --------------------------------------------------

        await Promise.all([
          upsertLocalMemory(localMemoryData),
          addPendingMemory(localMemoryData),
        ]);

        // --------------------------------------------------
        // BACKGROUND IMAGE PERSISTENCE + SYNC
        // --------------------------------------------------

        (async () => {
          try {
            const { localImages } = await persistMemoryImages({
              ...memory,
              clientMemoryId,
            });

            const persistedMemory = {
              ...localMemoryData,

              images: localImages,

              localImages,

              syncStatus: "pending",
            };

            // Update local storage with permanent
            // image paths.
            await Promise.all([
              upsertLocalMemory(persistedMemory),
              addPendingMemory(persistedMemory),
            ]);

            // Update currently displayed memory
            // without blocking the UI.
            setMemories((currentMemories) =>
              currentMemories.map((item) =>
                item.clientMemoryId === clientMemoryId
                  ? {
                      ...item,
                      images: localImages,
                      image: localImages[0] || null,
                      localImages,
                      syncStatus: "pending",
                    }
                  : item,
              ),
            );

            // Sync only after permanent local
            // image files are ready.
            const network = await getNetworkInfo();

            const online =
              network.isConnected !== false &&
              network.isInternetReachable !== false;

            if (online) {
              await syncMemory({
                ...persistedMemory,
                images: localImages,
                localImages,
              });
            }
          } catch (error) {
            console.error("Background memory preparation failed:", error);
          }
        })();

        // --------------------------------------------------
        // RETURN IMMEDIATELY
        // --------------------------------------------------

        return localMemory;
      } catch (error) {
        console.error("Add memory error:", error);

        throw error;
      }
    },
    [token, normalizeMemory, syncMemory],
  );

  const updateMemory = useCallback(
    async (memoryId, updatedData) => {
      if (!token) {
        throw new Error("You must be logged in.");
      }

      if (!memoryId) {
        throw new Error("Memory ID is required.");
      }

      const existingMemory = memories.find(
        (memory) =>
          memory.id === memoryId || memory.clientMemoryId === memoryId,
      );

      if (!existingMemory) {
        throw new Error("Memory not found.");
      }

      const result = await updateMemoryApi(token, memoryId, updatedData);

      if (!result.success) {
        throw new Error(result.message || "Unable to update memory.");
      }

      const updatedMemory = normalizeMemory(result.data?.memory);

      if (!updatedMemory) {
        throw new Error("Server returned invalid memory data.");
      }

      setMemories((currentMemories) =>
        currentMemories.map((memory) =>
          memory.id === memoryId
            ? {
                ...updatedMemory,
                localImages: memory.localImages || [],
              }
            : memory,
        ),
      );

      await upsertLocalMemory({
        ...updatedMemory,
        localImages: existingMemory.localImages || [],
      });

      return updatedMemory;
    },
    [token, memories, normalizeMemory],
  );

  const deleteMemory = useCallback(
    async (memoryId) => {
      if (!token) {
        throw new Error("You must be logged in.");
      }

      if (!memoryId) {
        throw new Error("Memory ID is required.");
      }

      const existingMemory = memories.find(
        (memory) =>
          memory.id === memoryId || memory.clientMemoryId === memoryId,
      );

      if (
        existingMemory?.syncStatus === "pending" &&
        existingMemory.clientMemoryId
      ) {
        await Promise.all([
          removePendingMemory(existingMemory.clientMemoryId),

          removeLocalMemory(null, existingMemory.clientMemoryId),
        ]);

        setMemories((currentMemories) =>
          currentMemories.filter(
            (memory) => memory.clientMemoryId !== existingMemory.clientMemoryId,
          ),
        );

        return true;
      }

      const result = await deleteMemoryApi(token, memoryId);

      if (!result.success) {
        throw new Error(result.message || "Unable to delete memory.");
      }

      setMemories((currentMemories) =>
        currentMemories.filter((memory) => memory.id !== memoryId),
      );

      await removeLocalMemory(memoryId);

      return true;
    },
    [token, memories],
  );

  const toggleFavorite = useCallback(
    async (memoryId) => {
      if (!token) {
        throw new Error("You must be logged in.");
      }

      const existingMemory = memories.find(
        (memory) =>
          memory.id === memoryId || memory.clientMemoryId === memoryId,
      );

      if (!existingMemory) {
        throw new Error("Memory not found.");
      }

      const nextFavorite = !existingMemory.favorite;

      const optimisticMemory = {
        ...existingMemory,

        favorite: nextFavorite,

        isFavorite: nextFavorite,
      };

      // Immediate UI update.
      setMemories((currentMemories) =>
        currentMemories.map((memory) =>
          memory.id === memoryId || memory.clientMemoryId === memoryId
            ? optimisticMemory
            : memory,
        ),
      );

      if (existingMemory.syncStatus === "pending") {
        const pendingMemory = {
          ...optimisticMemory,
          syncStatus: "pending",
        };

        await Promise.all([
          upsertLocalMemory(pendingMemory),

          addPendingMemory(pendingMemory),
        ]);

        return pendingMemory;
      }

      try {
        await upsertLocalMemory(optimisticMemory);
      } catch (error) {
        console.error("Local favorite save error:", error);
      }

      try {
        const result = await toggleFavoriteApi(token, memoryId);

        if (!result.success) {
          throw new Error(result.message || "Unable to update favorite.");
        }

        const updatedMemory = normalizeMemory(result.data?.memory);

        if (!updatedMemory) {
          throw new Error("Server returned invalid memory data.");
        }

        const finalMemory = {
          ...updatedMemory,

          localImages: existingMemory.localImages || [],

          syncStatus: "synced",
        };

        setMemories((currentMemories) =>
          currentMemories.map((memory) =>
            memory.id === memoryId || memory.clientMemoryId === memoryId
              ? finalMemory
              : memory,
          ),
        );

        await upsertLocalMemory(finalMemory);

        return finalMemory;
      } catch (error) {
        console.error("Favorite sync error:", error);

        const rollbackMemory = {
          ...existingMemory,

          favorite: existingMemory.favorite,

          isFavorite: existingMemory.favorite,

          syncStatus: existingMemory.syncStatus || "synced",
        };

        setMemories((currentMemories) =>
          currentMemories.map((memory) =>
            memory.id === memoryId || memory.clientMemoryId === memoryId
              ? rollbackMemory
              : memory,
          ),
        );

        try {
          await upsertLocalMemory(rollbackMemory);
        } catch (storageError) {
          console.error("Favorite rollback storage error:", storageError);
        }

        throw error;
      }
    },
    [token, memories, normalizeMemory],
  );

  const getMemoryById = useCallback(
    (memoryId) => {
      return memories.find(
        (memory) =>
          memory.id === memoryId || memory.clientMemoryId === memoryId,
      );
    },
    [memories],
  );

  const syncNow = useCallback(async () => {
    await syncPendingMemories();
  }, [syncPendingMemories]);

  const clearMemories = useCallback(async () => {
    if (!token) {
      throw new Error("You must be logged in.");
    }

    const result = await deleteAllMemoriesApi(token);

    if (!result.success) {
      throw new Error(result.message || "Unable to clear memory storage.");
    }

    await Promise.all([
      clearLocalMemories(),

      (async () => {
        const pending = await getPendingMemories();

        if (!pending.length) {
          return;
        }

        await Promise.all(
          pending
            .filter((memory) => memory.clientMemoryId)
            .map((memory) => removePendingMemory(memory.clientMemoryId)),
        );
      })(),
    ]);

    setMemories([]);

    return {
      success: true,
      deletedCount: result.data?.deletedCount || 0,
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
